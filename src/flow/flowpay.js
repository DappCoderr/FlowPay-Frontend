import * as fcl from '@onflow/fcl'
import '../flow/fclConfig'

// NOTE: In a production app you would likely load these Cadence files
// from separate .cdc sources or env-configured strings. For this demo
// we inline the code to keep the wiring explicit and easy to follow.

// --- Transactions -----------------------------------------------------------

const TX_SETUP_FLOWPAY_ACCOUNT = `
  import "FlowPay"
  import "FlowPayTransactionHandler"
  import "FlowTransactionSchedulerUtils"

  transaction() {
      prepare(signer: auth(Storage, Capabilities) &Account) {

          if signer.storage.borrow<&AnyResource>(from: FlowPay.ScheduleStoragePath) == nil {
              let collection <- FlowPay.createScheduleCollection()
              signer.storage.save(<-collection, to: FlowPay.ScheduleStoragePath)

              let publicCap = signer.capabilities.storage
                  .issue<&{FlowPay.ScheduleCollectionPublic}>(FlowPay.ScheduleStoragePath)
              signer.capabilities.publish(publicCap, at: FlowPay.SchedulePublicPath)
          }

          let execCap = signer.capabilities.storage
              .issue<auth(FlowPay.Execute) &FlowPay.ScheduleCollection>(FlowPay.ScheduleStoragePath)

          FlowPayTransactionHandler.registerExecuteCapability(
              creator: signer.address,
              cap:     execCap
          )

          if !signer.storage.check<@{FlowTransactionSchedulerUtils.Manager}>(
              from: FlowTransactionSchedulerUtils.managerStoragePath
          ) {
              let manager <- FlowTransactionSchedulerUtils.createManager()
              signer.storage.save(<-manager, to: FlowTransactionSchedulerUtils.managerStoragePath)

              let managerCap = signer.capabilities.storage
                  .issue<&{FlowTransactionSchedulerUtils.Manager}>(
                      FlowTransactionSchedulerUtils.managerStoragePath
                  )
              signer.capabilities.publish(managerCap, at: FlowTransactionSchedulerUtils.managerPublicPath)
          }
      }

      execute {
          log("FlowPay account setup complete")
      }
  }
`

const TX_CREATE_FLOWPAY_SCHEDULE = `
  import "FlowPay"
  import "FlowPayTransactionHandler"
  import "FlowTransactionScheduler"
  import "FlowTransactionSchedulerUtils"
  import "FlowToken"
  import "FungibleToken"

  transaction(
      recipientAddresses: [Address],
      recipientAmounts:   [UFix64],
      intervalSeconds:   UFix64,
      totalPayouts:      UInt64,
      label:             String,
      delayFirstPayout:  UFix64
  ) {
      prepare(signer: auth(Storage, Capabilities) &Account) {

          pre {
              recipientAddresses.length == recipientAmounts.length
                  : "recipientAddresses and recipientAmounts must have same length"
              recipientAddresses.length > 0 : "Must have at least 1 recipient"
          }

          var recipients: [FlowPay.RecipientEntry] = []
          var totalPerPayout: UFix64 = 0.0
          var i = 0
          while i < recipientAddresses.length {
              recipients.append(
                  FlowPay.RecipientEntry(
                      address: recipientAddresses[i],
                      amount:  recipientAmounts[i]
                  )
              )
              totalPerPayout = totalPerPayout + recipientAmounts[i]
              i = i + 1
          }

          let totalDeposit = totalPerPayout * UFix64(totalPayouts)

          let collection = signer.storage
              .borrow<&FlowPay.ScheduleCollection>(from: FlowPay.ScheduleStoragePath)
              ?? panic("ScheduleCollection not found. Run SetupFlowPayAccount first.")

          let vaultRef = signer.storage
              .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
              ?? panic("Could not borrow signer's FlowToken vault")

          let escrow <- vaultRef.withdraw(amount: totalDeposit) as! @FlowToken.Vault

          let schedule <- FlowPay.createSchedule(
              creator:         signer.address,
              recipients:      recipients,
              intervalSeconds: intervalSeconds,
              totalPayouts:    totalPayouts,
              label:           label,
              funds:           <-escrow
          )

          let scheduleId = schedule.id

          collection.addSchedule(schedule: <-schedule)

          let future = getCurrentBlock().timestamp + delayFirstPayout

          let callData = FlowPayTransactionHandler.PayoutCallData(
              creatorAddress: signer.address,
              scheduleId:     scheduleId
          )

          let est = FlowTransactionScheduler.estimate(
              data:            callData,
              timestamp:       future,
              priority:        FlowTransactionScheduler.Priority.Medium,
              executionEffort: 2000
          )

          assert(
              est.timestamp != nil || FlowTransactionScheduler.Priority.Medium == FlowTransactionScheduler.Priority.Low,
              message: est.error ?? "Scheduler estimation failed"
          )

          let feeVaultRef = signer.storage
              .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
              ?? panic("Could not borrow signer's FlowToken vault for fees")

          let fees <- feeVaultRef.withdraw(amount: est.flowFee ?? 0.0) as! @FlowToken.Vault

          let manager = signer.storage
              .borrow<auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}>(
                  from: FlowTransactionSchedulerUtils.managerStoragePath
              ) ?? panic("Manager not found. Run SetupFlowPayAccount first.")

          let freshHandlerCap = signer.capabilities.storage
              .issue<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>(
                  FlowPayTransactionHandler.HandlerStoragePath
              )

          manager.schedule(
              handlerCap:      freshHandlerCap,
              data:            callData,
              timestamp:       future,
              priority:        FlowTransactionScheduler.Priority.Medium,
              executionEffort: 2000,
              fees:            <-fees
          )

          log("FlowPay schedule #".concat(scheduleId.toString()).concat(" created. First payout at: ").concat(future.toString()))
      }
  }
`

const TX_PAUSE_SCHEDULE = `
  import "FlowPay"

  transaction(scheduleId: UInt64) {
      prepare(signer: auth(Storage) &Account) {
          let collection = signer.storage
              .borrow<auth(FlowPay.Owner) &FlowPay.ScheduleCollection>(from: FlowPay.ScheduleStoragePath)
              ?? panic("ScheduleCollection not found")

          collection.pause(id: scheduleId)
      }
  }
`

const TX_RESUME_SCHEDULE = `
  import "FlowPay"

  transaction(scheduleId: UInt64) {
      prepare(signer: auth(Storage) &Account) {
          let collection = signer.storage
              .borrow<auth(FlowPay.Owner) &FlowPay.ScheduleCollection>(from: FlowPay.ScheduleStoragePath)
              ?? panic("ScheduleCollection not found")

          collection.resume(id: scheduleId)
      }
  }
`

const TX_CANCEL_SCHEDULE = `
  import "FlowPay"
  import "FlowToken"
  import "FungibleToken"

  transaction(scheduleId: UInt64) {
      prepare(signer: auth(Storage) &Account) {
          let collection = signer.storage
              .borrow<auth(FlowPay.Owner) &FlowPay.ScheduleCollection>(from: FlowPay.ScheduleStoragePath)
              ?? panic("ScheduleCollection not found")

          let vaultRef = signer.storage
              .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
              ?? panic("Could not borrow signer's FlowToken vault")

          collection.cancel(id: scheduleId, creatorVaultRef: vaultRef)
      }
  }
`

const TX_TOPUP_SCHEDULE = `
  import "FlowPay"
  import "FlowToken"
  import "FungibleToken"

  transaction(scheduleId: UInt64, amount: UFix64) {
      prepare(signer: auth(Storage) &Account) {
          let vaultRef = signer.storage
              .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
              ?? panic("Could not borrow signer's FlowToken vault")

          let funds <- vaultRef.withdraw(amount: amount) as! @FlowToken.Vault

          let collection = signer.storage
              .borrow<&FlowPay.ScheduleCollection>(from: FlowPay.ScheduleStoragePath)
              ?? panic("ScheduleCollection not found")

          collection.topUp(id: scheduleId, funds: <-funds)
      }
  }
`

// --- Scripts ---------------------------------------------------------------

const SCRIPT_GET_ALL_SCHEDULES_FOR_USER = `
  import "FlowPay"

  access(all) fun main(creatorAddress: Address): [FlowPay.ScheduleInfo] {
      let account = getAccount(creatorAddress)
      let cap = account.capabilities.get<&{FlowPay.ScheduleCollectionPublic}>(FlowPay.SchedulePublicPath)
          ?? panic("User has no FlowPay ScheduleCollection capability")
      let collection = cap.borrow() ?? panic("Could not borrow ScheduleCollection")
      let ids = collection.getIDs()
      let result: [FlowPay.ScheduleInfo] = []
      for id in ids {
          if let info = collection.getScheduleInfo(id: id) {
              result.append(info)
          }
      }
      return result
  }
`

const SCRIPT_GET_DUE_SCHEDULE_IDS = `
  import "FlowPay"

  access(all) fun main(creatorAddress: Address): [UInt64] {
      let account = getAccount(creatorAddress)
      let cap = account.capabilities.get<&{FlowPay.ScheduleCollectionPublic}>(FlowPay.SchedulePublicPath)
          ?? panic("User has no FlowPay ScheduleCollection capability")
      let collection = cap.borrow() ?? panic("Could not borrow ScheduleCollection")
      return collection.getDueIDs()
  }
`

const SCRIPT_GET_STATS = `
  import "FlowPay"

  access(all) struct FlowPayStats {
      access(all) let totalSchedulesCreated: UInt64
      access(all) let totalPayoutsExecuted:  UInt64

      init(totalSchedulesCreated: UInt64, totalPayoutsExecuted: UInt64) {
          self.totalSchedulesCreated = totalSchedulesCreated
          self.totalPayoutsExecuted  = totalPayoutsExecuted
      }
  }

  access(all) fun main(): FlowPayStats {
      return FlowPayStats(
          totalSchedulesCreated: FlowPay.totalSchedulesCreated,
          totalPayoutsExecuted:  FlowPay.totalPayoutsExecuted
      )
  }
`

// --- Public JS helpers -----------------------------------------------------

export async function setupFlowPayAccount(onStatus) {
  try {
    onStatus?.('preparing')
    const txId = await fcl.mutate({
      cadence: TX_SETUP_FLOWPAY_ACCOUNT,
      args: () => [],
      proposer: fcl.currentUser().authorization,
      payer: fcl.currentUser().authorization,
      authorizations: [fcl.currentUser().authorization],
      limit: 9999,
    })

    onStatus?.('submitting')

    const unsub = fcl.tx(txId).subscribe((tx) => {
      if (tx?.status === 1) onStatus?.('pending')
      if (tx?.status === 4) onStatus?.('sealed')
    })

    const sealed = await fcl.tx(txId).onceSealed()
    unsub && unsub()

    if (sealed?.errorMessage) {
      const msg = sealed.errorMessage
      let friendly = msg
      if (msg.includes("Could not borrow signer's FlowToken vault")) {
        friendly = 'Missing FlowToken vault: deposit FLOW and create a vault in your account.'
      }
      throw new Error(friendly)
    }

    return sealed
  } catch (err) {
    throw err instanceof Error ? err : new Error(String(err))
  }
}

export async function createFlowPaySchedule({
  recipients,
  intervalSeconds,
  totalPayouts,
  label,
  delayFirstPayout,
}, onStatus) {
  try {
    onStatus?.('preparing')

    const addresses = recipients.map((r) => r.address)
    const amounts = recipients.map((r) => r.amount)

    const txId = await fcl.mutate({
      cadence: TX_CREATE_FLOWPAY_SCHEDULE,
      args: () => [
        fcl.arg(addresses, fcl.t.Array(fcl.t.Address)),
        fcl.arg(amounts, fcl.t.Array(fcl.t.UFix64)),
        fcl.arg(intervalSeconds, fcl.t.UFix64),
        fcl.arg(totalPayouts, fcl.t.UInt64),
        fcl.arg(label, fcl.t.String),
        fcl.arg(delayFirstPayout, fcl.t.UFix64),
      ],
      proposer: fcl.currentUser().authorization,
      payer: fcl.currentUser().authorization,
      authorizations: [fcl.currentUser().authorization],
      limit: 9999,
    })

    onStatus?.('submitting')

    const unsub = fcl.tx(txId).subscribe((tx) => {
      if (tx?.status === 1) onStatus?.('pending')
      if (tx?.status === 4) onStatus?.('sealed')
    })

    const sealed = await fcl.tx(txId).onceSealed()
    unsub && unsub()

    if (sealed?.errorMessage) {
      const msg = sealed.errorMessage
      let friendly = msg
      if (msg.includes('Scheduler estimation failed') || msg.includes('estimation failed')) {
        friendly = 'Scheduler estimation failed: check scheduled time, fees, and account manager setup.'
      } else if (msg.includes("Could not borrow signer's FlowToken vault")) {
        friendly = 'Missing FlowToken vault: deposit FLOW and create a vault in your account.'
      } else if (msg.includes('ScheduleCollection not found')) {
        friendly = 'FlowPay collection not found: run account setup first.'
      }
      throw new Error(friendly)
    }

    return sealed
  } catch (err) {
    throw err instanceof Error ? err : new Error(String(err))
  }
}

export async function pauseFlowPaySchedule(scheduleId) {
  const txId = await fcl.mutate({
    cadence: TX_PAUSE_SCHEDULE,
    args: () => [fcl.arg(String(scheduleId), fcl.t.UInt64)],
    proposer: fcl.currentUser().authorization,
    payer: fcl.currentUser().authorization,
    authorizations: [fcl.currentUser().authorization],
    limit: 9999,
  })
  return fcl.tx(txId).onceSealed()
}

export async function resumeFlowPaySchedule(scheduleId) {
  const txId = await fcl.mutate({
    cadence: TX_RESUME_SCHEDULE,
    args: () => [fcl.arg(String(scheduleId), fcl.t.UInt64)],
    proposer: fcl.currentUser().authorization,
    payer: fcl.currentUser().authorization,
    authorizations: [fcl.currentUser().authorization],
    limit: 9999,
  })
  return fcl.tx(txId).onceSealed()
}

export async function cancelFlowPaySchedule(scheduleId) {
  const txId = await fcl.mutate({
    cadence: TX_CANCEL_SCHEDULE,
    args: () => [fcl.arg(String(scheduleId), fcl.t.UInt64)],
    proposer: fcl.currentUser().authorization,
    payer: fcl.currentUser().authorization,
    authorizations: [fcl.currentUser().authorization],
    limit: 9999,
  })
  return fcl.tx(txId).onceSealed()
}

export async function topUpFlowPaySchedule(scheduleId, amountUFix64) {
  const txId = await fcl.mutate({
    cadence: TX_TOPUP_SCHEDULE,
    args: () => [
      fcl.arg(String(scheduleId), fcl.t.UInt64),
      fcl.arg(amountUFix64, fcl.t.UFix64),
    ],
    proposer: fcl.currentUser().authorization,
    payer: fcl.currentUser().authorization,
    authorizations: [fcl.currentUser().authorization],
    limit: 9999,
  })
  return fcl.tx(txId).onceSealed()
}

export async function getAllSchedulesForUser(address) {
  return fcl.query({
    cadence: SCRIPT_GET_ALL_SCHEDULES_FOR_USER,
    args: () => [fcl.arg(address, fcl.t.Address)],
  })
}

export async function getDueScheduleIds(address) {
  return fcl.query({
    cadence: SCRIPT_GET_DUE_SCHEDULE_IDS,
    args: () => [fcl.arg(address, fcl.t.Address)],
  })
}

export async function getFlowPayStats() {
  return fcl.query({
    cadence: SCRIPT_GET_STATS,
    args: () => [],
  })
}


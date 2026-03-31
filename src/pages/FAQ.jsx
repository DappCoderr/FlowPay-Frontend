import { Card } from '@/components/molecules';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQs = [
  {
    question: 'What is FlowPay?',
    answer:
      'FlowPay is a subscription payment layer built on the Flow blockchain. It enables developers and users to set up automated, recurring FLOW token transfers without the need for manual reconciliation or recurring failed payments.',
  },
  {
    question: 'How do payment streams work?',
    answer:
      "A payment stream is an automated recurring payment from a creator to one or more recipients. You specify the amount, recipients, frequency (one-time, weekly, monthly), and the stream is automatically executed at scheduled times via Flow's transaction scheduler.",
  },
  {
    question: 'What are the key components of a stream?',
    answer:
      'Each stream includes: (1) Recipients - addresses receiving payments, (2) Amounts - FLOW tokens per recipient per cycle, (3) Frequency - one-time, weekly, or monthly execution, (4) Total Rounds - how many times the payment cycles, (5) Escrow - locked tokens ensuring guaranteed payouts.',
  },
  {
    question: 'How do I create a payment stream?',
    answer:
      'Connect your wallet on the home page, click "Create Stream", fill in recipient addresses and amounts, select the frequency and number of rounds, review the escrow amount, and confirm the transaction. Your stream will be scheduled automatically.',
  },
  {
    question: 'What is escrow and how is it calculated?',
    answer:
      "Escrow is the total FLOW locked in the contract to guarantee all payouts. It's calculated as: (Sum of all recipient amounts + 1% platform fee) × number of rounds. This ensures recipients always get paid, even if the creator's wallet runs low.",
  },
  {
    question: 'Can I cancel a stream?',
    answer:
      'Yes! You can cancel any active stream. When cancelled, all remaining escrow (unspent funds) is returned to your wallet. Already-executed payouts to recipients are permanent.',
  },
  {
    question: "What happens if I don't have enough FLOW?",
    answer:
      "The payment stream will fail if you don't have sufficient balance to cover the full escrow amount. FlowPay will show you the exact amount needed before creating the stream.",
  },
  {
    question: 'Is there a platform fee?',
    answer:
      'Yes, FlowPay charges 1% of the total payout amount per cycle as a platform fee. This is included in the escrow calculation and covers transaction costs and smart contract maintenance.',
  },
  {
    question: 'How do I view analytics for my streams?',
    answer:
      'On the Home page, the "Creator Analytics" section shows: total streams created, active streams, executed payouts, cancelled streams, total FLOW scheduled, total FLOW distributed, total fees paid, and pending payouts.',
  },
  {
    question: 'What are the limits for payment streams?',
    answer:
      'You can have up to 100 recipients per stream, up to 18,446,744,073,709,551,615 total rounds, and amounts up to 9,223,372,036.854775807 FLOW per recipient per cycle (standard Flow UFix64 limits).',
  },
  {
    question: 'How long does it take for payments to execute?',
    answer:
      'Payments execute based on your chosen frequency at scheduled times. The Flow blockchain processes transactions in seconds, and you can see the execution status on your dashboard.',
  },
  {
    question: 'What if a recipient address is invalid?',
    answer:
      'FlowPay validates all addresses before creating a stream. If an address is invalid, you\'ll get an error message and the stream won\'t be created. Double-check Flow addresses start with "0x".',
  },
  {
    question: 'Can I edit a stream after creating it?',
    answer:
      "Currently, you cannot edit streams. To change payment details, you'll need to cancel the existing stream and create a new one. Remaining escrow will be refunded.",
  },
  {
    question: 'How do I connect my Flow wallet?',
    answer:
      'Click the "Connect Wallet" button on the landing page. You\'ll be prompted to select your Flow wallet provider (Blocto, Dapper, etc.) and authorize FlowPay to access and manage transactions.',
  },
  {
    question: 'Is my wallet private key safe?',
    answer:
      "Yes. FlowPay uses FCL (Flow Client Library) which is the official Flow authentication standard. Your private keys never leave your wallet provider's secure environment.",
  },
  {
    question: 'Can I use FlowPay for business subscriptions?',
    answer:
      'Absolutely! FlowPay is perfect for: freelance payments, SaaS subscriptions, salary payouts, dao treasury distributions, marketplace vendor payouts, and any recurring token transfer scenario.',
  },
  {
    question: 'What happens if the Flow network goes down?',
    answer:
      'Your streams are stored on-chain. If Flow temporarily goes down, scheduled payments will execute once the network recovers. All transactions are permanent and immutable.',
  },
  {
    question: 'Can I test FlowPay before going live?',
    answer:
      'Yes! FlowPay is currently running on Flow Testnet. Use testnet FLOW tokens (free from the faucet) to test streams risk-free before running on mainnet.',
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden transition-colors hover:border-white/20">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <h3 className="text-base font-semibold text-white">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-white/60 transition-transform flex-shrink-0 ml-4 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
          <p className="text-white/80 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header Section */}
      <div className="col-span-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-3xl">
          Everything you need to know about FlowPay payment streams.
        </p>
      </div>

      {/* Getting Started Card */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12">
          <Card
            title="Getting Started"
            className="bg-linear-to-br from-cyan-500/5 to-white/0 border border-cyan-500/20 shadow-lg"
          >
            <div className="space-y-4 text-white/80 text-sm md:text-base">
              <p>
                FlowPay makes recurring payments on Flow simple and reliable.
                Whether you're paying freelancers, managing subscriptions, or
                distributing DAO funds, FlowPay handles the automation so you don't
                have to.
              </p>
              <p>
                Start by connecting your wallet, then create a stream with your
                recipient list and payment details. That's it!
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 space-y-3">
          {FAQs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 lg:col-span-8 lg:col-start-3">
          <Card
            title="Still have questions?"
            className="bg-linear-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
          >
            <div className="space-y-3 text-white/80 text-sm md:text-base">
              <p>
                Check our documentation or reach out to the FlowPay community on
                Flow Discord. We're here to help!
              </p>
              <p className="text-xs md:text-sm text-white/60">
                FlowPay is an open-source project. Contributions and feedback are
                welcome on GitHub.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

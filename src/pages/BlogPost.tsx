import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Twitter, Linkedin, Link as LinkIcon, Check, ArrowLeft, Calendar, Tag, Clock } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import TableOfContents from '../components/TableOfContents'
import RelatedArticles from '../components/RelatedArticles'

/* ─────────────── data ─────────────── */

const tocItems = [
  { id: 'revolutionizing', text: 'Revolutionizing Strategy Design with Modularity and Flexibility', level: 2 },
  { id: 'key-features', text: 'Key Features', level: 3 },
  { id: 'architectural-breakdown', text: 'Architectural Breakdown: The Building Blocks of V2 Strategies', level: 2 },
  { id: 'performance', text: 'Performance of V2 Strategies in Live Trading', level: 2 },
  { id: 'botcamp', text: 'Mastering V2 Strategies: Join Botcamp', level: 2 },
]

const pythonCode = `from hummingbot.strategy_v2.controllers import MarketMakingController

config = MarketMakingController.config_map(
    connector_name="binance",
    trading_pair="ETH-USDT",
    buy_spread=0.001,
    sell_spread=0.001,
    order_amount=0.1
)`

const performanceData = [
  { strategy: 'Pure Market Making', pair: 'BTC-USDT', period: '30d', sharpe: '2.34', pnl: '+4.2%' },
  { strategy: 'Bollinger Bands', pair: 'ETH-USDT', period: '30d', sharpe: '1.89', pnl: '+3.1%' },
  { strategy: 'Arbitrage', pair: 'BTC-USDC', period: '30d', sharpe: '3.12', pnl: '+2.8%' },
]

const tags = ['V2', 'Strategies', 'Framework', 'Botcamp']

/* ─────────────── share helpers ─────────────── */

function getShareUrl() {
  return typeof window !== 'undefined' ? window.location.href : ''
}

function ShareButtons() {
  const [copied, setCopied] = useState(false)
  const url = getShareUrl()
  const text = 'Introducing V2 Strategies — Hummingbot'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex items-center gap-3 mt-4 mb-10">
      <span className="text-[14px] text-[#6B7280]">Share this article:</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-md text-[#6B7280] hover:text-[#0097A7] hover:bg-[#E0F4F5] transition-colors duration-150"
        aria-label="Share on Twitter"
      >
        <Twitter size={18} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-md text-[#6B7280] hover:text-[#0097A7] hover:bg-[#E0F4F5] transition-colors duration-150"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </a>
      <button
        onClick={handleCopy}
        className="p-2 rounded-md text-[#6B7280] hover:text-[#0097A7] hover:bg-[#E0F4F5] transition-colors duration-150"
        aria-label="Copy link"
      >
        {copied ? <Check size={18} className="text-[#10B981]" /> : <LinkIcon size={18} />}
      </button>
      {copied && (
        <span className="text-[12px] text-[#10B981] font-medium">Copied!</span>
      )}
    </div>
  )
}

/* ─────────────── Author sidebar (mobile + desktop) ─────────────── */

function AuthorSidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="lg:sticky lg:top-[84px] lg:self-start"
    >
      {/* Back link */}
      <Link
        to="/docs"
        className="group inline-flex items-center gap-2 text-[14px] font-medium text-[#6B7280] hover:text-[#0097A7] transition-colors duration-150 mb-6"
      >
        <ArrowLeft
          size={16}
          className="transition-transform duration-150 group-hover:-translate-x-[3px]"
        />
        Back to index
      </Link>

      {/* Author info */}
      <div className="mb-4">
        <img
          src="/avatar-michael.png"
          alt="Michael Feng"
          className="w-16 h-16 rounded-full border-2 border-[#E5E7EB] object-cover"
        />
        <h3 className="text-[16px] font-semibold text-[#1F2937] mt-3">Michael Feng</h3>
        <p className="text-[13px] text-[#6B7280]">Co-founder</p>
        <p className="text-[13px] text-[#9CA3AF]">Hummingbot</p>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E5E7EB] my-4" />

      {/* Metadata */}
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] mb-3">
          Metadata
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[13px] text-[#6B7280]">
            <Calendar size={14} className="shrink-0" />
            <span>November 29, 2023</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#6B7280]">
            <Tag size={14} className="shrink-0" />
            <span>
              in{' '}
              <Link to="/docs" className="text-[#0097A7] hover:text-[#007A87]">
                Announcements
              </Link>
              ,{' '}
              <Link to="/docs" className="text-[#0097A7] hover:text-[#007A87]">
                Engineering
              </Link>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#6B7280]">
            <Clock size={14} className="shrink-0" />
            <span>3 min read</span>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

/* ─────────────── scroll-reveal wrapper ─────────────── */

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────── main page ─────────────── */

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const mainRef = useRef<HTMLDivElement>(null)

  // Ensure scroll to top on slug change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  return (
    <div>
      {/* ── Article Layout ── */}
      <div className="mx-auto max-w-content px-6 pt-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_260px] gap-8">
          {/* Left sidebar — hidden on tablet, shown on desktop */}
          <div className="hidden lg:block lg:border-r lg:border-[#E5E7EB] lg:pr-6">
            <AuthorSidebar />
          </div>

          {/* Mobile metadata bar + article */}
          <div className="min-w-0">
            {/* Mobile/tablet: horizontal metadata bar */}
            <div className="lg:hidden mb-6 pb-6 border-b border-[#E5E7EB]">
              <Link
                to="/docs"
                className="group inline-flex items-center gap-2 text-[14px] font-medium text-[#6B7280] hover:text-[#0097A7] transition-colors duration-150 mb-4"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform duration-150 group-hover:-translate-x-[3px]"
                />
                Back to index
              </Link>
              <div className="flex items-center gap-3 flex-wrap">
                <img
                  src="/avatar-michael.png"
                  alt="Michael Feng"
                  className="w-10 h-10 rounded-full border-2 border-[#E5E7EB] object-cover"
                />
                <div>
                  <p className="text-[14px] font-semibold text-[#1F2937]">Michael Feng</p>
                  <p className="text-[12px] text-[#6B7280]">Co-founder · Hummingbot</p>
                </div>
                <span className="text-[12px] text-[#9CA3AF] ml-auto">November 29, 2023 · 3 min read</span>
              </div>
            </div>

            {/* Article Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
              className="text-[36px] font-semibold text-[#0097A7] leading-[1.2] tracking-[-0.02em] mb-6"
            >
              Introducing V2 Strategies
            </motion.h1>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
              className="mb-6"
            >
              <img
                src="/v2-strategy-diagram.png"
                alt="V2 Strategy Framework Architecture Diagram"
                className="w-full rounded-lg shadow-sm"
              />
            </motion.div>

            {/* Article body */}
            <article ref={mainRef} className="prose-custom">
              {/* Lead paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                className="text-[16px] leading-[1.65] text-[#1F2937] mb-4"
              >
                We are excited to formally introduce the V2 Strategy Framework! After months of testing by us and our community, we are confident that using this new framework to design and deploy strategies will improve your algo trading P&L!
              </motion.p>

              {/* Body paragraph */}
              <Reveal>
                <p className="text-[16px] leading-[1.65] text-[#374151] mb-6">
                  V2 strategies bring unparalleled modularity, real-time adaptability, and backtesting capabilities to your trading arsenal, allowing you to design and deploy powerful, custom strategies with only a few tweaks to the template.
                </p>
              </Reveal>

              {/* H2 */}
              <Reveal>
                <h2
                  id="revolutionizing"
                  className="text-[28px] font-semibold text-[#1F2937] mt-10 mb-4 leading-[1.3] tracking-[-0.01em] border-l-[3px] border-[#0097A7] pl-4"
                >
                  Revolutionizing Strategy Design with Modularity and Flexibility
                </h2>
              </Reveal>

              <Reveal>
                <p className="text-[16px] leading-[1.65] text-[#374151] mb-4">
                  <Link to="/strategies" className="text-[#0097A7] font-medium hover:underline">
                    V2 Strategies
                  </Link>{' '}
                  marks a departure from the more rigid structure of V1 strategies. It's crafted to enable users to create powerful, custom strategies, even those who may not have extensive Python programming experience.
                </p>
              </Reveal>

              {/* H3 */}
              <Reveal>
                <h3
                  id="key-features"
                  className="text-[22px] font-semibold text-[#1F2937] mt-6 mb-3 leading-[1.35]"
                >
                  Key Features:
                </h3>
              </Reveal>

              <Reveal>
                <ul className="list-[square] text-[#0097A7] pl-5 mb-4">
                  <li className="text-[16px] leading-[1.65] text-[#374151] mb-2">Modular Executor components</li>
                  <li className="text-[16px] leading-[1.65] text-[#374151] mb-2">Real-time market data streaming</li>
                  <li className="text-[16px] leading-[1.65] text-[#374151] mb-2">Built-in backtesting engine</li>
                  <li className="text-[16px] leading-[1.65] text-[#374151] mb-2">YAML-based configuration</li>
                  <li className="text-[16px] leading-[1.65] text-[#374151] mb-2">Multi-bot orchestration support</li>
                </ul>
              </Reveal>

              {/* Code Block */}
              <Reveal>
                <CodeBlock code={pythonCode} language="python" />
              </Reveal>

              {/* H2 */}
              <Reveal>
                <h2
                  id="architectural-breakdown"
                  className="text-[28px] font-semibold text-[#1F2937] mt-10 mb-4 leading-[1.3] tracking-[-0.01em] border-l-[3px] border-[#0097A7] pl-4"
                >
                  Architectural Breakdown: The Building Blocks of V2 Strategies
                </h2>
              </Reveal>

              <Reveal>
                <p className="text-[16px] leading-[1.65] text-[#374151] mb-4">
                  The V2 architecture is built around three core primitives: <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-[14px] font-mono text-[#374151]">StrategyV2Base</code>, <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-[14px] font-mono text-[#374151]">Executor</code>, and <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-[14px] font-mono text-[#374151]">Controller</code>. Together, they form a composable pipeline that separates strategy logic from execution mechanics.
                </p>
              </Reveal>

              <Reveal>
                <p className="text-[16px] leading-[1.65] text-[#374151] mb-6">
                  Controllers define the decision-making rules, Executors handle order placement and position management, and Scripts wire them together into a runnable strategy. This separation of concerns makes it easy to swap out individual components without rewriting the entire strategy.
                </p>
              </Reveal>

              {/* Diagram placeholder */}
              <Reveal>
                <div className="border border-[#E5E7EB] rounded-lg p-6 bg-[#F9FAFB] mb-6">
                  <img
                    src="/v2-strategy-diagram.png"
                    alt="Component interaction diagram"
                    className="w-full rounded-md"
                  />
                  <p className="text-center text-[13px] text-[#9CA3AF] mt-3">
                    Component interaction diagram
                  </p>
                </div>
              </Reveal>

              {/* H2 */}
              <Reveal>
                <h2
                  id="performance"
                  className="text-[28px] font-semibold text-[#1F2937] mt-10 mb-4 leading-[1.3] tracking-[-0.01em] border-l-[3px] border-[#0097A7] pl-4"
                >
                  Performance of V2 Strategies in Live Trading
                </h2>
              </Reveal>

              <Reveal>
                <p className="text-[16px] leading-[1.65] text-[#374151] mb-4">
                  Early adopters in our community have been running V2 strategies on live markets for over three months. Here are the aggregate results from a sample of publicly shared bots:
                </p>
              </Reveal>

              {/* Performance Table */}
              <Reveal>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#F3F4F6]">
                        <th className="text-left text-[14px] font-semibold text-[#374151] px-3 py-2.5">Strategy</th>
                        <th className="text-left text-[14px] font-semibold text-[#374151] px-3 py-2.5">Pair</th>
                        <th className="text-left text-[14px] font-semibold text-[#374151] px-3 py-2.5">Period</th>
                        <th className="text-left text-[14px] font-semibold text-[#374151] px-3 py-2.5">Sharpe</th>
                        <th className="text-left text-[14px] font-semibold text-[#374151] px-3 py-2.5">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors duration-150"
                        >
                          <td className="text-[14px] text-[#374151] px-3 py-2.5">{row.strategy}</td>
                          <td className="text-[14px] text-[#374151] px-3 py-2.5">{row.pair}</td>
                          <td className="text-[14px] text-[#374151] px-3 py-2.5">{row.period}</td>
                          <td className="text-[14px] text-[#374151] px-3 py-2.5">{row.sharpe}</td>
                          <td className="text-[14px] text-[#374151] px-3 py-2.5 font-medium text-[#10B981]">{row.pnl}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>

              {/* H2 */}
              <Reveal>
                <h2
                  id="botcamp"
                  className="text-[28px] font-semibold text-[#1F2937] mt-10 mb-4 leading-[1.3] tracking-[-0.01em] border-l-[3px] border-[#0097A7] pl-4"
                >
                  Mastering V2 Strategies: Join Botcamp
                </h2>
              </Reveal>

              {/* CTA block */}
              <Reveal>
                <div className="bg-[#E0F4F5] border-l-[3px] border-[#0097A7] rounded-r-lg p-5 md:p-6 my-6">
                  <p className="text-[16px] leading-[1.65] text-[#1F2937]">
                    Want to master V2 strategies? Join Botcamp, our official training and certification program. Learn directly from the Hummingbot Foundation team.
                  </p>
                  <Link
                    to="/developers"
                    className="inline-flex items-center gap-1 text-[#0097A7] font-medium mt-3 hover:underline"
                  >
                    Learn more about Botcamp →
                  </Link>
                </div>
              </Reveal>

              {/* Divider */}
              <div className="border-0 border-t border-[#E5E7EB] my-8" />

              {/* Tags */}
              <Reveal>
                <div className="flex items-center gap-2 flex-wrap mt-8">
                  <span className="text-[14px] text-[#6B7280] mr-1">Tags:</span>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex px-2.5 py-1 rounded text-[12px] font-medium bg-[#E0F4F5] text-[#0097A7]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>

              {/* Share */}
              <Reveal>
                <ShareButtons />
              </Reveal>
            </article>
          </div>

          {/* Right sidebar — hidden on mobile, shown on tablet+ */}
          <div className="hidden md:block md:border-l md:border-[#E5E7EB] md:pl-6">
            <TableOfContents items={tocItems} />
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <RelatedArticles />
    </div>
  )
}

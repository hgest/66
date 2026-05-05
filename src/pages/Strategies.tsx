import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  ChevronRight,
  Zap,
  FileCode,
  Settings2,
  CheckCircle,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import type { ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/*  Reusable components                                                */
/* ------------------------------------------------------------------ */

function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-[13px] text-[#6B7280] mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight size={14} className="text-[#9CA3AF]" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-[#0097A7] transition-colors duration-150">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#1F2937] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

function Tag({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'outline' | 'category' }) {
  const base = 'inline-flex items-center px-2.5 py-1 rounded text-[12px] font-medium'
  const styles = {
    default: 'bg-[#E0F4F5] text-[#0097A7]',
    outline: 'border border-[#0097A7] text-[#0097A7] bg-transparent',
    category: 'bg-[#F3F4F6] text-[#6B7280]',
  }
  return <span className={`${base} ${styles[variant]}`}>{children}</span>
}

function CodeBlock({ code, language = 'python' }: { code: string; language?: string }) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-[#F3F4F6] border-b border-[#E5E7EB]">
        <span className="text-[12px] font-medium text-[#6B7280] uppercase">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={{
          'pre[class*="prism-code"]': {
            background: '#F3F4F6',
            margin: 0,
            padding: '16px 20px',
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: "'JetBrains Mono', monospace",
          },
          'code[class*="prism-code"]': {
            background: '#F3F4F6',
            fontFamily: "'JetBrains Mono', monospace",
          },
          comment: { color: '#7F848E' },
          string: { color: '#98C379' },
          keyword: { color: '#C678DD' },
          number: { color: '#D19A66' },
          function: { color: '#61AFEF' },
          className: { color: '#E5C07B' },
        } as Record<string, React.CSSProperties>}
        customStyle={{ background: '#F3F4F6', margin: 0, padding: '16px 20px', fontSize: '14px', lineHeight: '1.6' }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const componentCards = [
  {
    icon: Zap,
    iconColor: '#F59E0B',
    title: 'Executors',
    tag: 'Building Blocks',
    description:
      'Automate discrete trading workflows — manage orders for a specific task (open a position, execute a grid, provide liquidity). Designed to start and finish.',
    keyPoint: 'Can be created directly via the Hummingbot API without a running script.',
    hoverBorder: '#F59E0B',
  },
  {
    icon: FileCode,
    iconColor: '#0097A7',
    title: 'Scripts',
    tag: 'Learning & Prototyping',
    description:
      'Simple Python files that contain all strategy logic in one place. All scripts inherit from StrategyV2Base, giving them access to Executors and the Market Data Provider.',
    keyPoint: 'Ideal for learning, testing, and prototyping simple strategies.',
    hoverBorder: '#0097A7',
  },
  {
    icon: Settings2,
    iconColor: '#10B981',
    title: 'Controllers',
    tag: 'Production Grade',
    description:
      'Modular sub-strategies loaded by the v2_with_controllers.py script. A single bot can run multiple controllers simultaneously — each trading different pairs or using different logic.',
    keyPoint: 'More configurable, reusable, and suited for advanced long-running deployments.',
    hoverBorder: '#10B981',
  },
]

const deepDiveTabs = ['Executors', 'Scripts', 'Controllers', 'Comparison Table'] as const
type DeepDiveTab = (typeof deepDiveTabs)[number]

const tabContent: Record<DeepDiveTab, { title: string; description: string; code: string; features: string[] }> = {
  Executors: {
    title: 'Executors: Discrete Trading Workflows',
    description:
      'Executors are the atomic units of trading logic. Each executor handles one specific task — opening a position, managing a grid of orders, or providing concentrated liquidity. They are stateful, track their own P&L, and report completion.',
    code: `from hummingbot.strategy_v2.executors import PositionExecutor

executor = PositionExecutor(
    connector="binance",
    trading_pair="BTC-USDT",
    side=TradeType.BUY,
    entry_price=45000,
    take_profit_pct=0.02,
    stop_loss_pct=0.01,
    amount=0.1
)`,
    features: ['Self-contained lifecycle', 'Built-in risk management', 'Real-time P&L tracking', 'Composable with other executors'],
  },
  Scripts: {
    title: 'Scripts: All-in-One Strategy Files',
    description:
      'Scripts are the simplest way to get started. A single Python file defines your entire strategy. The `on_tick` method runs on every clock tick, giving you access to all Hummingbot components.',
    code: `from hummingbot.strategy_v2.strategy_base import StrategyV2Base

class MyFirstStrategy(StrategyV2Base):
    def on_tick(self):
        mid_price = self.market_data_provider.get_price("binance", "ETH-USDT")
        if mid_price < self.config.buy_threshold:
            self.buy("binance", "ETH-USDT", amount=0.5)`,
    features: ['Single file simplicity', 'Direct connector access', 'Ideal for learning', 'Quick iteration cycle'],
  },
  Controllers: {
    title: 'Controllers: Production-Grade Sub-Strategies',
    description:
      'Controllers are the power user\'s tool. Each controller is a modular sub-strategy that can be independently configured, backtested, and deployed. Load multiple controllers into a single bot for portfolio-level diversification.',
    code: `from hummingbot.strategy_v2.controllers import MarketMakingController

controller = MarketMakingController(
    config_path="conf_mm_btc.yml"
)
# Start the controller
controller.start()`,
    features: ['Multi-bot orchestration', 'Independent backtesting', 'YAML configuration', 'Hot-swappable at runtime'],
  },
  'Comparison Table': {
    title: 'Component Comparison',
    description: 'Compare Executors, Scripts, and Controllers across key dimensions to choose the right tool for your use case.',
    code: '',
    features: [],
  },
}

const comparisonRows = [
  { feature: 'Complexity', executors: 'Low', scripts: 'Low-Medium', controllers: 'Medium-High' },
  { feature: 'Best For', executors: 'API users, discrete tasks', scripts: 'Learning, prototyping', controllers: 'Production, multi-bot' },
  { feature: 'Backtesting', executors: 'Limited', scripts: 'Basic', controllers: 'Full' },
  { feature: 'Multi-pair', executors: 'No', scripts: 'Single', controllers: 'Multiple' },
  { feature: 'Configuration', executors: 'Code', scripts: 'Code', controllers: 'YAML' },
  { feature: 'Lifecycle', executors: 'Start/Finish', scripts: 'Continuous', controllers: 'Continuous' },
  { feature: 'Reusability', executors: 'High', scripts: 'Low', controllers: 'High' },
]

const templateFilters = ['All', 'Market Making', 'Arbitrage', 'Trend Following', 'Grid Trading'] as const
type TemplateFilter = (typeof templateFilters)[number]

const strategyTemplates = [
  {
    id: 'pure-market-making',
    title: 'Pure Market Making',
    tags: ['Market Making', 'V2'],
    description: 'Place bid and ask orders around the mid price with configurable spreads.',
    image: '/strategy-market-making.png',
    filter: 'Market Making' as TemplateFilter,
    code: `strategy: pure_market_making
exchange: binance
pair: BTC-USDT
bid_spread: 0.01
ask_spread: 0.01
order_amount: 0.1`,
  },
  {
    id: 'cross-exchange-arbitrage',
    title: 'Cross-Exchange Arbitrage',
    tags: ['Arbitrage', 'V2'],
    description: 'Capture price discrepancies between exchanges with automated execution.',
    image: '/strategy-arbitrage.png',
    filter: 'Arbitrage',
    code: `strategy: cross_exchange_arbitrage
primary_exchange: binance
secondary_exchange: kucoin
min_profitability: 0.005
trade_size: 100`,
  },
  {
    id: 'bollinger-bands-mm',
    title: 'Bollinger Bands MM',
    tags: ['Market Making', 'Technical Analysis'],
    description: 'Dynamic spread adjustment based on Bollinger Band volatility indicators.',
    image: '/strategy-market-making.png',
    filter: 'Market Making',
    code: `strategy: bollinger_bands_mm
exchange: binance
pair: ETH-USDT
bb_length: 20
bb_std: 2.0
spread_scalar: 0.5`,
  },
  {
    id: 'grid-trading',
    title: 'Grid Trading',
    tags: ['Grid Trading', 'V2'],
    description: 'Place a ladder of buy and sell orders at fixed price intervals.',
    image: '/strategy-market-making.png',
    filter: 'Grid Trading',
    code: `strategy: grid_trading
exchange: binance
pair: SOL-USDT
grid_levels: 10
grid_spacing: 0.02
order_size: 1.0`,
  },
  {
    id: 'twap-execution',
    title: 'TWAP Executor',
    tags: ['Execution', 'V2'],
    description: 'Time-Weighted Average Price execution to minimize market impact.',
    image: '/strategy-arbitrage.png',
    filter: 'Trend Following',
    code: `strategy: twap_execution
exchange: binance
pair: BTC-USDT
total_amount: 10.0
num_slices: 20
interval_seconds: 300`,
  },
  {
    id: 'portfolio-rebalancing',
    title: 'Portfolio Rebalancing',
    tags: ['Portfolio', 'V2'],
    description: 'Maintain target asset allocations with threshold-based rebalancing triggers.',
    image: '/strategy-market-making.png',
    filter: 'Market Making',
    code: `strategy: portfolio_rebalancing
exchange: binance
assets:
  - BTC: 0.5
  - ETH: 0.3
  - USDT: 0.2
rebalance_threshold: 0.05`,
  },
]

/* ------------------------------------------------------------------ */
/*  Animated number                                                    */
/* ------------------------------------------------------------------ */

function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1200 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start: number | null = null
    let raf: number

    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setDisplay(Math.floor(progress * value))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function Strategies() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<DeepDiveTab>('Executors')
  const [activeTemplateFilter, setActiveTemplateFilter] = useState<TemplateFilter>('All')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const filteredTemplates = activeTemplateFilter === 'All'
    ? strategyTemplates
    : strategyTemplates.filter((t) => t.filter === activeTemplateFilter)

  const toggleCardExpand = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      {/* ========== Section 1: Page Header ========== */}
      <section className="bg-[#F5F7FA] pt-12 pb-10">
        <div className="mx-auto max-w-content px-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Strategies' }]} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-4"
          >
            <Tag variant="outline">V2 Framework</Tag>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="text-[36px] font-semibold text-[#1F2937] tracking-[-0.02em] leading-[1.2]"
          >
            Strategy Framework
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="text-[16px] text-[#6B7280] leading-[1.65] max-w-[640px] mx-auto mt-3"
          >
            Build powerful, modular algorithmic trading strategies using Hummingbot's V2 framework. Mix Executors, Scripts, and Controllers to create production-grade bots.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <a
              href="#templates"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-[#0097A7] text-white text-[14px] font-medium hover:bg-[#007A87] transition-colors duration-150"
            >
              Explore Templates
              <ArrowRight size={14} />
            </a>
            <Link
              to="/docs"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md border border-[#E5E7EB] bg-white text-[#374151] text-[14px] font-medium hover:border-[#0097A7] hover:text-[#0097A7] transition-colors duration-150"
            >
              Read the Docs
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== Section 2: V2 Framework Overview ========== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-content px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
            className="text-[28px] font-semibold text-[#1F2937] tracking-[-0.01em] leading-[1.3] text-center"
          >
            Three Core Components
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[16px] text-[#6B7280] leading-[1.65] text-center max-w-[560px] mx-auto mt-2 mb-10"
          >
            Understanding how Executors, Scripts, and Controllers differ helps you choose the right tool.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {componentCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.12,
                    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
                  }}
                  className="group bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-250"
                  style={{ '--hover-border': card.hoverBorder } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = card.hoverBorder
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.12 + 0.2,
                      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
                    }}
                    className="mb-4 group-hover:scale-110 transition-transform duration-200"
                  >
                    <Icon size={48} color={card.iconColor} />
                  </motion.div>
                  <h4 className="text-[18px] font-medium text-[#1F2937] mb-2">{card.title}</h4>
                  <div className="mb-3">
                    <Tag variant="default">{card.tag}</Tag>
                  </div>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed mb-3">{card.description}</p>
                  <p className="text-[14px] text-[#374151] font-medium mt-3">{card.keyPoint}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========== Section 3: Component Deep Dive ========== */}
      <section className="bg-[#F5F7FA] py-16">
        <div className="mx-auto max-w-content px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
            className="relative border-b border-[#E5E7EB] mb-0"
          >
            <div className="flex flex-wrap">
              {deepDiveTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative px-5 py-3 text-[14px] font-medium transition-colors duration-150"
                  style={{
                    color: activeTab === tab ? '#1F2937' : '#6B7280',
                    background: activeTab === tab ? '#FFFFFF' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab) e.currentTarget.style.color = '#374151'
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab) e.currentTarget.style.color = '#6B7280'
                  }}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="strategies-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0097A7]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="bg-white border border-t-0 border-[#E5E7EB] rounded-b-xl p-10 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              >
                {activeTab === 'Comparison Table' ? (
                  <>
                    <h3 className="text-[22px] font-semibold text-[#1F2937] leading-[1.35] mb-4">
                      {tabContent[activeTab].title}
                    </h3>
                    <p className="text-[16px] text-[#6B7280] leading-[1.65] mb-6">
                      {tabContent[activeTab].description}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[14px]">
                        <thead>
                          <tr className="border-b border-[#E5E7EB]">
                            <th className="text-left py-3 px-4 font-semibold text-[#1F2937]">Feature</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#1F2937]">Executors</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#1F2937]">Scripts</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#1F2937]">Controllers</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonRows.map((row) => (
                            <tr key={row.feature} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                              <td className="py-3 px-4 text-[#374151] font-medium">{row.feature}</td>
                              <td className="py-3 px-4 text-[#6B7280]">{row.executors}</td>
                              <td className="py-3 px-4 text-[#6B7280]">{row.scripts}</td>
                              <td className="py-3 px-4 text-[#6B7280]">{row.controllers}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-[22px] font-semibold text-[#1F2937] leading-[1.35] mb-4">
                      {tabContent[activeTab].title}
                    </h3>
                    <p className="text-[16px] text-[#6B7280] leading-[1.65] mb-4">
                      {tabContent[activeTab].description}
                    </p>
                    <CodeBlock code={tabContent[activeTab].code} />
                    <ul className="space-y-2 mt-4">
                      {tabContent[activeTab].features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-[14px] text-[#374151]">
                          <CheckCircle size={16} className="text-[#10B981] shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ========== Section 4: Strategy Template Gallery ========== */}
      <section id="templates" className="bg-white py-16">
        <div className="mx-auto max-w-content px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-[28px] font-semibold text-[#1F2937] tracking-[-0.01em] leading-[1.3]">
              Strategy Templates
            </h2>
            <p className="text-[16px] text-[#6B7280] leading-[1.65] mt-2">
              Ready-to-use strategy configurations. Fork, customize, and deploy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-wrap items-center gap-2 mt-4"
          >
            {templateFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveTemplateFilter(filter)}
                className="relative px-4 py-2 rounded-md text-[14px] font-medium transition-colors duration-150"
                style={{
                  background: activeTemplateFilter === filter ? '#0097A7' : 'transparent',
                  color: activeTemplateFilter === filter ? '#FFFFFF' : '#6B7280',
                }}
                onMouseEnter={(e) => {
                  if (activeTemplateFilter !== filter) e.currentTarget.style.background = '#F3F4F6'
                }}
                onMouseLeave={(e) => {
                  if (activeTemplateFilter !== filter) e.currentTarget.style.background = 'transparent'
                }}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, i) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
                  }}
                  className="group bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-250"
                >
                  <div className="overflow-hidden rounded-lg aspect-video mb-4">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {template.tags.map((tag) => (
                      <Tag key={tag} variant="default">{tag}</Tag>
                    ))}
                  </div>
                  <h4 className="text-[18px] font-medium text-[#1F2937] mb-2">{template.title}</h4>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed mb-4">
                    {template.description}
                  </p>

                  {/* Collapsible code preview */}
                  <div className="mb-4">
                    <button
                      onClick={() => toggleCardExpand(template.id)}
                      className="flex items-center gap-1 text-[13px] font-medium text-[#0097A7] hover:text-[#007A87] transition-colors duration-150"
                    >
                      {expandedCards.has(template.id) ? 'Show less' : 'Show more'}
                      <motion.span
                        animate={{ rotate: expandedCards.has(template.id) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={14} />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {expandedCards.has(template.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <CodeBlock code={template.code} language="yaml" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md bg-[#0097A7] text-white text-[13px] font-medium hover:bg-[#007A87] transition-colors duration-200">
                    Use Template
                    <ArrowRight size={13} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ========== Section 5: Live Performance Preview ========== */}
      <section className="bg-[#F5F7FA] py-16">
        <div className="mx-auto max-w-content px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            {/* Left column: text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <span className="inline-block text-[12px] font-semibold text-[#0097A7] uppercase tracking-wider mb-3">
                Performance
              </span>
              <h2 className="text-[28px] font-semibold text-[#1F2937] tracking-[-0.01em] leading-[1.3] mb-4">
                Track Your Bots in Real-Time
              </h2>
              <p className="text-[16px] text-[#6B7280] leading-[1.65] mb-6">
                Monitor P&L, Sharpe ratio, win rate, and drawdown across all your deployed strategies from a single dashboard.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Real-time P&L tracking across all exchanges',
                  'Sharpe ratio and Sortino ratio calculations',
                  'Historical performance charts',
                  'Automated alert notifications',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[14px] text-[#374151]">
                    <CheckCircle size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-[#0097A7] text-white text-[14px] font-medium hover:bg-[#007A87] transition-colors duration-150">
                Explore Dashboard
                <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Right column: mock dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 20, rotate: 3 }}
              whileInView={{ opacity: 1, x: 0, rotate: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
              }}
              className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-md"
            >
              {/* Stats pills */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1.5 rounded-md bg-[#D1FAE5] text-[#059669] text-[13px] font-semibold">
                  P&L: +$<AnimatedNumber value={1247} prefix="" suffix="" />
                </span>
                <span className="px-3 py-1.5 rounded-md bg-[#E0F4F5] text-[#0097A7] text-[13px] font-semibold">
                  Sharpe: 2.34
                </span>
                <span className="px-3 py-1.5 rounded-md bg-[#FEF3C7] text-[#D97706] text-[13px] font-semibold">
                  Win Rate: 68%
                </span>
              </div>

              {/* Mock chart */}
              <DashboardChart />

              {/* Mini table */}
              <div className="mt-4">
                <table className="w-full text-[12px] text-[#374151]">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="text-left py-2 font-medium">Strategy</th>
                      <th className="text-left py-2 font-medium">Pair</th>
                      <th className="text-left py-2 font-medium">Status</th>
                      <th className="text-right py-2 font-medium">Daily P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E5E7EB]">
                      <td className="py-2">Pure MM</td>
                      <td className="py-2">BTC-USDT</td>
                      <td className="py-2">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                          Active
                        </span>
                      </td>
                      <td className="py-2 text-right text-[#059669] font-medium">+$412</td>
                    </tr>
                    <tr className="border-b border-[#E5E7EB]">
                      <td className="py-2">Arb Bot</td>
                      <td className="py-2">ETH-USDC</td>
                      <td className="py-2">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                          Active
                        </span>
                      </td>
                      <td className="py-2 text-right text-[#059669] font-medium">+$198</td>
                    </tr>
                    <tr>
                      <td className="py-2">Grid</td>
                      <td className="py-2">SOL-USDT</td>
                      <td className="py-2">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                          Paused
                        </span>
                      </td>
                      <td className="py-2 text-right text-[#EF4444] font-medium">-$12</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Dashboard Chart (SVG with draw-in animation)                       */
/* ------------------------------------------------------------------ */

function DashboardChart() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true })
  const [dashOffset, setDashOffset] = useState(1000)

  useEffect(() => {
    if (!inView) return
    let start: number | null = null
    let raf: number
    const duration = 1200

    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setDashOffset(1000 * (1 - progress))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  const pathD =
    'M0,120 C20,115 40,110 60,105 C80,100 100,95 120,90 C140,85 160,80 180,75 C200,70 220,65 240,60 C260,55 280,50 300,45 C320,40 340,35 360,30 C380,25 400,20 420,15 C440,10 460,5 480,10 C500,15 520,20 540,25 C560,30 580,35 600,30'

  return (
    <div className="h-[160px] bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] p-4">
      <svg ref={ref} viewBox="0 0 600 140" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 35, 70, 105, 140].map((y) => (
          <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#E5E7EB" strokeWidth="1" />
        ))}
        {/* Chart line */}
        <path
          d={pathD}
          fill="none"
          stroke="#0097A7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={dashOffset}
        />
      </svg>
    </div>
  )
}

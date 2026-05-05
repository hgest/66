import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, Copy, ChevronRight } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type Language = 'curl' | 'python'

/* ------------------------------------------------------------------ */
/*  Custom Prism style (matches design token colours)                  */
/* ------------------------------------------------------------------ */

const customPrismStyle = {
  'pre[class*="language-"]': {
    background: '#F3F4F6',
    margin: 0,
    padding: '16px 20px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    lineHeight: 1.6,
    borderRadius: '0 0 8px 8px',
    overflow: 'auto',
  },
  'code[class*="language-"]': {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    lineHeight: 1.6,
    color: '#374151',
  },
  comment: { color: '#7F848E' },
  prolog: { color: '#7F848E' },
  doctype: { color: '#7F848E' },
  cdata: { color: '#7F848E' },
  punctuation: { color: '#374151' },
  property: { color: '#61AFEF' },
  tag: { color: '#C678DD' },
  boolean: { color: '#D19A66' },
  number: { color: '#D19A66' },
  constant: { color: '#D19A66' },
  symbol: { color: '#D19A66' },
  deleted: { color: '#EF4444' },
  selector: { color: '#98C379' },
  string: { color: '#98C379' },
  char: { color: '#98C379' },
  builtin: { color: '#61AFEF' },
  inserted: { color: '#98C379' },
  operator: { color: '#374151' },
  entity: { color: '#61AFEF' },
  url: { color: '#374151' },
  variable: { color: '#E5C07B' },
  atrule: { color: '#C678DD' },
  keyword: { color: '#C678DD' },
  'attr-value': { color: '#98C379' },
  function: { color: '#61AFEF' },
  'class-name': { color: '#E5C07B' },
  regex: { color: '#98C379' },
  important: { color: '#C678DD' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
} as const

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                   */
/* ------------------------------------------------------------------ */

const easeOut = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
const easeSmooth = [0.4, 0, 0.2, 1] as [number, number, number, number]
const easeSpring = [0.34, 1.56, 0.64, 1] as [number, number, number, number]

const fadeUp = (delay = 0, duration = 0.4) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration, delay, ease: easeSmooth },
})

const fadeLeft = (delay = 0, duration = 0.5) => ({
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration, delay, ease: easeSmooth },
})

const fadeRight = (delay = 0, duration = 0.5) => ({
  initial: { opacity: 0, x: 20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration, delay, ease: easeSmooth },
})

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-[13px] text-[#6B7280] mb-4">
      <Link to="/" className="hover:text-[#0097A7] transition-colors duration-150">
        Home
      </Link>
      <ChevronRight size={14} className="text-[#9CA3AF]" />
      <span className="text-[#1F2937] font-medium">Developers</span>
    </nav>
  )
}

function EndpointCard({
  method,
  endpoint,
  description,
  methodColor,
  methodBg,
  index,
}: {
  method: string
  endpoint: string
  description: string
  methodColor: string
  methodBg: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: easeSmooth }}
      className="group border border-[#E5E7EB] rounded-lg p-5 bg-white shadow-sm hover:border-[#0097A7] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold font-mono"
          style={{ backgroundColor: methodBg, color: methodColor }}
        >
          {method}
        </span>
        <code className="text-[14px] text-[#374151] font-mono">{endpoint}</code>
      </div>
      <p className="text-[14px] text-[#6B7280] leading-relaxed">{description}</p>
    </motion.div>
  )
}

function ChecklistItem({
  title,
  description,
  checked,
  onToggle,
  index,
}: {
  title: string
  description: string
  checked: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.3, delay: 0.2 + index * 0.06, ease: easeSmooth }}
      className={`flex items-start gap-3 py-3 ${index < 7 ? 'border-b border-[#E5E7EB]' : ''}`}
    >
      <button
        onClick={onToggle}
        className="mt-0.5 shrink-0 w-[18px] h-[18px] rounded flex items-center justify-center transition-all duration-150"
        style={{
          border: checked ? '2px solid #0097A7' : '2px solid #E5E7EB',
          backgroundColor: checked ? '#0097A7' : 'transparent',
        }}
        aria-checked={checked}
        role="checkbox"
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2, ease: easeSpring }}
            >
              <Check size={12} className="text-white" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <div>
        <p
          className={`text-[14px] font-semibold transition-colors duration-150 ${checked ? 'text-[#1F2937]' : 'text-[#374151]'}`}
        >
          {title}
        </p>
        <p className="text-[13px] text-[#6B7280] mt-0.5">{description}</p>
      </div>
    </motion.div>
  )
}

function CodeExamplePanel({
  title,
  description,
  code,
  language,
  index,
}: {
  title: string
  description: string
  code: string
  language: string
  index: number
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: easeSmooth }}
      className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl overflow-hidden"
    >
      <div className="flex items-start justify-between px-5 py-4 bg-white border-b border-[#E5E7EB]">
        <div>
          <h4 className="text-[14px] font-semibold text-[#374151]">{title}</h4>
          <p className="text-[13px] text-[#6B7280] mt-0.5">{description}</p>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-md bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] transition-colors duration-150"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} className="text-[#10B981]" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={customPrismStyle as unknown as Record<string, React.CSSProperties>}
          customStyle={{
            borderRadius: 0,
            border: 'none',
            margin: 0,
            background: '#F9FAFB',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  )
}

function ContributionStep({
  number,
  title,
  description,
  index,
}: {
  number: number
  title: string
  description: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.3, delay: 0.4 + index * 0.15, ease: easeSmooth }}
      className="relative flex flex-col items-center text-center flex-1"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, delay: 0.3 + index * 0.15, ease: easeSpring }}
        className="w-8 h-8 rounded-full bg-[#0097A7] text-white flex items-center justify-center text-[14px] font-semibold mb-3"
      >
        {number}
      </motion.div>
      <h4 className="text-[14px] font-semibold text-[#1F2937]">{title}</h4>
      <p className="text-[14px] text-[#6B7280] mt-1">{description}</p>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const endpoints = [
  {
    method: 'GET',
    endpoint: '/portfolio/state',
    description: 'Fetch current portfolio state across all connected exchanges.',
    methodColor: '#0097A7',
    methodBg: '#E0F4F5',
  },
  {
    method: 'POST',
    endpoint: '/trading/orders',
    description: 'Place limit and market orders on any supported exchange.',
    methodColor: '#D97706',
    methodBg: '#FEF3C7',
  },
  {
    method: 'GET',
    endpoint: '/bots/status',
    description: 'Monitor running bot instances and their performance metrics.',
    methodColor: '#0097A7',
    methodBg: '#E0F4F5',
  },
  {
    method: 'POST',
    endpoint: '/docker/deploy',
    description: 'Deploy new Hummingbot instances via Docker containers.',
    methodColor: '#D97706',
    methodBg: '#FEF3C7',
  },
  {
    method: 'GET',
    endpoint: '/connectors',
    description: 'List all available exchange connectors and their configuration.',
    methodColor: '#0097A7',
    methodBg: '#E0F4F5',
  },
  {
    method: 'POST',
    endpoint: '/backtesting/run',
    description: 'Run backtests against historical data for strategy validation.',
    methodColor: '#D97706',
    methodBg: '#FEF3C7',
  },
]

const checklistSteps = [
  { title: 'Directory Setup', description: 'Create connector folder and required files.' },
  { title: 'Constants', description: 'Define REST URLs, rate limits, and server time paths.' },
  { title: 'Web Utils', description: 'Build URL factory and time synchronizer logic.' },
  { title: 'Authentication', description: 'Implement REST and WebSocket auth with signature generation.' },
  { title: 'Order Book', description: 'Create order book class and data source.' },
  { title: 'Exchange Class', description: 'Implement core exchange methods for trading.' },
  { title: 'User Stream', description: 'Set up private WebSocket for order/trade updates.' },
  { title: 'Tests', description: 'Write unit tests for all connector components.' },
]

const codeExamples: Record<Language, Array<{ title: string; description: string; code: string }>> = {
  python: [
    {
      title: 'Place a Limit Order',
      description: 'Sell 1 HYPE at $47.1 on Hyperliquid',
      code: `import asyncio
from hummingbot_api_client import HummingbotAPIClient

client = HummingbotAPIClient(
    base_url="http://localhost:8000",
    username="admin",
    password="admin"
)

async def place_order():
    await client.init()
    order = await client.trading.place_order(
        account_name="master_account",
        connector_name="hyperliquid",
        trading_pair="HYPE-USDC",
        trade_type="SELL",
        amount=1,
        order_type="LIMIT",
        price=47.1,
        position_action="OPEN"
    )
    print(f"Order placed: {order['order_id']}")
    await client.close()

asyncio.run(place_order())`,
    },
    {
      title: 'Fetch Portfolio',
      description: 'Get current balances across all exchanges',
      code: `portfolio = await client.portfolio.state()
print(portfolio['balances'])`,
    },
    {
      title: 'Add Exchange Credentials',
      description: 'Store API keys for a new exchange',
      code: `await client.accounts.add_credential(
    "master_account", "hyperliquid",
    hyperliquid_api_key="0x1234...",
    hyperliquid_api_secret="..."
)`,
    },
  ],
  curl: [
    {
      title: 'Place a Limit Order',
      description: 'Sell 1 HYPE at $47.1 on Hyperliquid',
      code: `curl -X POST http://localhost:8000/trading/orders \\
  -u admin:admin \\
  -H "Content-Type: application/json" \\
  -d '{
    "account_name": "master_account",
    "connector_name": "hyperliquid",
    "trading_pair": "HYPE-USDC",
    "trade_type": "SELL",
    "amount": 1,
    "order_type": "LIMIT",
    "price": 47.1,
    "position_action": "OPEN"
  }'`,
    },
    {
      title: 'Fetch Portfolio',
      description: 'Get current balances across all exchanges',
      code: `curl -u admin:admin \\
  http://localhost:8000/portfolio/state`,
    },
    {
      title: 'Add Exchange Credentials',
      description: 'Store API keys for a new exchange',
      code: `curl -X POST http://localhost:8000/accounts/credentials \\
  -u admin:admin \\
  -H "Content-Type: application/json" \\
  -d '{
    "account_name": "master_account",
    "connector_name": "hyperliquid",
    "hyperliquid_api_key": "0x1234...",
    "hyperliquid_api_secret": "..."
  }'`,
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */

export default function Developers() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(8).fill(false))
  const [activeLang, setActiveLang] = useState<Language>('python')
  const [tabUnderlineStyle, setTabUnderlineStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  /* Load checklist from localStorage */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('developers-checklist')
      if (saved) {
        const parsed = JSON.parse(saved) as boolean[]
        if (Array.isArray(parsed) && parsed.length === 8) {
          setCheckedItems(parsed)
        }
      }
    } catch {
      // ignore parsing errors
    }
  }, [])

  /* Persist checklist */
  useEffect(() => {
    localStorage.setItem('developers-checklist', JSON.stringify(checkedItems))
  }, [checkedItems])

  /* Update tab underline position */
  useEffect(() => {
    const activeIdx = activeLang === 'curl' ? 0 : 1
    const el = tabRefs.current[activeIdx]
    if (el) {
      setTabUnderlineStyle({ left: el.offsetLeft, width: el.offsetWidth })
    }
  }, [activeLang])

  const toggleItem = useCallback((index: number) => {
    setCheckedItems((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }, [])

  const completedCount = checkedItems.filter(Boolean).length
  const progress = (completedCount / checkedItems.length) * 100
  const allCompleted = completedCount === checkedItems.length

  return (
    <div>
      {/* ===== Section 1: Page Header ===== */}
      <section className="bg-[#F5F7FA] pt-12 pb-10">
        <div className="mx-auto max-w-content px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            {/* Left column (60%) */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Breadcrumb />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOut }}
                className="text-[36px] font-semibold text-[#1F2937] tracking-[-0.02em] leading-[1.2]"
              >
                Developer Hub
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: easeOut }}
                className="text-[16px] text-[#6B7280] leading-[1.65] max-w-[540px] mt-3"
              >
                Everything you need to build on Hummingbot. Explore our REST API, learn how to build connectors, and contribute to the open-source ecosystem.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: easeOut }}
                className="flex flex-wrap items-center gap-3 mt-6"
              >
                <a
                  href="#api"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0097A7] text-white text-[14px] font-medium rounded-md hover:bg-[#007A87] transition-colors duration-150"
                >
                  API Reference
                  <ChevronRight size={14} />
                </a>
                <a
                  href="#connectors"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-[#0097A7] text-[14px] font-medium rounded-md border border-[#E5E7EB] hover:border-[#0097A7] hover:bg-[#E0F4F5] transition-all duration-150"
                >
                  Connector Guide
                  <ChevronRight size={14} />
                </a>
              </motion.div>
            </div>

            {/* Right column (40%) */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20, rotate: -4 }}
                animate={{ opacity: 1, x: 0, rotate: -2 }}
                transition={{ duration: 0.6, delay: 0.15, ease: easeSpring }}
                className="relative rounded-lg"
                style={{ boxShadow: '0 0 40px rgba(0,151,167,0.15)' }}
              >
                <div className="bg-[#1F2937] rounded-lg p-5 font-mono text-[13px] leading-relaxed overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                    <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                  </div>
                  <p className="text-[#9CA3AF]">$ <span className="text-[#E5E7EB]">curl -u admin:admin \</span></p>
                  <p className="text-[#E5E7EB] pl-4">http://localhost:8000/portfolio/state</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 2: API Quick Reference ===== */}
      <section id="api" className="bg-white py-16">
        <div className="mx-auto max-w-content px-6">
          <motion.div {...fadeUp(0, 0.4)} className="mb-8">
            <span className="inline-block text-[12px] font-semibold text-[#0097A7] uppercase tracking-[0.1em] mb-2">
              API
            </span>
            <h2 className="text-[28px] font-semibold text-[#1F2937] tracking-[-0.01em] leading-[1.3]">
              Hummingbot API
            </h2>
            <p className="text-[16px] text-[#6B7280] leading-[1.65] mt-2 max-w-2xl">
              A comprehensive REST API for executing trades, fetching data, and deploying bots.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {endpoints.map((ep, i) => (
              <EndpointCard key={ep.endpoint} {...ep} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.3, ease: easeSmooth }}
            className="mt-6"
          >
            <a
              href="https://docs.hummingbot.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[14px] font-medium text-[#0097A7] hover:text-[#007A87] transition-colors duration-150"
            >
              View Full API Docs
              <ChevronRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== Section 3: Connector Development ===== */}
      <section id="connectors" className="bg-[#F5F7FA] py-16">
        <div className="mx-auto max-w-content px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left column */}
            <div className="lg:col-span-5">
              <motion.div {...fadeLeft()}>
                <span className="inline-block text-[12px] font-semibold text-[#0097A7] uppercase tracking-[0.1em] mb-2">
                  Connectors
                </span>
                <h2 className="text-[28px] font-semibold text-[#1F2937] tracking-[-0.01em] leading-[1.3]">
                  Build a Connector
                </h2>
                <p className="text-[16px] text-[#6B7280] leading-[1.65] mt-3">
                  Add support for a new exchange to Hummingbot. Follow our step-by-step guide to implement REST and WebSocket APIs, authentication, and order book handling.
                </p>
                <img
                  src="/connector-diagram.png"
                  alt="Exchange connector flow diagram"
                  className="w-full rounded-lg border border-[#E5E7EB] mt-6"
                />
              </motion.div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-7">
              <motion.div
                {...fadeRight(0.1)}
                className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm"
              >
                {/* Progress bar */}
                <div className="mb-5">
                  <div className="h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#0097A7] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: easeSmooth }}
                    />
                  </div>
                  <p className="text-[12px] font-medium text-[#6B7280] mt-2 tracking-[0.02em]">
                    {completedCount} of {checkedItems.length} steps completed
                  </p>
                </div>

                {/* Checklist */}
                <div>
                  {checklistSteps.map((step, i) => (
                    <ChecklistItem
                      key={step.title}
                      title={step.title}
                      description={step.description}
                      checked={checkedItems[i]}
                      onToggle={() => toggleItem(i)}
                      index={i}
                    />
                  ))}
                </div>

                {/* Completion message */}
                <AnimatePresence>
                  {allCompleted && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.4, ease: easeSpring }}
                      className="mt-4 p-4 bg-[#E0F4F5] rounded-lg text-center"
                    >
                      <p className="text-[14px] font-semibold text-[#0097A7]">Ready to submit!</p>
                      <p className="text-[13px] text-[#007A87] mt-1">
                        All connector development steps completed.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 4: Code Examples ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-content px-6">
          <motion.div {...fadeUp(0, 0.4)} className="mb-5">
            <h2 className="text-[28px] font-semibold text-[#1F2937] tracking-[-0.01em] leading-[1.3]">
              Code Examples
            </h2>
            <p className="text-[16px] text-[#6B7280] leading-[1.65] mt-2">
              Get started with common API operations.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.3, delay: 0.1, ease: easeSmooth }}
            className="relative flex items-center gap-6 mb-6 border-b border-[#E5E7EB]"
          >
            {(['curl', 'python'] as Language[]).map((lang, idx) => (
              <button
                key={lang}
                ref={(el) => { tabRefs.current[idx] = el }}
                onClick={() => setActiveLang(lang)}
                className={`relative pb-2 text-[14px] font-medium capitalize transition-colors duration-150 ${
                  activeLang === lang ? 'text-[#0097A7]' : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                {lang}
              </button>
            ))}
            <motion.div
              className="absolute bottom-0 h-[2px] bg-[#0097A7]"
              animate={{
                left: tabUnderlineStyle.left,
                width: tabUnderlineStyle.width,
              }}
              transition={{ duration: 0.2, ease: easeOut }}
            />
          </motion.div>

          {/* Panels */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLang}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-6"
            >
              {codeExamples[activeLang].map((ex, i) => (
                <CodeExamplePanel
                  key={ex.title + activeLang}
                  title={ex.title}
                  description={ex.description}
                  code={ex.code}
                  language={activeLang === 'curl' ? 'bash' : 'python'}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ===== Section 5: Contribution Guide ===== */}
      <section className="bg-[#F5F7FA] py-16">
        <div className="mx-auto max-w-content px-6">
          <div className="max-w-[720px] mx-auto text-center">
            <motion.h2
              {...fadeUp(0, 0.4)}
              className="text-[28px] font-semibold text-[#1F2937] tracking-[-0.01em] leading-[1.3]"
            >
              Contribute to Hummingbot
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: 0.1, ease: easeSmooth }}
              className="text-[16px] text-[#6B7280] leading-[1.65] mt-3"
            >
              Hummingbot is community-driven. Whether you're fixing bugs, adding connectors, or improving documentation, your contributions help democratize high-frequency trading.
            </motion.p>

            {/* Timeline */}
            <div className="relative mt-10">
              {/* Horizontal line (desktop) */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: easeSmooth }}
                className="hidden md:block absolute top-4 left-[12.5%] right-[12.5%] h-[2px] bg-[#E5E7EB] origin-left"
              />
              {/* Vertical line (mobile) */}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: easeSmooth }}
                className="md:hidden absolute top-0 bottom-0 left-4 w-[2px] bg-[#E5E7EB] origin-top"
              />

              <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                <ContributionStep
                  number={1}
                  title="Fork the Repo"
                  description="Start with our GitHub template."
                  index={0}
                />
                <ContributionStep
                  number={2}
                  title="Build Your Feature"
                  description="Follow our coding standards."
                  index={1}
                />
                <ContributionStep
                  number={3}
                  title="Run Tests"
                  description="Ensure everything passes."
                  index={2}
                />
                <ContributionStep
                  number={4}
                  title="Submit a PR"
                  description="We review within 48 hours."
                  index={3}
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: 0.5, ease: easeSmooth }}
              className="flex flex-wrap items-center justify-center gap-3 mt-8"
            >
              <a
                href="https://github.com/hummingbot/hummingbot/blob/master/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0097A7] text-white text-[14px] font-medium rounded-md hover:bg-[#007A87] transition-colors duration-150"
              >
                View Contribution Guide
                <ChevronRight size={14} />
              </a>
              <a
                href="https://discord.gg/hummingbot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-[#0097A7] text-[14px] font-medium rounded-md border border-[#E5E7EB] hover:border-[#0097A7] hover:bg-[#E0F4F5] transition-all duration-150"
              >
                Join Discord
                <ChevronRight size={14} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

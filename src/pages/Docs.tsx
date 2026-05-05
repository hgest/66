import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronRight, Loader2, Calendar, Clock, User } from 'lucide-react'
import Fuse from 'fuse.js'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const categories = ['All', 'Announcements', 'Engineering', 'Tutorials', 'API', 'Strategies'] as const
type Category = (typeof categories)[number]

interface Article {
  slug: string
  title: string
  category: Category | string
  excerpt: string
  author: string
  authorAvatar: string
  date: string
  readTime: string
  image: string
}

const articles: Article[] = [
  {
    slug: 'introducing-v2-strategies',
    title: 'Introducing V2 Strategies',
    category: 'Announcements',
    excerpt: 'V2 strategies bring modularity, real-time adaptability, and backtesting to your trading arsenal.',
    author: 'Michael Feng',
    authorAvatar: '/avatar-michael.png',
    date: 'Nov 29, 2023',
    readTime: '3 min',
    image: '/v2-strategy-diagram.png',
  },
  {
    slug: 'market-making-bollinger-bands',
    title: 'Market Making with Bollinger Bands',
    category: 'Tutorials',
    excerpt: 'Learn how to deploy a market making strategy using Bollinger Band indicators for entry and exit signals.',
    author: 'Sarah Chen',
    authorAvatar: '/avatar-sarah.png',
    date: 'Dec 15, 2023',
    readTime: '8 min',
    image: '/strategy-market-making.png',
  },
  {
    slug: 'cross-exchange-arbitrage-101',
    title: 'Cross-Exchange Arbitrage 101',
    category: 'Tutorials',
    excerpt: 'A step-by-step guide to setting up your first arbitrage bot across CEX and DEX venues.',
    author: 'Alex Rivera',
    authorAvatar: '/avatar-alex.png',
    date: 'Jan 8, 2024',
    readTime: '12 min',
    image: '/strategy-arbitrage.png',
  },
  {
    slug: 'building-custom-connector',
    title: 'Building a Custom Connector',
    category: 'Engineering',
    excerpt: 'Deep dive into the connector architecture and how to add support for a new exchange to Hummingbot.',
    author: 'Michael Feng',
    authorAvatar: '/avatar-michael.png',
    date: 'Feb 3, 2024',
    readTime: '15 min',
    image: '/v2-strategy-diagram.png',
  },
  {
    slug: 'backtesting-v2-framework',
    title: 'Backtesting with V2 Framework',
    category: 'Engineering',
    excerpt: 'How to use the built-in backtesting engine to validate your strategies against historical data.',
    author: 'Sarah Chen',
    authorAvatar: '/avatar-sarah.png',
    date: 'Feb 20, 2024',
    readTime: '10 min',
    image: '/strategy-market-making.png',
  },
  {
    slug: 'hummingbot-api-v2-migration',
    title: 'Hummingbot API v2 Migration',
    category: 'API',
    excerpt: "What's new in the Hummingbot API v2 and how to migrate your integrations from v1.",
    author: 'Alex Rivera',
    authorAvatar: '/avatar-alex.png',
    date: 'Mar 1, 2024',
    readTime: '6 min',
    image: '/v2-strategy-diagram.png',
  },
  {
    slug: 'condor-trading-agents-telegram',
    title: 'Condor: Trading Agents on Telegram',
    category: 'Announcements',
    excerpt: 'Announcing Condor — autonomous trading agents you can deploy and control via Telegram.',
    author: 'Michael Feng',
    authorAvatar: '/avatar-michael.png',
    date: 'Mar 15, 2024',
    readTime: '5 min',
    image: '/strategy-arbitrage.png',
  },
  {
    slug: 'liquid-mining-clmm',
    title: 'Liquid Mining with CLMM',
    category: 'Strategies',
    excerpt: 'Deploy concentrated liquidity market making strategies on Uniswap V3 and similar DEXs.',
    author: 'Sarah Chen',
    authorAvatar: '/avatar-sarah.png',
    date: 'Mar 28, 2024',
    readTime: '9 min',
    image: '/strategy-market-making.png',
  },
  {
    slug: 'mcp-server-ai-trading',
    title: 'MCP Server for AI Trading',
    category: 'Engineering',
    excerpt: 'How to use the Model Context Protocol to let AI assistants control your Hummingbot instances.',
    author: 'Alex Rivera',
    authorAvatar: '/avatar-alex.png',
    date: 'Apr 10, 2024',
    readTime: '7 min',
    image: '/v2-strategy-diagram.png',
  },
]

const ARTICLES_PER_PAGE = 9

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-[13px] text-[#6B7280] mb-4">
      <Link to="/" className="hover:text-[#0097A7] transition-colors duration-150">
        Home
      </Link>
      <ChevronRight size={14} className="text-[#9CA3AF]" />
      <span className="text-[#1F2937] font-medium">Documentation</span>
    </nav>
  )
}

function Tag({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'outline' | 'category' }) {
  const base = 'inline-flex items-center px-2.5 py-1 rounded text-[12px] font-medium transition-transform duration-150 hover:-translate-y-px'
  const styles = {
    default: 'bg-[#E0F4F5] text-[#0097A7]',
    outline: 'border border-[#0097A7] text-[#0097A7] bg-transparent',
    category: 'bg-[#F3F4F6] text-[#6B7280]',
  }
  return <span className={`${base} ${styles[variant]}`}>{children}</span>
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="group bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-250 hover:-translate-y-1"
    >
      <Link to={`/blog/${article.slug}`} className="block">
        <div className="overflow-hidden aspect-video">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="p-4">
          <div className="mb-2">
            <Tag variant="default">{article.category}</Tag>
          </div>
          <h4 className="text-[18px] font-medium text-[#1F2937] leading-snug mb-2 group-hover:text-[#0097A7] transition-colors duration-150">
            {article.title}
          </h4>
          <p className="text-[14px] text-[#6B7280] leading-relaxed mb-4 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-[13px] text-[#6B7280]">
            <img
              src={article.authorAvatar}
              alt={article.author}
              className="w-8 h-8 rounded-full border border-[#E5E7EB] object-cover"
            />
            <span className="font-medium text-[#374151]">{article.author}</span>
            <span className="text-[#E5E7EB]">|</span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {article.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {article.readTime}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function Docs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialSearch = searchParams.get('q') || ''
  const initialCategory = (searchParams.get('category') as Category) || 'All'

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory)
  const [displayCount, setDisplayCount] = useState(ARTICLES_PER_PAGE)
  const [loadingMore, setLoadingMore] = useState(false)

  /* Fuse search */
  const fuse = useMemo(
    () =>
      new Fuse(articles, {
        keys: ['title', 'excerpt', 'category'],
        threshold: 0.4,
      }),
    []
  )

  const filteredArticles = useMemo(() => {
    let result = articles
    if (activeCategory !== 'All') {
      result = result.filter((a) => a.category === activeCategory)
    }
    if (searchQuery.trim()) {
      result = fuse.search(searchQuery.trim()).map((r) => r.item)
    }
    return result
  }, [activeCategory, searchQuery, fuse])

  const visibleArticles = filteredArticles.slice(0, displayCount)
  const hasMore = displayCount < filteredArticles.length

  /* URL sync */
  const updateUrl = useCallback(
    (q: string, cat: Category) => {
      const params = new URLSearchParams()
      if (q.trim()) params.set('q', q.trim())
      if (cat !== 'All') params.set('category', cat)
      setSearchParams(params, { replace: true })
    },
    [setSearchParams]
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateUrl(searchQuery, activeCategory)
      setDisplayCount(ARTICLES_PER_PAGE)
    }, 150)
    return () => clearTimeout(timeout)
  }, [searchQuery, activeCategory, updateUrl])

  /* Keyboard: Escape clears search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleLoadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      setDisplayCount((c) => c + ARTICLES_PER_PAGE)
      setLoadingMore(false)
    }, 600)
  }

  const handleCategoryClick = (cat: Category) => {
    setActiveCategory(cat)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setActiveCategory('All')
  }

  return (
    <div>
      {/* ========== Section 1: Page Header ========== */}
      <section className="bg-[#F5F7FA] pt-12 pb-8">
        <div className="mx-auto max-w-content px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Breadcrumb />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="text-[36px] font-semibold text-[#1F2937] tracking-[-0.02em] leading-[1.2] text-center"
          >
            Documentation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="text-[16px] text-[#6B7280] leading-[1.65] text-center max-w-[560px] mx-auto mt-2"
          >
            Guides, tutorials, and reference documentation for the Hummingbot ecosystem.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="max-w-[640px] mx-auto mt-6 relative"
          >
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full rounded-lg bg-white border border-[#E5E7EB] pl-11 pr-10 py-3 text-[15px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all duration-150 focus:border-[#0097A7] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </motion.div>

          {/* Category tabs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-6"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="relative px-4 py-2 rounded-md text-[14px] font-medium transition-colors duration-150"
                style={{
                  background: activeCategory === cat ? '#0097A7' : 'transparent',
                  color: activeCategory === cat ? '#FFFFFF' : '#6B7280',
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.background = '#F3F4F6'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.span
                    layoutId="docs-category-pill"
                    className="absolute inset-0 bg-[#0097A7] rounded-md -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== Section 2: Article Grid ========== */}
      <section className="bg-white py-8 pb-16">
        <div className="mx-auto max-w-content px-6">
          <AnimatePresence mode="popLayout">
            {visibleArticles.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visibleArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <Search size={48} className="text-[#9CA3AF] mb-4" />
                <h4 className="text-[18px] font-medium text-[#6B7280] mb-2">No results found</h4>
                <p className="text-[14px] text-[#9CA3AF] mb-6">
                  Try adjusting your search terms or browse all categories.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 rounded-md border border-[#E5E7EB] text-[14px] font-medium text-[#374151] hover:border-[#0097A7] hover:text-[#0097A7] transition-colors duration-150"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========== Section 3: Load More ========== */}
          {visibleArticles.length > 0 && (
            <div className="flex justify-center mt-10">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-md border border-[#E5E7EB] bg-white text-[14px] font-medium text-[#374151] hover:border-[#0097A7] hover:text-[#0097A7] transition-colors duration-150 disabled:opacity-60"
                >
                  {loadingMore && <Loader2 size={16} className="animate-spin" />}
                  Load more articles
                </button>
              ) : filteredArticles.length > ARTICLES_PER_PAGE ? (
                <span className="text-[14px] text-[#9CA3AF]">All articles loaded</span>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

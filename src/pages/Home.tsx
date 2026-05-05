import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Terminal,
  Bot,
  FlaskConical,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Calendar,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ */
/*  Home Page                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Hero sequenced entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      heroTl
        .fromTo('.hero-preheadline', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 0)
        .fromTo('.hero-headline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1)
        .fromTo('.hero-subheadline', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2)
        .fromTo('.hero-ctas', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 0.35)
        .fromTo('.hero-social', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.45)
        .fromTo('.hero-image', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, 0.2)

      // Quick Start section
      gsap.fromTo(
        '.qs-title',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, scrollTrigger: { trigger: '#quickstart', start: 'top 80%' } }
      )
      gsap.fromTo(
        '.qs-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: '#quickstart', start: 'top 80%' } }
      )

      // Architecture section
      gsap.fromTo(
        '.arch-left',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '#architecture', start: 'top 75%' } }
      )
      gsap.fromTo(
        '.arch-right',
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.15, scrollTrigger: { trigger: '#architecture', start: 'top 75%' } }
      )
      gsap.fromTo(
        '.arch-feature',
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, delay: 0.2, scrollTrigger: { trigger: '#architecture', start: 'top 75%' } }
      )

      // Stats section
      gsap.fromTo(
        '.stat-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '#stats', start: 'top 85%' } }
      )

      // Articles section
      gsap.fromTo(
        '.articles-header',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, scrollTrigger: { trigger: '#articles', start: 'top 80%' } }
      )
      gsap.fromTo(
        '.article-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '#articles', start: 'top 80%' } }
      )
    }, containerRef)

    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <HeroSection />
      <QuickStartSection />
      <ArchitectureSection />
      <StatsSection />
      <ArticlesSection />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section className="w-full bg-[#F5F7FA]" style={{ padding: '80px 0 60px' }}>
      <div className="mx-auto max-w-content px-6 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
        {/* Left: Text */}
        <div className="order-2 lg:order-1">
          <div className="hero-preheadline inline-flex items-center gap-2 mb-4 opacity-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0097A7]" />
            <span className="text-[12px] font-medium text-[#0097A7] tracking-[0.1em] uppercase">
              Open Source &bull; Apache 2.0
            </span>
          </div>

          <h1 className="hero-headline text-[36px] font-semibold text-[#1F2937] leading-[1.2] tracking-[-0.02em] opacity-0">
            Build and Deploy Algorithmic Trading Bots
          </h1>

          <p className="hero-subheadline text-[16px] text-[#6B7280] leading-[1.65] mt-4 max-w-[540px] opacity-0">
            Hummingbot is an open-source Python framework that helps you create automated trading strategies.
            Connect to 140+ exchanges and deploy with a single command.
          </p>

          <div className="hero-ctas flex flex-wrap items-center gap-3 mt-8 opacity-0">
            <a
              href="#quickstart"
              className="inline-flex items-center justify-center bg-[#0097A7] text-white text-[15px] font-medium rounded-md px-6 py-3 hover:bg-[#007A87] transition-all duration-150 hover:-translate-y-px"
              style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)' }}
            >
              Get Started
            </a>
            <a
              href="https://github.com/hummingbot/hummingbot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-transparent text-[#0097A7] border border-[#0097A7] text-[15px] font-medium rounded-md px-6 py-3 hover:bg-[#E0F4F5] transition-all duration-150"
            >
              View on GitHub
            </a>
          </div>

          <div className="hero-social flex flex-wrap items-center gap-3 mt-6 text-[13px] text-[#9CA3AF] opacity-0">
            <span className="inline-flex items-center gap-1">
              <Star size={13} className="text-[#F59E0B]" />
              8.2k
            </span>
            <span className="text-[#D1D5DB]">|</span>
            <span>34B+ Trading Volume</span>
            <span className="text-[#D1D5DB]">|</span>
            <span>140+ Connectors</span>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="order-1 lg:order-2 flex items-center justify-center">
          <img
            src="/hero-illustration.png"
            alt="Hummingbot Algorithmic Trading"
            className="hero-image w-full max-w-full h-auto opacity-0"
            style={{ animation: 'float 4s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Quick Start Section                                                */
/* ------------------------------------------------------------------ */

const pathways = [
  {
    icon: Terminal,
    title: 'Hummingbot Client',
    description: 'Install locally with Docker. Best for learning, running single bots, and command-line control.',
    link: '/docs',
    linkText: 'Quickstart Guide',
  },
  {
    icon: Bot,
    title: 'Condor (Trading Agents)',
    description: 'Deploy autonomous trading agents via Telegram. Cloud-native, multi-bot orchestration for production traders.',
    link: '/strategies',
    linkText: 'Deploy Condor',
  },
  {
    icon: FlaskConical,
    title: 'Quants Lab',
    description: 'Jupyter notebooks for quantitative research. Fetch market data, backtest strategies, and analyze performance.',
    link: '/developers',
    linkText: 'Explore Notebooks',
  },
]

function QuickStartSection() {
  return (
    <section id="quickstart" className="w-full bg-white" style={{ padding: '64px 0' }}>
      <div className="mx-auto max-w-content px-6">
        <div className="text-center qs-title">
          <h2 className="text-[28px] font-semibold text-[#1F2937] tracking-[-0.01em] mb-2">
            Choose Your Path
          </h2>
          <p className="text-[16px] text-[#6B7280] leading-[1.65] max-w-[560px] mx-auto mb-10">
            Whether you're a trader, developer, or researcher, Hummingbot has a path for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pathways.map((p) => (
            <Link
              key={p.title}
              to={p.link}
              className="qs-card group block bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0097A7] transition-all duration-250 opacity-0"
            >
              <div className="mb-4 transition-transform duration-200 group-hover:scale-[1.08]">
                <p.icon size={48} className="text-[#0097A7]" />
              </div>
              <h3 className="text-[18px] font-medium text-[#1F2937] mb-2">{p.title}</h3>
              <p className="text-[14px] text-[#6B7280] leading-[1.6] mb-4">{p.description}</p>
              <span className="inline-flex items-center gap-1 text-[14px] font-medium text-[#0097A7]">
                {p.linkText}
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Architecture Section                                               */
/* ------------------------------------------------------------------ */

const archFeatures = [
  'Connect to 140+ CEX and DEX venues',
  'V2 Strategy Framework with backtesting',
  'REST & WebSocket API for external integrations',
  'Dashboard UI for multi-bot deployment',
]

function ArchitectureSection() {
  return (
    <section id="architecture" className="w-full bg-[#F5F7FA]" style={{ padding: '80px 0' }}>
      <div className="mx-auto max-w-content px-6 grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 items-center">
        {/* Left: Text */}
        <div className="arch-left">
          <span className="text-[12px] font-semibold text-[#0097A7] uppercase tracking-[0.1em]">
            Architecture
          </span>
          <h2 className="text-[28px] font-semibold text-[#1F2937] tracking-[-0.01em] mt-2">
            Modular by Design
          </h2>
          <p className="text-[16px] text-[#6B7280] leading-[1.65] mt-4">
            Hummingbot is built as a collection of loosely-coupled components. Mix and match Client, Gateway, Dashboard, and API to build your ideal trading stack.
          </p>

          <div className="mt-6 space-y-4">
            {archFeatures.map((feat) => (
              <div key={feat} className="arch-feature flex items-start gap-3 opacity-0">
                <CheckCircle2 size={20} className="text-[#0097A7] mt-0.5 shrink-0" />
                <span className="text-[14px] text-[#374151] leading-[1.6]">{feat}</span>
              </div>
            ))}
          </div>

          <Link
            to="/developers"
            className="inline-flex items-center gap-1 text-[14px] font-medium text-[#0097A7] mt-6 hover:underline"
          >
            Explore Components
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Right: Diagram */}
        <div className="arch-right opacity-0">
          <img
            src="/framework-architecture.png"
            alt="Hummingbot Framework Architecture"
            className="w-full rounded-xl border border-[#E5E7EB] shadow-sm"
          />
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            {['Client', 'Gateway', 'API', 'Dashboard', 'Condor', 'MCP'].map((label) => (
              <span key={label} className="text-[12px] font-medium text-[#9CA3AF] tracking-[0.02em]">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Stats Section                                                      */
/* ------------------------------------------------------------------ */

const stats = [
  { value: '$34B+', label: 'Total reported volume', raw: 34 },
  { value: '140+', label: 'Exchange & DEX connectors', raw: 140 },
  { value: '25K+', label: 'Discord members', raw: 25 },
  { value: '8.2K+', label: 'Open source contributors', raw: 8.2 },
]

function StatsSection() {
  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0))
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            const duration = 1200
            const start = performance.now()
            const targets = stats.map((s) => s.raw)

            const tick = (now: number) => {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              // ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3)
              setAnimatedValues(targets.map((t) => Math.round(t * eased * 10) / 10))
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const formatStat = (index: number, original: string) => {
    if (original.startsWith('$')) return `$${animatedValues[index]}B+`
    if (original.endsWith('K+')) return `${animatedValues[index]}K+`
    return `${Math.round(animatedValues[index])}+`
  }

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="w-full bg-white border-y border-[#E5E7EB]"
      style={{ padding: '40px 0' }}
    >
      <div className="mx-auto max-w-content px-6 grid grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`stat-item text-center py-4 opacity-0 ${i < stats.length - 1 ? 'lg:border-r border-[#E5E7EB]' : ''} ${i % 2 === 0 ? 'border-r border-[#E5E7EB] lg:border-r' : 'border-r-0 lg:border-r'} ${i === stats.length - 1 ? 'border-r-0' : ''}`}
          >
            <div className="text-[32px] font-bold text-[#0097A7]">
              {formatStat(i, stat.value)}
            </div>
            <div className="text-[13px] text-[#6B7280] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Articles Section                                                   */
/* ------------------------------------------------------------------ */

const articles = [
  {
    thumbnail: '/v2-strategy-diagram.png',
    tag: 'Announcements',
    title: 'Introducing V2 Strategies',
    excerpt:
      'V2 strategies bring unparalleled modularity, real-time adaptability, and backtesting capabilities to your trading arsenal.',
    author: 'Michael Feng',
    avatar: '/avatar-michael.png',
    date: 'Nov 29, 2023',
    readTime: '3 min read',
    slug: 'v2-strategies',
  },
  {
    thumbnail: '/strategy-market-making.png',
    tag: 'Engineering',
    title: 'Market Making with Bollinger Bands',
    excerpt:
      'Learn how to deploy a market making strategy that places buy orders near the lower Bollinger Band and sell orders near the upper band.',
    author: 'Sarah Chen',
    avatar: '/avatar-sarah.png',
    date: 'Dec 15, 2023',
    readTime: '8 min read',
    slug: 'market-making-bollinger',
  },
  {
    thumbnail: '/strategy-arbitrage.png',
    tag: 'Tutorials',
    title: 'Cross-Exchange Arbitrage 101',
    excerpt:
      'A step-by-step guide to setting up your first arbitrage bot across centralized and decentralized exchanges.',
    author: 'Alex Rivera',
    avatar: '/avatar-alex.png',
    date: 'Jan 8, 2024',
    readTime: '12 min read',
    slug: 'cross-exchange-arbitrage',
  },
]

function ArticlesSection() {
  return (
    <section id="articles" className="w-full bg-white" style={{ padding: '64px 0' }}>
      <div className="mx-auto max-w-content px-6">
        {/* Header */}
        <div className="articles-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 opacity-0">
          <h2 className="text-[28px] font-semibold text-[#1F2937] tracking-[-0.01em]">
            Latest from the Blog
          </h2>
          <Link
            to="/blog/v2-strategies"
            className="inline-flex items-center gap-1 text-[14px] font-medium text-[#0097A7] hover:underline"
          >
            View all articles
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className="article-card group block bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-250 opacity-0"
            >
              <div className="overflow-hidden">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-4 pt-4">
                <span className="inline-block px-2.5 py-1 rounded text-[12px] font-medium bg-[#E0F4F5] text-[#0097A7] mb-2">
                  {article.tag}
                </span>
                <h3 className="text-[18px] font-medium text-[#1F2937] leading-[1.4] mb-2">
                  {article.title}
                </h3>
                <p className="text-[14px] text-[#6B7280] leading-[1.6]">{article.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-4 mt-3 border-t border-[#E5E7EB]">
                <img
                  src={article.avatar}
                  alt={article.author}
                  className="w-6 h-6 rounded-full object-cover border border-[#E5E7EB]"
                />
                <span className="text-[12px] font-medium text-[#9CA3AF]">{article.author}</span>
                <span className="text-[12px] text-[#D1D5DB]">|</span>
                <span className="inline-flex items-center gap-1 text-[12px] text-[#9CA3AF]">
                  <Calendar size={11} />
                  {article.date}
                </span>
                <span className="text-[12px] text-[#D1D5DB]">|</span>
                <span className="inline-flex items-center gap-1 text-[12px] text-[#9CA3AF]">
                  <Clock size={11} />
                  {article.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Menu, X, Github } from 'lucide-react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Documentation', to: '/docs' },
  { label: 'Developers', to: '/developers' },
  { label: 'Strategies', to: '/strategies' },
  { label: 'Blog', to: '/blog/v2-strategies' },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB]"
      style={scrolled ? { boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)' } : undefined}
    >
      <div className="mx-auto max-w-content px-6 h-[60px] flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo-hummingbird.svg" alt="Hummingbot" className="w-8 h-8" />
          <span className="text-[18px] font-semibold text-[#1F2937]">Hummingbot</span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
            return (
              <Link
                key={link.label}
                to={link.to}
                className="relative text-[14px] font-medium transition-colors duration-150"
                style={{ color: isActive ? '#0097A7' : '#6B7280' }}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-[#0097A7]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right: Search + GitHub */}
        <div className="hidden md:flex items-center gap-4">
          <div
            className="flex items-center gap-2 rounded-md border px-3 py-1.5 transition-colors duration-150"
            style={{
              background: searchFocused ? '#FFFFFF' : '#F3F4F6',
              borderColor: searchFocused ? '#0097A7' : '#E5E7EB',
              width: 200,
            }}
          >
            <Search size={14} className="text-[#9CA3AF] shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-[14px] text-[#1F2937] placeholder:text-[#9CA3AF] w-full"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
          <a
            href="https://github.com/hummingbot/hummingbot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[14px] text-[#6B7280] hover:text-[#1F2937] transition-colors duration-150"
          >
            <Github size={16} />
            <span>hummingbot/hummingbot</span>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#6B7280]"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-b border-[#E5E7EB] px-6 pb-4"
        >
          <nav className="flex flex-col gap-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[14px] font-medium py-2"
                style={{
                  color: location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
                    ? '#0097A7'
                    : '#6B7280',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}

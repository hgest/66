import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-84px 0px -60% 0px',
        threshold: 0,
      }
    )

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 84 // nav-height + 24px
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="lg:sticky lg:top-[84px] lg:self-start"
    >
      <h4 className="text-[13px] font-semibold uppercase tracking-[0.05em] text-[#6B7280] mb-4">
        Table of contents
      </h4>
      <nav className="flex flex-col">
        {items.map((item) => {
          const isActive = activeId === item.id
          const isH3 = item.level === 3
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="text-left transition-colors duration-150"
              style={{
                fontSize: '13px',
                fontWeight: isH3 ? 400 : 500,
                color: isActive ? '#0097A7' : isH3 ? '#9CA3AF' : '#6B7280',
                padding: isH3 ? '4px 0 4px 12px' : '6px 0',
                borderLeft: isActive ? '2px solid #0097A7' : '2px solid transparent',
                paddingLeft: isActive
                  ? isH3
                    ? '10px'
                    : '10px'
                  : isH3
                    ? '12px'
                    : undefined,
              }}
            >
              <span className="hover:text-[#0097A7] transition-colors duration-150">
                {item.text}
              </span>
            </button>
          )
        })}
      </nav>
    </motion.aside>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const productLinks = [
  { label: 'Documentation', to: '/docs' },
  { label: 'Strategies', to: '/strategies' },
  { label: 'Developers', to: '/developers' },
  { label: 'Blog', to: '/blog/v2-strategies' },
]

const resourceLinks = [
  { label: 'Blog', to: '/blog/v2-strategies' },
  { label: 'Academy', to: '/docs' },
  { label: 'FAQ', to: '/docs' },
  { label: 'Glossary', to: '/docs' },
]

const communityLinks = [
  { label: 'GitHub', href: 'https://github.com/hummingbot/hummingbot' },
  { label: 'Discord', href: 'https://discord.gg/hummingbot' },
  { label: 'Newsletter', href: '#' },
  { label: 'Contribute', href: 'https://github.com/hummingbot/hummingbot' },
]

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="w-full bg-[#F5F7FA] border-t border-[#E5E7EB]"
    >
      <div className="mx-auto max-w-content px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-hummingbird.svg" alt="Hummingbot" className="w-6 h-6" />
              <span className="text-[16px] font-semibold text-[#1F2937]">Hummingbot</span>
            </div>
            <p className="text-[14px] text-[#6B7280] leading-relaxed mb-4">
              Open source framework for building automated crypto trading bots.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/hummingbot/hummingbot" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <img src="/social-github.svg" alt="" className="w-5 h-5" />
              </a>
              <a href="https://discord.gg/hummingbot" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                <img src="/social-discord.svg" alt="" className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/hummingbot" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <img src="/social-twitter.svg" alt="" className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/hummingbot" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <img src="/social-youtube.svg" alt="" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#1F2937] mb-4">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[14px] text-[#6B7280] hover:text-[#0097A7] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#1F2937] mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[14px] text-[#6B7280] hover:text-[#0097A7] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Community */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#1F2937] mb-4">Community</h4>
            <ul className="space-y-2.5">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-[#6B7280] hover:text-[#0097A7] transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[13px] text-[#9CA3AF]">
            &copy; 2024 Hummingbot Foundation. Apache 2.0 License.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[13px] text-[#6B7280] hover:text-[#0097A7] transition-colors duration-150">
              Privacy
            </a>
            <a href="#" className="text-[13px] text-[#6B7280] hover:text-[#0097A7] transition-colors duration-150">
              Terms
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

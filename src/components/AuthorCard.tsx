import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react'

export default function AuthorCard() {
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

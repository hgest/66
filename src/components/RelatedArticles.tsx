import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Article {
  title: string
  category: string
  author: string
  authorAvatar: string
  slug: string
}

const articles: Article[] = [
  {
    title: 'Building a Custom Connector',
    category: 'Engineering',
    author: 'Michael Feng',
    authorAvatar: '/avatar-michael.png',
    slug: 'custom-connector',
  },
  {
    title: 'Backtesting with V2 Framework',
    category: 'Engineering',
    author: 'Sarah Chen',
    authorAvatar: '/avatar-sarah.png',
    slug: 'backtesting-v2',
  },
  {
    title: 'Market Making with Bollinger Bands',
    category: 'Tutorials',
    author: 'Sarah Chen',
    authorAvatar: '/avatar-sarah.png',
    slug: 'bollinger-bands',
  },
]

export default function RelatedArticles() {
  return (
    <section className="bg-[#F5F7FA] py-12 md:py-16">
      <div className="mx-auto max-w-content px-6">
        <h3 className="text-[22px] font-semibold text-[#1F2937] mb-6">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
              }}
            >
              <Link
                to={`/blog/${article.slug}`}
                className="group block bg-white rounded-lg border border-[#E5E7EB] p-5 hover:shadow-md transition-shadow duration-250"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex px-2.5 py-0.5 rounded text-[12px] font-medium bg-[#E0F4F5] text-[#0097A7]">
                    {article.category}
                  </span>
                </div>
                <h4 className="text-[16px] font-medium text-[#1F2937] mb-3 group-hover:text-[#0097A7] transition-colors duration-150">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2">
                  <img
                    src={article.authorAvatar}
                    alt={article.author}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-[13px] text-[#6B7280]">{article.author}</span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-[13px] font-medium text-[#0097A7] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  Read more
                  <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

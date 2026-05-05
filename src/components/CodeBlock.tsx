import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export default function CodeBlock({ code, language = 'python', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-lg border border-[#E5E7EB] overflow-hidden my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          {filename ? (
            <span className="text-[13px] font-medium text-[#374151]">{filename}</span>
          ) : (
            <span className="text-[12px] font-medium uppercase tracking-wide text-[#6B7280]">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B7280] hover:text-[#0097A7] transition-colors duration-150 px-2 py-1 rounded"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} className="text-[#10B981]" />
              <span className="text-[#10B981]">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code */}
      <div className="bg-[#F3F4F6]">
        <SyntaxHighlighter
          language={language}
          style={oneLight}
          customStyle={{
            margin: 0,
            padding: '16px 20px',
            fontSize: '14px',
            lineHeight: '1.6',
            background: '#F3F4F6',
            fontFamily: "'JetBrains Mono', monospace",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px',
            },
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

declare module 'react-syntax-highlighter' {
  import type { ComponentType, ReactNode } from 'react'

  export interface SyntaxHighlighterProps {
    language?: string
    style?: Record<string, React.CSSProperties>
    customStyle?: React.CSSProperties
    children: ReactNode
    className?: string
    showLineNumbers?: boolean
    wrapLines?: boolean
    lineProps?: Record<string, unknown> | ((lineNumber: number) => Record<string, unknown>)
    [key: string]: unknown
  }

  export const Prism: ComponentType<SyntaxHighlighterProps>
  export const Light: ComponentType<SyntaxHighlighterProps>
}

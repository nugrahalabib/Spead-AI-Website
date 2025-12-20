import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
    return (
        <div className={`prose prose-invert max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    // Custom styling for specific elements if needed
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-neutral-300" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1 text-neutral-300" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-neutral-300" {...props} />,
                    li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-neutral-700 pl-4 py-1 my-4 italic text-neutral-400 bg-white/5 rounded-r" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                        <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors" {...props} />
                    ),
                    code: ({ node, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match && !String(children).includes('\n')
                        return isInline ? (
                            <code className="bg-white/10 rounded px-1.5 py-0.5 text-sm font-mono text-indigo-300" {...props}>
                                {children}
                            </code>
                        ) : (
                            <code className="block bg-[#0d1117] p-4 rounded-lg overflow-x-auto text-sm font-mono my-4 border border-white/10" {...props}>
                                {children}
                            </code>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;

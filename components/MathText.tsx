import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split by $...$ to find LaTeX segments
  // Regex: /(\$[^\$]+\$)/g matches strings enclosed in $
  const parts = text.split(/(\$[^\$]+\$)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const math = part.slice(1, -1); // Remove $
          try {
            const html = katex.renderToString(math, {
              throwOnError: false,
              displayMode: false, // Inline math
              output: 'html', // Generate HTML output
            });
            return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (error) {
            console.warn("KaTeX render error:", error);
            // Fallback to displaying raw text if render fails
            return <span key={index} className="text-red-500">{part}</span>;
          }
        }
        // Normal text
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default MathText;
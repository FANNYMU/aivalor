import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiCornerDownRight } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../context/ChatContext';
import { useFile } from '../context/FileContext';

// Parser untuk teks Arab dengan format XML
const parseArabicText = (content) => {
  if (!content) return '';
  
  // Escape karakter khusus HTML untuk mencegah XSS kecuali markdown
  const escapeHtml = (text) => {
    return text
      .replace(/&(?!#?\w+;)/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Parse teks Arab dengan regex yang aman
  return content.replace(
    /<arabic>(.*?)<\/arabic>/g,
    (_, arabicText) => `<span class="arabic" dir="rtl">${escapeHtml(arabicText)}</span>`
  );
};

// Custom renderer untuk ReactMarkdown
const MarkdownRenderer = ({ children }) => {
  const parsedContent = parseArabicText(children);
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-4">{children}</p>,
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
        ul: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4">{children}</blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-gray-800 rounded px-2 py-1">{children}</code>
        ),
        pre: ({ children }) => (
          <pre className="bg-gray-800 rounded p-4 my-4 overflow-x-auto">{children}</pre>
        ),
      }}
    >
      {parsedContent}
    </ReactMarkdown>
  );
};

const SpecialContent = ({ content, type }) => {
  const [scale, setScale] = useState(1);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const adjustTextSize = () => {
      if (textRef.current && containerRef.current) {
        const container = containerRef.current;
        const text = textRef.current;
        const containerWidth = container.offsetWidth;
        const textWidth = text.scrollWidth;
        
        if (textWidth > containerWidth * 0.9) {
          const newScale = (containerWidth * 0.9) / textWidth;
          setScale(Math.max(newScale, 0.5));
        } else {
          setScale(1);
        }
      }
    };

    adjustTextSize();
    window.addEventListener('resize', adjustTextSize);
    return () => window.removeEventListener('resize', adjustTextSize);
  }, [content]);

  // Fungsi untuk memformat konten matematika
  const formatMathContent = (text) => {
    return text
      // Format pangkat
      .replace(/\^(\d+)/g, '<sup>$1</sup>')
      // Format perkalian
      .replace(/(\d+|\))\s*x\s*(\d+|[a-zA-Z])/g, '$1 × $2')
      // Format pembagian
      .replace(/\//g, '÷')
      // Format variabel dengan pangkat
      .replace(/([a-zA-Z])(\d+)/g, '$1<sup>$2</sup>')
      // Tambahkan spasi di sekitar operator
      .replace(/([+\-×÷=])/g, ' $1 ')
      // Format tanda kurung
      .replace(/\(/g, '<span class="math-bracket">(</span>')
      .replace(/\)/g, '<span class="math-bracket">)</span>');
  };

  const getContentStyle = () => {
    const baseStyle = {
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
      transition: 'transform 0.2s ease',
      padding: '0.75rem 2rem',
      borderRadius: '0.5rem',
      display: 'inline-block',
      minWidth: '60%',
      maxWidth: '90%',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: 'rgba(0,0,0,0.2)',
    };

    switch (type) {
      case 'arabic':
        return {
          ...baseStyle,
          fontFamily: "'Noto Naskh Arabic', serif",
          direction: 'rtl',
          fontSize: '1.75rem',
          lineHeight: '2.5rem',
        };
      case 'math':
        return {
          ...baseStyle,
          fontFamily: "'Cambria Math', 'Times New Roman', serif",
          fontSize: '1.5rem',
          lineHeight: '2rem',
          letterSpacing: '0.05em',
          '& sup': {
            fontSize: '0.75em',
            position: 'relative',
            top: '-0.5em',
          },
          '& .math-bracket': {
            color: '#4B9FFF',
            marginRight: '0.1em',
            marginLeft: '0.1em',
          },
        };
      case 'chemistry':
        return {
          ...baseStyle,
          fontFamily: "'Arial', sans-serif",
          fontSize: '1.25rem',
          lineHeight: '1.75rem',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div ref={containerRef} className="my-4">
      <div className="text-center relative">
        <div
          ref={textRef}
          className={`special-content ${type}`}
          style={getContentStyle()}
          dangerouslySetInnerHTML={{
            __html: type === 'math' ? formatMathContent(content) : content
          }}
        />
      </div>
    </div>
  );
};

const MarkdownWithSpecialContent = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none">
      {content.split(/(\[(?:arabic|math|chemistry)\].*?\[\/(?:arabic|math|chemistry)\])/g).map((segment, index) => {
        const specialContentMatch = segment.match(/\[(arabic|math|chemistry)\](.*?)\[\/\1\]/);
        
        if (specialContentMatch) {
          const [, type, content] = specialContentMatch;
          return <SpecialContent key={index} content={content} type={type} />;
        }

        // Untuk teks biasa
        return (
          <ReactMarkdown
            key={index}
            components={{
              p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
              li: ({ children }) => <li className="mb-2">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4">{children}</blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-800 rounded px-2 py-1">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-800 rounded p-4 my-4 overflow-x-auto">{children}</pre>
              ),
            }}
          >
            {segment}
          </ReactMarkdown>
        );
      })}
    </div>
  );
};

const MarkdownWithArabic = ({ content }) => {
  // Pertama, kita pisahkan teks Arab dan non-Arab
  const segments = content.split(/((?:<arabic>.*?<\/arabic>))/g);
  
  // Fungsi untuk memproses teks setelah Arab
  const processArabicFollowingText = (text) => {
    // Mencari pola (Transliterasi: ...) dan Artinya: "..."
    const transliterationMatch = text.match(/\(Transliterasi: (.*?)\)/);
    const meaningMatch = text.match(/Artinya: ["']?(.*?)["']?$/);

    if (transliterationMatch && meaningMatch) {
      return (
        <div className="text-gray-300 text-center my-2" style={{ fontSize: '1rem' }}>
          <div className="flex items-center justify-center">
            <span className="text-blue-500" style={{ fontSize: '2rem', margin: '0 1rem', lineHeight: '1' }}>┃</span>
            <span className="text-gray-200 px-4">{transliterationMatch[1]}</span>
            <span className="text-blue-500" style={{ fontSize: '2rem', margin: '0 1rem', lineHeight: '1' }}>┃</span>
            <span className="text-gray-200 px-4">{meaningMatch[1]}</span>
            <span className="text-blue-500" style={{ fontSize: '2rem', margin: '0 1rem', lineHeight: '1' }}>┃</span>
          </div>
        </div>
      );
    }
    return text;
  };
  
  return (
    <div className="prose prose-invert max-w-none">
      {segments.map((segment, index) => {
        if (segment.startsWith('<arabic>')) {
          // Untuk teks Arab, kita ekstrak dan render dengan styling yang tepat
          const arabicText = segment.replace(/<\/?arabic>/g, '');
          return (
            <div key={index} className="my-4">
              <div className="text-center">
                <span
                  className="arabic block"
                  style={{
                    fontFamily: "'Noto Naskh Arabic', serif",
                    fontSize: "1.75rem",
                    direction: 'rtl',
                    lineHeight: '2.5rem',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '0.5rem',
                    display: 'inline-block',
                    minWidth: '60%',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {arabicText}
                </span>
              </div>
            </div>
          );
        } else {
          // Cek apakah ini adalah teks yang mengikuti Arabic
          if (segment.includes('(Transliterasi:') && segment.includes('Artinya:')) {
            return <React.Fragment key={index}>{processArabicFollowingText(segment)}</React.Fragment>;
          }
          // Untuk teks non-Arab lainnya, gunakan ReactMarkdown
          return (
            <ReactMarkdown
              key={index}
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
                li: ({ children }) => <li className="mb-2">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4">{children}</blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-800 rounded px-2 py-1">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-800 rounded p-4 my-4 overflow-x-auto">{children}</pre>
                ),
              }}
            >
              {segment}
            </ReactMarkdown>
          );
        }
      })}
    </div>
  );
};

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendQuestion } = useChat();
  const { fileContent, file } = useFile();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !fileContent) return;

    await sendQuestion(input.trim(), fileContent);
    setInput('');
  };

  if (!file) {
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-[#1a1b26] rounded-lg overflow-hidden border border-[#2d2d3b]">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-4xl mb-2">👋</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-200">
              Silahkan ajukan pertanyaan
            </h2>
            <p className="text-gray-400 max-w-md">
              AI akan menjawab pertanyaan Anda berdasarkan isi file yang telah diunggah
            </p>
          </motion.div>
        ) : (
          <div className="divide-y divide-[#2d2d3b]">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`px-4 py-6 ${
                  message.role === 'assistant' ? 'bg-[#1e1f2e]' : 'bg-[#1a1b26]'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-3xl mx-auto flex gap-6">
                  <div className="flex-shrink-0 w-8 h-8">
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 rounded-full bg-[#2d2d3b] flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-[#a9b1d6]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#7aa2f7] flex items-center justify-center">
                        <svg 
                          viewBox="0 0 24 24" 
                          className="w-5 h-5 text-white"
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 7V12L15 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 16V16.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[#a9b1d6] font-medium">
                        {message.role === 'user' ? 'Anda' : 'AI'}
                      </span>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      {message.role === 'assistant' ? (
                        <MarkdownWithSpecialContent content={message.content} />
                      ) : (
                        <p className="text-[#a9b1d6] leading-7">{message.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[#2d2d3b] bg-[#1a1b26] p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan di sini..."
              className="w-full p-4 pr-12 bg-[#1e1f2e] text-[#a9b1d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7aa2f7] placeholder-[#565f89] border border-[#2d2d3b]"
              disabled={isLoading || !fileContent}
            />
            <motion.button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565f89] hover:text-[#7aa2f7] disabled:text-[#41435c] disabled:hover:text-[#41435c]"
              disabled={isLoading || !input.trim() || !fileContent}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-t-2 border-[#7aa2f7] rounded-full animate-spin"></div>
              ) : (
                <FiSend size={20} />
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
} 
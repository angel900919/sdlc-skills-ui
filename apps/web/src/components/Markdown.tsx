import { useEffect, useId, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { Box, Typography } from '@mui/material';
import { palette } from '../theme.js';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: palette.surface,
    primaryColor: '#16314a',
    primaryTextColor: palette.text,
    lineColor: palette.muted,
    fontFamily: 'IBM Plex Sans, sans-serif',
  },
});

function MermaidBlock({ code }: { code: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    mermaid
      .render(`m${id}`, code)
      .then((r) => !cancelled && setSvg(r.svg))
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <Box sx={{ border: `1px solid ${palette.red}44`, borderRadius: 1, p: 1.5, my: 1 }}>
        <Typography sx={{ color: palette.red, fontSize: 12, mb: 1 }}>Mermaid render failed: {error}</Typography>
        <pre style={{ margin: 0, fontSize: 12, overflow: 'auto' }}>{code}</pre>
      </Box>
    );
  }
  if (!svg) return <Box sx={{ color: palette.muted, fontSize: 12, my: 1 }}>Rendering diagram…</Box>;
  return (
    <Box
      sx={{ my: 1.5, p: 1.5, background: palette.bg, border: `1px solid ${palette.hairline}`, borderRadius: 1, overflowX: 'auto', '& svg': { maxWidth: '100%' } }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function Markdown({ content }: { content: string }) {
  return (
    <Box
      sx={{
        fontSize: 13.5, lineHeight: 1.65, color: palette.text, wordBreak: 'break-word',
        '& h1, & h2, & h3, & h4': { color: palette.text, mt: 2.5, mb: 1, lineHeight: 1.3 },
        '& h1': { fontSize: 22, borderBottom: `1px solid ${palette.hairline}`, pb: 1 },
        '& h2': { fontSize: 18 },
        '& h3': { fontSize: 15 },
        '& a': { color: palette.blue },
        '& code': {
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 12.5,
          background: palette.raised, padding: '1px 5px', borderRadius: '4px',
        },
        '& pre': {
          background: palette.bg, border: `1px solid ${palette.hairline}`, borderRadius: 1,
          p: 1.5, overflow: 'auto',
        },
        '& pre code': { background: 'transparent', p: 0 },
        '& table': { borderCollapse: 'collapse', my: 1.5, display: 'block', overflowX: 'auto' },
        '& th, & td': { border: `1px solid ${palette.hairline}`, px: 1.25, py: 0.5, fontSize: 12.5, textAlign: 'left' },
        '& th': { background: palette.raised, fontWeight: 600 },
        '& blockquote': {
          borderLeft: `3px solid ${palette.hairlineBright}`, ml: 0, pl: 2, color: palette.muted,
        },
        '& hr': { border: 'none', borderTop: `1px solid ${palette.hairline}`, my: 2 },
        '& ul, & ol': { pl: 3 },
        '& li': { mb: 0.25 },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { className, children } = props;
            const match = /language-(\w+)/.exec(className ?? '');
            const text = String(children ?? '');
            if (match?.[1] === 'mermaid') return <MermaidBlock code={text} />;
            return <code className={className}>{children}</code>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}

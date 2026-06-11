import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { palette } from '../theme.js';
import { socket } from '../ws/socket.js';

/**
 * Live view of the interactive Claude Code TUI. Keystrokes go straight to
 * the PTY, so permission prompts, menus and the full Claude experience work
 * exactly as in a terminal — the dashboard never gets in Claude's way.
 */
export function TerminalView({ sessionId }: { sessionId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const term = new XTerm({
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 12.5,
      lineHeight: 1.25,
      cursorBlink: true,
      scrollback: 8000,
      theme: {
        background: palette.bg,
        foreground: palette.text,
        cursor: palette.green,
        selectionBackground: '#2a3647aa',
        black: '#1e2733', red: '#ff5c5c', green: '#2ee6a8', yellow: '#ffb454',
        blue: '#59a7ff', magenta: '#b58cff', cyan: '#4fd6e0', white: '#d8e0ea',
        brightBlack: '#4d5a6b', brightRed: '#ff8080', brightGreen: '#62f0c0',
        brightYellow: '#ffc880', brightBlue: '#86bfff', brightMagenta: '#cfb0ff',
        brightCyan: '#7fe3eb', brightWhite: '#f0f4f8',
      },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(el);
    fit.fit();

    socket.subscribe([`session:${sessionId}`]);

    const off = socket.addListener((event) => {
      if (event.type === 'terminal-data' && event.sessionId === sessionId) {
        term.write(event.data);
      }
    });

    const dataDisp = term.onData((data) => {
      socket.send({ type: 'terminal-input', sessionId, data });
    });

    const sendResize = () => {
      fit.fit();
      socket.send({ type: 'terminal-resize', sessionId, cols: term.cols, rows: term.rows });
    };
    sendResize();
    const ro = new ResizeObserver(() => sendResize());
    ro.observe(el);

    return () => {
      ro.disconnect();
      dataDisp.dispose();
      off();
      term.dispose();
    };
  }, [sessionId]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: '100%', minHeight: 0, background: palette.bg,
        '& .xterm': { height: '100%', padding: '8px' },
      }}
    />
  );
}

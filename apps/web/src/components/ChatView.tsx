import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Chip, IconButton, InputBase, Stack, Typography } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import type { TranscriptContentBlock, TranscriptMessage } from '@sdlc/shared';
import { palette, microLabel } from '../theme.js';
import { useSessionInput, useTranscript } from '../api/hooks.js';
import { socket } from '../ws/socket.js';
import { Markdown } from './Markdown.js';

function ToolUseBlock({ block }: { block: TranscriptContentBlock }) {
  const input = block.input as Record<string, unknown> | undefined;
  const hint =
    (input?.file_path as string) ||
    (input?.command as string) ||
    (input?.pattern as string) ||
    (input?.prompt as string)?.slice(0, 80) ||
    '';
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1, py: 0.25 }}>
      <Chip size="small" label={block.name ?? 'tool'} sx={{ color: palette.blue, background: `${palette.blue}14` }} />
      <Typography noWrap sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5, color: palette.muted }}>
        {String(hint).slice(0, 110)}
      </Typography>
    </Stack>
  );
}

function MessageBubble({ msg }: { msg: TranscriptMessage }) {
  const isUser = msg.role === 'user';
  const textBlocks = msg.blocks.filter((b) => b.type === 'text' && b.text?.trim());
  const toolBlocks = msg.blocks.filter((b) => b.type === 'tool_use');
  const isToolResultOnly = msg.blocks.every((b) => b.type === 'tool_result');
  if (isToolResultOnly || (textBlocks.length === 0 && toolBlocks.length === 0)) return null;

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography sx={{ ...microLabel, color: isUser ? palette.amber : palette.green, mb: 0.5 }}>
        {isUser ? 'You' : 'Claude'} · {msg.timestamp.slice(11, 19)}
      </Typography>
      {toolBlocks.map((b, i) => (
        <ToolUseBlock key={b.id ?? i} block={b} />
      ))}
      {textBlocks.map((b, i) => (
        <Box key={i} sx={{ borderLeft: `2px solid ${isUser ? palette.amber : palette.green}33`, pl: 1.5 }}>
          <Markdown content={b.text ?? ''} />
        </Box>
      ))}
    </Box>
  );
}

/**
 * Structured chat over the session transcript: REST snapshot + live tail
 * from the WebSocket. Sending a message types it into the underlying PTY.
 */
export function ChatView({ sessionId, live }: { sessionId: string; live: boolean }) {
  const { data: snapshot } = useTranscript(sessionId);
  const [liveMessages, setLiveMessages] = useState<TranscriptMessage[]>([]);
  const [draft, setDraft] = useState('');
  const sendInput = useSessionInput();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLiveMessages([]);
    return socket.addListener((event) => {
      if (event.type === 'transcript-message' && event.message.sessionId === sessionId) {
        setLiveMessages((prev) => [...prev, event.message]);
      }
    });
  }, [sessionId]);

  const messages = useMemo(() => {
    const seen = new Set<string>();
    const all: TranscriptMessage[] = [];
    for (const m of [...(snapshot ?? []), ...liveMessages]) {
      if (seen.has(m.uuid)) continue;
      seen.add(m.uuid);
      all.push(m);
    }
    return all.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [snapshot, liveMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    sendInput.mutate({ sessionId, data: text });
    setDraft('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box ref={scrollRef} sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {messages.length === 0 ? (
          <Typography sx={{ ...microLabel, p: 2 }}>
            Transcript appears here as the session produces messages
          </Typography>
        ) : (
          messages.map((m) => <MessageBubble key={m.uuid} msg={m} />)
        )}
      </Box>
      <Stack
        direction="row"
        sx={{ gap: 1, p: 1.25, borderTop: `1px solid ${palette.hairline}`, background: palette.surface, alignItems: 'flex-end' }}
      >
        <InputBase
          fullWidth
          multiline
          maxRows={6}
          placeholder={live ? 'Message Claude… (⏎ to send, ⇧⏎ for newline)' : 'Session not live — resume it to chat'}
          disabled={!live}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          sx={{ fontSize: 13, px: 1, py: 0.5, background: palette.bg, borderRadius: 1, border: `1px solid ${palette.hairline}` }}
        />
        <IconButton size="small" onClick={send} disabled={!live || !draft.trim()} sx={{ color: palette.green }}>
          <SendRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}

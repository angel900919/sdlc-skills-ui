import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, InputBase, MenuItem, Select, Stack, Typography,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import DifferenceRoundedIcon from '@mui/icons-material/DifferenceRounded';
import { palette, microLabel } from '../theme.js';
import { useBranches, useSessionDiff, useSessionInput } from '../api/hooks.js';

/**
 * Diff review panel: the session checkout vs a base branch, plus a comment
 * box that delivers review feedback straight into the live session's PTY.
 */
export function DiffView({ sessionId, live }: { sessionId: string; live: boolean }) {
  const { data: branches } = useBranches(sessionId);
  const [base, setBase] = useState('develop');
  const { data, isLoading, error } = useSessionDiff(sessionId, base);
  const sendInput = useSessionInput();
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const fileSections = useMemo(() => splitDiffByFile(data?.diff ?? ''), [data?.diff]);
  const visible = selectedFile ? fileSections.filter((f) => f.path === selectedFile) : fileSections;

  const sendComment = () => {
    const text = comment.trim();
    if (!text) return;
    sendInput.mutate(
      { sessionId, data: `Review feedback on the current diff (vs ${base}): ${text}`, submit: true },
      { onSuccess: () => setComment('') },
    );
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {/* File list */}
      <Box sx={{ width: 250, flexShrink: 0, borderRight: `1px solid ${palette.hairline}`, display: 'flex', flexDirection: 'column', background: palette.surface }}>
        <Stack sx={{ px: 1.5, py: 1.25, gap: 1 }}>
          <Typography sx={{ ...microLabel }}>Diff vs</Typography>
          <Select size="small" value={base} onChange={(e) => setBase(e.target.value)} sx={{ fontSize: 12 }}>
            {[...new Set([base, 'develop', 'main', ...(branches ?? [])])].map((b) => (
              <MenuItem key={b} value={b} sx={{ fontSize: 12 }}>{b}</MenuItem>
            ))}
          </Select>
        </Stack>
        <Box sx={{ flex: 1, overflow: 'auto', pb: 1 }}>
          <Box
            onClick={() => setSelectedFile(null)}
            sx={{ px: 1.5, py: 0.5, cursor: 'pointer', background: !selectedFile ? palette.raised : 'transparent', '&:hover': { background: palette.raised } }}
          >
            <Typography sx={{ fontSize: 12, color: palette.text }}>All files ({data?.files.length ?? 0})</Typography>
          </Box>
          {(data?.files ?? []).map((f) => (
            <Box
              key={f.path}
              onClick={() => setSelectedFile(f.path)}
              sx={{ px: 1.5, py: 0.5, cursor: 'pointer', background: selectedFile === f.path ? palette.raised : 'transparent', '&:hover': { background: palette.raised } }}
            >
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: palette.text, wordBreak: 'break-all' }}>
                {f.path}
              </Typography>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10 }}>
                <span style={{ color: palette.green }}>+{f.additions}</span>{' '}
                <span style={{ color: palette.red }}>−{f.deletions}</span>
                {f.binary && <span style={{ color: palette.faint }}> binary</span>}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Diff body + review comment */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          {isLoading && <Typography sx={{ p: 3, color: palette.muted, fontSize: 13 }}>Computing diff…</Typography>}
          {error && (
            <Typography sx={{ p: 3, color: palette.red, fontSize: 13 }}>
              Could not diff against “{base}” — pick another base branch.
            </Typography>
          )}
          {data && data.files.length === 0 && (
            <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <DifferenceRoundedIcon sx={{ color: palette.faint, fontSize: 28 }} />
              <Typography sx={{ color: palette.muted, fontSize: 13 }}>No changes vs {base}.</Typography>
            </Stack>
          )}
          {visible.map((section) => (
            <Box key={section.path} sx={{ mb: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 2, py: 0.75, position: 'sticky', top: 0, background: `${palette.surface}F2`, backdropFilter: 'blur(4px)', borderBottom: `1px solid ${palette.hairline}` }}>
                <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5, color: palette.blue }}>
                  {section.path}
                </Typography>
              </Stack>
              <Box component="pre" sx={{ m: 0, px: 2, py: 1, fontSize: 11.5, fontFamily: '"IBM Plex Mono", monospace', lineHeight: 1.5, overflowX: 'auto' }}>
                {section.lines.map((line, i) => (
                  <Box
                    key={i}
                    component="div"
                    sx={{
                      color: line.startsWith('+') ? palette.green : line.startsWith('-') ? palette.red : line.startsWith('@@') ? palette.violet : palette.muted,
                      background: line.startsWith('+') ? `${palette.green}0D` : line.startsWith('-') ? `${palette.red}0D` : 'transparent',
                      whiteSpace: 'pre',
                    }}
                  >
                    {line || ' '}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
          {data?.truncated && (
            <Chip size="small" label="diff truncated — too large to render fully" sx={{ m: 2, color: palette.amber, background: `${palette.amber}18` }} />
          )}
        </Box>

        <Stack direction="row" sx={{ gap: 1, p: 1.5, borderTop: `1px solid ${palette.hairline}`, alignItems: 'center' }}>
          <InputBase
            fullWidth
            placeholder={live ? 'Review comment — sent to the running session…' : 'Session not live — resume it to send review feedback'}
            disabled={!live}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendComment()}
            sx={{ fontSize: 12.5, background: palette.bg, border: `1px solid ${palette.hairline}`, borderRadius: 1, px: 1.25, py: 0.6 }}
          />
          <Button
            size="small"
            variant="contained"
            endIcon={<SendRoundedIcon sx={{ fontSize: 14 }} />}
            disabled={!live || !comment.trim() || sendInput.isPending}
            onClick={sendComment}
            sx={{ background: palette.blue, color: palette.bg, flexShrink: 0, '&:hover': { background: palette.blue, filter: 'brightness(1.1)' } }}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

interface DiffSection {
  path: string;
  lines: string[];
}

/** Split a unified diff into per-file sections for rendering/filtering. */
function splitDiffByFile(diff: string): DiffSection[] {
  if (!diff) return [];
  const sections: DiffSection[] = [];
  let current: DiffSection | null = null;
  for (const line of diff.split('\n')) {
    if (line.startsWith('diff --git ')) {
      if (current) sections.push(current);
      const path = line.match(/ b\/(.*)$/)?.[1] ?? line;
      current = { path, lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

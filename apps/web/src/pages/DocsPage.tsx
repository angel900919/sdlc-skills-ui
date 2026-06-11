import { useMemo, useState } from 'react';
import { Box, Collapse, InputBase, Stack, Typography } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import type { DocNode } from '@sdlc/shared';
import { palette, microLabel } from '../theme.js';
import { useAppStore } from '../store/appStore.js';
import { useDocFile, useDocsTree } from '../api/hooks.js';
import { Markdown } from '../components/Markdown.js';

function TreeNode({
  node, depth, selected, onSelect, filter,
}: {
  node: DocNode; depth: number; selected: string | null; onSelect: (p: string) => void; filter: string;
}) {
  const [open, setOpen] = useState(depth < 1);
  const matches = (n: DocNode): boolean =>
    !filter || n.name.toLowerCase().includes(filter) || (n.children ?? []).some(matches);
  if (!matches(node)) return null;

  if (node.type === 'dir') {
    return (
      <>
        <Stack
          direction="row"
          onClick={() => setOpen((o) => !o)}
          sx={{ alignItems: 'center', gap: 0.75, pl: 1 + depth * 1.5, py: 0.4, cursor: 'pointer', '&:hover': { background: palette.raised } }}
        >
          {open ? <FolderOpenRoundedIcon sx={{ fontSize: 15, color: palette.amber }} /> : <FolderRoundedIcon sx={{ fontSize: 15, color: palette.muted }} />}
          <Typography sx={{ fontSize: 12.5, color: palette.text }}>{node.name}</Typography>
        </Stack>
        <Collapse in={open || !!filter}>
          {(node.children ?? []).map((c) => (
            <TreeNode key={c.relPath} node={c} depth={depth + 1} selected={selected} onSelect={onSelect} filter={filter} />
          ))}
        </Collapse>
      </>
    );
  }
  const active = selected === node.relPath;
  return (
    <Stack
      direction="row"
      onClick={() => onSelect(node.relPath)}
      sx={{
        alignItems: 'center', gap: 0.75,
        pl: 1 + depth * 1.5, py: 0.4, cursor: 'pointer',
        background: active ? palette.raised : 'transparent',
        borderLeft: `2px solid ${active ? palette.green : 'transparent'}`,
        '&:hover': { background: palette.raised },
      }}
    >
      <DescriptionOutlinedIcon sx={{ fontSize: 14, color: active ? palette.green : palette.faint }} />
      <Typography sx={{ fontSize: 12.5, color: active ? palette.text : palette.muted }} noWrap>
        {node.name}
      </Typography>
    </Stack>
  );
}

export function DocsPage() {
  const projectId = useAppStore((s) => s.selectedProjectId);
  const { data: tree } = useDocsTree(projectId);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const { data: doc, isLoading } = useDocFile(projectId, selected);

  const normalizedFilter = filter.trim().toLowerCase();
  const isMarkdown = useMemo(() => !selected || /\.(md|markdown|human|txt)$/i.test(selected), [selected]);

  return (
    <Box sx={{ display: 'flex', height: '100%', minHeight: 0 }}>
      <Box sx={{ width: 290, flexShrink: 0, borderRight: `1px solid ${palette.hairline}`, display: 'flex', flexDirection: 'column', background: palette.surface }}>
        <Box sx={{ p: 1.5 }}>
          <Typography sx={{ ...microLabel, mb: 1 }}>Project knowledge</Typography>
          <InputBase
            fullWidth
            placeholder="Filter files…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              fontSize: 12.5, px: 1, py: 0.4, background: palette.bg,
              border: `1px solid ${palette.hairline}`, borderRadius: 1,
            }}
          />
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', pb: 2 }}>
          {(tree ?? []).map((n) => (
            <TreeNode key={n.relPath} node={n} depth={0} selected={selected} onSelect={setSelected} filter={normalizedFilter} />
          ))}
          {!tree?.length && (
            <Typography sx={{ fontSize: 12.5, color: palette.muted, p: 2 }}>
              No .ai/, .human/ or docs/ content yet. Artifacts appear here as the chain produces them.
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {selected ? (
          <Box sx={{ p: 3, maxWidth: 980 }}>
            <Typography sx={{ ...microLabel, mb: 2 }}>{selected}</Typography>
            {isLoading ? (
              <Typography sx={{ color: palette.muted }}>Loading…</Typography>
            ) : doc ? (
              isMarkdown ? (
                <Markdown content={doc.content} />
              ) : (
                <pre style={{ fontSize: 12, fontFamily: '"IBM Plex Mono", monospace', whiteSpace: 'pre-wrap' }}>{doc.content}</pre>
              )
            ) : (
              <Typography sx={{ color: palette.red }}>Could not load file.</Typography>
            )}
          </Box>
        ) : (
          <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: palette.muted, fontSize: 13 }}>
              Select an artifact — .human/ mirrors render with Mermaid diagrams.
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

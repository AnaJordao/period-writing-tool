interface HighlightTextProps {
  text: string;
  highlight: string;
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function HighlightText({ text, highlight }: HighlightTextProps) {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const escapedHighlight = escapeRegExp(highlight);
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={index}
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
              borderRadius: 4,
              padding: '0 2px',
            }}
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

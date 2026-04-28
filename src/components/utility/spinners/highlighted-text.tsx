interface Props{
    text?: string,
    highlight?:string
}

export default function HighlightedText({ text, highlight }:Props) {
  const parts = text?.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <p>
      {parts?.map((part, i) =>
        part.toLowerCase() === highlight?.toLowerCase() ? (
          <span key={i} className="highlight">{part}</span>
        ) : (
          part
        )
      )}
    </p>
  );
}
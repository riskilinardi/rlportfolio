/** A section label written as a file name ("projects.md"), like the intro's Source cards. */
export function Eyebrow({ file, className = "mb-3" }: { file: string; className?: string }) {
  const dot = file.lastIndexOf(".");
  return (
    <div className={`font-mono text-xs tracking-wide text-charcoal-muted-deep ${className}`}>
      <span className="text-accent-light">{dot > 0 ? file.slice(0, dot) : file}</span>
      {dot > 0 && file.slice(dot)}
    </div>
  );
}

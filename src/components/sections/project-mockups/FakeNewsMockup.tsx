export function FakeNewsMockup() {
  const tokens = [
    { text: "The", weight: 0.05 },
    { text: "vaccine", weight: 0.85 },
    { text: "contains", weight: 0.42 },
    { text: "microchips", weight: 0.92 },
    { text: "to", weight: 0.08 },
    { text: "track", weight: 0.61 },
    { text: "citizens", weight: 0.55 },
  ];

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 30%, rgba(239, 68, 68, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 70%, rgba(88, 166, 255, 0.25) 0%, transparent 50%),
            linear-gradient(135deg, #0d1117 0%, #161b22 100%)
          `,
        }}
      />

      <div className="absolute top-4 left-4 right-4 flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
        <div className="ml-3 h-5 flex-1 rounded-md bg-white/5 border border-white/5 flex items-center px-2">
          <div className="h-1 w-24 rounded bg-accent/30" />
        </div>
      </div>

      <div className="absolute top-14 left-4 right-4 space-y-2">
        <div className="text-[8px] uppercase tracking-wider text-white/40 font-mono">
          Verdict
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-md bg-red-500/20 border border-red-500/30 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[10px] font-display italic text-red-300">
              Likely Fake
            </span>
          </div>
          <div className="text-[10px] font-mono text-white/60">87.4%</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-[8px] text-white/40 w-12">Fake</div>
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500/60 to-red-400/80 w-[87%]" />
          </div>
          <div className="text-[8px] font-mono text-white/60 w-8 text-right">
            87%
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[8px] text-white/40 w-12">Truth</div>
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500/60 to-emerald-400/80 w-[13%]" />
          </div>
          <div className="text-[8px] font-mono text-white/60 w-8 text-right">
            13%
          </div>
        </div>
      </div>

      <div className="absolute top-[160px] left-4 right-4">
        <div className="text-[8px] uppercase tracking-wider text-white/40 font-mono mb-2">
          Token attribution
        </div>
        <div className="flex flex-wrap gap-1">
          {tokens.map((token, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded text-[9px] font-mono"
              style={{
                backgroundColor: `rgba(239, 68, 68, ${token.weight * 0.35})`,
                color:
                  token.weight > 0.5
                    ? "rgba(255, 220, 220, 0.95)"
                    : "rgba(255, 255, 255, 0.7)",
                borderBottom:
                  token.weight > 0.5
                    ? "1px solid rgba(239, 68, 68, 0.6)"
                    : "1px solid transparent",
                animation: `float ${3 + i * 0.15}s ease-in-out ${i * 0.08}s infinite alternate`,
              }}
            >
              {token.text}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-md bg-white/[0.03] border border-white/5 px-2.5 py-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-[9px] font-mono text-white/60">
            bert-base-uncased
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="text-[8px] uppercase tracking-wider text-white/30">
            inference
          </div>
          <div className="text-[9px] font-mono text-accent-light">412ms</div>
        </div>
      </div>
    </div>
  );
}

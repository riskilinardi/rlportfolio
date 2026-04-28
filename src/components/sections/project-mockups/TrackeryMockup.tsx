const ROW_WIDTHS = [62, 48, 71, 55, 39];
const BAR_HEIGHTS = [45, 78, 62, 91, 52, 38, 84, 67, 55, 73, 48, 88];
const BAR_DURATIONS = [2.4, 3.1, 2.7, 3.6, 2.2, 3.8, 2.9, 3.3, 2.5, 3.7, 2.6, 3.4];

export function TrackeryMockup() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(31, 111, 235, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(88, 166, 255, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, #0d1117 0%, #161b22 100%)
          `,
        }}
      />

      <div className="absolute top-4 left-4 right-4 flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
        <div className="ml-3 h-5 flex-1 rounded-md bg-white/5 border border-white/5" />
      </div>

      <div className="absolute top-14 left-4 right-4 grid grid-cols-3 gap-2">
        {[
          { label: "Total", value: "1,247", color: "bg-accent/20" },
          { label: "Active", value: "892", color: "bg-emerald-400/20" },
          { label: "Low", value: "24", color: "bg-amber-400/20" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-lg bg-white/5 backdrop-blur border border-white/5 p-2"
            style={{
              animation: `float ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite alternate`,
            }}
          >
            <div className="text-[8px] text-white/40 uppercase tracking-wider">
              {stat.label}
            </div>
            <div className="text-sm font-display text-white mt-0.5">
              {stat.value}
            </div>
            <div className={`mt-1 h-1 rounded-full ${stat.color}`} />
          </div>
        ))}
      </div>

      <div className="absolute top-32 left-4 right-4 space-y-1.5">
        {ROW_WIDTHS.map((width, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md bg-white/[0.03] border border-white/5 px-2 py-1.5"
            style={{
              animation: `float ${4 + i * 0.2}s ease-in-out ${i * 0.1}s infinite alternate`,
              opacity: 1 - i * 0.1,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor:
                  i % 3 === 0 ? "#58a6ff" : i % 3 === 1 ? "#34d399" : "#fbbf24",
              }}
            />
            <div
              className="h-1.5 rounded bg-white/10"
              style={{ width: `${width}%` }}
            />
            <div className="ml-auto h-1.5 rounded bg-white/5" style={{ width: "15%" }} />
            <div className="h-1.5 rounded bg-white/5" style={{ width: "10%" }} />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-end gap-1 h-12">
        {BAR_HEIGHTS.map((height, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-accent/60 to-accent/20"
            style={{
              height: `${height}%`,
              animation: `float ${BAR_DURATIONS[i]}s ease-in-out ${i * 0.1}s infinite alternate`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

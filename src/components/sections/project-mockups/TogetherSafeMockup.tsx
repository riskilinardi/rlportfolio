import { Bell, MapPin, Shield } from "lucide-react";

export function TogetherSafeMockup() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(239, 68, 68, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(88, 166, 255, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #0d1117 0%, #161b22 100%)
          `,
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-accent/20"
            style={{
              width: `${120 + i * 80}px`,
              height: `${120 + i * 80}px`,
              animation: `pingSlow 3s cubic-bezier(0, 0, 0.2, 1) ${i * 1}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        className="relative w-32 md:w-40 aspect-[9/19] rounded-[2rem] border-2 border-white/20 bg-charcoal-bg overflow-hidden shadow-2xl"
        style={{
          animation: "float 4s ease-in-out infinite alternate",
        }}
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-black rounded-full z-20" />

        <div className="absolute top-1 left-0 right-0 flex items-center justify-between px-4 text-[7px] text-white/60 z-10">
          <span>9:41</span>
          <span>●●●</span>
        </div>

        <div className="absolute inset-0 pt-7 px-2.5 pb-2.5 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-4 h-4 rounded-md bg-accent/30 flex items-center justify-center">
              <Shield size={8} className="text-accent-light" />
            </div>
            <div className="text-[8px] font-display italic text-white">
              TogetherSafe
            </div>
            <div className="ml-auto w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="rounded-md bg-red-500/10 border border-red-500/20 p-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <Bell size={6} className="text-red-400" />
              <div className="text-[6px] text-red-300 uppercase tracking-wider">
                Alert
              </div>
            </div>
            <div className="h-1 rounded bg-white/20 w-3/4 mb-0.5" />
            <div className="h-1 rounded bg-white/10 w-1/2" />
          </div>

          <div className="rounded-md bg-accent/10 border border-accent/20 p-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <MapPin size={6} className="text-accent-light" />
              <div className="text-[6px] text-accent-light uppercase tracking-wider">
                Nearby
              </div>
            </div>
            <div className="h-1 rounded bg-white/20 w-full mb-0.5" />
            <div className="h-1 rounded bg-white/10 w-2/3" />
          </div>

          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-1 rounded-md bg-white/5 p-1"
            >
              <div className="w-3 h-3 rounded-full bg-accent/30" />
              <div className="flex-1">
                <div className="h-0.5 rounded bg-white/20 w-3/4 mb-0.5" />
                <div className="h-0.5 rounded bg-white/10 w-1/2" />
              </div>
            </div>
          ))}

          <div className="mt-auto flex items-center justify-around border-t border-white/5 pt-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? "bg-accent" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

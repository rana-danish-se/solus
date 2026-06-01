export default function LearningStreak() {
  return (
    <div className="bg-secondary rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-glow/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-[10px] font-bold text-highlight uppercase tracking-[0.15em] mb-1">Learning Streak</h3>
        <div className="text-4xl font-bold text-white mb-6">14 days</div>

        {/* Streak dots */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-glow" />
          ))}
          {[6, 7].map((i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-white/15" />
          ))}
        </div>

        <p className="text-[11px] text-highlight leading-relaxed mt-auto">
          Maintain your streak to unlock<br />the &quot;Focus Pro&quot; badge.
        </p>
      </div>
    </div>
  );
}

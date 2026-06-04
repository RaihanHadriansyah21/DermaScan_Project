import React from 'react';

const LABEL_DISPLAY = {
  AKIEC: { name: 'Actinic Keratosis', color: '#EF4444', isHighRisk: true },
  BCC:   { name: 'Basal Cell Carcinoma', color: '#F97316', isHighRisk: true },
  BKL:   { name: 'Benign Keratosis', color: '#22C55E', isHighRisk: false },
  MEL:   { name: 'Melanoma', color: '#DC2626', isHighRisk: true },
  NV:    { name: 'Melanocytic Nevus', color: '#10B981', isHighRisk: false },
};

/**
 * Horizontal bar chart showing lesion probability distribution.
 * Pure CSS animations — no chart library needed.
 */
export default function ProbabilityChart({ probabilities, topLabel }) {
  if (!probabilities) return null;

  // Sort by probability descending
  const sorted = Object.entries(probabilities)
    .map(([label, prob]) => ({
      label,
      prob,
      display: LABEL_DISPLAY[label] || { name: label, color: '#6B7280', isHighRisk: false },
    }))
    .sort((a, b) => b.prob - a.prob);

  const maxProb = Math.max(...sorted.map((s) => s.prob), 0.01);

  return (
    <div className="space-y-3">
      {sorted.map((item, idx) => {
        const pct = (item.prob * 100).toFixed(1);
        const barWidth = (item.prob / maxProb) * 100;
        const isTop = item.label === topLabel;

        return (
          <div key={item.label} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.display.color }}
                />
                <span
                  className={`text-xs font-medium ${
                    isTop ? 'text-slate-900' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  {item.display.name}
                </span>
                {item.display.isHighRisk && (
                  <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                    High Risk
                  </span>
                )}
              </div>
              <span
                className={`text-xs font-bold tabular-nums ${
                  isTop ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                {pct}%
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: isTop
                    ? item.display.color
                    : `${item.display.color}66`,
                  animationDelay: `${idx * 100}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

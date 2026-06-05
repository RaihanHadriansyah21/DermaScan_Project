import React from 'react';

/**
 * ResultCard — displays the risk classification result
 * with dynamic colors based on risk level.
 */
export default function ResultCard({ result }) {
  if (!result) return null;

  const isHighRisk = result.risk_label === 'High Risk';
  const riskPct = (result.risk_probability * 100).toFixed(1);

  // Dynamic theme based on risk level
  const theme = isHighRisk
    ? {
        bg: 'bg-red-50',
        border: 'border-red-200',
        badge: 'bg-red-600',
        badgeText: 'text-white',
        label: 'Risiko Tinggi',
        labelColor: 'text-red-700',
        barColor: 'bg-red-500',
        barTrack: 'bg-red-100',
        icon: '⚠️',
        sublabel: 'Segera konsultasikan dengan dokter spesialis kulit',
      }
    : {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'bg-emerald-600',
        badgeText: 'text-white',
        label: 'Risiko Rendah',
        labelColor: 'text-emerald-700',
        barColor: 'bg-emerald-500',
        barTrack: 'bg-emerald-100',
        icon: '✅',
        sublabel: 'Tetap lakukan pemeriksaan rutin secara berkala',
      };

  return (
    <div
      className={`${theme.bg} ${theme.border} border rounded-2xl p-6 space-y-5`}
    >
      {/* Risk Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{theme.icon}</span>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Klasifikasi Risiko
            </p>
            <h2
              className={`text-2xl font-black tracking-tight ${theme.labelColor}`}
            >
              {theme.label}
            </h2>
          </div>
        </div>
        <span
          className={`${theme.badge} ${theme.badgeText} text-sm font-bold px-4 py-1.5 rounded-full`}
        >
          {result.risk_label}
        </span>
      </div>

      {/* Probability Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-600">Probabilitas High Risk</span>
          <span className={theme.labelColor}>{riskPct}%</span>
        </div>
        <div className={`w-full ${theme.barTrack} h-3 rounded-full overflow-hidden`}>
          <div
            className={`${theme.barColor} h-full rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${riskPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>0%</span>
          <span className="border-l border-slate-300 px-1">
            Threshold: {(result.risk_threshold * 100).toFixed(1)}%
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Recommendation */}
      <p className={`text-sm font-medium ${theme.labelColor}`}>
        {theme.sublabel}
      </p>
    </div>
  );
}

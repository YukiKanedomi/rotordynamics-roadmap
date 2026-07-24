import { useMemo, useState, type ReactNode } from 'react'
import { SOURCE_MAP, SOLUTIONS, RD_COLORS, CHIP_LABEL, ANCHOR } from './data/roadmap'
import {
  BOUNDARIES,
  MATRIX,
  MATRIX_DRIVERS,
  MATRIX_NOTE,
  FLUIDS,
  FLUID_MAP,
  PRESETS,
  LEDGER,
  ARCHETYPES,
  VECTOR_LEDGER,
  RX_RULES,
  type MachineInput,
} from './data/physics'
import { CASES } from './data/cases'
import { BndSketch } from './sketches'

/* ───── 小物 ───── */
function Cites({ refs }: { refs: string[] }) {
  if (!refs.length) return null
  return (
    <span className="cites">
      {refs.map((r) => {
        const s = SOURCE_MAP[r]
        return s ? (
          <a key={r} className="cref" href={s.url} target="_blank" rel="noreferrer" title={s.title}>
            {r}
          </a>
        ) : (
          <span key={r} className="cref topic">{r}</span>
        )
      })}
    </span>
  )
}

const fmtSI = (v: number) => {
  if (v >= 1e6) return (v / 1e6).toFixed(2) + '×10⁶'
  if (v >= 1e3) return (v / 1e3).toFixed(0) + '×10³'
  return v.toFixed(0)
}

/* ───── 計算 ───── */
const R_GAS = 8.314
function calcAll(inp: MachineInput) {
  const dn = inp.d * inp.N
  const U = (Math.PI * (inp.D / 1000) * inp.N) / 60
  const sigma = (7850 * U * U) / 1e6 // MPa（鋼の薄肉リング目安）
  const dm = inp.d / 1000
  const Lm = inp.L / 1000
  const omega1 = Math.pow(Math.PI / Lm, 2) * (dm / 4) * Math.sqrt(210e9 / 7850)
  const f1 = omega1 / (2 * Math.PI)
  const fN = inp.N / 60
  const ratio = fN / f1
  const mw = FLUID_MAP[inp.fluid].mw
  const rho = (inp.p * 1e5 * (mw / 1000)) / (R_GAS * (inp.T + 273.15))
  const prod = mw * rho
  return { dn, U, sigma, f1, fN, ratio, mw, rho, prod }
}
type Calc = ReturnType<typeof calcAll>

interface Verdict { level: 'ok' | 'gold' | 'warn' | 'navy'; text: string }
function verdicts(c: Calc): Record<string, Verdict> {
  const v: Record<string, Verdict> = {}
  v.B1 =
    c.dn < 5e5
      ? { level: 'ok', text: '転がり軸受で余裕（グリース帯）' }
      : c.dn < 1e6
        ? { level: 'gold', text: '転がり上限に接近（潤滑方式が効く帯）' }
        : c.dn < 3e6
          ? { level: 'warn', text: '境界帯＝油膜／ガス／AMB への移行を検討' }
          : { level: 'navy', text: '転がり不可＝油膜・ガス・AMB の領域' }
  v.B2 =
    c.U < 250
      ? { level: 'ok', text: '電機ロータの実績帯（最高報告 245 m/s）' }
      : c.U < 300
        ? { level: 'gold', text: 'スリーブ保持PMの現状上限帯' }
        : c.U < 400
          ? { level: 'warn', text: '最高峰報告帯（solid系400）／Tiインペラ実証域' }
          : c.U < 550
            ? { level: 'warn', text: 'Ti遠心インペラ帯（550級＝Ti必須）' }
            : { level: 'navy', text: '公表実績超＝材料限界域' }
  v.B3 =
    c.ratio < 0.7
      ? { level: 'ok', text: '亜臨界の目安域（一次曲げ以下）' }
      : c.ratio < 1.4
        ? { level: 'gold', text: '一次曲げ近接＝通過設計・減衰計画が必須' }
        : { level: 'navy', text: '超臨界運転域＝内部減衰が不安定化側に回る' }
  v.B4 =
    c.mw <= 5
      ? { level: 'navy', text: '危険速度律速側（低MW→多段・長スパン化）' }
      : c.prod >= 3000
        ? { level: 'warn', text: '安定性律速側の候補（MW·ρd のみの一次スクリーニング——動力・密度比は未考慮）' }
        : { level: 'ok', text: '標準域（どちらの壁からも距離あり）' }
  return v
}
const LV_COLOR: Record<Verdict['level'], string> = {
  ok: 'var(--ok)',
  gold: 'var(--gold)',
  warn: 'var(--warn)',
  navy: 'var(--navy)',
}

/* ───── スケールバー（ゾーン＋マーカー） ───── */
interface Zone { from: number; to: number; label: string; color: string }
function ScaleBar({
  min, max, log, zones, value, ticks, fmt,
}: {
  min: number; max: number; log?: boolean
  zones: Zone[]; value: number; ticks: number[]; fmt: (v: number) => string
}) {
  const W = 600
  const X0 = 8
  const XW = W - 16
  const pos = (v: number) => {
    const t = log
      ? (Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))
      : (v - min) / (max - min)
    return X0 + Math.min(1, Math.max(0, t)) * XW
  }
  const vx = pos(value)
  return (
    <svg className="px-scale" viewBox={`0 0 ${W} 64`} preserveAspectRatio="none">
      {zones.map((z, i) => (
        <g key={i}>
          <rect x={pos(z.from)} y={24} width={pos(z.to) - pos(z.from)} height={12} fill={z.color} opacity={0.13} />
          <rect x={pos(z.from)} y={24} width={pos(z.to) - pos(z.from)} height={1.5} fill={z.color} opacity={0.55} />
          <text x={(pos(z.from) + pos(z.to)) / 2} y={48} textAnchor="middle" className="px-zlabel">
            {z.label}
          </text>
        </g>
      ))}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pos(t)} x2={pos(t)} y1={36} y2={40} stroke="var(--dim2)" strokeWidth={1} />
          <text x={pos(t)} y={60} textAnchor="middle" className="px-tick">{fmt(t)}</text>
        </g>
      ))}
      <line x1={vx} x2={vx} y1={10} y2={38} stroke="var(--ink)" strokeWidth={1.6} />
      <path d={`M ${vx - 4.5} 10 L ${vx + 4.5} 10 L ${vx} 17 Z`} fill="var(--ink)" />
    </svg>
  )
}

/* ───── 境界の帯定義（スケールバーと余裕量表示で共用） ───── */
const B1_ZONES: Zone[] = [
  { from: 1e5, to: 5e5, label: 'グリース（保守目安）', color: 'var(--ok)' },
  { from: 5e5, to: 1e6, label: '上限接近', color: 'var(--gold)' },
  { from: 1e6, to: 3e6, label: '境界帯（1–3×10⁶）', color: 'var(--warn)' },
  { from: 3e6, to: 1e7, label: '油膜／ガス／AMB', color: 'var(--navy)' },
]
const B2_ZONES: Zone[] = [
  { from: 0, to: 250, label: '電機ロータ実績帯（≤245実測）', color: 'var(--ok)' },
  { from: 250, to: 300, label: 'スリーブPM上限', color: 'var(--gold)' },
  { from: 300, to: 400, label: '最高峰報告帯', color: 'var(--warn)' },
  { from: 400, to: 550, label: 'Tiインペラ帯（550=Ti必須）', color: 'var(--warn)' },
  { from: 550, to: 600, label: '実績超', color: 'var(--navy)' },
]
const B3_ZONES: Zone[] = [
  { from: 0.1, to: 0.7, label: '亜臨界', color: 'var(--ok)' },
  { from: 0.7, to: 1.4, label: '臨界近接・通過帯', color: 'var(--gold)' },
  { from: 1.4, to: 10, label: '超臨界運転域', color: 'var(--navy)' },
]

/* ───── 余裕量（現在値と次の帯までの距離） ───── */
function MarginNote({
  value, zones, fmt, unit,
}: {
  value: number; zones: Zone[]; fmt: (v: number) => string; unit: string
}) {
  const idx = zones.findIndex((z) => value >= z.from && value < z.to)
  const cur = idx >= 0 ? zones[idx] : zones[zones.length - 1]
  const next = idx >= 0 ? zones[idx + 1] : undefined
  return (
    <p className="px-margin">
      現在 <b>{fmt(value)} {unit}</b> ｜ {cur.label}
      {next && <>　→　次の帯「{next.label}」まで <b>{fmt(next.from - value)} {unit}</b></>}
    </p>
  )
}

/* ───── 折りたたみ節（境界カード用） ───── */
function Sec({
  id, title, badge, badgeColor, defaultOpen, children,
}: {
  id: string; title: string; badge?: string; badgeColor?: string
  defaultOpen: boolean; children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={'panel px-card px-sec' + (open ? ' open' : '')} id={'sec-' + id}>
      <button className="px-sec-h" onClick={() => setOpen(!open)}>
        <h3><b>{id}</b> <small>{title}</small></h3>
        {badge && <span className="px-sec-badge" style={{ color: badgeColor }}>{badge}</span>}
        <span className="px-sec-tg">{open ? '−' : '＋'}</span>
      </button>
      {open && <div className="px-sec-b">{children}</div>}
    </div>
  )
}

/* ───── Wachel マップ（MW × ρd, log-log） ───── */
function WachelMap({ calc, inp }: { calc: Calc; inp: MachineInput }) {
  const W = 620, H = 400
  const M = { l: 52, r: 16, t: 18, b: 42 }
  const lx = (mw: number) => M.l + ((Math.log10(mw) - 0) / (Math.log10(200) - 0)) * (W - M.l - M.r)
  const ly = (rho: number) =>
    H - M.b - ((Math.log10(rho) - Math.log10(0.05)) / (Math.log10(1000) - Math.log10(0.05))) * (H - M.t - M.b)
  const presetPts = PRESETS.map((p) => {
    const c = calcAll(p.inp)
    return { name: p.name, mw: c.mw, rho: c.rho }
  })
  // 安定性律速帯: MW·ρd ≥ 3000 の上側領域
  const isoPath = (k: number) => {
    const mwA = Math.max(1, k / 1000)
    const mwB = Math.min(200, k / 0.05)
    return `M ${lx(mwA)} ${ly(k / mwA)} L ${lx(mwB)} ${ly(k / mwB)}`
  }
  const stabZone = () => {
    const k = 3000
    const mwA = Math.max(1, k / 1000)
    const pts: string[] = []
    pts.push(`${lx(mwA)},${ly(Math.min(1000, k / mwA))}`)
    pts.push(`${lx(200)},${ly(k / 200)}`)
    pts.push(`${lx(200)},${ly(1000)}`)
    pts.push(`${lx(mwA)},${ly(1000)}`)
    return pts.join(' ')
  }
  const decadesY = [0.1, 1, 10, 100, 1000]
  const ticksX = [1, 2, 5, 10, 20, 50, 100, 200]
  return (
    <svg className="px-map" viewBox={`0 0 ${W} ${H}`}>
      {/* grid */}
      {decadesY.map((d) => (
        <g key={'y' + d}>
          <line x1={M.l} x2={W - M.r} y1={ly(d)} y2={ly(d)} stroke="var(--gline)" strokeWidth={1} />
          <text x={M.l - 6} y={ly(d) + 3} textAnchor="end" className="px-tick">{d}</text>
        </g>
      ))}
      {ticksX.map((t) => (
        <g key={'x' + t}>
          <line x1={lx(t)} x2={lx(t)} y1={M.t} y2={H - M.b} stroke="var(--gline)" strokeWidth={1} />
          <text x={lx(t)} y={H - M.b + 16} textAnchor="middle" className="px-tick">{t}</text>
        </g>
      ))}
      {/* 危険速度律速帯: MW≤5 */}
      <rect x={lx(1)} y={M.t} width={lx(5) - lx(1)} height={H - M.t - M.b} fill="var(--navy)" opacity={0.07} />
      <text x={lx(2.2)} y={M.t + 16} className="px-zone-l" fill="var(--navy)">危険速度律速帯</text>
      <text x={lx(2.2)} y={M.t + 28} className="px-zone-s" fill="var(--navy)">低MW → 多段・長スパン化</text>
      {/* 安定性律速帯: MW·ρd ≥ 3000 */}
      <polygon points={stabZone()} fill="var(--warn)" opacity={0.07} />
      <text x={lx(60)} y={ly(500)} className="px-zone-l" fill="var(--warn)">安定性律速帯</text>
      <text x={lx(60)} y={ly(500) + 12} className="px-zone-s" fill="var(--warn)">MW·ρd 大 → log dec 制約</text>
      {/* iso lines */}
      {[300, 3000, 30000].map((k) => (
        <g key={k}>
          <path d={isoPath(k)} stroke="var(--dim2)" strokeWidth={1} strokeDasharray="4 4" fill="none" />
        </g>
      ))}
      <text x={lx(150)} y={ly(30000 / 150) - 5} className="px-iso">MW·ρd=3×10⁴</text>
      <text x={lx(150)} y={ly(3000 / 150) - 5} className="px-iso">3×10³</text>
      <text x={lx(150)} y={ly(300 / 150) - 5} className="px-iso">3×10²</text>
      {/* presets */}
      {presetPts.map((p) => {
        const right = p.mw > 60
        return (
          <g key={p.name}>
            <circle cx={lx(p.mw)} cy={ly(Math.max(0.05, p.rho))} r={3} fill="var(--bg)" stroke="var(--dim)" strokeWidth={1.2} />
            <text
              x={lx(p.mw) + (right ? -6 : 6)} y={ly(Math.max(0.05, p.rho)) + 3}
              textAnchor={right ? 'end' : 'start'} className="px-pt"
            >
              {p.name}
            </text>
          </g>
        )
      })}
      {/* user point */}
      <circle cx={lx(calc.mw)} cy={ly(Math.max(0.05, calc.rho))} r={7} fill="none" stroke="var(--ink)" strokeWidth={1.4} />
      <circle cx={lx(calc.mw)} cy={ly(Math.max(0.05, calc.rho))} r={3} fill="var(--ink)" />
      <text x={lx(calc.mw)} y={ly(Math.max(0.05, calc.rho)) - 12} textAnchor="middle" className="px-you">
        YOUR MACHINE
      </text>
      {/* axes labels */}
      <text x={(M.l + W - M.r) / 2} y={H - 6} textAnchor="middle" className="px-axis">分子量 MW [g/mol]（log）</text>
      <text x={14} y={(M.t + H - M.b) / 2} className="px-axis" transform={`rotate(-90 14 ${(M.t + H - M.b) / 2})`} textAnchor="middle">
        吐出密度 ρd [kg/m³]（理想気体推定・log）
      </text>
      {inp.fluid === 'co2' && inp.p > 73 && inp.T < 150 && (
        <text x={W - M.r} y={M.t + 12} textAnchor="end" className="px-warnnote">
          ※臨界点近傍: 実在気体効果で密度は理想気体推定の数倍になり得る
        </text>
      )}
    </svg>
  )
}

/* ───── 入力コントロール ───── */
function Num({
  label, unit, value, min, max, step, log, onChange,
}: {
  label: string; unit: string; value: number; min: number; max: number; step: number; log?: boolean
  onChange: (v: number) => void
}) {
  // log スライダ: 位置を対数で扱う
  const sMin = log ? Math.log10(min) : min
  const sMax = log ? Math.log10(max) : max
  const sVal = log ? Math.log10(value) : value
  return (
    <label className="px-num">
      <span className="px-num-l">{label} <small>{unit}</small></span>
      <input
        type="range" min={sMin} max={sMax} step={log ? 0.01 : step} value={sVal}
        onChange={(e) => {
          const raw = Number(e.target.value)
          onChange(log ? Math.round(Math.pow(10, raw) / step) * step : raw)
        }}
      />
      <input
        type="number" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value) || min)}
      />
    </label>
  )
}

/* ═══════════════ RX PRESCRIPTION（判定→処方） ═══════════════ */
function RxPanel({
  v, calc, inp, onCase, onArch, onNav,
}: {
  v: Record<string, Verdict>; calc: Calc; inp: MachineInput
  onCase: (bnd: string) => void; onArch: (key: string) => void; onNav?: (tab: string) => void
}) {
  const fires = (id: string): boolean => {
    switch (id) {
      case 'B1': return v.B1.level === 'warn' || v.B1.level === 'navy'
      case 'B2': return v.B2.level !== 'ok'
      case 'B3': return v.B3.level === 'gold' || v.B3.level === 'navy'
      case 'B4R': return v.B4.level === 'warn'
      case 'B4L': return v.B4.level === 'navy'
      case 'B5': return inp.motor
      case 'B8': return inp.N >= 40000
      default: return false
    }
  }
  const levelOf = (id: string): Verdict['level'] =>
    id === 'B5' ? 'navy' : id === 'B8' ? 'gold' : v[id.slice(0, 2)]?.level ?? 'gold'
  const fired = RX_RULES.filter((r) => fires(r.id))
  // 全緑時: 最も近い壁
  const prox: [string, number][] = [
    ['B1', calc.dn / 1e6],
    ['B2', calc.U / 250],
    ['B3', calc.ratio / 0.7],
    ['B4', calc.prod / 3000],
  ]
  const nearest = prox.sort((a, b) => b[1] - a[1])[0]
  const caseName = (k: string) => {
    const c = CASES.find((x) => x.key === k)
    return c ? c.name.split('—')[0].trim() : k
  }
  return (
    <div className="panel px-rx">
      <h3><b>RX</b> <small>処方箋 — 点灯した壁に、何が効き・誰がやり・何が未解決か（一次目安・設計助言ではない）</small></h3>
      {fired.length === 0 ? (
        <p className="px-note">
          全境界とも標準域です。最も近い壁は <b>{nearest[0]}</b>（閾値比 {(nearest[1] * 100).toFixed(0)}%）。
        </p>
      ) : (
        fired.map((r) => {
          const cases = r.cases.filter((k) => CASES.some((c) => c.key === k))
          return (
            <div className="px-rx-row" key={r.id} style={{ borderLeftColor: LV_COLOR[levelOf(r.id)] }}>
              <div className="px-rx-h">
                <span className="px-rx-b">{r.bnd}</span>
                <strong>{r.headline}</strong>
              </div>
              <div className="px-rx-acts">
                {r.actions.map((a, i) => (
                  <span key={i} className="px-rx-act">
                    {a.sol.map((s) => {
                      const sol = SOLUTIONS.find((x) => x.id === s)
                      return <span className="pill" key={s} title={sol?.detail}>{s} {sol?.name}</span>
                    })}
                    {a.text}
                  </span>
                ))}
              </div>
              <div className="px-rx-links">
                {cases.map((k) => (
                  <button key={k} className="chip px-rx-chip" onClick={() => onCase(r.bnd)} title="CASES タブで見る">
                    CASE: {caseName(k)}
                  </button>
                ))}
                {r.rq.map((q) => (
                  <button key={q.id} className="chip px-rx-chip" onClick={() => onNav?.('agenda')} title="AGENDA タブで見る">
                    {q.id} {q.name}
                  </button>
                ))}
                {r.archetype && (
                  <button className="chip px-rx-chip" onClick={() => onArch(r.archetype!)} title="減衰の台帳で見る">
                    台帳: {ARCHETYPES.find((a) => a.key === r.archetype)?.name}
                  </button>
                )}
              </div>
            </div>
          )
        })
      )}
      <p className="px-cav">正本: roadmap §2「境界×解 対応表」[設計判断]。処方は検討すべき選択肢の地図であり、設計判断はモード別の解析（log dec・SM）で行うこと。</p>
    </div>
  )
}

/* ═══════════════ BOUNDARIES（境界地図・計算機） ═══════════════ */
function BoundariesView({
  onCase, onArch, onNav,
}: {
  onCase: (bnd: string) => void; onArch: (key: string) => void; onNav?: (tab: string) => void
}) {
  const [inp, setInp] = useState<MachineInput>({ ...PRESETS[0].inp })
  const [preset, setPreset] = useState<string | null>(PRESETS[0].key)
  const set = (patch: Partial<MachineInput>) => {
    setInp((p) => ({ ...p, ...patch }))
    setPreset(null)
  }
  const calc = useMemo(() => calcAll(inp), [inp])
  const v = useMemo(() => verdicts(calc), [calc])
  const infoBs = BOUNDARIES.filter((b) => !b.calc)
  const hot = (id: string) => v[id].level === 'warn' || v[id].level === 'navy'

  return (
    <div>
      <p className="lede">
        機械の高速化・油フリー化がどこでロータダイナミクス課題を強制するかを、方向でなく<b>閾値</b>で持つ——
        それがこの地図の主張です。まず下の8枚のカードで「どんな壁があるか」を掴み、
        次に諸元を入れると、あなたの機械がどの壁にいるかを即時判定します。
        企業名や政策が変わっても、この境界の物理は変わりません。
        <span className="px-caveat">数値はすべて一次目安（均一軸・理想気体・代表帯）。確度の留保は各カードに明記。</span>
      </p>

      {/* B1〜B8 一覧カード */}
      <div className="px-over">
        {BOUNDARIES.map((b) => {
          const vd = v[b.id]
          const val =
            b.id === 'B1' ? fmtSI(calc.dn) + ' mm·rpm'
            : b.id === 'B2' ? calc.U.toFixed(0) + ' m/s'
            : b.id === 'B3' ? 'N/f₁ = ' + calc.ratio.toFixed(2)
            : b.id === 'B4' ? 'MW·ρd = ' + fmtSI(calc.prod)
            : b.id === 'B8' ? 'e_per(G2.5) = ' + ((2.5 / ((2 * Math.PI * inp.N) / 60)) * 1000).toFixed(2) + ' μm'
            : null
          const status = vd
            ? vd.text
            : b.id === 'B5'
              ? (inp.motor ? 'モータ一体=YES — この機械で効く' : '対象外（モータ非一体）')
              : '解説カード（クリックで下へ）'
          const color = vd
            ? LV_COLOR[vd.level]
            : b.id === 'B5' && inp.motor ? LV_COLOR.navy : 'var(--dim2)'
          return (
            <button
              key={b.id}
              className="px-ov"
              style={{ borderTopColor: color }}
              onClick={() => document.getElementById('sec-' + b.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <span className="px-ov-h"><b>{b.id}</b> <small>{b.en}</small></span>
              <span className="px-ov-nm">{b.name}</span>
              {val && <span className="px-ov-val">{val}</span>}
              <span className="px-ov-st" style={{ color }}>{status}</span>
            </button>
          )
        })}
      </div>

      {/* 入力 */}
      <div className="panel px-inputs">
        <h3><b>INPUT</b> <small>機械条件を変えて境界を再判定する — プリセットから始めて動かす</small></h3>
        <div className="px-presets">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              className={'chip' + (preset === p.key ? ' on' : '')}
              title={p.note}
              onClick={() => { setInp({ ...p.inp }); setPreset(p.key) }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="px-grid">
          <Num label="ジャーナル径 d" unit="mm" value={inp.d} min={10} max={500} step={1} log onChange={(d) => set({ d })} />
          <Num label="回転数 N" unit="rpm" value={inp.N} min={1000} max={200000} step={500} log onChange={(N) => set({ N })} />
          <Num label="軸受スパン L" unit="mm" value={inp.L} min={50} max={8000} step={10} log onChange={(L) => set({ L })} />
          <Num label="ロータ最大外径 D" unit="mm" value={inp.D} min={20} max={1500} step={5} log onChange={(D) => set({ D })} />
          <label className="px-num px-sel">
            <span className="px-num-l">作動流体</span>
            <select value={inp.fluid} onChange={(e) => set({ fluid: e.target.value })}>
              {FLUIDS.map((f) => (
                <option key={f.key} value={f.key}>{f.name}（MW {f.mw}）</option>
              ))}
            </select>
          </label>
          <Num label="吐出圧力 p" unit="bar" value={inp.p} min={1} max={400} step={1} log onChange={(p) => set({ p })} />
          <Num label="吐出温度 T" unit="°C" value={inp.T} min={0} max={700} step={5} onChange={(T) => set({ T })} />
          <label className="px-num px-chk">
            <span className="px-num-l">モータ一体</span>
            <button className={'chip' + (inp.motor ? ' on' : '')} onClick={() => set({ motor: !inp.motor })}>
              {inp.motor ? 'YES — B5 が効く' : 'NO'}
            </button>
          </label>
        </div>
      </div>

      {/* RX 処方箋 */}
      <RxPanel v={v} calc={calc} inp={inp} onCase={onCase} onArch={onArch} onNav={onNav} />

      {/* B1–B3 スケール */}
      <div className="px-cards">
        <Sec id="B1" title="DN値境界 — 転がり軸受の壁" defaultOpen={hot('B1')}
          badge={v.B1.text} badgeColor={LV_COLOR[v.B1.level]}>
          <BndSketch id="B1" />
          <div className="px-law">DN = d × N = <b>{fmtSI(calc.dn)}</b> mm·rpm</div>
          <ScaleBar
            min={1e5} max={1e7} log value={calc.dn}
            ticks={[1e5, 1e6, 1e7]} fmt={(t) => (t === 1e5 ? '10⁵' : t === 1e6 ? '10⁶' : '10⁷')}
            zones={B1_ZONES}
          />
          <MarginNote value={calc.dn} zones={B1_ZONES} fmt={fmtSI} unit="mm·rpm" />
          <p className="px-note">{BOUNDARIES[0].detail}　※このバーは DN/dmn を区別しない一次目安。</p>
          <p className="px-cav">{BOUNDARIES[0].caution}　<Cites refs={BOUNDARIES[0].sources} /></p>
        </Sec>

        <Sec id="B2" title="周速壁 — σ_θ ≈ ρU²" defaultOpen={hot('B2')}
          badge={v.B2.text} badgeColor={LV_COLOR[v.B2.level]}>
          <BndSketch id="B2" />
          <div className="px-law">
            U = πDN/60 = <b>{calc.U.toFixed(0)}</b> m/s　→　σ_θ ≈ <b>{calc.sigma.toFixed(0)}</b> MPa <small>(鋼 ρ=7,850)</small>
          </div>
          <ScaleBar
            min={0} max={600} value={calc.U}
            ticks={[0, 250, 300, 400, 550]} fmt={(t) => String(t)}
            zones={B2_ZONES}
          />
          <MarginNote value={calc.U} zones={B2_ZONES} fmt={(x) => x.toFixed(0)} unit="m/s" />
          <p className="px-note">{BOUNDARIES[1].detail}</p>
          <p className="px-cav">{BOUNDARIES[1].caution}　<Cites refs={BOUNDARIES[1].sources} /></p>
        </Sec>

        <Sec id="B3" title="超臨界化 — 一次曲げとの比" defaultOpen={hot('B3')}
          badge={v.B3.text} badgeColor={LV_COLOR[v.B3.level]}>
          <BndSketch id="B3" />
          <div className="px-law">
            f₁ ≈ <b>{calc.f1 < 100 ? calc.f1.toFixed(1) : calc.f1.toFixed(0)}</b> Hz <small>(均一鋼軸・単純支持)</small>
            　／　N = <b>{calc.fN.toFixed(0)}</b> Hz　→　N/f₁ = <b>{calc.ratio.toFixed(2)}</b>
          </div>
          <ScaleBar
            min={0.1} max={10} log value={Math.min(10, Math.max(0.1, calc.ratio))}
            ticks={[0.1, 0.7, 1, 1.4, 10]} fmt={(t) => String(t)}
            zones={B3_ZONES}
          />
          <MarginNote value={calc.ratio} zones={B3_ZONES} fmt={(x) => x.toFixed(2)} unit="" />
          <p className="px-note">{BOUNDARIES[2].detail}</p>
          <p className="px-cav">{BOUNDARIES[2].caution}</p>
        </Sec>
      </div>

      {/* B4 マップ */}
      <Sec id="B4" title="Wachel境界 — 作動流体がどちらの壁に送るか" defaultOpen={hot('B4')}
        badge={v.B4.text} badgeColor={LV_COLOR[v.B4.level]}>
        <WachelMap calc={calc} inp={inp} />
        <p className="px-note">
          {BOUNDARIES[3].detail}　現在値: MW={calc.mw}・ρd≈{calc.rho < 10 ? calc.rho.toFixed(1) : calc.rho.toFixed(0)} kg/m³（理想気体推定）。
        </p>
        <p className="px-cav">{BOUNDARIES[3].caution}　<Cites refs={BOUNDARIES[3].sources} /></p>
      </Sec>

      {/* B5–B8 情報カード */}
      <div className="px-cards3">
        {infoBs.map((b) => (
          <Sec key={b.id} id={b.id} title={b.name}
            defaultOpen={b.id === 'B5' && inp.motor}
            badge={b.id === 'B5' ? (inp.motor ? '効いている' : undefined) : undefined}
            badgeColor={LV_COLOR.navy}>
            <BndSketch id={b.id} />
            <div className="px-law">{b.law}</div>
            {b.id === 'B8' && (
              <div className="px-law">
                e_per @ {inp.N.toLocaleString()} rpm = <b>{((2.5 / ((2 * Math.PI * inp.N) / 60)) * 1000).toFixed(2)}</b> μm
                <small>（G2.5）</small>　/　<b>{((6.3 / ((2 * Math.PI * inp.N) / 60)) * 1000).toFixed(2)}</b> μm
                <small>（G6.3）</small>
              </div>
            )}
            <p className="px-note">
              {b.detail}
              {b.id === 'B5' && inp.motor && (
                <span className="px-active-note">　← モータ一体=YES: この機械で効いている境界。</span>
              )}
            </p>
            {b.caution && <p className="px-cav">{b.caution}</p>}
            <Cites refs={b.sources} />
          </Sec>
        ))}
      </div>

      {/* 境界×ドライバ行列 */}
      <div className="panel px-card">
        <h3><b>MATRIX</b> <small>どのドライバがどの境界をどの向きに押すか（—/↑/↑↑）</small></h3>
        <table className="px-matrix">
          <thead>
            <tr>
              <th />
              {MATRIX_DRIVERS.map((d) => <th key={d}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {BOUNDARIES.map((b) => (
              <tr key={b.id}>
                <th title={b.name}>{b.id} <small>{b.name.split('（')[0]}</small></th>
                {MATRIX_DRIVERS.map((d) => {
                  const m = MATRIX[b.id][d]
                  const note = MATRIX_NOTE[`${b.id}-${d}`]
                  return (
                    <td key={d} className={'px-m' + m} title={note || ''}>
                      {m === 0 ? '—' : m === 1 ? '↑' : '↑↑'}
                      {note && <i>{note}</i>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-cav">D5（横断能力=push側）は境界を「押す」側でなく「壁への答え」側のため列に含めない。</p>
      </div>
    </div>
  )
}

/* ═══════════════ LEDGER（減衰の台帳） ═══════════════ */
function LedgerView({ arch, setArch }: { arch: string | null; setArch: (a: string | null) => void }) {
  const a = ARCHETYPES.find((x) => x.key === arch) || null
  const consume = LEDGER.filter((l) => l.side === 'consume')
  const supply = LEDGER.filter((l) => l.side === 'supply')
  const state = (key: string): 'on' | 'lost' | 'dim' | 'base' => {
    if (!a) return 'base'
    if (a.lost.includes(key)) return 'lost'
    if (a.consume.includes(key) || a.supply.includes(key)) return 'on'
    return 'dim'
  }
  const sols = a
    ? Array.from(new Set(supply.filter((s) => a.supply.includes(s.key)).flatMap((s) => s.sol || [])))
    : []

  const Item = ({ it }: { it: (typeof LEDGER)[number] }) => {
    const st = state(it.key)
    return (
      <div className={'px-li px-li-' + st + (it.side === 'consume' ? ' px-li-c' : ' px-li-s')}>
        <div className="px-li-h">
          <strong>{it.name}</strong>
          {it.nature && <span className="px-vtag px-nat">{it.nature}</span>}
          {it.vec && <span className="px-vtag">{it.vec}</span>}
          {st === 'on' && <span className="px-ontag">{it.side === 'consume' ? '効いている' : '調達中'}</span>}
          {st === 'lost' && <span className="px-losttag">失った</span>}
        </div>
        <p>{it.mech}</p>
        <div className="px-li-f">
          {it.rd.map((r) => (
            <span className="px-rd" key={r} style={{ color: RD_COLORS[r] }}>
              ● {CHIP_LABEL[r]}
            </span>
          ))}
          {it.lostBy && <span className="px-lostby">{it.lostBy}</span>}
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="lede">
        中心命題（二本柱）: 回転機械の進化は、機種を問わず<b>「配置問題」（危険速度をどこに置くか——
        減衰を買っても解けない幾何学）と「収支問題」（減衰をどこから調達するか）の2つ</b>に収束する。
        この台帳は収支問題側の帳簿——業界全体が、収入源（油膜）を手放しながら支出を増やしている。
        消費側は性質で読む: <b>負減衰</b>＝収支に直接載る／<b>負剛性</b>＝配置を動かす（減衰追加では
        解けない）／<b>強制励振</b>＝応答・疲労の問題。機種を選ぶと、台帳のどこが動くかが見える。
        <span className="px-caveat">留保: 減衰は座標系・モード依存で単一スカラーの収支ではない。log dec はモードごとに立てる。同期不安定（Morton）は log dec に載らない例外条項。</span>
      </p>

      <div className="px-presets">
        <button className={'chip' + (arch === null ? ' on' : '')} onClick={() => setArch(null)}>全体</button>
        {ARCHETYPES.map((x) => (
          <button key={x.key} className={'chip' + (arch === x.key ? ' on' : '')} onClick={() => setArch(arch === x.key ? null : x.key)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className="px-ledger">
        <div className="panel px-side px-side-c">
          <h3><b>消費</b> <small>不安定化・減衰需要の増加</small></h3>
          {consume.map((it) => <Item key={it.key} it={it} />)}
        </div>
        <div className="panel px-side px-side-s">
          <h3><b>供給</b> <small>安定化・減衰の調達源</small></h3>
          {supply.map((it) => <Item key={it.key} it={it} />)}
        </div>
      </div>

      {a && (
        <div className="panel px-read">
          <h3><b>READ</b> <small>{a.name} — 収支の読み</small></h3>
          <div className="px-balance">
            <div className="px-bal-row">
              <span className="px-bal-l" style={{ color: 'var(--warn)' }}>消費 {a.consume.length}</span>
              <div className="px-bal-bar">
                <i style={{ width: `${a.consume.length * 20}%`, background: 'var(--warn)' }} />
              </div>
            </div>
            <div className="px-bal-row">
              <span className="px-bal-l" style={{ color: 'var(--navy)' }}>供給 {a.supply.length}{a.lost.length > 0 && <small>（喪失 {a.lost.length}）</small>}</span>
              <div className="px-bal-bar">
                <i style={{ width: `${a.supply.length * 20}%`, background: 'var(--navy)' }} />
              </div>
            </div>
          </div>
          <p className="px-read-t">{a.read}</p>
          <div className="px-read-f">
            <span className="px-read-k">ドライバ:</span>
            {a.drivers.map((d) => <span className="pill" key={d}>{d}</span>)}
            {sols.length > 0 && (
              <>
                <span className="px-read-k">解の方向:</span>
                {sols.map((s) => {
                  const sol = SOLUTIONS.find((x) => x.id === s)
                  return <span className="pill" key={s} title={sol?.detail}>{s} {sol?.name}</span>
                })}
              </>
            )}
            {a.sources && <Cites refs={a.sources} />}
          </div>
        </div>
      )}

      <div className="panel px-card">
        <h3><b>VECTORS × LEDGER</b> <small>共通ベクトル5本は台帳の別表現</small></h3>
        <div className="px-vrows">
          {VECTOR_LEDGER.map((vl) => (
            <div className="px-vrow" key={vl.id}>
              <span className="px-vid2">{vl.id}</span>
              <span className="px-vname">{vl.name}</span>
              <span className={'px-vside px-vside-' + vl.side}>
                {vl.side === 'consume' ? '消費側 →' : vl.side === 'supply' ? '供給側 →' : vl.side === 'loss' ? '供給喪失 →' : '両側 →'}
              </span>
              <span className="px-vrole">{vl.role}</span>
            </div>
          ))}
        </div>
        <blockquote className="anchor px-anchor">
          <p>“{ANCHOR.quote}”</p>
          <footer>— {ANCHOR.attribution}　<Cites refs={[ANCHOR.ref]} /></footer>
        </blockquote>
        <p className="px-cav">
          L4 の解（S1 先進軸受／S2 ダンパシール／S3 能動制御・SFD／S4 UQ・DT／S5 規格）はすべて
          「減衰の代替調達」として読める。[設計判断]（正本 §1）
        </p>
      </div>
    </div>
  )
}

/* ═══════════════ CASES（実機事例 × 境界地図） ═══════════════ */
function CaseStrip() {
  // B3 スケール（N/f₁, log 0.1–10）の上に、比が判明している事例を置く
  const pts = CASES.filter((c) => c.ratio != null)
  const W = 620, H = 128
  const X0 = 10, XW = W - 20
  const pos = (v: number) =>
    X0 + ((Math.log10(v) - Math.log10(0.1)) / (Math.log10(10) - Math.log10(0.1))) * XW
  const zones = [
    { from: 0.1, to: 0.7, label: '亜臨界', color: 'var(--ok)' },
    { from: 0.7, to: 1.4, label: '一次曲げ近接', color: 'var(--gold)' },
    { from: 1.4, to: 10, label: '超臨界運転域', color: 'var(--navy)' },
  ]
  const BAR_Y = 66
  return (
    <svg className="px-scale px-casestrip" viewBox={`0 0 ${W} ${H}`}>
      {zones.map((z, i) => (
        <g key={i}>
          <rect x={pos(z.from)} y={BAR_Y} width={pos(z.to) - pos(z.from)} height={12} fill={z.color} opacity={0.13} />
          <rect x={pos(z.from)} y={BAR_Y} width={pos(z.to) - pos(z.from)} height={1.5} fill={z.color} opacity={0.55} />
          <text x={(pos(z.from) + pos(z.to)) / 2} y={BAR_Y + 26} textAnchor="middle" className="px-zlabel">
            {z.label}
          </text>
        </g>
      ))}
      {[0.1, 0.7, 1, 1.4, 10].map((t) => (
        <g key={t}>
          <line x1={pos(t)} x2={pos(t)} y1={BAR_Y + 12} y2={BAR_Y + 16} stroke="var(--dim2)" strokeWidth={1} />
          <text x={pos(t)} y={BAR_Y + 40} textAnchor="middle" className="px-tick">{t}</text>
        </g>
      ))}
      <line x1={pos(1)} x2={pos(1)} y1={12} y2={BAR_Y + 12} stroke="var(--dim2)" strokeWidth={1} strokeDasharray="3 3" />
      <text x={pos(1)} y={10} textAnchor="middle" className="px-tick">N = f₁</text>
      {pts.map((c, i) => {
        const x = pos(c.ratio!)
        const lift = 22 + (i % 2) * 16 // 近接ラベルの重なり回避
        return (
          <g key={c.key}>
            <line x1={x} x2={x} y1={lift + 6} y2={BAR_Y + 6} stroke="var(--ink)" strokeWidth={1.2} />
            <circle cx={x} cy={BAR_Y + 6} r={3.4} fill="var(--ink)" />
            <text
              x={x} y={lift} textAnchor={c.ratio! > 5 ? 'end' : 'middle'} className="px-pt"
            >
              {c.name.split('—')[0].trim()} {c.ratio!.toFixed(2)}{c.ratioNote ? `（${c.ratioNote}）` : ''}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const CASE_STATUS_COLOR: Record<string, string> = {
  量産: 'var(--navy)',
  実証: 'var(--ok)',
  研究: 'var(--gold)',
  計画: 'var(--dim)',
}

function CasesView({ bnd, setBnd }: { bnd: string | null; setBnd: (b: string | null) => void }) {
  const bnds = Array.from(new Set(CASES.flatMap((c) => c.bnds))).sort()
  const shown = bnd ? CASES.filter((c) => c.bnds.includes(bnd)) : CASES
  return (
    <div>
      <p className="lede">
        境界地図（B1–B7）は抽象ではない——公開文献の実機・実験事例を壁の上に置くと、
        <b>どの壁が「越えられた」実績を持ち、どの壁の前で産業が止まっているか</b>が読める。
        代表例が B3: 実験室は四半世紀前に曲げ一次の2.5倍まで到達したが、量産機は今も一次の下に定格を置く。
        <span className="px-caveat">全事例が公開文献ベース。数値は原典の生値（丸め表記は注記）。</span>
      </p>

      <div className="panel px-card">
        <h3><b>B3 STRIP</b> <small>N/f₁ 比の実測地図 — 実験室と量産機の分布</small></h3>
        <CaseStrip />
        <p className="px-cav">
          比が原典数値から確定できる事例のみプロット。EPFL 170 krpm は hybrid mode 超え（純粋な曲げ一次比が未確定）のためカードのみ。
        </p>
      </div>

      <div className="px-presets">
        <button className={'chip' + (bnd === null ? ' on' : '')} onClick={() => setBnd(null)}>全事例</button>
        {bnds.map((b) => (
          <button key={b} className={'chip' + (bnd === b ? ' on' : '')} onClick={() => setBnd(bnd === b ? null : b)}>
            {b}
          </button>
        ))}
      </div>

      <div className="px-cases">
        {shown.map((c) => (
          <div className="panel px-case" key={c.key}>
            <div className="px-case-h">
              <span className="px-case-y">{c.year}</span>
              <span className="px-case-st" style={{ color: CASE_STATUS_COLOR[c.status] }}>{c.status}</span>
              {c.bnds.map((b) => <span key={b} className="px-case-b">{b}</span>)}
            </div>
            <h3 className="px-case-t">{c.name}</h3>
            <p className="px-case-side">{c.side}</p>
            <dl className="px-case-nums">
              {c.nums.map((n) => (
                <div key={n.label}><dt>{n.label}</dt><dd>{n.value}</dd></div>
              ))}
            </dl>
            <p className="px-case-img"><span>物理イメージ</span>{c.image}</p>
            <p className="px-case-read"><span>地図への含意</span>{c.read}</p>
            <Cites refs={c.sources} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════ PHYSICS タブ本体 ═══════════════ */
export default function PhysicsView({ onNav }: { onNav?: (tab: string) => void }) {
  const [sub, setSub] = useState<'bnd' | 'ledger' | 'cases'>('bnd')
  const [caseBnd, setCaseBnd] = useState<string | null>(null)
  const [arch, setArch] = useState<string | null>(null)
  return (
    <div className="px">
      <div className="px-subnav">
        <button className={'chip' + (sub === 'bnd' ? ' on' : '')} onClick={() => setSub('bnd')}>
          BOUNDARIES 境界地図 — あなたの機械はどの壁にいるか
        </button>
        <button className={'chip' + (sub === 'ledger' ? ' on' : '')} onClick={() => setSub('ledger')}>
          LEDGER 減衰の台帳 — 収支で読む
        </button>
        <button className={'chip' + (sub === 'cases' ? ' on' : '')} onClick={() => setSub('cases')}>
          CASES 実機事例 — 壁のどちら側か
        </button>
        <span className="px-subnote">構造層（無日付の物理）— ニュースでは書き換えない</span>
      </div>
      {sub === 'bnd' ? (
        <BoundariesView
          onCase={(b) => { setCaseBnd(b); setSub('cases') }}
          onArch={(a) => { setArch(a); setSub('ledger') }}
          onNav={onNav}
        />
      ) : sub === 'ledger' ? (
        <LedgerView arch={arch} setArch={setArch} />
      ) : (
        <CasesView bnd={caseBnd} setBnd={setCaseBnd} />
      )}
    </div>
  )
}

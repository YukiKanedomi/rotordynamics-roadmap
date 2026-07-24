/* 境界 B1〜B8 の物理模式図（手書きSVG・ネイビー線画）
   ラベルは3〜5個まで。正確な寸法図ではなく「何の物理か」を掴む絵。 */

const NV = 'var(--navy)'
const DM = 'var(--dim)'
const WR = 'var(--warn)'

function Arrow({ x1, y1, x2, y2, color = NV, w = 1.2 }: { x1: number; y1: number; x2: number; y2: number; color?: string; w?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const L = 5
  return (
    <g stroke={color} strokeWidth={w} fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <path
        d={`M ${x2} ${y2} L ${x2 - L * Math.cos(a - 0.45)} ${y2 - L * Math.sin(a - 0.45)} M ${x2} ${y2} L ${x2 - L * Math.cos(a + 0.45)} ${y2 - L * Math.sin(a + 0.45)}`}
      />
    </g>
  )
}

const T = ({ x, y, children, c = DM, anchor = 'middle' }: { x: number; y: number; children: string; c?: string; anchor?: 'start' | 'middle' | 'end' }) => (
  <text x={x} y={y} textAnchor={anchor} className="px-sk-t" fill={c}>{children}</text>
)

/* B1: 転がり軸受の DN 値（径×回転数） */
function SkB1() {
  return (
    <svg viewBox="0 0 220 130" className="px-sk">
      <circle cx={92} cy={62} r={44} fill="none" stroke={NV} strokeWidth={1.4} />
      <circle cx={92} cy={62} r={26} fill="none" stroke={NV} strokeWidth={1.4} />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const a = (deg * Math.PI) / 180
        return <circle key={deg} cx={92 + 35 * Math.cos(a)} cy={62 + 35 * Math.sin(a)} r={7} fill="none" stroke={NV} strokeWidth={1.1} />
      })}
      <Arrow x1={66} y1={62} x2={118} y2={62} w={1} />
      <T x={92} y={57}>d</T>
      <path d="M 150 30 A 62 62 0 0 1 168 62" fill="none" stroke={NV} strokeWidth={1.2} />
      <Arrow x1={167} y1={56} x2={168} y2={63} />
      <T x={176} y={40} c={NV}>N rpm</T>
      <T x={92} y={124}>転がり軸受: 径×回転数に上限</T>
    </svg>
  )
}

/* B2: 周速と周方向応力 σθ ≈ ρU² */
function SkB2() {
  return (
    <svg viewBox="0 0 220 130" className="px-sk">
      <circle cx={92} cy={66} r={44} fill="none" stroke={NV} strokeWidth={1.4} />
      <circle cx={92} cy={66} r={5} fill={NV} />
      <Arrow x1={92} y1={22} x2={140} y2={22} w={1.4} />
      <T x={146} y={26} c={NV} anchor="start">U = πDN/60</T>
      {[30, 150, 270].map((deg) => {
        const a = (deg * Math.PI) / 180
        const r1 = 33, r2 = 42
        return (
          <g key={deg}>
            <Arrow x1={92 + r1 * Math.cos(a)} y1={66 + r1 * Math.sin(a)} x2={92 + r2 * Math.cos(a)} y2={66 + r2 * Math.sin(a)} color={WR} w={1} />
          </g>
        )
      })}
      <T x={92} y={70} c={WR}>σθ ≈ ρU²</T>
      <T x={92} y={124}>周速の2乗で遠心応力が増える</T>
    </svg>
  )
}

/* B3: 危険速度（共振ピークと運転回転数） */
function SkB3() {
  return (
    <svg viewBox="0 0 220 130" className="px-sk">
      <line x1={20} y1={100} x2={205} y2={100} stroke={DM} strokeWidth={1} />
      <line x1={20} y1={100} x2={20} y2={16} stroke={DM} strokeWidth={1} />
      <path d="M 20 96 C 70 92 88 80 100 30 C 106 12 110 12 116 30 C 128 80 160 90 205 92" fill="none" stroke={NV} strokeWidth={1.5} />
      <line x1={108} y1={100} x2={108} y2={12} stroke={DM} strokeWidth={1} strokeDasharray="3 3" />
      <T x={108} y={112}>f₁（一次曲げ）</T>
      <circle cx={62} cy={88} r={3.4} fill={NV} />
      <T x={62} y={80} c={NV}>亜臨界 N&lt;f₁</T>
      <circle cx={168} cy={91} r={3.4} fill={WR} />
      <T x={168} y={83} c={WR}>超臨界 N&gt;f₁</T>
      <T x={14} y={12} anchor="start">振幅</T>
      <T x={112} y={124}>共振の山のどちら側で回すか</T>
    </svg>
  )
}

/* B5: UMP（偏心ロータへの片側磁気吸引） */
function SkB5() {
  return (
    <svg viewBox="0 0 220 130" className="px-sk">
      <circle cx={100} cy={62} r={46} fill="none" stroke={NV} strokeWidth={1.6} />
      <circle cx={112} cy={62} r={30} fill="none" stroke={NV} strokeWidth={1.4} />
      <circle cx={112} cy={62} r={2.6} fill={NV} />
      <circle cx={100} cy={62} r={1.8} fill={DM} />
      <T x={94} y={50}>e</T>
      <Arrow x1={146} y1={62} x2={162} y2={62} color={WR} w={1.6} />
      <T x={168} y={66} c={WR} anchor="start">吸引力</T>
      <T x={100} y={122}>隙間が狭い側へ引かれる＝負の剛性</T>
    </svg>
  )
}

/* B6: 材料限界（インペラの遠心応力） */
function SkB6() {
  return (
    <svg viewBox="0 0 220 130" className="px-sk">
      <path d="M 60 100 L 60 30 C 90 34 130 52 168 92 L 168 100 Z" fill="none" stroke={NV} strokeWidth={1.4} />
      <line x1={40} y1={104} x2={190} y2={104} stroke={DM} strokeWidth={1} strokeDasharray="5 3" />
      {[0.35, 0.6, 0.85].map((t) => (
        <Arrow key={t} x1={60 + t * 100} y1={98 - t * 8} x2={60 + t * 100} y2={98 - t * 8 - 14 - t * 16} color={WR} w={1} />
      ))}
      <T x={148} y={36} c={WR}>遠心力 ∝ rω²</T>
      <T x={115} y={124}>回転体自身の強度が上限を決める</T>
    </svg>
  )
}

/* B7: シール励振（旋回流とクロスカップリング力） */
function SkB7() {
  return (
    <svg viewBox="0 0 220 130" className="px-sk">
      <circle cx={100} cy={62} r={46} fill="none" stroke={NV} strokeWidth={1.4} />
      <circle cx={100} cy={62} r={28} fill="none" stroke={NV} strokeWidth={1.4} />
      {[40, 160, 280].map((deg) => {
        const a1 = (deg * Math.PI) / 180
        const a2 = ((deg + 55) * Math.PI) / 180
        const r = 37
        const large = 0
        return (
          <g key={deg}>
            <path
              d={`M ${100 + r * Math.cos(a1)} ${62 + r * Math.sin(a1)} A ${r} ${r} 0 ${large} 1 ${100 + r * Math.cos(a2)} ${62 + r * Math.sin(a2)}`}
              fill="none" stroke={NV} strokeWidth={1.1}
            />
            <Arrow
              x1={100 + r * Math.cos(a2 - 0.09)} y1={62 + r * Math.sin(a2 - 0.09)}
              x2={100 + r * Math.cos(a2)} y2={62 + r * Math.sin(a2)} w={1.1}
            />
          </g>
        )
      })}
      <Arrow x1={100} y1={34} x2={128} y2={34} color={WR} w={1.4} />
      <T x={134} y={38} c={WR} anchor="start">接線力</T>
      <T x={100} y={122}>隙間の旋回流が振れ回りを押す</T>
    </svg>
  )
}

/* B8: バランス品質（偏心質量と修正面） */
function SkB8() {
  return (
    <svg viewBox="0 0 220 130" className="px-sk">
      <line x1={24} y1={62} x2={196} y2={62} stroke={NV} strokeWidth={3} />
      <rect x={70} y={30} width={12} height={64} fill="none" stroke={NV} strokeWidth={1.3} />
      <rect x={140} y={30} width={12} height={64} fill="none" stroke={NV} strokeWidth={1.3} />
      <circle cx={76} cy={34} r={4} fill={WR} />
      <T x={76} y={24} c={WR}>不釣合い e</T>
      <circle cx={146} cy={90} r={4} fill={NV} />
      <T x={146} y={106} c={NV}>修正おもり</T>
      <T x={110} y={124}>許容偏心は回転数に反比例（G等級）</T>
    </svg>
  )
}

const SKETCHES: Record<string, () => JSX.Element> = {
  B1: SkB1, B2: SkB2, B3: SkB3, B5: SkB5, B6: SkB6, B7: SkB7, B8: SkB8,
}

export function BndSketch({ id }: { id: string }) {
  const S = SKETCHES[id]
  return S ? <S /> : null
}

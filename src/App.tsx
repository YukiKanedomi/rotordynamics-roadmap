import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { DriverIcon } from './icons'
import {
  DRIVERS,
  VECTORS,
  RD_CLUSTERS,
  RD_MAP,
  SOURCES,
  SOURCE_MAP,
  SOURCE_META,
  SOURCE_CATS,
  TOPIC_MAP,
  HORIZONS,
  NARRATIVE,
  ANCHOR,
  SOLUTIONS,
  type Confidence,
  type Driver,
  type Horizon,
  type Milestone,
} from './data/roadmap'
import { AGENDA, TIER_META, type AgendaTier } from './data/agenda'

type Tab = 'board' | 'story' | 'linkage' | 'drivers' | 'rd' | 'agenda' | 'sources'
const TABS: [Tab, string][] = [
  ['board', 'BOARD'],
  ['story', 'STORY'],
  ['linkage', 'LINKAGE'],
  ['drivers', 'DRIVERS'],
  ['rd', 'RD MAP'],
  ['agenda', 'AGENDA'],
  ['sources', 'SOURCES'],
]

const confKey = (c: Confidence) => (c === '確立' ? 'e' : c === '推定' ? 'p' : 'h')
const confClass = (c: Confidence) => 'conf c-' + confKey(c)

/* 横断RD課題の色（白地で成立する muted 色） */
const RD_COLORS: Record<string, string> = {
  critspeed: '#1F3A5F',
  stability: '#7A3E48',
  torsional: '#A97B18',
  balancing: '#6B5B3E',
  bearing: '#2F6B6B',
  seal: '#3D7A50',
  emag: '#5B2A4A',
  monitoring: '#3E5C76',
  digital: '#5A6472',
}

/* ───── ダッシュボード用メタ（チャンネル状態・KPI・ティッカー） ───── */
const CHANNEL_META: Record<string, { st: string; w?: boolean; pct: number; note: string }> = {
  D1: { st: 'TRACK', pct: 62, note: 'e-axle 20k→30k rpm ／ HP 180M→600M台' },
  D2: { st: 'REV −24%', w: true, pct: 38, note: 'H2 FID 4Mtpa堅持 ／ 発表49→37Mtpa 下方修正' },
  D3: { st: 'SURGE', pct: 84, note: '415→945 TWh ／ GT受注残 100 GW 完売' },
  D4: { st: 'TRACK', pct: 55, note: '13.2 kW/kg ／ eVTOL 商用2027〜' },
  D5: { st: 'TRACK', pct: 58, note: 'UQ実装期 ／ ISO 21940-12 改訂CD' },
  D6: { st: 'NEW', pct: 47, note: '36 GVA.s 契約 ／ FW付き調相機 2025運開' },
}

const KPIS: {
  k: string
  v: JSX.Element
  src: string
  srcKey?: string
  pts?: string
  col?: string
}[] = [
  { k: 'DC POWER DEMAND', v: <>415<small> → </small><span className="up">945</span><small> TWh 2030</small></>, src: 'IEA Energy & AI (2025)', srcKey: 'IEA-EnergyAI-2025', pts: '0,22 40,20 80,17 120,13 160,9 200,5 250,2', col: 'var(--ok)' },
  { k: 'H2 ANNOUNCED PIPELINE', v: <>49<small> → </small><span className="dn">37</span><small> Mtpa</small></>, src: 'IEA GHR 2025 — 史上初の下方修正', srcKey: 'IEA-GHR-2025-update', pts: '0,6 60,5 120,8 180,14 250,20', col: 'var(--warn)' },
  { k: 'GT ORDER BACKLOG', v: <>100<small> GW ／ SOLD-OUT 2031</small></>, src: 'GE Vernova 2026-Q1（二次）', srcKey: 'GEV-Backlog-2026', pts: '0,23 50,21 100,17 150,12 200,7 250,3', col: 'var(--navy)' },
  { k: 'GRID INERTIA PROCURED (UK)', v: <>36<small> GVA·s ／ 2026 全量運開</small></>, src: 'NESO Stability Pathfinder', srcKey: 'NESO-Stability-2025' },
  { k: 'MOTOR SPECIFIC POWER', v: <>13.2<small> kW/kg @96% ／ EIS 2035–40</small></>, src: 'NASA EAP (2023)', srcKey: 'NASA-EAP-2023' },
]

const CHIP_LABEL: Record<string, string> = {
  critspeed: '危険速度',
  stability: '安定性',
  torsional: 'ねじり',
  balancing: 'バランス',
  bearing: '軸受',
  seal: 'シール',
  emag: '電磁',
  monitoring: '監視',
  digital: '解析/DT',
}

const NEWS: { tag: string; w?: boolean; text: string }[] = [
  { tag: 'ALERT', w: true, text: 'IMO Net-Zero Framework 採択1年延期（2025-10）' },
  { tag: 'NEW', text: 'Garrett フォイル軸受 25–1,750 kWc HVAC量産（2026後半）' },
  { tag: 'STD', text: 'ISO/CD 21940-12 弾性ロータバランシング改訂進行中' },
  { tag: 'R&D', text: 'STEP Phase 1 完了: 500°C・27,000 rpm・net 4 MWe' },
]

/* ───── 連続時間軸ヘルパ（hub から移植） ───── */
const NOW = 2026,
  END = 2041,
  BREAK = 2035
const xp = (y: number) => ((y - NOW) / (END - NOW)) * 100
const BAND: Record<Horizon, [number, number]> = {
  '〜2030': [2026, 2030],
  '〜2035': [2030, 2035],
  '2035〜': [2035, 2041],
}
function nodesOf(d: Driver): { m: Milestone; yr: number }[] {
  const out: { m: Milestone; yr: number }[] = []
  HORIZONS.forEach((h) => {
    const ms = d.milestones.filter((m) => m.horizon === h)
    const [a, b] = BAND[h]
    const pad = (b - a) * 0.2
    const lo = a + pad,
      hi = b - pad
    ms.forEach((m, i) => {
      const yr = ms.length === 1 ? (lo + hi) / 2 : lo + ((hi - lo) * i) / (ms.length - 1)
      out.push({ m, yr })
    })
  })
  return out
}
function rowOffset(row: number) {
  if (row === 0) return 0
  const step = Math.ceil(row / 2) * 17
  return row % 2 === 1 ? -step : step
}
function packRows<T extends { x: number }>(nodes: T[]): (T & { row: number })[] {
  const MINGAP = 7
  const lastX: number[] = []
  return nodes.map((n) => {
    let r = 0
    while (lastX[r] !== undefined && n.x - lastX[r] < MINGAP) r++
    lastX[r] = n.x
    return { ...n, row: r }
  })
}
function useIsMobile() {
  const q = '(max-width: 820px)'
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const h = () => setM(mq.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  return m
}

/* PC表示切替: viewport meta を width=1360 に切替え、メディアクエリごとデスクトップ描画にする
   （モバイルブラウザの「PC版サイト」相当。ピンチズーム可・localStorage 保持・?pc=1 でも有効化） */
const VIEWPORT_MOBILE = 'width=device-width, initial-scale=1.0, viewport-fit=cover'
const VIEWPORT_PC = 'width=1360'
function usePcMode() {
  const [pc, setPc] = useState(() => {
    if (typeof location !== 'undefined' && location.search.includes('pc=1')) return true
    try { return localStorage.getItem('rd-pcmode') === '1' } catch { return false }
  })
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]')
    if (meta) meta.setAttribute('content', pc ? VIEWPORT_PC : VIEWPORT_MOBILE)
    try { localStorage.setItem('rd-pcmode', pc ? '1' : '0') } catch { /* noop */ }
  }, [pc])
  return [pc, setPc] as const
}

/* ═════════════════════════ App ═════════════════════════ */
export default function App() {
  const isMobile = useIsMobile()
  const [pcMode, setPcMode] = usePcMode()
  const [tab, setTab] = useState<Tab>(() => {
    const h = typeof location !== 'undefined' ? (location.hash.replace('#', '') as Tab) : 'board'
    return (TABS.map(([k]) => k) as string[]).includes(h) ? h : 'board'
  })
  const go = (t: Tab) => {
    setTab(t)
    if (typeof history !== 'undefined') history.replaceState(null, '', '#' + t)
  }
  const [active, setActive] = useState<{ m: Milestone; driver: Driver } | null>(null)
  const [rdFilter, setRdFilter] = useState<string | null>(null)

  return (
    <div className="app">
      <header className="top">
        <span className="brand">RD//BOARD</span>
        <h1>回転機械ローターダイナミクス — 技術ロードマップ</h1>
        <div className="leds">
          <span className="led"><i />D1</span>
          <span className="led w"><i />D2 下方修正</span>
          <span className="led"><i />D3</span>
          <span className="led w"><i />D4 eVTOL遅延</span>
          <span className="led"><i />D5</span>
          <span className="led"><i />D6</span>
        </div>
        <span className="clock">
          EPOCH <b>2026.51</b> ／ HORIZON 2041 ／ SRC <b>{SOURCES.length}</b> verified
        </span>
      </header>

      <nav className="nav">
        {TABS.map(([k, label]) => (
          <button key={k} className={tab === k ? 'nv on' : 'nv'} onClick={() => go(k)}>
            {label}
          </button>
        ))}
        <button className={'pcbtn' + (pcMode ? ' on' : '')} onClick={() => setPcMode(!pcMode)}
          title="モバイルでもPCレイアウトを表示（ピンチズーム可）">
          {pcMode ? 'MOBILE表示に戻す' : 'PC表示'}
        </button>
        <span className="nav-note">実線=〜2035 ／ 破線=2035〜 ／ 定量は一次資料のみ</span>
      </nav>

      <main className="main">
        {tab === 'board' && (
          <BoardView
            isMobile={isMobile}
            rdFilter={rdFilter}
            setRdFilter={setRdFilter}
            onPick={(m, driver) => setActive({ m, driver })}
          />
        )}
        {tab === 'story' && <StoryView />}
        {tab === 'linkage' && <LinkageView isMobile={isMobile} />}
        {tab === 'drivers' && <DriversView onPick={(m, driver) => setActive({ m, driver })} />}
        {tab === 'rd' && (
          <RDView
            onJump={(key) => {
              setRdFilter(key)
              go('board')
            }}
          />
        )}
        {tab === 'agenda' && <AgendaView />}
        {tab === 'sources' && <SourcesView />}
      </main>

      {active && <Drawer data={active} onClose={() => setActive(null)} />}

      <footer className="foot">
        <span>
          確度: <span className="conf c-e">確立</span> 一次裏取り済 ・{' '}
          <span className="conf c-p">推定</span> 方向は妥当・値未確定 ・{' '}
          <span className="conf c-h">仮説</span> 長期シナリオ
        </span>
        <span className="foot-r">分類骨格: API TR 684-1 ／ ISO 20816・21940・14839</span>
      </footer>
    </div>
  )
}

/* ═════════════════ BOARD（メインダッシュボード） ═════════════════ */
function BoardView({
  isMobile,
  rdFilter,
  setRdFilter,
  onPick,
}: {
  isMobile: boolean
  rdFilter: string | null
  setRdFilter: (k: string | null) => void
  onPick: (m: Milestone, d: Driver) => void
}) {
  return (
    <div className="board-grid">
      {/* 左: ドライバ・チャンネル */}
      <section className="panel">
        <h3><b>CH 01–06</b> 需要ドライバ・チャンネル</h3>
        <div className="ch">
          {DRIVERS.map((d) => {
            const meta = CHANNEL_META[d.id]
            return (
              <div className="chan" key={d.id}>
                <div className="r1">
                  <span>
                    <span className="did">{d.id}</span>　<span className="nm">{d.name}</span>
                  </span>
                  <span className={'st' + (meta.w ? ' w' : '')}>{meta.st}</span>
                </div>
                <div className="bar"><i style={{ width: meta.pct + '%' }} /></div>
                <small>{meta.note}</small>
              </div>
            )
          })}
        </div>
      </section>

      {/* 中央: メインボード */}
      <section className="panel">
        <div className="panel-head">
          <h3><b>MAIN BOARD</b> 二層タイムライン</h3>
          <div className="chips">
            <button className={rdFilter === null ? 'chip on' : 'chip'} onClick={() => setRdFilter(null)}>
              ALL
            </button>
            {RD_CLUSTERS.map((c) => (
              <button
                key={c.key}
                className={rdFilter === c.key ? 'chip on' : 'chip'}
                style={rdFilter === c.key ? { background: RD_COLORS[c.key], borderColor: RD_COLORS[c.key], color: '#fff' } : {}}
                onClick={() => setRdFilter(rdFilter === c.key ? null : c.key)}
                title={c.name}
              >
                {CHIP_LABEL[c.key] ?? c.name}
              </button>
            ))}
          </div>
        </div>
        {isMobile ? (
          <BoardMobile rdFilter={rdFilter} onPick={onPick} />
        ) : (
          <BoardTimeline rdFilter={rdFilter} onPick={onPick} />
        )}
      </section>

      {/* 右: KPI レール */}
      <section className="kpis">
        {KPIS.map((kpi) => (
          <div className="kpi" key={kpi.k}>
            <div className="k">{kpi.k}</div>
            <div className="v">{kpi.v}</div>
            {kpi.pts && (
              <svg className="spark" width="100%" height="26" viewBox="0 0 250 26" preserveAspectRatio="none">
                <polyline points={kpi.pts} fill="none" style={{ stroke: kpi.col }} strokeWidth="2" />
              </svg>
            )}
            <div className="src">{kpi.src}</div>
          </div>
        ))}
      </section>

      {/* 下: ティッカー */}
      <div className="tick">
        {NEWS.map((n, i) => (
          <span key={i} className="tk">
            <b className={n.w ? 'w' : ''}>{n.tag}</b> {n.text}
          </span>
        ))}
      </div>
    </div>
  )
}

/* 中央ボード（デスクトップ: 連続時間軸スイムレーン） */
function BoardTimeline({
  rdFilter,
  onPick,
}: {
  rdFilter: string | null
  onPick: (m: Milestone, d: Driver) => void
}) {
  return (
    <div className="tl-wrap">
      <div className="tl-chart" style={{ '--bx': xp(BREAK) + '%' } as CSSProperties}>
        <div className="tl-now" style={{ left: xp(2026.5) + '%' }}><span>NOW</span></div>
        <div className="tl-brk" style={{ left: xp(BREAK) + '%' }} />
        {DRIVERS.map((d, di) => {
          const packed = packRows(
            nodesOf(d)
              .map((n) => ({ ...n, x: xp(n.yr) }))
              .sort((a, b) => a.x - b.x),
          )
          return (
            <div className="lane" key={d.id}>
              <div className="lane-h">
                <span className="lid">CH-{String(di + 1).padStart(2, '0')}</span>
                <span className="ln">{d.name}</span>
              </div>
              <div className="track">
                {packed.map(({ m, x, row }) => {
                  const off = rowOffset(row)
                  const dim = rdFilter && !m.rd.includes(rdFilter)
                  return (
                    <button
                      key={m.id}
                      className={'node ' + confClass(m.confidence) + (dim ? ' dim' : '')}
                      style={{ left: x + '%', top: off + 'px' }}
                      onClick={() => onPick(m, d)}
                    >
                      <span className="mk" />
                      <span className="tip">
                        {m.title}
                        <i className={confClass(m.confidence)}>{m.confidence}</i>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
        <div className="tl-scale">
          {[2026, 2030, 2035, 2040].map((y) => (
            <span key={y} style={{ left: xp(y) + '%' }}>{y}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* 中央ボード（モバイル: 縦リフロー） */
const HLABEL: Record<Horizon, string> = {
  '〜2030': '近中期 前半',
  '〜2035': '近中期',
  '2035〜': '長期・シナリオ',
}
function BoardMobile({
  rdFilter,
  onPick,
}: {
  rdFilter: string | null
  onPick: (m: Milestone, d: Driver) => void
}) {
  return (
    <div className="vtl">
      {HORIZONS.map((h) => {
        const items = DRIVERS.flatMap((d) =>
          d.milestones.filter((m) => m.horizon === h).map((m) => ({ m, d })),
        ).filter(({ m }) => !rdFilter || m.rd.includes(rdFilter))
        return (
          <section className={'vt-sec' + (h === '2035〜' ? ' future' : '')} key={h}>
            <div className="vt-head">
              <span className="vt-h">{h}</span>
              <small>{HLABEL[h]}</small>
            </div>
            {items.length === 0 && <p className="vt-empty">該当なし</p>}
            {items.map(({ m, d }) => (
              <button key={m.id} className="vt-card" style={{ borderLeftColor: RD_COLORS[m.rd[0]] ?? 'var(--dim2)' }} onClick={() => onPick(m, d)}>
                <span className="vt-row">
                  <span className="vt-driver"><b>{d.id}</b> {d.name}</span>
                  <span className={confClass(m.confidence)}>{m.confidence}</span>
                </span>
                <span className="vt-title">{m.title}</span>
              </button>
            ))}
          </section>
        )
      })}
    </div>
  )
}

/* ═════════════════ STORY ═════════════════ */
function Cite({ refs }: { refs: string[] }) {
  return (
    <span className="cites">
      {refs.map((r) => {
        const s = SOURCE_MAP[r]
        if (s)
          return (
            <a key={r} className="cref" href={s.url} target="_blank" rel="noreferrer" title={s.title}>
              {r}
            </a>
          )
        const t = TOPIC_MAP[r]
        return (
          <span key={r} className="cref topic" title={t?.summary}>
            {t ? t.name : r}
          </span>
        )
      })}
    </span>
  )
}

function StoryView() {
  return (
    <div className="story panel">
      <h3><b>NARRATIVE</b> なぜこのロードマップになるのか — 11文・各文に一次出典</h3>
      <ol className="narr">
        {NARRATIVE.map((n, i) => (
          <li key={i}>
            <span className="narr-t">{n.text}</span>
            <Cite refs={n.refs} />
          </li>
        ))}
      </ol>
      <blockquote className="anchor">
        <p>“{ANCHOR.quote}”</p>
        <footer>— {ANCHOR.attribution} <Cite refs={[ANCHOR.ref]} /></footer>
      </blockquote>
      <h3 style={{ marginTop: 26 }}><b>VECTORS</b> 機種を超えて収束する5つの共通ベクトル</h3>
      <div className="themes">
        {VECTORS.map((v) => (
          <div className="theme" key={v.id}>
            <div className="v-id">{v.id}</div>
            <div className="v-body">
              <strong>{v.name}</strong>
              <p>{v.detail}</p>
              <div className="pillrow">
                {v.drivers.map((id) => (
                  <span className="pill" key={id}>{id}</span>
                ))}
              </div>
              {v.sources && <div className="theme-src">裏付け: <Cite refs={v.sources} /></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═════════════════ LINKAGE（4層＋ストーリーツアー: hub から移植） ═════════════════ */
const TOUR: { text: string; refs: string[]; anchor?: string; layers?: string[] }[] = [
  { text: '脱炭素・電化・AIという3つの不可逆な潮流が、回転機械の全分野に同時に効きはじめた。まず社会動向（L1）が起点になる。', refs: ['ICAO-LTAG-2022', 'IEA-GHR-2024'], layers: ['L1'] },
  { text: 'その結果、機種を超えて進化方向は5本の共通ベクトル—油フリー・超高速・モータ一体・極端流体・デジタル—へ収束する（L1→L2）。', refs: ['DellaCorte-2012-MSSP', 'Gerada-2014-IEEE-TIE'], layers: ['L1', 'L2'] },
  { text: '航空（D4）の筋：MW級電動推進が軽量薄肉・超高速ロータを生み、油フリー軸受とジャイロ・危険速度設計を要求する。', refs: ['NASA-EAP-2023', 'CleanAviation-SRIA-2024'], anchor: 'D4' },
  { text: 'エネルギー転換（D2）の筋：低分子量H2と高密度sCO2という極端な作動流体が、危険速度律速とサブシンクロナス安定性を呼ぶ。', refs: ['CleanHydrogenJU-SRIA-2022', 'DOE-STEP-SwRI-2024'], anchor: 'D2' },
  { text: 'データセンター（D3）の筋：電力倍増が油フリー磁気軸受チラーと系統追従発電を要求し、ねじり・安定性が前面に出る。', refs: ['IEA-EnergyAI-2025', 'AIDC-Torsional-2026'], anchor: 'D3' },
  { text: 'こうして古典的なローターダイナミクス難問（L3）が、新しい条件で一斉に再来する。', refs: ['ASME-Spakovszky-2023'], layers: ['L3'] },
  { text: '課題の核心は「減衰の定量化と流体-構造連成」。解（L4）は先進軸受・ダンパシール・能動制御・UQ/DT・規格整備へ向かう（L3→L4）。', refs: ['ASME-Spakovszky-2023', 'MDPI-AMB-Review-2025', 'Fu-MSSP-UQreview-2023'], layers: ['L3', 'L4'] },
  { text: '一本の筋を端から端まで通すと：エネルギー転換 → 作動流体の極端化 → 安定性 → ダンパシール／先進軸受、と辿れる。', refs: ['Baba-2020-GPPS', 'ASME-SwirlBrake-2023'], anchor: 'D2' },
]

function LinkageView({ isMobile }: { isMobile: boolean }) {
  const [sel, setSel] = useState<string | null>(null)
  const [tour, setTour] = useState<number | null>(null)

  const { LAYERS, edges, fAdj, bAdj, detailMap } = useMemo(() => {
    const LAYERS = [
      { key: 'L1', title: '社会動向', nodes: DRIVERS.map((d) => ({ id: d.id, head: d.id, label: d.name })) },
      { key: 'L2', title: '回転機械の変化', nodes: VECTORS.map((v) => ({ id: v.id, head: v.id, label: v.name })) },
      { key: 'L3', title: 'RD課題', nodes: RD_CLUSTERS.map((c) => ({ id: c.key, head: '', label: c.name })) },
      { key: 'L4', title: '解の方向', nodes: SOLUTIONS.map((s) => ({ id: s.id, head: s.id, label: s.name })) },
    ]
    const edges: [string, string][] = []
    VECTORS.forEach((v) => v.drivers.forEach((d) => edges.push([d, v.id])))
    RD_CLUSTERS.forEach((c) => (c.cause.match(/V\d/g) || []).forEach((v) => edges.push([v, c.key])))
    SOLUTIONS.forEach((s) => s.rd.forEach((rd) => edges.push([rd, s.id])))
    const fAdj: Record<string, string[]> = {}
    const bAdj: Record<string, string[]> = {}
    edges.forEach(([a, b]) => {
      ;(fAdj[a] = fAdj[a] || []).push(b)
      ;(bAdj[b] = bAdj[b] || []).push(a)
    })
    const detailMap: Record<string, { title: string; detail: string; sources: string[] }> = {}
    DRIVERS.forEach((d) => (detailMap[d.id] = { title: `${d.id}　${d.name}`, detail: d.short, sources: [] }))
    VECTORS.forEach((v) => (detailMap[v.id] = { title: `${v.id}　${v.name}`, detail: v.detail, sources: v.sources || [] }))
    RD_CLUSTERS.forEach((c) => (detailMap[c.key] = { title: c.name, detail: c.detail, sources: c.refs }))
    SOLUTIONS.forEach((s) => (detailMap[s.id] = { title: `${s.id}　${s.name}`, detail: s.detail, sources: s.sources || [] }))
    return { LAYERS, edges, fAdj, bAdj, detailMap }
  }, [])

  const chainOf = (start: string) => {
    const nodes = new Set<string>([start])
    const es = new Set<string>()
    let fr = [start]
    while (fr.length) {
      const nx: string[] = []
      fr.forEach((id) => (fAdj[id] || []).forEach((b) => { es.add(id + '__' + b); if (!nodes.has(b)) { nodes.add(b); nx.push(b) } }))
      fr = nx
    }
    fr = [start]
    while (fr.length) {
      const nx: string[] = []
      fr.forEach((id) => (bAdj[id] || []).forEach((a) => { es.add(a + '__' + id); if (!nodes.has(a)) { nodes.add(a); nx.push(a) } }))
      fr = nx
    }
    return { nodes, es }
  }

  const focus = useMemo(() => {
    if (tour !== null) {
      const step = TOUR[tour]
      if (step.anchor) return chainOf(step.anchor)
      if (step.layers) {
        const nodes = new Set<string>()
        LAYERS.filter((L) => step.layers!.includes(L.key)).forEach((L) => L.nodes.forEach((n) => nodes.add(n.id)))
        const es = new Set<string>()
        edges.forEach(([a, b]) => { if (nodes.has(a) && nodes.has(b)) es.add(a + '__' + b) })
        return { nodes, es }
      }
      return null
    }
    return sel ? chainOf(sel) : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour, sel, LAYERS, edges, fAdj, bAdj])

  const cls = (id: string) => (focus ? (focus.nodes.has(id) ? ' inchain' : ' dim') : '')
  const pick = (id: string) => { setTour(null); setSel(sel === id ? null : id) }

  const posMap = useMemo(() => {
    const COLX = [60, 300, 545, 805], COLW = [150, 160, 195, 180], TOP = 46, H = 620, BOT = 22
    const m: Record<string, { x: number; cy: number; w: number; xLeft: number; xRight: number }> = {}
    LAYERS.forEach((L, li) => {
      const k = L.nodes.length
      L.nodes.forEach((n, i) => {
        const cy = TOP + ((H - TOP - BOT) * (i + 0.5)) / k
        m[n.id] = { x: COLX[li], cy, w: COLW[li], xLeft: COLX[li], xRight: COLX[li] + COLW[li] }
      })
    })
    return m
  }, [LAYERS])

  const cap = tour !== null ? null : sel ? detailMap[sel] : null
  const step = tour !== null ? TOUR[tour] : null

  return (
    <div className="lk panel">
      <div className="panel-head">
        <h3><b>LINKAGE</b> 4層リンク図 — 社会動向 → 機械の変化 → RD課題 → 解</h3>
        <div className="lk-tour">
          {tour === null ? (
            <button className="tbtn" onClick={() => { setSel(null); setTour(0) }}>▶ STORY TOUR</button>
          ) : (
            <div className="tnav">
              <button className="tstep" disabled={tour === 0} onClick={() => setTour(Math.max(0, tour - 1))}>◀</button>
              <span className="tcount">STEP {tour + 1}/{TOUR.length}</span>
              <button className="tstep" disabled={tour === TOUR.length - 1} onClick={() => setTour(Math.min(TOUR.length - 1, tour + 1))}>▶</button>
              <button className="tend" onClick={() => setTour(null)}>EXIT</button>
            </div>
          )}
        </div>
      </div>

      {!isMobile ? (
        <svg viewBox="0 0 1000 620" className="lk-svg" onClick={() => setSel(null)}>
          {['社会動向', '回転機械の変化', 'RD課題', '解の方向'].map((t, li) => (
            <text key={t} x={[135, 380, 642, 895][li]} y={18} className="lk-coltitle" textAnchor="middle">{t}</text>
          ))}
          {edges.map(([a, b], i) => {
            const pa = posMap[a], pb = posMap[b]
            if (!pa || !pb) return null
            const x1 = pa.xRight, y1 = pa.cy, x2 = pb.xLeft, y2 = pb.cy, mx = (x1 + x2) / 2
            const on = focus ? focus.es.has(a + '__' + b) : false
            const off = focus ? !on : false
            return <path key={i} d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} className={'lk-link' + (on ? ' on' : '') + (off ? ' off' : '')} />
          })}
          {LAYERS.map((L, li) =>
            L.nodes.map((n) => {
              const p = posMap[n.id]
              return (
                <foreignObject key={n.id} x={p.x} y={p.cy - 26} width={p.w} height={52}>
                  <button className={'lk-node l' + (li + 1) + (sel === n.id ? ' sel' : '') + cls(n.id)} onClick={(e) => { e.stopPropagation(); pick(n.id) }}>
                    {n.head && <span className="lk-head">{n.head}</span>}
                    <span className="lk-label">{n.label}</span>
                  </button>
                </foreignObject>
              )
            }),
          )}
        </svg>
      ) : (
        <div className="lk-stack">
          {LAYERS.map((L, li) => (
            <section className="lk-layer" key={L.key}>
              <div className="lk-ltitle"><span className="lk-lk">{L.key}</span>{L.title}</div>
              <div className="lk-row">
                {L.nodes.map((n) => (
                  <button key={n.id} className={'lk-chip l' + (li + 1) + (sel === n.id ? ' sel' : '') + cls(n.id)} onClick={() => pick(n.id)}>
                    {n.head && <b>{n.head}</b>} {n.label}
                  </button>
                ))}
              </div>
              {li < 3 && <div className="lk-down">↓</div>}
            </section>
          ))}
        </div>
      )}

      <div className={'lk-cap' + (cap || step ? ' on' : '')}>
        {step ? (
          <>
            <span className="lk-cap-step">STORY {tour! + 1}/{TOUR.length}</span>
            <span className="lk-cap-d">{step.text}</span>
            {step.refs.length > 0 && <span className="lk-cap-s">裏付け: <Cite refs={step.refs} /></span>}
          </>
        ) : cap ? (
          <>
            <strong>{cap.title}</strong>
            <span className="lk-cap-d">{cap.detail}</span>
            {cap.sources.length > 0 && <span className="lk-cap-s">裏付け: <Cite refs={cap.sources} /></span>}
          </>
        ) : (
          <span className="hint">ノードを選ぶと因果連鎖がハイライトされます。STORY TOUR で順に辿れます。</span>
        )}
      </div>
    </div>
  )
}

/* ═════════════════ DRIVERS ═════════════════ */
function DriversView({ onPick }: { onPick: (m: Milestone, d: Driver) => void }) {
  return (
    <div className="cards">
      {DRIVERS.map((d, i) => (
        <section className="panel card" key={d.id}>
          <h3>
            <b>CH-{String(i + 1).padStart(2, '0')}</b> <DriverIcon id={d.id} className="d-svg" /> {d.name}
            <small>　{d.short}</small>
          </h3>
          <h4>社会・産業動向</h4>
          <ul className="trends">
            {d.trends.map((t, j) => (
              <li key={j}>
                <span className={confClass(t.confidence)}>{t.confidence}</span> {t.text}
                {t.source && SOURCE_MAP[t.source] && (
                  <a className="src-a" href={SOURCE_MAP[t.source].url} target="_blank" rel="noreferrer">出典↗</a>
                )}
              </li>
            ))}
          </ul>
          <h4>回転機械への需要シフト</h4>
          <p className="shift">{d.demandShift}</p>
          <h4>マイルストーン</h4>
          <div className="ms-row">
            {d.milestones.map((m) => (
              <button key={m.id} className="ms" onClick={() => onPick(m, d)}>
                <span className="hz">{m.horizon}</span>
                <span className={confClass(m.confidence)}>{m.confidence}</span>
                <span className="ms-t">{m.title}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

/* ═════════════════ RD MAP ═════════════════ */
function RDView({ onJump }: { onJump: (key: string) => void }) {
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    DRIVERS.forEach((d) => d.milestones.forEach((m) => m.rd.forEach((k) => (c[k] = (c[k] ?? 0) + 1))))
    return c
  }, [])
  return (
    <div className="rd">
      <p className="lede">
        横断ローターダイナミクス課題。分類の骨格は業界標準（API TR 684-1 の柱＋ISO 20816/21940/14839 系）
        に置く。カードの「BOARDで見る」で該当マイルストーンを抽出。
      </p>
      <div className="rd-grid">
        {RD_CLUSTERS.map((c) => (
          <div className="panel rd-card" key={c.key} style={{ borderTopColor: RD_COLORS[c.key] }}>
            <div className="rd-head">
              <strong>{c.name}</strong>
              <span className="rd-count">{counts[c.key] ?? 0}</span>
            </div>
            <small className="rd-cause">主因: {c.cause}</small>
            <p>{c.detail}</p>
            <div className="rd-refs"><span className="rl">分類の根拠</span> <Cite refs={c.refs} /></div>
            <button className="jump" onClick={() => onJump(c.key)}>BOARDで見る →</button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═════════════════ AGENDA（直近5年の研究課題） ═════════════════ */
const TIERS: AgendaTier[] = ['A', 'B', 'C']

function AgendaView() {
  return (
    <div className="agenda">
      <div className="panel ag-lede">
        <h3><b>RESEARCH AGENDA 2026–2031</b> 直近5年で取り組むべき具体的研究課題</h3>
        <p className="lede">
          ロードマップの 〜2030 マイルストーンと立ち上がりの早い 〜2035 項目から、
          「産業実装が先行し、設計法・検証データ・規格が追いついていない」順に 13 課題を導出。
          各課題は <em>核心の問い（検証可能な形）／何が難しいか（物理）／5年後のゴール</em> で記述する。
        </p>
        <p className="ag-next">
          <b>NEXT PHASE</b> 各課題の BENCHMARK 欄は次段の調査計画：比較軸（AXES）に沿って主要企業・研究機関の
          到達レベルを論文・技報・プレスリリースから評価する。PLAYERS は一次資料から採ったシードであり、
          網羅リストではない（調査で更新）。
        </p>
      </div>

      {TIERS.map((t) => (
        <section key={t} className="ag-tier">
          <div className="ag-tier-head">
            <span className="ag-tid">TIER {t}</span>
            <strong>{TIER_META[t].name}</strong>
            <small>{TIER_META[t].desc}</small>
          </div>
          <div className="ag-grid">
            {AGENDA.filter((a) => a.tier === t).map((a) => (
              <article className="panel ag-card" key={a.id}>
                <div className="ag-top">
                  <span className="ag-id">{a.id}</span>
                  <span className="ag-chips">
                    {a.rd.map((k) => (
                      <span key={k} className="ag-rd" style={{ color: RD_COLORS[k], borderColor: RD_COLORS[k] }}>
                        {CHIP_LABEL[k] ?? k}
                      </span>
                    ))}
                  </span>
                  <span className={confClass(a.confidence)}>{a.confidence}</span>
                </div>
                <h4 className="ag-title">{a.title}</h4>
                <p className="ag-q">{a.question}</p>
                <div className="ag-row"><span className="ag-l">物理</span><p>{a.physics}</p></div>
                <div className="ag-row"><span className="ag-l">5年ゴール</span><p>{a.goal5y}</p></div>
                <div className="ag-row"><span className="ag-l">なぜ今</span><p>{a.whyNow} <Cite refs={a.sources} /></p></div>
                {a.gap && <div className="ag-gap"><b>GAP</b> {a.gap}</div>}
                <div className="ag-bench">
                  <div className="ag-bh">
                    <b>BENCHMARK</b>
                    <span className="ag-status">未実施</span>
                    <span className="ag-link">
                      {a.drivers.join(' ')} ／ {a.milestones.join(' ')}
                    </span>
                  </div>
                  <div className="ag-axes">
                    {a.benchAxes.map((x, i) => (
                      <span key={i} className="ag-ax">{x}</span>
                    ))}
                  </div>
                  <div className="ag-players">
                    {a.players.map((p) => (
                      <span key={p.name} className={'ag-pl t-' + (p.type === 'OEM' ? 'oem' : p.type === '大学' ? 'uni' : 'lab')}>
                        <i>{p.type}</i>
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

/* ═════════════════ SOURCES ═════════════════ */
function SourcesView() {
  const grouped = useMemo(() => {
    const g: Record<string, typeof SOURCES> = {}
    SOURCES.forEach((s) => {
      const cat = SOURCE_META[s.key]?.cat ?? (s.primary ? 'tech' : 'secondary')
      ;(g[cat] = g[cat] || []).push(s)
    })
    return g
  }, [])
  return (
    <div className="sources panel">
      <h3><b>ANNOTATED BIBLIOGRAPHY</b> 出典の解説 — 各文献が「何を確立するか・なぜ権威か」</h3>
      <p className="lede">
        原則: 定量は一次情報のみ（IEA・法定・OEM一次・査読・規格）。民間予測の絶対値は採用しない。
      </p>
      {SOURCE_CATS.map((cat) => {
        const items = grouped[cat.key] || []
        if (items.length === 0) return null
        return (
          <section key={cat.key}>
            <h4 className="cat-h">
              {cat.name} <small>{items.length}件 — {cat.desc}</small>
            </h4>
            <ol className="src-list">
              {items.map((s) => {
                const note = SOURCE_META[s.key]?.note
                return (
                  <li key={s.key}>
                    <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                    <code>{s.key}</code>
                    {note && <span className="src-note">{note}</span>}
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}
    </div>
  )
}

/* ═════════════════ Drawer ═════════════════ */
function Drawer({ data, onClose }: { data: { m: Milestone; driver: Driver }; onClose: () => void }) {
  const { m, driver } = data
  const horizonLabel = m.horizon === '2035〜' ? '2035〜 長期' : m.horizon
  return (
    <div className="drawer-wrap" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="閉じる">×</button>
        <div className="dr-tags">
          <span className="hz">{horizonLabel}</span>
          <span className={confClass(m.confidence)}>{m.confidence}</span>
          <span className="pill">{driver.id} {driver.name}</span>
        </div>
        <h2 className="dr-h">{m.title}</h2>
        <p className="dr-detail">{m.detail}</p>
        <h4>横断RD課題</h4>
        <div className="dr-rd">
          {m.rd.map((k) => (
            <span className="rd-pill" key={k} style={{ background: RD_COLORS[k], borderColor: RD_COLORS[k] }}>
              {RD_MAP[k]?.name ?? k}
            </span>
          ))}
        </div>
        {m.sources && m.sources.length > 0 && (
          <>
            <h4>出典</h4>
            <ul className="dr-src">
              {m.sources.map((key) => {
                const s = SOURCE_MAP[key]
                return s ? (
                  <li key={key}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>
                ) : (
                  <li key={key}>{key}</li>
                )
              })}
            </ul>
          </>
        )}
      </aside>
    </div>
  )
}

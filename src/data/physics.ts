// PHYSICS タブ（構造層）のデータモデル。
// 正本: experts/rotordynamics/knowledge/topics/roadmap-rotating-machinery.md 第I部
// （§1 減衰の台帳・§2 境界地図）。2026-07-11 全面改訂で新設した不変量をUI化する。
// 代表値・ゾーン境界は [設計判断]（要出典）を含む——各所の caution に明記。

/* ═══════════════ 境界地図（B1–B7） ═══════════════ */

export interface Boundary {
  id: string
  name: string
  en: string
  law: string // スケーリング則（mono表示）
  detail: string
  caution?: string // 確度の留保
  sources: string[] // SOURCE_MAP キー（無ければ表示だけ）
  calc: boolean // 計算機で live 判定するか
}

export const BOUNDARIES: Boundary[] = [
  {
    id: 'B1',
    name: 'DN値境界（軸受方式の移行）',
    en: 'ROLLING-ELEMENT DN LIMIT',
    law: 'DN = d[mm] × N[rpm] ≲ 1–3×10⁶',
    detail:
      '転がり軸受の実用上限。グリース潤滑は下側（現行 1.4–1.9×10⁶ dmn）、上側 3×10⁶ はジェット潤滑・航空主軸（NASA実証）とオイルエア・アンギュラ玉の二系統。超えると油膜（ティルティングパッド）→ガス/フォイル→AMBへ移行が強制され、その移行の代償（減衰の得失）が台帳に載る。',
    caution:
      '一次照合済み（2026-07）。注意: 航空系 DN=内径基準／メーカー系 dmn=ピッチ円径基準（同一運転点で dmn は約1.15–1.3倍大きく出る）。レンジは業界横断の目安でカタログ規定値ではない（現行カタログは ISO 15312 基準速度の個別公表方式）',
    sources: ['NASA-TMX71877-1976', 'NSK-SURSAVE-2016'],
    calc: true,
  },
  {
    id: 'B2',
    name: '周速壁（遠心応力）',
    en: 'SURFACE SPEED WALL',
    law: 'σ_θ ≈ ρU²　(薄肉リング近似)',
    detail:
      'σ_allow=1,000 MPa・ρ=7,850 kg/m³ なら薄肉リングの理論上限 U≈358 m/s（中実ディスクは形状係数で約0.4ρU²まで緩む）。実測相場: 電機（PM）ロータは応力律速で今日250 m/s以下（最高報告245 m/s）、スリーブ保持PMで約300が現状上限・最高峰報告約400。遠心インペラは550 m/s級＝Ti必須（400 m/sはTi実機実証）。高出力密度化は「径を増やす」方向をここで封じられ、軸方向に伸びるか回転数を上げるしかなく、どちらも B3 を押す。',
    caution:
      '一次照合済み（2026-07）: PM≤250はBorisavljević逐語・Ti 550はCasey ETC10逐語。材料帯別（積層250/表面PM300/最高400）はGerada 2014のスニペット確認（本文逐語未達）',
    sources: ['Borisavljevic-2013', 'Casey-ETC10-2013', 'Gerada-2014-IEEE-TIE'],
    calc: true,
  },
  {
    id: 'B3',
    name: '超臨界化の強制（細長比スケーリング）',
    en: 'SUPERCRITICAL FORCING',
    law: 'ω₁ ∝ (d/L²)√(E/ρ)　×　T ∝ τ·d³',
    detail:
      '高速化（P=TΩ で Ω↑・T↓）は軸径 d を細くできる一方、モータ有効長・軸受スパン L は出力とともに縮まない。ゆえに Ω↑・d↓・L≈一定 → ω₁/Ω が必然的に 1 を切り、超臨界運転が標準化する。選択ではなく B2×トルク制約からの帰結。',
    caution: '計算機は均一鋼軸・単純支持の目安（ディスク・軸受剛性で数十%動く）',
    sources: [],
    calc: true,
  },
  {
    id: 'B4',
    name: 'Wachel境界（危険速度律速 ⇄ 安定性律速）',
    en: 'WACHEL DICHOTOMY',
    law: 'Q ∝ MW·(ρd/ρs)·HP/(D·H·N)',
    detail:
      '低分子量（H2, MW=2）は Q が小さいが段あたりヘッドが低く多段・長スパン化→危険速度律速。高密度（CO2/sCO2）は Q が大きくサブシンクロナス安定性律速（log dec>0.1 が設計制約。実測: CO2-IGC で 1.24→ISFD 1.33）。同じドライバが流体物性だけで正反対の課題に分岐する。',
    caution: 'マップの帯域は定性 [設計判断]。係数は TR684-1 本文照合待ち',
    sources: ['Baba-2020-GPPS', 'TAMU-sCO2-Tutorial'],
    calc: true,
  },
  {
    id: 'B5',
    name: 'UMP負剛性境界（モータ一体化）',
    en: 'UMP NEGATIVE STIFFNESS',
    law: 'k_UMP ∝ B²·(D·L)/δ　＜0',
    detail:
      '偏心ロータの不平衡磁気吸引力は線形化すると負の半径方向剛性。実測例では第1曲げ固有振動数が 105→78 Hz に低下。高磁束密度・小ギャップ・大口径ほど k_UMP/k_shaft が増え、「電磁設計が危険速度を動かす」領域に入る。2×電源周波数励振も同根。',
    sources: ['Holopainen-Sopanen-2005', 'HighSpeedPM-Machines-2022'],
    calc: false,
  },
  {
    id: 'B6',
    name: '材料・環境限界（水素脆化・温度）',
    en: 'MATERIAL / ENVIRONMENT LIMIT',
    law: 'H₂: σ_y ≤ 827 MPa (API 617) → U ≈ 300 m/s → 段数↑↑',
    detail:
      '根拠は API 617 の材料条項＝水素サービスで降伏強度 827 MPa・硬さ HRC34 超のインペラ材を禁止（水素脆化対策）。通常ガス機は Mach 数律速で約250 m/s に留まるが、水素は音速が高く Mach 律速が外れる代わりに材料律速に切替わる——標準技術で約300 m/s・先進設計で約400 m/s（Mach 相似の理想は最大1200 m/s）。ヘッド∝U² のため段数が急増（例: 60→110 bar で天然ガス1胴3段 vs 100%H₂ 5胴28段）、B4 の「多段・長スパン化→危険速度律速」を増幅する。sCO2 側は高温×高密度が軸受・シール材料と減衰予測を同時に攻める。',
    caution: '一次照合済み（2026-07）。API 617 条項の逐語は 6th ed.（現行2022年版の節番号は未照合）',
    sources: ['API617-H2-Materials', 'BH-H2ValueChain-2024', 'ETC2023-109'],
    calc: false,
  },
  {
    id: 'B7',
    name: '油フリー軸受の適用限界（V1自身の物理）',
    en: 'OIL-FREE APPLICABILITY',
    law: 'W_foil = ℘·(L·D)·(D·Ω)　／　p_AMB ≲ B²/2μ₀',
    detail:
      'フォイル軸受の負荷容量則の原典は DellaCorte & Valco 2000。係数 ℘ は世代依存: Gen I ≈0.1–0.3・Gen II 0.3–0.6・Gen III ≈1.0（最大1.4）[lb/(in³·krpm)]（原典逐語）。速度比例ゆえ低速で浮上できず起動停止のたびに固体接触——摩耗寿命（固体潤滑、実証10万回級）が適用限界を規定。AMB は磁気飽和の理論上限 0.9–1.6 MPa に対し実用比荷重 約20–40 N/cm²＋停電時タッチダウン軸受要求が付随。油フリー化は無条件のトレンドではなく、適用領域の拡大として読む。',
    caution: '一次照合済み（2026-07）: フォイル係数は原典PDF直読の逐語。AMB実用値はSchweitzer系明文の二次引用経由（教科書本文未達）',
    sources: ['DellaCorte-Valco-2000', 'DellaCorte-NASA-2016', 'ISO14839-5-2022'],
    calc: false,
  },
]

/* 境界×ドライバ行列: 0=−（押さない）/ 1=↑ / 2=↑↑ */
export const MATRIX_DRIVERS = ['D1', 'D2', 'D3', 'D4', 'D6'] as const
export const MATRIX: Record<string, Record<string, 0 | 1 | 2>> = {
  B1: { D1: 2, D2: 1, D3: 1, D4: 2, D6: 0 },
  B2: { D1: 2, D2: 1, D3: 1, D4: 2, D6: 1 },
  B3: { D1: 2, D2: 1, D3: 1, D4: 2, D6: 0 },
  B4: { D1: 0, D2: 2, D3: 1, D4: 1, D6: 0 },
  B5: { D1: 2, D2: 1, D3: 1, D4: 2, D6: 1 },
  B6: { D1: 0, D2: 2, D3: 0, D4: 1, D6: 0 },
  B7: { D1: 1, D2: 1, D3: 2, D4: 2, D6: 1 },
}
export const MATRIX_NOTE: Record<string, string> = {
  'B1-D1': 'e-axle 25–30k rpm',
  'B2-D6': 'FW貯蔵エネルギー∝U²',
  'B4-D2': 'H2⇄CO2 の二分',
  'B5-D4': 'HSPMM 直結',
  'B7-D3': 'チラー Turbocor級→MWc',
}

/* ═══════════════ 計算機（作動流体・プリセット） ═══════════════ */

export interface Fluid {
  key: string
  name: string
  mw: number // 分子量 [g/mol]
}
export const FLUIDS: Fluid[] = [
  { key: 'air', name: '空気', mw: 28.96 },
  { key: 'h2', name: '水素 H₂', mw: 2.016 },
  { key: 'nh3', name: 'アンモニア NH₃', mw: 17.03 },
  { key: 'ch4', name: '天然ガス CH₄', mw: 16.04 },
  { key: 'steam', name: '蒸気 H₂O', mw: 18.02 },
  { key: 'co2', name: 'CO₂ / sCO₂', mw: 44.01 },
  { key: 'ref', name: '低GWP冷媒 (R1234ze)', mw: 114.0 },
]
export const FLUID_MAP: Record<string, Fluid> = Object.fromEntries(FLUIDS.map((f) => [f.key, f]))

export interface MachineInput {
  d: number // ジャーナル径 [mm]
  N: number // 回転数 [rpm]
  L: number // 軸受スパン [mm]
  D: number // ロータ最大外径 [mm]（周速用: インペラ/スリーブ/FW外径）
  fluid: string
  p: number // 吐出圧力 [bar abs]
  T: number // 吐出温度 [°C]
  motor: boolean // モータ一体（B5 が効くか）
}

export const PRESETS: { key: string; name: string; note: string; inp: MachineInput }[] = [
  {
    key: 'eaxle',
    name: 'e-axle 30k rpm',
    note: 'EV駆動・転がり軸受の壁に接近',
    inp: { d: 40, N: 30000, L: 250, D: 130, fluid: 'air', p: 1, T: 60, motor: true },
  },
  {
    key: 'fccomp',
    name: 'FC空気コンプレッサ',
    note: '12万rpm・フォイル軸受',
    inp: { d: 18, N: 120000, L: 130, D: 60, fluid: 'air', p: 3, T: 120, motor: true },
  },
  {
    key: 'chiller',
    name: '油フリーターボチラー',
    note: 'AMB・低GWP冷媒',
    inp: { d: 60, N: 18000, L: 450, D: 280, fluid: 'ref', p: 8, T: 45, motor: true },
  },
  {
    key: 'h2igc',
    name: '水素IGC ピニオン軸',
    note: '低MW・多段の代表',
    inp: { d: 55, N: 30000, L: 380, D: 250, fluid: 'h2', p: 100, T: 80, motor: false },
  },
  {
    key: 'ccus',
    name: 'CCUS CO₂圧縮機',
    note: '高密度・安定性律速側',
    inp: { d: 70, N: 14000, L: 900, D: 350, fluid: 'co2', p: 150, T: 90, motor: false },
  },
  {
    key: 'sco2',
    name: 'sCO₂タービン',
    note: 'STEP級 27k rpm・250 bar',
    inp: { d: 80, N: 27000, L: 650, D: 200, fluid: 'co2', p: 250, T: 500, motor: false },
  },
  {
    key: 'syncon',
    name: '同期調相機',
    note: 'D6・大型高慣性ロータ',
    inp: { d: 450, N: 3000, L: 7000, D: 1100, fluid: 'air', p: 1, T: 40, motor: false },
  },
]

/* ═══════════════ 減衰の台帳（LEDGER） ═══════════════ */

export interface LedgerItem {
  key: string
  name: string
  mech: string // 機構の1行
  side: 'consume' | 'supply'
  rd: string[] // RD クラスタ key
  sol?: string[] // 解 S1–S5
  vec?: string // 対応する共通ベクトル
  lostBy?: string // 供給側: 何によって失われるか
}

export const LEDGER: LedgerItem[] = [
  // ── 消費側（不安定化・減衰需要の増加） ──
  {
    key: 'xc',
    name: '空力クロスカップリング',
    mech: 'シール・隙間流れの接線力（Thomas/Alford・Wachel）。高密度流体で急増。',
    side: 'consume',
    rd: ['stability', 'seal'],
    vec: 'V4',
  },
  {
    key: 'internal',
    name: '内部減衰・組立ロータヒステリシス',
    mech: '超臨界運転で安定化→不安定化側に転じる。焼嵌め・積層・スリーブ界面。',
    side: 'consume',
    rd: ['stability', 'critspeed'],
    vec: 'V2',
  },
  {
    key: 'ump',
    name: 'UMP・電磁負剛性/負減衰',
    mech: 'モータ一体化で固有値低下＋2×電源周波数励振を追加。',
    side: 'consume',
    rd: ['emag'],
    vec: 'V3',
  },
  {
    key: 'grid',
    name: '系統事象・ねじり励振',
    mech: '短絡・IBR近傍SSTI・AI-DC負荷急変。系統慣性低下で増える。',
    side: 'consume',
    rd: ['torsional'],
    vec: 'V3',
  },
  {
    key: 'contact',
    name: '接触・ラビング',
    mech: 'dry whirl/whip・タッチダウン・起動停止接触。小隙間化・油フリー化で増える。',
    side: 'consume',
    rd: ['stability', 'bearing'],
    vec: 'V1',
  },
  // ── 供給側（安定化・減衰の調達源） ──
  {
    key: 'oil',
    name: '油膜（すべり軸受）',
    mech: '最大の受動減衰源。業界はこれを手放す方向に進んでいる。',
    side: 'supply',
    rd: ['bearing'],
    sol: [],
    lostBy: 'V1 油フリー化で喪失',
  },
  {
    key: 'sfd',
    name: 'SFD・ダンパシール',
    mech: '油膜減衰の局所再導入＋スワールブレーキで消費側も削減。',
    side: 'supply',
    rd: ['bearing', 'seal'],
    sol: ['S2', 'S3'],
  },
  {
    key: 'amb',
    name: 'AMB 能動制御',
    mech: '制御で減衰を「作る」。帯域・容量・停電時タッチダウンが上限。',
    side: 'supply',
    rd: ['bearing'],
    sol: ['S1', 'S3'],
  },
  {
    key: 'foil',
    name: 'フォイルの構造減衰',
    mech: 'バンプ箔 microslip。非線形で定量困難＝予測能力が課題。',
    side: 'supply',
    rd: ['bearing', 'stability'],
    sol: ['S1'],
  },
  {
    key: 'measure',
    name: 'UQ・計測・デジタルツイン',
    mech: '減衰を「測り・予測する」能力。供給を確実化する（それ自体は減衰を作らない）。',
    side: 'supply',
    rd: ['digital', 'monitoring'],
    sol: ['S4'],
  },
]

/* 機種アーキタイプ: 台帳のどこが動くか */
export interface Archetype {
  key: string
  name: string
  drivers: string[]
  consume: string[] // 効いている消費項目
  supply: string[] // 使える供給項目
  lost: string[] // 失った供給項目
  read: string // 収支の読み（1–2文）
  sources?: string[]
}

export const ARCHETYPES: Archetype[] = [
  {
    key: 'chiller',
    name: '油フリーターボチラー（AMB）',
    drivers: ['D1', 'D3'],
    consume: ['ump', 'contact'],
    supply: ['amb', 'measure'],
    lost: ['oil'],
    read: '油膜を捨て、AMB制御で減衰を「作って」代替する構図。残余リスクは停電ドロップ＝接触（タッチダウン軸受, ISO 14839-5）と、モータ一体のUMP。',
    sources: ['ISO14839-5-2022'],
  },
  {
    key: 'h2igc',
    name: '水素多段圧縮機（IGC）',
    drivers: ['D2'],
    consume: ['xc'],
    supply: ['oil', 'sfd'],
    lost: [],
    read: '低MWゆえ消費（クロスカップリング）は小さく収支は健全。ただし多段・長スパン化で減衰の「需要」側でなく危険速度配置が律速＝B4 の左側。',
  },
  {
    key: 'sco2',
    name: 'sCO₂タービン / CO₂圧縮機',
    drivers: ['D2', 'D3'],
    consume: ['xc', 'internal'],
    supply: ['oil', 'sfd'],
    lost: [],
    read: '高密度流体が消費を大量注入する安定性律速＝B4 の右上。ダンパシール＋ISFDで供給を追加する実測例: log dec 1.24→1.33（CO2-IGC）。',
    sources: ['Baba-2020-GPPS', 'SwRI-STEP-Rotordyn-2018'],
  },
  {
    key: 'eaxle',
    name: 'e-axle / 高速PMモータ',
    drivers: ['D1', 'D4'],
    consume: ['ump', 'internal'],
    supply: ['measure'],
    lost: [],
    read: '転がり軸受は受動減衰がほぼゼロ＝もともと供給が細い。UMP負剛性と（超臨界化すれば）組立ロータ内部減衰が消費に載り、収支が最も細い機種群。ガス/AMB移行（B1超え）が供給側の再設計を迫る。',
    sources: ['Holopainen-Sopanen-2005'],
  },
  {
    key: 'fccomp',
    name: 'FC空気コンプレッサ（フォイル）',
    drivers: ['D4', 'D1'],
    consume: ['contact', 'xc'],
    supply: ['foil'],
    lost: ['oil'],
    read: '供給はバンプ箔の microslip 頼み＝非線形で定量困難。起動停止のたびの固体接触（摩耗寿命）と高速側のサブシンクロナス渦動が消費側。予測能力（WFR実測DB）がボトルネック。',
    sources: ['DellaCorte-NASA-2016'],
  },
  {
    key: 'tg',
    name: 'タービン発電機 × 系統（D6）',
    drivers: ['D6', 'D3'],
    consume: ['grid'],
    supply: ['oil'],
    lost: [],
    read: '横振動系は油膜で健全。新しい消費は「ねじり系」に載る——系統慣性低下・IBR近傍SSTI・負荷急変。ターボ機械のねじり減衰は<1%（照合待ち）と細く、系統側文書（NERC EMT）に軸系保護が明文化された。',
    sources: ['NERC-EMT-IBR-2024'],
  },
  {
    key: 'fw',
    name: '磁気浮上フライホイール',
    drivers: ['D6'],
    consume: ['ump', 'contact'],
    supply: ['amb', 'measure'],
    lost: ['oil'],
    read: '真空中・高周速（貯蔵エネルギー∝U²＝B2）で油膜という選択肢が最初から無い。AMB制御＋ドロップ時タッチダウンが収支のすべて。',
    sources: ['Dinglun-Flywheel-2024', 'ISO14839-5-2022'],
  },
]

/* 共通ベクトルの台帳再解釈（V1–V5 → 収支のどちら側か） */
export const VECTOR_LEDGER: { id: string; name: string; role: string; side: 'consume' | 'supply' | 'both' }[] = [
  { id: 'V1', name: '油フリー化', role: '主要調達源（油膜）の喪失', side: 'supply' },
  { id: 'V2', name: '超高速・高出力密度', role: '減衰需要の増加（超臨界通過・内部減衰の反転）', side: 'consume' },
  { id: 'V3', name: 'モータ一体化・系統連成', role: '消費源の追加（UMP・系統事象）', side: 'consume' },
  { id: 'V4', name: '作動流体の極端化', role: '消費源の注入（クロスカップリング）', side: 'consume' },
  { id: 'V5', name: 'デジタル化', role: '台帳を測り・予測する能力（供給の確実化）', side: 'both' },
]

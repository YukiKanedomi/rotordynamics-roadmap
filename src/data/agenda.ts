// 直近5年（2026–2031）で取り組むべき具体的研究課題（RESEARCH AGENDA）。
// 導出（2軸・2026-07-05 フラット化改訂）:
//   軸1: 課題空間 = 分野の総意（IFToMM 2026/2023・SIRM 2023・Turbo Expo S&D の公式トピック分類
//        × 直近レビュー論文の分布）で外部準拠に張る（TOPIC_SPACE）。特定の知見体系に依らない。
//   軸2: 選定 = 需要ドライバ接続（ロードマップの 〜2030/早期 〜2035 マイルストーン）×
//        設計法・検証データ・規格のギャップ。非採択領域も理由を明示して残す。
// 次ステップ: 各課題の players はベンチマーク調査（論文・技報・プレス）のシード。
//             benchAxes が比較軸。bench ステータスは調査完了後に更新する。

import type { Confidence } from './roadmap'

export type AgendaTier = 'A' | 'B' | 'C'

export interface AgendaPlayer {
  name: string
  type: 'OEM' | '研究機関' | '大学'
}

export interface AgendaItem {
  id: string
  tier: AgendaTier
  title: string
  rd: string[] // RD クラスタ key（roadmap.ts と共通）
  drivers: string[] // ドライバ id
  milestones: string[] // 対応マイルストーン id
  confidence: Confidence
  question: string // 核心の研究の問い（検証可能な形）
  physics: string // 何が難しいか（物理）
  goal5y: string // 5年後の検証可能なゴール
  whyNow: string // なぜ今か
  sources: string[]
  benchAxes: string[] // ベンチマーク比較軸（次ステップ）
  players: AgendaPlayer[] // ベンチマーク対象シード（未検証・調査で更新）
  gap?: string // 文献・規格の空白（あれば）
}

export const TIER_META: Record<AgendaTier, { name: string; desc: string }> = {
  A: {
    name: '実装先行・設計法が未整備',
    desc: '製品・実装が先に走り、予測法・設計基準・実測データが追いついていない領域。着手即。',
  },
  B: {
    name: '需要立ち上がりが確定的',
    desc: '2028年前後に実需が立ち上がることが一次情報で裏付く領域。今から布石を打つ。',
  },
  C: {
    name: '方法論・基盤（全課題横断）',
    desc: '個別機種でなく設計・運用の方法論そのものを変える基盤研究。5年スパンで整備。',
  },
}

// ───────────── 課題空間（フラット・外部準拠） ─────────────
// 領域リストは学会公式分類の統合（複数会議に現れるトピック）に基づき、
// 各領域の「研究活発度／総説の空白」を直近レビュー分布で注記する。
export interface TopicArea {
  key: string
  name: string
  anchors: string // 学会分類での出現（略記: IFToMM26/23・SIRM・TE=Turbo Expo・ISMB・TPS）
  review: string // 直近レビュー論文の状況（活発度・空白の証拠）
  cover: 'full' | 'partial' | 'none'
  rq?: string[]
  note?: string // partial/none の理由・扱い
}

export const TOPIC_SPACE_REFS = ['IFToMM-2026-CFP', 'IFToMM-2023-CFP', 'SIRM-2023-Topics', 'ASME-TE-SD-2024']

export const TOPIC_SPACE: TopicArea[] = [
  { key: 'bearings-seals', name: '軸受・シール動特性', anchors: 'IFToMM26·23 / SIRM / TE / ISMB / TPS', review: 'ガスフォイル軸受は総説4本超（2022–24）で最活発。シール動特性は個別研究が活発なのに総説空白。', cover: 'full', rq: ['RQ-01', 'RQ-02', 'RQ-03'] },
  { key: 'stability', name: '動解析・安定性（whirl・自励・ラビング）', anchors: 'IFToMM26·23 / SIRM / TE / TPS', review: 'ラビングは包括総説あり（Nonlinear Dyn 2020）。', cover: 'full', rq: ['RQ-01', 'RQ-03', 'RQ-15'], note: 'ラビング単独のRQは立てず、TDBドロップ（RQ-02）・渦動（RQ-01）の中で扱う。' },
  { key: 'thermal', name: '熱-振動連成（Morton効果・熱曲がり）', anchors: 'TE / TPS 実務定番（分類上は安定性配下）', review: '総説は2017年（ASME AMR）で停止＝9年間の空白。発生報告は継続。', cover: 'full', rq: ['RQ-15'] },
  { key: 'balancing', name: 'バランシング・加振低減', anchors: 'IFToMM26·23 / SIRM', review: '分類総説あり（Machines 2021）。ISO/CD 21940-12 改訂進行中。', cover: 'full', rq: ['RQ-14'] },
  { key: 'monitoring', name: '状態監視・診断・予知（損傷診断含む）', anchors: 'IFToMM26·23 / SIRM / ISMB / TPS', review: 'クラック診断は最新総説あり（Nonlinear Dyn 2024）。DT系レビューは乱立気味（2024–25）。', cover: 'full', rq: ['RQ-12'] },
  { key: 'control', name: '振動制御・アクティブ要素（SFD・スマートロータ）', anchors: 'IFToMM26·23 / SIRM / ISMB', review: 'AMB制御総説2025。SFDは2002年以降体系的総説が空白。', cover: 'full', rq: ['RQ-17'] },
  { key: 'emag', name: '電気機械連成（UMP・ベアリングレス）', anchors: 'IFToMM26·23 / SIRM / ISMB', review: 'UMP専用総説は空白。ベアリングレスは2020年。個別研究は活発。', cover: 'full', rq: ['RQ-07'] },
  { key: 'torsional', name: 'ねじり振動・ギア系', anchors: 'IFToMM26·23', review: 'ねじり専用総説は空白（隣接: 噛合い剛性総説 MMT 2021）。', cover: 'full', rq: ['RQ-05', 'RQ-09'] },
  { key: 'uq', name: '不確かさ・信頼性・寿命予測', anchors: 'IFToMM26·23 / TE (Probabilistic)', review: '体系的総説あり（Fu, MSSP 2023）。', cover: 'full', rq: ['RQ-10'] },
  { key: 'digital', name: 'デジタルツイン・AI/ML', anchors: 'IFToMM26 / TE', review: 'DTレビュー乱立（2024–25）＝研究過熱。RD専用実装は依然希薄。', cover: 'full', rq: ['RQ-11', 'RQ-12'] },
  { key: 'foundation', name: '基礎・支持構造・ケーシング連成（耐震含む）', anchors: 'TE (Structural Mechanics) / ISO 20816・API 684 の支持剛性要求', review: '総説空白（風車の地震影響のみ2026年に統合レビュー）。', cover: 'full', rq: ['RQ-16'] },
  { key: 'identification', name: '同定・モーダル試験', anchors: 'IFToMM23 / SIRM / ISMB', review: '専用総説は未確認。', cover: 'partial', rq: ['RQ-04', 'RQ-11', 'RQ-14'], note: '独立RQとせず、組立ロータのβ同定（RQ-04）・モデルベースバランス（RQ-14）・DT係数同定（RQ-11）に内包。' },
  { key: 'nonlinear', name: '非線形・パラメトリック/自励現象', anchors: 'IFToMM23（3項目明示） / IFToMM26 (rub, whirl)', review: '現象横断の総論レビューは2020年以降不在。', cover: 'partial', rq: ['RQ-01', 'RQ-15'], note: '方法論として独立させず、強非線形が支配する個別課題（フォイル軸受・Morton・TDB接触）の中で扱う。' },
  { key: 'composite', name: '複合材・組立ロータ（CFRP・積層・焼嵌め）', anchors: 'IFToMM23 (Smart Rotor 系) / 個別研究活発', review: '総説空白（2015年の概説章のみ）＝一次データの新規性が高い。', cover: 'full', rq: ['RQ-04'] },
  { key: 'cryo', name: '機種別: 極低温・ターボポンプ', anchors: 'IFToMM23 (Micro/Cryogenic)', review: 'ターボポンプRD総説は空白。個別解析のみ。', cover: 'full', rq: ['RQ-13'] },
  { key: 'green', name: 'グリーンエネルギー・貯蔵（FW・水素・sCO2）', anchors: 'IFToMM26·23 / ISMB (flywheels)', review: '会議側で2023年以降トピック新設＝需要側の拡張領域。', cover: 'full', rq: ['RQ-03', 'RQ-06', 'RQ-08'] },
  { key: 'blade', name: 'ブレード・翼付きディスク・ミスチューニング', anchors: 'IFToMM23 / TE / JSME D&D', review: 'ミスチューニング総説は2017年で停止。', cover: 'none', note: '非採択: 翼・ディスク振動は構造動力学の隣接領域。blade-shaft 連成が危険速度に効く場合のみ機種課題内で扱う。' },
  { key: 'app-others', name: '機種別: ターボチャージャ・風力・水力・車両', anchors: 'IFToMM23 / SIRM', review: 'ターボチャージャ非線形は研究蓄積厚い（TU Darmstadt 系）。', cover: 'none', note: '非採択: 需要ドライバ接続が弱い（成熟市場）か既存の産業研究体制が厚い。風力の増速機・耐震は RQ-09/16 に部分接続。' },
]

export const AGENDA: AgendaItem[] = [
  // ───────────── TIER A: 実装先行・設計法が未整備 ─────────────
  {
    id: 'RQ-01',
    tier: 'A',
    title: 'ガス/エアフォイル軸受ロータのサブシンクロナス渦動 — 予測精度の実証と抑制設計',
    rd: ['stability', 'bearing'],
    drivers: ['D1', 'D3', 'D4'],
    milestones: ['D4-1', 'D4-3', 'D1-5'],
    confidence: '確立',
    question:
      '渦動オンセット速度とリミットサイクル振幅を、設計段階の解析（気膜非線形＋構造）で実測に対しどの精度まで予測できるか。マルチパッド・プリロード・シム等の抑制設計を定量則にできるか。',
    physics:
      '気膜の剛性・減衰は振幅と周波数に依存する強非線形で、主要減衰源がトップフォイルの摩擦ヒステリシスという「モデル化しにくい物理」に集中する。減衰の定量化が最難関という業界総括がそのまま当てはまる。',
    goal5y:
      '10–15万rpm級実機での渦動オンセット予測誤差（速度・周波数比）の公表可能なベンチデータと、パッド構成・プリロード選定の設計チャート。',
    whyNow:
      'フォイル軸受の実装レンジがFC数十kWからHVAC 25–1,750 kWcへ跳躍（量産2026後半）。適用が先に拡大し、渦動の予測法とガス軸受機の受入規格が追いついていない。',
    sources: ['Garrett-OilFree-2026', 'Xu-IMechE-FoilRotor-2024', 'GFB-FCEV-CritSpeed-2023', 'ASME-Spakovszky-2023'],
    benchAxes: ['渦動オンセット速度/渦動比の実測公表値', '荷重容量×速度の包絡線', '量産適用レンジ(kWc)と累積稼働実績', '解析-実測の照合公表の有無'],
    players: [
      { name: 'Garrett Motion', type: 'OEM' },
      { name: 'IHI', type: 'OEM' },
      { name: 'Hanwha Power Systems', type: 'OEM' },
      { name: 'NASA GRC', type: '研究機関' },
      { name: 'KAIST', type: '大学' },
      { name: 'Texas A&M Turbolab', type: '大学' },
    ],
    gap: 'フォイル/ガス軸受機の受入・適格性を正面から扱う API/ISO 規格が存在しない（AMBのISO 14839系に相当する枠組みの空白）。',
  },
  {
    id: 'RQ-02',
    tier: 'A',
    title: 'AMB機のタッチダウン軸受設計 — ドロップ動力学・再浮上・寿命の定量基準',
    rd: ['bearing', 'stability', 'monitoring'],
    drivers: ['D3', 'D6'],
    milestones: ['D3-1', 'D3-5', 'D6-3'],
    confidence: '確立',
    question:
      'ロータドロップ時に前進すりこぎ／後退ドライホイップのどちらへ発展するかを設計段階で判別し、TDB寿命（許容ドロップ回数）と再浮上（recontrol）可否を定量化できるか。',
    physics:
      'ドロップは「摩擦で駆動される自励系」で、接触点の摩擦力がロータを後ろ向きに転がす——後退ドライホイップに入ると接触力が指数的に成長する。入るか入らないかは摩擦係数・クリアランス・ダンピングの競合で決まり、僅差で分岐する。',
    goal5y:
      'ISO 14839-5 を実務に落とす設計計算書テンプレート（ドロップシミュレーション検証込み）と、TDB残寿命のオンライン推定手法。',
    whyNow:
      '大容量磁気軸受チラー・磁気浮上フライホイール（中国30MW/120基が系統接続）・HOFIM型圧縮機と適用が急拡大。ISO 14839-5(2022) で枠組みはできたが、寿命定量とドロップ後再浮上の運用基準はこれから。',
    sources: ['ISO14839-5-2022', 'Khatri-Hawkins-ISMB16', 'Dinglun-Flywheel-2024', 'KAIST-SensorlessAMB-2025'],
    benchAxes: ['公表ドロップ試験の規模（速度・回数・全速ドロップ有無）', 'TDB寿命の定量評価法の有無', '再浮上(recontrol)実証', 'ISO 14839-5 準拠の設計文書公開度'],
    players: [
      { name: 'SKF (S2M)', type: 'OEM' },
      { name: 'Calnetix / Waukesha', type: 'OEM' },
      { name: 'MAN Energy Solutions', type: 'OEM' },
      { name: 'Danfoss Turbocor', type: 'OEM' },
      { name: 'KAIST', type: '大学' },
      { name: 'ZHAW / Mecos', type: '研究機関' },
    ],
  },
  {
    id: 'RQ-03',
    tier: 'A',
    title: '高密度ガス機（CO2/sCO2）のロータ安定性 — ダンパシール設計と対数減衰率の実測DB',
    rd: ['stability', 'seal'],
    drivers: ['D2', 'D3'],
    milestones: ['D2-2', 'D2-5', 'D3-4'],
    confidence: '確立',
    question:
      '高密度ガス（吐出20MPa級CO2、将来はsCO2）でのシール起因クロスカップル剛性を、スワールブレーキ／ダンパシール込みでどの精度で予測できるか。log dec 実測値の系統的データベースを作れるか。',
    physics:
      'ガス密度が水に近づくと、シール内の旋回流が生む接線力（クロスカップル剛性）が流体密度に比例して成長し、最低次モードの減衰を食い潰す。「隙間の中の見えない旋回」が安定性の支配項になるのが高密度機の本質。',
    goal5y:
      '密度・周速・シール型式をパラメータにした log dec 予測-実測照合マップ（公表データ集約＋自社試験）と、スワールブレーキ設計の第一原理則。',
    whyNow:
      'CCUS用多段CO2圧縮機は商用段階（8段・log dec 1.24→ISFDで1.33の実測ベンチマークが公表済）、sCO2発電はSTEP Phase 1完了（500°C・27,000rpm）。設計余裕の根拠となる実測DBが決定的に不足。',
    sources: ['Baba-2020-GPPS', 'ASME-SwirlBrake-2023', 'DOE-STEP-SwRI-2024', 'SwRI-STEP-Rotordyn-2018', 'TAMU-sCO2-Tutorial'],
    benchAxes: ['log dec 実測公表値（密度・段数条件付き）', 'ダンパシール/スワールブレーキの実装型式', 'sCO2実証機の到達条件（温度・回転数・出力）', 'Level II 安定性解析の公開手法'],
    players: [
      { name: 'SwRI (STEP)', type: '研究機関' },
      { name: '三菱重工コンプレッサ', type: 'OEM' },
      { name: 'Baker Hughes', type: 'OEM' },
      { name: 'Siemens Energy', type: 'OEM' },
      { name: 'Elliott Group', type: 'OEM' },
      { name: 'Texas A&M Turbolab', type: '大学' },
    ],
  },
  {
    id: 'RQ-04',
    tier: 'A',
    title: '組立ロータ（焼嵌めスリーブ・分割要素）の曲げ剛性同定と限界設計',
    rd: ['critspeed', 'emag'],
    drivers: ['D1', 'D4', 'D5'],
    milestones: ['D5-5', 'D4-2', 'D1-7'],
    confidence: '推定',
    question:
      '焼嵌めスリーブ・分割磁石・積層コアなど「締結で成立するロータ」の複合曲げ剛性（一体率β）を、回転数・温度の関数として同定する標準手順を確立できるか。βの根拠をもって限界設計（安全側一律ではなく）に踏み込めるか。',
    physics:
      '締結面が滑らなければ断面は一体で曲がり（電話帳を糊付けした状態）、滑れば各要素が独立に曲がって剛性が桁で落ちる。境界は接触圧×摩擦と曲げが要求するせん断流の大小関係で決まり、遠心力で接触圧が変わるためβは回転数の関数になる。',
    goal5y:
      '自由-自由モーダル試験×接触FE×回転試験を組み合わせた β(Ω) 同定プロトコルと、ひずみエネルギー分布に基づくモデル簡略化の判定則（Δf/f ≈ (ε/2)·η）の検証事例集。',
    whyNow:
      '高出力密度化（NASA 12kW/kg目標・50kW/L級）で軸細径化と高周速化が同時進行し、スリーブ/磁石の剛性寄与を「無視するか一体とみなすか」の差が危険速度予測を左右するようになった。分割要素の曲げ剛性を正面から扱う公表文献はほぼ空白。',
    sources: ['NASA-EAP-2023', 'JMP-CFRPshaft-2024', 'HighSpeedPM-Machines-2022'],
    benchAxes: ['スリーブ/磁石剛性寄与の実測公表（modal update事例）', '許容周速×温度の包絡線', 'CFRP vs 金属スリーブの選定基準', '接触FE-実測照合の公開度'],
    players: [
      { name: 'LUT University', type: '大学' },
      { name: 'University of Sheffield', type: '大学' },
      { name: 'Celeroton', type: 'OEM' },
      { name: 'e+a Elektromaschinen', type: 'OEM' },
      { name: 'TU Darmstadt', type: '大学' },
    ],
    gap: '周方向分割磁石組立体の曲げ剛性寄与を扱う公表文献が見当たらない（実測・解析とも）。ここの一次データ取得は即新規性になる。',
  },
  {
    id: 'RQ-05',
    tier: 'A',
    title: 'インバータ・系統起因ねじり振動の統合評価 — VFD高調波・SSTI・負荷急変疲労',
    rd: ['torsional'],
    drivers: ['D1', 'D3', 'D6'],
    milestones: ['D1-4', 'D3-7', 'D6-4'],
    confidence: '確立',
    question:
      'VFD高調波（6次/12次）・IBR近傍SSTI・AIデータセンター負荷急変という3系統の電気起因ねじり励振を、単一の軸系設計フロー（分離余裕＋疲労寿命）に統合できるか。',
    physics:
      '電気系はねじり軸系から見ると「ばね-慣性列に外から周期トルクを注ぎ込む窓」。インバータ制御は負減衰としても働き得るため、励振（強制振動）と減衰改変（自励）の二面を同時に持つのが厄介さの根源。',
    goal5y:
      'EMT解析（NERC 2024ガイドライン）とGoodman線図疲労評価を接続した統合評価テンプレートと、負荷急変プロファイル別のねじり応答データ。',
    whyNow:
      'AI学習サイクルによる定格70%級の電力急変が発電機軸のサブシンクロナス帯を叩く事象が指摘され（2026 preprint）、NERCがIBR近傍SSTI評価をガイドライン化（2024-12）。電化・系統変容でねじりの励振源が急増中。',
    sources: ['AIDC-Torsional-2026', 'NERC-EMT-IBR-2024', 'ASME-GT1996-ShortCircuitTorsion'],
    benchAxes: ['SSTI/EMT解析の実施体制公表', 'ねじり計測（テレメトリ/ひずみ）実績', '負荷急変×疲労の評価事例', 'VFD側フィルタ/制御対策の実装'],
    players: [
      { name: 'NERC / EPRI', type: '研究機関' },
      { name: 'Siemens Energy', type: 'OEM' },
      { name: 'GE Vernova', type: 'OEM' },
      { name: 'ABB', type: 'OEM' },
      { name: 'TMEIC', type: 'OEM' },
    ],
  },

  {
    id: 'RQ-15',
    tier: 'A',
    title: '熱-振動連成の予測 — Morton効果（熱誘起同期不安定）の設計回避則',
    rd: ['stability', 'bearing'],
    drivers: ['D1', 'D2', 'D4'],
    milestones: ['D1-2', 'D2-7', 'D4-3'],
    confidence: '確立',
    question:
      'ジャーナル周方向温度差→熱曲がり→同期振動成長という熱-振動フィードバック（Morton効果）を、設計段階で発生回転数・成長率まで予測し、高周速オーバーハング機の設計回避則（軸受選定・オーバーハング慣性・冷却）として定式化できるか。',
    physics:
      '振れ回るジャーナルは油膜の薄い側がつねに同じ側を向き、そこだけ摩擦加熱される——回りながら片側だけ日焼けする状態。温度差が熱曲がりを生み、曲がりが不釣合いを増やし、振れ回りがさらに偏る正帰還ループ。熱の時定数（分）と振動の時定数（ミリ秒）が3桁離れているため、ゆっくり成長するスパイラルとなり検知も予測も難しい。',
    goal5y:
      'Morton安定性マップ（速度×オーバーハング慣性×軸受形式）の実測照合版と、発生時の運転回避・設計変更の判断フロー。',
    whyNow:
      'ギアード圧縮機・ターボエキスパンダ・高速モータ一体機とオーバーハング構成が増え発生報告が続く一方、総説は2017年で停止し、熱-構造-油膜連成の予測ツールは実装途上。実務で繰り返し発生するのに設計法が確立していない典型的ギャップ。',
    sources: ['Tong-Morton-AMR-2017'],
    benchAxes: ['Morton予測解析（熱-構造-油膜連成）の実装公表', '実機トラブル事例と対策の公開', '予測-実測の照合公表', '商用解析コードでの機能提供'],
    players: [
      { name: 'Texas A&M Turbolab', type: '大学' },
      { name: 'Delta JS（MADYN 2000）', type: 'OEM' },
      { name: 'Waukesha Bearings（Dover）', type: 'OEM' },
      { name: 'Kingsbury', type: 'OEM' },
      { name: 'SwRI', type: '研究機関' },
    ],
    gap: 'Morton効果の総説は2017年（ASME AMR）を最後に更新されておらず、予測実装・実測照合の体系的整理が空白。',
  },

  // ───────────── TIER B: 需要立ち上がりが確定的 ─────────────
  {
    id: 'RQ-14',
    tier: 'B',
    title: '弾性ロータバランシングの現代化 — モデルベース・少数試運転・量産インライン',
    rd: ['balancing', 'critspeed'],
    drivers: ['D1', 'D5', 'D6'],
    milestones: ['D1-1', 'D5-6', 'D6-2'],
    confidence: '確立',
    question:
      '影響係数法・モーダルバランスをモデルベース化（試し錘レス／少数試運転）・自動化し、量産高速ロータ（e-axle・FC圧縮機）のインラインバランスと、大型転用機・再稼働機の現地バランスの両端で、ISO 21940 系に載る手順として確立できるか。',
    physics:
      'バランシングはモード直交性を使った逆問題で、試し錘は感度行列を実測で得る手段。モデル（とその不確かさ）が信頼できるほど試運転回数を減らせる——精度の源泉が実測からモデルへ移る転換点にある。回転数を上げるほど高次モードが顔を出し、修正面の数と位置が幾何で縛られるのが本質的制約。',
    goal5y:
      '試し錘レス（モデルベース）バランスの実証データ（予測感度と実測感度の誤差統計）と、量産ラインでのバランス等級保証の統計的工程管理手順。',
    whyNow:
      'ISO/CD 21940-12（弾性ロータ）の改訂が進行中で手順の現代化が論点。e-axle 20–30k rpm・FC 10万rpm級の量産は「1本ずつ職人バランス」を許さない物量になる。調相機転用・再稼働（D6-2）は現地再バランスの需要。',
    sources: ['ISO21940-12-CD', 'Machines-Balancing-2021'],
    benchAxes: ['試し錘レス/少数回バランスの公表実証', '量産インラインバランス設備の導入状況', '高速バランシング設備（真空ピット）の保有', 'ISO/TC 108 SC2 への関与'],
    players: [
      { name: 'Schenck RoTec（Dürr）', type: 'OEM' },
      { name: '国際計測器', type: 'OEM' },
      { name: '長浜製作所', type: 'OEM' },
      { name: 'Cleveland State RoMaDyC', type: '大学' },
      { name: 'IIT Guwahati', type: '大学' },
    ],
  },
  {
    id: 'RQ-16',
    tier: 'B',
    title: '支持構造・基礎連成 — 動剛性の現地同定と据付側込みの危険速度予測',
    rd: ['critspeed', 'torsional'],
    drivers: ['D3', 'D6'],
    milestones: ['D3-8', 'D6-1', 'D6-2'],
    confidence: '確立',
    question:
      '支持構造・基礎の周波数依存動剛性を実測同定してロータ解析へ織り込む手順を標準化し、転用機・再稼働機・耐震要求機（SMR・データセンタ）で「機械単体設計と据付側の分断」を解消できるか。',
    physics:
      'ロータから見た支持は油膜＋台板＋基礎の直列ばねで、最も柔らかい要素が支配する。基礎が機械と同程度に柔らかいと危険速度は台板モードと連成して分裂し、単体計算が現地で当たらない古典的原因になる。地震・床振動は基礎側からの広帯域加振で、通常運転では眠っている連成モードを起こす。',
    goal5y:
      '据付後の支持動剛性の現地同定プロトコル（加振試験×運転データ）と、支持連成込み危険速度の予測-実測照合データベース。',
    whyNow:
      '退役火力の調相機転用（D6-2）・原子力再稼働（D3-8）は既存基礎に別の機械を載せる工事で、支持連成の再評価が必須。データセンタは床振動・耐震要求の厳しい新しい据付先。ISO 20816 の支持分類・API 684 の支持剛性要求はあるが、現地同定の標準手順は空白。',
    sources: ['ISO20816-1-2016', 'API-TR684-1-2019'],
    benchAxes: ['支持動剛性の実測同定事例の公表', '基礎連成解析の標準手順の保有', '耐震・地震応答評価の実績', '転用・再稼働案件での再評価実績'],
    players: [
      { name: 'Siemens Energy', type: 'OEM' },
      { name: 'GE Vernova', type: 'OEM' },
      { name: '三菱重工', type: 'OEM' },
      { name: 'Engineering Dynamics (EDI)', type: 'OEM' },
      { name: 'SwRI', type: '研究機関' },
    ],
    gap: 'ロータ-基礎連成・地震応答の総説は空白（風車の地震影響レビューのみ）。現地同定プロトコルの標準も不在。',
  },
  {
    id: 'RQ-06',
    tier: 'B',
    title: '水素多段圧縮機の危険速度設計 — 長スパン単軸 vs インテグラルギアの選定則',
    rd: ['critspeed', 'seal'],
    drivers: ['D2'],
    milestones: ['D2-1', 'D2-3'],
    confidence: '確立',
    question:
      '低分子量ゆえ多段化する水素圧縮で、単軸長スパン（危険速度低下を受容）とインテグラルギア（軸分割で短スパン化）の選定境界を、段数・圧力比・信頼性要求から定式化できるか。',
    physics:
      '水素は音速が高く1段あたりの圧力上昇が稼げない→段数が積み上がる。軸を継ぎ足すほど曲げ固有振動数は長さの2乗で落ちる（梁の物理）ため、「段数の要求」と「危険速度の要求」が軸長を奪い合う。ギアで軸を分割するのはこの綱引きの構造的解。',
    goal5y:
      '段数-スパン-危険速度のトレードオフチャートと、低MWガスでのドライガスシール/ラビリンス動特性の設計データ整備。',
    whyNow:
      'IEA GHR 2025は発表ベースを下方修正したがFID済4Mtpaは維持——実需の立ち上がりは2030年前後に確度高く来る。機械設計の準備期間として今が適期。',
    sources: ['IEA-GHR-2025', 'IEA-GHR-2025-update'],
    benchAxes: ['水素専用圧縮機の受注/実証公表', 'インテグラルギア型の段数・周速レンジ', '低MWガスのシール動特性データ公表', 'API 617準拠設計の公開度'],
    players: [
      { name: 'Siemens Energy', type: 'OEM' },
      { name: 'Baker Hughes', type: 'OEM' },
      { name: 'Atlas Copco Gas and Process', type: 'OEM' },
      { name: '三菱重工コンプレッサ', type: 'OEM' },
      { name: '川崎重工', type: 'OEM' },
    ],
  },
  {
    id: 'RQ-07',
    tier: 'B',
    title: 'モータ一体ロータの電磁-機械連成 — UMP負剛性・2×線周波数加振の設計織り込み',
    rd: ['emag', 'critspeed'],
    drivers: ['D1', 'D3', 'D4'],
    milestones: ['D1-3', 'D4-2', 'D4-9'],
    confidence: '確立',
    question:
      '不平衡磁気吸引力（UMP）の負の半径方向剛性と偏心起因の加振（0次・2×電源周波数）を、複素固有値解析・不釣合い応答に標準的に織り込む設計フローを確立できるか。偏心管理公差と連成解析の分担をどこで切るか。',
    physics:
      'ギャップが縮むほど磁気吸引が強まる——変位と同方向に力が増えるので「負のばね」になり、機械剛性を正味で食う。危険速度が下がる方向にしか働かないため、高速細軸ロータほど無視できない比率になる。',
    goal5y:
      'UMP込み/なしの危険速度差を機種横断で整理したデータ（負剛性比のオーダーマップ）と、電磁-構造連成の標準解析手順書。',
    whyNow:
      'モータ一体型圧縮機・e-axle・電動推進で「電磁石の中で回る細軸」が標準構成化。電磁と機械の設計部署間に落ちやすい界面課題であり、体系化の価値が高い。',
    sources: ['Holopainen-Sopanen-2005', 'IEEE-UMP-9270865', 'HighSpeedPM-Machines-2022', 'Gerada-2014-IEEE-TIE'],
    benchAxes: ['UMP連成解析の公表事例（機種・負剛性比）', '偏心管理公差の設計基準公開', '2×線周波数振動のトラブル/対策公表', '連成解析ツールチェーン'],
    players: [
      { name: 'VTT', type: '研究機関' },
      { name: 'University of Nottingham (PEMC)', type: '大学' },
      { name: 'LUT University', type: '大学' },
      { name: 'ABB', type: 'OEM' },
      { name: '明電舎', type: 'OEM' },
    ],
  },
  {
    id: 'RQ-08',
    tier: 'B',
    title: '同期調相機・フライホイールの軸系設計 — 高慣性ロータ定型化と転用機の再評価',
    rd: ['torsional', 'critspeed', 'balancing'],
    drivers: ['D6'],
    milestones: ['D6-1', 'D6-2', 'D6-3'],
    confidence: '確立',
    question:
      '慣性スペック（GVA·s）起点の高慣性ロータ設計と、退役火力発電機のクラッチ付き調相機転用に伴う再ロータダイナミクス評価（危険速度・ねじり・バランス）を定型化できるか。',
    physics:
      '慣性を売る機械は「重い円盤を細い軸で振り回す」構成に必然的に寄る——慣性は半径の2乗で稼ぐのが効率的だが、同じ2乗則でジャイロ効果と軸受荷重も育つ。フライホイール付加は軸系に低いねじり固有値を1本追加するのと等価で、系統事象の周波数帯と交差しやすい。',
    goal5y:
      '転用再評価のチェックリスト（クラッチ・軸系変更・経年バランス）と、フライホイール連結多スパン軸系の設計事例集。',
    whyNow:
      '英36 GVA·s 全量運開（2026）・米ERCOT 2027納入・独フライホイール付き調相機運開と、TSO調達が既に走っている。設計需要は今後5年がピーク。',
    sources: ['NESO-Stability-2025', 'TenneT-Siemens-FWSC-2024', 'ANDRITZ-GEV-ERCOT-2025', 'AEMO-TPSS-2025'],
    benchAxes: ['調相機受注・納入実績（新造/転用比率）', 'フライホイール付き構成の実装数', '転用時の再RD評価手法公表', '磁気浮上FWの規模（MW・基数）'],
    players: [
      { name: 'Siemens Energy', type: 'OEM' },
      { name: 'GE Vernova', type: 'OEM' },
      { name: 'ANDRITZ', type: 'OEM' },
      { name: 'WEG', type: 'OEM' },
      { name: 'BC New Energy', type: 'OEM' },
    ],
  },
  {
    id: 'RQ-09',
    tier: 'B',
    title: 'e-axle ギア連成NVH — 時変メッシュ剛性×軸受非線形×電磁力の統合予測',
    rd: ['bearing', 'torsional', 'emag'],
    drivers: ['D1'],
    milestones: ['D1-1', 'D1-6'],
    confidence: '確立',
    question:
      'ギア伝達誤差・軸受非線形・電磁加振が構造伝達経路で干渉するe-axleのNVHを、部品単体でなくシステムとして予測し、20k→30k rpm入力への高速化で支配項がどう遷移するかを明らかにできるか。',
    physics:
      '燃焼騒音という「マスキング源」が消えたことで、従来は埋もれていたギア・軸受・電磁のμmオーダー加振が聞こえる問題に昇格した。励振は消せないので、伝達経路の共振配置とモード減衰で「聞こえない設計」にするのが本質。',
    goal5y:
      'メッシュ剛性-軸受-マウントの連成モデルの実測照合事例と、30k rpm級での軸受選定（転がり限界→ハイブリッド/エア）の移行閾値データ。',
    whyNow:
      'e-axle入力は14–20k rpmが現行、25–30k rpm級が試作段階。高速化ロードマップ（中国NEV 2.0・DOE 50kW/L）は政策変動に関わらず進行。',
    sources: ['SAE-MobilityEng-eAxle', 'MDPI-EVS-13-4-65'],
    benchAxes: ['入力回転数レンジの量産実績', 'NVH連成解析の公表手法', '高速軸受（ハイブリッド/エア）採用状況', 'ユニット出力密度(kW/L)'],
    players: [
      { name: 'AVL', type: 'OEM' },
      { name: 'Schaeffler', type: 'OEM' },
      { name: 'SKF / NSK / JTEKT', type: 'OEM' },
      { name: 'ZF', type: 'OEM' },
      { name: 'BorgWarner', type: 'OEM' },
    ],
  },

  // ───────────── TIER C: 方法論・基盤 ─────────────
  {
    id: 'RQ-10',
    tier: 'C',
    title: '確率論的ロータダイナミクス設計（UQ） — 公差・軸受ばらつきから危険速度/安定性の分布へ',
    rd: ['digital', 'critspeed', 'stability'],
    drivers: ['D5', 'D2'],
    milestones: ['D5-1', 'D2-6'],
    confidence: '確立',
    question:
      '軸受係数・クリアランス・不釣合いの不確かさを PCE/Kriging サロゲートで伝播させ、危険速度・振幅・log dec を分布として設計する手法を、決定論＋一律マージンの現行実務に置き換わる形で実装できるか。',
    physics:
      '現行の分離余裕は「不確かさをまとめて一律%で吸収する」経験則。UQはその%の中身を開き、どのばらつきが応答分散のどれだけを占めるかを分解する——マージンを「気持ち」から「確率」に変える作業に相当する。',
    goal5y:
      '製造公差→固有値分布の実証照合事例（量産ロータの統計データ）と、API的SM要求を確率論で読み替える提案フォーマット。',
    whyNow:
      'UQ手法自体は2023年にレビュー体系化済みで実装段階。規格側（API/ISO）が確率論を受け入れる素地を作るのは長期戦であり、今から始める必要がある。',
    sources: ['Fu-MSSP-UQreview-2023', 'Sensors-CritSpeedProb-2024'],
    benchAxes: ['UQ実装の公表事例（設計適用か研究デモか）', '量産統計データの保有', 'サロゲート手法の選択', '規格提案活動の有無'],
    players: [
      { name: 'Swansea University', type: '大学' },
      { name: 'Northwestern Polytechnical Univ.', type: '大学' },
      { name: 'Rolls-Royce UTC', type: '研究機関' },
      { name: 'Texas A&M Turbolab', type: '大学' },
    ],
  },
  {
    id: 'RQ-11',
    tier: 'C',
    title: 'ロータダイナミクスのデジタルツイン — 軸受/シール係数のオンライン同定とPINN',
    rd: ['digital', 'seal', 'bearing'],
    drivers: ['D5'],
    milestones: ['D5-3', 'D5-7'],
    confidence: '推定',
    question:
      '運転中の振動応答から軸受・シール動特性係数を逐次同定し（物理制約付き学習=PINN含む）、危険速度・安定性余裕をリアルタイム更新するDTを、オフライン解析の精度を落とさず成立させられるか。',
    physics:
      '設計時の係数は「カタログ値」で、実機は温度・摩耗・据付で常にずれる。振動応答は係数の関数なので、逆問題として運転データから係数を推定できるはず——ただし可観測性（どの係数が応答に現れるか）が回転数・励振条件に依存するのが本質的な難所。',
    goal5y:
      '実機データでの係数同定の精度実証（試験機→実機の順）と、ロータダイナミクス専用DTのリファレンスアーキテクチャ。',
    whyNow:
      'DTの中核技術（サロゲート＋PINN）は成熟しつつあるが、ロータダイナミクス専用のリアルタイムDTは事例希薄——空白が残っているうちに参入する価値がある。',
    sources: ['TGM-AIEng-2026', 'DT-Sensors-2024'],
    benchAxes: ['DT実装の公表段階（概念/試験機/実機）', '係数オンライン同定の実証', 'PINN/物理制約学習の採用', '監視システムとの統合度'],
    players: [
      { name: 'Bently Nevada (Baker Hughes)', type: 'OEM' },
      { name: 'Siemens (Simcenter)', type: 'OEM' },
      { name: 'GE Vernova', type: 'OEM' },
      { name: '三菱重工', type: 'OEM' },
    ],
  },
  {
    id: 'RQ-12',
    tier: 'C',
    title: 'AI状態監視・RUL予測の標準化 — フルスペクトル診断×学習ベース予知の接続',
    rd: ['monitoring', 'digital'],
    drivers: ['D5', 'D3'],
    milestones: ['D5-2', 'D3-5'],
    confidence: '確立',
    question:
      'オーダートラッキング・フルスペクトルなど確立した診断特徴量と、クラック・ラビング・ミスアライメント等の損傷モード物理、および学習ベースの異常検知・RUL推定を接続し、ISO 13373系に載る形の「AI診断ガイドライン」として標準化できるか。',
    physics:
      '回転機械の故障モードは1×・2×・サブシンクロナス・通過周波数といった「周波数の指紋」を持つ。学習モデルに生波形を丸投げするのではなく、この指紋を特徴量として渡すことが、少ない故障データで汎化する鍵になる。',
    goal5y:
      '故障モード別の特徴量-診断対応表（公開ベンチマークデータ付き）と、RUL推定の不確かさ表示の標準形。',
    whyNow:
      '予知保全市場の拡大に対しガイドラインが不在で、ベンダーごとのブラックボックス化が進行中。標準化の主導権を取る時期。',
    sources: ['DT-Sensors-2024', 'ISO20816-1-2016'],
    benchAxes: ['診断アルゴリズムの公開度', '故障データセットの保有規模', 'RUL推定の実績公表', '規格・ガイドライン活動'],
    players: [
      { name: 'Bently Nevada', type: 'OEM' },
      { name: 'SKF', type: 'OEM' },
      { name: 'Brüel & Kjær Vibro', type: 'OEM' },
      { name: '新川電機', type: 'OEM' },
      { name: 'Emerson', type: 'OEM' },
    ],
  },
  {
    id: 'RQ-13',
    tier: 'C',
    title: '再使用ロケットターボポンプ — 極低温サブシンクロナス×繰返し疲労の設計統合',
    rd: ['stability', 'critspeed'],
    drivers: ['D4'],
    milestones: ['D4-10'],
    confidence: '推定',
    question:
      '「1回飛べばよい」設計から繰返し運用設計への転換で、極低温ターボポンプのサブシンクロナス・ホワール余裕と低サイクル疲労・熱勾配損傷を統合した寿命設計を確立できるか。',
    physics:
      '極低温流体は粘性が小さく油膜のような減衰源が乏しい——歴史的にターボポンプのサブシンクロナス不安定が破壊的だったのはこのため。再使用化は「毎フライトの熱衝撃と振動履歴を貯金として数える」設計への転換で、安定性と疲労が初めて同じ台帳に載る。',
    goal5y:
      '極低温対応ダンパ（metal mesh等）の減衰実測データと、フライト回数を陽に持つ安定性-疲労統合設計基準の提案。',
    whyNow:
      '2025年の軌道打上げ329回と再使用が標準化。運用データが蓄積される今が、設計基準を実証的に作れる初めての時期。',
    sources: ['SpaceNews-Launch-2025'],
    benchAxes: ['再使用回数の実績', 'ターボポンプ再整備間隔の公表', '極低温ダンパ技術の公表', 'サブシンクロナス対策の公開度'],
    players: [
      { name: 'NASA MSFC', type: '研究機関' },
      { name: 'JAXA / IHI', type: '研究機関' },
      { name: 'ArianeGroup', type: 'OEM' },
      { name: 'Texas A&M Turbolab', type: '大学' },
    ],
  },
  {
    id: 'RQ-17',
    tier: 'C',
    title: '能動・セミアクティブ振動制御 — 可変ダンパ・スマートロータのフェイルセーフ実装',
    rd: ['stability', 'bearing'],
    drivers: ['D5', 'D1'],
    milestones: ['D5-4', 'D1-2'],
    confidence: '推定',
    question:
      '圧電可変スクイーズフィルムダンパ・磁気アクチュエータ等による能動/セミアクティブ制振を、フェイルセーフ要件（故障時に受動特性へ安全に戻る）と両立する形で産業機に実装し、危険速度通過・突発不釣合い・安定性余裕不足への「後付け可能な減衰」として確立できるか。',
    physics:
      '受動ダンパは最悪条件に合わせた固定の妥協で、能動制御は運転点ごとに減衰を作り変えられる。ただしアクチュエータの力はロータの慣性力に比べ小さいため、勝負どころは共振近傍——Q値が高い場所ほど小さな力で大きく効くテコの原理で成立する。故障時に受動特性へ戻れるかが実装の分水嶺。',
    goal5y:
      'セミアクティブSFDの実機実証（危険速度通過振幅の低減量の定量公表）と、能動制御系のフェイルセーフ設計指針（受動フォールバック）。',
    whyNow:
      '圧電可変SFD等の研究が2024年に活発化し、超臨界運転の標準化（V2）で通過制振の価値が上昇。AMB機の普及で「制御で振動を作り変える」文化が産業に浸透しつつあり、SFDの体系的総説が2002年以降空白という学術側の隙もある。',
    sources: ['JSV-PiezoSFD-2024', 'MDPI-AMB-Review-2025'],
    benchAxes: ['能動/セミアクティブダンパの実機適用公表', 'フェイルセーフ設計（受動フォールバック）の開示', 'アクチュエータ技術の選択（圧電/磁気/ER・MR）', '制振効果の定量公表'],
    players: [
      { name: 'University of Bath', type: '大学' },
      { name: 'Cleveland State RoMaDyC', type: '大学' },
      { name: 'Calnetix Technologies', type: 'OEM' },
      { name: 'Texas A&M Turbolab', type: '大学' },
    ],
  },
]

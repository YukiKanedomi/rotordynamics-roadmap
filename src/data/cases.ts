// CASES タブ: 実機・実験事例を境界地図（B1–B7）の上に置く。
// 正本: experts/rotordynamics/knowledge/topics/gas-bearing-supercritical.md ほか各トピック。
// すべて公開文献ベース。数値は原典の生値を優先（丸め表記は注記）。

export interface CaseStudy {
  key: string
  name: string
  year: string
  status: '量産' | '実証' | '研究' | '計画'
  bnds: string[] // 関わる境界 B1–B7
  side: string // どちら側にいるか（1行）
  nums: { label: string; value: string }[]
  image: string // 物理イメージ
  read: string // 地図への含意
  ratio?: number // N/f1（判明時のみ B3 ストリップに描く）
  ratioNote?: string
  sources: string[]
}

export const CASES: CaseStudy[] = [
  {
    key: 'heshmat2000',
    name: 'Heshmat — GFB曲げ超えの初実証',
    year: '2000',
    status: '研究',
    bnds: ['B3', 'B7'],
    side: '超臨界側 — 曲げ一次の約2.5倍まで運転（実験室）',
    nums: [
      { label: '曲げ一次', value: '34,100 rpm' },
      { label: '到達速度', value: '85,000 rpm（≈2.5×）' },
      { label: '鍵', value: '3軸受の節最適配置＋trim balancing' },
    ],
    image:
      '軸受はモードの節では仕事ができない。節を外して軸受位置にモード振幅を確保し、ガス膜の乏しい減衰を「効く場所」に置いた——配置とバランス精度で減衰の少なさを補った構図。',
    read: '「油膜の減衰なしで」B3 の壁は物理的に越えられる（実証済み）。ただし成立条件（節配置・バランス精度）が量産条件と相性が悪い——「ガス軸受では実験室で四半世紀前に実証、油フリー産業機は今も原則回避（油膜機では超臨界は標準）」の起点。',
    ratio: 2.49,
    sources: ['Heshmat-2000-JTribol'],
  },
  {
    key: 'tg-oilfilm',
    name: '大型蒸気タービン・タービン発電機（油膜軸受）',
    year: '20世紀前半–',
    status: '量産',
    bnds: ['B3'],
    side: '超臨界側 — 複数の曲げ臨界を超えた運転が1世紀来の標準（対照群）',
    nums: [
      { label: '支持', value: '油膜（ティルティングパッド等）・多スパン軸系' },
      { label: '手法', value: 'モーダルバランス＋油膜減衰＝教科書レベルで確立' },
    ],
    image:
      '油膜という「太い減衰の調達源」があれば、臨界通過は日常業務になる——B3 の壁の高さは、壁そのものではなく手持ちの減衰の太さで決まる。',
    read: '本タブの GFB 事例群の対照群。B3 が今も最前線なのは「油膜の減衰供給を持たない機械（B3×B7）」に限る——この限定を外して「超臨界＝未踏」と読むのは誤り。',
    sources: ['API-TR684-1-2019'],
  },
  {
    key: 'fcv2025',
    name: '商用30kW級 FCV空気圧縮機（GFB）',
    year: '2025',
    status: '量産',
    bnds: ['B3', 'B7'],
    side: '亜臨界側 — 定格を曲げ一次の28%下に置く（論文表記は「25%分離」）',
    nums: [
      { label: '定格', value: '90,000 rpm' },
      { label: '曲げ一次', value: '2083 Hz＝124,980 rpm' },
      { label: 'ロータ質量', value: '1.72 kg（PMSM直結・two-pad GFB）' },
    ],
    image:
      '亜臨界でも曲げモードは黙っていない——速度上昇でODSが剛体形からU字曲げ形へ遷移し、曲げ成分が剛体成分を打ち消す速度域（70–80 krpm・位相π反転）が現れる。二面バランスの最適位相差は速度依存（低速=同相／高速=逆相）。',
    read: '油フリー産業機の標準解＝亜臨界設計の生きた実例。分離余裕の引用元が ANSI/HI 9.6.8（ポンプ規格）である点は、ガス軸受機の規格ギャップ（D5-8）の傍証。',
    ratio: 0.72,
    sources: ['Lubricants-FCV-GFB-2025'],
  },
  {
    key: 'kist2004',
    name: 'KIST — 粘弾性フォイル軸受（VEFB）超臨界応答',
    year: '2003–04',
    status: '研究',
    bnds: ['B3', 'B7'],
    side: '超臨界側 — 構造減衰の増強で曲げ臨界近傍の振動を劇的低減',
    nums: [
      { label: '手段', value: '粘弾性層でフォイル構造減衰を増強' },
      { label: '検証', value: '不釣合い応答の実験×理論比較' },
    ],
    image:
      '減衰の台帳で読むと「供給側の増設」。ガス膜が出せない減衰を、フォイル構造側（粘弾性・microslip）から調達して曲げ通過の収支を成立させた。',
    read: 'B3 超えの三点セット（節配置・バランス・構造減衰）のうち、構造減衰の寄与を single out した実証。',
    sources: ['Lee-SuperCritGFB-TT-2004', 'Lee-VEFB-TriboInt-2003'],
  },
  {
    key: 'epfl-hgjb',
    name: 'EPFL — HGJB ターボチャージャ 170 krpm',
    year: '2022頃',
    status: '研究',
    bnds: ['B3', 'B7'],
    side: '超臨界側 — 剛体×曲げの hybrid mode を通過（フォイル以外の気体膜）',
    nums: [
      { label: '到達速度', value: '170,000 rpm' },
      { label: '軸受', value: 'ヘリングボーン溝付きガスジャーナル軸受' },
      { label: '鍵', value: 'バランス面2位置の最適選択で曲げ励振を回避' },
    ],
    image:
      '不釣合い分布がモード形と直交すれば、そのモードは揺すられない——「どこを削るか」の選択自体がモード励振の設計変数になる。',
    read: 'B3 超えはフォイル固有ではなく気体膜一般で成立し得る。ただし hybrid mode＝純粋な曲げ一次との差は要精査（書誌細部も未確定）。',
    sources: ['EPFL-HGJB-TC-MSSP'],
  },
  {
    key: 'tub2024',
    name: 'TU Berlin — 超臨界GFBを狙うモジュラーリグ',
    year: '2024',
    status: '計画',
    bnds: ['B3', 'B7'],
    side: '亜臨界側（現状）— 軸受を節の外側に置き超臨界を狙う',
    nums: [
      { label: '曲げ一次', value: 'FEM 1346 Hz（80,760 rpm 相当）' },
      { label: '実験到達', value: '約60,000 rpm（報告時点・曲げ未到達）' },
    ],
    image:
      'Heshmat と同じ「節を外す」配置戦略を、四半世紀後に計画段階からやり直している——超臨界GFBが今も研究フロンティアであることの証左。',
    read: 'B3×B7 の組合せが未解決の最前線であることを示す現在進行形の事例。',
    ratio: 0.74,
    ratioNote: '報告時点',
    sources: ['TUB-GFB-PAMM-2024'],
  },
  {
    key: 'co2igc',
    name: '高圧CO₂ IGC（20 MPaG）の安定化実測',
    year: '2020',
    status: '実証',
    bnds: ['B4'],
    side: '安定性律速側 — 高密度CO₂のクロスカップリングを ISFD で吸収',
    nums: [
      { label: '吐出圧', value: '20 MPaG（CO₂・高密度）' },
      { label: 'log dec', value: '1.24 → 1.33（ISFD追加）' },
      { label: '対策', value: 'スワールブレーキ＋ISFD' },
    ],
    image:
      '台帳の両側を同時に操作した実例——スワールブレーキで消費（旋回流クロスカップリング）を減らし、ISFDで供給（減衰）を足す。収支が log dec の実測改善として現れた。',
    read: 'B4 右上（安定性律速帯）の実務解の定量実証。Wachel 境界の「右側」で何が設計制約になるかの生データ。',
    sources: ['Baba-2020-GPPS'],
  },
  {
    key: 'step-sco2',
    name: 'SwRI STEP — 10 MWe sCO₂タービン',
    year: '2018–',
    status: '実証',
    bnds: ['B4', 'B2'],
    side: '安定性律速側 — 高温×高密度で支持系を従来技術の組合せで固める',
    nums: [
      { label: '設計条件', value: '715°C／250 bar／27,000 rpm（Phase 2 目標）' },
      { label: 'Phase 1 実績', value: '500°C・27,000 rpm・net 約4 MWe（2024完了）' },
      { label: '支持', value: 'ティルティングパッド＋SFD' },
    ],
    image:
      '高密度流体が注入する消費に対し、実績ある供給源（油膜＋SFD）で受ける保守的構成。sCO₂ の第一世代は「減衰の調達先を変えない」戦略を取った。',
    read: 'B4 右上の大型実証機の設計実例。商用スケール化（D2-5）で油膜戦略がどこまで持つかが次の論点。',
    sources: ['SwRI-STEP-Rotordyn-2018'],
  },
  {
    key: 'dinglun',
    name: 'Dinglun 30 MW — 磁気浮上フライホイール発電所',
    year: '2024',
    status: '実証',
    bnds: ['B2', 'B7'],
    side: '油膜という選択肢が最初から無い領域（真空中・高周速）',
    nums: [
      { label: '規模', value: '30 MW／120基（世界最大・系統接続）' },
      { label: '支持', value: 'AMB＋タッチダウン軸受' },
    ],
    image:
      '貯蔵エネルギー∝U²（B2）を追うほど真空・高周速になり、油膜は物理的に使えない。減衰は AMB 制御で「作り」、停電時はタッチダウンで受ける——台帳の供給側が能動系だけで構成される機種。',
    read: 'B7（AMB側）の反復製造スケール実装（単一サイト120基・世界初級）。ISO 14839-5（タッチダウン軸受）が効く領域の代表例。※業界メディア複数の二次整合ベース（中国側一次は未到達）。',
    sources: ['Dinglun-Flywheel-2024', 'ISO14839-5-2022'],
  },
  {
    key: 'holopainen-ump',
    name: 'Holopainen — UMP負剛性の実測（誘導機）',
    year: '2002',
    status: '研究',
    bnds: ['B5'],
    side: 'B5 の実測アンカー — 電磁力が第1曲げ固有振動数を動かす',
    nums: [
      { label: '実測', value: '第1曲げ 105 → 78 Hz（UMP負剛性 k₀≈+6.22×10⁶ N/m 相当）' },
      { label: '励振', value: 'p±1 高調波が前後ホワール成分に対応・2×電源周波数' },
    ],
    image:
      '偏心すると磁気吸引力は偏心を助長する向きに増える＝ばねの逆（負剛性）。軸のばねから電磁ぶんを差し引いた「柔らかい軸」として振る舞い、危険速度が下がる——減衰を足しても剛性は返ってこない。',
    read: 'B5 が「解析上の懸念」でなく実測事実であることの一次。モータ一体化（V3）の設計では電磁設計者とロータダイナミストが同じ固有値を共有する必要がある。',
    sources: ['Holopainen-Sopanen-2005'],
  },
  {
    key: 'bh-h2',
    name: '水素パイプライン圧縮 — BH段数試算と Siemens Ti 6段',
    year: '2021–24',
    status: '実証',
    bnds: ['B6', 'B4'],
    side: 'B6 材料律速の定量 — 周速の頭打ちが段数急増として現れる',
    nums: [
      { label: 'BH試算', value: '60→110 barA: 天然ガス1胴3段 vs 100%H₂ 5胴28段（標準）' },
      { label: '緩和策', value: 'high head 300 m/s→3胴18段／HPRC 400 m/s→1胴9段' },
      { label: 'Siemens', value: '高強度Ti合金で6段・圧力比4:1 が技術的に可能' },
    ],
    image:
      'ヘッド∝U² なので周速が2割伸びれば段数は3割減る——材料（API 617 の827 MPa cap）が周速を止めるかぎり、水素機は「段数で払う」しかなく、長い多段軸＝配置問題（B4左枝）に送り込まれる。',
    read: 'B6→B4左枝の連鎖の定量実例。材料開発（Ti・HPRC）は周速側から、IGC化は軸系分割側から、同じ配置問題を攻めている。',
    sources: ['BH-H2ValueChain-2024', 'SiemensEnergy-H2Pipeline-2021'],
  },
  {
    key: 'ihi-eturbo',
    name: 'IHI — 100 kW級 電動ターボコンプレッサ（エア軸受）',
    year: '2023',
    status: '実証',
    bnds: ['B1', 'B7'],
    side: '転がり不可の速度域を油フリー（気体膜）で取りに行く国内実装',
    nums: [
      { label: '出力', value: '100 kW 級（世界最軽量を公称）' },
      { label: '支持', value: 'エア（気体膜）軸受・油フリー' },
    ],
    image:
      'B1（DN境界）を超えた先の選択肢のうち「ガス膜」を選ぶと、B7 の適用限界（低速浮上不能→起動停止接触・摩耗寿命）が新しい設計制約として入れ替わりに現れる。',
    read: '境界は「越える」のではなく「別の壁と交換する」——B1→B7 のトレードの国内実例。',
    sources: ['IHI-eTurboComp-2023'],
  },
]

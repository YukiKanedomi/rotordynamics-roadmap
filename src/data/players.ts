// ロータダイナミクス関連の主要プレイヤー台帳（PLAYERS REGISTRY）。
// 調査: 2026-07-04 researcher 4系統（OEM／支持要素・シール／ソフト・計測・コンサル／研究機関）。
// 社名は M&A 追跡済みの現行名。verify='check' は実体・資本関係・現況に未確認事項が残るもの。
// src は一次出典（公式サイト・プレスリリース・IR）。ベンチマーク調査（AGENDA の次段）の母集団。

export interface Player {
  id: string
  name: string
  region: string // 地域コード（US/DE/JP/CN/KR/GB/FR/IT/SE/CH/AT/FI/DK/CA/BR/RU/IN/CZ/INT 等）
  cat: string
  note: string // ロータダイナミクス観点の位置づけ1行
  rq?: string[] // 関連する研究課題（AGENDA）
  verify?: boolean // true=要確認事項あり
  src?: string
}

export interface PlayerCat {
  key: string
  name: string
  desc: string
}

export interface PlayerGroup {
  key: string
  name: string
  cats: PlayerCat[]
}

export const PLAYER_GROUPS: PlayerGroup[] = [
  {
    key: 'oem',
    name: '機械OEM',
    cats: [
      { key: 'oem-comp', name: 'プロセス圧縮機・エキスパンダ', desc: 'API 617 クラスの遠心/軸流圧縮機・ターボエキスパンダ' },
      { key: 'oem-power', name: 'タービン・発電機・系統機器', desc: '大型GT/ST・発電機・同期調相機・フライホイール' },
      { key: 'oem-oilfree', name: 'オイルフリー・高速モータ一体', desc: '磁気/フォイル軸受チラー・ターボブロワ・FC用エアコンプレッサ' },
      { key: 'oem-aero', name: '航空エンジン・宇宙推進', desc: '航空エンジン・ロケットターボポンプ' },
    ],
  },
  {
    key: 'sup',
    name: '要素サプライヤ',
    cats: [
      { key: 'sup-fluid', name: '油膜軸受・ダンパ', desc: 'ティルティングパッド軸受・スクイーズフィルムダンパ' },
      { key: 'sup-amb', name: '磁気軸受（AMB）', desc: '能動磁気軸受・制御・タッチダウン系' },
      { key: 'sup-foil', name: 'ガス/フォイル軸受', desc: 'コンプライアントフォイル・外部加圧ガス軸受' },
      { key: 'sup-roll', name: '転がり軸受（高速）', desc: 'ハイブリッドセラミック・高速スピンドル系' },
      { key: 'sup-seal', name: 'シール', desc: 'ドライガスシール・メカニカルシール' },
      { key: 'sup-gear', name: '高速ギア・カップリング', desc: 'API 613 高速歯車・高性能カップリング（ねじり系）' },
      { key: 'sup-balance', name: 'バランシングマシン', desc: '動釣合い試験機・高速バランシング設備' },
    ],
  },
  {
    key: 'sw',
    name: 'ソフトウェア・計測・サービス',
    cats: [
      { key: 'sw-code', name: 'RD専用解析コード', desc: 'ロータダイナミクス専用の商用/OSS解析ソフト' },
      { key: 'sw-fem', name: '汎用CAEのRD機能', desc: '汎用FEM/システムシミュレーション内のロータ機能' },
      { key: 'mon', name: '計測・保護・状態監視', desc: 'API 670 系機械保護・振動監視・診断' },
      { key: 'consult', name: 'コンサル・受託解析', desc: '設計監査・トラブルシュート・フィールド計測' },
    ],
  },
  {
    key: 'lab',
    name: '研究機関・規格団体',
    cats: [
      { key: 'lab', name: '大学・研究機関', desc: 'ロータダイナミクス研究拠点・産学コンソーシアム' },
      { key: 'org', name: '規格・団体・会議', desc: '規格策定・認証・事例データベース・国際会議' },
    ],
  },
]

// M&A ウォッチ（社名・帰属の最近の変化。台帳の鮮度管理用）
export const MA_WATCH: { year: string; text: string }[] = [
  { year: '2026', text: 'Baker Hughes が Chart Industries（Howden 含む）買収手続き中 — 2026年央クローズ見込み・完了は未確認' },
  { year: '2025', text: 'MAN Energy Solutions → Everllence 改称（6月）／ Sundyne → Honeywell（6月完了）／ Xdot → Graham Corp（10月）／ Flender → Triton 売却合意' },
  { year: '2024', text: 'Elliott → Ebara Elliott Energy 新ブランド（1月）／ GE 原子力蒸気タービン → Arabelle Solutions（EDF, 5月）／ ARMD（RBTS）→ Concepts NREC' },
  { year: '2022', text: 'Meggitt（vibro-meter）→ Parker Hannifin（9月完了）' },
  { year: '2021', text: 'Brüel & Kjær Vibro → NSK（3月完了）' },
  { year: '2019', text: 'Synchrony（AMB）→ Johnson Controls（Siemens から）' },
  { year: '2018', text: 'John Crane 産業軸受部門 → Miba ／ JTEKT×MUTECS 合弁「光洋マグネティックベアリング」設立' },
]

export const PLAYERS: Player[] = [
  // ───── OEM: プロセス圧縮機・エキスパンダ ─────
  { id: 'p001', cat: 'oem-comp', name: 'Siemens Energy', region: 'DE', note: '旧 Dresser-Rand DATUM 系を統合した API 617 主要ベンダ。高速モータ一体密閉機（STC-ECO 系）も。', rq: ['RQ-03', 'RQ-06'], src: 'https://www.siemens-energy.com/global/en/home/products-services.html' },
  { id: 'p002', cat: 'oem-comp', name: 'Baker Hughes', region: 'US', note: '旧 Nuovo Pignone 系。ICL＝磁気軸受モータ一体密閉圧縮機。Chart（Howden 含む）買収手続き中。', rq: ['RQ-03', 'RQ-06'], src: 'https://www.bakerhughes.com/centrifugal-axial-compressors/icl' },
  { id: 'p003', cat: 'oem-comp', name: 'Ebara Elliott Energy', region: 'JP', note: '旧 Elliott Group（2024年に荏原グループでリブランド）。API 617 大型遠心・機械駆動蒸気タービンの老舗。', rq: ['RQ-06'], src: 'https://www.elliott-turbo.com/news-ebara-elliott-energy-restructures-to-support-global-energy-transition' },
  { id: 'p004', cat: 'oem-comp', name: 'Everllence（旧 MAN Energy Solutions）', region: 'DE', note: '2025年6月改称。軸流・遠心大手。HOFIM＝磁気軸受モータ一体圧縮機の代表格。', rq: ['RQ-02', 'RQ-06'], src: 'https://www.everllence.com/company/press-releases/details/2025/06/04/man-energy-solutions-becomes-everllence' },
  { id: 'p005', cat: 'oem-comp', name: '三菱重工コンプレッサ（MCO）', region: 'JP', note: 'API 617 ビーム型＋一体ギヤ型を広島/テキサスで製造。API 617 専用試験スタンド保有。', rq: ['RQ-03', 'RQ-06'], src: 'https://www.mhi.com/group/mco/' },
  { id: 'p006', cat: 'oem-comp', name: 'コベルコ（神戸製鋼グループ）', region: 'JP', note: '遠心・スクリュー・レシプロの3方式を単一メーカーで供給。API 618 レシプロも。', src: 'https://www.kobelco-machinery-energy.com/en/compressor/product/turbo/' },
  { id: 'p007', cat: 'oem-comp', name: 'Atlas Copco Gas and Process', region: 'SE', note: '一体ギヤ式遠心圧縮機＋ターボエキスパンダ大手（旧 Mafi-Trench 統合。設置5,000台超）。', rq: ['RQ-06'], src: 'https://www.atlascopco.com/en-us/compressors/products/processairgasequipment/turboexpanders' },
  { id: 'p008', cat: 'oem-comp', name: 'Honeywell（Sundyne）', region: 'US', note: '高速一体ギヤ式（LMC/BMC 等）。2025年6月に Honeywell が買収完了。', src: 'https://www.honeywell.com/us/en/press/2025/06/honeywell-completes-acquisition-of-sundyne-to-expand-process-industry-capabilities' },
  { id: 'p009', cat: 'oem-comp', name: '沈鼓集団（Shenyang Blower Works）', region: 'CN', note: '中国最大級。API 617/618 対応、遠心3,000台超の実績。', src: 'https://www.sbw-intl.com/' },
  { id: 'p010', cat: 'oem-comp', name: '西安陝鼓動力（Shaangu Power）', region: 'CN', note: '軸流圧縮機（高炉送風・硝酸プラント）の中国大手。', verify: true },
  { id: 'p011', cat: 'oem-comp', name: 'Hanwha Power', region: 'KR', note: '一体ギヤ式・BOG 圧縮機。PSM と統合し圧縮機＋GT 事業に（累計9,000台超）。', src: 'https://www.hanwha.com/newsroom/news/press-releases/hanwha-power-systems-and-psm-unite-as-hanwha-power-a-global-compressor-and-gas-turbine-business.do' },
  { id: 'p012', cat: 'oem-comp', name: 'Ingersoll Rand', region: 'US', note: 'プラントエア遠心（Centac/MSG 系）中心。API 617 プロセス市場での現在の位置づけは要確認。', verify: true },
  { id: 'p013', cat: 'oem-comp', name: 'Cryostar（Linde）', region: 'FR', note: '極低温エキスパンダ・LNG 機器の大手。' },
  { id: 'p014', cat: 'oem-comp', name: 'L.A. Turbine（Chart）', region: 'US', note: '可変ノズルエキスパンダ。Chart 経由で Baker Hughes 傘下へ移行見込み。' },
  { id: 'p015', cat: 'oem-comp', name: 'Rotoflow（Air Products）', region: 'US', note: '産業ガス大手の自社エキスパンダブランド。' },
  { id: 'p016', cat: 'oem-comp', name: 'R&D Dynamics', region: 'US', note: 'フォイル軸受式高速エキスパンダ・ブロワのニッチ専業。', rq: ['RQ-01'] },
  { id: 'p017', cat: 'oem-comp', name: '日機装（Nikkiso CE&IG / ACD）', region: 'JP', note: '極低温ポンプ・エキスパンダ（旧 Cryogenic Industries）。資本関係の市場レポート記述に疑義あり。', verify: true },

  // ───── OEM: タービン・発電機・系統機器 ─────
  { id: 'p020', cat: 'oem-power', name: 'GE Vernova', region: 'US', note: '大型GT・発電機。同期調相機の実績200件超（〜300 Mvar級/台）。', rq: ['RQ-05', 'RQ-08'], src: 'https://www.gevernova.com/grid-solutions/systems/flexible-ac-transmission-systems-facts/synchronous-condenser' },
  { id: 'p021', cat: 'oem-power', name: 'Siemens Energy', region: 'DE', note: 'GT/ST/発電機フルライン。フライホイール付き同期調相機（独 Mehrum 型）も供給。', rq: ['RQ-05', 'RQ-08'] },
  { id: 'p022', cat: 'oem-power', name: 'Arabelle Solutions（EDF）', region: 'FR', note: '旧 GE Steam Power 原子力タービン（2024年 EDF 傘下）。世界最大級の低圧ロータ。', src: 'https://www.edf.fr/en/the-edf-group/dedicated-sections/journalists/all-press-releases/edf-acquires-ge-steam-powers-nuclear-activities-from-ge-vernova' },
  { id: 'p023', cat: 'oem-power', name: '三菱重工（Mitsubishi Power）', region: 'JP', note: 'JAC 形大型GT・火力/原子力ST。宇宙では LE-9 エンジン主契約。', verify: true },
  { id: 'p024', cat: 'oem-power', name: '東芝ESS／富士電機', region: 'JP', note: '火力・地熱蒸気タービン（富士電機は地熱に強み）。', verify: true },
  { id: 'p025', cat: 'oem-power', name: 'Doosan Enerbility', region: 'KR', note: '韓国初の国産 H 級GT（270→380MW級）商用化。ST・発電機・同期調相機も。', src: 'https://gasturbineworld.com/doosan-gas-turbines/' },
  { id: 'p026', cat: 'oem-power', name: 'Ansaldo Energia', region: 'IT', note: 'GT/ST・発電機。同期調相機プレイヤーとしても列挙される。' },
  { id: 'p027', cat: 'oem-power', name: '哈爾浜電気・東方電気・上海電気', region: 'CN', note: '中国3大電力設備メーカー。火力・原子力ST/発電機を量産。' },
  { id: 'p028', cat: 'oem-power', name: '杭州汽輪動力（HTC）', region: 'CN', note: '産業用蒸気タービンの中国大手（産業駆動で高シェア）。' },
  { id: 'p029', cat: 'oem-power', name: 'BHEL', region: 'IN', note: 'インド最大の発電設備メーカー（国有）。ST・発電機・同期調相機。', src: 'https://hpep.bhel.com/product.jsp?prod=st&sub=main' },
  { id: 'p030', cat: 'oem-power', name: 'Triveni Turbines', region: 'IN', note: '100MW 以下の産業用STで世界上位（5,000台超納入）。', src: 'https://www.triveniturbines.com/about/' },
  { id: 'p031', cat: 'oem-power', name: 'Solar Turbines（Caterpillar）／川崎重工', region: 'US', note: '中小型GT（機械駆動・分散電源）。', verify: true },
  { id: 'p032', cat: 'oem-power', name: 'ANDRITZ', region: 'AT', note: '同期調相機（米 ERCOT 向け 175 MVAr×2 基を EPC 受注、2027納入）。', rq: ['RQ-08'] },
  { id: 'p033', cat: 'oem-power', name: 'WEG', region: 'BR', note: '大型同期機・同期調相機の主要プレイヤー。', verify: true },
  { id: 'p034', cat: 'oem-power', name: 'BC New Energy', region: 'CN', note: '世界最大 30MW Dinglun フライホイール発電所（磁気浮上120基）の技術供給元。', rq: ['RQ-02', 'RQ-08'], src: 'https://www.energy-storage.news/worlds-largest-30mw-flywheel-energy-storage-project-connects-to-grid-in-china/' },
  { id: 'p035', cat: 'oem-power', name: 'Piller Power Systems', region: 'DE', note: 'フライホイール UPS（データセンタ・病院向け。Langley Holdings 傘下）。', verify: true },
  { id: 'p036', cat: 'oem-power', name: 'Amber Kinetics', region: 'US', note: '長時間（4時間級）鋼製フライホイール ESS。', src: 'https://amberkinetics.com/' },

  // ───── OEM: オイルフリー・高速モータ一体 ─────
  { id: 'p040', cat: 'oem-oilfree', name: 'Danfoss（Turbocor）', region: 'DK', note: '磁気軸受オイルフリー遠心圧縮機のパイオニア・市場リーダー。', rq: ['RQ-02'], src: 'https://www.danfoss.com/en/products/dcs/compressors/danfoss-turbocor/turbocor/' },
  { id: 'p041', cat: 'oem-oilfree', name: 'Daikin Applied', region: 'JP', note: 'Magnitude 磁気軸受チラー（86〜3,000 RT）。直動駆動＋VFD 一体。', src: 'https://www.daikinapplied.com/products/chiller-products/magnitude' },
  { id: 'p042', cat: 'oem-oilfree', name: 'LG', region: 'KR', note: '磁気軸受2段遠心オイルフリーチラー。', src: 'https://www.lg.com/global/business/hvac/commercial-solutions/chiller/oil-free-magnetic-bearing-centrifugal-chiller/' },
  { id: 'p043', cat: 'oem-oilfree', name: 'Gree（格力）', region: 'CN', note: '磁気浮上インバータ遠心圧縮機を内製（AMB も自社開発）。', verify: true },
  { id: 'p044', cat: 'oem-oilfree', name: 'Haier（海爾）', region: 'CN', note: '大容量磁気軸受遠心チラーを展開。' },
  { id: 'p045', cat: 'oem-oilfree', name: '日立（空調）', region: 'JP', note: 'VM シリーズ磁気軸受遠心チラー。', src: 'https://www.hitachiaircon.com/hk/en/ranges/chillers/vm-series' },
  { id: 'p046', cat: 'oem-oilfree', name: 'Johnson Controls（York）／Carrier／Trane／Smardt', region: 'US', note: '大手チラー OEM 群（York CYK・Carrier 19DV・Trane Agility・Smardt＝Turbocor 搭載専業）。', verify: true },
  { id: 'p047', cat: 'oem-oilfree', name: 'Sulzer（HST）', region: 'CH', note: 'HST＝能動磁気軸受＋高速モータ一体ターボブロワ（下水曝気の代表格）。', rq: ['RQ-02'], src: 'https://www.sulzer.com/en/shared/products/hst-turbocompressor' },
  { id: 'p048', cat: 'oem-oilfree', name: 'Aerzen', region: 'DE', note: 'エアフォイル軸受＋PM 高速モータのターボブロワ。', rq: ['RQ-01'], src: 'https://www.aerzen.com/us/products/turbo-blowers' },
  { id: 'p049', cat: 'oem-oilfree', name: 'Neuros', region: 'KR', note: 'エアフォイル軸受ターボブロワの韓国代表格（NX シリーズ）。', rq: ['RQ-01'], src: 'http://eng.neuros.com/' },
  { id: 'p050', cat: 'oem-oilfree', name: 'TurboMAX／KTurbo', region: 'KR', note: 'エアフォイル軸受ターボブロワ勢（KTurbo の経営現況は要確認）。', verify: true },
  { id: 'p051', cat: 'oem-oilfree', name: 'Garrett Motion', region: 'CH', note: 'フォイル軸受オイルフリー遠心（HVAC 25–1,750 kWc 量産 2026 後半）＋FC 用電動コンプレッサ。', rq: ['RQ-01'], src: 'https://www.garrettmotion.com/' },
  { id: 'p052', cat: 'oem-oilfree', name: '豊田自動織機', region: 'JP', note: 'Mirai 搭載 FC 用遠心エアコンプレッサ＋水素循環ポンプを量産。', src: 'https://www.toyota-industries.com/news/2020/12/10/005056/index.html' },
  { id: 'p053', cat: 'oem-oilfree', name: 'Hanon Systems', region: 'KR', note: 'Hyundai NEXO 向け FC 用遠心エアコンプレッサ。2025年 Hankook & Co. 傘下。', src: 'https://www.hanonsystems.com/En/Media/NewsDetails/92' },
  { id: 'p054', cat: 'oem-oilfree', name: 'IHI', region: 'JP', note: '100kW 級 FC 用電動ターボコンプレッサ（エア軸受・従来比3.5倍出力、2023発表）。', rq: ['RQ-01'], src: 'https://www.ihi.co.jp/en/all_news/2023/technology/1199839_3531.html' },
  { id: 'p055', cat: 'oem-oilfree', name: 'Celeroton／Bosch／FISCHER', region: 'CH', note: 'FC 用高速電動コンプレッサ勢（Celeroton はガス軸受超高速機）。', verify: true },
  { id: 'p056', cat: 'oem-oilfree', name: '金士顿（Kingston）', region: 'CN', note: '動圧空気軸受・空気浮上ブロワ・FC 用オイルフリー空圧機の中国勢。', rq: ['RQ-01'], src: 'http://www.zcjsd.net/2021/kyjxz_0401/389.html' },
  { id: 'p057', cat: 'oem-oilfree', name: '势加透博（SCITB）', region: 'CN', note: '空気浮上 FC 空圧機（25–150kW）。中国 FC 空圧機シェア上位。' },

  // ───── OEM: 航空・宇宙 ─────
  { id: 'p060', cat: 'oem-aero', name: 'GE Aerospace／RTX (P&W)／Rolls-Royce／Safran／MTU', region: 'US', note: '大手航空エンジン OEM 群。スクイーズフィルムダンパ・超臨界ロータ設計の本場。' },
  { id: 'p061', cat: 'oem-aero', name: 'IHI（航空・宇宙）', region: 'JP', note: '航空エンジン＋ロケットターボポンプ（LE-9 液水ポンプ等）。', rq: ['RQ-13'], src: 'https://www.ihi.co.jp/en/products/aeroengine_space_defense/rocket_system/' },
  { id: 'p062', cat: 'oem-aero', name: 'L3Harris（Aerojet Rocketdyne）', region: 'US', note: 'RS-25 等の大型ターボポンプ（2023年 L3Harris 傘下）。', rq: ['RQ-13'], src: 'https://www.l3harris.com/all-capabilities/rs-25-engine' },
  { id: 'p063', cat: 'oem-aero', name: 'SpaceX／Blue Origin', region: 'US', note: 'Raptor/BE-4 のターボポンプ内製。再使用運用データの最大保有者だが公開情報は希薄。', rq: ['RQ-13'] },

  // ───── 要素: 油膜軸受・ダンパ ─────
  { id: 'p070', cat: 'sup-fluid', name: 'Waukesha Bearings（Dover Precision Components）', region: 'US', note: 'ティルティングパッド軸受の大手。動特性解析込みのカスタム供給。Dover 傘下を継続。', src: 'https://www.waukbearing.com/en/about/about-us.html' },
  { id: 'p071', cat: 'sup-fluid', name: 'Bearings Plus（Dover）', region: 'US', note: 'ISFD（一体型スクイーズフィルムダンパ）の商用供給元。減衰付加レトロフィット。', rq: ['RQ-03'], src: 'https://www.bearingsplus.com/en/about-us.html' },
  { id: 'p072', cat: 'sup-fluid', name: 'Kingsbury', region: 'US', note: 'ティルティングパッドスラスト軸受の発明企業（1912年〜）。', src: 'https://www.kingsbury.com/about_us' },
  { id: 'p073', cat: 'sup-fluid', name: 'Miba Industrial Bearings', region: 'AT', note: '旧 John Crane 産業軸受部門（2018年買収・4拠点継承）。タービン・圧縮機向け動圧軸受。', src: 'https://www.miba.com/en/news/article/closing-of-acquisition-of-the-john-crane-industrial-bearings-branch' },
  { id: 'p074', cat: 'sup-fluid', name: '大同メタル工業', region: 'JP', note: 'タービン・圧縮機用大型すべり軸受の国内大手。' },

  // ───── 要素: 磁気軸受 ─────
  { id: 'p080', cat: 'sup-amb', name: 'SKF Magnetic Mechatronics（S2M）', region: 'FR', note: '産業用 AMB の老舗最大手（1976年〜）。2025年 Sieb & Meyer と戦略提携。', rq: ['RQ-02'], src: 'https://www.skf.com/us/news-and-events/news/2025/2025-Sep-10-SKF-and-Sieb-and-Meyer-announce-strategic-partnership-for-magnetic-bearings' },
  { id: 'p081', cat: 'sup-amb', name: 'Mecos（Everllence）', region: 'CH', note: '圧縮機・タービン・真空機器向け AMB 専業（2012年 MAN 傘下、約30名）。', rq: ['RQ-02'], src: 'https://www.mecos.com/en/about-us/index.php' },
  { id: 'p082', cat: 'sup-amb', name: 'Synchrony（Johnson Controls）', region: 'US', note: 'AMB＋高速モータ＋監視ソフト一体（2019年 Siemens から JCI へ）。', src: 'https://www.johnsoncontrols.com/media-center/news/press-releases/2019/11/04/johnson-controls-to-acquire-synchrony-from-siemens' },
  { id: 'p083', cat: 'sup-amb', name: 'Calnetix Technologies', region: 'US', note: 'AMB＋高速 PM モータ＋パワエレの統合設計。新機構開発が活発。', rq: ['RQ-02'] },
  { id: 'p084', cat: 'sup-amb', name: '光洋マグネティックベアリング（JTEKT×MUTECS）', region: 'JP', note: '制御型磁気軸受の国産合弁（2018年設立）。高速・オイルフリー用途。' },
  { id: 'p085', cat: 'sup-amb', name: '島津製作所', region: 'JP', note: '磁気浮上ターボ分子ポンプで世界トップクラス（AMB 内製）。', src: 'https://www.shimadzu.co.jp/industry/products/tmp/index.html' },
  { id: 'p086', cat: 'sup-amb', name: '南京磁谷科技（CIGU）', region: 'CN', note: 'AMB ブロワ・圧縮機・チラー・真空ポンプ。中国 AMB 専業の代表格。' },
  { id: 'p087', cat: 'sup-amb', name: '亿昇科技（ESURGING）', region: 'CN', note: 'AMB・高速 PM モータ・インバータ・流体機械を自社保有する AMB ブロワ大手（清華系）。', src: 'http://en.esurging.com/about/' },
  { id: 'p088', cat: 'sup-amb', name: 'Waukesha Magnetic Bearings', region: 'GB', note: '旧 Glacier 系 AMB 部門。現況（存続形態）は要確認。', verify: true },

  // ───── 要素: ガス/フォイル軸受 ─────
  { id: 'p090', cat: 'sup-foil', name: 'Mohawk Innovative Technology（MiTi）', region: 'US', note: '第6世代コンプライアントフォイル軸受＋フォイルシール。オイルフリーターボの権威。', rq: ['RQ-01'], src: 'https://mohawkinnovative.com/company/' },
  { id: 'p091', cat: 'sup-foil', name: 'Xdot Bearing Technologies（Graham Corp）', region: 'US', note: 'フォイル軸受設計＋ロータダイナミクス受託。2025年10月 Graham（Barber-Nichols）が買収。', rq: ['RQ-01'], src: 'https://ir.grahamcorp.com/news-events/press-releases/detail/391/graham-corporation-acquires-xdot-bearing-technologies' },
  { id: 'p092', cat: 'sup-foil', name: 'New Way Air Bearings', region: 'US', note: '外部加圧多孔質ガス軸受（EPP）。旧 Bently Pressurized Bearing を2014年に継承。', src: 'https://www.newwayairbearings.com/news/press-room/release/new-way-bently/' },

  // ───── 要素: 転がり軸受 ─────
  { id: 'p100', cat: 'sup-roll', name: 'SKF／Schaeffler (FAG)／Timken', region: 'SE', note: '欧米大手。高速スピンドル・ターボ用ハイブリッドセラミック玉軸受。', rq: ['RQ-09'] },
  { id: 'p101', cat: 'sup-roll', name: 'NSK／NTN／JTEKT (Koyo)', region: 'JP', note: '日系大手3社。e-axle 高速化対応の軸受開発が活発。', rq: ['RQ-09'] },

  // ───── 要素: シール ─────
  { id: 'p110', cat: 'sup-seal', name: 'John Crane（Smiths Group）', region: 'GB', note: 'ドライガスシールの世界最大手。2025年 Smiths 再編でも中核事業として残留確定。', rq: ['RQ-06'], src: 'https://www.smiths.com/investors/why-invest-in-smiths/strategic-update-january-2025' },
  { id: 'p111', cat: 'sup-seal', name: 'EagleBurgmann', region: 'DE', note: 'Freudenberg×イーグル工業の合弁。DGS 大手（-170°C 極低温 DGS 等）。', rq: ['RQ-06'], src: 'https://www.eagleburgmann.us/en/mechanical-seals/dry-gas-seals-tame-extreme-cold' },
  { id: 'p112', cat: 'sup-seal', name: 'イーグル工業', region: 'JP', note: 'EagleBurgmann の日本側親会社。舶用・産業用メカニカルシール。' },
  { id: 'p113', cat: 'sup-seal', name: 'Flowserve', region: 'US', note: 'DGS・メカニカルシール大手。' },
  { id: 'p114', cat: 'sup-seal', name: '中密控股（SINOSEAL）', region: 'CN', note: '中国唯一の上場シール企業。独 DMK 買収で DGS 技術基盤を取得、API 682 準拠 DGS 500台超。', src: 'https://www.sns-china.com/' },

  // ───── 要素: 高速ギア・カップリング ─────
  { id: 'p120', cat: 'sup-gear', name: 'RENK', region: 'DE', note: 'API 613 準拠の高速ギア（TA..I シリーズ等）。ねじり軸系設計に直結。', rq: ['RQ-05'], src: 'https://www.renk.com/en/products/turbo-high-speed' },
  { id: 'p121', cat: 'sup-gear', name: 'Flender（Graffenstaden）', region: 'DE', note: '産業伝動大手（高速ギア含む）。2025年 Carlyle→Triton 売却合意（クローズ要確認）。', verify: true },
  { id: 'p122', cat: 'sup-gear', name: 'Voith（BHS）', region: 'DE', note: 'BHS ターボギア: 平行軸〜85MW/60,000rpm、遊星〜45MW/80,000rpm。', src: 'https://www.voith.com/corp-en/drives-transmissions/turbo-gear-units.html' },
  { id: 'p123', cat: 'sup-gear', name: '石橋製作所', region: 'JP', note: '風車増速機で国内トップ実績＋タービン・圧縮機用高速歯車装置。', src: 'https://www.ishibashi-mfg.com/business/' },
  { id: 'p124', cat: 'sup-gear', name: 'Regal Rexnord（Kop-Flex）／John Crane（Metastream）', region: 'US', note: '高性能カップリング（ねじり剛性・バランス等級が軸系設計に直結）。', verify: true },

  // ───── 要素: バランシングマシン ─────
  { id: 'p130', cat: 'sup-balance', name: 'Schenck RoTec（Dürr Group）', region: 'DE', note: '大型タービン発電機向け高速バランシング設備で世界リーダー。', rq: ['RQ-08'], src: 'https://www.schenck-rotec.com/en-pl/company/about-us/' },
  { id: 'p131', cat: 'sup-balance', name: '国際計測器', region: 'JP', note: '発電機・タービン・各種モータ向け動釣合い試験機。', src: 'https://www.kokusaikk.co.jp/product/balancing-machines/' },
  { id: 'p132', cat: 'sup-balance', name: '長浜製作所', region: 'JP', note: '横形・立形バランシングマシン、マスセンタリング機、ターボチャージャ用。', src: 'https://nagahama.co.jp/?lang=en' },
  { id: 'p133', cat: 'sup-balance', name: 'CEMB', region: 'IT', note: '産業用バランシングマシン・振動計測。', verify: true },

  // ───── ソフト: RD専用解析コード ─────
  { id: 'p140', cat: 'sw-code', name: 'XLRotor（Rotating Machinery Analysis）', region: 'US', note: 'Excel ベースの高速ソルバ（1995年〜）。API 監査系で広く使われる定番の一つ。', src: 'https://www.xlrotor.com/' },
  { id: 'p141', cat: 'sw-code', name: 'MADYN 2000（Delta JS）', region: 'CH', note: '曲げ・ねじり・連成、油膜/転がり/磁気軸受、ギア付き多軸系。欧州系の代表格。', src: 'https://www.delta-js.ch/en/software/madyn-2000-for-rotordynamics/' },
  { id: 'p142', cat: 'sw-code', name: 'DyRoBeS（Eigen Technologies／Rodyn）', region: 'US', note: 'FEM ベースのロータ・軸受・バランシング統合（1991年〜、NASA 使用実績）。', src: 'https://dyrobes.com/' },
  { id: 'p143', cat: 'sw-code', name: 'ARMD（Concepts NREC）', region: 'US', note: '旧 RBTS。2024年 Concepts NREC が買収、V2026.1 で保守継続。', src: 'https://www.conceptsnrec.com/news/concepts-nrec-acquires-rotordynamic-and-bearing-specialist-rbts-inc' },
  { id: 'p144', cat: 'sw-code', name: 'XLTRC2（Texas A&M TRC）', region: 'US', note: 'TRC 研究成果の軸受・シールライブラリが強み。コンソーシアム経由で提供。', rq: ['RQ-03'], src: 'https://turbolab.tamu.edu/trc-software/' },
  { id: 'p145', cat: 'sw-code', name: 'RAPPID（Rotordynamics-Seal Research）', region: 'US', note: '2D伝達マトリクス〜3DソリッドFEA の多忠実度。Navier-Stokes ベースのシール/軸受解法。', src: 'https://rsrsoftware.com/' },
  { id: 'p146', cat: 'sw-code', name: 'AxSTREAM RotorDynamics（SoftInWay）', region: 'US', note: 'ターボ機械設計プラットフォーム統合型。多軸・AMB 対応。', src: 'https://www.softinway.com/software-solutions/rotor-dynamics-and-bearings/' },
  { id: 'p147', cat: 'sw-code', name: 'COMBROS R/A/PG（TU Clausthal ITR）', region: 'DE', note: '油膜軸受（ラジアル/スラスト/遊星）静動特性コード＝動特性係数の供給側。FVA/FVV 共同研究。', src: 'https://www.itr.tu-clausthal.de/en/research/tribo-simulation/combros-r' },
  { id: 'p148', cat: 'sw-code', name: 'ROTORINSA（INSA Lyon／Mecalam）', region: 'FR', note: '曲げ＋ねじりの FEM コード。教育・産業両用の仏系定番。', src: 'https://mecalam.com/en/rotorinsa' },
  { id: 'p149', cat: 'sw-code', name: 'ROSS（Petrobras／UFRJ）', region: 'BR', note: 'Python 製オープンソース（Timoshenko 梁 FEM）。分野初の本格 OSS。', rq: ['RQ-11'], src: 'https://github.com/petrobras/ross' },
  { id: 'p150', cat: 'sw-code', name: 'NewtonSuite MyROT（ニュートンワークス）', region: 'JP', note: '松下修己氏（防衛大名誉教授）系譜の国産コードを商用 GUI 化。受託解析・教育も。', src: 'https://www.newtonworks.co.jp/product/newtongravity/myrot.html' },
  { id: 'p151', cat: 'sw-code', name: 'Dynamics R4（Alfa-Tranzit）', region: 'RU', note: '航空エンジン・ターボポンプ向け非線形多軸系。西側市場での入手性は要確認。', verify: true },

  // ───── ソフト: 汎用CAEのRD機能 ─────
  { id: 'p160', cat: 'sw-fem', name: 'Ansys Mechanical', region: 'US', note: '専用 Rotordynamic Analysis Guide。Campbell・前後まわり判定・対数減衰率まで標準対応。' },
  { id: 'p161', cat: 'sw-fem', name: 'Siemens Simcenter 3D（SOL 414＋Samcef Rotors）', region: 'DE', note: '旧 Samcef Rotor 統合。翼付きディスク巡回対称＋Coleman 変換など航空エンジン向けが厚い。' },
  { id: 'p162', cat: 'sw-fem', name: 'COMSOL Rotordynamics Module', region: 'SE', note: 'Solid/Beam Rotor。油膜 Reynolds 連成・AMB・ラビングまで拡張継続。' },
  { id: 'p163', cat: 'sw-fem', name: 'Hexagon（MSC Nastran）', region: 'SE', note: '2024年に非線形ハーモニクス SOL 128 追加。Boeing と Rotor Dynamics Consortium を組成。' },
  { id: 'p164', cat: 'sw-fem', name: 'Dassault SIMULIA（Abaqus）', region: 'FR', note: '複素固有値＋ジャイロで対応（専用コード比で機能は限定的）。' },

  // ───── 計測・保護・状態監視 ─────
  { id: 'p170', cat: 'mon', name: 'Bently Nevada（Baker Hughes）', region: 'US', note: 'API 670 の代名詞。3500 系は設置8万台超、System 1／Orbit 60。', rq: ['RQ-12'], src: 'https://www.bakerhughes.com/bently-nevada/monitoring-systems/machinery-protection/3500-machinery-protection-systems' },
  { id: 'p171', cat: 'mon', name: 'Brüel & Kjær Vibro（NSK）', region: 'DK', note: 'Schenck 系譜の CMS 大手。2021年 NSK 傘下（€180M）。風力・O&G に強い。', rq: ['RQ-12'], src: 'https://www.nsk.com/company/news/2021/nsk-completes-acquisition-of-bkvibro/' },
  { id: 'p172', cat: 'mon', name: 'vibro-meter（Parker Hannifin）', region: 'CH', note: '旧 Meggitt（2022年 Parker 買収）。VM600Mk2 は API 670 5th の保護・監視分離に対応。', src: 'https://meggittsensing.com/energy/vm600mk2/' },
  { id: 'p173', cat: 'mon', name: 'SKF（Multilog IMx）', region: 'SE', note: '軸受メーカー系 CMS。保護＋監視のペア構成。', src: 'https://www.skf.com/group/products/condition-monitoring-systems/machine-protection-systems/imx-m' },
  { id: 'p174', cat: 'mon', name: 'Emerson（AMS 6500）', region: 'US', note: '旧 CSI 系。保護＋予知を1シャーシ統合、DeltaV/Ovation 連携。' },
  { id: 'p175', cat: 'mon', name: 'Metrix（Indicor）', region: 'US', note: '振動スイッチ・デジタル近接システムの老舗（1965年〜）。', src: 'https://www.metrixvibration.com/about-us' },
  { id: 'p176', cat: 'mon', name: '新川電機／新川センサテクノロジ', region: 'JP', note: '国産渦電流式変位センサ・API 670 準拠系の代表格。', rq: ['RQ-12'], src: 'https://www.sst-shinkawa.co.jp/' },
  { id: 'p177', cat: 'mon', name: '旭化成エンジニアリング', region: 'JP', note: '振動診断30年超・3,000件超。舶用モータ CMS「V-MO」商用化。', src: 'https://www.asahi-kasei.co.jp/aec-mkt/maintenance/' },
  { id: 'p178', cat: 'mon', name: 'IMV', region: 'JP', note: '加振試験装置大手＋VD-unit（国内1万台超）の計測・診断。', src: 'https://we-are-imv.com/business/products/item/fa-system-vd-unit/' },
  { id: 'p179', cat: 'mon', name: 'ProvibTech／PVTVM', region: 'CN', note: '保護・トランスミッタ・センサのフルライン。API 670 市場に食い込む中国系（資本関係は要確認）。', verify: true },

  // ───── コンサル・受託解析 ─────
  { id: 'p190', cat: 'consult', name: 'Southwest Research Institute（SwRI）', region: 'US', note: '設計監査・RCFA・フィールドまで一気通貫の受託 R&D。sCO2 等極環境、60,000rpm ガス軸受リグ。', rq: ['RQ-03'], src: 'https://www.swri.org/rotordynamic-analysis' },
  { id: 'p191', cat: 'consult', name: 'Mechanical Solutions（MSI）', region: 'US', note: '試験＋解析（FEA/CFD/ロータ）の総合診断。ポンプ・圧縮機トラブルシュートに強い。', src: 'https://www.mechsol.com/services/analysis/rotordynamics' },
  { id: 'p192', cat: 'consult', name: 'Rodyn Vibration Analysis', region: 'US', note: 'Gunter 系譜。DyRoBeS を軸にした解析・トレーニング・診断。', src: 'https://rodyn.com/' },
  { id: 'p193', cat: 'consult', name: 'Kelm Engineering', region: 'US', note: '横・ねじり解析＋フィールド計測（ひずみゲージねじり計測等）の両輪。', rq: ['RQ-05'], src: 'https://www.kelmengineering.com/analytical-services/rotordynamic-analysis-rda' },
  { id: 'p194', cat: 'consult', name: 'Wood VDN（旧 BETA Machinery＋SVT）', region: 'CA', note: '往復圧縮機の脈動・振動解析で著名。230名超・11拠点。', src: 'https://vdn.woodgroup.com/about/about-us/' },
  { id: 'p195', cat: 'consult', name: 'Engineering Dynamics（EDI）', region: 'US', note: '横・ねじり・脈動・疲労の独立系老舗（1982年〜）。石油化学・発電向け。', src: 'https://engdyn.com/services/analytical-studies/rotordynamics-analysis/' },
  { id: 'p196', cat: 'consult', name: 'RBTS（サービス部門）', region: 'US', note: '1986年〜の軸受・ロータ解析コンサル。ARMD 売却後の存続形態は要確認。', verify: true },

  // ───── 研究機関・大学 ─────
  { id: 'p200', cat: 'lab', name: 'Texas A&M Turbomachinery Laboratory（TRC）', region: 'US', note: '軸受・シール動特性試験の世界最大拠点。TRC は35社超・会員制。TPS 主催。', rq: ['RQ-01', 'RQ-03', 'RQ-10'], src: 'https://turbolab.tamu.edu/trc/' },
  { id: 'p201', cat: 'lab', name: 'University of Virginia ROMAC', region: 'US', note: 'AMB・制御・油膜解析コード群（RotorLab+）の老舗産学コンソーシアム。', rq: ['RQ-02'], src: 'https://engineering.virginia.edu/research/multidisciplinary-team-labs-and-groups/romac-laboratory/romac-current-research' },
  { id: 'p202', cat: 'lab', name: 'Cleveland State RoMaDyC', region: 'US', note: 'AMB 加振・クラック診断・ロバスト制御。Bently & Muszynska 冠講座。', src: 'https://engineering.csuohio.edu/research/center-for-rotating-machinery-dynamics-and-control' },
  { id: 'p203', cat: 'lab', name: 'TU Darmstadt（Schweizer）', region: 'DE', note: 'ターボチャージャ・浮動ブッシュの非線形ロータダイナミクス。SIRM 2023 ホスト。', rq: ['RQ-04'], src: 'https://tuprints.ulb.tu-darmstadt.de/24057/' },
  { id: 'p204', cat: 'lab', name: 'University of Bath（Keogh）', region: 'GB', note: 'AMB タッチダウン軸受接触・浮上復帰制御・能動振動制御。', rq: ['RQ-02'] },
  { id: 'p205', cat: 'lab', name: 'Swansea University', region: 'GB', note: '教科書 Dynamics of Rotating Machines（Friswell 系譜、現 Emeritus）。モデル更新・同定。', rq: ['RQ-10'] },
  { id: 'p206', cat: 'lab', name: 'Politecnico di Torino DIMEAS', region: 'IT', note: 'Genta 系譜（DYNROT コード）。回転機械・メカトロ設計グループが継承。' },
  { id: 'p207', cat: 'lab', name: 'LUT University（Machine Dynamics）', region: 'FI', note: '高速電気機械のロータダイナミクス（国家 CoE）。IFToMM Rotordynamics 2026 主催。', rq: ['RQ-04', 'RQ-07'], src: 'https://www.lut.fi/en/research-groups/machine-dynamics' },
  { id: 'p208', cat: 'lab', name: 'VTT', region: 'FI', note: '回転機械の能動振動制御・計測の応用研究（国研）。電磁連成（Holopainen）の系譜。', rq: ['RQ-07'] },
  { id: 'p209', cat: 'lab', name: '名古屋大学 井上研', region: 'JP', note: '非線形ロータダイナミクス・クラック診断・AMB 加振・シール動特性。', src: 'https://sites.google.com/view/inoue-laboratory' },
  { id: 'p210', cat: 'lab', name: 'JAXA 角田宇宙センター', region: 'JP', note: 'ロケットターボポンプの軸系設計・極低温軸受。国内唯一の総合ターボポンプ試験拠点。', rq: ['RQ-13'], src: 'https://www.jaxa.jp/about/centers/kspc/index_j.html' },
  { id: 'p211', cat: 'lab', name: '西安交通大学', region: 'CN', note: '「現代設計及転子軸承系統」教育部重点実験室（研究者47名）。転子-軸受系動力学。', src: 'https://mdts.xjtu.edu.cn/ENGLISH_VERSION/Introduction/Laboratory.htm' },
  { id: 'p212', cat: 'lab', name: '清華大学／哈爾浜工業大学／浙江大学', region: 'CN', note: 'rotor-bearing-seal 系非線形動力学の論文実績（中核研究室の同定は要確認）。', verify: true },
  { id: 'p213', cat: 'lab', name: 'KAIST', region: 'KR', note: 'センサレス AMB（IEMDC 2025）等。高速回転機の制御系研究。', rq: ['RQ-02'] },
  { id: 'p214', cat: 'lab', name: 'KIST（RoMin Lab）', region: 'KR', note: 'オイルフリーターボ機械（フォイル＋AMB ハイブリッド）・極低温ターボポンプ軸受。', rq: ['RQ-01'], src: 'http://romin.kist.re.kr/' },
  { id: 'p215', cat: 'lab', name: '漢陽大学校 Turbomachinery Lab（Keun Ryu）', region: 'KR', note: 'San Andrés 直系の軸受・シール・ダンパ実験拠点（元 TAMU/BorgWarner）。', rq: ['RQ-01'], src: 'http://turbolab.hanyang.ac.kr/Lab_Intro.pdf' },
  { id: 'p216', cat: 'lab', name: 'IIT Guwahati（Tiwari）', region: 'IN', note: 'ロータ系同定・AMB・状態監視。教科書 Rotor Systems と NSRD シンポジウム。' },

  // ───── 規格・団体・会議 ─────
  { id: 'p220', cat: 'org', name: 'API SOME', region: 'US', note: 'API 617/611 等の機械受入基準と API TR 684-1（ロータダイナミクス・チュートリアル）の策定元。' },
  { id: 'p221', cat: 'org', name: 'ISO/TC 108', region: 'INT', note: 'ISO 21940（バランシング）・20816（振動評価）・状態監視規格の策定委員会。', src: 'https://www.iso.org/committee/51402.html' },
  { id: 'p222', cat: 'org', name: 'Vibration Institute', region: 'US', note: 'ISO 18436-2 準拠の振動アナリスト認証＋年次会議。診断実務の人材・事例ハブ。', rq: ['RQ-12'], src: 'https://vi-institute.org/' },
  { id: 'p223', cat: 'org', name: 'EFRC', region: 'DE', note: '往復圧縮機の振動ガイドライン（第4版）と共同研究・会議体。', src: 'https://www.recip.org/the-efrc/' },
  { id: 'p224', cat: 'org', name: 'EPRI', region: 'US', note: 'タービン発電機のねじり振動計測・ロータクラック調査など電力実務研究。', rq: ['RQ-05'], src: 'https://www.epri.com/research/products/000000003002006234' },
  { id: 'p225', cat: 'org', name: 'IFToMM Rotordynamics 会議', region: 'INT', note: '学術界最大の専門国際会議（第12回＝2026年6月 Lahti、LUT 主催）。', src: 'https://www.lut.fi/en/rotordynamics2026/scientific-committee' },
  { id: 'p226', cat: 'org', name: 'JSME 機械力学・計測制御部門（v_BASE）', region: 'JP', note: '振動トラブル事例データベース v_BASE（1991年〜）と D&D Conference。実務事例の一次源。', src: 'https://www.jsme.or.jp/dmc/en/v_base/' },
  { id: 'p227', cat: 'org', name: 'TPS／ATPS（Texas A&M）', region: 'US', note: '産業実務論文（lecture/tutorial/case study）の最重要アーカイブ。', src: 'https://tps.tamu.edu/' },
  { id: 'p228', cat: 'org', name: 'SIRM（欧州ロータダイナミクス会議）', region: 'DE', note: '1991年創設の欧州会議体（SIRM 2025 は VIRM と重複で中止、次回は要確認）。', verify: true },
]

// 地域フィルタ（ページ側 UI 用）
export const REGION_FILTERS: { key: string; label: string; match: (r: string) => boolean }[] = [
  { key: 'all', label: 'ALL', match: () => true },
  { key: 'jp', label: 'JP', match: (r) => r === 'JP' },
  { key: 'us', label: '米州', match: (r) => ['US', 'CA', 'BR'].includes(r) },
  { key: 'eu', label: '欧州', match: (r) => ['DE', 'GB', 'FR', 'IT', 'SE', 'CH', 'AT', 'FI', 'DK', 'CZ', 'RU'].includes(r) },
  { key: 'cn', label: 'CN', match: (r) => r === 'CN' },
  { key: 'kr', label: 'KR', match: (r) => r === 'KR' },
  { key: 'other', label: 'その他', match: (r) => ['IN', 'INT'].includes(r) },
]

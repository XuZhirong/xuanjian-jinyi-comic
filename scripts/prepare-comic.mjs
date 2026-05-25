import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const visualBible = `# 《金一驭道》漫画视觉设定

类型：史诗序章式仙侠漫画，不按普通单章线性剧情处理。

视觉 thesis：冷雪凡尘与天外金位互相剪接，水墨厚线、冷金法光、朱砂因果、紫雷旧秩序共同构成“从断指到驭道”的神话闭环。

画风：clean Chinese ink-brush xianxia graphic novel, cinematic manga page composition, broad smooth ink washes, crisp controlled linework, large negative space, restrained color accents, realistic Chinese historical clothing, integrated readable Chinese comic typography, no modern objects.

主色：snow white, deep ink black, cold imperial gold, blue-green qing aura, cinnabar red, violet thunder.

干净度要求：
- 画面要清爽、克制、留白充足，避免“鳞片感”、脏点、过密碎纹、随机斑驳、AI 拼贴感。
- 纸纹只能是很轻的宣纸底色，不要颗粒噪声，不要让纹理覆盖人物脸、手和法光主体。
- 金色法光要像干净的锋刃、秩序线、宽幅光带，不要画成鱼鳞、甲片、碎玻璃皮肤、金箔颗粒或奢华装饰贴片。
- 人物服饰可以华贵，但轮廓必须干净，面部必须清晰。

核心母题：
- 手：冻紫的手、墙缝断指、张元禹醒后隐痛的手、祖师掌中的金环、最终号令庚兑的权柄之手。
- 雪：凡人苦难、门第冷酷、旧怨回声。
- 金：不是富贵金，而是锋锐、冷冽、法则重排。
- 雷：旧秩序、雷宫、被镇压的权威。
- 青：衍华上青、制衡阴阳、玄道正名。

设定约束：
- 王蕃、张元禹、太元真君是同一条因果身份链，不能画成互不相关的三人。
- 金羽宗源流不是普通金系宗门，而是通玄冲世金一与青玄衍华上青相接。
- 雷宫覆灭不是单纯复仇爽点，而是社稷、世家、真炁、天道受损交织的大局谋算。
- 程圜之战不是普通斗法，而是果位之争。
- 最终“金一太元上青玄道”是道号/玄道正名，不是单一法术名。

连续性要求：人物面孔和服饰必须保持连续，尤其是王蕃少年与太元成人之间的眼神、右手残痛、冷静气质。`;

const pageTextPolicy = `# 正篇漫画页文字策略

正篇页面必须是“图文一体”的成品漫画页，网页只负责陈列图片，不承担剧情阅读。

文字原则：
- 对白优先，但不绝对排斥非对白文字；这章是神话源流序章，允许少量场景牌、章回题签、仪式性题刻、极短转场句。
- 每页通常使用 1-4 个中文文本块：人物对白、内心独白、角色诵念出的经句、命令宣告、必要音效，或帮助读者定位时间线的极短题签。
- 中文必须清晰可读，排在留白、黑底、卷轴、碑面、漫画对白框或章回题签中。
- 禁止说明书式画外音和大段设定解释；开篇经义可做经文诵念，终局正名必须表现为太元亲口宣告。
- 不要随机英文、乱码、水印、logo、现代 UI。
- 背景可以出现抽象符纹、残缺碑纹、不可辨认的古文字纹理；叙事文字必须严格使用该页给出的中文原句。
- 文字服务画面气势和阅读理解，不把页面做成设定说明页。`;

const characters = [
  {
    id: "wang-fan-child",
    name: "少年王蕃",
    role: "雪夜求经的凡人少年，后续太元因果源头",
    look: "very thin Chinese boy, about 10-12, frostbitten cheeks, ragged patched animal-hide robe, broken bowl, dark watchful eyes, right hand later maimed, humble posture hiding stubbornness",
  },
  {
    id: "taiyuan",
    name: "张元禹 / 太元真君 / 王蕃",
    role: "金羽宗神话源流核心，金一太元上青玄道正名者",
    look: "adult Chinese Daoist man, early middle age, fixed identity across all pages: tied black hair, short neat mustache and goatee, calm unreadable expression, deep eyes with gold and silver glints, cold gold-white robes, subtle circular gold halo, right hand sometimes tense as if remembering pain",
  },
  {
    id: "taihong",
    name: "太鸿真人",
    role: "青松观内洞察衍华危机的黑衣见证者",
    look: "black-robed Chinese Daoist, sharp brows, composed but fierce, slightly sardonic smile, dark sleeves with thin gold lines",
  },
  {
    id: "taidao",
    name: "太洮真人",
    role: "白衣旁观者，衬托青松观大事与外人误读",
    look: "white-robed relaxed Daoist, elegant but less severe, bright curious expression, loose posture near desk",
  },
  {
    id: "ancestor",
    name: "青松观祖师 / 大人",
    role: "衍华上青源头，授道与赐金环者",
    look: "middle-aged yet white-haired Chinese immortal, black-sleeved white robe, lean face, gentle smile, terrifying authority in the eyes, surrounded by layered qing-gold aura",
  },
  {
    id: "thunder-lord",
    name: "雷宫尊者",
    role: "旧秩序权威，被王蕃与社稷镇压",
    look: "majestic armored thunder deity, violet-gold armor fragments, face hidden by lightning, trapped inside a purple-gold palace",
  },
  {
    id: "cheng-huan",
    name: "程圜",
    role: "兑光旧主，果位之争对象",
    look: "dignified golden Daoist figure, bright orthodox gold aura, older and grave, standing within an ordered gold mandala",
  },
];

const visualBridges = {
  1: "读者应从经卷/太虚/三色法则看懂：这是道统开篇，不是普通剧情页。",
  2: "读者应从王蕃护手、破碗、朱门与雪看懂：经法与生路都被门第隔开。",
  3: "读者应从墙内暖光和墙外暴雪看懂：一堵墙分出两个世界。",
  4: "读者应从墙缝、靴底、断指、王蕃不哭的眼神看懂：屈辱被记成道心。",
  5: "读者应从残手、雪巷、雷云和成人太元影子看懂：雪夜会通向覆雷。",
  6: "读者应从两尊法则身和虚空尺度看懂：故事进入终局外框。",
  7: "读者应从红色因果线被残痛右手按住看懂：拒称师兄是拒绝因果。",
  8: "读者应从张元禹甩手与少年残指叠影看懂：王蕃与太元是同一因果链。",
  9: "读者应从经卷三处墨蚀和太元冷笑看懂：伪经不是挫败，而被他反向利用。",
  10: "读者应从青松观高殿、空位、众人低首看懂：青松观出关牵动道统格局。",
  11: "读者应从酒面雷宫倒影和张元禹回头看懂：衍华自立与雷宫覆灭相连。",
  12: "读者应从雷宫被困、大地裂火、兑金风暴看懂：旧秩序已被围死。",
  13: "读者应从云上王蕃、朱砂天光、雷宫颤动看懂：这是谋局镇压，不是单挑爽战。",
  14: "读者应从雷宫震惊面孔和雪夜闪回看懂：王蕃的身份与旧怨正在反噬雷宫。",
  15: "读者应从天穹细伤、社稷土光、世家府邸、真炁符印看懂：天道与天下秩序都被纳入棋局。",
  16: "读者应从程圜的正统金座和太元逼近的兑光看懂：这是果位席位争夺。",
  17: "读者应从金座裂开、法则线重排看懂：太元正在给兑光旧主上最后一课。",
  18: "读者应从年轻太元跪地和祖师讲道看懂：衍华制衡阴阳是更早源头。",
  19: "读者应从小金环、祖师掌心、太元仰望、残手叠影看懂：民间伏笔接上王蕃命运。",
  20: "读者应从尊执上青宫张开、司命光柱、万剑颤鸣看懂：终局玄道显形。",
  21: "读者应从庚光与兑光回流到太元脚下看懂：庚兑重新记起主人。",
  22: "读者应从四道天轨、君座车舆、太元抬手看懂：庚兑余闰四位被太元重新排定。",
  23: "读者应从太元独立天心、上青玄气与冷金权柄汇聚看懂：金一太元上青玄道正式正名。",
};

const textPlans = {
  1: [
    { speaker: "诵经声", kind: "chant", text: "夫经者，必从三玄出。" },
    { speaker: "诵经声", kind: "chant", text: "三一者混元齐丹，可以为【青】。" },
    { speaker: "诵经声", kind: "chant", text: "我尊日月道，闫践五德天。" },
  ],
  2: [{ speaker: "王蕃", kind: "inner", text: "冻坏了手，抄不得经，更熬不过去了。" }],
  3: [
    { speaker: "王蕃", kind: "dialogue", text: "堂兄！堂兄…俺来了！" },
    { speaker: "墙内堂兄", kind: "dialogue", text: "小堂弟，你又来了。" },
    { speaker: "王蕃", kind: "dialogue", text: "好堂兄…小少爷…《少阴相气经》还有两句…" },
  ],
  4: [
    { speaker: "王蕃", kind: "dialogue", text: "大人，你只把他当做那道人的手指，痛快地踩断了。" },
    { speaker: "王蕃", kind: "dialogue", text: "这样的经书你也背不会！" },
    { speaker: "墙内堂兄", kind: "dialogue", text: "你听好了，这最后一句是：【性命炼罡无玄兼，方知乘变在三檐】。" },
  ],
  5: [
    { speaker: "王蕃", kind: "dialogue", text: "大人…大人背的真好，这是一点错漏都没有…" },
    { speaker: "雷声", kind: "sfx", text: "轰隆。" },
  ],
  6: [
    { speaker: "对峙者", kind: "dialogue", text: "师兄。" },
    { speaker: "太元", kind: "dialogue", text: "道友客气了。" },
    { speaker: "对峙者", kind: "dialogue", text: "【恭华】与【衍华】…本是同门…" },
  ],
  7: [
    { speaker: "太元", kind: "dialogue", text: "同门相残…" },
    { speaker: "太元", kind: "dialogue", text: "你若是怕同门相残伤了感情，不如称我另一个名字。" },
    { speaker: "太元", kind: "command", text: "『玄兑诛雷冲曜真君』。王蕃。" },
  ],
  8: [
    { speaker: "太洮", kind: "dialogue", text: "张师兄！" },
    { speaker: "太洮", kind: "dialogue", text: "难得见你走神。" },
    { speaker: "张元禹", kind: "dialogue", text: "前世。" },
  ],
  9: [
    { speaker: "张元禹", kind: "dialogue", text: "遭人蒙骗，经中改了三个字。" },
    { speaker: "张元禹", kind: "dialogue", text: "能引出气来，却炼不成道。" },
    { speaker: "张元禹", kind: "dialogue", text: "我又用那道经算计了别人，换了别的回来。" },
  ],
  10: [
    { speaker: "黑衣真人", kind: "dialogue", text: "两位师兄，大人出关了！" },
    { speaker: "太洮", kind: "dialogue", text: "大人已经金仙了？" },
    { speaker: "太洮", kind: "dialogue", text: "这样大的好事，我要回去禀报师尊才是。" },
  ],
  11: [
    { speaker: "太鸿", kind: "dialogue", text: "那恭华呢。" },
    { speaker: "太鸿", kind: "dialogue", text: "自号一道【衍华】，又有何不可？" },
    { speaker: "张元禹", kind: "dialogue", text: "所以雷宫倒了。" },
  ],
  12: [
    { speaker: "王蕃", kind: "command", text: "大夏已灭。" },
    { speaker: "雷宫尊者", kind: "dialogue", text: "王蕃！你…忘恩负义。" },
  ],
  13: [
    { speaker: "王蕃", kind: "dialogue", text: "社稷助我成道，我助盛土覆雷，何来的忘恩负义？" },
    { speaker: "雷宫尊者", kind: "dialogue", text: "今日…我虽陨落，可天下人…皆知你丑恶！" },
  ],
  14: [
    { speaker: "王蕃", kind: "dialogue", text: "那年他成神通，王渐特地为他在豫郡下了一场雪…好大一场雪。" },
    { speaker: "王蕃", kind: "dialogue", text: "差点将我兄妹冻死。" },
    { speaker: "雷宫尊者", kind: "dialogue", text: "你不是王家人？！不可能！" },
  ],
  15: [
    { speaker: "王蕃", kind: "dialogue", text: "天下没有一家会和你们站在一边。" },
    { speaker: "王蕃", kind: "inner", text: "原来…天道也是可以被损伤的…" },
    { speaker: "王蕃", kind: "dialogue", text: "很快就不是了。" },
  ],
  16: [
    { speaker: "程圜", kind: "dialogue", text: "前辈…前辈虽然不常参与世俗，可前辈与我也算有交情。" },
    { speaker: "太元", kind: "dialogue", text: "程圜…这是果位之争。" },
  ],
  17: [
    { speaker: "太元", kind: "dialogue", text: "盈昃前辈…为你们安排的太妥当了。" },
    { speaker: "太元", kind: "dialogue", text: "可这是果位之争！" },
    { speaker: "太元", kind: "dialogue", text: "我来替祂…为你上这最后一课罢。" },
  ],
  18: [
    { speaker: "太元", kind: "dialogue", text: "弟子…有一事不解！" },
    { speaker: "太元", kind: "dialogue", text: "禀祖师，如今天下，阴阳不谐，大道颠乱，我道既制衡阴阳，应有谋画。" },
    { speaker: "太元", kind: "dialogue", text: "请赐制衡法。" },
  ],
  19: [
    { speaker: "祖师", kind: "dialogue", text: "可怜祖师之物，将流民间。" },
    { speaker: "祖师", kind: "dialogue", text: "明阳帝君将受其谋。" },
  ],
  20: [{ speaker: "太元", kind: "command", text: "今日。" }],
  21: [{ speaker: "太元", kind: "command", text: "借庚成兑。" }],
  22: [
    { speaker: "太元", kind: "command", text: "庚位，为吾俯首，\n兑位，为吾更名，\n余位，为吾君座，\n闰位，为吾车舆。" },
  ],
  23: [
    { speaker: "太元", kind: "command", text: "予为金变无上，予为更易第一，请号——『金一太元上青玄道』！" },
  ],
};

const textAccuracyRules = {
  3: "Critical text accuracy: the wall-inside child must say exactly 「小堂弟，你又来了。」. The second character pair is 「堂弟」, meaning younger male cousin, not 「学弟」 or any other wording. Keep this as a speech bubble from inside the wall.",
  4: "Critical text and visual accuracy: the recited line must be exactly 「你听好了，这最后一句是：【性命炼罡无玄兼，方知乘变在三檐】。」. The character is 「罡」, not 显, 异, 里, or any other variant. Visually make the three broken fingers unmistakable but restrained: do not rely only on dialogue.",
  10: "Critical text accuracy: the final dialogue must be exactly 「这样大的好事，我要回去禀报师尊才是。」. The word is 「禀报」, not 「票报」, 「稟报」, or any other variant.",
  13: "Critical text accuracy and cleanup: include only the two planned dialogue lines. Do not write readable text on the Thunder Palace plaque, do not write 「雷雷」, do not add side chapter labels, seals, page numbers, or random extra Chinese.",
  22: "Critical text accuracy: copy the four-line command exactly. The final line is exactly 「闰位，为吾车舆。」. The last two characters are 「车舆」, not 「车典」, not 「车與」, not any other variant. Do not create side plaques or extra labels for 庚位、兑位、余位、闰位.",
  23: "Critical text accuracy: copy the command exactly as 「予为金变无上，予为更易第一，请号——『金一太元上青玄道』！」. Do not add any other title, seal text, side labels, or page number.",
};

const pages = [
  {
    n: 1,
    slug: "sanxuan-prologue",
    title: "三玄开卷",
    timeline: "神话总纲",
    aspect: "3:4",
    source: "开篇经义",
    image: "assets/pages/01-sanxuan-prologue.png",
    scene: "黑色太虚中，三道抽象法则流光生成一枚冷金小环：银白通玄如天路，冷金兑光如囿庇，青色玄气调和阴阳。画面像古籍首页和宇宙创世的结合。",
    plannedText: ["夫经者，必从三玄出。", "三一者混元齐丹，可以为【青】。", "我尊日月道，闫践五德天。"],
  },
  {
    n: 2,
    slug: "yi-county-snow",
    title: "毅郡暴雪",
    timeline: "王蕃童年",
    aspect: "3:4",
    source: "正文10-15行",
    image: "assets/pages/02-yi-county-snow.png",
    scene: "暴雪没过长街，高门朱漆干净而冷，少年王蕃抱着破碗和斑驳兽皮在墙根行走，手指冻紫，远处屋檐有暖光。",
    plannedText: ["冻坏了手，抄不得经，更熬不过去了。"],
  },
  {
    n: 3,
    slug: "warm-wall-crack",
    title: "墙缝暖风",
    timeline: "王蕃童年",
    aspect: "3:4",
    source: "正文20-30行",
    image: "assets/pages/03-warm-wall-crack.png",
    scene: "青墙裂缝一线暖风，墙外王蕃谄笑递入一枚小小乌喙，墙内只露出锦靴、暖灯、半只孩童的手。强烈对比墙外雪白与墙内暖黄。",
    plannedText: ["堂兄！堂兄…俺来了！", "小堂弟，你又来了。", "好堂兄…小少爷…《少阴相气经》还有两句…"],
  },
  {
    n: 4,
    slug: "broken-fingers",
    title: "断指",
    timeline: "王蕃童年",
    aspect: "3:4",
    source: "正文31-44行",
    image: "assets/pages/04-broken-fingers.png",
    scene: "整页压迫构图：王蕃的右手从墙缝艰难伸入，墙内一只小靴子踩下，三根断指必须清楚地落在墙内阴影与雪边，但血色极克制；墙外他蜷缩在雪里，眼睛发红但不哭。",
    plannedText: ["大人，你只把他当做那道人的手指，痛快地踩断了。", "这样的经书你也背不会！", "你听好了，这最后一句是：【性命炼罡无玄兼，方知乘变在三檐】。"],
  },
  {
    n: 5,
    slug: "thunder-in-snow",
    title: "雪中雷声",
    timeline: "王蕃童年到因果预兆",
    aspect: "3:4",
    source: "正文44-45行",
    image: "assets/pages/05-thunder-in-snow.png",
    scene: "少年王蕃拖着残手踉跄入巷，雪地上留下一串浅红，云层深处紫雷滚动；他的背影后方隐约叠出成年太元的金色轮廓。",
    plannedText: ["大人…大人背的真好，这是一点错漏都没有…", "轰隆。"],
  },
  {
    n: 6,
    slug: "cosmic-gold-seat",
    title: "天外称兄",
    timeline: "终局外框",
    aspect: "3:4",
    source: "正文47-56行",
    image: "assets/pages/06-cosmic-gold-seat.png",
    scene: "天外黑暗，庞大金位真身如山岳高冠，另一端白金兑光耀如大日，两尊法则级存在隔着虚空对峙，银白椭圆光柱穿梭天地。",
    plannedText: ["师兄。", "道友客气了。", "【恭华】与【衍华】…本是同门…"],
  },
  {
    n: 7,
    slug: "causal-brotherhood",
    title: "同门因果",
    timeline: "终局外框",
    aspect: "3:4",
    source: "正文113-122行",
    image: "assets/pages/07-causal-brotherhood.png",
    scene: "白金身影伸手按住一缕写意因果红线，线另一端连向青色古观和太阳道影；他身后浮现少年断指影子与玄兑诛雷的锋芒。",
    plannedText: ["同门相残…", "你若是怕同门相残伤了感情，不如称我另一个名字。", "『玄兑诛雷冲曜真君』。王蕃。"],
  },
  {
    n: 8,
    slug: "zhang-yuanyu-awakes",
    title: "张元禹醒",
    timeline: "青松观回忆",
    aspect: "3:4",
    source: "正文58-76行",
    image: "assets/pages/08-zhang-yuanyu-awakes.png",
    scene: "青松观案台前，成人张元禹从沉思中醒来，轻轻甩动右手，手旁幻化出少年断指的冰冷残影；桌上摊着道经，三处墨迹像被人改过。",
    plannedText: ["张师兄！", "难得见你走神。", "前世。"],
  },
  {
    n: 9,
    slug: "false-scripture",
    title: "伪经三字",
    timeline: "青松观回忆",
    aspect: "3:4",
    source: "正文70-77行",
    image: "assets/pages/09-false-scripture.png",
    scene: "近景：张元禹修长的手指压住旧经卷，三处字位化作黑洞般空白；白衣太洮惊讶，太元低眉微笑，背后有被他反向操控的丝线。",
    plannedText: ["遭人蒙骗，经中改了三个字。", "能引出气来，却炼不成道。", "我又用那道经算计了别人，换了别的回来。"],
  },
  {
    n: 10,
    slug: "qingsong-emergence",
    title: "青松出关",
    timeline: "青松观回忆",
    aspect: "3:4",
    source: "正文77-98行",
    image: "assets/pages/10-qingsong-emergence.png",
    scene: "青松观高殿，层层玉阶与松雪，黑衣太鸿、白衣太洮、金白衣张元禹在殿内，远处大人出关的青金光辉压低所有人的视线。",
    plannedText: ["两位师兄，大人出关了！", "大人已经金仙了？", "这样大的好事，我要回去禀报师尊才是。"],
  },
  {
    n: 11,
    slug: "yanhua-stands-alone",
    title: "衍华自立",
    timeline: "青松观回忆",
    aspect: "3:4",
    source: "正文99-111行",
    image: "assets/pages/11-yanhua-stands-alone.png",
    scene: "黑衣太鸿斟酒，酒面倒映紫雷宫阙崩塌；张元禹缓缓回头，冷金轮光浮起。殿外青松与雪，殿内一场未出口的道统分裂。",
    plannedText: ["那恭华呢。", "自号一道【衍华】，又有何不可？", "所以雷宫倒了。"],
  },
  {
    n: 12,
    slug: "thunder-palace-falls",
    title: "雷宫覆灭之一",
    timeline: "覆雷宫",
    aspect: "3:4",
    source: "正文124-132行",
    image: "assets/pages/12-thunder-palace-falls.png",
    scene: "紫金色雷宫高悬天际，被无数白金兑风围困；大地裂开，煞火和熔浆从裂缝喷涌，铠甲碎片如雨下坠，旧秩序摇摇欲坠。",
    plannedText: ["大夏已灭。", "王蕃！你…忘恩负义。"],
  },
  {
    n: 13,
    slug: "cinnabar-suppression",
    title: "雷宫覆灭之二",
    timeline: "覆雷宫",
    aspect: "3:4",
    source: "正文135-145行",
    image: "assets/pages/13-cinnabar-suppression.png",
    scene: "金衣王蕃抱剑立于云上，神情平静；朱砂色天光从上方镇下，紫雷宫殿发出无声震动，兑金风暴在他身后像巨大羽刃旋转。雷宫牌匾和建筑纹理不可出现可读文字。",
    plannedText: ["社稷助我成道，我助盛土覆雷，何来的忘恩负义？", "今日…我虽陨落，可天下人…皆知你丑恶！"],
  },
  {
    n: 14,
    slug: "great-snow-memory",
    title: "好大一场雪",
    timeline: "覆雷宫",
    aspect: "3:4",
    source: "正文136-155行",
    image: "assets/pages/14-great-snow-memory.png",
    scene: "雷宫内部的紫电面孔震惊，画面中穿插毅郡雪巷、冻僵兄妹、残手、朱砂天幕与土光遮蔽因果；王蕃的笑意冷而克制。",
    plannedText: ["那年他成神通，王渐特地为他在豫郡下了一场雪…好大一场雪。", "差点将我兄妹冻死。", "你不是王家人？！不可能！"],
  },
  {
    n: 15,
    slug: "damaged-heaven",
    title: "天道可伤",
    timeline: "覆雷宫到大局",
    aspect: "3:4",
    source: "正文145-155行",
    image: "assets/pages/15-damaged-heaven.png",
    scene: "抽象大局画面：天穹裂开一道细伤，世家府邸、社稷土光、真炁符印、雷宫残影被古老山河局势图牵制；王蕃立于局外，一手按住残缺金线。不要画现代棋盘。",
    plannedText: ["天下没有一家会和你们站在一边。", "原来…天道也是可以被损伤的…", "很快就不是了。"],
  },
  {
    n: 16,
    slug: "cheng-huan-fruit-seat",
    title: "果位之争",
    timeline: "程圜之战",
    aspect: "3:4",
    source: "正文157-164行",
    image: "assets/pages/16-cheng-huan-fruit-seat.png",
    scene: "天外金德战场，程圜站在正统金色曼荼罗中，太元的白金兑光从四方逼近；双方不做夸张武打，而是整个金位法则在倾斜。",
    plannedText: ["前辈…前辈虽然不常参与世俗，可前辈与我也算有交情。", "程圜…这是果位之争。"],
  },
  {
    n: 17,
    slug: "final-lesson",
    title: "最后一课",
    timeline: "程圜之战",
    aspect: "3:4",
    source: "正文162-164行",
    image: "assets/pages/17-final-lesson.png",
    scene: "太元伸出右手，白金锋芒像无数细线重排天地；程圜身后的金色座位裂开，剑气不血腥但绝对压迫，画面冷静到近乎残酷。",
    plannedText: ["盈昃前辈…为你们安排的太妥当了。", "可这是果位之争！", "我来替祂…为你上这最后一课罢。"],
  },
  {
    n: 18,
    slug: "qingsong-teaching",
    title: "授道青松",
    timeline: "更早的青松观旧事",
    aspect: "3:4",
    source: "正文166-187行",
    image: "assets/pages/18-qingsong-teaching.png",
    scene: "松风大雪，青松观阁楼中玄位层次高低错落，众真人端坐如星图；白发祖师讲道，年轻太元金衣跪于殿中，太鸿在旁凝神。",
    plannedText: ["弟子…有一事不解！", "禀祖师，如今天下，阴阳不谐，大道颠乱，我道既制衡阴阳，应有谋画。", "请赐制衡法。"],
  },
  {
    n: 19,
    slug: "golden-ring",
    title: "祖师金环",
    timeline: "更早的青松观旧事",
    aspect: "3:4",
    source: "正文188-201行",
    image: "assets/pages/19-golden-ring.png",
    scene: "祖师掌心一枚非金非银的小环，红光蒙蒙；太元跪地仰望，画面叠化为少年王蕃失去三指的手，金环像命运一样从掌心飞向人间。",
    plannedText: ["可怜祖师之物，将流民间。", "明阳帝君将受其谋。"],
  },
  {
    n: 20,
    slug: "zunzhi-shangqing-palace",
    title: "尊执上青宫",
    timeline: "终局正名",
    aspect: "3:4",
    source: "正文203-205行",
    image: "assets/pages/20-zunzhi-shangqing-palace.png",
    scene: "终局第一幕：闪烁金锋以干净的长线和宽幅光带斜落，所有金气被逼到黑暗角落；尊执上青宫不是实体怪兽，而是一座纵横天地的黑金宫阙异象，像潜伏深渊的巨兽缓缓张开宫门。远天司命之光如定鼎神柱，将逃逸玄妙逼回，天底下无数剑器颤抖悲鸣。",
    plannedText: ["今日。"],
  },
  {
    n: 21,
    slug: "geng-dui-return",
    title: "庚兑归主",
    timeline: "终局正名",
    aspect: "3:4",
    source: "正文206-209行",
    image: "assets/pages/21-geng-dui-return.png",
    scene: "终局第二幕：金色光带如潮水褪去，庚光与白色兑光从天外、剑器、宫阙裂隙中回流，像万河归海般铺到太元脚下。太元银白瞳孔中浮现无穷锋锐，右手抬起，背后隐约重叠少年断指之手。不要画成碎鳞或金箔雨。",
    plannedText: ["借庚成兑。"],
  },
  {
    n: 22,
    slug: "four-positions-submit",
    title: "四位俯首",
    timeline: "终局正名",
    aspect: "3:4",
    source: "正文210-213行",
    image: "assets/pages/22-four-positions-submit.png",
    scene: "终局第三幕：尊执上青宫在黑暗中拱卫，司命光柱定住天穹，庚光、兑光、余位、闰位化作四道干净天轨，向太元脚下俯首。太元站在中心，右手号令万金，冷金与上青玄气环绕。画面只允许一个大对白/宣告框，不要边缘牌匾，不要额外位名标签。",
    plannedText: [
      "庚位，为吾俯首，\n兑位，为吾更名，\n余位，为吾君座，\n闰位，为吾车舆。",
    ],
  },
  {
    n: 23,
    slug: "gold-one-taiyuan-shangqing",
    title: "金一太元上青玄道",
    timeline: "终局正名",
    aspect: "16:9",
    source: "正文214行",
    image: "assets/pages/23-gold-one-taiyuan-shangqing.png",
    scene: "最终宽幅封神画面：尊执上青宫、司命光柱、万剑、庚兑金路全部成为背景，太元独立天心，冷金权柄与上青玄气汇聚成一道简洁而干净的神座。画面只允许太元最后一句宣告，不要额外标题、位牌、落款、书法装饰或随机文字。",
    plannedText: ["予为金变无上，予为更易第一，请号——『金一太元上青玄道』！"],
  },
];

function promptForPage(page) {
  const textPlan = textPlans[page.n] ?? page.plannedText.map((text) => ({ speaker: "角色", kind: "dialogue", text }));
  const captionText = textPlan.map((line) => `- ${line.kind} / ${line.speaker}: 「${line.text}」`).join("\n");
  return `---
type: comic-page
page: ${page.n}
title: ${page.title}
aspect: ${page.aspect}
output: ${page.image}
---

Create one finished comic page image for an epic xianxia prologue.

GLOBAL STYLE:
${visualBible}

PAGE TEXT POLICY:
${pageTextPolicy}

CHARACTER CONTINUITY:
${characters.map((c) => `- ${c.name}: ${c.look}`).join("\n")}

PAGE ${page.n}: ${page.title}
Timeline role: ${page.timeline}
Source anchor: ${page.source}
Scene: ${page.scene}
Silent visual bridge: ${visualBridges[page.n] ?? "Use composition, gesture, repeated motifs, and panel order to make the plot readable without explanatory narrator text."}
${textAccuracyRules[page.n] ? `Text accuracy hard rule: ${textAccuracyRules[page.n]}` : ""}

Composition requirements:
- Make this a polished full comic page plate, not a concept sketch.
- Use cinematic paneling only if it strengthens the page; page 4, 12, 13, and 20 should feel like major splash pages.
- This page MUST be a complete readable comic image with integrated Chinese comic text.
- Do not force the page title into the image unless it naturally reads as a chapter title or inscription.
- Include only the following planned text lines. Respect the speaker and kind; place dialogue near the speaker, commands near 太元, chants near the scripture/ritual source, and sfx near the sound source:
${captionText}
- Avoid explanatory narrator text. Plot clarity should primarily come from visual storytelling: panel order, eye lines, repeated hand/snow/gold-ring motifs, lighting, scale shifts, and scene transitions.
- Avoid extra readable text beyond the planned lines. Do not add page numbers, random seals, side chapter labels, plaque text, watermark, logo, UI, or invented Chinese.
- Do not add random English, extra invented Chinese, watermark, logo, UI, or modern objects.
- Keep the composition clean and premium: no scale-like texture, no dirty speckles, no random stains over faces, no chaotic collage artifacts, no overfilled tiny panels.
- If using the character reference sheet, use it only for identity, clothing direction, and color motifs; do not copy its collage layout, texture strips, or noisy surface artifacts.
- Leave enough visual clarity for web display on mobile and desktop.
- Keep the emotional tone solemn, cold, mythic, and controlled; avoid cute, comedic, generic fantasy, or overly saturated webtoon style.
- Color hierarchy: snow white / ink black base, cold gold and blue-green qing aura accents, cinnabar red only for fate or suppression, violet thunder only for Thunder Palace.
- Make the page visually powerful even before reading the text: ${page.plannedText.join(" / ")}
`;
}

function characterPrompt() {
  return `---
type: character-reference
aspect: 16:9
output: assets/characters/character-sheet.png
---

Create a clean character reference sheet for a Chinese ink-brush xianxia comic adaptation of "金一驭道".

GLOBAL STYLE:
${visualBible}

Characters to show as full-body and bust references, arranged in separate visual zones with no readable text:
${characters.map((c) => `- ${c.name}: ${c.role}. Visual design: ${c.look}`).join("\n")}

Requirements:
- Clean reference sheet on plain warm rice-paper background with generous spacing; no dense collage, no texture swatch strip, no dirty speckles, no scale-like texture, no random stains over faces.
- No readable words, labels, dialogue, watermark, logo, UI, or modern objects.
- Keep faces distinct but coherent in one art direction.
- Make 少年王蕃 and 张元禹/太元 clearly feel like the same soul across time through eyes, restrained expression, and the right-hand motif.
- Include only subtle clean motif halos near the characters: snow, broken hand silhouette, cold gold halo, cinnabar fate light, violet thunder, blue-green qing aura.
`;
}

await mkdir(path.join(root, "prompts"), { recursive: true });
await mkdir(path.join(root, "data"), { recursive: true });
await mkdir(path.join(root, "assets/pages"), { recursive: true });
await mkdir(path.join(root, "assets/characters"), { recursive: true });

await writeFile(path.join(root, "prompts/style-bible.md"), visualBible, "utf8");
await writeFile(path.join(root, "prompts/page-text-policy.md"), pageTextPolicy, "utf8");
await writeFile(path.join(root, "prompts/00-character-sheet.md"), characterPrompt(), "utf8");

for (const page of pages) {
  const file = `${String(page.n).padStart(2, "0")}-page-${page.slug}.md`;
  await writeFile(path.join(root, "prompts", file), promptForPage(page), "utf8");
}

const webPages = pages.map((page) => ({
  ...page,
  thumb: page.image.replace("assets/pages/", "assets/thumbs/"),
}));

await writeFile(
  path.join(root, "data/comic.json"),
  `${JSON.stringify({ title: "金一驭道", subtitle: "玄鉴仙族 · 金羽宗神话源流漫画序章", visualBible, characters, pages: webPages }, null, 2)}\n`,
  "utf8",
);

console.log(`Prepared ${pages.length} page prompts plus character sheet.`);

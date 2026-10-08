export interface ProfileKnowledgeEntry {
  keywords: string[];
  answer: string;
}

// Extracted from the supplied resume PDF and kept as the local Askme knowledge base.
export const profileKnowledge: ProfileKnowledgeEntry[] = [
  { keywords: ["名字", "姓名", "叫什么", "谁", "name"], answer: "我叫于茜，英文名是 Sissi Yu。" },
  { keywords: ["职业", "工作", "做什么", "职位", "职业", "designer"], answer: "我是一名 AI 产品设计师，目前在字节跳动抖音负责 C 端 AI 产品设计。" },
  { keywords: ["公司", "字节", "抖音", "bytedance"], answer: "我从 2023 年 3 月起在字节跳动·抖音担任 AI 产品设计师，工作地点在上海。" },
  { keywords: ["经验", "几年", "年限"], answer: "我有 6.5 年工作经验，其中字节跳动抖音约 3.5 年、58 同城房产约 3 年。" },
  { keywords: ["能力", "擅长", "技能", "技术栈", "工具"], answer: "我擅长 AI 产品端到端落地、AI Native 工作流、用户意图识别、RAG 与 Embedding 等 AI 产品转化，也熟悉 Codex、Figma、Protopie 和 After Effects。" },
  { keywords: ["项目", "ai搜索", "智能画布", "泛意图", "交易意图"], answer: "我做过 AI 泛化智能画布、泛意图 AI 产品化和交易意图 AI 体系化承接，曾推动搜索体验和模型评估框架从 0 到 1 落地。" },
  { keywords: ["成果", "数据", "提升", "指标"], answer: "AI 项目曾带动抖音主动搜 LT +2.75%、换 query 率 -1.88%；交易搜索换 query 率 -2.65%、GMV 提升 1.89%；AI 工作流让个人和团队提效约 80%。" },
  { keywords: ["折叠屏", "大屏", "双列"], answer: "我提出过折叠屏搜索的动态双列布局，实现即搜即显、边选边看；项目让搜索消费时长提升 2.34%，LT30 提升 12.82%。" },
  { keywords: ["58", "房产", "b端"], answer: "我曾在 58 同城房产担任体验设计师，负责 B 端体验改版、设计规范和满意度监测，推动多项效率优化。" },
  { keywords: ["教育", "学历", "硕士", "本科", "学校"], answer: "我本科和硕士都就读于东华大学，硕士方向是交互设计；还曾赴台湾实践大学工业设计系公费交流。" },
  { keywords: ["论文", "脑机", "bci"], answer: "我发表过 3 篇脑机交互 BCI 方向的国际会议英文论文，并被 EI 收录。" },
  { keywords: ["语言", "英语", "雅思", "cet"], answer: "英语可以作为熟练工作语言，大学英语六级 503 分、雅思 6.5 分，也有国际汉语教师经历。" },
  { keywords: ["上海", "地点", "哪里工作"], answer: "我目前在上海工作。" }
];

export const privacyReplies = [
  "这个问题你可以当面问我哈哈哈",
  "这类个人隐私，还是见面后问我吧～",
  "哈哈，这个属于我的私人信息，咱们当面聊。"
];

export const unrelatedReplies = [
  "咱们还是聊聊和我相关的吧",
  "这个话题和我不太相关，我们聊聊我的经历吧～",
  "我们换个方向，聊聊我的工作和作品怎么样？",
  "这个问题先放一放，想了解我的项目经历吗？",
  "咱们回到我的职业经历上来吧～",
  "这个和我的资料关系不大，我们聊聊 AI 产品设计吧。",
  "不如聊聊我做过的 AI 搜索和智能画布项目？"
];

# 当屏幕退休

研究生时做 EEG 产品，现在做 AI 搜索——两件事，原来是一件事。

![我的研究生毕设：一款适配中国头型的 EEG 情绪识别头戴产品（多视角展示）](/markdown/screen-retirement-assets/01-thesis-product.jpg)

## 研究生毕设：先让设备读到信号

研究生那会儿，我的毕设方向是 EEG 情绪识别的交互产品设计——做一款戴在头上的设备，用脑电信号判断人当下的情绪。日常工作包括给被试戴电极帽、涂导电膏、盯着波形找信号。朋友常问“你们是不是能读心”，我的回答是：读不了，只能读到“他注意到那个小方块闪了一下”。

### 第一件：电极

最初方案里电极是固定的，戴得稍微偏一点，信号就会飘。后来按国际 10-20 系统挑了 13 个常用点位，做成可移动结构，信号才稳下来。读脑电的第一步其实不是算法，而是“戴得合”——电极贴不贴头皮，直接决定拿到的是信号还是噪声。

### 第二件：头型

市面上的 EEG 头戴产品基本按欧美头型设计，中国用户戴上后，不是夹头就是漏信号。我们扫描了 20 个学生的头型，男女各 10 人，再和 CAESAR、SizeChina 这些数据库里的中西方头型数据做对比，重新确定产品尺寸。

![毕设里的中西方头型对比——“戴得合”，是读得准的前提](/markdown/screen-retirement-assets/02-thesis-heads.jpg)

产品完成后，我们让受试者戴上设备，测试四种情绪下的脑电反应。信号精度比前代产品“略好了一点”。论文里只能这么写，但只有我知道那一点有多难。

![毕设的产品测试：受试者佩戴设备，观察四种情绪下的脑电反应（右为 OpenBCI 测试界面）](/markdown/screen-retirement-assets/03-thesis-test.jpg)

### 第三件：界面

专业 EEG 软件的界面，普通人根本用不动。设备做得再准，不会用，等于零。

## 从 EEG 到 AI 搜索：识别意图

后来我做了六年产品设计，现在做 AI 搜索，每天都在识别用户意图。用户搜索“苹果”，可能是想买手机，也可能是想吃水果。这也是一个低信噪比的信号：错别字、方言和没说清的需求，全是噪声。识别准不准，一半在算法，一半在“合不合”：产品有没有理解用户当下的语境。识别错了，还得有体面的补救。实验室里叫“我没听清，你再说一遍”，搜索里叫“猜你想搜”。

## 脑机接口仍然在回答同一个问题

斯坦福团队 2023 年发表于 Nature 的语音解码研究，把“想说的话”实时翻译成文字，做到 62 词/分钟，是此前纪录的 3.4 倍。

![“想说话”在脑电信号里的样子——运动皮层对发音动作的神经表征。图源：Willett et al., Nature 2023, Figure 1](/markdown/screen-retirement-assets/04-nature2023.jpg)

2024 年《新英格兰医学杂志》的研究更进一步：

- 植入第一天，在 50 个词的词汇量里达到 99.6% 准确率。
- 第二天只多训练 1.4 小时，就覆盖 12.5 万词，准确率达到 90.2%。
- 之后八个月，准确率稳定在 97.5%。

![脑机接口把“想说的话”变成文字、再变成声音的完整链路。图源：Card et al., N Engl J Med 2024, Figure 1](/markdown/screen-retirement-assets/05-nejm2024.jpg)

Neuralink 将电极数量从 1000 根增加到 3000 根。2019 年白皮书里的电极针尖只有 24 微米，和硬币放在一起，得拿放大镜才能找到。最让我在意的是受试者 Brad Smith 说的这句话：**“它不读我的想法，只解读‘我想让光标往哪儿去’的信号。”** 翻译过来就是：脑机接口的商业模式从来不是读心，而是意图输入。

![插入电极用的微针与一美分硬币的对比。图源：Musk & Neuralink, JMIR 2019, Figure 2](/markdown/screen-retirement-assets/06-jmir2019.jpg)

## 设计“错了怎么办”

系统读不准本来就是常态；读得越准，一次误判的成本反而越高。所以未来产品的胜负手，大概不在把准确率卷到 99%，而在把“错了怎么办”设计得足够体面——这恰好是我在搜索里每天都在做的事。

## 结语

从 EEG 到搜索，再到脑机接口，隔了好几年，做的其实是同一件事：让机器读到人的意图。这条路我走了两遍：一遍戴着电极帽，一遍写着搜索策略。终点是同一个问题：人到底想要什么。读得准不准，最后拼的恐怕还是设计的基本功——贴合、容错、让人用得下去。

**屏幕退休就退休吧。只要“人”还在台上，这行就还有得做。**

---

**来源：**

- Willett, F. R. et al. A high-performance speech neuroprosthesis. Nature 620, 1031–1036 (2023)
- Card, N. S. et al. An Accurate and Rapidly Calibrating Speech Neuroprosthesis. N Engl J Med 391, 609–618 (2024)
- Musk, E. & Neuralink. An Integrated Brain-Machine Interface Platform With Thousands of Channels. JMIR 2019
- Neuralink 官方更新《Two Years of Telepathy》
- Yu X., Qi W. A User Study on Head Size of Chinese Youth for Head-Mounted EEG Products（EI 收录，2019）
- Yu X., Qi W. A User Study of Wearable EEG Emotion Analysis（ACAI 2018，EI 收录）
- 前三张配图来自本人研究生毕设《EEG 情绪识别交互产品设计》

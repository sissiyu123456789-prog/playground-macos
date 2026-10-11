import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile",
    title: "概述",
    icon: "i-fa-solid:paw",
    md: [
      {
        id: "about-me",
        title: "关于我",
        file: "markdown/about-me.md",
        icon: "i-la:dragon",
        excerpt:
          "AI 产品设计师，拥有 6.5 年工作经验，目前在字节跳动·抖音负责 C 端 AI 产品设计。"
      },
      {
        id: "about-site",
        title: "关于本站",
        file: "markdown/about-site.md",
        icon: "i-octicon:browser",
        excerpt: "介绍这个个人作品集网站的设计与技术实现。"
      }
    ]
  },
  {
    id: "project",
    title: "项目",
    icon: "i-octicon:repo",
    md: [
      {
        id: "trading-agent",
        title: "交易 Agent",
        file: "/markdown/交易Agent_项目概述.md?v=20261011",
        icon: "i-carbon:machine-learning",
        excerpt: "以意图体系驱动 AI 搜索 Agent，形成从种草到拔草的交易闭环。"
      },
      {
        id: "aigc-content-quality",
        title: "AIGC 生成式内容提质",
        file: "/markdown/aigc-content-quality.md?v=20261011",
        icon: "i-ri:magic-line",
        excerpt: "用质量评级、规范、组件与 AI 工作流提升生成式内容体验。"
      },
      {
        id: "douyin-ai-search",
        title: "抖音AI搜",
        file: "/markdown/douyin-ai-search.md?v=20261011",
        icon: "i-carbon:search",
        excerpt:
          "从问题发现到体系化落地，探索更懂用户、更有信心、更可掌控的 AI 搜索体验。"
      }
    ]
  },
  {
    id: "article",
    title: "文章",
    icon: "i-octicon:book",
    md: [
      {
        id: "judgment-object",
        title: "判断没变，对象变了",
        file: "/markdown/article-judgment.md?v=20261011",
        icon: "i-ri:article-line",
        excerpt: "设计师的判断没有改变，改变的是判断所面对的对象。"
      },
      {
        id: "screen-retirement",
        title: "当屏幕退休",
        file: "/markdown/screen-retirement.md?v=20261011",
        icon: "i-ri:article-line",
        excerpt: "从 EEG 情绪识别到 AI 搜索，理解机器如何读到人的意图。"
      }
    ]
  }
];

export default bear;

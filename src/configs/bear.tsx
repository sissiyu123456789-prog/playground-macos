import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile", title: "Profile", icon: "i-fa-solid:paw",
    md: [
      { id: "about-me", title: "About Me", file: "markdown/about-me.md", icon: "i-la:dragon", excerpt: "AI 产品设计师，拥有 6.5 年工作经验，目前在字节跳动·抖音负责 C 端 AI 产品设计。" },
      { id: "github-stats", title: "Github Stats", file: "markdown/github-stats.md", icon: "i-icon-park-outline:github", excerpt: "Here are some status about my github account..." },
      { id: "about-site", title: "About This Site", file: "markdown/about-site.md", icon: "i-octicon:browser", excerpt: "Something about this personal portfolio site..." }
    ]
  },
  {
    id: "project", title: "Projects", icon: "i-octicon:repo",
    md: [
      { id: "flint", title: "Flint", file: "https://raw.githubusercontent.com/Renovamen/flint/main/README.md", icon: "i-heroicons-solid:fire", excerpt: "A deep learning framework implemented in Numpy...", link: "https://github.com/Renovamen/flint" },
      { id: "portfolio-macos", title: "Portfolio macOS", file: "https://raw.githubusercontent.com/Renovamen/playground-macos/main/README.md", icon: "i-ri:gamepad-line", excerpt: "My portfolio website simulating macOS's GUI...", link: "https://github.com/Renovamen/playground-macos" },
      { id: "oh-my-cv", title: "Oh, My CV!", file: "https://raw.githubusercontent.com/Renovamen/oh-my-cv/main/README.md", icon: "i-ri:newspaper-fill", excerpt: "Write your curriculum vitae / resume in Markdown online...", link: "https://ohmycv.app" }
    ]
  },
  {
    id: "article", title: "Article", icon: "i-octicon:book",
    md: [
      { id: "ai-product-design", title: "AI Product Design", file: "markdown/article-ai-product.md", icon: "i-ri:article-line", excerpt: "AI 产品设计与工作流方法总结。" },
      { id: "search-intent", title: "Search Intent", file: "markdown/article-search-intent.md", icon: "i-ri:search-eye-line", excerpt: "用户意图识别与 AI 搜索承接实践。" }
    ]
  }
];

export default bear;

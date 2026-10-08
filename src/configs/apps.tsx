import { appBarHeight } from "~/utils";
import WeChat from "~/components/apps/WeChat";
import Askme from "~/components/apps/Askme";
import type { AppsData } from "~/types";

const apps: AppsData[] = [
  {
    id: "bear",
    title: "Bear",
    desktop: true,
    width: 1040,
    height: 650,
    show: true,
    y: -40,
    img: "img/icons/bear.png",
    content: <Bear />
  },
  {
    id: "typora",
    title: "Askme",
    desktop: true,
    width: 600,
    height: 580,
    y: -20,
    img: "img/icons/doubao.png",
    content: <Askme />
  },
  {
    id: "wechat",
    title: "WeChat",
    desktop: true,
    width: 282,
    height: 384,
    y: 0,
    frameless: true,
    img: "img/icons/wechat.png",
    content: <WeChat />
  },
  {
    id: "vscode",
    title: "VSCode",
    desktop: true,
    width: 900,
    height: 600,
    x: 80,
    y: -30,
    img: "img/icons/vscode.png",
    content: <VSCode />
  },
  {
    id: "facetime",
    title: "FaceTime",
    desktop: true,
    img: "img/icons/facetime.png",
    width: 500 * 1.7,
    height: 500 + appBarHeight,
    minWidth: 350 * 1.7,
    minHeight: 350 + appBarHeight,
    aspectRatio: 1.7,
    x: -80,
    y: 20,
    content: <FaceTime />
  },
  {
    id: "terminal",
    title: "Terminal",
    desktop: true,
    img: "img/icons/terminal.png",
    content: <Terminal />
  },
  {
    id: "github",
    title: "Github",
    desktop: false,
    img: "img/icons/github.png",
    link: "https://github.com/sissiyu123456789-prog/playground-macos"
  }
];

export default apps;

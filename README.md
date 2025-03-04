## 项目简介

**不摸鱼**（[演示地址](https://bumoyu.cn)、[文档指南](https://bumoyu.cn/docs/)） 是一款个性化定制的导航网站，旨在帮助用户更高效地管理和访问常用网站和资源。目前主要提供聚合搜索和分类导航功能，未来还将添加更多实用工具，如备忘录、常用代码片段等。

目前，项目涉及的工程都已开源，欢迎大家 fork、star、issue、pr。

## 迭代计划

> 此项目会持续更新，大家基于 `master` 分支下载即可，各分支说明如下：
> - `master` 分支：项目当前可用的最新版本
> - `version-x-x` 分支：对应版本迭代的分支，其中 `version-0-1` 为最初版本
> - `dev` 分支：当前正在开发的分支，功能不完善，开发完毕后会合并到 `master` 分支

目前计划中的功能如下（开发顺序不分先后）：

- [ ] 部署更新提示。更新的项目部署后将自动提示用户更新，用户可以点击更新按钮进行更新。
- [ ] 多账号切换功能。一个用户可以更快捷的通过多个账号来管理不同的资源。
- [ ] 配置功能优化。将所有的配置项聚合到右侧侧边栏中，用户可以更好的定制主题。
- [ ] 优化链接模块架构。可以更方便的新增/切换主题。
- [ ] （待定）登录页改为弹窗形式。用于支持多账号切换及其他场景。
- [ ] （待定）分类缺省页及链接缺省页修改。缺省时展示新增按钮。
- [ ] 网站UI优化。
- [ ] 网站增加深色/浅色主题切换。
- [ ] （待定）增加版本更新日志。
- [ ] 新增/编辑导航弹窗中添加颜色拾取器。

## 工程介绍

### bumoyu-workbench

[Github 地址](https://github.com/partiny/bumoyu-workbench) | [Gitee 地址](https://gitee.com/partiny/bumoyu-workbench)

`bumoyu-Workbench` 是基于 Vue 3 + TypeScript + Ant Design Vue 等主流技术栈构建的前端导航项目。它提供了丰富的功能，包括登录、注册、自定义导航、主题切换、一键备份及恢复等。通过这个项目，用户可以轻松管理和访问常用的网站和资源，享受个性化的上网体验。

## 版本依赖

本项目基于以下框架/类库（排名不分先后）开发完成，特别感谢😘~

- Vue3 [官网](https://cn.vuejs.org/)
- Ant Design Vue [官网](https://www.antdv.com/docs/vue/introduce-cn)
- Vue Router [官网](https://router.vuejs.org/zh/)
- Pinia [官网](https://pinia.vuejs.org/zh/)
- Axios [官网](https://axios-http.com/)
- UnoCSS [官网](https://unocss.dev/)
- Sass [官网](github.com/sass/dart-sass)
- Day.js [官网](https://day.js.org/docs/zh-CN/installation/installation)
- vuedraggable [官网](https://github.com/SortableJS/Vue.Draggable?tab=readme-ov-file#readme)
- ...

篇幅有限无法逐一列举，也感谢文中未提到的其它依赖~

## 项目启动

```bash
# 克隆代码
# Gitee 地址
git clone https://gitee.com/partiny/bumoyu-workbench.git
# Github 地址
#git clone https://github.com/partiny/bumoyu-workbench.git

# 切换目录
cd bumoyu-workbench

# 安装 pnpm（已安装则跳过该步骤）
npm install pnpm -g

# 安装依赖
pnpm install

# 启动运行
pnpm dev
```

## 支持一下

如果觉得框架不错，或者对你有用，可以去帮我点个 ⭐ Star，谢谢~~

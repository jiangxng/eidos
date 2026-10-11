# B8e — 圆角路径、多重重叠轮选及 Escape 重抓（2026-10-10）

## 权威来源与分支

- 直接从 Eidos [B8d Draft #145](https://github.com/jiangxng/eidos/pull/145) 派生 [B8e Draft #146](https://github.com/jiangxng/eidos/pull/146)，配对 App [Draft #591](https://github.com/jiangxng/EVO-App-Platform/pull/591) 在独立分支实现集成证据。原始产品设计要求仍为 App [研究交接 #552](https://github.com/jiangxng/EVO-App-Platform/pull/552) 和 §14 商业验收；不把链接当作本轮重新阅读外部资料。
- 不合并 main、不部署线上、不触碰 Agent 工具权限、业务定义/关系、App Host 导航与投影独立 CAS。原有 44 CSS px 命中区、B8d轮选规则均保留。

## 问题与修复

- 新增纯几何断言：`rounded-orthogonal` 多段路径拖动后仍包含真实 `Q` 圆角命令；原始端点、路径点不变，输出有限，手工控制点不超过 24；重叠候选可选到末尾并回到第二，不缩小热区。
- Chrome 在取消 SVG pointer capture 后，后续原生 mouse release 可能给画布派发尾随 click，意外清除关系选择和重叠控制柄。Eidos `surface.ts` 中只在**按 Escape 取消正在拖动的路径**时，观察原 pointerId 的尾随 pointerup，并压制本次合成 canvas click；正常点击不受影响。缺少 pointerup 时最多保留观察 30 秒，防止无限期挂接。
- `pointercancel`/lost capture/触摸多指中断仍沿用旧路径；真正提交时单 Undo/Redo、本地编辑后显式 Save 均无变更。

## 执行证据

- Eidos [#146](https://github.com/jiangxng/eidos/pull/146) 编译、专项测试与 CI PASS。
- App [Chrome Browser CI #38021117688](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38021117688) PASS，Chrome/154.0.8037.97，**14 个独立标签页**，日志 `b8eRoundedMultiRankCancelRegrabSaveViewer=true`。
- 新建真实第 12 标签页：通过实际 Designer Inspector 把关系统一路由设置为 `rounded-orthogonal`，创建五个密集路径点，在同一 waypoint 形成 >=4 个重叠正交段。CDP 原生鼠标 Shift+Alt 点击逐步选择第四直到最后一个，核对视觉 `N/M` 和 SVG 原样；从最后一项循环回第二，再选择最后一项。44px 热区不变，Store 不写。
- CDP 原生鼠标 Shift+Alt 拖动最后一段显示真实 `Q` 圆角预览；真实 Chrome Escape 键取消，释放后同页保留候选与原始 SVG，立即重新拖动并提交。单次 Undo 原样还原，Redo 原样重做。通过 App Host 显式 `Save projection` 使投影 revision 4→5，仅一次，业务定义历史仍为 1。
- 第 13 标签页全新 Designer 从持久的当前测试 Store 重新读取相同 `rounded-orthogonal` SVG，另一个第 14 标签页是真正只读 Enterprise Definition Viewer，路径精确一致，不显示编辑/Save。旧 B8d/B8c/B8b/B7b 测试也都 PASS。

## 不可扩大解释的限制

以上为**Chrome CDP 浏览器层真实鼠标/键盘事件**，不是外接 Windows/macOS 物理键盘鼠标、macOS 触控板或 iOS/Android 实体系统验证；Store 仍为测试环境的内存 provider，而非真正重启后磁盘/生产持久性；这里的圆角折线也不代表任意曲线、自环已经有可编辑句柄。其他关系重叠、多图实例、大图性能和 v1.0 §14 **39 项完整商业验收仍 NOT TESTED**。本分支 Draft，未合并、未部署。

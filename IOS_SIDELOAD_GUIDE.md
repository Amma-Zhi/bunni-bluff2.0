# 萌心小丑牌：Windows 免费安装到 iPhone

这套方案不需要购买 Apple Developer Program。GitHub 的 Mac 电脑负责生成未签名 IPA，Windows 上的 AltServer/AltStore 再使用你的免费 Apple ID 给它签名并安装。

> 重要：GitHub 下载的 IPA 是“未签名安装包”，不能直接点开安装。AltStore/AltServer 会在安装时用你的免费 Apple ID 重新签名，所以 GitHub 仓库里不需要保存 Apple 密码或证书。

## 一、云端生成 IPA

1. 把本项目推送到 GitHub。
2. 打开仓库顶部的 **Actions**。
3. 左侧选择 **Build iOS IPA (AltStore)**。
4. 点击 **Run workflow**，再点绿色按钮确认。
5. 等待任务变绿，打开这次运行记录。
6. 在页面底部 **Artifacts** 下载 `BunniBluff-iOS-AltStore`。
7. 解压下载的 ZIP，里面就是 `BunniBluff-unsigned.ipa`。

如果顶部没有 **Actions**，先到仓库 **Settings → Actions → General**，确认 Actions 已启用。

每次推送到 `main` 分支也会自动重新打包。这个 IPA 故意不在 GitHub 上签名，因此不需要上传 Apple ID、证书或密码。

## 二、Windows 安装 AltStore

1. 按 AltStore 官方 Windows 教程安装 iTunes、iCloud 和 AltServer。官方建议 iTunes 与 iCloud 使用 Apple 官网版本，而不是 Microsoft Store 版本。
2. 用数据线连接并解锁 iPhone，点“信任此电脑”。
3. 以管理员身份启动 AltServer，再从任务栏托盘图标选择 **Install AltStore**。
4. iOS 16 或更高版本还要在 iPhone 的“设置 → 隐私与安全性 → 开发者模式”里开启开发者模式。

官方教程：https://faq.altstore.io/altstore-classic/how-to-install-altstore-windows

## 三、安装萌心小丑牌 IPA

最直接的方法：按住键盘 **Shift**，同时点击 Windows 右下角的 AltServer 托盘图标，选择 **Sideload .ipa…**，再选择 `BunniBluff-unsigned.ipa` 和你的 iPhone。

也可以把 IPA 传到手机，在 AltStore 的 **My Apps** 页面点左上角 `+` 后选中它。

## 四、7 天刷新

免费 Apple ID 安装的 App 7 天后过期。到期前让 iPhone 与运行 AltServer 的电脑处于同一 Wi-Fi，打开 AltStore 后点 **Refresh All**。也可以插数据线刷新。

请不要先删除旧 App：直接刷新或重新安装，通常可以保留游戏的本地存档；主动删除 App 会一起删除它的本地数据。

免费账号通常最多同时安装 3 个侧载 App；AltStore 自己也会占用其中一个名额。本项目没有 App Extension，只消耗一个 App ID。

## 已配置的原生能力

- 独立全屏 Capacitor App，没有 Safari 地址栏。
- Bundle ID：`com.ammazhi.bunnibluff`。
- 显示名称：`萌心小丑牌`。
- 自定义 App 图标与启动画面。
- 刘海、灵动岛和 Home Indicator 安全区适配。
- 点击按钮时的轻触震动；不支持震动的设备会自动忽略。
- 顶部按钮可在横屏和竖屏之间切换，并同步锁定 iPhone 方向。

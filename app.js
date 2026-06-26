// app.js
App({
  onLaunch() {
    // ============================================================
    //  TODO：请替换为你的云开发环境 ID
    //  打开微信开发者工具 → 云开发控制台 → 设置 → 环境 ID
    // ============================================================
    const envId = 'YOUR_ENV_ID'

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }

    wx.cloud.init({
      env: envId,
      traceUser: true,
    })

    console.log('CloudBase 初始化完成，环境：', envId)
  },
})

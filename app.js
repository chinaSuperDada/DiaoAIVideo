// app.js
App({
  onLaunch() {
    const envId = 'diao-ai-video-d3gtf3dpx9aee0594'

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }

    wx.cloud.init({
      env: envId,
      traceUser: true,
      success: () => {
        console.log('CloudBase 初始化完成，环境：', envId)
      },
      fail: (err) => {
        console.error('CloudBase 初始化失败：', err)
      },
    })
  },
})

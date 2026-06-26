// pages/upload/upload.js - 上传照片页
Page({
  data: {
    previewSrc: '', // 选中图片的本地预览路径
    tempFilePath: '', // wx.chooseMedia 返回的临时路径
    uploading: false,
  },

  // 选择照片
  async chooseImage() {
    try {
      const res = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sizeType: ['compressed'],
      })

      const tempFilePath = res.tempFiles[0].tempFilePath
      this.setData({
        previewSrc: tempFilePath,
        tempFilePath,
      })
    } catch (err) {
      // 用户取消选择不算错误
      if (err.errMsg && err.errMsg.includes('cancel')) return
      console.error('选择照片失败：', err)
      wx.showToast({
        title: '选择照片失败',
        icon: 'none',
        duration: 2000,
      })
    }
  },

  // 上传照片
  async doUpload() {
    const { tempFilePath } = this.data
    if (!tempFilePath) return

    this.setData({ uploading: true })

    try {
      // 生成唯一文件名
      const timestamp = Date.now()
      const random = Math.random().toString(36).slice(2, 8)
      const cloudPath = `photos/${timestamp}-${random}.jpg`

      // 上传到云存储
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath,
        filePath: tempFilePath,
      })

      const fileID = uploadRes.fileID

      // 写入云数据库
      const db = wx.cloud.database()
      await db.collection('photos').add({
        data: {
          fileID,
          createdAt: db.serverDate(),
        },
      })

      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 1500,
      })

      // 延迟返回首页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      console.error('上传失败：', err)
      wx.showToast({
        title: err.errMsg || '上传失败，请重试',
        icon: 'none',
        duration: 2500,
      })
    } finally {
      this.setData({ uploading: false })
    }
  },
})

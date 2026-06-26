// pages/index/index.js - 照片墙首页
Page({
  data: {
    photos: [],    // { _id, tempUrl }
    photoUrls: [], // 用于 wx.previewImage 的 urls 列表
    loading: true,
  },

  onShow() {
    this.loadPhotos()
  },

  // 从云数据库拉取照片列表
  async loadPhotos() {
    this.setData({ loading: true })

    try {
      const db = wx.cloud.database()
      const res = await db
        .collection('photos')
        .orderBy('createdAt', 'desc')
        .get()

      if (res.data.length === 0) {
        this.setData({ photos: [], photoUrls: [], loading: false })
        return
      }

      // 把 cloud://fileID 转成临时可访问链接
      const fileIDs = res.data.map((item) => item.fileID)
      const tempRes = await wx.cloud.getTempFileURL({ fileList: fileIDs })

      // 组装数据
      const photos = res.data.map((item, i) => ({
        ...item,
        tempUrl: tempRes.fileList[i].tempFileURL,
      }))
      const photoUrls = photos.map((p) => p.tempUrl)

      this.setData({ photos, photoUrls, loading: false })
    } catch (err) {
      console.error('加载照片失败：', err)
      wx.showToast({
        title: '加载失败，下拉重试',
        icon: 'none',
        duration: 2000,
      })
      this.setData({ loading: false })
    }
  },

  // 全屏预览
  onPreview(e) {
    const { url, urls } = e.currentTarget.dataset
    wx.previewImage({
      current: url,
      urls,
    })
  },

  // 跳转到上传页
  goUpload() {
    wx.navigateTo({
      url: '/pages/upload/upload',
    })
  },
})

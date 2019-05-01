export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认)白底黑字 / inverse(反向)鲜艳
    navbarLayoutType: localStorage.getItem('navbarLayoutType') || 'inverse',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: localStorage.getItem('sidebarLayoutSkin') || 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 菜单列表
    menuList: [],
    sideMenuActiveName: '',
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: '',
    // 顶部菜单激活index
    topMenuActiveIndex: 'home',
    // 主题设置是否打开
    themeSettingOpen: false,
    // 默认主题颜色， 蓝色
    themeColor: localStorage.getItem('themeColor') || '3E8EF7'
  },
  mutations: {
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType (state, type) {
      localStorage.setItem('navbarLayoutType', type)
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin (state, skin) {
      localStorage.setItem('sidebarLayoutSkin', skin)
      state.sidebarLayoutSkin = skin
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateSideMenuActiveName (state, name) {
      state.sideMenuActiveName = name
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    },
    updateThemeSettingOpen (state, isOpen) {
      state.themeSettingOpen = isOpen
    },
    updateThemeColor (state, colorValue) {
      localStorage.setItem('themeColor', colorValue)
      state.themeColor = colorValue
    },
    updateTopMenuActiveIndex (state, index) {
      state.topMenuActiveIndex = index
    },
    // 重置主题设置
    updateResteTheme (state) {
      state.themeColor = '3E8EF7'
      state.navbarLayoutType = 'inverse'
      state.sidebarLayoutSkin = 'dark'
      localStorage.removeItem('themeColor')
      localStorage.removeItem('navbarLayoutType')
      localStorage.removeItem('sidebarLayoutSkin')
    }
  }
}

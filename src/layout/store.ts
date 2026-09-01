// ---------- 布局状态管理 ----------
// 使用 Eidos 的 createStore 管理布局状态

import { createStore } from '../core/index'
import type { LayoutConfig, LayoutRegion } from './types'

export type LayoutState = {
  config: LayoutConfig | null
  activeRegion: string | null
  collapsedRegions: Record<string, boolean>
  hiddenRegions: Record<string, boolean>
  userProfile: any
  alerts: any[]
  recommendations: any[]
  quickLinks: any[]
}

export function createLayoutStore(initialConfig?: LayoutConfig) {
  const store = createStore<LayoutState>({
    config: initialConfig || null,
    activeRegion: null,
    collapsedRegions: {},
    hiddenRegions: {},
    userProfile: null,
    alerts: [],
    recommendations: [],
    quickLinks: []
  })

  // 切换区域折叠状态
  function toggleRegion(regionId: string) {
    const state = store.get()
    const current = state.collapsedRegions[regionId] || false
    store.dispatch(
      (prev: any) => ({
        ...prev,
        collapsedRegions: { ...prev.collapsedRegions, [regionId]: !current }
      }),
      ['collapsedRegions']
    )
  }

  // 隐藏区域
  function hideRegion(regionId: string) {
    store.dispatch(
      (prev: any) => ({
        ...prev,
        hiddenRegions: { ...prev.hiddenRegions, [regionId]: true }
      }),
      ['hiddenRegions']
    )
  }

  // 显示区域
  function showRegion(regionId: string) {
    store.dispatch(
      (prev: any) => ({
        ...prev,
        hiddenRegions: { ...prev.hiddenRegions, [regionId]: false }
      }),
      ['hiddenRegions']
    )
  }

  // 更新用户画像
  function setUserProfile(profile: any) {
    store.dispatch((prev: any) => ({ ...prev, userProfile: profile }), ['userProfile'])
  }

  // 更新告警列表
  function setAlerts(alerts: any[]) {
    store.dispatch((prev: any) => ({ ...prev, alerts }), ['alerts'])
  }

  // 更新 AI 推荐
  function setRecommendations(recommendations: any[]) {
    store.dispatch((prev: any) => ({ ...prev, recommendations }), ['recommendations'])
  }

  // 更新常用链接
  function setQuickLinks(quickLinks: any[]) {
    store.dispatch((prev: any) => ({ ...prev, quickLinks }), ['quickLinks'])
  }

  // 加载布局配置
  function loadConfig(config: LayoutConfig) {
    store.dispatch((prev: any) => ({ ...prev, config }), ['config'])
  }

  return {
    store,
    toggleRegion,
    hideRegion,
    showRegion,
    setUserProfile,
    setAlerts,
    setRecommendations,
    setQuickLinks,
    loadConfig
  }
}
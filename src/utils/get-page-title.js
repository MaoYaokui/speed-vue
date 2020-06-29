import defaultSettings from '@/settings'

const title = defaultSettings.title || '它思科技-引擎测试系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

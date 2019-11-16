/**
 * 相对时间模块
 */
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 按需加载
import rTime from 'dayjs/plugin/relativeTime' // 相对时间插件
dayjs.locale('zh-cn') // 全局使用中文语言
dayjs.extend(rTime)

export const relativeTime = time => {
  return dayjs().from(dayjs(time))
}

// export const relativeTime =
// export const relativeTime =
// export const relativeTime =

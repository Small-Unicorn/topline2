/**
 * 文章相关接口请求模块
 */
import request from '@/utils/request'

// export const getArticles = (params) => {
//   return request({
//     method: 'GET',
//     url: '/app/v1_1/articles',
//     params, // query 参数放这里
//   })
// }

export const getArticles = params => {
  const { channelId, timestamp, withTop } = params
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId, // 频道id
      timestamp,
      with_top: withTop
    }, // query 参数放这里
    data: {} // body 参数放这里
  })
}

/**
 * 举报文章
 */
export const reportArticle = ({
  articleId,
  type,
  remark = null
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target: articleId,
      type,
      remark
    }
  })
}

/**
 * 获取文章详情
 */
export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

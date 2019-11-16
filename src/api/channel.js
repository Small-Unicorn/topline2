import request from '@/utils/request'

export const getUserChannels = () => {
  return request({
    methods: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

// 删除指定用户频道
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}

// 添加用户频道
export const addUserChannel = (channelId, seq) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/channels',
    data: {
      channels: [{
        id: channelId, // 频道Id
        seq // 序号
      }]
    }
  })
}

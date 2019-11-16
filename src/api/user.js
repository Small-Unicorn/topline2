import request from '@/utils/request'

export const login = ({ mobile, code }) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}

// 拉黑用户
export const addBlackLists = userId => {
  return request({
    method: 'POST',
    url: ' /app/v1_0/user/blacklists',
    data: {
      target: userId
    }
  })
}

// 关注用户
export const followUser = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}
// 取消关注用户
export const unFollowUser = userId => {
  return request({
    method: 'DELETE',
    url: '/app/V1_0/user/followings/$(userId)'
  })
}

// 获取用户自己信息
export const getUserSelf = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'

  })
}

/**
 * 获取用户个人资料
 */
export const getUserProfile = userId => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

/**
 * 更新用户照片资料（头像、身份证照片）
 */
export const updateUserPhoto = file => {
  const formData = new FormData()
  formData.append('photo', file)
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    // 注意：接口中凡是要求：Content-Type application/json，data 必须传递 {}
    // data: {}

    // Content-Type multipart/form-data: FormData 表单对象
    data: formData
  })
}

/**
 * 更新用户基本信息
 */
export const updateUserBaseInfo = ({
  name,
  gender,
  birthday
}) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data: {
      name,
      gender,
      birthday
    }
  })
}

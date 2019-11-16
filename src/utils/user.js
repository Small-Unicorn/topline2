
// 关于用户数据
const USER_KEY = 'USER'

// 获取用户数据 JSON.parse 转换为json对象
export const getUser = () => JSON.parse(window.localStorage.getItem(USER_KEY))
// 保存用户数据
export const saveUser = data => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export const deleteUser = data => {
  window.localStorage.removeItem(USER_KEY)
}

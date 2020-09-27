import ajax from '@/utils/request'
// 对所有用户相关的操作进行封装

/**
 * 用户登陆
 * @param {string} mobile 手机号
 * @param {string} code 密码
 */
export const login = (mobile, code) => {
  // ajax() 这个函数的返回值是一个promise
  return ajax({
    url: '/app/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}

/**
 * 获取用户信息
 */
export const getProfile = () => {
  return ajax({
    method: 'GET',
    url: '/app/v1_0/user/profile',
    headers: {
      // Authorization: 'Bearer token值' 之间有空格
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDExODQ0MDIsInVzZXJfaWQiOjExMDI0OTA1MjI4Mjk3MTc1MDQsInJlZnJlc2giOmZhbHNlfQ.8A8wyLwEvRrz3cdkPe3x7juskspAF1OnDsGMWYf0oIw'
    }
  })
}

export const logout = (mobile, code) => {
  return ajax({
    url: '/app/v1_0/authorizations/xxxxx',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}

// const result = await ajax({
//   url: '/app/v1_0/authorizations',
//   method: 'POST',
//   data: {
//     mobile,
//     code
//   }
// })
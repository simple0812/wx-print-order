
// 将 Taro.checkSession的方法promise化
export default function (fn) {
  return function (options) {
    return new Promise((resolve, reject) => {
      fn({
        ...options,
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }
}
import Axios from "axios";
import store from '@/store'
import {MessageBox, Message} from 'element-ui'
import {getToken} from '@/utils/auth'

export function request(config) {
  // 创建一个axios实例
  const instance = Axios.create({
    // baseURL: 'http://127.0.0.1:9000',
    baseURL: store.state.baseURL,
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 20000 // request timeout
  })

  // 请求拦截器
  instance.interceptors.request.use(
      config => {
        // do something before request is sent
        if (store.getters.token) {
          // 让每个请求都带有Token
          config.headers['X-Token'] = getToken()
        }
        return config
      },
      error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
      }
  )

  // response interceptor
  instance.interceptors.response.use(
      response => {
        const res = response.data
        // if the custom code is not 0, it is judged as an error.
        if (res.code !== 0) {
          Message({
            message: res.msg || 'Error',
            type: 'error',
            duration: 5 * 1000
          })
          //50008：非法Token； 50012：其他客户端登录； 50014：Token已过期；
          if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
            // to re-login
            MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
              confirmButtonText: 'Re-Login',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            })
          }
          return Promise.reject(new Error(res.message || 'Error'))
        } else {
          return res
        }
      },
      error => {
        console.log('err' + error) // for debug
        Message({
          message: error.msg,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(error)
      }
  )

  return instance(config)
}

import axios from 'axios'
import router from '../router'
import store from '../store'
import ElementUI from 'element-ui';

axios.defaults.baseURL = 'http://localhost:8080'

//前置拦截
axios.interceptors.request.use(config => {
    //可统一设置请求头
    return config
})

//后置拦截
axios.interceptors.response.use(
    response => {
        let data = response.data;
        if (data.code === 200 || data.code === 201) {
            //放行
            return response
        } else {
            //拦截
            ElementUI.Message.error(data.message)
            //抛出异常
            return Promise.reject(data.message)
        }
    },
    error => {
        if (error.response.data) {
            error.message = error.response.data.message
        }

        //表示未登录
        if (error.response.status === 401) {
            store.commit('REMOVE_INFO')
            router.push('/login').then(() => {
            })
            error.message = '登录状态已失效，请重新登录'
        }
        if (error.response.status === 403) {
            error.message = '权限不足，无法访问'
        }

        ElementUI.Message.error(error.message)
        return Promise.reject(error)
    }
)

import router from "../router";
import axios from "axios";
import ElementUI from 'element-ui';

// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
        const token = localStorage.getItem("token")
        console.log("------------" + token)
        axios.get('/blog/option', {
            headers: {'Authorization': token}
        }).then(res => {
            if (res.data.code === 200) {
                if (to.path === '/login') {
                } else {
                    next()
                }
            } else {
                ElementUI.Message.error(res.data.message)
                next({
                    path: '/login'
                })
            }
        }).catch(reason => {
            ElementUI.Message.error('登录状态失效，请尝试重新登录')
            next({
                path: '/login'
            })
        })
    } else {
        next()
    }
})

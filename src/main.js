import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import './filter/axios'
import './filter/permission'
// 全局注册markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'github-markdown-css/github-markdown.css'
import hljs from 'highlight.js'

Vue.prototype.$axios = axios
Vue.config.productionTip = false

//使用markdown
Vue.use(mavonEditor)
Vue.use(ElementUI)

// 如果开启了typescript 需要额外安装 npm install @types/highlight.js
// 通过 import * as hljs from 'highlight.js' 引入
Vue.directive('highlight', function (el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    })
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

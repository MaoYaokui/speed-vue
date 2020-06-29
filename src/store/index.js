import Vue from 'vue'
import Vuex from 'vuex'
import createVuexAlong from 'vuex-along'

import mutations from "./mutations"
import getters from './getters'

import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import status from './modules/status'

Vue.use(Vuex)

const path = "https://sl.n-dimension.com.cn"
// const path = "http://127.0.0.1"

const state = {
  baseURL: path + ':9005/',
  filePath: path + ':9005/file/'
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  modules: {
    app,
    settings,
    status,
    user
  },
  plugins: [createVuexAlong({
    name: "EngineTest",
    // local: {
    //   list: ["ma"],
    //   // 过滤模块 ma 数据， 将其他的存入 localStorage
    //   isFilter: true,
    // },
    // session: {
    //   // 保存模块 ma 中的 a1 到 sessionStorage
    //   list: ["ma.a1"],
    // },
  })]
})

export default store

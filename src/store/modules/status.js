const getDefaultState = () => {
  return {
    productStatus: false,
  }
}
const state = getDefaultState()

export default {
  state,
  mutations: {
    productSaveVisible(state) {
      state.productStatus = !state.productStatus
    },
    productList(state){
      state.productStatus = false
    }
  },
  actions: {},
  getters: {},
  modules: {}
}

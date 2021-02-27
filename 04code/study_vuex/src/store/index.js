// 1. 导入vue
import Vue from 'vue'
// 2. 导入 vuex --- 学习的重点
import Vuex from 'vuex'
console.log(Vuex)
// Vue.use 框架中提供的api，用来以vue插件的方式来使用Vuex
// 类似有：Vue.use(vueRouter)
// Vue.use(对象)， 对象中会有一个install方法
Vue.use(Vuex)
import axios from 'axios'
// export default: es6的默认导出。
// 这个被导出的对象在main.js中使用.

// new Vuex.Store: 实例化一个对象，构造器是Vuex.Store
export default new Vuex.Store({
  // state: 用来保存所有的公共数据
  state: {
    num: 100
  },
    // computed
  // getters的作用是：在state的基础上派生出新的数据项--类似于computed
  getters: {
    numberOfBooks (state) {
      return state.books.length
    },
    // 统计价格>60元的书的数量
    numberOf60 (state) {
      return state.books.filter(item=>item.price>60).length
    }
  },
  // mutations(变化，异动): 用来提供修改数据的方法。 
  // 数据不能在组件内部直接修改，必须在组件内调用mutations来修改
  mutations: {
    // 每一项都是一个函数
    // 参数：你可以定义两个参数：
      // 第一个参数是必须的，表示当前的state，
      // 第二个参数是可选的，表示载荷(在执行函数时要传入的数据)
    // addBook (state, bookName) {
    //   console.log(state, bookName)
    //   state.books.push(bookName)
    // },
    
    addN(state, n) {
      state.num += n
    },
    add10 (state) {
      state.num +=10
    }
  },

  // 发ajax请求，从后端获取数据，再来去修改state中的数据
  actions: {
    // getBooks (context) {
    //   发ajax请求.then(res => {
    //     // 调用 mutations
    //     context.commit()
    //   })
    // }
    getBooks (context, params) {
      console.log('getbooks的查询参数是', params)
      axios({
        url: 'https://www.fastmock.site/mock/37d3b9f13a48d528a9339fbed1b81bd5/book/api/books',
        method: 'GET'
      }).then(res => {
        console.log(res)
        context.commit({
          type:'addBook',
          name: res.data.data[0].bookname,
          price: res.data.data[0].price

        })
        // console.log(context)
      })
    }
  },
  modules: {
    modBook: {
      // 这个为true，则在使用mutations时，就必须要加上模块名
      namespaced: true, 
      state: {
        books: [
          {name: 'js技术内幕(1)', price: 100}, 
          {name: 'js技术内幕(2)', price: 80}, 
          {name: 'js技术内幕(3)', price: 50}
        ],
      },
      mutations: {
        add (state) {
          console.log("modBook add", state)
        },
        addBook (state, {name, price}) {
          // console.log(state, bookObj)
          state.books.push({name, price})
          // state.books.push(bookObj)
        },
      }
    },
    modAddress: {
      namespaced: true, 
      state: { list: [] },
      mutations: {
        add (state) {
          console.log("address add", state)
        }
      },
      getters: {},
      actions: {},
      // modules
    }
  }
})

<template>
  <div id="app">
    <!-- 路由出口
    keep-alive:是vue内置的组件。它的功能是 对 包在它里面的组件时行 缓存
    缓存：在切换路由时，不做删除。

    对于不同路由组件，可以有针对性进行缓存。
    -->

    <!-- 如果当前的路由对象上有 isKeepAlive 这个标识就缓存，否则就不缓存 -->
    <keep-alive>
      <router-view v-if="$route.meta.isKeepAlive"/>
    </keep-alive>

    <router-view v-if="!$route.meta.isKeepAlive"/>
  </div>
</template>
<script>
import { instance2 } from '@/utils/request.js'
// import request from '@/utils/request.js'
export default {
  methods: {
    async hTestAxios2 () {
      try {
        const res = await instance2({
          method: 'GET',
          url: '/app/v1_0/user/channels'
        })
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    hTestAxios1 () {
      instance2({
        method: 'GET',
        url: '/app/v1_0/user/channels'
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

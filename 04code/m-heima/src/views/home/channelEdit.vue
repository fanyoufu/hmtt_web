<template>
  <div class="channel-edit">
    <!-- 当前登陆用户已经订阅的频道 -->
    <div class="channel">
      <van-cell title="我的频道" :border="false">
        <van-button
        class="editBtn"
        size="mini"
        @click="editing=!editing">{{editing ? '取消' : '编辑'}}</van-button>
      </van-cell>
      <van-grid>
        <!--
          如果是下标与curIndex相同，就有一个类，名为cur；
          :class="布尔值 ？ 类名1 ：类名2"
          :class="{类名1：布尔值1， 类名2：布尔值2 .......}"
           - 如果 布尔值1 为true,就有 类名1
        -->
        <van-grid-item
          v-for="(channel,idx) in channels"
          :key="channel.id"
          @click="hClickMyChannel(idx)"
          :class="{cur:idx===curIndex}"
          >
          <span>{{channel.name}}</span>
          <!-- 在编辑状态，且不是推荐频道 才会有关闭按钮 -->
          <van-icon v-show="editing && idx !=0" name="cross" class="btn"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
     <!-- 当前登陆用户没有订阅的频道 -->
    <div class="channel">
      <van-cell title="可选频道" :border="false"></van-cell>
      <van-grid>
        <van-grid-item
        v-for="channel in recommendChannels"
        :key="channel.id"
        @click="hClickRecommendChannels(channel)">
          <span>{{channel.name}}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels, addChannel, delChannel } from '@/api/channel.js'
export default {
  name: 'ChannelEdit',
  // props: 用来接收父传子，有两种格式：
  // 1. props: ['属性名1', '属性名2']
  // 2. props: {
  //   属性名: {
  //     type: ,
  //     default: , // 默认值
  //     required:, // 是否必须要填入
  //     validator: function (value){ // 对传入的属性进行自定义的检验，如果这个函数返回true，表示通过；否则，表法不通过
  //               value会自动接收当前传入的值
  //     }
  //   }
  // }
  props: {
    a: {
      type: Number,
      required: false,
      default: 100,
      validator: function (value) {
        console.log('a', value)
        if (value > 50) {
          return false
        } else {
          return true
        }
      }
    },
    // 当前激活状态的频道的下标
    curIndex: {
      type: Number
    },
    channels: {
      type: Array
    }
  },
  data () {
    return {
      editing: false, // 是否正在编辑
      allChannels: []
    }
  },
  computed: {
    // 根据已有数据生成新的数据 ---- 计算属性
    recommendChannels () {
      console.log('计算属性执行了....')
      // 已有频道： [{id:1,name:'a'}]
      // 所有频道： [{id:1,name:'a'},{id:2,name:'b'},{id:3,name:'c'}]

      // 推荐频道： 所有频道 - 已有频道  ===> [{id:2,name:'b'},{id:3,name:'c'}]

      // 对所有频道的数据进行过滤：
      //   保存数据的条件是：当前这个频道没有在已有频道中出现
      const arr = this.allChannels.filter(channel => {
        const idx = this.channels.findIndex(item => item.id === channel.id)
        if (idx === -1) {
          return true
        } else {
          return false
        }
      })
      return arr
      // return this.allChannels - this.channels
    }
    // recommendChannels () {
    //   return this.allChannels.filter(channel => this.channels.findIndex(item => item.id === channel.id) === -1)
    // }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const res = await getAllChannels()
      this.allChannels = res.data.data.channels
    },
    // 用户在我的频道上的点击了某一项
    hClickMyChannel (idx) {
      if (this.editing) {
        this.doDeleteChannel(idx)
      } else {
        // 向父组件抛出事件
        this.$emit('update-cur-index', idx)
      }
    },
    async doDeleteChannel (idx) {
      // 现在是编辑，要做删除功能
      try {
        const channelId = this.channels[idx].id
        const res = await delChannel(channelId)
        // 2. 把当前频道从已订阅的频道列表中删除
        console.log(res)
        this.channels.splice(idx, 1)
        // 1) 由于修改了channels会导致计算属性重新计算： 让可选频道中会少1项
        // 2) channels是从父组件传入的属性，由于它是一个引用数据类型（数组），在子组件中添加
        //    了一个元素，就相当于在父组件中channels也多了一个元素
        // 3. 提示用户
        this.$toast.success('删除频道成功')

        // 如果删除的频道在当前频道之前，则要改下下标
        if (idx < this.curIndex) {
          // 通知父组件，改下下标:在原基础上-1
          this.$emit('fixed-cur-index', this.curIndex - 1)
        }
      } catch (err) {
        this.$toast.fail('删除频道失败')
      }
    },
    // 用户在 推荐频道 上点击了某一项, 做订阅频道
    async hClickRecommendChannels (curChannel) {
      try {
        // channels: [ {id: 频道的id, seq: 顺序序号 }， {id: 频道的id, seq: 顺序序号}]
        // const channels = 之前订阅频道 + 当前被点击那个频道
        // 要注意：id为0那个频道（推荐频道）不能向后传。
        const channels = [...this.channels, curChannel].map((item, idx) => {
          return {
            id: item.id,
            seq: idx
          }
        }).filter(item => item.id !== 0)

        // 1. 发请求
        await addChannel(channels)
        // 2. 把当前频道添加到 已订阅的频道列表中
        this.channels.push(curChannel)
        // 1) 由于修改了channels会导致计算属性重新计算： 让可选频道中会少1项
        // 2) channels是从父组件传入的属性，由于它是一个引用数据类型（数组），在子组件中添加
        //    了一个元素，就相当于在父组件中channels也多了一个元素
        // 3. 提示用户
        this.$toast.success('订阅频道成功')
      } catch (err) {
        this.$toast.fail('订阅频道失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel{
  padding:15px;
  font-size:14px;
}
.btn {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 24px;
}
.cur{
  color: red;
  font-weight: bold;
}
.editBtn {
    color: rgb(229, 97, 91) !important;
    margin-right:10px;
    padding:0 10px;
    border-color: rgb(229, 97, 91);
  }
</style>

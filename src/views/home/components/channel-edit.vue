<template>
  <!-- 弹出层关闭触发input事件 -->
  <!-- 父子通讯 往返传值 -->
  <van-popup
    :style="{ height: '95%' }"
    :value="value"
    @input="$emit('input',$event)"
    position="bottom"
    round
  >
    <van-cell icon="cross" @click="$emit('input', false)"/>
    <van-cell title="我的频道" label="点击进入频道">
      <van-button
        round
        type="danger"
        size="mini"
        @click="isEdit=!isEdit"
      >{{isEdit?'完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid>
      <van-grid-item
        v-for="(channel,index) in myChannels"
        :key="channel.id"
        @click="onMychannelItemClick(index,channel.id)"
      >
        <span class="text" :class="{active:index===activeIndex}">{{channel.name}}</span>
        <van-icon

          class="close-icon"
          name="close"
          v-show="isEdit"
        />
      </van-grid-item>
    </van-grid>

    <van-cell title="推荐频道" label="点击添加频道" />
    <van-grid>
      <van-grid-item
        v-for="channel in recommendChannels"
        :key="channel.id"
        :text="channel.name"
        @click="onAddChannel(channel)"
      >
        <div class="info">
          <span class="text">{{channel.name}}</span>
        </div>
      </van-grid-item>
    </van-grid>
  </van-popup>
</template>

<script>
import { getAllChannels, deleteUserChannel, addUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
export default {
  name: 'channelEdit',
  // 接受父组件传递的数据
  props: {
    // default默认值
    value: {
      type: Boolean,
      default: false
    },
    myChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  // 过滤属性使用计算属性
  computed: {
    ...mapState(['user']),
    // 推荐频道列表是筛选出来的
    recommendChannels () {
      // 根据频道ID从所有频道列表中进行过滤
      // map返回新数组 依次返回每个处理过的值
      const ids = this.myChannels.map(channel => channel.id)
      const ret = this.allChannels.filter(channel => {
        return !ids.includes(channel.id)
      })
      return ret
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      // 如果登录了 请求保存后端数据库
      if (this.user) {
        // 参数 频道id,新增元素序号 就是长度
        await addUserChannel(channel.id, this.myChannels.length)
      } else {
        // 如果没有登陆保存到本地存储
        window.localStorage.setItem('channels', JSON.stringify(this.myChannels))
      }
    },
    async onMychannelItemClick (channelIndex, channelId) {
      // 编辑状态执行删除操作
      // isEdit  true 是编辑状态
      if (this.isEdit) {
        this.myChannels.splice(channelIndex, 1)
        // 如果登陆请求保存后端 没有登陆保存到本地
        if (this.user) {
          await deleteUserChannel(channelId)
        } else {
          // 没有登陆保存到本地
          window.localStorage.setItem('channels', JSON.stringify(this.myChannels))
        }
      } else {
      // 非编辑状态 点击切换进别的频道
        this.$emit('update-active', channelIndex)
        // 关闭弹窗
        this.$emit('input', false)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .close-icon{
    position: absolute;
    right:0;
    top:0;
  }
  .active{
    color:red;
  }
</style>

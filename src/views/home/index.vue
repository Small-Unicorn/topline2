<template>
  <div>
    <!-- <van-nav-bar title="首页" /> -->
    <van-nav-bar fixed>
      <van-button
        color="#5babfb"
        size="small"
        class="search-btn"
        slot="title"
        icon="search"
        type="primary"
        round
        @click="$router.push({ name: 'search' })"
      >搜索</van-button>
    </van-nav-bar>
     <!-- 整个标题导航栏 -->
      <van-tabs v-model="active">
        <!-- 频道编辑按钮 -->
        <div slot="nav-right" class="wap-nav" @click="isChannelEditShow=true">
          <van-icon name="wap-nav" size="24"></van-icon>
        </div>
        <!-- 每个频道标签 -->
        <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">

          <van-pull-refresh v-model="channel.isLoading" @refresh="onRefresh" >
            <!-- 频道里的列表内容 -->
            <van-list
              v-model="channel.loading"
              :finished="channel.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
             <van-cell
                v-for="article in channel.articles"
                :key="article.art_id.toString()"
                :title="article.title"
                @click="$router.push({name:'article',params:{id:article.art_id.toString()}})"
                >
                <div slot="title">
                 <van-grid :border="false" :column-num="3">
                   <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                     <van-image height="80" :src="img" />
                   </van-grid-item>
                 </van-grid>
                 <div class="article-info">
                    <div class="meta">
                      <span>{{ article.aut_name }}</span>
                      <span>{{ article.comm_count }}评论</span>
                      <span>{{ article.pubdate | relativeTime }}</span>
                    </div>
                    <van-icon name="close" @click="onClose(article)" />
                  </div>
                </div>
              </van-cell>

            </van-list>
          </van-pull-refresh>
        </van-tab>
    </van-tabs>
    <!-- 举报弹窗 -->
    <van-dialog
      v-model="isReportShow"
      :show-cancel-button="false"
      :showConfirmButton="false"
      closeOnClickOverlay
    >
      <van-cell-group v-if="!isRubbishShow">
        <van-cell title="反馈垃圾内容" icon="location-o" @click="isRubbishShow=true" is-link/>
        <van-cell title="拉黑作者" icon="location-o" @click="blackLists" />
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="isRubbishShow=false" />
        <van-cell
          :title="item.title" icon="location-o"
          v-for="item in reportTypes" :key="item.type"
          @click="onReportArticle(item.type)"
        />
      </van-cell-group>
    </van-dialog>
    <!-- 编辑频道组件 -->
    <!-- 控制组件的显示 -->
    <channel-edit v-model="isChannelEditShow"
     :my-channels="channels" :active-index="active"
     @update-active="active=$event"
    >

    </channel-edit>
    <!-- 给子组件传递数据value -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import { getArticles, reportArticle } from '@/api/article'
import { addBlackLists } from '@/api/user'
import channelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  components: {
    // 注册
    channelEdit
  },
  data () {
    return {
      active: 0,
      // list: [],
      // loading: false,
      // finished: false,
      // isLoading: false,
      channels: [],
      isReportShow: false, // 举报弹窗的显示
      isRubbishShow: false, // 反馈垃圾内容
      currentArticle: null,
      reportTypes: [
        { title: '标题夸张', type: 1 },
        { title: '低俗色情', type: 2 },
        { title: '错别字多', type: 3 },
        { title: '旧闻重复', type: 4 },
        { title: '广告软文', type: 5 },
        { title: '内容不实', type: 6 },
        { title: '涉嫌违法犯罪', type: 7 },
        { title: '侵权', type: 8 },
        { title: '其他问题', type: 0 }
      ],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user']),
    currentChannel () {
      return this.channels[this.active]
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      const { data } = await getUserChannels()
      data.data.channels.forEach(channel => {
        channel.articles = [] // 存每个频道各自的文章列表
        channel.finished = false // 当前频道是否加载完毕的状态  没有更多了
        channel.loading = false // 当前频道是否上拉加载完毕的状态 上边的圈
        channel.isLoading = false // 存储频道的下拉刷新的 loading 状态
        channel.timestamp = null // 存储当前频道加载下一页数据时间戳的标志(页码)
      })
      this.channels = data.data.channels
    },
    async onLoad () {
      const { data } = await getArticles({
        channelId: this.currentChannel.id,
        timestamp: this.currentChannel.timestamp || Date.now(),
        withTop: 1
      })
      // 将获取到的文章列表 添加到当前频道中
      this.currentChannel.articles.push(...data.data.results)
      if (data.data.pre_timestamp) {
        // 有文章列表数据
        this.currentChannel.timestamp = data.data.pre_timestamp
      } else {
        // 无数据 没有更多了
        this.currentChannel.finished = true
      }

      // 加载完loading关闭
      this.currentChannel.loading = false

      // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.currentChannel.articles.push(this.currentChannel.articles.length + 1)
      //   }
      //   // 加载状态结束
      //   this.currentChannel.loading = false

      //   // 数据全部加载完成
      //   if (this.currentChannel.articles.length >= 40) {
      //     this.currentChannel.finished = true
      //   }
      // }, 500)
    },
    // 下拉刷新加在前边(顶部)
    async onRefresh () {
      const { data } = await getArticles({
        channelId: this.currentChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })
      // 下拉刷新 每次加载数据放到文章顶部
      this.currentChannel.articles.unshift(...data.data.results)
      // 数据加载完毕 下拉刷新的圈圈关闭
      this.currentChannel.isLoading = false
      // this.currentChannel.loading = false
      this.$toast('刷新成功')
      // setTimeout(() => {
      //   this.$toast('刷新成功')
      //   this.currentChannel.isLoading = false
      // }, 500)
    },
    onClose (article) {
      this.isReportShow = true
      this.currentArticle = article
    },
    async blackLists () {
      const authId = this.currentArticle.aut_id
      const { data } = await addBlackLists(authId)
      console.log(data)
      this.channels.forEach(channel => {
        const articles = channel.articles
        for (let i = 0; i < articles.length; i++) {
          const article = articles[i]
          if (article.auth_id === authId) {
            articles.splice(i, 1)
            i--
          }
        }
      })
      this.$toast('拉黑成功，将减少此类内容推送')
      this.isReportShow = false
    },
    async onReportArticle (type) {
      try {
        await reportArticle({
          articleId: this.currentArticle.art_id.toString(),
          type
        })

        this.$toast('举报成功')
      } catch (err) {
        console.log(err)
        this.$toast('已经反馈过了')
      }
      this.isReportShow = false
    }
  }
}
</script>

<style lang="less" scoped>
 .van-tabs {
  height: 500px;
}

.van-tabs /deep/ .van-tabs__wrap--scrollable {
  position: fixed;
  top: 46px;
  left: 0;
  right: 16px;
  z-index: 2;
}

.van-tabs /deep/ .van-tabs__content {
  margin-top: 90px;
}

.article-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .meta span {
    margin-right: 10px;
  }
}

.wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  opacity: 0.8;
}

.search-btn {
  width: 100%;
  .van-icon {
    color: #fff;
  }
}
</style>

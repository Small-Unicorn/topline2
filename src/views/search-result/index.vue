<template>
  <div>
    <van-nav-bar
      left-arrow
      :title="$route.params.q + '的搜索结果'"
      @click-left="$router.back()"
    />
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="article in articles"
        :key="article.art_id.toString()"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearch } from '@/api/search'

export default {
  name: 'SearchResult',
  data () {
    return {
      articles: [],
      loading: false,
      finished: false,
      page: 1
    }
  },

  methods: {
    async onLoad () {
      // 异步更新数据
      const { data } = await getSearch({
        page: this.page,
        perPage: 10,
        q: this.$route.params.q
      })
      if (!data.data.results.length) {
        this.finished = true
      } else {
        this.articles.push(...data.data.results)
        this.page++
      }
      this.loading = false
      console.log(data)
    }
  }
}
</script>
<style lang="less">
  .van-list{
    margin-top:46px;
  }
</style>

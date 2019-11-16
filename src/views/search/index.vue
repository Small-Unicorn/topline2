<template>
  <div>
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="onCancel"
      />
    </form>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group v-if="suggestions.length">
      <van-cell
        icon="search"
        v-for="item in suggestions"
        :key="item"
        @click="onSearch(item)"
      >
        <div slot="title" v-html="highLight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <div v-show="isDeleteShow">
          <span style="margin-right: 10px;" @click="searchHistories = []">全部删除</span>
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon
          v-show="!isDeleteShow"
          slot="right-icon"
          name="delete"
          style="line-height: inherit;"
          @click="isDeleteShow = true"
        />
      </van-cell>
      <van-cell :title="item" v-for="(item, index) in searchHistories" :key="item">
        <van-icon
          v-show="isDeleteShow"
          slot="right-icon"
          name="close"
          style="line-height: inherit;"
          @click="searchHistories.splice(index, 1)"
        />
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      suggestions: [],
      searchHistories: JSON.parse(window.localStorage.getItem('search-histories')) || [],
      isDeleteShow: false
    }
  },

  watch: {
    searchText: debounce(async function (newVal) {
      if (!newVal.trim().length) {
        this.suggestions = []
        return
      }
      const { data } = await getSuggestion(newVal)
      this.suggestions = data.data.options
    }, 500),

    searchHistories () {
      this.saveSearchHistories()
    }
  },

  methods: {
    onSearch (q) {
      if (!q.trim().length) {
        return
      }

      // 添加搜索历史记录
      this.addSearchHistory(q)

      // 跳转到搜索结果页面
      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })
    },

    onCancel () {
      this.$router.back()
    },

    highLight (str) {
      const keyword = this.searchText
      return str.toLowerCase().split(keyword).join(`<span style="color: red;">${keyword}</span>`)
    },

    addSearchHistory (q) {
      const { searchHistories } = this

      const index = searchHistories.findIndex(item => item === q)

      if (index !== -1) {
        searchHistories.splice(index, 1)
      }

      this.searchHistories.unshift(q)

      // 注意：由于跳转路由会销毁当前组件，watch 之类的不会再被触发
      // 所以在这里手动的存储历史记录
      this.saveSearchHistories()
    },

    saveSearchHistories () {
      // 存 要用字符串
      window.localStorage.setItem('search-histories', JSON.stringify(this.searchHistories))
    }
  }
}
</script>

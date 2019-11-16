<template>
  <div>
    <van-nav-bar
      title="个人信息"
      left-text="返回"
      left-arrow
      right-text="保存"
      @click-left="$router.back()"
      @click-right="onSave"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click="onShowFileSelect">
        <van-image
          round
          width="30"
          height="30"
          :src="userProfile.photo"
        />
      </van-cell>
      <van-cell title="昵称" :value="userProfile.name" is-link />
      <van-cell
        title="性别"
        :value="userProfile.gender === 0 ? '男' : '女'"
        is-link
        @click="isGenderShow = true"
      />
      <van-cell title="生日" :value="userProfile.birthday" is-link />
    </van-cell-group>
    <input hidden type="file" ref="file" @change="onFileChange">
    <!-- 性别的上拉菜单 -->
    <van-action-sheet
      v-model="isGenderShow"
      :actions="genderActions"
      @select="onGenderSelect"
    />
  </div>
</template>

<script>
import {
  getUserProfile,
  updateUserPhoto,
  updateUserBaseInfo
} from '@/api/user'

export default {
  name: 'UserEdit',
  data () {
    return {
      userProfile: {},
      isGenderShow: false,
      genderActions: [
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ]
    }
  },

  computed: {
    file () {
      return this.$refs['file']
    }
  },

  created () {
    this.loadUserProfile()
  },

  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.userProfile = data.data
    },

    async onSave () {
      try {
        if (!this.userProfile.photo.startsWith('http')) {
          // 更新用户头像
          await updateUserPhoto(this.file.files[0])
        }

        // 更新其它基本信息(name、gender、birthday)
        const { name, gender, birthday } = this.userProfile
        await updateUserBaseInfo({
          name,
          gender,
          birthday
        })

        this.$toast.success('保存成功')
      } catch (err) {
        console.log(err)
        console.dir(err)
        if (err.response && err.response.status === 409) {
          return this.$toast.fail('保存失败，用户名已存在')
        }
        this.$toast.fail('保存失败')
      }
    },

    onShowFileSelect () {
      this.file.click()
    },

    onFileChange (e) {
      this.getBase64(this.file.files[0], (err, data) => {
        if (err) {
          console.log('转换失败')
        }
        this.userProfile.photo = data
      })
    },

    /**
     * 将一个文件对象转为 base64 字符串
     * 网页中的 img 图片也可以使用 base64 编码的字符串显示图片
     */
    getBase64 (file, callback) {
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        console.log(reader.result)
        callback(null, reader.result)
      }
      reader.onerror = function (error) {
        callback(error)
      }
    },

    onGenderSelect (item) {
      this.userProfile.gender = item.value
      this.isGenderShow = false
    }
  }
}
</script>
<style lang="less">

</style>

module.exports = {
  plugins: {
    autoprefixer: {},
    // px转rem的配置
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  pages: {
    index: {
      entry: 'src/main.js', // 必須パラメータ
      title: 'よみたい焼き',
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'よみたい焼き リモコン式',
        copyright: 'Copyright © 2020 Kidsplates.'
      }
    }
  }
}
const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin")

function resolve(dir) {
  return path.join(__dirname, '.', dir);
}

var isProd = process.env.NODE_ENV === 'production';
const cdn = {
  css: [
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/ant-design-vue/1.7.8/antd.min.css',
  ],
  js: [
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/moment.js/2.29.1/moment.min.js',
    'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/moment.js/2.29.1/locale/zh-cn.min.js',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/marked/2.1.3/marked.min.js',
    'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/echarts/5.3.0/echarts.min.js',
    'https://cdn.jsdelivr.net/npm/wangeditor@4.7.8/dist/wangEditor.min.js',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.14/vue.min.js',
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue-router/3.5.3/vue-router.min.js',
    'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/vuex/3.6.2/vuex.min.js',
    'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/ant-design-vue/1.7.8/antd.min.js',
  ],
  externals: {
    moment: 'moment',
    marked: 'marked',
    echarts: 'echarts',
    wangeditor: 'wangEditor',
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'vuex':'Vuex',
    'ant-design-vue': 'antd',
  }
};

module.exports = {
  runtimeCompiler: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // 这个是加上自己的路径,不能使用(如下:alias)中配置的别名路径
        path.resolve(__dirname, './src/style/index.less')
      ]
    }
  },
  configureWebpack: {
    externals: isProd ? cdn.externals : [],
    plugins: [
      new CompressionPlugin({
        test:/\.js$|\.html$|.\css/, //匹配文件名
        threshold: 10240,//对超过10k的数据压缩
        deleteOriginalAssets: false //不删除源文件
      })
    ]
  },
  chainWebpack: config => {
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = cdn;
        args[0].title = process.env.VUE_APP_TITLE;
        return args;
      });  
    }
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end();
    
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons')) //处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'sp-blog-[name]'
      });
  }
};

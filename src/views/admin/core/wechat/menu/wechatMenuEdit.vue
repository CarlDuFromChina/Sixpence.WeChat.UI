<template>
  <a-form-model ref="form" :model="data">
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-model-item label="菜单名称">
          <a-input v-model="data.name"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="菜单类型">
          <a-select v-model="data.type" placeholder="请选择菜单类型" allowClear>
            <a-select-option v-for="(item, index) in menus" :key="index" :value="item.value">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-model-item label="Key" :required="data.type === 'click'">
          <a-input v-model="data.key" placeholder="菜单 KEY 值，用于消息接口推送"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" v-show="data.type === 'miniprogram'">
        <a-form-model-item label="appid" :required="data.type === 'miniprogram'">
          <a-input v-model="data.appid" placeholder="小程序的appid（仅认证公众号可配置）"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" v-show="data.type === 'miniprogram'">
        <a-form-model-item label="pagepath" :required="data.type === 'miniprogram'">
          <a-input v-model="data.pagepath" placeholder="小程序的页面路径"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :span="24" v-show="showUrl(data.type)">
        <a-form-model-item label="菜单地址">
          <a-input v-model="data.url" :placeholder="handleDisplayUrlPlaceHolder(data.type)"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :span="24" v-show="data.type === 'text'">
        <a-form-model-item label="消息内容">
          <a-input v-model="data.value" type="textarea" />
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script>
export default {
  name: 'sysmenu-edit',
  props: ['data'],
  data() {
    return {
      menus: [
        { name: '文本消息', value: 'text' },
        { name: '跳转网页', value: 'view' },
        { name: '图片', value: 'img' },
        { name: '视频', value: 'video' },
        { name: '音频', value: 'voice' },
        { name: '小程序', value: 'miniprogram' },
        { name: '点击事件', value: 'click' },
        { name: '扫码推事件', value: 'scancode_push' },
        { name: '扫码推事件且弹出“消息接收中”', value: 'scancode_waitmsg' },
        { name: '弹出系统拍照发图', value: 'pic_sysphoto' },
        { name: '弹出拍照或者相册发图', value: 'pic_photo_or_album' },
        { name: '弹出微信相册发图器', value: 'pic_weixin' },
        { name: '弹出地理位置选择器', value: 'location_select' },
        { name: '下发消息（除文本消息）', value: 'media_id' },
        { name: '图文消息', value: 'article_id' },
        { name: '发布后的图文消息', value: 'article_view_limited' }, 
      ],
    };
  },
  methods: {
    async saveData() {
      this.$refs.form.validate(resp => {
        if (resp) {
          this.$emit('save', this.data);
          this.$message.success('更新成功');
          this.clear();
        }
      })
    },
    handleDisplayUrlPlaceHolder(type) {
      switch (type) {
        case 'view':
          return '微信客户端将会打开开发者在按钮中填写的网页URL';
        case 'miniprogram':
          return '不支持小程序的老版本客户端将打开本url';
        default:
          return '';
      }
    },
    showUrl(type) {
      return ['view', 'miniprogram'].findIndex(e => e === type) !== -1;
    }
  }
};
</script>

export default {
  path: '/admin/wechatMenu',
  name: 'wechatMenu',
  component: () => import('./wechatMenuList'),
  meta: { title: '微信菜单' }
}
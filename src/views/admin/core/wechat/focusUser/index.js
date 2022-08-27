export default [
  {
    path: '/admin/focusUser',
    name: 'focusUser',
    component: () => import('./focusUserList'),
    meta: { title: '关注用户' }
  }
];

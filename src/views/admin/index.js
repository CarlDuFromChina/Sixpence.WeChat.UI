import core from './core';
import myAdmin from './myAdmin';
import result from './result';

export default [
  {
    path: '/admin',
    name: 'admin',
    component: myAdmin,
    children: [].concat(core, result),
    meta: { auth: true } // 需要检验
  }
];

export default {
  path: 'nutrition',
  component: r => require.ensure([], () => r(require('./pages/layout')), 'nutrition/index'),
  redirect: 'nutrition/index',
  children: [
    {
      path: 'index',
      name: 'nutrition',
      component: r => require.ensure([], () => r(require('./pages/index')), 'nutrition/index/')
    }
  ]
}

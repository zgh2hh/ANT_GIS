export default {
  path: 'index',
  component: r => require.ensure([], () => r(require('./pages/layout')), 'index/main'),
  redirect: 'index/main',
  children: [
    {
      path: 'main',
      name: 'main',
      component: r => require.ensure([], () => r(require('./pages/index')), 'index/main/')
    }
  ]
}

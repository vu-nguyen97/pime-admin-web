/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const configRouter = {
  path: '/configuration',
  component: Layout,
  redirect: '/configuration/complex-table',
  name: 'Configurations',
  meta: {
    title: 'Configurations',
    icon: 'setting'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamic-table/index'),
      name: 'DynamicTable',
      meta: { title: 'Dynamic Table' }
    },
    {
      path: 'bfc-reward',
      component: () => import('@/views/configurations/bfc-reward'),
      name: 'BFCReward',
      meta: { title: 'BFC Reward' }
    },
    {
      path: 'upgrade-character',
      component: () => import('@/views/configurations/upgrade-character'),
      name: 'upgradeCharacter',
      meta: { title: 'Upgrade Character' }
    },
    {
      path: 'stats',
      component: () => import('@/views/configurations/stats'),
      name: 'stats',
      meta: { title: 'Stats' }
    },
    {
      path: 'versions',
      component: () => import('@/views/configurations/versions'),
      name: 'Versions',
      meta: { title: 'Versions' }
    }
  ]
}
export default configRouter

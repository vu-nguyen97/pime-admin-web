/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const pokerRouter = {
  path: '/games/poker',
  component: Layout,
  // redirect: '/games/complex-table',
  name: 'Game - Poker',
  meta: {
    title: 'Game - Poker',
    icon: 'setting'
  },
  children: [
    {
      path: 'blind-levels',
      component: () => import('@/views/games/poker/blind-levels'),
      name: 'Blind Levels',
      meta: { title: 'Blind Levels' }
    },
    {
      path: 'upgrade-character',
      component: () => import('@/views/configurations/upgrade-character'),
      name: 'upgradeCharacter',
      meta: { title: 'Upgrade Character' }
    },
  ]
}
export default pokerRouter

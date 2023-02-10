/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const assetBundlesRoute = {
  path: '/asset-bundles',
  component: Layout,
  redirect: '/asset-bundles/upload',
  name: 'Asset Bundles',
  meta: {
    title: 'Asset Bundles',
    icon: 'setting'
  },
  children: [
    {
      path: 'upload',
      component: () => import('@/views/asset-bundles/upload-excel'),
      name: 'AssetBundles',
      meta: { title: 'Asset Bundles' }
    }
  ]
}
export default assetBundlesRoute

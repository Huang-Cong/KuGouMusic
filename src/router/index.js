import Vue from 'vue'
import Router from 'vue-router'

import search from '../components/content/search.vue'
Vue.use(Router)

Router.prototype.goBack = () => {
  this.isBack = true
  window.history.go(-1)
}

const router = new Router({
  routes: [
    {
      path: '/search',
      name: 'search',
      component: search
    },
    {
      path: '/newSongs',
      component: require('../components/content/NewSongs'),
      alias: '/'
    },
    {
      path: '/rank',
      component: require('../components/content/Rank')
    },
    {
      path: '/plist',
      component: require('../components/content/Plist')
    },
    {
      path: '/singer',
      component: require('../components/content/Singer')
    },
    {
      path: '/rank/info/:id',
      component: require('../components/content/RankInfo')
    },
    {
      path: '/plist/info/:id',
      component: require('../components/content/PlistInfo')
    },
    {
      path: '/singer/list/:id',
      component: require('../components/content/SingerList')
    }, {
      path: '/singer/info/:id',
      component: require('../components/content/SingerInfo')
    },
    {
      path: '*', redirect: '/'
    }
  ]
})

export default router

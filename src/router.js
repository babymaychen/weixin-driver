import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
const Personal = () => import('./views/Personal.vue')
const IDCard = () => import('./views/IDCard.vue')
const IDCardForm = () => import('./views/IDCardForm.vue')
const Chat = () => import('./views/Chat.vue')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/personal',
      name: 'personal',
      component: Personal,
    },
    {
      path: '/idcard',
      name: 'idcard',
      component: IDCard,
    },
    {
      path: '/idcardForm',
      name: 'idcardForm',
      component: IDCardForm,
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
    },
  ]
})

import { createRouter, createWebHistory } from 'vue-router'
import LoginLayout from '@/views/layouts/LoginLayout.vue'
import HomeLayout from '@/views/layouts/HomeLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { useUserStore } from '@/stores/user.js'
import UserAccount from '@/views/UserAccount.vue'
import CreateAccount from '@/views/CreateAccount.vue'
import EditAccount from '@/views/EditAccount.vue'
import DompetKu from '@/views/DompetKu.vue'
import ChangePassword from '@/views/ChangePassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { layout: LoginLayout },
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      meta: { layout: HomeLayout },
      component: HomeView,
    },
    {
      path: '/user-account',
      name: 'user-account',
      meta: { layout: HomeLayout },
      component: UserAccount,
    },
    {
      path: '/create-account',
      name: 'create-account',
      meta: { layout: HomeLayout },
      component: CreateAccount,
    },
    {
      path: '/edit-account/:accountId',
      name: 'edit-account',
      meta: { layout: HomeLayout },
      component: EditAccount,
    },
    {
      path: '/dompetku',
      name: 'dompetku',
      meta: { layout: HomeLayout },
      component: DompetKu,
    },
    {
      path: '/changepassword',
      name: 'changepassword',
      meta: { layout: HomeLayout },
      component: ChangePassword,
    },
  ],
})

// Global route guard to check for token
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.name !== 'login' && !userStore.token) next({ name: 'login' })
  else if (to.name == 'login' && userStore.token) next({ name: 'home' })
  else next()
})

export default router

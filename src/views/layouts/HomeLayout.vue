<template>
  <v-responsive>
    <v-app id="app">
      <v-navigation-drawer v-model="drawer">
        <!-- sidebar -->
        <v-sheet class="pa-4 font-weight-bold" color="#ffc0cb">
          Dompet Kita
        </v-sheet>


        <v-divider></v-divider>

        <v-list>
          <RouterLink
            v-for="{ icon, text, route, click } in sidebarLinks"
            :key="route"
            :to="route"
            custom
          >
            <v-list-item
              :prepend-icon="icon"
              :title="text"
              link
              @click="click"
              v-if="click"
            ></v-list-item>
            <v-list-item :prepend-icon="icon" :title="text" link :to="route" v-else></v-list-item>
          </RouterLink>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-img class="" max-width="100" :src="logo"></v-img>

        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main id="main">
        <RouterView />
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup>
import { ref } from 'vue'
import logo from '@/assets/logo2.png'
import { mdiHome, mdiLogout, mdiAccount, mdiWallet, mdiKey } from '@mdi/js'
import { RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
// import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore()
console.log(userStore);
const router = useRouter()

const drawer = ref(null)

function logout() {
  userStore.logout()
  router.push({ name: 'login' })
}

const sidebarLinks = [
  { icon: mdiHome, text: 'Home', route: '/' },
  { icon: mdiLogout, text: 'Logout', route: '/login', click: logout },
  { icon: mdiAccount, text: 'Account', route: '/user-account' },
  { icon: mdiWallet, text: 'Dompetku', route: '/dompetku' },
  { icon: mdiKey, text: 'ChangePassword', route: '/changepassword' },
]
</script>

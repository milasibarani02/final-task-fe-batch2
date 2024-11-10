import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/plugins/api'

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref(localStorage.getItem('token') || null)
  const storedUser = ref(localStorage.getItem('user') || null)
  const account_id = ref(localStorage.getItem('account_id') || null)

  // getters
  const user = computed(() => {
    if (storedUser.value) {
      return JSON.parse(storedUser.value)
    }
    return null
  })

  const isAuthorized = computed(() => !!token.value)

  function storeToken(newToken) {
    localStorage.setItem('token', newToken)
    token.value = newToken
  }

    // fungsi untuk menyimpan data user dan account_id
    function storeUser(newUser) {
      if (newUser && typeof newUser === 'object') {
        const stringifiedUser = JSON.stringify(newUser)
        localStorage.setItem('user', stringifiedUser)
        storedUser.value = stringifiedUser
        // Menyimpan account_id secara terpisah
        localStorage.setItem('account_id', newUser.account_id)
        account_id.value = newUser.account_id
      } else {
        console.error('Invalid user data:', newUser)
      }
    }

  const login = async (credentials) => {
    try {
      // Memanggil API login
      console.log('Credentials:', credentials)
      const response = await api.post('/auth/login', credentials)
      console.log('Response dari API login:', response.data)

      // Jika berhasil, simpan token
      const newToken = response.data.data
      console.log('Respons dari API login:', response.data)
      if (!newToken) {
        console.error('Token tidak ditemukan di respons API.')
        throw new Error('Token tidak valid atau kosong.')
      }
      storeToken(newToken)
      console.log('Token berhasil disimpan:', newToken)

      console.log("Token digunakan:", `Bearer ${newToken}`)
      // Memanggil API account/my untuk mengambil data user
      const responseMy = await api.get('/account/my', {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },

      })
      const accountData = responseMy.data.data
      if (accountData && accountData.name && accountData.balance !== undefined) {
        storeUser(accountData)
      } else {
        console.error('Missing data: name or balance not found')
      }

      console.log('Account Data:', responseMy.data)
      if (responseMy.status === 200 && responseMy.data.data) {
        // Menyimpan data akun dan account_id
        const accountData = responseMy.data.data
        storeUser(accountData) // Menyimpan data pengguna ke store
        localStorage.setItem('account_id', accountData.account_id) // Menyimpan account_id ke localStorage
      } else {
        throw new Error('Data pengguna tidak ditemukan.')
      }

      //Jika berhasil, simpan data user
      // storeUser(responseMy.data.data)
    } catch (error) {
      console.error('Login error:', error)
      throw new Error('Failed to login. Please check your credentials and try again.')
    }
  }


  // const login = async (credentials) => {
  //   // call API and await
  //   const response = await api.post('/auth/login', credentials)

  //   // if success, store token, otherwise throw err
  //   storeToken(response.data.token)

  //   // call API account/my
  //   const storeToken = localStorage.getItem('token')

  //   const responseMy = await api.get('/account/my', {
  //     headers: {
  //       Authorization: `Bearer ${token.value}`,
  //     },
  //   })

  //   // if success, store user, otherwise throw err
  //   storeUser(responseMy.data.data)
  // }

  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Remove from store
    token.value = null
    storedUser.value = null
  }

  return {
    token,
    user,

    isAuthorized,
    storeToken,
    storeUser,

    login,
    logout,
  }
})

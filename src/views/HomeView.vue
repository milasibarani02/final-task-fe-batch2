<template>
  <v-container>
    <v-card class="pa-4" outlined>
      <v-card-title>Dashboard</v-card-title>
      <v-card-text>
        <p>Welcome, {{ loggedInAccount?.name || 'Guest' }}</p>
        <p>Your Balance: {{ loggedInAccount?.balance || 0 }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loggedInAccount = ref(null)

async function fetchLoggedInAccount() {
  try {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('token')

    if (!token) {
      console.error('No token found, user is not authenticated.')
      return
    }

    // Send request to fetch the logged-in user's account details
    const response = await axios.get('http://localhost:8080/account/my', {
      headers: {
        Authorization: `Bearer ${token}`, // Include token for authorization
      },
    })

    console.log('Fetched logged-in account:', response.data)

    // Check if the response contains the expected data structure
    if (response.data && response.data.data) {
      loggedInAccount.value = response.data.data
    } else {
      console.error('Invalid response structure:', response.data)
    }
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      if (error.response.status === 401) {
        console.error('Unauthorized: Token may be missing or invalid.')
        // You can also redirect to login here
      } else {
        console.error(`Error fetching logged-in account: ${error.response.status}`, error.response.data)
      }
    } else {
      // No response from the server
      console.error('Error fetching logged-in account:', error.message)
    }
  }
}

onMounted(async () => {
  await fetchLoggedInAccount()
})
</script>

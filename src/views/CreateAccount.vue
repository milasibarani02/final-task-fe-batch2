<template>
  <v-card>
    <v-card-title>Create Account</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="createAccount">
        <v-text-field v-model="name" label="Name" required></v-text-field>
        <v-text-field v-model="balance" label="Initial Balance" type="number" required></v-text-field>
        <v-btn color="#2E8B57" type="submit" class="mr-2">Create Account</v-btn>
        <v-btn color="#C6DE9B" @click="closeDialog" class="ml-2">Cancel</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// Declare the 'close' event using defineEmits
const emit = defineEmits(['close'])

const name = ref('')
const balance = ref(0)

async function createAccount() {
  try {
    // Convert balance to a number before sending the request
    const accountData = {
      name: name.value,
      balance: Number(balance.value),  // Ensure balance is a number
    }

    const response = await axios.post('http://localhost:8081/account/create', accountData)

    // Check if the response indicates success
    if (response.status === 200 || response.status === 201) {
      // SweetAlert success
      Swal.fire({
        icon: 'success',
        title: 'Account Created',
        text: 'Your account has been successfully created!',
        confirmButtonColor: '#2E8B57', // Customize button color
      })

      emit('close') // Emit the 'close' event to close the dialog
      emit('refresh')
    } else {
      throw new Error('Unexpected response status: ' + response.status)
    }

  } catch (error) {
    console.error('Error creating account:', error)
    // SweetAlert error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'There was an error creating the account. Please try again.',
      confirmButtonColor: '#FF4136', // Customize button color
    })
  }
}

// Define close function for the cancel button
function closeDialog() {
  emit('close')
}
</script>

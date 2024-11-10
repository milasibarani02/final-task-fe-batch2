<template>
  <v-card>
    <v-card-title>Edit Account</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="updateAccount">
        <v-text-field v-model="name" label="Name" required></v-text-field>
        <v-text-field v-model="balance" label="Balance" type="number" required></v-text-field>
        <v-btn color="#2E8B57" type="submit">Save Changes</v-btn>
        <v-btn color="#C6DE9B" style="margin-left: 1%;" @click="$emit('close')">Cancel</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const props = defineProps(['account'])
const emit = defineEmits(['close', 'refresh'])
const name = ref(props.account?.name || '')
const balance = ref(props.account?.balance || 0)

watch(() => props.account, (newAccount) => {
  name.value = newAccount.name
  balance.value = newAccount.balance
})

async function updateAccount() {
  if (!props.account?.account_id) {
    console.error("Account ID is undefined, cannot update account.")
    return
  }

  try {
    const updatedAccount = {
      name: name.value,
      balance: Number(balance.value) // Explicitly convert balance to a number
    }

    const response = await axios.patch(`http://localhost:8080/account/update/${props.account.account_id}`, updatedAccount)

    if (response.status === 200) {
      // SweetAlert success
      Swal.fire({
        icon: 'success',
        title: 'Account Updated',
        text: 'Account has been successfully updated!',
        confirmButtonColor: '#ffc0cb', // Customize button color
      })

      emit('close') // Close the modal after update
      emit('refresh') // Emit refresh event to parent to fetch the updated accounts
    } else {
      throw new Error('Failed to update account')
    }
  } catch (error) {
    console.error('Error updating account:', error)
    // SweetAlert error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'There was an error updating the account. Please try again.',
      confirmButtonColor: '#ffc0cb', // Customize button color
    })
  }
}
</script>

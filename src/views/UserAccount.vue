<template>
  <v-container>
    <v-btn color="#ffc0cb" @click="createAccount" class="mb-4" fab>
      <v-icon>{{ mdiPlus }}</v-icon>
    </v-btn>

    <!-- Tabel Daftar Akun -->
    <v-data-table :items="accounts" :headers="headers" item-key="account_id">
      <template v-slot:item.actions="{ item }">
        <v-icon @click="editAccount(item)">{{ mdiPencil }}</v-icon>
        <v-icon @click="confirmDelete(item.account_id)" class="ml-2">{{ mdiDelete }}</v-icon>
      </template>
    </v-data-table>

    <!-- Dialogs -->
    <v-dialog v-model="showCreate" max-width="500">
      <CreateAccount @close="showCreate = false" @refresh="fetchAccounts" />
    </v-dialog>
    <v-dialog v-model="showEdit" max-width="500">
      <EditAccount :account="selectedAccount" @close="showEdit = false" @refresh="fetchAccounts" />
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CreateAccount from '@/views/CreateAccount.vue'
import EditAccount from '@/views/EditAccount.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { mdiPlus, mdiPencil, mdiDelete } from '@mdi/js'

const accounts = ref([]) // Declare once at the top level
const showCreate = ref(false)
const showEdit = ref(false)
const selectedAccount = ref(null) // Store the selected account for editing
const headers = ref([  // Header untuk tabel
  { text: 'Account ID', align: 'start', key: 'account_id' },
  { text: 'Name', key: 'name' },
  { text: 'Balance', key: 'balance' },
  { text: 'Actions', key: 'actions', sortable: false },
])

async function fetchAccounts() {
  try {
    const response = await axios.get('http://localhost:8080/account/list');
    if (response.data && response.data.data) {
      accounts.value = response.data.data; // Update the account list
    } else {
      console.error('Invalid response structure:', response.data);
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
}

function editAccount(account) {
  selectedAccount.value = account
  showEdit.value = true // Show the edit dialog
}

function confirmDelete(accountId) {
  // Show a SweetAlert confirmation before proceeding with deletion
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteRecord(accountId)
    }
  })
}

async function deleteRecord(accountId) {
  if (!accountId) {
    console.error('Invalid accountId:', accountId)
    alert('Account ID is missing or invalid.')
    return
  }

  try {
    const response = await axios.delete(`http://localhost:8080/account/delete/${accountId}`)
    if (response.status === 200) {
      Swal.fire('Deleted!', 'Your account has been deleted.', 'success') // Show success confirmation
      fetchAccounts() // Refresh the list after deletion
    } else {
      throw new Error('Failed to delete account')
    }
  } catch (error) {
    console.error('Error deleting account:', error)
    Swal.fire('Error', 'Failed to delete the account. Please try again.', 'error') // Show error alert
  }
}

onMounted(() => {
  fetchAccounts() // Fetch accounts when the component mounts
})
</script>

<style scoped>
th, td {
  text-align: center;
}
.fa-pencil {
  cursor: pointer;
  font-size: 18px;
}
.fa-trash {
  cursor: pointer;
  font-size: 20px;
  margin-left: 10px;
}
</style>

<template>
  <v-container class="pa-4">
    <h2>Change Password</h2>
    <v-form ref="form" v-model="isValid" lazy-validation>
      <!-- Input Old Password -->
      <v-text-field
        v-model="oldPassword"
        :rules="[rules.required]"
        label="Old Password"
        type="password"
        required
      ></v-text-field>

      <!-- Input New Password -->
      <v-text-field
        v-model="newPassword"
        :rules="[rules.required, rules.minLength]"
        label="New Password"
        type="password"
        required
      ></v-text-field>

      <!-- Input Confirm New Password -->
      <v-text-field
        v-model="confirmPassword"
        :rules="[rules.required, rules.matchPassword]"
        label="Confirm New Password"
        type="password"
        required
      ></v-text-field>

      <!-- Button Change Password -->
      <v-btn
        type="submit"
        color=#ffc0cb
        class="mt-4"
        :disabled="!isValid"
        @click="changePassword"
      >
        Change Password
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref(null)
const isValid = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Aturan validasi
const rules = {
  required: (value) => !!value || 'Field is required',
  minLength: (value) => value.length >= 6 || 'Password must be at least 6 characters',
  matchPassword: (value) => value === newPassword.value || 'Passwords do not match',
}

const changePassword = async () => {
  // Validasi form
  const isFormValid = await form.value.validate();
  if (!isFormValid) {
    alert('Please fill in all required fields correctly.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please login first.');
      router.push({ name: 'login' });
      return;
    }

    // Kirim request untuk mengubah password ke server
    const payload = {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    };

    const response = await axios.post('http://localhost:8080/auth/change-password', payload, {
      headers: { Authorization: `Bearer ${token}` }, // Mengirim token dalam header
    });

    if (response.data.message === 'Password updated successfully') {
      alert('Password has been successfully changed.');
      router.push({ name: 'home' });
    } else {
      alert(response.data.message || 'Failed to change password. Please try again.');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    const errorMessage = error.response?.data?.message || error.message;
    alert(`Error changing password: ${errorMessage}`);
  }
};

</script>

<style scoped>
.v-container {
  max-width: 500px;
  margin: 0 auto;
}

h2 {
  text-align: center;
}

.v-btn {
  width: 100%;
}
</style>

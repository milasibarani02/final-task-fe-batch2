<template>
  <v-container>
    <!-- Judul -->
    <v-row>
      <v-col cols="12">
        <h1 class="title-black text-center">Dompetku – Money Management App</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- Input Form di Kiri -->
      <v-col cols="12" md="6">
        <v-card class="pa-10 mb-4 form-card" outlined>
          <h3 class="text-center">Form Input</h3>
          <v-select
            v-model="kategori"
            :items="kategoriItems"
            label="Kategori"
            outlined
            @change="updateSubCategories"
          ></v-select>

          <v-select
            v-model="subKategori"
            :items="subKategoriItems"
            label="Keterangan"
            outlined
            @change="checkForCustomInput"
          ></v-select>

          <v-text-field
            v-if="isCustomKeterangan"
            v-model="customKeterangan"
            label="Masukkan Keterangan"
            outlined
          ></v-text-field>

          <v-text-field
            v-model.number="jumlah"
            label="Jumlah Uang"
            outlined
            type="number"
            :rules="jumlahRules"
          ></v-text-field>

          <v-btn color="primary" @click="submitEntry" block>Tambah</v-btn>
        </v-card>
      </v-col>

      <!-- Summary di Kanan -->
      <v-col cols="12" md="6">
        <v-card class="pa-10 mb-4 summary-card" outlined>
          <h3>Summary</h3>
          <v-col class="summary-wrapper">
            <v-row class="summary-item">
              <v-icon color="blue" small>mdi-circle</v-icon>
              <span>Total Transaksi: {{ entries.length }}</span>
            </v-row>

            <v-row class="summary-item">
              <v-icon color="green" small>mdi-circle</v-icon>
              <span>Pemasukan: Rp {{ totalPemasukan.toLocaleString() }}</span>
            </v-row>

            <v-row class="summary-item">
              <v-icon color="red" small>mdi-circle</v-icon>
              <span>Pengeluaran: Rp {{ totalPengeluaran.toLocaleString() }}</span>
            </v-row>

            <v-row class="summary-item">
              <v-icon color="purple" small>mdi-circle</v-icon>
              <span>Saldo: Rp {{ totalSaldo.toLocaleString() }}</span>
            </v-row>

            <v-row class="summary-item">
              <v-icon :color="saldoStatusColor" small>mdi-circle</v-icon>
              <span>{{ saldoStatus }}</span>
            </v-row>
          </v-col>
        </v-card>
      </v-col>
    </v-row>

    <!-- Riwayat Transaksi -->
    <v-row >
      <v-col cols="12">
        <h3 class="text-center mb-8">Riwayat Transaksi</h3>
        <v-simple-table outlined class="w-100">
          <thead>
            <tr>
              <th style="width: 8%;">No</th>
              <th style="width: 29%;">Kategori</th>
              <th style="width: 28%;">Keterangan</th>
              <th style="width: 26%;">Jumlah</th>
              <th style="width: 20%;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in entries" :key="index">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ entry.kategori }}</td>
              <td class="text-center">{{ entry.subKategori }}</td>
              <td :class="{'text-green': entry.amount > 0, 'text-red': entry.amount < 0}">
                Rp {{ entry.amount.toLocaleString() }}
              </td>
              <td class="text-center">
                <button @click="deleteEntry(index)" class="btn-delete">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </v-simple-table>

      </v-col>
    </v-row>
    <v-btn color="red" dark @click="confirmClearAll" class="mt-4">Hapus Semua Data</v-btn>
  </v-container>
</template>

<script>
import axios from 'axios';
import { mdiDelete } from '@mdi/js';


export default {
  name: 'DompetKu',
  data() {
    return {
      kategori: '',
      subKategori: '',
      customKeterangan: '',
      jumlah: 0,
      entries: JSON.parse(localStorage.getItem('entries')) || [],
      kategoriItems: ['Pemasukan', 'Pengeluaran'],
      pemasukanSubCategories: ['Gaji', 'Bonus', 'Investasi', 'Lainnya'],
      pengeluaranSubCategories: ['Transportasi', 'Makanan', 'Hiburan', 'Lainnya'],
      subKategoriItems: [],
      isCustomKeterangan: false,
    };
  },
  computed: {
    totalPengeluaran() {
      return this.entries.filter(entry => entry.amount < 0).reduce((sum, entry) => sum + entry.amount, 0);
    },
    totalPemasukan() {
      return this.entries.filter(entry => entry.amount > 0).reduce((sum, entry) => sum + entry.amount, 0);
    },
    totalSaldo() {
      return this.totalPemasukan + this.totalPengeluaran;
    },
    saldoStatus() {
      return this.totalSaldo >= 0 ? 'Surplus' : 'Defisit';
    },
    saldoStatusColor() {
      return this.totalSaldo >= 0 ? 'green' : 'red';
    },
    jumlahRules() {
      return [(v) => v !== 0 || 'Jumlah tidak boleh nol'];
    },
  },
  methods: {
    updateSubCategories() {
      if (this.kategori === 'Pemasukan') {
        this.subKategoriItems = this.pemasukanSubCategories;
      } else if (this.kategori === 'Pengeluaran') {
        this.subKategoriItems = this.pengeluaranSubCategories;
      }
      this.isCustomKeterangan = false;
    },
    checkForCustomInput() {
      this.isCustomKeterangan = this.subKategori === 'Lainnya';
    },
    submitEntry() {
      const entry = {
        kategori: this.kategori,
        keterangan: this.isCustomKeterangan ? this.customKeterangan : this.subKategori,
        amount: this.kategori === 'Pemasukan' ? this.jumlah : -this.jumlah,
        transaction_date: new Date().toISOString(),
      };

      const token = localStorage.getItem('token');
      axios.post('http://localhost:8080/transaction/create', entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          alert('Transaksi berhasil ditambahkan!');
          this.entries.push(entry);
          this.updateLocalStorage();
          this.resetForm();
        })
        .catch((error) => {
          alert('Error: ' + error.response.data.message);
        });
    },
    deleteEntry(index) {
      if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
        this.entries.splice(index, 1);
        this.updateLocalStorage();
      }
    },
    confirmClearAll() {
      if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
        this.clearAll();
      }
    },
    clearAll() {
      this.entries = [];
      localStorage.removeItem('entries');
    },
    updateLocalStorage() {
      localStorage.setItem('entries', JSON.stringify(this.entries));
    },
    resetForm() {
      this.kategori = '';
      this.subKategori = '';
      this.customKeterangan = '';
      this.jumlah = 0;
    },
  },
};
</script>

<style scoped>
.title-green {
  color: #4caf50;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.form-card,
.summary-card {
  box-shadow: 0px 4px 8px rgba(0, 128, 0, 0.2);
  border-radius: 8px;
}

.text-green {
  color: green;
}

.text-red {
  color: red;
}
</style>

<style scoped>
.btn-delete {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-delete:hover {
  background-color: #ff7875;
}
</style>

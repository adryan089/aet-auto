# 🚀 Skydash.NET - Auto Transfer Token on TEA Sepolia  
![GitHub repo size](https://img.shields.io/github/repo-size/adryan089/aet-auto?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/adryan089/aet-auto?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/adryan089/aet-auto?style=flat-square)
![GitHub license](https://img.shields.io/github/license/adryan089/aet-auto?style=flat-square)

> **Menggunakan script ini berarti memahami segala risiko yang mungkin terjadi.**  
> **Thanks clwkevin! for Wallet Database** 💙  

---

## ✨ Fitur Utama  
✅ **Auto Transfer Custom Token** 
✅ **Auto Transfer TEA Native Token**
✅ **Batas maksimal transaksi 98-150 kali/hari**  
✅ **Auto pause & restart otomatis jam 00:00 UTC / 07:00 WIB**  
✅ **Delay random antar transaksi** untuk keamanan & anti-bot detection  
✅ **Alamat tujuan otomatis diambil dari sumber eksternal**  
✅ **Jumlah token yang dikirim bersifat acak**  
✅ **Support multi wallet dan multi CA**  
✅ **Notifikasi via Telegram Bot (optional)**

---

## 📌 Persyaratan  
Sebelum menjalankan script, pastikan sudah terinstal:  
- **Node.js** v18+ ✅  
- **NPM** ✅  
- **Wallet dengan Faucet TEA** ✅  
- **Contract Address Token hasil Deploy** ✅

---

## 🔧 Cara Install  
1⃣ **Clone repository**  
```bash
git clone https://github.com/adryan089/aet-auto.git
cd aet-auto
```

2⃣**Install dependencies**
```bash
npm install
```

3⃣ **Konfigurasi Wallet**
```bash
cp wallets.json.examples wallets.json
```
Lalu edit file ```wallets.json``` dan isi dengan data wallet dan token lo:

**Contoh single wallet:**
```json
[
  {
    "PRIVATE_KEY": "privatekeylu",
    "TOKEN_ADDRESS": "CA Tokenlu"
  }
]
```

**Contoh multi wallet:**
```json
[
  {
    "PRIVATE_KEY": "privatekey1",
    "TOKEN_ADDRESS": "CA Token wallet 1"
  },
  {
    "PRIVATE_KEY": "privatekey2",
    "TOKEN_ADDRESS": "CA Token wallet 2"
  }
  // dst...
]
```

4⃣ **Konfigurasi Telegram Bot (Opsional)**

Untuk mendapatkan notifikasi otomatis via Telegram:

- Buat bot baru di [@BotFather](https://t.me/BotFather) dan salin token-nya.
- Dapatkan `chat_id` dari user atau grup tujuan, bisa pakai bot seperti [@userinfobot](https://t.me/userinfobot).
- Buat file baru bernama `.env` dan isi dengan :
```bash
BOT_TOKEN=bottokenlu
CHAT_ID=chatidlu
```
- Simpan file tersebut di root folder project.

Jika file `telegram.json` tidak ditemukan, script tetap jalan tapi tanpa notifikasi.

---

## 🚀 Jalankan Script

```bash
node main.js
```

---

## 📜 License
Distribusi proyek ini menggunakan lisensi MIT License.

```bash
MIT License

Copyright (c) 2025 Skydash.NET

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

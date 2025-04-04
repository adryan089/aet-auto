# 🚀 Skydash.NET - Auto Transfer Token on TEA Sepolia  
![GitHub repo size](https://img.shields.io/github/repo-size/adryan089/aet-auto?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/adryan089/aet-auto?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/adryan089/aet-auto?style=flat-square)
![GitHub license](https://img.shields.io/github/license/adryan089/aet-auto?style=flat-square)

> **Menggunakan script ini berarti memahami segala risiko yang mungkin terjadi.**  
> **Thanks Ashev!** 💙  

---

## ✨ Fitur Utama  
✅ **Auto Transfer Token** di jaringan **TEA Sepolia**  
✅ **Batas maksimal transaksi 98-150 kali/hari**  
✅ **Auto pause & restart otomatis jam 00:00 UTC / 07:00 WIB**  
✅ **Delay random antar transaksi** untuk keamanan & anti-bot detection  
✅ **Alamat tujuan otomatis diambil dari sumber eksternal**  
✅ **Jumlah token yang dikirim bersifat acak**  
✅ **Support multi wallet dan multi CA**  

---

## 📌 Persyaratan  
Sebelum menjalankan script, pastikan sudah terinstal:  
- **Node.js** v18+ ✅  
- **NPM** ✅  
- **Wallet dengan Faucet TEA** ✅  
- **Wallet yang sudah deploy token** ✅

---

## 🔧 Cara Install  
1️⃣ **Clone repository**  
```bash
git clone https://github.com/adryan089/aet-auto.git
cd aet-auto
```

2️⃣**Install dependencies**
```bash
npm install
```

3️⃣ **Konfigurasi Wallet**
```bash
cp wallets.json.examples wallets.json
```
Lalu edit file ```wallet.json``` dan isi dengan data wallet dan token lo :
1. jika ingin 1 wallet isi : 

```bash
[
    {
      "PRIVATE_KEY": "privatekeylu",
      "TOKEN_ADDRESS": "CA Tokenlu"
    }
]
```

2. jika ingin multi wallet isi

```bash
[
    {
      "PRIVATE_KEY": "privatekey1",
      "TOKEN_ADDRESS": "CA Token wallet 1"
    },
    {
      "PRIVATE_KEY": "privatekey2",
      "TOKEN_ADDRESS": "CA Token wallet 2"
    }
    dst..
]
```

---

## 🚀 Jalankan Script

```bash
node main.js
```

---

## 📜 Lisensi
MIT License 

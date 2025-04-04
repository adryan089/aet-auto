import "dotenv/config";
import axios from "axios";
import { ethers } from "ethers";
import figlet from "figlet";
import gradient from "gradient-string";
import fs from "fs";
import chalk from "chalk";

// 🛠 Load network config
const network = JSON.parse(fs.readFileSync("network.json"));
const provider = new ethers.JsonRpcProvider(network.RPC_URL);

// 📂 Load multi-wallet config
const walletsConfig = JSON.parse(fs.readFileSync("wallets.json"));

// 🎨 Tampilan awal
console.log(gradient.pastel(figlet.textSync("Skydash.NET")));
console.log(chalk.yellow("Auto Transfer Token on TEA Sepolia"));
console.log(chalk.cyan("using this script means understanding the risks later."));
console.log(chalk.green("Thanks Ashev! 🚀\n"));

// ⏳ Aturan batas transaksi
const MAX_TX_PER_DAY = Math.floor(Math.random() * (150 - 98 + 1)) + 98; // 98-150 transaksi
let txCount = 0;

// 🔄 Atur waktu reset harian
setInterval(() => {
  console.log(chalk.blue("\n⏳ Reset transaksi harian..."));
  txCount = 0;
}, 24 * 60 * 60 * 1000); // Reset setiap 24 jam

// 🔽 Fungsi fetch alamat tujuan
async function getAddresses() {
  try {
    const { data } = await axios.get(
      "https://raw.githubusercontent.com/clwkevin/LayerOS/main/addressteasepoliakyc.txt"
    );
    return data.split("\n").filter((addr) => addr.length === 42);
  } catch (error) {
    console.error(chalk.red("❌ Gagal mengambil alamat tujuan!"));
    return [];
  }
}

// 🔀 Fungsi random jumlah token
function randomAmount() {
  return ethers.parseUnits((Math.random() * (1 - 0.1) + 0.1).toFixed(6), 18);
}

// 🚀 Fungsi transfer token
async function sendToken(tokenContract, to) {
  try {
    const amount = randomAmount();
    const tx = await tokenContract.transfer(to, amount);
    console.log(chalk.green(`✅ Transaction success: ${tx.hash}`));
    return tx.wait();
  } catch (error) {
    console.error(chalk.red(`❌ Gagal kirim ke ${to}: ${error.message}`));
  }
}

// 🕐 Fungsi tunggu sampai tengah malam UTC (07:00 WIB)
async function waitUntilMidnightUTC() {
  const now = new Date();
  const nextUTC = new Date(now);
  nextUTC.setUTCHours(0, 0, 0, 0);
  if (now >= nextUTC) nextUTC.setUTCDate(now.getUTCDate() + 1);
  const waitTime = nextUTC.getTime() - now.getTime();
  console.log(chalk.blue(`🕐 Menunggu hingga jam 07:00 WIB (${(waitTime / 1000 / 60).toFixed(1)} menit)...`));
  return new Promise((res) => setTimeout(res, waitTime));
}

// 🔄 Jalankan transaksi multi wallet
(async function startTransfers() {
  const addresses = await getAddresses();
  if (addresses.length === 0) {
    return console.log(chalk.red("❌ Tidak ada alamat tujuan!"));
  }

  for (const { PRIVATE_KEY, TOKEN_ADDRESS } of walletsConfig) {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const tokenContract = new ethers.Contract(
      TOKEN_ADDRESS,
      ["function transfer(address to, uint amount) public returns (bool)"],
      wallet
    );

    console.log(chalk.blueBright(`\n🔑 Wallet: ${wallet.address}`));
    console.log(chalk.magenta(`🎯 Token: ${TOKEN_ADDRESS}\n`));

    for (let i = 0; i < addresses.length; i++) {
      if (txCount >= MAX_TX_PER_DAY) {
        console.log(chalk.blue("\n⏸ Maksimum transaksi tercapai! Menunggu jam reset..."));
        await waitUntilMidnightUTC();
        txCount = 0;
      }

      await sendToken(tokenContract, addresses[i]);
      txCount++;

      const delay = Math.floor(Math.random() * (90 - 30 + 1)) + 30;
      console.log(chalk.yellow(`⏳ Delay ${delay} detik...`));
      await new Promise((res) => setTimeout(res, delay * 1000));
    }
  }

  console.log(chalk.green("\n🎉 Semua transaksi selesai untuk semua wallet!"));
})();

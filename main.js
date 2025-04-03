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
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const tokenAddress = process.env.TOKEN_ADDRESS;

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
async function sendToken(to) {
  try {
    const erc20Abi = ["function transfer(address to, uint amount) public returns (bool)"];
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);

    let amount = randomAmount();
    let tx = await tokenContract.transfer(to, amount);
    console.log(chalk.green(`✅ Transaction successfully: ${tx.hash}`));

    return tx.wait();
  } catch (error) {
    console.error(chalk.red(`❌ Gagal mengirim ke ${to}: ${error.message}`));
  }
}

// 🔄 Jalankan transaksi dengan delay acak
(async function startTransfers() {
  const addresses = await getAddresses();
  if (addresses.length === 0) return console.log(chalk.red("❌ Tidak ada alamat tujuan!"));

  for (let i = 0; i < addresses.length; i++) {
    if (txCount >= MAX_TX_PER_DAY) {
      console.log(chalk.blue("\n⏸ Maksimum transaksi tercapai! Akan restart jam 07:00 WIB."));
      return;
    }

    await sendToken(addresses[i]);
    txCount++;

    let delay = Math.floor(Math.random() * (90 - 30 + 1)) + 30;
    console.log(chalk.yellow(`⏳ Menunggu ${delay} detik sebelum transaksi berikutnya...`));
    await new Promise((resolve) => setTimeout(resolve, delay * 1000));
  }

  console.log(chalk.green("\n🎉 Semua transaksi selesai!"));
})();

import "dotenv/config";
import axios from "axios";
import { ethers } from "ethers";
import figlet from "figlet";
import gradient from "gradient-string";
import fs from "fs";
import chalk from "chalk";

// 🧼 Clear console biar bersih
console.clear();

// 🎨 Tampilan awal
console.log(gradient.rainbow(figlet.textSync("Skydash.NET")));
console.log(gradient.pastel("🚀 Auto Transfer Token & Native on TEA Sepolia"));
console.log(chalk.cyan("⚠️ Use at your own risk. Don't cry later."));
console.log(chalk.green("❤️ Thanks clwkevin! for wallet databases 🚀\n"));

// 🧠 Load config jaringan
const network = JSON.parse(fs.readFileSync("network.json"));
const provider = new ethers.JsonRpcProvider(network.RPC_URL);

// 📁 Load semua wallet
const wallets = JSON.parse(fs.readFileSync("wallets.json"));

// ⏳ Batas transaksi per hari
const MAX_TX_PER_DAY = Math.floor(Math.random() * (150 - 98 + 1)) + 98;
let txCount = 0;

// Telegram Notif
async function sendTelegramMessage(message) {
  const botToken = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;
  if (!botToken || !chatId) return;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: `📢 *Skydash Auto Transfer Info*

${message}`,
      parse_mode: "Markdown",
      disable_web_page_preview: true
    });
  } catch (error) {
    console.log(chalk.red("⚠️ Gagal kirim notifikasi Telegram"));
  }
}

// ⌛ Waktu tunggu hingga jam 07:00 WIB (00:00 UTC)
function waitUntilNextUTCReset() {
  const now = new Date();
  const nextReset = new Date();
  nextReset.setUTCHours(0, 0, 0, 0);
  if (now >= nextReset) {
    nextReset.setUTCDate(nextReset.getUTCDate() + 1);
  }
  const delay = nextReset - now;
  console.log(chalk.magenta(`⏱ Menunggu hingga reset berikutnya (${nextReset.toUTCString()})...`));
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// 🔽 Ambil address tujuan
async function getAddresses() {
  try {
    const { data } = await axios.get(
      "https://raw.githubusercontent.com/clwkevin/LayerOS/main/addressteasepoliakyc.txt"
    );
    return data.split("\n").filter((addr) => addr.length === 42);
  } catch (err) {
    console.log(chalk.red("❌ Gagal ambil address tujuan!"));
    return [];
  }
}

// 🔍 Cek saldo token CA
async function checkTokenBalance(walletObj) {
  try {
    const wallet = new ethers.Wallet(walletObj.privateKey, provider);
    const erc20Abi = ["function balanceOf(address owner) view returns (uint256)"];
    const tokenContract = new ethers.Contract(walletObj.tokenAddress, erc20Abi, provider);
    const balance = await tokenContract.balanceOf(wallet.address);
    console.log(chalk.blue(`[Token BALANCE] ${wallet.address} => ${ethers.formatUnits(balance, 18)} tokens`));
  } catch (err) {
    console.log(chalk.red(`❌ Gagal cek saldo token untuk ${walletObj.address}: ${err.message}`));
  }
}

// 🔍 Cek saldo native token
async function checkNativeBalance(walletObj) {
  try {
    const wallet = new ethers.Wallet(walletObj.privateKey, provider);
    const balance = await provider.getBalance(wallet.address);
    console.log(chalk.blue(`[TEA BALANCE] ${wallet.address} => ${ethers.formatEther(balance)} TEA`));
  } catch (err) {
    console.log(chalk.red(`❌ Gagal cek saldo TEA untuk ${walletObj.address}: ${err.message}`));
  }
}

// 🔍 Cek semua saldo sebelum mulai transfer
async function checkAllBalances() {
  console.log(chalk.yellow("\n🔍 Mengecek saldo semua wallet...\n"));
  for (const wallet of wallets) {
    await checkTokenBalance(wallet);
    await checkNativeBalance(wallet);
  }
  console.log(chalk.yellow("\n✅ Pengecekan saldo selesai!\n"));
}

// 🔀 Random amount token CA
function randomTokenAmount() {
  return ethers.parseUnits((Math.random() * (1 - 0.1) + 0.1).toFixed(6), 18);
}

// 💰 Random amount native token
function randomNativeAmount(balance) {
  // Kirim antara 0.01 hingga 0.002 dan sisakan gas
  const max = Math.min(Number(ethers.formatEther(balance)) - 0.002, 0.01);
  const min = 0.002;
  if (max <= min) return ethers.parseEther("0.002");
  const amount = (Math.random() * (max - min) + min).toFixed(6);
  return ethers.parseEther(amount);
}

// Fungsi delay acak untuk jeda transaksi
async function randomDelay() {
  const delay = Math.floor(Math.random() * (90 - 30 + 1)) + 30;
  console.log(chalk.gray(`⏳ Delay ${delay} detik...`));
  await new Promise((resolve) => setTimeout(resolve, delay * 1000));
}
// 🚀 Kirim token CA
async function sendToken(walletObj, to) {
  try {
    const wallet = new ethers.Wallet(walletObj.privateKey, provider);
    const erc20Abi = ["function transfer(address to, uint amount) public returns (bool)"];
    const tokenContract = new ethers.Contract(walletObj.tokenAddress, erc20Abi, wallet);
    const amount = randomTokenAmount();
    const tx = await tokenContract.transfer(to, amount);
    console.log(chalk.green(`🎯 [Token] ${wallet.address} to ${to}`));
    console.log(chalk.green(`🎯 [Token] TX : ${tx.hash}`));
    console.log(chalk.green(`🎯 [Token] Amount : ${ethers.formatUnits(amount, 18)}`));
    await sendTelegramMessage(`🟢 Token Transfer Success!

      🔐 From : \`${wallet.address}\`
      🎯 To : \`${to}\`
      💵 Amount : \`${ethers.formatUnits(amount, 18)} tokens\`
      🔗 TX : (https://sepolia.tea.xyz/tx/${tx.hash})`);
    await tx.wait();
  } catch (err) {
    console.log(chalk.red(`❌ Gagal kirim token CA dari ${walletObj.address}: ${err.message}`));
  }
}

// 🪙 Kirim native token
async function sendNative(walletObj, to) {
  try {
    const wallet = new ethers.Wallet(walletObj.privateKey, provider);
    const balance = await provider.getBalance(wallet.address);
    const amount = randomNativeAmount(balance);
    const tx = await wallet.sendTransaction({ to, value: amount });
    console.log(chalk.cyan(`💸 [TEA] ${wallet.address} to ${to}`));
    console.log(chalk.cyan(`🎯 [TEA] TX: ${tx.hash}`));
    console.log(chalk.cyan(`🎯 [TEA] Amount : ${ethers.formatUnits(amount, 18)}`));
    await sendTelegramMessage(`🟢 TEA Token Transfer Success!

      🔐 From : \`${wallet.address}\`
      🎯 To : \`${to}\`
      💵 Amount : \`${ethers.formatUnits(amount, 18)} tokens\`
      🔗 TX : (https://sepolia.tea.xyz/tx/${tx.hash})`);
    await tx.wait();
  } catch (err) {
    console.log(chalk.red(`❌ Gagal kirim TEA token dari ${walletObj.address}: ${err.message}`));
  }
}

// 🔄 Proses transaksi utama
async function runTransfers() {
  await checkAllBalances();

  const addresses = await getAddresses();
  if (addresses.length === 0) {
    console.log(chalk.red("❌ Tidak ada alamat tujuan."));
    return;
  }

  while (true) {
    txCount = 0;
    
    while (txCount < MAX_TX_PER_DAY) {
      for (const wallet of wallets) {
        
        const target = addresses[txCount % addresses.length];
        
        await sendToken(wallet, target);
        await randomDelay();
        await sendNative(wallet, target);
        await randomDelay();
        
        txCount += 2;
        if (txCount >= MAX_TX_PER_DAY) break;
      }
    }
  
    console.log(chalk.green("\n🎉 Semua transaksi hari ini selesai!"));
    await sendTelegramMessage("🎉 Semua transaksi token (Token + TEA) hari ini sudah selesai!");
    await waitUntilNextUTCReset();
  }
}

runTransfers();
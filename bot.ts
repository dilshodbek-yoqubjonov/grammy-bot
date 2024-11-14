import { Bot, Context } from "grammy";
import dotenv from "dotenv";

dotenv.config();

// Botni yaratish
const bot = new Bot(process.env.BOT_TOKEN!);

const lastCodeSent: { [key: number]: number } = {}; // Foydalanuvchining oxirgi kod yuborilgan vaqtini saqlaydi

// Kod jo'natish funksiyasi
function sendCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali random kod
}

// Start komandasi
bot.command("start", (ctx: Context) => {
  const chatId = ctx.chat?.id;
  const currentTime = Date.now();
  const sec = 60;

  // Agar birinchi marta kod so'ralayotgan bo'lsa yoki 1 daqiqa o'tgan bo'lsa kod yuboriladi
  if (
    !lastCodeSent[chatId as number] ||
    currentTime - lastCodeSent[chatId as number] > 60000
  ) {
    const code = sendCode();
    ctx.reply(`1daqiqalik kodingiz!: <pre>${code}</pre>`, {
      parse_mode: "HTML",
    });
    lastCodeSent[chatId as number] = currentTime;
  } else {
    ctx.reply(
      `Kechirasiz, sizning kodingiz muddati tugamagan. ${
        sec - (currentTime - lastCodeSent[chatId as number])
      }`
    );
  }
});

bot.start();

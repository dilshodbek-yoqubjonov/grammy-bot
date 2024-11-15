import { Bot, Context } from "grammy";
import dotenv from "dotenv";
import { log } from "console";

dotenv.config();

// Botni yaratish
const bot = new Bot(process.env.BOT_TOKEN as string);

const lastCodeSent: { [key: number]: number } = {}; // Foydalanuvchining oxirgi kod yuborilgan vaqtini saqlaydi
const userCounters: { [key: number]: number } = {}; // Har bir foydalanuvchi uchun counter

// Kod jo'natish funksiyasi
function sendCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali random kod
}

// Start komandasi
bot.command("start", async (ctx: Context) => {
  const chatId = ctx.chat?.id;
  if (!chatId) {
    return await ctx.reply("Chat ID topilmadi!");
  }

  // Counterni yangilash
  if (!userCounters[chatId]) {
    userCounters[chatId] = 0; // Agar mavjud bo'lmasa, 0 ga tenglashtiramiz
  }
  userCounters[chatId] += 1;

  const currentTime = Date.now();
  const sec = 60;

  // 60 soniyadan so'ng counterni 0 ga qaytarish
  setTimeout(() => {
    userCounters[chatId] = 0;
  }, 60000);

  if (!lastCodeSent[chatId] || currentTime - lastCodeSent[chatId] > 60000) {
    const code = sendCode();
    await ctx.reply(`<b>1daqiqalik kodingiz!</b> <pre>${code}</pre>`, {
      parse_mode: "HTML",
    });
    lastCodeSent[chatId] = currentTime;
  } else {
    if (userCounters[chatId] <= 3) {
      await ctx.reply(
        `<b>Kechirasiz, sizning kodingiz muddati tugamagan☝.</b>\n<b>${
          sec - Math.floor((currentTime - lastCodeSent[chatId]) / 1000)
        }</b> - soniyadan so'ng qayta urinib ko'ring!.`,
        { parse_mode: "HTML" }
      );
    } else {
      await ctx.reply("Spam qilmang bot toxtab qoladi!");
      return;
    }
  }
});

bot.start();

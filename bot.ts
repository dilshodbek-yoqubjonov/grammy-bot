import { Bot, Context } from "grammy";
import dotenv from "dotenv";
import express, { urlencoded } from "express";
import { log } from "console";
import { PrismaClient } from "@prisma/client";

//configs
dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Botni yaratish
const bot = new Bot(process.env.BOT_TOKEN as string);

const lastCodeSent: { [key: number]: number } = {}; // Oxirgi kod yuborilgan vaqtni saqlaydi
const userCounters: { [key: number]: number } = {}; // Har bir foydalanuvchi uchun counter

function sendCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali random kod
}
// /start buyrug'i
bot.command("start", async (ctx: Context) => {
  const chatId = ctx.chat?.id;
  if (!chatId) {
    return await ctx.reply("Chat ID topilmadi!");
  }

  // Counterni yangilash
  if (!userCounters[chatId]) {
    userCounters[chatId] = 0;
  }
  userCounters[chatId] += 1;

  const currentTime = Date.now();
  const sec = 60;

  // 60 soniyadan so'ng counterni 0 ga tushirish
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

app.get("/", (req, res) => {
  res.render("./index");
});

app.post("/reg", async (req, res) => {
  let { username, password, email } = req.body;
  log(username, password, email);
  let data = await prisma.users.create({
    data: {
      username,
      password,
      email,
    },
  });
  log(data);
});

app.listen(8000, () => log(9000));

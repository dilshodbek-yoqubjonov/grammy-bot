import { Bot } from "grammy";
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

const bot = new Bot(process.env.BOT_TOKEN as string);

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const userCodes: { [key: string]: string } = {};
const lastCodeSent: { [key: number]: number } = {};

bot.command("start", async (ctx) => {
  const userId = ctx.match;
  const chatId = ctx.chat?.id;

  if (!userId || !chatId) {
    return await ctx.reply(
      `<b>Foydalanuvchi ID topilmadi!\nIltimos saytda korsatilgan link orqali kiring!</b>`,
      { parse_mode: "HTML" }
    );
  }

  const currentTime = Date.now();
  const sec = 60000;

  if (!lastCodeSent[chatId] || currentTime - lastCodeSent[chatId] > sec) {
    const code = generateCode();
    await ctx.reply(`<b>1daqiqalik kodingiz!</b> <pre>${code}</pre>`, {
      parse_mode: "HTML",
    });
    userCodes[userId] = code;
  } else {
    await ctx.reply(
      `<b>Kechirasiz, sizning kodingiz muddati hali tugamagan☝.</b>\n<b>${
        sec / 1000 - Math.floor((currentTime - lastCodeSent[chatId]) / 1000)
      }</b> - soniyadan so'ng qayta urinib ko'ring!.`,
      { parse_mode: "HTML" }
    );
  }
});
//start bot
bot.start();

// -------------------------------------------------------------------

// import { Bot, Context } from "grammy";
// import dotenv from "dotenv";
// import express, { urlencoded } from "express";
// import { log } from "console";
// import { PrismaClient } from "@prisma/client";

// //configs
// dotenv.config();
// const prisma = new PrismaClient();
// const app = express();

// app.set("view engine", "ejs");
// app.set("views", "./views");
// app.use(express.static("views"));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // Botni yaratish
// const bot = new Bot(process.env.BOT_TOKEN as string);

// const lastCodeSent: { [key: number]: number } = {}; // Oxirgi kod yuborilgan vaqtni saqlaydi
// const userCounters: { [key: number]: number } = {}; // Har bir foydalanuvchi uchun counter
// const userCodes: { [chatId: number]: string } = {}; // Har bir foydalanuvchi uchun vaqtinchalik kodlar

// async function sendCodeToTelegram(chatId: number): Promise<string> {
//   const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali kod
//   userCodes[chatId] = code;

//   await bot.api.sendMessage(chatId, `Tasdiqlash uchun kodingiz: ${code}`);
//   return code;
// }
// // /start buyrug'i
// // bot.command("start", async (ctx: Context) => {
// //   const chatId = ctx.chat?.id;
// //   if (!chatId) {
// //     return await ctx.reply("Chat ID topilmadi!");
// //   }

// //   // Counterni yangilash
// //   if (!userCounters[chatId]) {
// //     userCounters[chatId] = 0;
// //   }
// //   userCounters[chatId] += 1;

// //   const currentTime = Date.now();
// //   const sec = 60;

// //   // 60 soniyadan so'ng counterni 0 ga tushirish
// //   setTimeout(() => {
// //     userCounters[chatId] = 0;
// //   }, 60000);

// //   if (!lastCodeSent[chatId] || currentTime - lastCodeSent[chatId] > 60000) {
// //     const code = sendCode();
// //     userCodes[chatId] = code;
// //     log("code bot", code);
// //     await ctx.reply(`<b>1daqiqalik kodingiz!</b> <pre>${code}</pre>`, {
// //       parse_mode: "HTML",
// //     });
// //     lastCodeSent[chatId] = currentTime;
// //   } else {
// //     if (userCounters[chatId] <= 3) {
// //       await ctx.reply(
// //         `<b>Kechirasiz, sizning kodingiz muddati tugamagan☝.</b>\n<b>${
// //           sec - Math.floor((currentTime - lastCodeSent[chatId]) / 1000)
// //         }</b> - soniyadan so'ng qayta urinib ko'ring!.`,
// //         { parse_mode: "HTML" }
// //       );
// //     } else {
// //       await ctx.reply("Spam qilmang bot toxtab qoladi!");
// //       return;
// //     }
// //   }
// // });

// bot.start();

// app.get("/", (req, res) => {
//   res.render("./html/index");
// });

// app.post("/reg", async (req, res) => {
//   let { username, password, email } = req.body;
//   log(username, password, email);
//   let data = await prisma.users.create({
//     data: {
//       username,
//       password,
//       email,
//     },
//   });
//   await sendCodeToTelegram(chatId);
//   res.redirect("/verify");
// });

// app.get("/verify", (req, res) => {
//   res.render("./html/input");
// });

// app.post("/otp", (req, res) => {
//   let { num1, num2, num3, num4, num5, num6 } = req.body;
//   let code = Number(`${num1 + num2 + num3 + num4 + num5 + num6}`);
//   // const botCode = Number(sendCode());
//   log("server code", botCode);

//   if (code === botCode) {
//     res.send("OK");
//   } else {
//     res.send("NO");
//   }
// });

// app.listen(8000, () => log(9000));

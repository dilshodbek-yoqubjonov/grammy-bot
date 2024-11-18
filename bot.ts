import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Bot } from "grammy";
import { PrismaClient } from "@prisma/client";
import { log } from "console";

dotenv.config();
const app = express();
const bot = new Bot(process.env.BOT_TOKEN as string);
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userCodes: { [key: string]: string } = {}; // Kodlarni saqlash

// Tasdiqlash kodi yaratish funksiyasi
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Ro'yxatdan o'tish sahifasi
app.get("/register", (req: Request, res: Response) => {
  res.render("./views/html/index");
});

app.post("/register", async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  try {
    const user = await prisma.users.create({
      data: { username, password, email },
    });

    const link = `https://t.me/telegrafdemobot?start=${user.id}`;
    res.render("./html/");
  } catch (error) {
    res.status(500).send("Xatolik yuz berdi!");
  }
});

// Tasdiqlash sahifasi
app.get("/verify", (req: Request, res: Response) => {
  res.send(`
    <form action="/verify" method="POST">   
      <input type="hidden" name="userId" value="${req.query.userId}" />
      <input type="text" name="code" placeholder="Kodni kiriting" required />
      <button type="submit">Tasdiqlash</button>
    </form>
  `);
});

// Tasdiqlashni qayta ishlash
app.post("/verify", (req: any, res: any) => {
  const { userId, code } = req.body;
  log(req.body);
  log(userCodes[userId]);

  if (!userCodes[userId] || userCodes[userId] !== code) {
    return res.status(400).send("Kod noto'g'ri!");
  }

  delete userCodes[userId]; // Kodni o'chirish
  res.send("Tasdiqlash muvaffaqiyatli! Xush kelibsiz.");
});

// Serverni ishga tushirish
app.listen(8000, () => console.log("Server 8000 portda ishlamoqda."));

bot.command("start", async (ctx) => {
  const userId = ctx.match;
  log(ctx);
  log(ctx.match);

  if (!userId) {
    return await ctx.reply("Foydalanuvchi ID topilmadi!");
  }

  const code = generateCode();
  userCodes[userId] = code;

  await ctx.reply(
    `Tasdiqlash uchun kodingiz: ${code}\nSaytga qaytib kodni kiriting.`
  );
});

// Botni ishga tushirish
bot.start().then(() => {
  log("RUneed");
});

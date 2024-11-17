import { log } from "console";
import { Request, Response } from "express";
import * as redis from "redis";

const clinet = redis.createClient();
clinet.on("connect", () => {
  console.info("Redis connected");
});

const userRegister = {
  // get register page
  getRegisterPage: (req: Request, res: Response) => {
    res.render("./views/html/index");
  },

  // work with users data
  register: async (req: Request, res: Response) => {
    const { username, password, email } = req.body;
    log(username, password, email);
    // save data to redis during 75seconds
    clinet.connect().then(async () => {
      await clinet.setEx("username", 75, username);
      await clinet.setEx("password", 75, password);
      await clinet.setEx("email", 75, email);

      log("Malumotlar redisga saqlandi");
    });
  },

  getOtpVerification: async (req: Request, res: Response) => {
    res.render("./views/html/input");
  },
};

export { userRegister };

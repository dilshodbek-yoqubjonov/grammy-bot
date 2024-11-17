import { userRegister } from "@controllers";
import { Router } from "express";

const router = Router();

router.get("/register", userRegister.getRegisterPage);
router.post("/register", userRegister.register);

export default router;

import AuthService from "../services/AuthService";
import { Request, Response } from "express";

class AuthController {
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const token = await AuthService.login(username, password);

    res.json(token);
  }
}

export default new AuthController();

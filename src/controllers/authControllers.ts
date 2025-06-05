import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Interface para os dados esperados no corpo da requisição de login
interface LoginBody {
  email: string;
  senha: string;
}

// Interface para os dados esperados no corpo da requisição de esquecimento de senha
interface ForgotPasswordBody {
  email: string;
}

// Interface para os dados esperados no corpo da requisição de redefinição de senha
interface ResetPasswordBody {
  token: string;
  newPassword: string;
}

// Interface para o payload do JWT
interface JwtPayload {
  id: string;
  role: string;
}

// Extensão do Request para incluir userId e userRole no middleware verifyToken
interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<void> => {
  const { email, senha } = req.body;
  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Email inválido" });
      return;
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      res.status(400).json({ message: "Senha inválida" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, role: user.role });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao fazer login", error: error.message });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.status(200).json({ message: "Logout realizado com sucesso" });
};

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(403).json({ message: "Token não fornecido" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      res.status(500).json({ message: "Falha na autenticação" });
      return;
    }
    const payload = decoded as JwtPayload;
    req.userId = payload.id;
    req.userRole = payload.role;
    next();
  });
};

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordBody>,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // expira em 1h
    await user.save();

    res.json({ message: "Token gerado com sucesso", resetToken: token });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Erro ao gerar token", error: err.message });
  }
};

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordBody>,
  res: Response
): Promise<void> => {
  const { token, newPassword } = req.body;
  try {
    const user: IUser | null = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
      res.status(400).json({ message: "Token inválido ou expirado" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso." });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Erro ao redefinir senha", error: err.message });
  }
};

// Exportação como objeto para compatibilidade com a importação padrão
export default { login, logout, verifyToken, resetPassword, forgotPassword };

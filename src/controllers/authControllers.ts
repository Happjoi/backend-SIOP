import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { sendEmail } from '../config/mailer';
import transporter from '../config/mailer'
import jwt from "jsonwebtoken";

// Interface para os dados esperados no corpo da requisição de login
interface LoginBody {
  email: string;
  senha: string;
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
    res.status(200).json({ token, role: user.role, id: user._id });
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

/**
 * POST /api/auth/forgot-password
 * Recebe { email }, gera uma nova senha aleatória, atualiza o usuário no BD
 * e envia a nova senha por e-mail.
 */
export const forgotPasswordEmail = async (
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'O campo email é obrigatório.' });
      return;
    }

    // 1) Verifica se o usuário existe
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      // Opcional: por segurança, podemos responder 200 mesmo sem existir,
      // mas aqui retornamos 404 para ficar claro:
      res.status(404).json({ message: 'Usuário não encontrado para este email.' });
      return;
    }

    // 2) Gera uma nova senha aleatória
    const newPasswordPlain = generateRandomPassword(8);

    // 3) Faz hash com bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPasswordPlain, salt);

    // 4) Atualiza o usuário no Banco com a nova senha (já criptografada)
    user.senha = hashed;
    await user.save();

    // 5) Envia e-mail com a nova senha (texto e HTML)
    const subject = 'Recuperação de senha';
    const html = `
      <p>Olá ${user.nome},</p>
      <p>Você solicitou a recuperação de senha no nosso sistema. 
      Sua nova senha provisória é:</p>
      <h3 style="color: #444;">${newPasswordPlain}</h3>
      <p>Assim que fizer login, recomendamos procurar a administração para alteração, para uma senha mais amigável.</p>
      <p>Atenciosamente,<br/>Equipe de Suporte</p>
    `;
    const text = `
      Olá ${user.nome},

      Você solicitou a recuperação de senha no nosso sistema.
      Sua nova senha provisória é:

      ${newPasswordPlain}

      Assim que fizer login, recomendamos procurar a administração para alteração, para uma senha mais amigável.

      Atenciosamente,
      Equipe de Suporte
          `;

    await sendEmail(user.email, subject, html, text);

    res.status(200).json({
      message: 'Se o email estiver cadastrado, uma nova senha provisória foi enviada.'
    });
  } catch (err: any) {
    next(err);
  }
};

// export padrão ou nomeado, conforme a importação:
export default {
  login,
  logout,
  verifyToken,
  forgotPasswordEmail
};

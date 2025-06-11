import { Request, Response, NextFunction } from 'express';
import mongoose, { Types } from 'mongoose';
import bcrypt from "bcrypt";
import User, { IUser } from "../models/User";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import streamifier from 'streamifier';
import 'dotenv/config';

cloudinary.config({
  cloud_name:   process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:      process.env.CLOUDINARY_API_KEY!,
  api_secret:   process.env.CLOUDINARY_API_SECRET!,
});

interface UploadReq extends Request {
  file?: Express.Multer.File;
}


// Interface para os dados esperados no corpo da requisição de criação de usuário
interface CreateUserBody {
  nome: string;
  email: string;
  senha: string;
  role: string; 
}

// Interface para os dados esperados no corpo da requisição de atualização parcial
interface UpdateUserBody {
  [key: string]: any; // Permite qualquer campo para atualização parcial
}

export const createUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response
): Promise<void> => {
  try {
    const { nome, email, senha, role } = req.body;

    // Gera um salt e criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);
    
    const newUser = new User({
      nome,
      email,
      senha: hashedPassword, // Salva a senha já criptografada
      role,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("⛔ Erro ao criar usuário:", error);
    res
      .status(500)
      .json({ message: "Erro ao criar usuário", error: error.message });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users: IUser[] = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao obter usuários", error: error.message });
  }
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const user: IUser | null = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao obter usuário", error: error.message });
  }
};

export const updateUser = async (
  req: Request<{ id: string }, {}, UpdateUserBody>,
  res: Response
): Promise<void> => {
  try {
    const user: IUser | null = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar usuário", error: error.message });
  }
};

export const patchUser = async (
  req: Request<{ id: string }, {}, UpdateUserBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar o usuário", error: error.message });
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const user: IUser | null = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao deletar usuário", error: error.message });
  }
}

  /**
 * POST /api/users/:id/photo
 * Faz upload da foto de perfil do User, atualiza os campos profileImageUrl e profileImagePublicId.
 */
export const uploadUserPhoto = async (
  req: UploadReq,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!req.file) {
      res.status(400).json({ message: 'Arquivo não enviado.' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    // se já houver foto antiga, apaga do Cloudinary
    if (user.profileImagePublicId) {
      await cloudinary.uploader.destroy(user.profileImagePublicId);
    }

    // faz upload
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'user_profiles' },
        (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (err) return reject(err);
          resolve(result!);
        }
      );
      streamifier.createReadStream(req.file!.buffer).pipe(stream);
    });

    // salva URLs no usuário
    user.profileImageUrl      = uploadResult.secure_url;
    user.profileImagePublicId = uploadResult.public_id;
    await user.save();

    res.status(200).json({ profileImageUrl: user.profileImageUrl });
  } catch (err) {
    next(err);
  }

};


// Exportação como objeto para compatibilidade com a importação padrão
export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
  uploadUserPhoto,
};

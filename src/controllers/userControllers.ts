import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/User";

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
};

// Exportação como objeto para compatibilidade com a importação padrão
export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
};

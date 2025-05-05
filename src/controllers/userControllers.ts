// import User from '../models/User.js';
// import bcrypt from 'bcrypt';

// export const createUser = async (req, res) => {
//   try {
//     const { nome, email, senha, role } = req.body;

//     // Gera um salt e criptografa a senha antes de salvar
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(senha, salt);

//     const newUser = new User({ 
//       nome, email, senha: hashedPassword, // Salva a senha já criptografada
//       role  });

//     await newUser.save();
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao criar usuário', error });
//   }
// };


// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao obter usuários', error });
//   }
// };

// export const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'Usuário não encontrado' });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao obter usuário', error });
//   }
// };

// export const updateUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!user) {
//       return res.status(404).json({ message: 'Usuário não encontrado' });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao atualizar usuário', error });
//   }
// };

// export const patchUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const updatedUser = await User.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'Usuário não encontrado' });
//     }

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao atualizar o usuário', error: error.message });
//   }
// };

// export const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'Usuário não encontrado' });
//     }
//     res.status(200).json({ message: 'Usuário deletado com sucesso' });
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao deletar usuário', error });
//   }
// };

// export default { createUser, getAllUsers, getUserById, updateUser, patchUser, deleteUser };
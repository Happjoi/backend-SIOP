// import crypto from 'crypto';
// import User from '../models/User.js'; 
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken'; 

// export const login = async (req, res) => {
//   const { email, senha } = req.body;
//   try {
//     const user = await User.findOne({ email }); // Procura o usuário no banco de dados
//     // if (user.senha) {
//     //   return console.log(user.senha); // Retorna erro se o usuário não for encontrado ou se a senha não existir 
//     // }
//     if (!user) {
//       return res.status(400).json({ message: 'Email inválido' }); // Retorna erro se o usuário não for encontrado
//     }
//     const isMatch = await bcrypt.compare(senha, user.senha); // Compara a senha fornecida com a senha do usuário ERRO 
//     if (!isMatch) { 
//       return res.status(400).json({ message: 'Senha inválida' }); // Retorna erro se a senha não for igual o ideal seria colocar pra ambos, assim, não expõe o que está errado.
//     }

//     const generatingToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Gera um token
//     const token = generatingToken; // Armazena o token
//     res.status(200).json({ token }); // Retorna o token
//   } catch (error) { // Retorna erro se houver algum problema
//     res.status(500).json({ message: 'Erro ao fazer login', error }); 
//   }
// };

// // Função de logout (simplesmente invalida o token no cliente)
// export const logout = (req, res) => { 
//   res.status(200).json({ message: 'Logout realizado com sucesso' }); 
// };

// // Função de verificação do token (Middleware de Autorização) que serve para proteger rotas!!!!
// export const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization']; // Pega o token do cabeçalho
//   if (!token) {
//     return res.status(403).json({ message: 'Token não fornecido' }); // Retorna erro se o token não for fornecido
//   }
  
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(500).json({ message: 'Falha na autenticação' }); // Retorna erro se houver falha na autenticação
//     }
//     req.userId = decoded.id;  // Armazena o ID do usuário no req
//     req.userRole = decoded.role; // Armazena o papel do usuário no req
//     next();
//   });
// };

// // Solicitação de esquecimento de senha (gera token e retorna ao front)
// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

//     const token = crypto.randomBytes(20).toString('hex');
//     user.resetPasswordToken   = token;
//     user.resetPasswordExpires = Date.now() + 3600000; // expira em 1h
//     await user.save();

//     // Retorna token para o front construir o link de reset
//     res.json({ message: 'Token gerado com sucesso', resetToken: token });
//   } catch (err) {
//     res.status(500).json({ message: 'Erro ao gerar token', error: err.message });
//   }
// };

// // Reset de senha usando token
// export const resetPassword = async (req, res) => {
//   const { token, newPassword } = req.body;
//   try {
//     const user = await User.findOne({
//       resetPasswordToken:   token,
//       resetPasswordExpires: { $gt: Date.now() }
//     });
//     if (!user) return res.status(400).json({ message: 'Token inválido ou expirado' });

//     const salt = await bcrypt.genSalt(10);
//     user.senha                 = await bcrypt.hash(newPassword, salt);
//     user.resetPasswordToken    = undefined;
//     user.resetPasswordExpires  = undefined;
//     await user.save();

//     res.json({ message: 'Senha redefinida com sucesso.' });
//   } catch (err) {
//     res.status(500).json({ message: 'Erro ao redefinir senha', error: err.message });
//   }
// };

// export default { login, logout, verifyToken, resetPassword, forgotPassword };
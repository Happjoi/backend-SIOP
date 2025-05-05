// // Esse middleware verifica se o token JWT é válido e se o usuário tem permissão para acessar a rota.

// import jwt from 'jsonwebtoken';

// const authenticateToken = (req, res, next) => {
//     // Pega o token do cabeçalho
//     const token = req.header('Authorization')?.split(' ')[1]; // Pega o token do cabeçalho Authorization, se existir

//     if (!token) { // caso não exista token...
//         return res.status(401).json({ message: 'seu acesso foi negado. Token não fornecido.' });
//     }

//     // aqui verificamos o token

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             console.error("Erro ao verificar token:", err);
//             return res.status(403).json({ 
//                 message: 'Esse token é inválido.', 
//                 error: err.message, 
//                 tokenRecebido: token, 
//                 chaveSecretaUsada: process.env.JWT_SECRET 
//             });
//         }
//         req.user = user;
//         next();
//     });
// };

// export default authenticateToken;
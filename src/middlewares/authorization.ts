// // Esse middleware é responsável por verificar se o usuário tem o papel(role) necessário para acessar uma rota em questão, por exemplo admin...

// const authorizeRole = (roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) { // Verifica se o papel do usuário está na lista de papéis permitidos ( !role == indefinido )
//             return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para esta ação.' });
//         }
//         next(); // Passa para o próximo middleware ou rota
//     };
// };

// export default authorizeRole;
// // Esse middleware é responsável por registrar as requisições feitas ao servidor, incluindo o método HTTP, a URL e o tempo de resposta. 
// // Isso pode ser útil para fins de auditoria e monitoramento de desempenho.

// const logger = (req, res, next) => {
//     const start = Date.now(); // Criamos a constante que armazena a data atual...
//     console.log(`${req.method} ${req.url} - Iniciando`); // Renderizo no console o método e a URL da requisição...

//     res.on('finish', () => { // Esse evento é acionado quando a resposta é finalizada
//         const duration = Date.now() - start; // Calculamos a duração da requisição
//         console.log(`${req.method} ${req.url} - Concluído em ${duration}ms`); 
//     });

//     next();  // Passa para o próximo middleware ou rota
// };

// export default logger;
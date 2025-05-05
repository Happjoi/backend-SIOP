// // Esse middleware é responsável por validar os dados de entrada de uma requisição, garantindo que eles estejam no formato correto e atendam aos requisitos definidos. 
// // Isso ajuda a evitar erros e inconsistências nos dados que são processados pelo servidor.
// // Acredito que não seja tão útil agora de começo mas fica aqui caso seja necessário no futuro.
// import { celebrate, Joi, Segments } from 'celebrate';

// const validateCreateComparisonResult = celebrate({ 
//     [Segments.BODY]: Joi.object().keys({
//         resultado: Joi.string().required(),
//         precisao: Joi.number().required(),
//         analisadoPor: Joi.string().required(),
//         dataAnalise: Joi.date().required(),
//         evidenciaTexto: Joi.string().optional(),
//         evidenciaImagem: Joi.string().optional(),
//     }),
// });

// export { validateCreateComparisonResult };
// import ComparisonResult from '../models/ComparisonResult.js'; 
// import Evidence from '../models/Evidence'; 

// // Criar um novo resultado de comparação
// export const createComparisonResult = async (req, res) => {
//   try {
//     const { resultado, precisao, analisadoPor, dataAnalise, evidenciaTexto, evidenciaImagem } = req.body;
//     const newComparisonResult = new ComparisonResult({ 
//       resultado, 
//       precisao, 
//       analisadoPor, 
//       dataAnalise,
//       evidenciaTexto,
//       evidenciaImagem 
//     });
//     await newComparisonResult.save();
//     res.status(201).json(newComparisonResult);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao criar resultado de comparação', error });
//   }
// };

// export const getAllComparisonResults = async (req, res) => {
//   try {
//     const comparisonResults = await ComparisonResult.find();
//     res.status(200).json(comparisonResults);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao obter resultados de comparação', error });
//   }
// };

// export const getComparisonResultById = async (req, res) => {
//   try {
//     const comparisonResult = await ComparisonResult.findById(req.params.id);
//     if (!comparisonResult) {
//       return res.status(404).json({ message: 'Resultado de comparação não encontrado' });
//     }
//     res.status(200).json(comparisonResult);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao obter resultado de comparação', error });
//   }
// };

// export const updateComparisonResult = async (req, res) => {
//   try {
//     const comparisonResult = await ComparisonResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!comparisonResult) {
//       return res.status(404).json({ message: 'Resultado de comparação não encontrado' });
//     }
//     res.status(200).json(comparisonResult);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao atualizar resultado de comparação', error });
//   }
// };

// export const patchComparisonResult = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = req.body;

//     const comparisonResult = await ComparisonResult.findByIdAndUpdate(id, updatedData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!comparisonResult) {
//       return res.status(404).json({ message: 'Resultado de comparação não encontrado' });
//     }

//     res.status(200).json(comparisonResult);
//   } catch (error) {
//     res.status(500).json({
//       message: 'Erro ao atualizar resultado de comparação',
//       error: error.message,
//     });
//   }
// };

// export const deleteComparisonResult = async (req, res) => {
//   try {
//     const comparisonResult = await ComparisonResult.findByIdAndDelete(req.params.id);
//     if (!comparisonResult) {
//       return res.status(404).json({ message: 'Resultado de comparação não encontrado' });
//     }
//     res.status(200).json({ message: 'Resultado de comparação deletado com sucesso' });
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao deletar resultado de comparação', error });
//   }
// };

// export default { createComparisonResult, getAllComparisonResults, getComparisonResultById, updateComparisonResult, patchComparisonResult, deleteComparisonResult };  
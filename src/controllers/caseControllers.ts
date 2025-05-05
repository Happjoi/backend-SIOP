// import Case from '../models/Case.js';
// import axios from 'axios';

// export const createCase = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { titulo, descricao, status, dataAbertura, dataFechamento, localizacao } = req.body;
//     const newCase = new Case({ titulo, descricao, status, dataAbertura, dataFechamento, localizacao });
//     await newCase.save();
//     res.status(201).json(newCase);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao criar o caso', error });
//   }
// };

// export const getAllCases = async (req, res) => {
//   try {
//     const cases = await Case.find();
//     res.status(200).json(cases);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao obter casos', error });
//   }
// };

// export const getCaseById = async (req, res) => {
//   try {
//     const caso = await Case.findById(req.params.id);
//     if (!caso) {
//       return res.status(404).json({ message: 'Caso não encontrado' });
//     }
//     res.status(200).json(caso);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao obter caso', error });
//   }
// };

// export const updateCase = async (req, res) => {
//   try {
//     const caso = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!caso) {
//       return res.status(404).json({ message: 'Caso não encontrado' });
//     }
//     res.status(200).json(caso);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao atualizar caso', error });
//   }
// };

// export const patchCase = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const updatedCase = await Case.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedCase) {
//       return res.status(404).json({ message: 'Caso não encontrado' });
//     }

//     res.status(200).json(updatedCase);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao atualizar o caso', error: error.message });
//   }
// };

// export const deleteCase = async (req, res) => {
//   try {
//     const caso = await Case.findByIdAndDelete(req.params.id);
//     if (!caso) {
//       return res.status(404).json({ message: 'Caso não encontrado' });
//     }
//     res.status(200).json({ message: 'Caso deletado com sucesso' });
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao deletar caso', error });
//   }
// };

// export const geocodeAddress = async (req, res) => {
//   const caseId = req.params.id; // Recebe o ID da URL

//   try {
//     // Busca o caso pelo ID
//     const caso = await Case.findById(caseId);

//     if (!caso) {
//       return res.status(404).json({ message: 'Caso não encontrado.' });
//     }

//     const endereco = caso.localizacao;

//     console.log('Endereço do caso:', endereco);

//     // Requisição para o Nominatim
//     const response = await axios.get('https://nominatim.openstreetmap.org/search', {
//       params: {
//         q: endereco,
//         format: 'json',
//         addressdetails: 1,
//         limit: 1,
//       },
//       headers: {
//         'User-Agent': 'siop/1.0 (felipe1ricardo158@gmail.com)' // Cabeçalho correto
//       }
//     });

//     if (response.data.length > 0) {
//       const { lat, lon, display_name } = response.data[0];
//       res.status(200).json({
//         latitude: lat,
//         longitude: lon,
//         endereco: display_name
//       });
//     } else {
//       res.status(404).json({ message: 'Endereço não encontrado no Nominatim.' });
//     }

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erro ao consultar o Nominatim ou buscar o caso.' });
//   }
// };


// export default { createCase, getAllCases, getCaseById, updateCase, patchCase, deleteCase, geocodeAddress };
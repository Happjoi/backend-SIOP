// import Evidence from '../models/Evidence.js';
// import User from '../models/User.js';

// import cloudinary from '../config/cloudinary.js';
// import streamifier from 'streamifier';

// export const uploadImage = async (req, res) => {
//   try {
//     const { coletadoPor, evidencias, tipo } = req.body;
//     console.log('req.file:', req.file); // Deve mostrar buffer, mimetype, etc
//     console.log('req.body:', req.body); // Deve mostrar campos adicionais
    
//     const streamUpload = () =>
//       new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: 'dontforensic' },
//           (error, result) => {
//             if (result) {
//               resolve(result);
//             } else {
//               reject(error);
//             }
//           }
//         );

//         streamifier.createReadStream(req.file.buffer).pipe(stream);
//       });

//     const result = await streamUpload();

//     const newImage = await Evidence.create({
//       imagemURL: result.secure_url,
//       publicId: result.public_id,
//       coletadoPor,
//       evidencias,
//       tipo,
//     });

//     res.status(201).json(newImage);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Erro no upload de imagem' });
//   }
// };

// export const deleteImage = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const image = await ImageEvidence.findById(id);
//     if (!image) return res.status(404).json({ message: 'Imagem não encontrada' });

//     // Deleta do Cloudinary
//     await cloudinary.uploader.destroy(image.publicId);

//     // Deleta do MongoDB
//     await ImageEvidence.findByIdAndDelete(id);

//     res.status(200).json({ message: 'Imagem deletada com sucesso' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erro ao deletar imagem' });
//   }
// };


// export const createEvidence = async (req, res) => {
//   try {
//     const { tipo, dataColeta, coletadoPor, publicId, imagemURL, conteudo } = req.body;
//     const user = await User.findById(coletadoPor);
//     if (!user) {
//       return res.status(404).json({ message: 'Usuário não encontrado' });
//     }
//     const newEvidence = new Evidence({ tipo, dataColeta, coletadoPor, publicId, imagemURL, conteudo });
//     await newEvidence.save();
//     res.status(201).json(newEvidence);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao criar evidência', error });
//   }
// };

// export const getAllEvidences = async (req, res) => {
//   try {
//     const evidences = await Evidence.find();
//     if (!evidences || evidences.length === 0) {
//       return res.status(404).json({ message: 'Nenhuma evidência encontrada' });
//     }
//     res.status(200).json(evidences);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao obter evidências', error });
//   }
// };

// export const getEvidenceById = async (req, res) => {
//   try {
//     const evidence = await Evidence.findById(req.params.id);
//     if (!evidence) {
//       return res.status(404).json({ message: 'Evidência não encontrada' });
//     }
//     res.status(200).json(evidence);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao obter evidência', error });
//   }
// };

// export const updateEvidence = async (req, res) => {
//   try {
//     const evidence = await Evidence.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!evidence) {
//       return res.status(404).json({ message: 'Evidência não encontrada' });
//     }
//     res.status(200).json(evidence);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao atualizar evidência', error });
//   }
// };

// export const patchEvidence = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = req.body;

//     const evidence = await Evidence.findByIdAndUpdate(id, updatedData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!evidence) {
//       return res.status(404).json({ message: 'Evidência não encontrada' });
//     }

//     res.status(200).json(evidence);
//   } catch (error) {
//     res.status(500).json({
//       message: 'Erro ao atualizar evidência',
//       error: error.message,
//     });
//   }
// };

// export const deleteEvidence = async (req, res) => {
//   try {
//     const evidence = await Evidence.findByIdAndDelete(req.params.id);
//     if (!evidence) {
//       return res.status(404).json({ message: 'Evidência não encontrada' });
//     }
//     res.status(200).json({ message: 'Evidência deletada com sucesso' });
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao deletar evidência', error });
//   }
// };

// export default { createEvidence, getAllEvidences, getEvidenceById, updateEvidence, patchEvidence, deleteEvidence, uploadImage, deleteImage };
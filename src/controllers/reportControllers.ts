// import Report from '../models/Report.js';


// export const createReport = async (req, res) => {
//   try {
//     const { titulo, conteudo, peritoResponsavel, dataCriacao, casoRelacionado } = req.body;
//     const newReport = new Report({ titulo, conteudo, peritoResponsavel, dataCriacao, casoRelacionado });
//     await newReport.save();
//     res.status(201).json(newReport);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao criar relatório', error });
//   }
// };

// export const getAllReports = async (req, res) => {
//   try {
//     const reports = await Report.find();
//     res.status(200).json(reports);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao obter relatórios', error });
//   }
// };

// export const getReportById = async (req, res) => {
//   try {
//     const report = await Report.findById(req.params.id);
//     if (!report) {
//       return res.status(404).json({ message: 'Relatório não encontrado' });
//     }
//     res.status(200).json(report);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao obter relatório', error });
//   }
// };

// export const updateReport = async (req, res) => {
//   try {
//     const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!report) {
//       return res.status(404).json({ message: 'Relatório não encontrado' });
//     }
//     res.status(200).json(report);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao atualizar relatório', error });
//   }
// };

// export const patchReport = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = req.body;

//     const report = await Report.findByIdAndUpdate(id, updatedData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!report) {
//       return res.status(404).json({ message: 'Relatório não encontrado' });
//     }

//     res.status(200).json(report);
//   } catch (error) {
//     res.status(500).json({
//       message: 'Erro ao atualizar relatório',
//       error: error.message,
//     });
//   }
// };

// export const deleteReport = async (req, res) => {
//   try {
//     const report = await Report.findByIdAndDelete(req.params.id);
//     if (!report) {
//       return res.status(404).json({ message: 'Relatório não encontrado' });
//     }
//     res.status(200).json({ message: 'Relatório deletado com sucesso' });
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao deletar relatório', error });
//   }
// };

// export default { createReport, getAllReports, getReportById, updateReport, patchReport, deleteReport };
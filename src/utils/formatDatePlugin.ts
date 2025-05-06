import { Schema } from 'mongoose';

/**
 * Plugin para formatar datas no retorno JSON do Mongoose.
 * Formata createdAt e updatedAt para 'DD/MM/YYYY HH:mm'.
 */
function formatDatePlugin(schema: Schema): void {
  const formatDate = (date: Date | string): string =>
    new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  schema.set('toJSON', {
    transform: (doc, ret) => {
      if (ret.createdAt) ret.createdAt = formatDate(ret.createdAt);
      if (ret.updatedAt) ret.updatedAt = formatDate(ret.updatedAt);
      return ret;
    },
  });
}

export default formatDatePlugin;

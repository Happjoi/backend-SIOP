import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";

// Middleware para validar a criação de evidência (POST /)
export const validateCreateEvidence = [
  body("tipo")
    .isIn(["Imagem", "Texto"])
    .withMessage('Tipo deve ser "Imagem" ou "Texto"'),
  body("coletadoPor")
    .isMongoId()
    .withMessage("ColetadoPor deve ser um ID válido"),
  body("vitima").isMongoId().withMessage("Vitima deve ser um ID válido"),
  body("categoria")
    .isString()
    .notEmpty()
    .withMessage("Categoria é obrigatória"),
  body("origem").isString().notEmpty().withMessage("Origem é obrigatória"),
  body("condicao")
    .isIn(["Bem conservada", "Danificada", "Parcial"])
    .withMessage("Condição inválida"),
  body("status")
    .isIn(["Aberto", "Em Análise", "Fechado"])
    .withMessage("Status inválido"),
  body("localizacao")
    .isString()
    .notEmpty()
    .withMessage("Localização é obrigatória"),
  // Campos opcionais
  body("observacoesTecnicas")
    .optional()
    .isString()
    .withMessage("Observações técnicas devem ser uma string"),
  body("descricaoDetalhada")
    .optional()
    .isString()
    .withMessage("Descrição detalhada deve ser uma string"),
  // Para tipo 'Texto'
  body("conteudo")
    .if(body("tipo").equals("Texto"))
    .isString()
    .notEmpty()
    .withMessage("Conteúdo é obrigatório para textos"),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Encerra o fluxo sem retornar Response
    }
    next();
  },
];

// Middleware para validar o upload de imagem (POST /upload)
export const validateUploadImage = [
  body("tipo")
    .equals("Imagem")
    .withMessage('Tipo deve ser "Imagem" para upload de imagem'),
  body("coletadoPor")
    .isMongoId()
    .withMessage("ColetadoPor deve ser um ID válido"),
  body("vitima").isMongoId().withMessage("Vitima deve ser um ID válido"),
  body("categoria")
    .isString()
    .notEmpty()
    .withMessage("Categoria é obrigatória"),
  body("origem").isString().notEmpty().withMessage("Origem é obrigatória"),
  body("condicao")
    .isIn(["Bem conservada", "Danificada", "Parcial"])
    .withMessage("Condição inválida"),
  body("status")
    .isIn(["Aberto", "Em Análise", "Fechado"])
    .withMessage("Status inválido"),
  body("localizacao")
    .isString()
    .notEmpty()
    .withMessage("Localização é obrigatória"),
  body("observacoesTecnicas")
    .optional()
    .isString()
    .withMessage("Observações técnicas devem ser uma string"),
  body("descricaoDetalhada")
    .optional()
    .isString()
    .withMessage("Descrição detalhada deve ser uma string"),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Encerra o fluxo sem retornar Response
    }
    next();
  },
];

// Middleware genérico para validar o parâmetro 'id'
export const validateId = [
  param("id").isMongoId().withMessage("ID inválido"),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Encerra o fluxo sem retornar Response
    }
    next();
  },
];

// Middleware para validar atualização completa (PUT /:id)
export const validateUpdateEvidence = [
  body("tipo")
    .isIn(["Imagem", "Texto"])
    .withMessage('Tipo deve ser "Imagem" ou "Texto"'),
  body("coletadoPor")
    .isMongoId()
    .withMessage("ColetadoPor deve ser um ID válido"),
  body("vitima").isMongoId().withMessage("Vitima deve ser um ID válido"),
  body("categoria")
    .isString()
    .notEmpty()
    .withMessage("Categoria é obrigatória"),
  body("origem").isString().notEmpty().withMessage("Origem é obrigatória"),
  body("condicao")
    .isIn(["Bem conservada", "Danificada", "Parcial"])
    .withMessage("Condição inválida"),
  body("status")
    .isIn(["Aberto", "Em Análise", "Fechado"])
    .withMessage("Status inválido"),
  body("localizacao")
    .isString()
    .notEmpty()
    .withMessage("Localização é obrigatória"),
  body("observacoesTecnicas")
    .optional()
    .isString()
    .withMessage("Observações técnicas devem ser uma string"),
  body("descricaoDetalhada")
    .optional()
    .isString()
    .withMessage("Descrição detalhada deve ser uma string"),
  body("conteudo")
    .if(body("tipo").equals("Texto"))
    .isString()
    .notEmpty()
    .withMessage("Conteúdo é obrigatório para textos"),
  body("imagemURL")
    .if(body("tipo").equals("Imagem"))
    .isURL()
    .withMessage("ImagemURL deve ser uma URL válida"),
  body("publicId")
    .if(body("tipo").equals("Imagem"))
    .isString()
    .notEmpty()
    .withMessage("PublicId é obrigatório para imagens"),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Encerra o fluxo sem retornar Response
    }
    next();
  },
];

// Middleware para validação parcial (PATCH /:id)
export const validatePatchEvidence = [
  body("tipo")
    .optional()
    .isIn(["Imagem", "Texto"])
    .withMessage('Tipo deve ser "Imagem" ou "Texto"'),
  body("coletadoPor")
    .optional()
    .isMongoId()
    .withMessage("ColetadoPor deve ser um ID válido"),
  body("vitima")
    .optional()
    .isMongoId()
    .withMessage("Vitima deve ser um ID válido"),
  body("categoria")
    .optional()
    .isString()
    .withMessage("Categoria deve ser uma string"),
  body("origem")
    .optional()
    .isString()
    .withMessage("Origem deve ser uma string"),
  body("condicao")
    .optional()
    .isIn(["Bem conservada", "Danificada", "Parcial"])
    .withMessage("Condição inválida"),
  body("status")
    .optional()
    .isIn(["Aberto", "Em Análise", "Fechado"])
    .withMessage("Status inválido"),
  body("localizacao")
    .optional()
    .isString()
    .withMessage("Localização deve ser uma string"),
  body("observacoesTecnicas")
    .optional()
    .isString()
    .withMessage("Observações técnicas devem ser uma string"),
  body("descricaoDetalhada")
    .optional()
    .isString()
    .withMessage("Descrição detalhada deve ser uma string"),
  body("conteudo")
    .optional()
    .isString()
    .withMessage("Conteúdo deve ser uma string"),
  body("imagemURL")
    .optional()
    .isURL()
    .withMessage("ImagemURL deve ser uma URL válida"),
  body("publicId")
    .optional()
    .isString()
    .withMessage("PublicId deve ser uma string"),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Encerra o fluxo sem retornar Response
    }
    next();
  },
];

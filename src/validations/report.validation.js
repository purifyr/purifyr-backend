const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReport = {
  body: Joi.object().keys({
    url: Joi.string().required().uri(), // L'URL est toujours requise
    cause: Joi.string().required().valid('harassment', 'terrorism', 'phishing', 'fraud', 'illegal_content', 'other'), // Cause du signalement
    description: Joi.string().optional(), // Description optionnelle
  }),
};

const getReports = {
  query: Joi.object().keys({
    url: Joi.string().uri(), // Filtrer par URL
    cause: Joi.string(), // Filtrer par cause
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId), // ID du signalement
  }),
};

const updateReport = {
  params: Joi.object().keys({
    reportId: Joi.required().custom(objectId), // ID du signalement
  }),
  body: Joi.object()
    .keys({
      cause: Joi.string().valid('harassment', 'terrorism', 'phishing', 'fraud', 'illegal_content', 'other'),
      status: Joi.string().valid('pending', 'reviewed', 'resolved', 'rejected'),
    })
    .min(1),
};

const deleteReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId), // ID du signalement
  }),
};

module.exports = {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
};

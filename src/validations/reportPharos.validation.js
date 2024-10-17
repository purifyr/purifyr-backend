const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReportPharos = {
  body: Joi.object().keys({
    url: Joi.string().uri().allow(null, ''),
    cause: Joi.string().required().valid('cyberbullying', 'misinformation', 'hate speech', 'identity theft', 'other'),
    description: Joi.string().optional(),
  }),
  file: Joi.object().optional(), // Validation pour le fichier d'image (optionnel)
};

const getReportsPharos = {
  query: Joi.object().keys({
    url: Joi.string().uri(),
    cause: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReportPharos = {
  params: Joi.object().keys({
    reportPharosId: Joi.string().custom(objectId),
  }),
};

const updateReportPharos = {
  params: Joi.object().keys({
    reportPharosId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      cause: Joi.string().valid('cyberbullying', 'misinformation', 'hate speech', 'identity theft', 'other'),
      status: Joi.string().valid('pending', 'reviewed', 'resolved', 'rejected'),
    })
    .min(1),
};

const deleteReportPharos = {
  params: Joi.object().keys({
    reportPharosId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReportPharos,
  getReportsPharos,
  getReportPharos,
  updateReportPharos,
  deleteReportPharos,
};

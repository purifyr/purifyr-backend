const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReport = {
  body: Joi.object().keys({
    url: Joi.string().required().uri(),
    cause: Joi.string().required().valid('harassment', 'terrorism', 'phishing', 'fraud', 'illegal_content', 'other'),
  }),
};

const getReports = {
  query: Joi.object().keys({
    url: Joi.string().uri(),
    cause: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId),
  }),
};

const updateReport = {
  params: Joi.object().keys({
    reportId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      url: Joi.string().uri(),
      cause: Joi.string().valid('harassment', 'terrorism', 'phishing', 'fraud', 'illegal_content', 'other'),
      status: Joi.string().valid('pending', 'reviewed', 'resolved', 'rejected'),
    })
    .min(1),
};

const deleteReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
};

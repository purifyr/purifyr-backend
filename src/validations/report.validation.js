const Joi = require('joi');

const createReport = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    createdBy: Joi.string().required(),
  }),
};

const getReports = {
  query: Joi.object().keys({
    title: Joi.string(),
    createdBy: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
  }),
};

const getReport = {
  params: Joi.object().keys({
    reportId: Joi.string().required(),
  }),
};

const updateReport = {
  params: Joi.object().keys({
    reportId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
    })
    .min(1),
};

const deleteReport = {
  params: Joi.object().keys({
    reportId: Joi.string().required(),
  }),
};

module.exports = {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
};

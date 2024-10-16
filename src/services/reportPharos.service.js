const httpStatus = require('http-status');
const { ReportPharos } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a new report for a URL
 * @param {ObjectId} userId - The user ID
 * @param {string} url - The URL to report (optional)
 * @param {string} cause - The reason for the report
 * @param {string} description - Optional description
 * @param {string} screenshot - Image encoded in base64 (optional)
 * @returns {Promise<Object>} - The result of the report creation
 */
const createReportPharos = async (userId, url, cause, description, screenshot) => {
  const alreadyReported = await ReportPharos.isAlreadyReported(userId, screenshot);
  if (alreadyReported) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have already reported this screenshot.');
  }

  if (!screenshot) {
    throw new ApiError('You need ton insert a screenshot !');
  }

  const report = await ReportPharos.addOrUpdateReport(userId, url, cause, description, screenshot);

  return report;
};

/**
 * Query for reports
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryReportsPharos = async (filter, options) => {
  return ReportPharos.paginate(filter, options);
};

/**
 * Get report by id
 * @param {ObjectId} id
 * @returns {Promise<ReportPharos>}
 */
const getReportPharosById = async (id) => {
  return ReportPharos.findById(id);
};

/**
 * Update report by id
 * @param {ObjectId} reportPharosId
 * @param {Object} updateBody
 * @returns {Promise<ReportPharos>}
 */
const updateReportPharosById = async (reportPharosId, updateBody) => {
  const reportPharos = await getReportPharosById(reportPharosId);
  if (!reportPharos) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  Object.assign(reportPharos, updateBody);
  await reportPharos.save();
  return reportPharos;
};

/**
 * Delete report by id
 * @param {ObjectId} reportPharosId
 * @returns {Promise<ReportPharos>}
 */
const deleteReportPharosById = async (reportPharosId) => {
  const reportPharos = await getReportPharosById(reportPharosId);
  if (!reportPharos) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  await reportPharos.remove();
  return reportPharos;
};

module.exports = {
  createReportPharos,
  queryReportsPharos,
  getReportPharosById,
  updateReportPharosById,
  deleteReportPharosById,
};

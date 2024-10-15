const httpStatus = require('http-status');
const { Report } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a new report for a URL
 * @param {ObjectId} userId - The user ID
 * @param {string} url - The URL to report
 * @param {string} cause - The reason for the report
 * @param {string} description - Optional description
 * @returns {Promise<Object>} - The result of the report creation
 */
const createReport = async (userId, url, cause, description) => {
  // Vérifie si l'utilisateur a déjà signalé l'URL
  const alreadyReported = await Report.isAlreadyReported(userId, url);
  if (alreadyReported) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have already reported this URL.');
  }
  const report = await Report.addReport(userId, url, cause, description);
  await Report.checkAndApproveUrl(url);
  return report;
};

/**
 * Query for reports
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryReports = async (filter, options) => {
  return Report.paginate(filter, options);
};

/**
 * Get report by id
 * @param {ObjectId} id
 * @returns {Promise<Report>}
 */
const getReportById = async (id) => {
  return Report.findById(id);
};

/**
 * Update report by id
 * @param {ObjectId} reportId
 * @param {Object} updateBody
 * @returns {Promise<Report>}
 */
const updateReportById = async (reportId, updateBody) => {
  const report = await getReportById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  Object.assign(report, updateBody);
  await report.save();
  return report;
};

/**
 * Delete report by id
 * @param {ObjectId} reportId
 * @returns {Promise<Report>}
 */
const deleteReportById = async (reportId) => {
  const report = await getReportById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  await report.remove();
  return report;
};

/**
 * Get distinct approved URLs
 * @returns {Promise<Array<String>>}
 */
const getDistinctApprovedUrls = async () => {
  return Report.getDistinctApprovedUrls();
};

module.exports = {
  createReport,
  queryReports,
  getReportById,
  updateReportById,
  deleteReportById,
  getDistinctApprovedUrls,
};

const httpStatus = require('http-status');
const Report = require('../models/report.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a report
 * @param {Object} reportBody
 * @returns {Promise<Report>}
 */
const createReport = async (reportBody) => {
  return Report.create(reportBody);
};

/**
 * Query for reports
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryReports = async (filter, options) => {
  return Report.find(filter, null, options);
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

module.exports = {
  createReport,
  queryReports,
  getReportById,
  updateReportById,
  deleteReportById,
};

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { reportService } = require('../services');
const ApiError = require('../utils/ApiError');

const createReport = catchAsync(async (req, res) => {
  const { url, cause, description } = req.body;
  const userId = req.user.id;

  const result = await reportService.createReport(userId, url, cause, description);

  res.status(httpStatus.CREATED).send(result);
});

const getReports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['url', 'cause']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.queryReports(filter, options);
  res.send(result);
});

const getDistinctApprovedUrls = catchAsync(async (req, res) => {
  const approvedUrls = await reportService.getDistinctApprovedUrls();
  res.status(httpStatus.OK).json({ approvedUrls });
});

const getReport = catchAsync(async (req, res) => {
  const report = await reportService.getReportById(req.params.reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  res.send(report);
});

const updateReport = catchAsync(async (req, res) => {
  const report = await reportService.updateReportById(req.params.reportId, req.body);
  res.send(report);
});

const deleteReport = catchAsync(async (req, res) => {
  await reportService.deleteReportById(req.params.reportId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createReport,
  getReports,
  getDistinctApprovedUrls,
  getReport,
  updateReport,
  deleteReport,
};

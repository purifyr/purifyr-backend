const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { reportPharosService } = require('../services');

const createReportPharos = catchAsync(async (req, res) => {
  const { url, cause, description } = req.body;
  const userId = req.user.id;

  let screenshot = null;
  if (req.file) {
    // Convertir l'image en base64
    screenshot = req.file.buffer.toString('base64');
  }

  const result = await reportPharosService.createReportPharos(userId, url, cause, description, screenshot);
  res.status(httpStatus.CREATED).send(result);
});

const getReportsPharos = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['url', 'cause']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportPharosService.queryReportsPharos(filter, options);
  res.send(result);
});

const getReportPharos = catchAsync(async (req, res) => {
  const reportPharos = await reportPharosService.getReportPharosById(req.params.reportPharosId);
  res.send(reportPharos);
});

const updateReportPharos = catchAsync(async (req, res) => {
  const reportPharos = await reportPharosService.updateReportPharosById(req.params.reportPharosId, req.body);
  res.send(reportPharos);
});

const deleteReportPharos = catchAsync(async (req, res) => {
  await reportPharosService.deleteReportPharosById(req.params.reportPharosId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createReportPharos,
  getReportsPharos,
  getReportPharos,
  updateReportPharos,
  deleteReportPharos,
};

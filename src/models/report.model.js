const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const reportSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Invalid URL');
        }
      },
    },
    reportsCount: {
      type: Number,
      default: 0,
    },
    reportedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        reportDate: {
          type: Date,
          default: Date.now,
        },
        cause: {
          type: String,
          enum: ['harassment', 'terrorism', 'phishing', 'fraud', 'illegal_content', 'other'],
          required: true,
        },
        description: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'rejected', 'approved'],
      default: 'approved',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.plugin(toJSON);
reportSchema.plugin(paginate);

/**
 * Check if the user has already reported this URL
 * @param {ObjectId} userId - The ID of the user
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>}
 */
reportSchema.statics.isAlreadyReported = async function (userId, url) {
  const report = await this.findOne({ url });
  if (report) {
    // Vérifie si l'utilisateur a déjà signalé cette URL
    return report.reportedBy.some((reportEntry) => reportEntry.userId.toString() === userId.toString());
  }
  return false;
};

/**
 * Increment the report count for an existing URL and add user details
 * @param {ObjectId} userId - The ID of the user
 * @param {string} url - The URL to update
 * @param {string} cause - The reason for the report
 * @param {string} description - Optional description
 * @returns {Promise<void>}
 */
reportSchema.statics.addReport = async function (userId, url, cause, description) {
  // Checks if the report already exists
  const report = await this.findOne({ url });
  if (report) {
    report.reportedBy.push({ userId, cause, description });
    report.reportsCount += 1;
    await report.save();
    return report;
  }
  // Create a new report if one does not exist for this URL
  const newReport = await this.create({
    url,
    reportsCount: 1,
    reportedBy: [{ userId, cause, description }],
  });
  return newReport;
};

/**
 * Check if a URL should be automatically approved
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Whether the URL should be approved or not
 */
reportSchema.statics.checkAndApproveUrl = async function (url) {
  const report = await this.findOne({ url });
  if (report && report.reportsCount >= 5) {
    report.status = 'approved';
    await report.save();
    return true; // URL approuvée
  }
  return false; // URL pas encore approuvée
};

/**
 * Retrieve distinct approved URLs
 */
reportSchema.statics.getDistinctApprovedUrls = async function () {
  return this.distinct('url', { status: 'approved' });
};

/**
 * @typedef Report
 */
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;

const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const reportSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    url: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Invalid URL');
        }
      },
    },
    cause: {
      type: String,
      enum: ['harassment', 'terrorism', 'phishing', 'fraud', 'illegal_content', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'rejected'],
      default: 'pending',
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
  const report = await this.findOne({ user: userId, url });
  return !!report;
};

/**
 * Count reports by URL
 * @param {string} url - The URL to count reports for
 * @returns {Promise<number>} - The count of reports for the given URL
 */
reportSchema.statics.countReportsByUrl = async function (url) {
  return this.countDocuments({ url });
};

/**
 * Check if a URL should be automatically approved
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Whether the URL should be approved or not
 */
reportSchema.statics.checkAndApproveUrl = async function (url) {
  const reportCount = await this.countReportsByUrl(url);
  if (reportCount >= 5) {
    // Update the status of all reports for this URL to 'approved'
    await this.updateMany({ url }, { status: 'approved' });
    return true; // URL approved
  }
  return false; // URL not yet approved
};

/**
 * Static method to retrieve distinct approved URLs
 */
reportSchema.statics.getDistinctApprovedUrls = async function () {
  return this.distinct('url', { status: 'approved' });
};

/**
 * @typedef Report
 */
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;

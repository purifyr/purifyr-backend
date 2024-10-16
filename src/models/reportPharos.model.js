const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const reportPharosSchema = mongoose.Schema(
  {
    screenshot: {
      type: Buffer,
      required: false,
    },
    cause: {
      type: String,
      enum: ['cyberbullying', 'misinformation', 'hate speech', 'identity theft', 'other'],
      required: true,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
      required: false, // L'URL est optionnelle
      default: null,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error('Invalid URL');
        }
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'rejected', 'approved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

reportPharosSchema.plugin(toJSON);
reportPharosSchema.plugin(paginate);

/**
 * Check if the user has already reported this screenshot
 * @param {ObjectId} userId - The ID of the user
 * @param {Buffer} screenshot - The screenshot to check
 * @returns {Promise<boolean>}
 */
reportPharosSchema.statics.isAlreadyReported = async function (userId, screenshot) {
  const report = await this.findOne({ screenshot, userId });
  return !!report;
};

/**
 * Recherche un rapport par URL ou capture d'écran
 * @param {string} url - L'URL optionnelle
 * @param {Buffer} screenshot - La capture d'écran optionnelle
 * @returns {Promise<ReportPharos>} - Le rapport correspondant ou null
 */
reportPharosSchema.statics.findReport = async function (url, screenshot) {
  if (url) {
    return this.findOne({ url });
  }
  if (screenshot) {
    return this.findOne({ screenshot });
  }
  return null;
};

/**
 * Fonction pour ajouter un rapport ou mettre à jour un rapport existant
 * @param {ObjectId} userId - L'ID de l'utilisateur
 * @param {string} url - L'URL optionnelle du rapport
 * @param {string} cause - La raison du rapport
 * @param {string} description - La description optionnelle
 * @param {Buffer} screenshot - La capture d'écran optionnelle
 * @returns {Promise<ReportPharos>}
 */
reportPharosSchema.statics.addOrUpdateReport = async function (userId, url, cause, description, screenshot) {
  const existingReport = await this.findReport(url, screenshot);

  if (existingReport) {
    // Si un rapport existe déjà, on renvoie une erreur pour éviter les doublons
    throw new Error('This report has already been submitted.');
  }

  // Création d'un nouveau rapport
  const newReport = await this.create({
    userId,
    url,
    cause,
    description,
    screenshot,
  });

  return newReport;
};

/**
 * @typedef ReportPharos
 */
const ReportPharos = mongoose.model('ReportPharos', reportPharosSchema);

module.exports = ReportPharos;

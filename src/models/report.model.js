const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  contentType: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;

const mongoose = require('mongoose');

// Define the schema for wellness report
const wellnessReportSchema = new mongoose.Schema({
    ageRange: { type: String, required: true },
    symptom: { type: String, required: true },
    wellness: { type: String, required: true }
});

// Create a model based on the schema
const WellnessReport = mongoose.model('WellnessReport', wellnessReportSchema);

// Export the model
module.exports = WellnessReport;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (if you have an 'index.html')
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/health').then(() => console.log("MongoDB Connected")).catch(err => console.log("MongoDB Error:", err));

// WellnessReport Schema
const wellnessReportSchema = new mongoose.Schema({
    ageRange: String,
    symptom: String,
    wellness: String
});

const WellnessReport = mongoose.model('WellnessReport', wellnessReportSchema);

// Get the age range based on input age
function getAgeRange(age) {
    if (age >= 1 && age < 5) return "1-5";
    if (age >= 5 && age < 10) return "5-10";
    if (age >= 10 && age < 20) return "10-20";
    if (age >= 20 && age < 30) return "20-30";
    if (age >= 30 && age < 40) return "30-40";
    if (age >= 40 && age < 50) return "40-50";
    if (age >= 50 && age < 60) return "50-60";
    return "60+"; // Default age range if none of the above match
}


// Endpoint to receive form data and fetch wellness report
app.post('/api/report', async (req, res) => {
    const { name, age, gender, symptoms } = req.body;
    const ageRange = getAgeRange(age);  // Convert age to age range
    const symptom = symptoms.toLowerCase().trim();  // Normalize symptom to lowercase

    try {
        // Find wellness report in MongoDB with case-insensitive search for symptoms
        const report = await WellnessReport.findOne({
            ageRange,
            symptom: new RegExp('^' + symptom + '$', 'i') // Case-insensitive search
        });

        if (!report) {
            return res.status(404).json({ report: "No wellness data found for the input." });
        }

        // Send the wellness report back
        res.json({
            name,
            age,
            gender,
            symptom,
            wellnessReport: report.wellness
        });
    } catch (err) {
        console.error("Error fetching report:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

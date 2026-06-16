const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── AI Trip Generate karo ───────────────────────────────────
// Firebase mein ye frontend se directly Gemini call hota tha
// Ab: POST /api/ai/generate-trip (secure, server-side)
const generateTrip = async (req, res, next) => {
  try {
    const { location, noOfDays, budget, noOfPeople } = req.body;

    if (!location || !noOfDays || !budget || !noOfPeople) {
      return res.status(400).json({
        success: false,
        message: "Location, days, budget aur people daalo!",
      });
    }

    // Wohi prompt jo tumhare frontend mein tha - ab server pe safe hai
    const prompt = `
  Plan a detailed trip in proper JSON format for the following details:
  
  Destination: ${location}
  Days: ${noOfDays}
  Budget: ${budget}
  Travel with: ${noOfPeople}
  
  Please suggest a different hotel for each day of the trip based on the location and budget.
  For each hotel, ALSO include its accurate full address (not just city, but street-level address if possible).
  
  Respond ONLY in this exact JSON format (no markdown, no explanation):
  
  {
    "days": [
      {
        "day": 1,
        "place": "Place Name",
        "activities": ["activity1", "activity2"],
        "hotel": "Hotel name for day 1",
        "hotelAddress": "Full address of the hotel for day 1",
        "estimatedCost": "$100"
      }
    ],
    "totalEstimatedCost": "$450",
    "tips": ["Tip1", "Tip2"]
  }
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON clean karo (Gemini kabhi kabhi ```json wrapper deta hai)
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let tripData;
    try {
      tripData = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({
        success: false,
        message: "AI ka response parse nahi hua. Dobara try karo!",
        raw: cleaned,
      });
    }

    res.json({
      success: true,
      message: "Trip generate ho gayi!",
      tripData,
    });
  } catch (error) {
    if (error.message?.includes("API_KEY")) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key galat hai ya missing hai!",
      });
    }
    next(error);
  }
};

module.exports = { generateTrip };

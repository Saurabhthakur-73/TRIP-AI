import React, { useEffect, useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '@/components/ui/button';
import { SelectBudgetOptions, SelectTravelsList } from '../constants/Options';
import logo  from '../assets/coollogo_com-2563197.png'
import { doc, getFirestore, setDoc } from 'firebase/firestore'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { db } from '@/Service/FirebaseConfig';
import { useNavigate } from 'react-router-dom';


function Idx() {
  const [input, setInput] = useState('');
  const [tripPlan, setTripPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDiglouge, setopenDiglouge] = useState(false);

  const navigtor = useNavigate()

  const [formData, setFormData] = useState({
    suggestions: [],
    NumOfdays: '',
    Budget: '',
    TravelWith: '',
    Destination: null,
  });

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormComplete = () =>
    formData.Destination && formData.NumOfdays && formData.Budget && formData.TravelWith;

  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user');
  
    if (!user) {
      setopenDiglouge(true);
      return;
    }
  
    if (!isFormComplete()) {
      alert('Please fill all fields before generating the trip.');
      return;
    }
  
    setLoading(true);
  
    const prompt = `
      Plan a detailed trip in proper JSON format for the following details:
      
      Destination: ${formData.Destination.label}
      Days: ${formData.NumOfdays}
      Budget: ${formData.Budget}
      Travel with: ${formData.TravelWith}
      
      Please suggest a **different hotel for each day** of the trip based on the location and budget.
      
      For each hotel, ALSO include its **accurate full address** (not just city, but street-level address if possible).
      
      For each hotel, ALSO provide an **image of the hotel** (with a URL to the image).
      
      Respond ONLY in this exact JSON format (no markdown, no explanation):
      
      {
        "days": [
          {
            "day": 1,
            "place": "Place Name",
            "activities": ["activity1", "activity2"],
            "hotel": "Hotel name for day 1",
            "hotelAddress": "Full address of the hotel for day 1",
            "hotelImage": "URL of the hotel image for day 1", // Gemini se hotel ka image URL milega
            "estimatedCost": "$100"
          },
          {
            "day": 2,
            "place": "Place Name",
            "activities": ["activity1", "activity2"],
            "hotel": "Hotel name for day 2",
            "hotelAddress": "Full address of the hotel for day 2",
            "hotelImage": "URL of the hotel image for day 2", // Gemini se hotel ka image URL milega
            "estimatedCost": "$120"
          },
          {
            "day": 3,
            "place": "Place Name",
            "activities": ["activity1", "activity2"],
            "hotel": "Hotel name for day 3",
            "hotelAddress": "Full address of the hotel for day 3",
            "hotelImage": "URL of the hotel image for day 3", // Gemini se hotel ka image URL milega
            "estimatedCost": "$130"
          }
        ],
        "totalEstimatedCost": "$450",
        "tips": ["Tip1", "Tip2"]
      }`;
  
    try {
      const { GoogleGenAI } = await import('https://cdn.jsdelivr.net/npm/@google/genai@latest/+esm');
  
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      });
  
      const result = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });
  
      let rawResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("Raw Response:\n", rawResponse);
  
      //  Remove markdown wrappers like ```json or ```
      rawResponse = rawResponse.replace(/```json|```/g, '').trim();
  
      let parsedResponse = null;
  
      try {
        parsedResponse = JSON.parse(rawResponse); //  Now safe to parse
        setTripPlan(JSON.stringify(parsedResponse, null, 2));
        await SaveAItrip(parsedResponse);
      } catch (jsonErr) {
        console.error("Failed to parse JSON from Gemini:", jsonErr);
        alert("AI did not return valid JSON. Please try again.");
      }
  
    } catch (error) {
      console.error("Gemini Error:", error);
      alert("Something went wrong while generating trip plan.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      getUserProfile(tokenResponse); // call here
    },
    onError: (error) => console.log(error)
  });
  

  const getUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    }).then((res) => {
      console.log("Google User Info:", res.data);
  
      //  Save to localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
  
      //  Close dialog
      setopenDiglouge(false);
    }).catch((err) => {
      console.error("Error fetching user info:", err);
    });
  }

  const SaveAItrip=async(TripData)=>{

    setLoading(true);
    const user =JSON.parse(localStorage.getItem('user'))
    const docId = Date.now().toString()

    await setDoc(doc(db, "AITRIPS", docId), {
     userselection : formData,
     tripdata : TripData,
     userEmail : user?.email,
     id : docId
  });
  setLoading(false);
  navigtor('/viewtrip/'+docId)

}
  

  useEffect(() => {
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      if (input.length < 2) {
        handleInputChange('suggestions', []);
        return;
      }

      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&limit=5&format=json&apiKey=${import.meta.env.VITE_GEO_KEY}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        handleInputChange('suggestions', data.results || []);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Geoapify error:', err);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [input]);

  const handleSelectSuggestion = (place) => {
    const locationObject = {
      label: place.formatted,
      place_id: place.place_id,
    };
    setInput(place.formatted);
    handleInputChange('Destination', locationObject);
    handleInputChange('suggestions', []);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.autocomplete-wrapper')) {
        handleInputChange('suggestions', []);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10">
      <h2 className="font-bold text-3xl ml-20 mb-3">Tell us your travel preferences</h2>
      <p className="text-xl ml-20">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences
      </p>

      <div className="mt-12">
        
        {/* Destination Input with Autocomplete */}
        <h2 className="text-2xl ml-20">What is your destination of choice?</h2>
        <div className="autocomplete-wrapper relative ml-20 mt-4 max-w-md">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter destination"
          />
          {formData.suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border mt-1 max-h-60 overflow-y-auto rounded shadow-md">
              {formData.suggestions.map((s, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(s)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {s.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Number of Days */}
        <div>
          <h2 className="text-2xl ml-20 mt-5">How many days are you planning your trip?</h2>
          <div className="autocomplete-wrapper relative ml-20 mt-4 max-w-md">
            <Input
              placeholder="Ex. 3 days "
              type='text'
              onChange={(e) => handleInputChange('NumOfdays', e.target.value)}
            />
          </div>
        </div>

        {/* Budget Options */}
        <div>
          <h2 className="text-2xl ml-20 mt-5">What is Your Budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-3 ml-20">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('Budget', item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-2xl ${
                  formData.Budget === item.title ? 'border-blue-800' : ''
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Travel With Options */}
        <div>
          <h2 className="text-2xl ml-20 mt-5">Who do you plan on traveling with?</h2>
          <div className="grid grid-cols-3 gap-5 mt-3 ml-20">
            {SelectTravelsList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('TravelWith', item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-2xl ${
                  formData.TravelWith === item.people ? 'border-blue-800' : ''
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="my-10 justify-end flex">
        <Button
          onClick={onGenerateTrip}
          disabled={!isFormComplete() || loading}
          className={`${!isFormComplete() || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Generating...' : 'Generate Trip...'}
        </Button>
      </div>


      <Dialog open={openDiglouge} onOpenChange={setopenDiglouge}>
          <DialogContent>
            <DialogHeader>
                <DialogDescription>
                  <img src={logo} alt="logo" className='h-12 w-auto' />
                  <Button 
                  onClick={login}
                  className="w-full mt-5">Sign in with google</Button>
                </DialogDescription>
            </DialogHeader>
          </DialogContent>
      </Dialog>

    </div>
  );
}

export default Idx;

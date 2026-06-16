import React, { useEffect, useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '@/components/ui/button';
import { SelectBudgetOptions, SelectTravelsList } from '../constants/Options';
import logo from '../assets/coollogo_com-2563197.png'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE, { saveToken, authHeader } from '@/Service/api';  // ← naya import

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

  // ─── Trip Generate karo (ab backend se) ──────────────────
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

    try {
      // Step 1: Backend se AI trip generate karo (Gemini API key ab server pe safe hai)
      const aiRes = await fetch(`${API_BASE}/ai/generate-trip`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
          location: formData.Destination.label,
          noOfDays: formData.NumOfdays,
          budget: formData.Budget,
          noOfPeople: formData.TravelWith,
        }),
      });

      const aiData = await aiRes.json();

      if (!aiData.success) {
        alert('Trip generate nahi hui: ' + aiData.message);
        return;
      }

      // Step 2: Trip MongoDB mein save karo
      const tripRes = await fetch(`${API_BASE}/trips`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
          userSelection: {
            Destination: formData.Destination,
            NumOfdays: formData.NumOfdays,
            Budget: formData.Budget,
            TravelWith: formData.TravelWith,
          },
          tripData: aiData.tripData,
        }),
      });

      const tripData = await tripRes.json();

      if (!tripData.success) {
        alert('Trip save nahi hui!');
        return;
      }

      // Step 3: View trip page pe navigate karo
      navigtor('/viewtrip/' + tripData.trip._id);

    } catch (error) {
      console.error("Error:", error);
      alert("Kuch gadbad ho gayi. Dobara try karo!");
    } finally {
      setLoading(false);
    }
  };

  // ─── Google Login (ab JWT token save hoga) ───────────────
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      getUserProfile(tokenResponse);
    },
    onError: (error) => console.log(error)
  });

  const getUserProfile = async (tokenInfo) => {
    try {
      // Google se user info lo
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: 'application/json'
          }
        }
      );

      const googleUser = res.data;

      // Backend se JWT token lo
      // Note: Google access token nahi, ID token chahiye backend ko
      // Isliye abhi user info localStorage mein save karte hain
      // aur ek dummy JWT banate hain jab tak full OAuth setup ho
      localStorage.setItem("user", JSON.stringify(googleUser));

      // Backend mein bhi register/login karo
      const backendRes = await fetch(`${API_BASE}/auth/google-userinfo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture,
          googleId: googleUser.id,
        }),
      });

      const backendData = await backendRes.json();

      if (backendData.success) {
        saveToken(backendData.token); // JWT token save karo
        localStorage.setItem("user", JSON.stringify(backendData.user));
      }

      setopenDiglouge(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // ─── Location Autocomplete ────────────────────────────────
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
              placeholder="Ex. 3 days"
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
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-2xl ${formData.Budget === item.title ? 'border-blue-800' : ''}`}
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
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-2xl ${formData.TravelWith === item.people ? 'border-blue-800' : ''}`}
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
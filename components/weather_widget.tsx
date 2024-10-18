"use client";
import { useState, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

export default function Weatherwidget() {
  const [location, setLocation] = useState<string>(""); 
  const [weather, setWeather] = useState<WeatherData | null>(null); 
  const [error, setError] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please Enter a Valid Location.");
      setWeather(null);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) {
        throw new Error("City not found.");
      }
      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  function getTemperatureMessage(temperature: number, unit: string): string {
    switch (true) {
      case temperature < 0:
        return `It's freezing at ${temperature}°${unit}! Bundle up!`;
      case temperature < 10:
        return `It's quite cold at ${temperature}°${unit}. Wear warm clothes.`;
      case temperature < 20:
        return `The temperature is ${temperature}°${unit}. Comfortable for a light jacket.`;
      case temperature < 30:
        return `It's a pleasant ${temperature}°${unit}. Enjoy the nice weather!`;
      default:
        return `It's hot at ${temperature}°${unit}. Stay hydrated!`;
    }
  }

  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Expect some clouds and sunshine.";
      case "cloudy":
        return "It's cloudy today.";
      case "overcast":
        return "The sky is overcast.";
      case "rain":
        return "Don't forget your umbrella! It's raining.";
      case "thunderstorm":
        return "Thunderstorms are expected today.";
      case "snow":
        return "Bundle up! It's snowing.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return description;
    }
  }

  function getLocationMessage(location: string): string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;
    return `${location} ${isNight ? "at Night" : "During the Day"}`;
  }

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?cs=srgb&dl=pexels-pixabay-209831.jpg&fm=jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card
        className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-xl border border-white/20"
        style={{ padding: "20px" }}
      >
        <CardHeader className="text-gray-200">
          <CardTitle className="text-3xl font-bold drop-shadow-md">Weather Widget</CardTitle>
          <CardDescription className="text-lg drop-shadow-sm">
            Search for the current weather conditions in your city.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter a city name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border rounded-md w-full bg-white bg-opacity-30 text-gray-800 placeholder-gray-200"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-md rounded-md"
            >
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </form>

          {error !== null && <div className="mt-4 text-red-400">{error}</div>}

          {weather && (
            <div className="mt-4 grid gap-4 text-left text-gray-100 drop-shadow-md">
              <div className="flex items-center gap-2">
                <ThermometerIcon className="w-6 h-6 text-yellow-400" />
                <span className="font-medium">
                  {getTemperatureMessage(weather.temperature, weather.unit)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6 text-blue-300" />
                <span className="font-medium">{getWeatherMessage(weather.description)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-green-300" />
                <span className="font-medium">{getLocationMessage(weather.location)}</span> 
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

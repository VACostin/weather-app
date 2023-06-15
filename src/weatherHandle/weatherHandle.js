const BASE_URL = "http://api.weatherapi.com/v1/";
const SEARCH = "search.json?key=";
const CURRENT = "current.json?key=";
const API_KEY = "8126843678b242fdb4b05505231406";
const DEFAULT_CITY = "New York";
const DEFAULT_COUNTRY = "United States of America";
const DAY_DICT = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export default function weatherHandle() {
  const cityCountry = document.querySelector("#cityCountry");
  const today = document.querySelector("#today");
  const temperature = document.querySelector("#temperature");

  async function getCountryObjects(city) {
    const requestString = `${BASE_URL + SEARCH + API_KEY}&q=${city}`;
    const response = await fetch(requestString, { mode: "cors" });
    const result = await response.json();
    const countryObjects = [];
    if (Array.isArray(result))
      result.forEach((object) => {
        countryObjects.push({
          country: object.country,
          url: object.url,
        });
      });
    else
      countryObjects.push({
        country: result.country,
        url: result.url,
      });
    return countryObjects;
  }

  async function getWeatherObject(url) {
    const requestString = `${BASE_URL + CURRENT + API_KEY}&q=${url}`;
    const response = await fetch(requestString, { mode: "cors" });
    const result = await response.json();
    const weatherObject = {
      city: result.location.name,
      country: result.location.country,
      localtime: result.location.localtime_epoch,
      temp: result.current.temp_c,
    };
    return weatherObject;
  }

  function printInformation(weatherObject, dayOfWeek) {
    cityCountry.textContent = `${weatherObject.city}, ${weatherObject.country}`;
    today.textContent = dayOfWeek;
    temperature.textContent = `${weatherObject.temp}°C`;
  }

  async function init() {
    const countryObjects = await getCountryObjects(DEFAULT_CITY);
    let index = 0;
    countryObjects.every((object) => {
      if (object.country === DEFAULT_COUNTRY) return false;
      index += 1;
      return true;
    });
    const { url } = countryObjects[index];
    const weatherObject = await getWeatherObject(url);
    const dayOfWeek =
      DAY_DICT[(Math.floor(weatherObject.localtime / 86400) + 4) % 7];

    printInformation(weatherObject, dayOfWeek);
  }


  async function search(item) {
    const { city } = item;
    const { country } = item;
    const countryObjects = await getCountryObjects(city);
    let index = 0;
    countryObjects.every((object) => {
      if (object.country.includes(country)) return false;
      index += 1;
      return true;
    });
    if (index !== countryObjects.length) {
      const { url } = countryObjects[index];
      const weatherObject = await getWeatherObject(url);
      const dayOfWeek =
        DAY_DICT[(Math.floor(weatherObject.localtime / 86400) + 4) % 7];

      printInformation(weatherObject, dayOfWeek);
    }
    else {
      const weatherObject = {
        city: "Antarctica",
        country: "Antarctica",
        temp: "-50",
      };
      const myDate = new Date().getDay();
      const dayOfWeek = DAY_DICT[myDate];
      printInformation(weatherObject, dayOfWeek);
    } 
  }
  return {
    init,
    search,
  };
}

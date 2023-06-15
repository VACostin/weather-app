import cityCountries from "./city-countries.json";
import countryCapitals from "../country-capitals.json";

const itemCAP = 5;

export default function processInput(input) {
  function populateList(itemList, cityObject) {
    if (Array.isArray(cityObject.countryList)) {
      cityObject.countryList.every((country) => {
        itemList.push({
          city: cityObject.cityName,
          country,
        });
        if (itemList.length >= itemCAP) return false;
        return true;
      });
    } else
      itemList.push({
        city: cityObject.cityName,
        country: cityObject.countryList,
      });
    if (itemList.length >= itemCAP) return false;
    return true;
  }

  function lookForCities(itemList, textInput) {
    Object.keys(cityCountries).every((city) => {
      if (city.includes(textInput) && city !== textInput)
        return populateList(itemList, cityCountries[city]);
      return true;
    });
  }

  function populateListWithSuggestions(itemList, countryObject) {
    if (countryObject.capital !== null && countryObject.capital !== undefined)
      itemList.push({
        city: countryObject.capital,
        country: countryObject.countryName,
      });
    return true;
  }

  function lookForCapitals(itemList, textInput) {
    Object.keys(countryCapitals).every((country) => {
      if (country.includes(textInput))
        return populateListWithSuggestions(itemList, countryCapitals[country]);
      if (itemList.length < itemCAP) return true;
      return false;
    });
  }

  function lookForExactName(itemList, textInput) {
    const exactQuerry = cityCountries[textInput];
    if (exactQuerry !== undefined && exactQuerry !== null) {
      if (Array.isArray(exactQuerry.countryList))
        exactQuerry.countryList.forEach((country) =>
          itemList.push({
            city: exactQuerry.cityName,
            country,
          })
        );
      else
        itemList.push({
          city: exactQuerry.cityName,
          country: exactQuerry.countryList,
        });
    }
  }

  const textInput = input.toLowerCase().replace(/ /g, "");
  if (textInput === "") return [];
  const itemList = [];
  lookForExactName(itemList, textInput);
  lookForCities(itemList, textInput);
  if (itemList.length < itemCAP) lookForCapitals(itemList, textInput);

  return itemList;
}

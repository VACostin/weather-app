import urbanAreas from "./urbanAreas.json";
import countryCapitals from "../country-capitals.json";
import DEFAULT_IMAGE from "./city-road-turn-empty-street-with-transport-highway_1441-3838.jpg";

const IMAGE_SUFFIX = "images/";
const ANIMATION_DURATION = 1500;
const DEFAULT_CITY = "New York";
const DEFAULT_COUNTRY = "United States of America";
const DEFAULT_ITEM = {
  city: DEFAULT_CITY,
  country: DEFAULT_COUNTRY,
};

export default function imageHandle() {
  const img = document.querySelector("#backgroundImage");
  const footNotes = document.querySelector("#footNotes");

  function fadeOut() {
    img.classList.remove("animationFadeIn");
    img.classList.add("animationFadeOut");
  }

  function fadeIn() {
    img.classList.remove("animationFadeOut");
    img.classList.add("animationFadeIn");
  }

  async function transitionImage(imageSource) {
    fadeOut();
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, ANIMATION_DURATION));
    img.src = imageSource;
    fadeIn();
  }

  function getUrbanLink(city) {
    return urbanAreas[city];
  }

  function getCapital(country) {
    return countryCapitals[country].capital;
  }

  async function queryData(href) {
    const request = href + IMAGE_SUFFIX;
    const response = await fetch(request, { mode: "cors" });
    const urbanData = await response.json();
    const link = urbanData.photos[0].image.mobile;
    return link;
  }

  async function search(item) {
    const country = item.country.toLowerCase().replace(/ /g, "");
    let imageSource = DEFAULT_IMAGE;
    let { city } = item;
    let href = getUrbanLink(city);
    if (href === undefined) {
      city = getCapital(country);
      href = getUrbanLink(city);
    }
    if (href !== undefined) imageSource = await queryData(href);
    transitionImage(imageSource);
    if (imageSource !== DEFAULT_IMAGE)
      footNotes.textContent = `Image Location: ${city}`;
    else footNotes.textContent = `Sorry, this image will have to makedo`;
  }

  function init() {
    search(DEFAULT_ITEM);
  }

  return {
    init,
    search,
  };
}

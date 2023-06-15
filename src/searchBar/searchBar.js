import processInput from "./processInput";

const TIME_DELAY = 300;

export default function searchBar(onSearchWeather, onSearchImage) {
  const leftSide = document.querySelector("#leftSide");
  const searchBarInput = document.querySelector("#searchBar");
  let pendingSearches = 0;
  let dropDown = document.querySelector("#dropdownMenu");

  function replaceDropdown() {
    if (dropDown !== null) dropDown.remove();
    dropDown = dropDown.cloneNode(false);
    leftSide.appendChild(dropDown);
  }

  function onLocationSelect(item) {
    onSearchWeather(item);
    onSearchImage(item);
    replaceDropdown();
    searchBarInput.value = "";
  }

  function getData(input) {
    return new Promise((resolve) => {
      const data = processInput(input);
      setTimeout(() => {
        resolve(data);
      }, TIME_DELAY);
    });
  }

  function addAnchor(item) {
    const div = document.createElement("div");
    const anchor = document.createElement("a");
    anchor.textContent = `${item.city}, ${item.country}`;
    anchor.addEventListener("click", () => onLocationSelect(item));
    div.appendChild(anchor)
    dropDown.appendChild(div);
  }

  async function generateDropdown(input) {
    pendingSearches += 1;
    const itemList = await getData(input);
    if (pendingSearches === 1) {
      replaceDropdown();
      if (itemList.length === 0 && input.replace(/\s/g, '').length)
        itemList[0] = {
          city: "No results",
          country: "sorry :(",
        };
      itemList.forEach((item) => addAnchor(item));
    }
    pendingSearches -= 1;
  }

  searchBarInput.addEventListener("input", () =>
    generateDropdown(searchBarInput.value)
  );
}

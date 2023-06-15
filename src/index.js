import "./styles.css";
import "./reset.css";
import searchBar from "./searchBar/searchBar";
import imageHandle from "./imageHandle/imageHandle";
import weatherHandle from "./weatherHandle/weatherHandle";

function init () {
  imageHandle().init();
  weatherHandle().init();
}

init();
searchBar(imageHandle().search, weatherHandle().search);

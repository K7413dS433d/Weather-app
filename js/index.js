import { getData, getDay, getMonth, getWindDirection } from "./app.js";

const days = document.querySelectorAll(".day");
const temperatures = document.querySelectorAll(".temp");
const tempIcons = document.querySelectorAll(".tmp-img img");
const weatherStatus = document.querySelectorAll(".status");
const currentDayInfo = document.querySelectorAll(".footer div p");
const maxTempComingDays = document.querySelectorAll(".tmp-img p:nth-child(3)");
const cityElement = document.querySelector(".city");
const monthElement = document.querySelector(".date");
const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const modalBody = document.querySelector(".modal-body");

//function to get the initial data
async function currentLocation() {
  let defaultCity;
  if (navigator.geolocation) {
    // Wrap getCurrentPosition in a Promise
    defaultCity = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = `${position.coords.latitude},${position.coords.longitude}`;
          resolve(coordinates);
        },
        (error) => {
          //if the user doesn't allow the location the default city will be cairo
          resolve("cairo"); // Fallback to default city on error
        }
      );
    });
  }
  const cityData = await getData(defaultCity);
  setData(cityData);
}

//set the initial data
addEventListener("load", currentLocation);

//modal trigger function
function modalTrigger(data) {
  const modal = bootstrap.Modal.getOrCreateInstance("#errorModal");
  modalBody.innerHTML = data;
  modal.show();
}

//handle search
async function handleSearch() {
  const city = search.value;
  if (city) {
    try {
      const cityData = await getData(city);
      setData(cityData);
    } catch (error) {
      modalTrigger(error.message);
    }
  } else {
    modalTrigger("Enter Valid City");
  }
}

//trigger when press enter key
search.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

//trigger when press find
searchBtn.addEventListener("click", () => {
  handleSearch();
});

//set data to html
function setData(cityData) {
  // display city
  cityElement.innerHTML = cityData.location.name;

  //month in first card
  monthElement.innerHTML = getMonth(cityData.forecast.forecastday[0].date);

  //footer in first card
  currentDayInfo[0].innerHTML = `${cityData.current.cloud}%`;
  currentDayInfo[1].innerHTML = `${cityData.current.wind_mph}km/h`;
  currentDayInfo[2].innerHTML = `${getWindDirection(
    cityData.current.wind_dir
  )}`;

  //max temperature in 2th and 3rd card
  maxTempComingDays[0].innerHTML = `${cityData.forecast.forecastday[1].day.maxtemp_c}<sup>o</sup>`;
  maxTempComingDays[1].innerHTML = `${cityData.forecast.forecastday[2].day.maxtemp_c}<sup>o</sup>`;

  //all query selector return 0:2 index are related
  days.forEach((day, index) => {
    day.innerHTML = getDay(cityData.forecast.forecastday[index].date);
    //temperatures
    temperatures[
      index
    ].innerHTML = `${cityData.forecast.forecastday[index].day.avgtemp_c}<sup>o</sup>C`;

    //icons
    tempIcons[index].setAttribute(
      "src",
      cityData.forecast.forecastday[index].day.condition.icon
    );

    //weather condition
    weatherStatus[index].innerHTML =
      cityData.forecast.forecastday[index].day.condition.text;
  });
}

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

// wait for V2 the default city would be assigned to your location
let defaultCity = "paris";
//self invoke function to get the initial data
(async () => {
  const cityData = await getData(defaultCity);
  setData(cityData);
})();

//modal trigger function
function modalTrigger(data) {
  const modal = bootstrap.Modal.getOrCreateInstance("#errorModal");
  modalBody.innerHTML = data;
  modal.show();
}

//event handlers
searchBtn.addEventListener("click", async () => {
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

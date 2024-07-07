let apiKey;

(async () => {
  apiKey = await process.env.REACT_APP_WEATHER_API_KEY;
})();

const baseUrl = "https://api.weatherapi.com/v1/forecast.json";

//get all data
async function getData(location) {
  try {
    const rowData = await fetch(
      `${baseUrl}?key=${apiKey}&q=${location}&days=3`
    );
    const data = await rowData.json();

    if ("error" in data || !rowData.ok) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

// get day name
function getDay(dateTimeString) {
  // Create a new Date object from the string
  const date = new Date(dateTimeString);

  // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = date.getDay();

  // Array to map day numbers to day names
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayName = daysOfWeek[dayOfWeek];

  return dayName;
}

function getMonth(dateTimeString) {
  // Create a new Date object from the string
  const date = new Date(dateTimeString);
  // Get the month (0 = January, 1 = February, etc.)
  const month = date.getMonth();
  // Array to map month numbers to month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = months[month];
  const dayNumber = +Array(dateTimeString.split("-")[1]);

  return `${dayNumber} ${monthName}`;
}

// get wind direction from chars
function getWindDirection(str) {
  if (str[0] == "N") {
    return "North";
  } else if (str[0] == "S") {
    return "South";
  } else if (str[0] == "E") {
    return "East";
  } else if (str[0] == "W") {
    return "West";
  }
}

export { getMonth, getDay, getData, getWindDirection };

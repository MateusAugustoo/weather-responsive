const input = getElementHtml("#input__city")
const key = window.keyApi

function getApiWeather() {
  const city = input.value
  return fetch(
    `http://api.weatherapi.com/v1/forecast.json?${key}&q=${city}&days=5&aqi=no&alerts=no`
  )
}

async function renderWeatherSearchCityName() {
  handleDisplay(".container__loading", "flex")
  const data = await getApiWeather()

  if (data.status === 400) {
    handleDisplay(".container__loading", "none")
    handleDisplay(".response__error", "flex")
    handleDisplay(".container__response__weather", "none")
  } else {
    const dataRes = await data.json()
    responseCurrentWeather(dataRes)

    if (containerCards.childElementCount === 0) {
      responseForecastCard(dataRes)
    } else {
      updateForecastCard(dataRes)
    }

    handleDisplay(".container__response__weather", "flex")
    handleDisplay(".response__error", "none")
    handleDisplay(".container__loading", "none")
  }
}

const nameCityCurrent = getElementHtml("#current__name__city")
const temperature = getElementHtml("#temperature")
const wind = getElementHtml("#wind")
const humidity = getElementHtml("#humidity")
const iconWeather = getElementHtml("#weather__icon")
const stateWeather = getElementHtml("#state__weather")
function responseCurrentWeather(data) {
  nameCityCurrent.innerHTML = `${data.location.name} - ${data.location.region}`
  temperature.innerHTML = `${data.current.temp_c}&#176;C`
  wind.innerHTML = `${data.current.wind_kph} km/h`
  humidity.innerHTML = `${data.current.humidity}%`

  iconWeather.src = data.current.condition.icon
  stateWeather.innerHTML = data.current.condition.text
}

const templateCard = getElementHtml("template")
const containerCards = getElementHtml(".container__cards")
function responseForecastCard(data) {
  let arrayDataForecast = data.forecast.forecastday
  arrayDataForecast.shift()

  arrayDataForecast.map(dataForecast => {
    const card = templateCard.content.cloneNode(true)
    card.querySelector("h3").innerHTML = `(${dataForecast.date})`
    card.querySelector("img").src = dataForecast.day.condition.icon
    card.querySelector(
      "#maximal__card"
    ).innerHTML = `${dataForecast.day.maxtemp_c}&#176;C`
    card.querySelector(
      "#wind__card"
    ).innerHTML = `${dataForecast.day.maxwind_kph} km/h`
    card.querySelector(
      "#humidity__card"
    ).innerHTML = `${dataForecast.day.avghumidity}%`

    containerCards.appendChild(card)
  })
}

function updateForecastCard(data) {
  let arrayDataForecast = data.forecast.forecastday
  arrayDataForecast.shift()

  arrayDataForecast.map((dataForecast, index) => {
    const card = containerCards.children[index]
    card.querySelector("h3").innerHTML = `(${dataForecast.date})`
    card.querySelector("img").src = dataForecast.day.condition.icon
    card.querySelector(
      "#maximal__card"
    ).innerHTML = `${dataForecast.day.maxtemp_c}&#176;C`
    card.querySelector(
      "#wind__card"
    ).innerHTML = `${dataForecast.day.maxwind_kph} km/h`
    card.querySelector(
      "#humidity__card"
    ).innerHTML = `${dataForecast.day.avghumidity}%`
  })
}

function handleDisplay(tag, style) {
  document.querySelector(tag).style.display = style
}

function getElementHtml(element) {
  return document.querySelector(element)
}

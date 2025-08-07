import { useEffect, useState } from "react"
import axios from "axios"

const Weather = ({ country }) => {

    const [temp, setTemp] = useState(null)
    const [icon, setIcon] = useState(null)
    const [wind, setWind] = useState(null)

    const capital = country.capital?.[0]

    const tempUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=b3d528be72f4e5dfaf7c1f793e14bda7`

    useEffect(() => {
        axios.get(tempUrl)
            .then(response => {
                const avgTemp = response.data
                const temperature = avgTemp.main.temp
                setIcon(avgTemp.weather[0].icon)
                setTemp(temperature)
                setWind(avgTemp.wind.speed)
                //console.log(temperature)
            }).catch(error => console.error(error))
    }, [country.capital])

    return (
        <div>
            <h1>Weather in {country.name.common}</h1>
            <p>Temperature: {temp}</p>
            <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt = "Weather Icon" />
            <p>Wind Speed: {wind} m/s</p>
        </div>
    )
}

export default Weather
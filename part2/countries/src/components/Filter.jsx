
import CountryDetails from "./CountryDetails"
import { useEffect, useState } from "react"
import Weather from "./Weather"


const Filter = ({ query, allCountries }) => {

    const [selectedCountry, setSelectedCountry] = useState(null)

    useEffect(() => {
        setSelectedCountry(null)
    }, [query])

    const showSelectedCountry = () => {
        if (selectedCountry === null) {
            return null
        } else {
            return (
                <div>
                    <CountryDetails country={selectedCountry} />
                    <Weather country={selectedCountry}/>
                </div>
            )
        }
    }

    const results = allCountries.filter(country => {
        return country.name.common.toLowerCase().includes(query.toLowerCase())
    })
    if (query === "") {
        return <p>Enter filters to find countries</p>
    } else if (results.length > 10) {
        return <p>Too many matches, specify another filter</p>
    } else if (results.length > 1 && results.length <= 10) {
        return (
            <div>
                {results.map(country => {
                    return (
                        <div key={country.ccn3}>
                            <span>{country.name.common} </span>
                            <button onClick={() => setSelectedCountry(country)}>View</button>
                        </div>
                    )
                })}
                {showSelectedCountry()}
            </div>

        )

    } else if (results.length === 1) {
        const country = results[0]
        return (
            <div>
                <CountryDetails country={country} />
                <Weather country = {country}/>
            </div>
        )

    } else {
        return (<p>Your query doesn't match our database</p>)
    }

}

export default Filter
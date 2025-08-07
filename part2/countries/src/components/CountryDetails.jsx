
const CountryDetails = ({country}) => {
    return (
        <div key={country.ccn3}>
        <h1>{country.name.common}</h1>
        <div>Capital: {country.capital}</div>
        <div>Area: {country.area}</div>
        <h1>Languages</h1>
        <ul>
            {Object.values(country.languages || {}).map((language, idx) => (
                <li key={idx}>{language}</li>
            ))}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
    </div>
    )
    
}

export default CountryDetails
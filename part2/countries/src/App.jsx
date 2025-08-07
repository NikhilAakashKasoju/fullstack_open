
import axios from "axios"
import { useState, useEffect } from "react"
import Filter from "./components/Filter"

const App = () => {
  const [query, setQuery] = useState("")
  const [allCountries, setAllCountries] = useState([])

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => setAllCountries(response.data))
      .catch(error => console.error("Error fetching details", error))
  }, [])
 
  const handleQueryChange = (e) => {
    setQuery(e.target.value)
    
  }

  return (
    <div>
      <label htmlFor = "countryInput">Find Countries: </label>
      <input id = "countryInput" value={query} onChange={handleQueryChange} placeholder="please enter to search..." />
      <Filter allCountries={allCountries} query = {query} />
    </div>
  )
}

export default App
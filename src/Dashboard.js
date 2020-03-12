import React, {useState, useEffect} from 'react';
import { Switch, Route  } from 'react-router-dom';
import Nav from './Components/Nav';
import SearchFields from './Components/SearchFields';
import CountryCard from './Components/CountryCard';
import CountryPage from './Components/CountryPage';
import axios from 'axios';
import './App.scss';

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [countries, setCountries] = useState([])
  
  function handleChange (event) {
    console.log(search, region, countries.length)
    const {name, value} = event.target
    if (name==='country'){
      setSearch(value)
    } else if (name==='region') {
      setRegion(value)
    }
  }

  useEffect (() => {
    if (region === 'all') {
      const fetchAllCountries = async () => {
        const response = await axios.get('http://restcountries.eu/rest/v2/all')
        setCountries(response.data)
      }
      fetchAllCountries()
    } else {
      const fetchByRegion = async () => {
        const response = await axios.get(`http://restcountries.eu/rest/v2/region/${region}`)
        setCountries(response.data)
      }
      fetchByRegion()
    }
    // eslint-disable-next-line
  }, [countries])

  const filteredCountries = countries
    .filter(country => {
      return country.name.toLowerCase().includes(search.toLowerCase())
    })
    .sort((a,b) =>b.population -a.population)
    .map(country => 
      <span key={country.alpha3Code}>
        <CountryCard country={country} />
      </span>
    )
  
  return (
    <div>
      <Nav />
      <Switch>
        <Route exact path='/'>
          <SearchFields handleChange={handleChange}/>
          {filteredCountries.length > 0 
            ?`Showing ${filteredCountries.length} countries...`
            : 'Loading ...'}
          <main className='countries-container'>
            {filteredCountries}
          </main>
        </Route>
        <Route path='/:alpha3Code' component={CountryPage} />
      </Switch>
    </div>
  )
}

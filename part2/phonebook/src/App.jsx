import { useState, useEffect } from "react"
import Filter from "./Components/Filter"
import PersonForm from "./Components/PersonForm"
import Persons from "./Components/Persons"
//import axios from "axios"

import noteServices from "./services/notes"
import Notification from "./Components/Notification"
import "./index.css"
import NotificationAdd from "./Components/NotificationAdd"
import NotificationUpd from "./Components/NotificationUpd"

const App = () => {
  const [persons, setPersons] = useState([])


  useEffect(() => {
    //console.log("effect")
    noteServices.getAll().then(response => setPersons(response))
    /*axios
    .get("http://localhost:3001/persons")
    .then(response => {
      setPersons(response.data)
    })*/
  }, [])

  const [newName, setNewName] = useState("")
  const [number, setNumber] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)
  const [addedMessage, setAddedMessage] = useState(null)
  const [updatedMessage, setUpdatedMessage] = useState(null)

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
    console.log(event.target.value);

  }

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNumber(event.target.value)
    console.log(event.target.value);

  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const addPerson = (event) => {
  event.preventDefault();

  const newPerson = { name: newName, number: number };
  const existingPerson = persons.find(
    person => person.name.toLowerCase() === newName.toLowerCase()
  );

  if (existingPerson) {
    if (existingPerson.number === number) {
      alert(`${newName} is already added to the phonebook with the same number`);
    } else {
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook, replace the old number with the new one?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: number };

        noteServices.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
            setUpdatedMessage(`${updatedPerson.name} was updated`);
            setTimeout(() => setUpdatedMessage(null), 5000);
            setNewName("");
            setNumber("");
          })
          .catch(error => {
            setErrorMessage(`Information of ${existingPerson.name} has already been removed from the server`);
            setTimeout(() => setErrorMessage(null), 5000);
            setPersons(persons.filter(p => p.id !== existingPerson.id));
          });
      }
    }
  } else {
    noteServices.create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setAddedMessage(`Added ${newPerson.name} to the server`);
        setTimeout(() => setAddedMessage(null), 5000);
        setNewName("");
        setNumber("");
      })
      .catch(error => {
        setErrorMessage("Failed to add person");
        setTimeout(() => setErrorMessage(null), 5000);
      });
  }
};


  const personToShow = persons.filter(person => person.name && person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const deletePerson = (id, name) => {
    // i want to delete a person from the persons data
    if (window.confirm(`Delete ${name}?`)) {
      noteServices.remove(id).then(response => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        setErrorMessage("the person was already removed from the server")
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== id))
      })
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <Notification errMessage={errorMessage} />
      <NotificationAdd addMessage={addedMessage} />
      <NotificationUpd UpdMessage={updatedMessage} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        number={number}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personToShow={personToShow} deletePerson={deletePerson} />

    </div>
  )
}

export default App

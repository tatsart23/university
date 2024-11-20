import { useEffect, useState } from "react";
import "./App.css";
import noteService from "./services/notes";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then((data) => {
      console.log(data);
      setPersons(data);
    });
  }, []);

  const handleDelete = (id) => {
    const person = persons.find((person) => person.id === id);
    
    if (!person) {
      console.error("Person not found in state");
      return;
    }
  
    const result = window.confirm(`Delete ${person.name}?`);
  
    if (result) {
      noteService
        .remove(id)
        .then(() => {
          // Filter out the deleted person from the state
          setPersons(persons.filter((person) => person.id !== id));
          setMessage(`Deleted ${person.name} successfully.`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.error("Delete failed:", error);
          setMessage(`Failed to delete ${person.name}: ${error.response ? error.response.data.error : error.message}`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  };
  

  const addPerson = (event) => {
    event.preventDefault();
  
    const personData = { name: newName, number: newNumber };
  
    if (newName === "" || newNumber === "") {
      alert("Fields cannot be empty");
      return;
    }
  
    const listedPerson = persons.find((person) => person.name === newName);
  
    if (listedPerson) {
      const result = window.confirm(
        `${newName} is already added to the phonebook. Replace the old number with a new one?`
      );
  
      if (result) {
        const updatePerson = { ...listedPerson, number: newNumber };
        noteService
          .update(listedPerson.id, updatePerson)
          .then((returnPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== returnPerson.id ? person : returnPerson
              )
            );
            setMessage(`Updated ${newName}'s number successfully.`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
  
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            const errorMessage =
              error.response && error.response.data.error
                ? error.response.data.error
                : `Failed to update ${newName}.`;
            setMessage(errorMessage);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          });
      }
    } else {
      noteService
        .create(personData)
        .then((returnPerson) => {
          setPersons(persons.concat(returnPerson));
          setMessage(`Added ${newName} successfully.`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
  
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          const errorMessage =
            error.response && error.response.data.error
              ? error.response.data.error
              : "Failed to add person.";
          setMessage(errorMessage);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  };
  
    

  const handlePhoneNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value);
  };

  const handlePersonChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value);
  };

  return (
    <div>
      <Filter search={search} setSearch={setSearch} />
      <Notification message={message} />
      <PersonForm
        addPerson={addPerson}
        handlePersonChange={handlePersonChange}
        handlePhoneNumberChange={handlePhoneNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <Persons persons={persons} search={search} handleDelete={handleDelete}/>
    </div>
  );
};

export default App;

import React from "react";

const PersonForm = ({
  addPerson,
  newName,
  newNumber,
  handlePersonChange,
  handlePhoneNumberChange,
}) => {
  return (
    <>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handlePhoneNumberChange} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </>
  );
};

export default PersonForm;

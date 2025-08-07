

const PersonForm = ({ addPerson, newName, handleNameChange, number, handleNumberChange }) => {
    return (
        <div>
            <form onSubmit={addPerson}>
                <div>
                    name: <input value={newName} onChange={handleNameChange} />
                    number: <input value={number} onChange={handleNumberChange} />
                </div>
                <div>
                    <button type="submit">Add</button>
                </div>
            </form>
        </div>
    )
}

export default PersonForm


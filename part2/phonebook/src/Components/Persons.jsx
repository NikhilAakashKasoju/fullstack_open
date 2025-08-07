
const Persons = ({ personToShow, deletePerson }) => {
    return (
        <div>
            {personToShow.map((person, index) => (
                <p key={index}>
                    {person.name} {person.number}
                    <button onClick={() => deletePerson(person.id, person.name)}>Delete</button>
                </p>
            ))}

        </div>
    )
}

export default Persons


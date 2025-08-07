
import Part from "./Part"

const Content = ({ parts }) => {
    let total = parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
        <div>
            {parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)}
            <p>
                <b>
                    Total {total} exercises
                </b>
            </p>
        </div>
    )
}

export default Content


import Header from "./Header"
import Content from "./Content"

const Course = ({ courses }) => {
    //console.log({course});

    return (
        <div>
            {courses.map(course => (
                <div key={course.id}>
                    <Header heading={course.name} />
                    <Content parts={course.parts} />
                </div>
            ))}
        </div>
    )
}

export default Course
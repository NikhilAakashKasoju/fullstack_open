import Part from "./Part"

const Content = (props) => {

    console.log(props);
    return (
        <div>
            <Part name={props.parts[0].name} exercises={props.parts[0].exercises} />
            <br />
            <Part name={props.parts[1].name} exercises={props.parts[1].exercises} />
            <br />
            <Part name={props.parts[2].name} exercises={props.parts[2].exercises} />
        </div>
    );
};

export default Content; 
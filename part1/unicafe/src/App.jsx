
import { useState } from "react";
import Heading from "./Heading";
import Button from "./Button";
//import SubHeading from "./SubHeading";
import Statistics from "./Statistics";

const App = () => {

  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);


  const handleGoodClick = () => {
    setAll(all + 1)
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setAll(all + 1)
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setAll(all + 1)
    setBad(bad + 1)
  }

  return (
    <div>
      <div>
        <Heading heading="Give Feedback" />
        <Button onClick={handleGoodClick} text="Good" />
        <Button onClick={handleNeutralClick} text="Neutral" />
        <Button onClick={handleBadClick} text="Bad" />
      </div>
      <div>
        <Statistics good = {good} neutral = {neutral} bad = {bad} all = {all}/>
      </div>

    </div>
  )
}

export default App;

/*<Heading heading="Statistics" />
        <SubHeading text="Good" value={good} />
        <SubHeading text="Neutral" value={neutral} />
        <SubHeading text="Bad" value={bad} />
        <SubHeading text = "All" value = {all} />
        <SubHeading text = "Average" value = {average} />
        <SubHeading text = "Positive" value = {positive + "%"} />
*/
import Heading from "./Heading";
import SubHeading from "./SubHeading"
import StatisticLine from "./StatisticLine";

const Statistics = ({ good, neutral, bad, all }) => {
    const total = good + neutral + bad;
    const average = total ? (good - bad) / total : 0;
    const positive = total ? (good / total) * 100 : 0;
    if (total === 0) {
        return (
            <div>
                <Heading heading="Statistics" />
                <SubHeading text="No Feedback Given" />
            </div>
        )
    }
    return (


        <div>
            <Heading heading="Statistics" />
            <table>
                <tbody>
                    <tr>
                        <StatisticLine text="Good" value={good} />
                    </tr>
                    <tr>
                        <StatisticLine text="Neutral" value={neutral} />
                    </tr>
                    <tr>
                        <StatisticLine text="Bad" value={bad} />
                    </tr>
                    <tr>
                        <StatisticLine text="All" value={all} />
                    </tr>
                    <tr>
                        <StatisticLine text="Average" value={average} />
                    </tr>
                    <tr>
                        <StatisticLine text="Positive" value={positive} />
                    </tr>
                </tbody>

            </table>

        </div>

    )

}

export default Statistics;
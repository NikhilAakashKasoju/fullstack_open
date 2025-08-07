
const Maxvotes = ({ anecdotes, votes }) => {
    let maxIndex = 0
    let maxVotes = 0

    for (let key in anecdotes) {
        if (votes[key] > maxVotes) {
            maxVotes = votes[key]
            maxIndex = key
        }
    }
    if (maxVotes === 0) {
        return (
            <p>Vote first to get the max votes per day</p>
        )
    }
    return (
        <div>
            <p>{anecdotes[maxIndex]}</p>
            <p>has {maxVotes} votes</p>
        </div>
    )
}

export default Maxvotes;
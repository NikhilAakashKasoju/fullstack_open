const Notification = ({errMessage}) => {
    if (errMessage === null) {
        return null
    }
    return (
        <div className = "error">
            {errMessage}
        </div>
    )
}

export default Notification
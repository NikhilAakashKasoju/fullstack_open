
const NotificationAdd = ({addMessage}) => {
    if (addMessage === null) {
        return null
    }
    return (
        <div className = "added">
            {addMessage}
        </div>
    )
}

export default NotificationAdd
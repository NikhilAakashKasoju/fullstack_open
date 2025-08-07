
const NotificationUpd = ({UpdMessage}) => {
    if (UpdMessage === null) {
        return null
    }
    return (
        <div className = "updated">
            {UpdMessage}
        </div>
    )
}

export default NotificationUpd
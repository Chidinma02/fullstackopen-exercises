const Notification = ({ notification }) => {
  if (!notification || !notification.message) {
    return null
  }

  const { message, type } = notification
  const icon = type === 'success' ? '✅' : '❌'

  return (
    <div className="notification-container">
      <div className={`toast toast-${type}`}>
        <span>{icon}</span>
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Notification

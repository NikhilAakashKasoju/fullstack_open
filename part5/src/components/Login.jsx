const LoginForm = ({username, password, handleLogin, setUsername, setPassword}) => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </label>
        </div>
        <div>
          <label>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </label>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    )
  }

  export default LoginForm
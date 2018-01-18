import React from 'react';

export default class extends React.Component {
  state = { users: [] };
  async componentDidMount() {
    let { users } = await fetch(`${process.env.REACT_APP_API}/api/userlist`, {
      method: `POST`,
      headers: { 'Content-Type': `application/json` },
      body: JSON.stringify({
        token: localStorage.token,
      }),
    }).then(r => r.json());

    this.setState({ users: [...new Set(users)] });

    this.props.socket.on('api:newsignup', username =>
      this.setState({ users: [...new Set([...users, username])] }),
    );
  }
  render() {
    return (
      <div style={{ padding: 20 }}>
        <label style={{ fontSize: '1.4em' }}>REGISTERED USERS:</label>
        {this.state.users
          .slice()
          .sort()
          .map(username => {
            return <div key={username}>{username}</div>;
          })}
      </div>
    );
  }
}

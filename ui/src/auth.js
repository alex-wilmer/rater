export default {
  signup: async function({ socket, ...body }, cb) {
    let response = await fetch(`${process.env.REACT_APP_API}/signup`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
      },
      body: JSON.stringify(body),
    });

    let { success, message } = await response.json();
    if (success) {
      socket.emit('ui:newsignup', { username: body.username });
      this.login(body, cb);
    } else cb({ success, message });
  },

  login: async function({ socket, ...body }, cb) {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/authenticate`,
      {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(body),
      },
    );

    let { success, message, token, user } = await response.json();

    if (success) {
      localStorage.admin = user.admin;
      localStorage.token = token;
      localStorage.userId = user._id;
      localStorage.username = user.username;
      cb({ success, message, user });
    } else {
      cb({ message });
    }
  },

  logout(cb) {
    delete localStorage.token;
    if (cb) cb();
  },

  loggedIn() {
    return !!localStorage.token;
  },
};

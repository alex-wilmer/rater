import { domain } from 'config'

export default {
  signup: async function (body, cb) {
    let response = await fetch(`${domain}:8080/signup`, {
      method: `POST`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    let { success } = await response.json()
    if (success) this.login(body, cb)
    else cb(false)
  },

  login: async function (body, cb) {
    let response = await fetch(`${domain}:8080/api/authenticate`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    let { success, token, user } = await response.json()
    if (success) {
      localStorage.token = token
      localStorage.userId = user._id
      localStorage.userEmail = user.email
      cb(user)
    }
    else cb(false)
  },

  logout (cb) {
    delete localStorage.token
    if (cb) cb()
  },

  loggedIn() {
    return !!localStorage.token
  },
}

import React, { Component } from 'react'
import { Link } from 'react-router'
import { domain } from 'config'

export default class Home extends Component {
  constructor (props) {
    super(props)

    this.state = { galleries: [] }
    this.getGalleries()
  }

  getGalleries = async () => {
    let response = await fetch(`${domain}:8080/api/galleries`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: localStorage.token,
        userId: localStorage.userId,
        userEmail: localStorage.userEmail
      })
    })

    let json = await response.json()

    this.setState({
      galleries: json || []
    })
  }

  render () {
    return (
      <div>
        <div
          style = {{
            display: `flex`,
            flexWrap: `wrap`,
          }}
        >
          <Link
            to="/new-gallery"
          >
            <div
              style = {{
                width: `15rem`,
                height: `7rem`,
                border: `2px solid rgb(59, 150, 80)`,
                display: `flex`,
                flexDirection: `column`,
                justifyContent: `center`,
                alignItems: `center`,
                margin: `1rem`
              }}
            >
              <div>+</div>
              <div>New Gallery</div>
            </div>
          </Link>

          { this.state.galleries.constructor === Array &&
            this.state.galleries.map(g =>
          <Link
            to={ `/gallery/${g._id}` }
            key = { g._id }
          >
            <div
              style = {{
                width: `15rem`,
                height: `7rem`,
                border: `2px solid rgb(59, 150, 80)`,
                display: `flex`,
                justifyContent: `center`,
                alignItems: `center`,
                margin: `1rem`
              }}
            >
              { g.name }
            </div>
          </Link>
          )}
        </div>
      </div>
    )
  }
}

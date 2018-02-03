import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Home extends Component {
  state = { galleries: [] }

  componentDidMount() {
    this.getGalleries()
  }

  getGalleries = async () => {
    let response = await fetch(`${process.env.REACT_APP_API}/api/galleries`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: localStorage.token,
        userId: localStorage.userId,
        username: localStorage.username,
      }),
    })

    let json = await response.json()

    this.setState({
      galleries: json || [],
    })
  }

  render() {
    return (
      <div>
        <div
          style={{
            display: `flex`,
            flexWrap: `wrap`,
          }}
        >
          {this.props.user.admin && (
            <Link to="/new-gallery">
              <div
                style={{
                  width: `15rem`,
                  height: `7rem`,
                  border: `2px solid rgb(59, 150, 80)`,
                  display: `flex`,
                  flexDirection: `column`,
                  justifyContent: `center`,
                  alignItems: `center`,
                  margin: `1rem`,
                }}
              >
                <div>+</div>
                <div>New Gallery</div>
              </div>
            </Link>
          )}

          {this.state.galleries.constructor === Array &&
            this.state.galleries.map(g => (
              <Link to={`/gallery/${g._id}`} key={g._id}>
                <div
                  style={{
                    width: `15rem`,
                    height: `7rem`,
                    border: `2px solid ${g.color || `rgb(27, 173, 112)`}`,
                    display: `flex`,
                    justifyContent: `center`,
                    alignItems: `center`,
                    margin: `1rem`,
                  }}
                >
                  {g.name}
                </div>
              </Link>
            ))}
        </div>
      </div>
    )
  }
}

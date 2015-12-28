import React, { Component } from 'react'

export default class Gallery extends Component {
  constructor (props) {
    super(props)

    this.state = {
      gallery: {
        name: ``
      }
    }

    this.getGallery()
  }

  getGallery = async () => {
    let { params } = this.props

    let response = await fetch(`http://localhost:8080/api/gallery`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: localStorage.token,
        galleryId: params.galleryId
      })
    })

    let json = await response.json()

    console.log(json)

    this.setState({
      gallery: json
    })
  }

  render () {
    return (
      <div>
        Gallery: { this.state.gallery.name }
      </div>
    )
  }
}

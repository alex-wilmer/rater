import React, { Component } from 'react'
import moment from 'moment'
import { domain } from 'config'
import GalleryLogin from 'components/GalleryLogin'
import UploadImage from 'components/UploadImage'
import ResultsTable from 'components/ResultsTable'

export default class Gallery extends Component {
  constructor (props) {
    super(props)

    this.state = {
      gallery: {},
      dataUrl: null,
      link: null,
      viewingImage: null
    }

    this.getGallery({})
  }

  getGallery = async ({ password }) => {
    let { params } = this.props

    let response = await fetch(`${domain}:8080/api/gallery`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: localStorage.token,
        galleryId: params.galleryId,
        userEmail: localStorage.userEmail,
        password
      })
    })

    let gallery = await response.json()

    if (gallery.needToAuth) {
      this.setState({ needToAuth: true })
    } else {
      let userImage =
        gallery.images.filter(x => x.userEmail === localStorage.userEmail)[0]

      if (userImage) {
        this.setState({ link: userImage.link })
      }

      this.setState({
        gallery,
        needToAuth: false
      })
    }
  }

  uploadFile = event => {
    let files = event.target.files

    if (!files.length) {
      return console.log('no file chosen')
    }

    let file = files[0]
    let fileReader = new FileReader()
    let img = new Image()
    let _URL = window.URL || window.webkitURL
    img.src = _URL.createObjectURL(file)

    fileReader.onload = (event) => {
      let dataUrl = event.target.result
      this.setState({ dataUrl })
    }

    fileReader.readAsDataURL(file)
  }

  clearDataUrl = () => {
    this.setState({ dataUrl: null })
  }

  uploadToImgur = async () => {
    let format = string => {
      let [ type, ...data ] = string.split(',')
      return data.join()
    }

    this.setState({ loading: true })

    let response = await fetch(`https://api.imgur.com/3/image`, {
      method: `POST`,
      headers: {
        Authorization: `Client-ID dddbdc53f65b3e2`,
        Accept: `application/json`,
        'Content-Type': `application/json`
      },
      body: JSON.stringify({
        image: format(this.state.dataUrl),
        type: `base64`
      })
    })

    let { data } = await response.json()

    if (data.link) {
      this.setState({
        link: data.link,
        dataUrl: null
      })
      this.saveToDb({ link: data.link })
    }

    this.setState({ loading: false })
  }

  saveToDb = async ({ link }) => {
    let { params } = this.props

    let response = await fetch(`${domain}:8080/api/gallery/image`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`
      },
      body: JSON.stringify({
        token: localStorage.token,
        galleryId: params.galleryId,
        userEmail: localStorage.userEmail,
        link
      })
    })
  }

  activateDeadline = async () => {
    let { params } = this.props

    let response = await fetch(`${domain}:8080/api/gallery/activate`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`
      },
      body: JSON.stringify({
        token: localStorage.token,
        galleryId: params.galleryId,
        userEmail: localStorage.userEmail
      })
    })

    let json = await response.json()
    this.setState({ gallery: json.gallery })
  }

  viewImage = image => {
    this.setState({ viewingImage: image })
  }

  render () {
    return (
      <div>
        { !!this.state.viewingImage &&
        <div
          style = {{
            position: `absolute`,
            width: `100%`,
            height: `100%`,
            top: 0,
            left: 0,
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`
          }}
        >
          <div
            style = {{
              padding: `3rem`,
              backgroundColor: `white`,
              border: `1px solid rgb(151, 185, 169)`,
              position: `relative`
            }}
          >
            <a
              onClick = { () => this.viewImage(null) }
              style = {{
                position: `absolute`,
                right: `5px`,
                top: `5px`
              }}
            >
              Close
            </a>
            <img
              src = { this.state.viewingImage.link }
            />
            <div>rating yadada</div>
          </div>
        </div>
        }
        { this.state.loading &&
        <div> Loading loading loading ... </div>
        }
        { this.state.gallery.name &&
        <div
          style = {{
            padding: `3rem`
          }}
        >
          <div>Gallery: { this.state.gallery.name }</div>

          { this.state.gallery.owner === localStorage.userEmail &&
          <div>
            <div>Password: { this.state.gallery.password }</div>
            <button
              onClick = { this.activateDeadline }
            >
              Activate Deadline
            </button>
          </div>
          }

          <div>
            <span>Submission Deadline:</span>
            <span
              style = {{
                paddingLeft: `0.4rem`
              }}
            >
            { moment(this.state.gallery.submitDeadline)
              .format('MMMM Do YYYY, h:mm:ss a')
            }
            </span>
          </div>

          { this.state.gallery.owner !== localStorage.userEmail &&
          <UploadImage
            clearDataUrl = { this.clearDataUrl }
            dataUrl = { this.state.dataUrl }
            uploadFile = { this.uploadFile }
            uploadToImgur = { this.uploadToImgur }
          />
          }

          { this.state.gallery.owner === localStorage.userEmail &&
          <ResultsTable
            images = { this.state.gallery.images }
            viewImage = { this.viewImage }
          />
          }
        </div>
        }
        { this.state.needToAuth &&
        <GalleryLogin
          getGallery = { this.getGallery }
        />
        }
        { !!this.state.link &&
        <div>
          Thank you!
          <img
            src = { this.state.link }
          />
        </div>
        }
      </div>
    )
  }
}

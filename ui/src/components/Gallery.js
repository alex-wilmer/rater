import React, { Component } from 'react'
import ColorPicker from 'react-color'
import moment from 'moment'
import { domain } from 'config'
import GalleryLogin from 'components/GalleryLogin'
import UploadImage from 'components/UploadImage'
import ResultsTable from 'components/ResultsTable'
import ViewImage from 'components/ViewImage'
import ImagesToRate from 'components/ImagesToRate'

export default class Gallery extends Component {
  constructor (props) {
    super(props)

    this.state = {
      gallery: {},
      dataUrl: null,
      imageSize: null,
      userImage: null,
      viewingImage: null,
      loading: true,
    }
  }

  componentDidMount () {
    this.getGallery({})

    this.props.socket.on(`api:updateGallery`, gallery => {
      if (!this.state.needToAuth) {
        let userImage =
          (gallery.images || []).filter(x => x.userEmail === localStorage.userEmail)[0]

        if (userImage) {
          this.setState({ userImage })
        }

        if (gallery.color) props.setHeaderColor(gallery.color)

        this.setState({ gallery })
      }
    })
  }

  getGallery = async ({ password }) => {
    let { params, setHeaderColor } = this.props

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

    if (gallery.color) setHeaderColor(gallery.color)

    if (gallery.needToAuth) {
      this.setState({ needToAuth: true })
      if (gallery.message) {
        this.setState({ message: gallery.message })
      }
    } else {
      let userImage =
        gallery.images.filter(x => x.userEmail === localStorage.userEmail)[0]

      if (userImage) {
        this.setState({ userImage })
      }

      this.setState({
        gallery,
        needToAuth: false
      })
    }

    this.setState({ loading: false })
  };

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
      this.setState({
        dataUrl,
        imageSize: {
          width: img.width,
          height: img.height
        }
      })
    }

    fileReader.readAsDataURL(file)
  };

  clearDataUrl = () => {
    this.setState({ dataUrl: null })
  };

  uploadToImgur = async ({ caption }) => {
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
        dataUrl: null
      })

      this.saveToDb({
        link: data.link,
        width: data.width,
        height: data.height,
        caption
      })
    }

    this.setState({ loading: false })
  };

  saveToDb = async ({ link, width, height, caption }) => {
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
        link,
        caption,
        width, height
      })
    })

    let { image } = await response.json()
    this.setState({ userImage: image })
  };

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
  };

  viewImage = image => {
    if (image && !image.rating) {
      this.setState({ viewingImage: image })
    } else if (!image) {
      this.setState({ viewingImage: image })
    }
  };

  rate = async ({ viewingImage, rating }) => {
    let { params } = this.props

    let multiplier = +(this.refs.multiplier || {}).value

    let response = await fetch(`${domain}:8080/api/gallery/vote`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`
      },
      body: JSON.stringify({
        token: localStorage.token,
        galleryId: params.galleryId,
        userEmail: localStorage.userEmail,
        viewingImage,
        rating,
        multiplier
      })
    })

    let { gallery, success, message } = await response.json()

    if (success) {
      this.setState({
        userImage:
          gallery.images.filter(x => x.userEmail === localStorage.userEmail)[0],
        gallery,
        message: `Thank you!`
      })

      setTimeout(() => {
        this.setState({
          message: null,
          viewingImage: null
        })
      }, 1000)
    } else {
      console.log(message)
    }
  };

  getOwnerRating = image => {
    let owner =
      image.raters.filter(x => x.userEmail === localStorage.userEmail)[0]

    if (owner) {
      return (
        `${owner.rating} (${owner.rating / owner.multiplier} * ${owner.multiplier})`
      )
    }
  };

  setColor = color => {
    this.props.socket.emit(`ui:setGalleryColor`, ({
      color, _id: this.state.gallery._id
    }))
    this.setState({ colorPickerOpen: false })
  };

  togglePublic = () => {
    this.props.socket.emit(`ui:togglePublic`, ({
      _id: this.state.gallery._id
    }))
  };

  render () {
    return (
      <div>
      { this.state.loading &&
        <div
          style = {{
            position: `absolute`,
            width: `100%`,
            height: `100%`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`
          }}
        >
          <div
            style = {{
              padding: `3rem 8rem`,
              border: `1px solid rgb(87, 195, 153)`,
              backgroundColor: `white`
            }}
          >
            Loading...
          </div>
        </div>
        }

        { this.state.gallery.name && // gallery has loaded and exists
        <div>
        { !!this.state.viewingImage &&
          <ViewImage
            message = { this.state.message }
            rate = { this.rate }
            viewingImage = { this.state.viewingImage }
            viewImage = { this.viewImage }
          />
          }

          <div // the main gallery view
            style = {{
              padding: `3rem`
            }}
          >
            <div>Gallery: { this.state.gallery.name }</div>

            { this.state.gallery.owner === localStorage.userEmail &&
            <div>
              <div>Password: { this.state.gallery.password }</div>

              <div
                style = {{
                  display: `flex`,
                  height: `3rem`,
                  alignItems: `center`
                }}
              >
                <button
                  onClick = { this.togglePublic }
                >
                  { this.state.gallery.public
                    ? `Make Private`
                    : `Make Public`
                  }
                </button>
              </div>

              <div
                style = {{
                  display: `flex`,
                  height: `3rem`,
                  alignItems: `center`,
                }}
              >
                <span>Choose color:</span>
                <span
                  onClick = { () => this.setState({ colorPickerOpen: true }) }
                  style = {{
                    cursor: `pointer`,
                    display: `inline-block`,
                    marginLeft: `1rem`,
                    backgroundColor: this.state.gallery.color || `rgb(27, 173, 112)`,
                    border: `1px solid black`,
                    width: `30px`,
                    height: `23px`,
                  }}
                />
              </div>

              { this.state.colorPickerOpen &&
              <div
                style = {{
                  position: `absolute`
                }}
              >
                <ColorPicker
                  onChange = { this.setColor }
                  type = "swatches"
                />
              </div>
              }
              <div>
                <span>Voting multiplier:</span>
                <input
                  ref = "multiplier"
                  placeholder = "Voting Multiplier"
                  type = "text"
                  defaultValue = "5"
                  style = {{
                    display: `inline-block`,
                    width: `4rem`,
                    textAlign: `center`,
                    marginLeft: `1rem`,
                  }}
                />
              </div>

              <button
                onClick = { this.activateDeadline }
                style = {{
                  float: `right`
                }}
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
              { moment(+this.state.gallery.submitDeadline)
                .format('MMMM Do YYYY, h:mm:ss a')
              }
              </span>
            </div>

            { this.state.gallery.owner !== localStorage.userEmail &&
            <div>
              { !this.state.gallery.passedDeadline &&
              <div
                style = {{
                  display: `flex`,
                  alignItems: `center`,
                  justifyContent: `center`,
                  flexDirection: `column`,
                  textAlign: `center`,
                  padding: `3rem`
                }}
              >
                { !!this.state.userImage && !this.state.dataUrl && // user has submitted
                <div>
                  <div>
                    <img
                      src = { this.state.userImage.link }
                      style = {{
                        maxWidth: `40rem`
                      }}
                    />
                  </div>
                  { !!this.state.userImage.width &&
                  <div
                    style = {{
                      marginTop: `1rem`,
                    }}
                  >
                    { this.state.userImage.width }px - { this.state.userImage.height }px
                  </div>
                  }
                  { !!this.state.userImage.caption &&
                  <div
                    style = {{
                      marginTop: `1rem`,
                      fontSize: `1.2rem`,
                    }}
                  >
                    { this.state.userImage.caption }
                  </div>
                  }
                  <div
                    style = {{
                      marginTop: `1rem`,
                      fontSize: `1.3rem`
                    }}
                  >
                    Thank you! You may submit a different image until the deadline.
                  </div>
                </div>
                }
                { !!this.state.link ||
                <UploadImage
                  clearDataUrl = { this.clearDataUrl }
                  dataUrl = { this.state.dataUrl }
                  imageSize = { this.state.imageSize }
                  uploadFile = { this.uploadFile }
                  uploadToImgur = { this.uploadToImgur }
                />
                }
              </div>
              }
              { this.state.gallery.passedDeadline &&
              <div>
                { !!this.state.userImage && // user has submitted
                <ImagesToRate
                  userImage = { this.state.userImage }
                  viewImage = { this.viewImage }
                />
                }
                { !!this.state.userImage ||
                <div>The deadline has passed.</div>
                }
              </div>
              }
            </div>
            }

            { this.state.gallery.owner === localStorage.userEmail &&
            <div
              style = {{
                marginTop: `2rem`
              }}
            >
              <ResultsTable
                images = { this.state.gallery.images }
                viewImage = { this.viewImage }
                getOwnerRating = { this.getOwnerRating }
              />
            </div>
            }
          </div>
        </div>
        }
        { this.state.needToAuth &&
        <GalleryLogin
          message = { this.state.message }
          getGallery = { this.getGallery }
        />
        }
      </div>
    )
  }
}

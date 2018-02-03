import React, { Component } from 'react'
import ColorPicker from 'react-color'
import moment from 'moment'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import GalleryLogin from './GalleryLogin'
import GalleryUserView from './GalleryUserView'
import ResultsTable from './ResultsTable'
import ViewImage from './ViewImage'

export default class Gallery extends Component {
  state = {
    gallery: {},
    dataUrl: null,
    imageSize: null,
    userImage: null,
    viewingImage: null,
    loading: true,
    deleteModalOpen: false,
  }

  componentDidMount() {
    this.getGallery({})

    this.props.socket.on(`api:updateGallery`, gallery => {
      if (!this.state.needToAuth) {
        let userImage = (gallery.images || []).find(
          x => x.username === localStorage.username,
        )

        if (userImage) {
          this.setState({ userImage })
        }

        if (gallery.color) this.props.setHeaderColor(gallery.color)

        this.setState({ gallery })
      }
    })
  }

  openDeleteModal = () => this.setState({ deleteModalOpen: true })
  closeDeleteModal = () => this.setState({ deleteModalOpen: false })

  getGallery = async ({ password }) => {
    let { params, setHeaderColor } = this.props

    let response = await fetch(`${process.env.REACT_APP_API}/api/gallery`, {
      method: `POST`,
      headers: { 'Content-Type': `application/json` },
      body: JSON.stringify({
        token: localStorage.token,
        galleryId: params.galleryId,
        username: localStorage.username,
        password,
      }),
    })

    let gallery = await response.json()

    if (gallery.color) setHeaderColor(gallery.color)

    if (gallery.needToAuth) {
      this.setState({ needToAuth: true })
      if (gallery.message) {
        this.setState({ message: gallery.message })
      }
    } else {
      let userImage = gallery.images.filter(
        x => x.username === localStorage.username,
      )[0]

      if (userImage) {
        this.setState({ userImage })
      }

      this.setState({
        gallery,
        needToAuth: false,
      })
    }

    this.setState({ loading: false })
  }

  uploadFile = event => {
    let files = event.target.files

    if (!files.length) {
      return console.log(`no file chosen`)
    }

    let file = files[0]
    let fileReader = new FileReader()
    let img = new Image()
    let _URL = window.URL || window.webkitURL
    img.src = _URL.createObjectURL(file)

    fileReader.onload = event => {
      let dataUrl = event.target.result
      this.setState({
        dataUrl,
        imageSize: {
          width: img.width,
          height: img.height,
        },
      })
    }

    fileReader.readAsDataURL(file)
  }

  clearDataUrl = () => {
    this.setState({ dataUrl: null })
  }

  uploadToImgur = async ({ caption }) => {
    let format = string => {
      let [type, ...data] = string.split(',') // eslint-disable-line
      return data.join()
    }

    this.setState({ loading: true })

    let response = await fetch(`https://api.imgur.com/3/image`, {
      method: `POST`,
      headers: {
        Authorization: `Client-ID dddbdc53f65b3e2`,
        Accept: `application/json`,
        'Content-Type': `application/json`,
      },
      body: JSON.stringify({
        image: format(this.state.dataUrl),
        type: `base64`,
      }),
    })

    let { data } = await response.json()

    if (data.link) {
      this.setState({ dataUrl: null })

      this.saveToDb({
        link: data.link,
        width: data.width,
        height: data.height,
        caption,
      })
    }

    this.setState({ loading: false })
  }

  saveToDb = async ({ link, width, height, caption }) => {
    let { params } = this.props

    let response = await fetch(
      `${process.env.REACT_APP_API}/api/gallery/image`,
      {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify({
          token: localStorage.token,
          galleryId: params.galleryId,
          username: localStorage.username,
          link,
          caption,
          width,
          height,
        }),
      },
    )

    let { image } = await response.json()
    this.setState({ userImage: image, youtubeLink: `` })
  }

  activateDeadline = async () => {
    let { params } = this.props

    let response = await fetch(
      `${process.env.REACT_APP_API}/api/gallery/activate`,
      {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify({
          token: localStorage.token,
          galleryId: params.galleryId,
          username: localStorage.username,
        }),
      },
    )

    let json = await response.json()
    this.setState({ gallery: json.gallery })
  }

  viewImage = ({ image }) => {
    if (image && !image.rating) {
      this.setState({ viewingImage: image })
    } else if (!image) {
      this.setState({ viewingImage: image })
    }
  }

  rate = async ({ viewingImage, rating, feedback }) => {
    let { params } = this.props

    let multiplier = +(this.refs.multiplier || {}).value

    let ratingSpec = {
      token: localStorage.token,
      galleryId: params.galleryId,
      username: localStorage.username,
      viewingImage,
      rating,
      multiplier,
    }

    if (this.state.gallery.owner === localStorage.username) {
      ratingSpec.feedback = feedback
    }

    let response = await fetch(
      `${process.env.REACT_APP_API}/api/gallery/vote`,
      {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(ratingSpec),
      },
    )

    let { gallery, success, message } = await response.json()

    if (success) {
      this.setState({
        userImage: gallery.images.filter(
          x => x.username === localStorage.username,
        )[0],
        gallery,
        message: `Thank you!`,
      })

      setTimeout(() => {
        this.setState({
          message: null,
          viewingImage: null,
        })
      }, 1000)
    } else {
      console.log(message)
    }
  }

  getOwnerRating = image => {
    let owner = image.raters.filter(
      x => x.username === localStorage.username,
    )[0]

    if (owner) {
      return `${owner.rating} (${owner.rating / owner.multiplier} * ${
        owner.multiplier
      })`
    }
  }

  setColor = color => {
    this.props.socket.emit(`ui:setGalleryColor`, {
      color,
      _id: this.state.gallery._id,
    })
    this.setState({ colorPickerOpen: false })
  }

  togglePublic = () => {
    this.props.socket.emit(`ui:togglePublic`, {
      _id: this.state.gallery._id,
    })
  }

  deleteGallery = async () => {
    let { params, history } = this.props

    await fetch(`${process.env.REACT_APP_API}/api/gallery/delete`, {
      method: `POST`,
      headers: { 'Content-Type': `application/json` },
      body: JSON.stringify({
        token: localStorage.token,
        galleryId: params.galleryId,
      }),
    })

    history.push('/')
  }

  submitYoutube = ({ youtubeLink }) => {
    this.setState({ youtubeLink })
  }

  clearYoutubelink = () => this.setState({ youtubeLink: `` })

  render() {
    let actions = [
      <FlatButton
        key="button1"
        label="Cancel"
        secondary={true}
        onClick={this.closeDeleteModal}
      />,
      <FlatButton
        key="button2"
        label="Yes, Delete It!"
        primary={true}
        keyboardFocused={true}
        onClick={this.deleteGallery}
      />,
    ]

    return (
      <div>
        <Dialog
          title="Do you really want to delete this gallery?"
          actions={actions}
          modal={false}
          open={this.state.deleteModalOpen}
          onRequestClose={this.closeDeleteModal}
        />

        {this.state.loading && (
          <div
            style={{
              position: `absolute`,
              width: `100%`,
              height: `100%`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `center`,
            }}
          >
            <div
              style={{
                padding: `3rem 8rem`,
                border: `1px solid rgb(87, 195, 153)`,
                backgroundColor: `white`,
              }}
            >
              Loading...
            </div>
          </div>
        )}

        {this.state.gallery.name && ( // gallery has loaded and exists
          <div>
            {!!this.state.viewingImage && (
              <ViewImage
                asAdmin={this.state.gallery.owner === localStorage.username}
                message={this.state.message}
                rate={this.rate}
                viewingImage={this.state.viewingImage}
                viewImage={this.viewImage}
              />
            )}

            <div // the main gallery view
              style={{
                padding: `3rem`,
              }}
            >
              <div>Gallery: {this.state.gallery.name}</div>

              {this.state.gallery.owner === localStorage.username && (
                <div>
                  <div>Password: {this.state.gallery.password}</div>

                  <div
                    style={{
                      display: `flex`,
                      height: `3rem`,
                      alignItems: `center`,
                    }}
                  >
                    <button onClick={this.togglePublic}>
                      {this.state.gallery.public
                        ? `Make Private`
                        : `Make Public`}
                    </button>
                  </div>

                  <div
                    style={{
                      display: `flex`,
                      height: `3rem`,
                      alignItems: `center`,
                    }}
                  >
                    <span>Choose color:</span>
                    <span
                      onClick={() => this.setState({ colorPickerOpen: true })}
                      style={{
                        cursor: `pointer`,
                        display: `inline-block`,
                        marginLeft: `1rem`,
                        backgroundColor:
                          this.state.gallery.color || `rgb(27, 173, 112)`,
                        border: `1px solid black`,
                        width: `30px`,
                        height: `23px`,
                      }}
                    />
                  </div>

                  {this.state.colorPickerOpen && (
                    <div style={{ position: `absolute` }}>
                      <ColorPicker onChange={this.setColor} type="swatches" />
                    </div>
                  )}
                  <div>
                    <span>Voting multiplier:</span>
                    <input
                      ref="multiplier"
                      placeholder="Voting Multiplier"
                      type="text"
                      defaultValue="5"
                      style={{
                        display: `inline-block`,
                        width: `4rem`,
                        textAlign: `center`,
                        marginLeft: `1rem`,
                      }}
                    />
                  </div>

                  <button
                    onClick={this.openDeleteModal}
                    style={{
                      float: `right`,
                      background: `rgb(191, 45, 13)`,
                      color: `white`,
                      marginLeft: `1rem`,
                    }}
                  >
                    Delete Gallery
                  </button>

                  <button
                    onClick={this.activateDeadline}
                    style={{ float: `right` }}
                  >
                    Activate Deadline
                  </button>
                </div>
              )}

              <div>
                <span>Submission Deadline:</span>
                <span style={{ paddingLeft: `0.4rem` }}>
                  {moment(+this.state.gallery.submitDeadline).format(
                    `MMMM Do YYYY, h:mm:ss a`,
                  )}
                </span>
              </div>

              {this.state.gallery.owner !== localStorage.username && (
                <GalleryUserView
                  {...this.state}
                  clearDataUrl={this.clearDataUrl}
                  uploadFile={this.uploadFile}
                  uploadToImgur={this.uploadToImgur}
                  viewImage={this.viewImage}
                  submitYoutube={this.submitYoutube}
                  clearYoutubelink={this.clearYoutubelink}
                  saveToDb={this.saveToDb}
                />
              )}

              {this.state.gallery.owner === localStorage.username && (
                <div style={{ marginTop: `2rem` }}>
                  <ResultsTable
                    images={this.state.gallery.images}
                    viewImage={this.viewImage}
                    getOwnerRating={this.getOwnerRating}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {this.state.needToAuth && (
          <GalleryLogin
            message={this.state.message}
            getGallery={this.getGallery}
          />
        )}
      </div>
    )
  }
}

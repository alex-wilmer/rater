import React, { Component } from 'react'
import moment from 'moment'
import { domain } from 'config'

export default class Gallery extends Component {
  constructor (props) {
    super(props)

    this.state = {
      gallery: {},
      dataUrl: null
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

    let json = await response.json()

    if (json.needToAuth) {
      this.setState({ needToAuth: true })
    } else {
      this.setState({
        gallery: json,
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
      , fileReader = new FileReader()

    let img = new Image()
    img.onload = function () {
        console.log(this.width + " " + this.height)
    }
    let _URL = window.URL || window.webkitURL
    img.src = _URL.createObjectURL(file)

    fileReader.onload = (event) => {
      let dataUrl = event.target.result

      this.setState({ dataUrl })

      // Session.set('dataUrl', dataUrl)
      // Session.set('uploadTemplate', 'uploadTwo')
    }

    fileReader.readAsDataURL(file)
  }

  render () {
    return (
      <div>
        { this.state.gallery.name &&
        <div
          style = {{
            padding: `3rem`
          }}
        >
          <div>Gallery: { this.state.gallery.name }</div>
          { this.state.gallery.owner === localStorage.userEmail &&
          <div>Password: { this.state.gallery.password }</div>
          }
          <div>Submission Deadline:
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
          <div>
            { !!this.state.dataUrl ||
            <form>
              <input
                type = "file"
                name = "imageFile"
                onChange = { this.uploadFile }
              />
              <label
                htmlFor = "file"
              >
                Upload
              </label>
            </form>
            }
            { !!this.state.dataUrl &&
            <form
              style = {{
                display: `flex`,
                flexDirection: `column`
              }}
            >
              <img
                src = { this.state.dataUrl }
                style = {{
                  maxWidth: `40rem`
                }}
              />
              <button>Cancel</button>
              <button>Save</button>
            </form>
            }
          </div>
          }
        </div>
        }
        { this.state.needToAuth &&
        <div
          style = {{
            height: `calc(100% - 5rem)`,
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`
          }}
        >
          <input
            ref = "password"
            placeholder = "Password.."
            type = "password"
          />
          <button
            onClick = {
              () => this.getGallery({ password: this.refs.password.value })
            }
          >
            Submit
          </button>
        </div>
        }
      </div>
    )
  }
}

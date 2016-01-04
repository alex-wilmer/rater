import React from 'react'

export default function UploadImage ({
  clearDataUrl,
  dataUrl,
  uploadFile,
  uploadToImgur
}) {
  return (
    <div>
      { !!dataUrl ||
      <form
        style = {{
          display: `flex`,
          justifyContent: `center`
        }}
      >
        <div
          className = "file"
          style = {{
            margin: `2rem 0`
          }}
        >
          <input
            type = "file"
            name = "imageFile"
            onChange = { uploadFile }
            style = {{
              height: `100%`,
              width: `100%`
            }}
          />
          <button
            htmlFor = "file"
          >
            Upload Image
          </button>
        </div>
      </form>
      }
      { !!dataUrl &&
      <div
        style = {{
          display: `flex`,
          flexDirection: `column`,
          justifyContent: `center`,
        }}
      >
        <div>
          <img
            src = { dataUrl }
            style = {{
              maxWidth: `40rem`
            }}
          />
        </div>
        <div
          style = {{
            margin: `2rem 0`
          }}
        >
          <button
            onClick = { clearDataUrl }
          >
            Cancel
          </button>
          <button
            onClick = { uploadToImgur }
            style = {{
              marginLeft: `3rem`
            }}
          >
            Save
          </button>
        </div>
      </div>
      }
    </div>
  )
}

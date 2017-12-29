import React from 'react'

let textarea

export default function UploadImage({
  clearDataUrl,
  dataUrl,
  imageSize,
  uploadFile,
  uploadToImgur,
}) {
  return (
    <div>
      {!!dataUrl || (
        <form
          style={{
            display: `flex`,
            justifyContent: `center`,
          }}
        >
          <div
            className="file"
            style={{
              margin: `2rem 0`,
            }}
          >
            <input
              type="file"
              name="imageFile"
              onChange={uploadFile}
              style={{
                height: `100%`,
                width: `100%`,
              }}
            />
            <button htmlFor="file">Upload Image</button>
          </div>
        </form>
      )}
      {!!dataUrl && (
        <div
          style={{
            display: `flex`,
            flexDirection: `column`,
            justifyContent: `center`,
          }}
        >
          <div>
            <img
              src={dataUrl}
              style={{
                maxWidth: `40rem`,
              }}
            />
          </div>
          <div
            style={{
              margin: `1rem 0`,
            }}
          >
            <div
              style={{
                marginBottom: `1rem`,
              }}
            >
              {imageSize.width}px - {imageSize.height}px
            </div>

            <label
              style={{
                fontSize: `1.1rem`,
                display: `block`,
                marginBottom: `0.5rem`,
              }}
            >
              Figure caption:
            </label>

            <textarea
              ref={node => (textarea = node)}
              rows="10"
              style={{
                marginBottom: `1rem`,
                height: `8rem`,
              }}
            />

            <button onClick={clearDataUrl}>Cancel</button>
            <button
              onClick={() => uploadToImgur({ caption: textarea.value })}
              style={{
                marginLeft: `3rem`,
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

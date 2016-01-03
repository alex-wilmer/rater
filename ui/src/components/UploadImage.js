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
      <form>
        <input
          type = "file"
          name = "imageFile"
          onChange = { uploadFile }
        />
        <label
          htmlFor = "file"
        >
          Upload
        </label>
      </form>
      }
      { !!dataUrl &&
      <div
        style = {{
          display: `flex`,
          flexDirection: `column`
        }}
      >
        <img
          src = { dataUrl }
          style = {{
            maxWidth: `40rem`
          }}
        />
        <button
          onClick = { clearDataUrl }
        >
          Cancel
        </button>
        <button
          onClick = { uploadToImgur }
        >
          Save
        </button>
      </div>
      }
    </div>
  )
}

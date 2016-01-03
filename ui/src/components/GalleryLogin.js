import React from 'react'

let input

export default function GalleryLogin ({
  getGallery
}) {
  return (
    <div
      style = {{
        height: `calc(100% - 5rem)`,
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`
      }}
    >
      <input
        ref = { node => input = node }
        placeholder = "Password.."
        type = "password"
      />
      <button
        onClick = {
          () => getGallery({ password: input.value })
        }
      >
        Submit
      </button>
    </div>
  )
}

import React from 'react'

export default function ImagesToRate ({
  userImage,
  viewImage
}) {
  return (
    <div
      style = {{
        display: `flex`,
        justifyContent: `center`
      }}
    >
      { userImage.imagesToRate.map((img, i) =>
      <div
        key = { i }
        onClick = { () => viewImage(img) }
        style = {{
          margin: `1rem`,
          cursor: `pointer`,
          display: `flex`,
          flexDirection: `column`,
          textAlign: `center`
        }}
      >
        <img
          style = {{
            maxWidth: `8rem`,
            marginBottom: `0.25rem`
          }}
          src = { img.link }
        />
        { !!img.rating &&
          <span>Already Rated</span>
        }
      </div>
      )}
    </div>
  )
}

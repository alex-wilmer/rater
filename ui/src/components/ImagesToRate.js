import React from 'react'

export default function ImagesToRate ({
  userImage,
  viewImage
}) {
  return (
    <div
      style = {{
        display: `flex`,
        alignItems: `center`,
        padding: `3rem 0`,
        flexDirection: `column`
      }}
    >
      <div
        style = {{
          fontSize: `1.2em`,
          textAlign: `center`
        }}
      >
        Please vote on the images below:
      </div>
      <div
        style = {{
          display: `flex`,
          flexDirection: `row`
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
              maxHeight: `8rem`,
              minWidth: `8rem`,
              minHeight: `8rem`,
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
    </div>
  )
}

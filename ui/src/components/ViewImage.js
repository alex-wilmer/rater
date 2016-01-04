import React from 'react'
import StarRating from 'components/StarRating'

export default function ViewImage ({
  rate,
  viewingImage,
  viewImage
}) {
  return (
    <div
      style = {{
        position: `absolute`,
        width: `100%`,
        height: `100%`,
        top: 0,
        left: 0,
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        backgroundColor: `rgba(216, 236, 231, 0.55)`
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
          onClick = { () => viewImage(null) }
          style = {{
            position: `absolute`,
            right: `5px`,
            top: `5px`
          }}
        >
          Close
        </a>
        <img
          src = { viewingImage.link }
        />
        <StarRating
          rate = { rating => rate({ rating, viewingImage }) }
        />
      </div>
    </div>
  )
}

import React from 'react'

export default function ViewImage ({
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
        alignItems: `center`
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
        <div>rating yadada</div>
      </div>
    </div>
  )
}

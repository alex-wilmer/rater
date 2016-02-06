import React from 'react'
import StarRating from 'components/StarRating'

export default function ViewImage ({
  message,
  rate,
  viewingImage,
  viewImage,
}) {
  return (
    <div
      style = {{
        position: `absolute`,
        width: `100%`,
        minHeight: `100%`,
        padding: `4rem`,
        top: 0,
        left: 0,
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        backgroundColor: `rgba(216, 236, 231, 0.55)`,
      }}
    >
      <div
        style = {{
          minWidth: `455px`,
          padding: `5rem`,
          backgroundColor: `white`,
          border: `1px solid rgb(151, 185, 169)`,
          position: `relative`,
          textAlign: `center`,
        }}
      >
        <a
          onClick = { () => viewImage(null) }
          style = {{
            position: `absolute`,
            right: `15px`,
            top: `15px`,
            fontWeight: `bold`,
          }}
        >
          ✕ CLOSE
        </a>
        <img
          src = { viewingImage.link }
          style = {{
            maxWidth: `40rem`,
          }}
        />
        <div
          style = {{
            fontSize: `1.2rem`,
            marginTop: `1.5rem`,
          }}
        >
          { viewingImage.caption }
        </div>
        <StarRating
          rate = { rating => rate({ rating, viewingImage }) }
        />
        <div
          style = {{
            textAlign: `center`,
            fontSize: `1.3em`,
          }}
        >
          { !!message ||
          <div>You can only vote once! Make it count.</div>
          }
          { !!message &&
          <div>{ message }</div>
          }
        </div>
      </div>
    </div>
  )
}

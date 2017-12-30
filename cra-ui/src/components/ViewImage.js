import React from 'react'
import StarRating from './StarRating'

let feedback

export default function ViewImage({
  asAdmin,
  message,
  rate,
  viewingImage,
  viewImage,
}) {
  return (
    <div
      style={{
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
        style={{
          minWidth: `455px`,
          padding: `5rem`,
          backgroundColor: `white`,
          border: `1px solid rgb(151, 185, 169)`,
          position: `relative`,
          textAlign: `center`,
        }}
      >
        <a
          onClick={() => viewImage({ image: null })}
          style={{
            position: `absolute`,
            right: `15px`,
            top: `15px`,
            fontWeight: `bold`,
          }}
        >
          ✕ CLOSE
        </a>
        {viewingImage.link.includes(`youtube`) && (
          <iframe
            width="560"
            height="315"
            title={viewingImage.link}
            src={`https://www.youtube.com/embed/${viewingImage.link
              .split(`=`)
              .pop()}`}
            frameBorder="0"
            allowFullScreen
          />
        )}
        {viewingImage.link.includes(`youtube`) || (
          <img
            src={viewingImage.link}
            style={{
              maxWidth: `40rem`,
            }}
          />
        )}
        {viewingImage.width &&
          viewingImage.height && (
            <div
              style={{
                marginBottom: `1rem`,
              }}
            >
              {viewingImage.width}px - {viewingImage.height}px
            </div>
          )}
        <div
          style={{
            fontSize: `1.2rem`,
            marginTop: `1.5rem`,
          }}
        >
          {viewingImage.caption}
        </div>
        {asAdmin && (
          <textarea
            ref={node => (feedback = node)}
            rows="10"
            placeholder="Provide feedback (optional)"
            defaultValue={viewingImage.feedback}
            style={{
              margin: `1rem 0`,
              padding: `0.5rem`,
              height: `8rem`,
            }}
          />
        )}
        <StarRating
          rate={rating => {
            let ratingSpec = {
              rating,
              viewingImage,
            }

            if (asAdmin) ratingSpec.feedback = feedback.value

            rate(ratingSpec)
          }}
        />
        <div
          style={{
            textAlign: `center`,
            fontSize: `1.3em`,
          }}
        >
          {!!message ||
            asAdmin || <div>You can only vote once! Make it count.</div>}
          {!!message && <div>{message}</div>}
        </div>
      </div>
    </div>
  )
}

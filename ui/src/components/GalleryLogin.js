import React from 'react'

let input

export default function GalleryLogin({ getGallery, message }) {
  return (
    <div
      style={{
        height: `calc(100% - 5rem)`,
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
      }}
    >
      <div
        style={{
          width: `18rem`,
          height: `20rem`,
          padding: `2rem`,
          display: `flex`,
          flexDirection: `column`,
        }}
      >
        <input
          ref={node => (input = node)}
          placeholder="Password.."
          type="password"
        />
        <button onClick={() => getGallery({ password: input.value })}>
          Submit
        </button>
        {!!message && <div>{message}</div>}
      </div>
    </div>
  )
}

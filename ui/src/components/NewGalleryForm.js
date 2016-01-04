import React from 'react'
import { Link } from 'react-router'

let name, password, submitDeadline

export default function NewGalleryForm ({
  createGallery
}) {
  return (
    <div
      style = {{
        height: `calc(100% - 5rem)`,
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `center`,
        alignItems: `center`
      }}
    >
      <div
        style = {{
          display: `flex`,
          flexDirection: `column`,
        }}
      >
        <input
          ref = { node => name = node }
          placeholder = "Name.."
          type = "text"
        />
        <input
          ref = { node => password = node }
          placeholder = "Password.."
          type = "text"
        />
        <input
          ref = { node => submitDeadline = node }
          placeholder = "Submission Deadline"
          type = "text"
        />
        <button
          onClick = {
            () => {
              createGallery({
                name: name.value,
                password: password.value,
                submitDeadline: submitDeadline.value
              })
            }
          }
        >
          Create
        </button>
        <Link
          to="/"
        >
          <button
            style = {{
              width: `100%`
            }}
          >
            Cancel
          </button>
        </Link>
      </div>
    </div>
  )
}

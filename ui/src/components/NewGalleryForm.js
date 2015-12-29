import React from 'react'
import { Link } from 'react-router'

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
      <form
        onSubmit = { createGallery }
        style = {{
          display: `flex`,
          flexDirection: `column`,
        }}
      >
        <input
          name = "name"
          placeholder = "Name.."
          type = "text"
        />
        <input
          name = "password"
          placeholder = "Password.."
          type = "text"
        />
        <input
          name = "submitDeadline"
          placeholder = "Submission Deadline"
          type = "text"
        />
        {/*
        <input
          name = "votingDeadline"
          placeholder = "Voting Deadline"
          type = "text"
        />
        */}
        <input
          type = "submit"
          value = "Create"
        />
        <Link to="/">Cancel</Link>
      </form>
    </div>
  )
}

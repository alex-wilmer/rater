import React from 'react'
import { Link } from 'react-router'

export default function NewGalleryForm ({
  createGallery
}) {
  return (
    <div>
      <form
        onSubmit = { createGallery }
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

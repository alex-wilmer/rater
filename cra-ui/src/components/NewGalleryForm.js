import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'

let name, password, deadlineDate, deadlineTime

export default function NewGalleryForm({ createGallery }) {
  return (
    <div
      style={{
        height: `calc(100% - 5rem)`,
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `center`,
        alignItems: `center`,
      }}
    >
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
        }}
      >
        <input ref={node => (name = node)} placeholder="Name.." type="text" />
        <input
          ref={node => (password = node)}
          placeholder="Password.."
          type="text"
        />
        <DatePicker
          onChange={(event, date) => (deadlineDate = date)}
          hintText="Deadline Date"
          mode="portrait"
        />
        <TimePicker
          style={{
            maxHeight: `5rem`,
          }}
          onChange={(event, date) => (deadlineTime = date)}
          hintText="Deadline Time"
        />
        <div
          style={{
            marginTop: `1.5rem`,
          }}
        >
          <button
            style={{
              width: `100%`,
              marginBottom: `1rem`,
            }}
            onClick={() => {
              let deadline = moment(deadlineDate)
                .add(moment(deadlineTime).hours(), `hours`)
                .add(moment(deadlineTime).minutes(), `minutes`)

              createGallery({
                name: name.value,
                password: password.value,
                submitDeadline: +deadline,
              })
            }}
          >
            Create
          </button>
          <Link to="/">
            <button
              style={{
                width: `100%`,
              }}
            >
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

import React from 'react'

export default function StarRating ({
  rate
}) {
  return (
    <fieldset
      className = "rating"
    >
      <input
        className = "star"
        type = "radio"
        name = "rating"
        id = { `star1` }
        onClick = { () => rate(5) }
      />,
      <label
        className = "full"
        htmlFor = { `star1` }
      />
      <input
        className = "star"
        type = "radio"
        name = "rating"
        id = { `star2` }
        onClick = { () => rate(4) }
      />,
      <label
        className = "full"
        htmlFor = { `star2` }
      />
      <input
        className = "star"
        type = "radio"
        name = "rating"
        id = { `star3` }
        onClick = { () => rate(3) }
      />,
      <label
        className = "full"
        htmlFor = { `star3` }
      />
      <input
        className = "star"
        type = "radio"
        name = "rating"
        id = { `star4` }
        onClick = { () => rate(2) }
      />,
      <label
        className = "full"
        htmlFor = { `star4` }
      />
      <input
        className = "star"
        type = "radio"
        name = "rating"
        id = { `star5` }
        onClick = { () => rate(1) }
      />,
      <label
        className = "full"
        htmlFor = { `star5` }
      />
    </fieldset>
  )
}

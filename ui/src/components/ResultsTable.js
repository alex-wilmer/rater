import React from 'react'

export default function ResultsTable ({
  images,
  viewImage
}) {
  return (
    <table
      style = {{
        width: `100%`
      }}
    >
      <thead>
        <tr>
          <th>User</th>
          <th>Image</th>
          <th># Ratings</th>
          <th>Avg. Rating</th>
        </tr>
      </thead>
      <tbody>
        { images.map(image =>
        <tr
          key = { image.userEmail }
        >
          <td>{ image.userEmail }</td>
          <td>
            <a
              onClick = { () => viewImage(image) }
              style = {{
                color: `rgb(50, 140, 205)`,
                fontWeight: `bold`
              }}
            >
              View Image
            </a>
          </td>
          <td>{ image.raters.length }</td>
          <td>{ image.averageRating }</td>
          <td>{ image.imagesToRate.map(x => <span>{ x.userEmail }</span>) }</td>
        </tr>
        )}
      </tbody>
    </table>
  )
}

import React from 'react'
import moment from 'moment'

export default function ResultsTable ({
  images,
  getOwnerRating,
  viewImage,
}) {
  let averageScore = image => (
    image.imagesToRate.reduce((acc, val) =>
      acc + val.criticalAssessmentScore
    , 0) / image.imagesToRate.length
  )

  return (
    <table
      style = {{
        width: `100%`,
      }}
    >
      <thead>
        <tr>
          <th>User</th>
          <th>Image</th>
          <th>Upload Date</th>
          <th># Ratings</th>
          <th>Avg. Rating</th>
          <th>Owner Rating</th>
          <th># Ratings made on others</th>
          <th>Avg. Critical Assessment Score</th>
        </tr>
      </thead>
      <tbody>
        { images.map((image, i) =>
        <tr
          key = { i }
        >
          <td>{ image.userEmail }</td>
          <td>
            <a
              onClick = { () => viewImage(image) }
              style = {{
                color: `rgb(50, 140, 205)`,
                fontWeight: `bold`,
              }}
            >
              View Image
            </a>
          </td>
          <td>{ image.uploadDate ? moment(image.uploadDate).fromNow() : `` }</td>
          <td>{ image.raters.length }</td>
          <td>{ image.averageRating }</td>
          <td>{ getOwnerRating(image) }</td>
          <td>{ image.imagesToRate.filter(x => x.rating).length }</td>
          <td>{ averageScore(image) || 0 }</td>
        </tr>
        )}
      </tbody>
    </table>
  )
}

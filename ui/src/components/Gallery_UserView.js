import React from 'react'
import ImagesToRate from 'components/ImagesToRate'
import UploadImage from 'components/UploadImage'
import averageCriticalAssessmentScore from '../utils/averageCriticalAssessmentScore'

export default function Gallery_UserView ({
  clearDataUrl,
  dataUrl,
  gallery,
  imageSize,
  link,
  uploadFile,
  uploadToImgur,
  userImage,
  viewImage,
}) {
  return (
    <div>
      { !gallery.passedDeadline &&
      <div
        style = {{
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          flexDirection: `column`,
          textAlign: `center`,
          padding: `3rem`,
        }}
      >
        { !!userImage && !dataUrl && // user has submitted
        <div>
          <div>
            <img
              src = { userImage.link }
              style = {{
                maxWidth: `40rem`,
              }}
            />
          </div>
          { !!userImage.width &&
          <div
            style = {{
              marginTop: `1rem`,
            }}
          >
            { userImage.width }px - { userImage.height }px
          </div>
          }
          { !!userImage.caption &&
          <div
            style = {{
              marginTop: `1rem`,
              fontSize: `1.2rem`,
            }}
          >
            { userImage.caption }
          </div>
          }
          <div
            style = {{
              marginTop: `1rem`,
              fontSize: `1.3rem`,
            }}
          >
            Thank you! You may submit a different image until the deadline.
          </div>
        </div>
        }
        { !!link ||
        <UploadImage
          clearDataUrl = { clearDataUrl }
          dataUrl = { dataUrl }
          imageSize = { imageSize }
          uploadFile = { uploadFile }
          uploadToImgur = { uploadToImgur }
        />
        }
      </div>
      }
      { gallery.passedDeadline &&
      <div>
        { !!userImage && // user has submitted
        <div>
          { userImage.imagesToRate.every(x => x.rating) &&
            <div
              style = {{
                height: `10rem`,
                display: `flex`,
                flexDirection: `column`,
                justifyContent: `center`,
                alignItems: `center`,
                fontSize: `1.3rem`,
              }}
            >
              <div
                style = {{
                  fontWeight: `bold`,
                  margin: `1rem 0`,
                }}
              >
                Thank you for rating!
              </div>
              <div>
                <div>Current Average Rating: { userImage.averageRating ? userImage.averageRating : `No ratings yet.` } </div>
                <div>
                  Current Critical Assessment: { averageCriticalAssessmentScore(userImage) }
                </div>
              </div>

            </div>
          }
          { userImage.imagesToRate.every(x => x.rating) ||
          <ImagesToRate
            userImage = { userImage }
            viewImage = { viewImage }
          />
          }
        </div>
        }
        { !!userImage ||
        <div>The deadline has passed.</div>
        }
      </div>
      }
    </div>
  )
}

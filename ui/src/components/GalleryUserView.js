import React from 'react';
import ImagesToRate from './ImagesToRate';
import UploadImage from './UploadImage';
import averageCriticalAssessmentScore from '../utils/averageCriticalAssessmentScore';

let youtube, textarea;

export default function Gallery_UserView({
  clearDataUrl,
  dataUrl,
  gallery,
  imageSize,
  link,
  uploadFile,
  uploadToImgur,
  userImage,
  viewImage,
  submitYoutube,
  youtubeLink,
  clearYoutubelink,
  saveToDb,
}) {
  return (
    <div>
      {!gallery.passedDeadline && (
        <div
          style={{
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
            flexDirection: `column`,
            textAlign: `center`,
            padding: `3rem`,
          }}
        >
          {!!userImage &&
          !dataUrl && ( // user has submitted
              <div>
                <div>
                  {userImage.link.includes(`youtube`) && (
                    <iframe
                      title={userImage.link}
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${userImage.link
                        .split(`=`)
                        .pop()}`}
                      frameBorder="0"
                      allowFullScreen
                    />
                  )}
                  {userImage.link.includes(`youtube`) || (
                    <img
                      src={userImage.link}
                      style={{
                        maxWidth: `40rem`,
                      }}
                    />
                  )}
                </div>
                {!!userImage.width && (
                  <div
                    style={{
                      marginTop: `1rem`,
                    }}
                  >
                    {userImage.width}px - {userImage.height}px
                  </div>
                )}
                {!!userImage.caption && (
                  <div
                    style={{
                      marginTop: `1rem`,
                      fontSize: `1.2rem`,
                    }}
                  >
                    {userImage.caption}
                  </div>
                )}
                <div
                  style={{
                    marginTop: `1rem`,
                    fontSize: `1.3rem`,
                  }}
                >
                  Thank you! You may submit a different image until the
                  deadline.
                </div>
              </div>
            )}
          {!!link || (
            <UploadImage
              clearDataUrl={clearDataUrl}
              dataUrl={dataUrl}
              imageSize={imageSize}
              uploadFile={uploadFile}
              uploadToImgur={uploadToImgur}
            />
          )}
          {!!link || (
            <div>
              <div>or paste youtube link</div>
              <input
                ref={node => (youtube = node)}
                style={{ width: `20rem` }}
              />
              <button
                onClick={() => submitYoutube({ youtubeLink: youtube.value })}
              >
                Submit
              </button>
            </div>
          )}

          {!!youtubeLink &&
            !link && (
              <div>
                <iframe
                  width="560"
                  height="315"
                  title={youtubeLink}
                  src={`https://www.youtube.com/embed/${youtubeLink
                    .split(`=`)
                    .pop()}`}
                  frameBorder="0"
                  allowFullScreen
                />
                <label
                  style={{
                    fontSize: `1.1rem`,
                    display: `block`,
                    marginBottom: `0.5rem`,
                  }}
                >
                  Figure caption:
                </label>

                <textarea
                  ref={node => (textarea = node)}
                  rows="10"
                  style={{
                    marginBottom: `1rem`,
                    height: `8rem`,
                  }}
                />

                <button onClick={clearYoutubelink}>Cancel</button>
                <button
                  onClick={() =>
                    saveToDb({ link: youtubeLink, caption: textarea.value })
                  }
                  style={{
                    marginLeft: `3rem`,
                  }}
                >
                  Save
                </button>
              </div>
            )}
        </div>
      )}
      {gallery.passedDeadline &&
        !userImage && <div>The deadline has passed.</div>}
      {/* {gallery.passedDeadline && (
        <div>
          {!!userImage && ( // user has submitted
            <div>
              {userImage.imagesToRate.every(x => x.rating) && (
                <div
                  style={{
                    height: `10rem`,
                    display: `flex`,
                    flexDirection: `column`,
                    justifyContent: `center`,
                    alignItems: `center`,
                    fontSize: `1.3rem`,
                  }}
                >
                  <div
                    style={{
                      fontWeight: `bold`,
                      margin: `1rem 0`,
                    }}
                  >
                    Thank you for rating!
                  </div>
                  <div>
                    <div>
                      Current Average Rating:{' '}
                      {userImage.averageRating
                        ? userImage.averageRating
                        : `No ratings yet.`}{' '}
                    </div>
                    <div>
                      Current Critical Assessment:{' '}
                      {averageCriticalAssessmentScore(userImage)}
                    </div>
                    <div
                      style={{
                        marginTop: `0.5rem`,
                        fontWeight: `bold`,
                      }}
                    >
                      Instructor feedback:
                    </div>
                    <div>{userImage.feedback || `None at this time.`}</div>
                  </div>
                </div>
              )}
              {userImage.imagesToRate.every(x => x.rating) || (
                <ImagesToRate userImage={userImage} viewImage={viewImage} />
              )}
            </div>
          )}
          {!!userImage || <div>The deadline has passed.</div>}
        </div> */}
      )}
    </div>
  );
}

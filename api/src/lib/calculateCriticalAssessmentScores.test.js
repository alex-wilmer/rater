import { expect } from 'chai'
import calculateCriticalAssessmentScores from './calculateCriticalAssessmentScores'

describe(`After calculating a gallery's critical assessment scores`, () => {
  it(`the score should be the same if nothing changed`, () => {
    let gallery = {
      images: [
        {
          link: `a`,
          imagesToRate: [
            { link: `b`, criticalAssessmentScore: 5, rating: 5 }
          ],
          averageRating: 0,
        },
        {
          link: `b`,
          imagesToRate: [
            { link: `a`, criticalAssessmentScore: 0 }
          ],
          averageRating: 5
        }
      ]
    }

    let { images } = calculateCriticalAssessmentScores(gallery)

    let imageToRate =
      images.filter(x => x.link === `a`)[0]
      .imagesToRate.filter(x => x.link === `b`)[0]

    expect(imageToRate.criticalAssessmentScore).to.equal(5)
  })
})

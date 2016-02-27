let averageCriticalAssessmentScore = image => (
  image.imagesToRate.reduce((pre, cur) =>
    pre + cur.criticalAssessmentScore
  , 0) / image.imagesToRate.length
)

export default averageCriticalAssessmentScore

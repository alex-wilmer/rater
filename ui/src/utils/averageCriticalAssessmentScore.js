let averageCriticalAssessmentScore = image => (
  image.imagesToRate.reduce((acc, val) =>
    acc + val.criticalAssessmentScore
  , 0) / image.imagesToRate.length
)

export default averageCriticalAssessmentScore

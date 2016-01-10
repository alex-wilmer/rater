import _ from 'lodash'

export default (gallery) => {
  gallery.images.forEach(image => {
    image.imagesToRate.filter(x => x.rating).forEach(imgToRate => {
      let averageRating =
        gallery.images.filter(x => x.link === imgToRate.link)[0].averageRating

      imgToRate.criticalAssessmentScore =
        5 - Math.abs(imgToRate.rating - averageRating)
    })
  })

  return gallery
}

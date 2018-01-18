import _ from 'lodash';

export default gallery => {
  /*
   *  Set gallery deadline to time of activation.
   */

  gallery.submitDeadline = +new Date();
  gallery.passedDeadline = true;

  /*
   *  Reset images to have no ratings.
   */

  gallery.images = gallery.images.map(x => ({
    ...x,
    raters: [],
    imagesToRate: [],
    averageRating: 0,
  }));

  /*
   *  Create local copy of images.
   */

  let imagesToPull = gallery.images.map(x => x);

  /*
   *  Go through every 'user' and assign them images to rate.
   */

  gallery.images = gallery.images.map(img => {
    let sliceImage = () => {
      let randomIndex = Math.floor(Math.random() * imagesToPull.length);
      return [imagesToPull.slice(randomIndex, randomIndex + 1)[0], randomIndex];
    };

    _.range(0, Math.min(gallery.images.length - 1, 5)).forEach(x => {
      let imgToRate, randomIndex;

      do {
        [imgToRate, randomIndex] = sliceImage();

        if (
          imgToRate.username !== img.username &&
          !img.imagesToRate.some(x => x.link === imgToRate.link)
        ) {
          /*
           *  Remove 'randomIndex' from imagesToPull.
           */

          imagesToPull = [
            ...imagesToPull.slice(0, randomIndex),
            ...imagesToPull.slice(randomIndex + 1, Infinity),
          ];

          /*
           *  Add random image to imagesToRate.
           */

          img.imagesToRate = [
            ...img.imagesToRate,
            {
              link: imgToRate.link,
              caption: imgToRate.caption,
              criticalAssessmentScore: 0,
            },
          ];

          /*
           *  Reset imagesToPull array if only user's image is left.
           */

          if (imagesToPull.length === 1) {
            imagesToPull = gallery.images.map(x => x);
          }

          break;
        }
      } while (
        (imgToRate.username === img.username ||
          img.imagesToRate.some(x => x.link === imgToRate.link)) &&
        img.imagesToRate.length < Math.min(gallery.images.length - 1, 5)
      );

      img.imagesToRate = _.uniq(img.imagesToRate, `link`);
    });

    return img;
  });

  return gallery;
};

import { expect } from 'chai';
import activateDeadline from './activateDeadline';

describe(`After activating the deadline on a gallery`, () => {
  it(`each image in the gallery should have an imagesToRate array`, () => {
    let gallery = {
      images: [
        { username: `foo`, link: `foo` },
        { username: `bar`, link: `bar` },
      ],
    };

    let { images } = activateDeadline(gallery);
    let hasImagesToRate = images.every(x => x.imagesToRate);
    expect(hasImagesToRate).to.be.true;
  });

  it(`a users imagesToRate array should not contain their own image`, () => {
    let gallery = {
      images: [
        { username: `foo`, link: `foo` },
        { username: `bar`, link: `bar` },
      ],
    };

    let { images } = activateDeadline(gallery);
    let doesNotContainOwnImage = images
      .filter(x => x.username === `foo`)[0]
      .imagesToRate.every(x => x.link !== `foo`);

    expect(doesNotContainOwnImage).to.be.true;
  });

  describe(`a users imagesToRate array should have 5 images`, () => {
    it(`with just the right number of images`, () => {
      let gallery = {
        images: [
          { username: `foo`, link: `foo` },
          { username: `bar`, link: `bar` },
          { username: `baz`, link: `baz` },
          { username: `foobar`, link: `foobar` },
          { username: `barbaz`, link: `barbaz` },
          { username: `bazfoo`, link: `bazfoo` },
        ],
      };

      let { images } = activateDeadline(gallery);
      let hasFiveImagesToRate = images.every(x => x.imagesToRate.length === 5);
      expect(hasFiveImagesToRate).to.be.true;
    });

    it(`with lots of images, the typical case`, () => {
      let gallery = {
        images: [
          { username: `foo`, link: `foo` },
          { username: `bar`, link: `bar` },
          { username: `baz`, link: `baz` },
          { username: `foobar`, link: `foobar` },
          { username: `barbaz`, link: `barbaz` },
          { username: `bazfoo`, link: `bazfoo` },
          { username: `foobarbaz`, link: `foobarbaz` },
          { username: `barbazfoo`, link: `barbazfoo` },
          { username: `bazfoobar`, link: `bazfoobar` },
        ],
      };

      let { images } = activateDeadline(gallery);
      let hasFiveImagesToRate = images.every(x => x.imagesToRate.length === 5);
      expect(hasFiveImagesToRate).to.be.true;
    });
  });

  it(`each image's imagesToRate array should have the correct length`, () => {
    let gallery = {
      images: [
        { username: `foo`, link: `foo` },
        { username: `bar`, link: `bar` },
      ],
    };

    let { images } = activateDeadline(gallery);

    expect(images[0].imagesToRate).to.have.length(1);
  });
});

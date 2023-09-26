// eslint-disable-next-line no-unused-vars
import photosDB from './photos.json';
// eslint-disable-next-line no-unused-vars
import friendsDB from './friends.json';

export default {
  getRandomElement(array) {
    if (!Array.isArray(array) || array.length == 0) {
      return null;
  }
  const rand = parseInt(Math.random() * array.length);
  return array[rand]
  },
  getNextPhoto() {
    const friend = this.getRandomElement(friendsDB);
    const photosList = photosDB[friend.id];
    const photo = this.getRandomElement(photosList);
    return {
        friend: friend,
        url: photo.url
    }
  },
};

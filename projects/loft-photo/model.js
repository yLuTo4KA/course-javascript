
VK.init({
  apiId: 51763030
});


// const friendsList = await this.init('friends.get', { fields: 'photo_100' });
export default {
  friends: [],
  getRandomElement(array) {
    if (!Array.isArray(array) || array.length == 0) {
      return null;
    }
    const rand = parseInt(Math.random() * array.length);
    return array[rand]
  },
  async getNextPhoto() {
    const randFriend = this.getRandomElement(this.friends.items);
    const photosList = await this.getFriendPhotos(randFriend.id);
    if(photosList.length === 0){
      return {
        friend: randFriend,
        id: randFriend.id,
        url: 'https://mirtex.ru/wp-content/uploads/2023/04/unnamed.jpg'
      }
    }
    const photo = this.getRandomElement(photosList);
    if(photo){
      return {
        friend: randFriend,
        id: randFriend.id,
        url: photo.url,
      }
    }else{
      return {
        friend: randFriend,
        id: randFriend.id,
        url: 'https://mirtex.ru/wp-content/uploads/2023/04/unnamed.jpg',
      }
    }
  },
  login() {
    return new Promise((resolve, reject) => {
      VK.Auth.login(data => {
        if (data.session) {
          resolve();
        } else {
          reject(new Error('Ошибка авторизации!'));
        }
      }, 2)
    })
  },

  async init(method, params) {
    params.v = '5.81';
    return new Promise((resolve, reject) => {
      VK.api(method, params, (data) => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.response);
        }
      })
    })
  },

  photoCache() {},

  async getFriendPhotos(id) {
    // if(this.photoCache[id]){
    //   return this.photoCache[id];
    // }
    const friendsPhoto = await this.init('photos.get', { owner_id: id, album_id: 'profile' });
    const photos = friendsPhoto.items;
    const sortedPhotos = [];
    photos.forEach(photo => {
      for (let i = 0; i < photo.sizes.length; i++) {
        if (photo.sizes[i].width >= 360) {
          sortedPhotos.push(photo.sizes[i]);
          break;
        }
      }
    })
    return sortedPhotos;
    // if (photos) {
    //   return photos;
    // }
    // this.photoCache[id] = photos;

    // return photos;
  
  }
};

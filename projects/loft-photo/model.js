VK.init({
  apiId: 51763030
});
export default {
  // friends: [],
  getRandomElement(array) {
    if (!Array.isArray(array) || array.length == 0) {
      return null;
    }
    const rand = parseInt(Math.random() * array.length);
    return array[rand]
  },
  async getNextPhoto() {
    const friend = this.getRandomElement(this.friends.items);
    const photos = await this.getFriendPhotos(friend.id);
    if (photos.items.length === 0) {
      return {
        friend: friend,
        id: friend.id,
        url: 'https://mirtex.ru/wp-content/uploads/2023/04/unnamed.jpg'
      }
    }
    const photo = this.getRandomElement(photos.items);
    const size = this.findSize(photo);
    return {
      friend: friend,
      id: photo.id,
      url: size.url
    }
    // const randFriend = this.getRandomElement(this.friends.items);
    // const photosList = await this.getFriendPhotos(randFriend.id);
    // if (photosList.length === 0) {
    //   return {
    //     friend: randFriend,
    //     id: randFriend.id,
    //     url: 'https://mirtex.ru/wp-content/uploads/2023/04/unnamed.jpg'
    //   }
    // }
    // const photo = this.getRandomElement(photosList);
    // if (photo) {
    //   return {
    //     friend: randFriend,
    //     id: randFriend.id,
    //     url: photo.url,
    //   }
    // } else {
    //   return {
    //     friend: randFriend,
    //     id: randFriend.id,
    //     url: 'https://mirtex.ru/wp-content/uploads/2023/04/unnamed.jpg',
    //   }
    // }
  },
  findSize(photo) {
    const size = photo.sizes.find((size) => size.width >= 360);
    if(!size){
      return photo.sizes.reduce((biggest, current) => {
        if(current.width > biggest.width){
          return current;
        }
        return biggest;
      }, photo.sizes[0]);
    }
    return size;
  },
  login() {
    return new Promise((resolve, reject) => {
      VK.Auth.login(data => {
        if (data.session) {
          resolve();
        } else {
          reject(new Error('Ошибка авторизации!'));
        }
      }, 2 | 4)
    })
  },
  async init() {
    this.photoCache = {};
    this.friends = await this.getFriends();
    // params.v = '5.81';
    // return new Promise((resolve, reject) => {
    //   VK.api(method, params, (data) => {
    //     if (data.error) {
    //       reject(data.error);
    //     } else {
    //       resolve(data.response);
    //     }
    //   })
    // })
  },
  callApi(method, params) {
    params.v = params.v || '5.154';
    return new Promise((resolve, reject) => {
      VK.api(method, params, (data) => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.response);
        }
      });
    });
  },
  getFriends() {
    const params = {
      fields: ['photo_50, photo_100'],
    }
    return this.callApi('friends.get', params);
  },
  getPhotos(id) {
    const params = {
      owner_id: id
    }
    return this.callApi('photos.getAll', params);
  },
  async getFriendPhotos(id) {
    let photos = this.photoCache[id];
    if (photos) {
      return photos;
    }
    photos = await this.getPhotos(id);
    this.photoCache[id] = photos;
    return photos;
    // if(this.photoCache[id]){
    //   return this.photoCache[id];
    // }
    // const friendsPhoto = await this.init('photos.get', { owner_id: id, album_id: 'profile' });
    // const photos = friendsPhoto.items;
    // const sortedPhotos = [];
    // photos.forEach(photo => {
    //   for (let i = 0; i < photo.sizes.length; i++) {
    //     if (photo.sizes[i].width >= 360) {
    //       sortedPhotos.push(photo.sizes[i]);
    //       break;
    //     }
    //   }
    // })
    // return sortedPhotos;
    // if (photos) {
    //   return photos;
    // }
    // this.photoCache[id] = photos;

    // return photos;

  }
};

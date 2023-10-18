VK.init({
  apiId: 51763030
});
export default {
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
      id: friend.id,
      url: size.url
    }
  },
  findSize(photo) {
    const size = photo.sizes.find((size) => size.width >= 360);
    if (!size) {
      return photo.sizes.reduce((biggest, current) => {
        if (current.width > biggest.width) {
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
          this.vkToken = data.session.sid;
          resolve();
        } else {
          reject(new Error('Ошибка авторизации!'));
        }
      }, 2 | 4)
    })
  },
  logout() {
    return new Promise((resolve) => VK.Auth.revokeGrants(resolve))
  },
  async init() {
    this.photoCache = {};
    this.friends = await this.getFriends();
    this.authorizeUser = await this.getUsers();
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
  getUsers(ids) {
    const params = {
      fields: ['photo_50, photo_100'],
    }
    if (ids !== undefined) {
      params.user_ids = ids;
    }
    return this.callApi('users.get', params);
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
  },
  async like(photo) {
      return new Promise((resolve, reject) => {
        const response = await fetch(`/loft-photo/api/?method=like&photo=${photo}`, {
          method: 'GET',
          header: {
            'vk_token': this.vkToken
          }
        })
        if(response.status >= 400){
          
        }else{
  
        }
      })
  },

  async photoStats(photo) { },

  async getComments(photo) { },

  async postComment(photo, text) { },

};

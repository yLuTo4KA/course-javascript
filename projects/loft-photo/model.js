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
      id: photo.id,
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
  async getData(method, photo){
    const response = await fetch(`/loft-photo/api/?method=${method}&photo=${photo}`, {
      method: 'GET',
      header: {
        'vk_token': this.vkToken
      }
    });
    const data = await response.json();
    return data;
  },
  async postData(method, photo, text){
    const response = await fetch(`/loft-photo/api/?method=${method}&photo=${photo}`, {
      method: 'POST',
      header: {
        'vk_token': this.vkToken
      },
      body: JSON.stringify({text: text})
    })
  },
  async like(photo) {
    const method = 'like';
    return this.getData(method, photo);
  },
  
  async photoStats(photo) { 
    const method = 'photoStats';
    return this.getData(method, photo)
  },

  async getComments(photo) {
    const method = 'getComments';
    return this.getData(method, photo);
   },

  async postComment(photo, text) { 
   const method = 'postComment';
   return this.postData(method, photo, text);
  },

};

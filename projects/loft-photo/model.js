
VK.init({
  apiId: 51763030
})
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

  // --- // 
  //   function callApi(method, params){
  //     params.v = '5.81';
  //     return new Promise((resolve, reject) => {
  //         VK.api(method, params, (data) => {
  //             if(data.error){
  //                 reject(data.error);
  //             }else{
  //                 resolve(data.response);
  //             }
  //         })
  //     })
  // }.then(()=>{return callApi('users.get', {name_case: 'gen'});})
  // .then(([me])=> {
  //   console.log(me)
  //   })
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
  
  async init(method = 'friends.get', params) {
    params.v = '5.81';
    return new Promise((resolve, reject) => {
      VK.api(method, params, (data) => {
        if (data.error) {
          reject (data.error);
        } else {
          resolve (data.response);
        }
      })
    })
  },

  photoCache() { },

  async getFriendPhotos(id) {
    const friendsList = await this.init('friends.get', {fields: 'photo_100'});
    console.log(friendsList)
    friendsList.items.forEach(el => {
      if(el['id'] === id){
        console.log(el) /// --- < sleep 
      }
    })
    const photos = this.photoCache[id];
    if (photos) {
      return photos;
    }
    this.photoCache[id] = photos;
    return photos;
  }
};

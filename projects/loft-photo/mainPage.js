import pages from './pages';
import model from './model';

export default {
    async getNextPhoto() {
        const { friend, id, url } = await model.getNextPhoto();
        this.setFriendAndPhoto(friend, id, url);
    },

    setFriendAndPhoto(friend, id, url) { 
        console.log(friend, id, url);
        const componentPhoto = document.querySelector('.component-photo');
        const componentLinkProfile = document.querySelector('.component-header-profile-link');
        const componentLinkProfilePhoto = document.querySelector('.component-header-photo');
        const componentLinkProfileName = document.querySelector('.component-header-name');
        componentPhoto.innerHTML = `<img src=${url} width='100%' height='100%'>`;
        componentLinkProfile.href = `https://vk.com/id${id}`
        componentLinkProfilePhoto.innerHTML = `<img src=${friend.photo_50} width='100%'>`;
        componentLinkProfileName.textContent = friend.first_name + ' ' + friend.last_name;
    },

    handleEvents() {
        const self = this;
        document
            .querySelector('.page-main')
            .addEventListener('click', async function(){
                console.log('123');
                await self.getNextPhoto();
            })
     },
};

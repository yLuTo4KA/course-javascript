import pages from './pages';
import model from './model';

export default {
    async getNextPhoto() {
        const { friend, id, url } = await model.getNextPhoto();
        this.setFriendAndPhoto(friend, id, url);
    },

    setFriendAndPhoto(friend, id, url) {
        const compPhoto = document.querySelector('.component-photo');
        const compHeaderPhoto = document.querySelector('.component-header-photo');
        const compHeaderName = document.querySelector('.component-header-name');

        compPhoto.style.backgroundImage = `url('${url}')`;
        compHeaderPhoto.style.backgroundImage = `url('${friend.photo_50}')`;
        compHeaderName.textContent = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
        // console.log(friend, id, url);
        // const componentPhoto = document.querySelector('.component-photo');
        // const componentLinkProfile = document.querySelector('.component-header-profile-link');
        // const componentLinkProfilePhoto = document.querySelector('.component-header-photo');
        // const componentLinkProfileName = document.querySelector('.component-header-name');
        // componentPhoto.innerHTML = `<img src=${url} width='100%' height='100%'>`;
        // componentLinkProfile.href = `https://vk.com/id${id}`
        // componentLinkProfilePhoto.innerHTML = `<img src=${friend.photo_50} width='100%'>`;
        // componentLinkProfileName.textContent = friend.first_name + ' ' + friend.last_name;
    },

    handleEvents() {
        let startFrom;
        let endTouch;
        const self = this;
        document
            .querySelector('.component-photo')
            .addEventListener('touchstart', function (e) {
                e.preventDefault();
                startFrom = e.touches[0].clientX;
            });
            document.querySelector('.component-photo').addEventListener('touchend', async function(e){
                endTouch = e.changedTouches[0].clientX;
                if(startFrom - endTouch > 50){
                    await self.getNextPhoto();
                }else if(startFrom - endTouch < 50){
                    await self.getNextPhoto();
                }
            })
    },
    
};

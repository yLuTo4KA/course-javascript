import pages from './pages';
import model from './model';
import profilePage from './profilePage';
import { doc } from 'prettier';

export default {
    async getNextPhoto() {
        const { friend, id, url } = await model.getNextPhoto();
        // const photoStats = await model.photoStats(id);
        this.setFriendAndPhoto(friend, id, url);
        this.setCurrentUserInfo(model.authorizeUser[0]);

    },

    setFriendAndPhoto(friend, id, url, stats) {
        const photoStats = model.photoStats(id);
        console.log(photoStats)
        this.currentFriend = friend;
        
        const compPhoto = document.querySelector('.component-photo');
        const compHeaderPhoto = document.querySelector('.component-header-photo');
        const compHeaderName = document.querySelector('.component-header-name');
        compPhoto.style.backgroundImage = `url('${url}')`;
        compHeaderPhoto.style.backgroundImage = `url('${friend.photo_50}')`;
        compHeaderName.textContent = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
    },
    setCurrentUserInfo(user) {
        const compFooterPhoto = document.querySelector('.component-footer-photo');
        compFooterPhoto.style.backgroundImage = `url('${user['photo_50']}')`
    },
    async loadComments(photo) { },

    setLikes(total, liked) { },

    setComments(total) { },

    handleEvents() {
        let startFrom;
        let endTouch;
        const self = this;
        const exitBtn = document.querySelector('.page-profile-exit');
        document
            .querySelector('.component-photo')
            .addEventListener('touchstart', function (e) {
                e.preventDefault();
                startFrom = e.touches[0].clientX;
            });
        document.querySelector('.component-photo').addEventListener('touchend', async function (e) {
            endTouch = e.changedTouches[0].clientX;
            if (startFrom - endTouch > 50) {
                await self.getNextPhoto();
            } else if (startFrom - endTouch < 50) {
                await self.getNextPhoto();
            }
        });
        document
            .querySelector('.component-footer-container-profile-link')
            .addEventListener('click', (e) => {
                e.preventDefault();
                exitBtn.classList.remove('hidden');
                profilePage.setUser(model.authorizeUser[0]);
                location.hash = '#profile';
            });
        document
            .querySelector('.component-header-profile-link')
            .addEventListener('click', (e) => {
                e.preventDefault();
                exitBtn.classList.add('hidden');
                profilePage.setUser(self.currentFriend);
                location.hash = '#profile';
            })
    },

};

import model from './model';
import mainPage from './mainPage';
import pages from './pages';


export default {
    async setUser(user) {
        const compUserAvatar = document.querySelector('.component-user-info-photo');
        const compUserName = document.querySelector('.component-user-info-name');
        const compUserPhotosContainer = document.querySelector('.component-user-photos');

        compUserPhotosContainer.innerHTML = '';

        compUserAvatar.style.backgroundImage = `url('${user['photo_100']}')`;
        compUserName.textContent = `${user['first_name']} ${user['last_name']}`;

        const userPhotos = await model.getPhotos(user['id']);

        for (let i = 0; i < userPhotos.items.length; i++) {
            const div = document.createElement('div');
            div.classList.add('component-user-photo');
            div.style.backgroundImage = `url('${userPhotos.items[i].sizes[userPhotos.items[i].sizes.length - 1].url}')`;
            div.addEventListener('click', (e) => {
                e.preventDefault();
                mainPage.setFriendAndPhoto(user, user.id, userPhotos.items[i].sizes[userPhotos.items[i].sizes.length - 1].url)
                location.hash = '#main';
            })
            compUserPhotosContainer.appendChild(div);
        };


    },

    handleEvents() {
        document.querySelector('.page-profile-back').addEventListener('click', (e) => {
            e.preventDefault()
            location.hash = '#main';
        });

        document.querySelector('.page-profile-exit').addEventListener('click', async (e) => {
            e.preventDefault();
            await model.logout();
            location.hash = '#login';
        });
    }
}
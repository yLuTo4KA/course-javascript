import model from './model';
import mainPage from './mainPage';
import pages from './pages';


export default {
    async setUser(user) {
        const compUserAvatar = document.querySelector('.component-user-info-photo');
        const compUserName = document.querySelector('.component-user-info-name');
        const compUserPhotosContainer = document.querySelector('.component-user-photos');
        const compUserFriendsContainer = document.querySelector('.component-user-friends');

        compUserPhotosContainer.innerHTML = '';
        compUserFriendsContainer.innerHTML = '';

        compUserAvatar.style.backgroundImage = `url('${user['photo_100']}')`;
        compUserName.textContent = `${user['first_name']} ${user['last_name']}`;

        const userPhotos = await model.getPhotos(user['id']);
        const userFriends = await model.getFriends(user['id']);
        
        for (let i = 0; i < userPhotos.items.length; i++) {
            const currentPhoto = userPhotos.items[i];
            const div = document.createElement('div');
            div.classList.add('component-user-photo');
            div.style.backgroundImage = `url('${currentPhoto.sizes[userPhotos.items[i].sizes.length - 1].url}')`;
            div.addEventListener('click', async (e) => {
                e.preventDefault();
                const photoStats = await model.photoStats(currentPhoto.id);
                mainPage.setFriendAndPhoto(user, currentPhoto.id, currentPhoto.sizes[userPhotos.items[i].sizes.length - 1].url, photoStats)
                location.hash = '#main';
            })
            compUserPhotosContainer.appendChild(div);
        };
        for(let i = 0; i < userFriends.count; i++){
            const friendsList = document.querySelector('.component-user-friends__list');
            const currentFriend = userFriends.items[i];
            const li = document.createElement('li');
            const div = document.createElement('div');
            div.classList.add('friend__photo');
            div.style.backgroundImage = `url('${currentFriend['photo_50']}')`;
            const friendTemplate = `<a href="#" class="friend__profile"><div class="friend__name">${currentFriend.first_name} ${currentFriend.last_name}</div></div>`
            li.classList.add('friend', 'friend__item');
            li.innerHTML = friendTemplate;
            li.prepend(div);
            li.addEventListener('click', async(e)=>{
                e.preventDefault();
                const currentFriendPhotos = await model.getFriendPhotos(currentFriend.id);
                const randomPhotos = model.getRandomElement(currentFriendPhotos.items);
                const randomPhotosSized = model.findSize(randomPhotos);
                const photoStats = await model.photoStats(randomPhotos.id);
                mainPage.setFriendAndPhoto(currentFriend, randomPhotos.id, randomPhotosSized.url, photoStats);
                location.hash = '#main';
            })
            friendsList.appendChild(li);
            

        }


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
        document.querySelector('.page-profile-photos').addEventListener('click', async (e)=>{
            e.preventDefault();
            const currentEl = e.target;
            document.querySelector('.page-profile-friends').classList.remove('link--active');
            currentEl.classList.add('link--active')
            document.querySelector('.component-user-photos').classList.remove('hidden');
            document.querySelector('.component-user-friends').classList.add('hidden');
        });
        document.querySelector('.page-profile-friends').addEventListener('click', async (e)=>{
            e.preventDefault();
            const currentEl = e.target;
            document.querySelector('.page-profile-photos').classList.remove('link--active');
            currentEl.classList.add('link--active')
            document.querySelector('.component-user-photos').classList.add('hidden');
            document.querySelector('.component-user-friends').classList.remove('hidden');
        });
        
    }
}
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
        this.userFriendsList = userFriends.items;

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
        this.setFriendsList(this.userFriendsList);


    },
    setFriendsList(friendsList) {
        const compUserFriendsContainer = document.querySelector('.component-user-friends');
        compUserFriendsContainer.innerHTML = '';
        for (let friend of friendsList) {
            const friendsList = document.querySelector('.component-user-friends__list');
            const currentFriend = friend;
            const li = document.createElement('li');
            const div = document.createElement('div');
            div.classList.add('friend__photo');
            div.style.backgroundImage = `url('${currentFriend['photo_50']}')`;
            const friendTemplate = `<a href="#" class="friend__profile"><div class="friend__name">${currentFriend.first_name} ${currentFriend.last_name}</div></div>`
            li.classList.add('friend', 'friend__item');
            li.innerHTML = friendTemplate;
            li.prepend(div);
            li.addEventListener('click', async (e) => {
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
        document.querySelector('.page-profile-photos').addEventListener('click', async (e) => {
            e.preventDefault();
            const currentEl = e.target;
            document.querySelector('.component-user-info-search').classList.add('hidden');
            document.querySelector('.page-profile-friends').classList.remove('link--active');
            currentEl.classList.add('link--active')
            document.querySelector('.component-user-photos').classList.remove('hidden');
            document.querySelector('.component-user-friends').classList.add('hidden');
        });
        document.querySelector('.page-profile-friends').addEventListener('click', async (e) => {
            e.preventDefault();
            const currentEl = e.target;
            document.querySelector('.component-user-info-search').classList.remove('hidden');
            document.querySelector('.page-profile-photos').classList.remove('link--active');
            currentEl.classList.add('link--active')
            document.querySelector('.component-user-photos').classList.add('hidden');
            document.querySelector('.component-user-friends').classList.remove('hidden');
        });
        document.querySelector('#search-friend').addEventListener('input', async (e) => {
            const valueInput = ((document.querySelector('#search-friend').value).toLowerCase()).trim();
            if (valueInput !== '') {
                let friendsSort = [];
                for (let friend of this.userFriendsList) {
                    if (friend.last_name.toLowerCase().includes(valueInput) || friend.first_name.toLowerCase().includes(valueInput)) {
                        friendsSort.push(friend);
                    }
                }
                this.setFriendsList(friendsSort);
            } else {
                this.setFriendsList(this.userFriendsList)
            }

        });

    }
}
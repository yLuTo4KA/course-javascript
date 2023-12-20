import pages from './pages';
import model from './model';
import profilePage from './profilePage';
import Handlebars from 'handlebars';

import { doc } from 'prettier';

export default {
    async getNextPhoto() {
        const { friend, id, url } = await model.getNextPhoto();
        const photoStats = await model.photoStats(id);
        this.setFriendAndPhoto(friend, id, url, photoStats);
        this.setCurrentUserInfo(model.authorizeUser[0]);
        
    },

    setFriendAndPhoto(friend, id, url, stats) {
        const compPhoto = document.querySelector('.component-photo');
        const compHeaderPhoto = document.querySelector('.component-header-photo');
        const compHeaderName = document.querySelector('.component-header-name');

        this.currentFriend = friend;
        this.photoId = id;

        compPhoto.style.backgroundImage = `url('${url}')`;
        compHeaderPhoto.style.backgroundImage = `url('${friend.photo_50}')`;
        compHeaderName.textContent = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
        this.setLikes(stats.likes, stats.liked);
        this.setComments(stats.comments);
    },
    setCurrentUserInfo(user) {
        const compFooterPhoto = document.querySelector('.component-footer-photo');
        compFooterPhoto.style.backgroundImage = `url('${user['photo_50']}')`
    },
    async loadComments(photo) {
        const comments = await model.getComments(photo);
        // const commentsElements = commentsTemplate({
        //     list: comments.map((comment)=>{
        //         return{
        //             name: `${comment.user.first_name ?? ''} ${comment.user.last_name ?? ''}`,
        //             photo: comment.user.photo_50,
        //             text: comment.text,
        //         }
        //     })
        // });
        const source = '{{#each list}}\n  <div class="component-comment">\n    <div class="component-comment-photo" style="background-image: url(\'{{photo}}\')"></div>\n    <div class="component-comment-content">\n      <div class="component-comment-name">{{name}}</div>\n      <div class="component-comment-text">{{text}}</div>\n    </div>\n  </div>\n{{/each}}';
        const template = Handlebars.compile(source);
        const commentsData = {
            list: comments.map((comment)=>{
                return{
                    name: `${comment.user.first_name ?? ''} ${comment.user.last_name ?? ''}`,
                    photo: comment.user.photo_50,
                    text: comment.text
                }
            })
        };
        const el = document.createElement('div');
        el.innerHTML = template(commentsData)
        document.querySelector('.component-comments-container-list').innerHTML = '';
        document.querySelector('.component-comments-container-list').append(el);
        this.setComments(comments.length)
     },

    setLikes(total, liked) { 
        const compLikes = document.querySelector('.component-footer-container-social-likes');
        compLikes.textContent = total;
        if(liked){
            compLikes.classList.add('liked');
        }else{
            compLikes.classList.remove('liked');
        }
    },

    setComments(total) { 
        const compComment = document.querySelector('.component-footer-container-social-comments');
        compComment.textContent = total;
    },

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
                profilePage.setUser(this.currentFriend);
                location.hash = '#profile';
            });
        document.querySelector('.component-footer-container-social-likes').addEventListener('click', async(e)=>{
            e.preventDefault();
            const {likes, liked} = await model.like(this.photoId)
            self.setLikes(likes, liked);
        });
        document.querySelector('.component-footer-container-social-comments').addEventListener('click', async(e)=>{
            e.preventDefault();
            document.querySelector('.component-comments').classList.remove('hidden');
            await self.loadComments(self.photoId);
        });
        document.querySelector('.component-comments').addEventListener('click', (e)=>{
            if(e.target === e.currentTarget){
                document.querySelector('.component-comments').classList.add('hidden');
            }
        })
        const input = document.querySelector('.component-comments-container-form-input');

        document.querySelector('.component-comments-container-form-send').addEventListener('click', async(e)=>{
            e.preventDefault();
            if(input.value.trim().length){
                await model.postComment(self.photoId, input.value.trim());
                input.value = '';
                await self.loadComments(self.photoId);
            }
        })
    },

};

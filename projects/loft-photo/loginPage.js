import model from './model';
import pages from './pages';
import mainPage from './mainPage';

export default {
    handleEvents() {

        document
            .querySelector('.page-login-button')
            .addEventListener('click', async () => {
                await model.login()
                const friendsList = await model.init('friends.get', {fields: 'city, country'})
                await model.getFriendPhotos(277831931);
                // model.init('users.get', {});
            });
    }
}
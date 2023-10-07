import model from './model';
import pages from './pages';
import mainPage from './mainPage';

export default {
    handleEvents() {

        document
            .querySelector('.page-login-button')
            .addEventListener('click', async () => {
                await model.login();
                model.friends = await model.init('friends.get', { fields: 'photo_50' });
                pages.openPage('main');
                await mainPage.getNextPhoto()
            });
    }
}
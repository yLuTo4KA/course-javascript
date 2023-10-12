import model from './model';
import pages from './pages';
import mainPage from './mainPage';

export default {
    handleEvents() {

        document
            .querySelector('.page-login-button')
            .addEventListener('click', async () => {
                try {
                    await model.login();
                    await model.init();
                    location.hash = '#main';
                    await mainPage.getNextPhoto();
                }catch(error){
                    console.log(error);
                    location.hash = '#login';
                }
            });
    }
}
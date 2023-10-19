import pages from './pages';
import model from './model';
import mainPage from './mainPage';
import loginPage from './loginPage';
import profilePage from './profilePage';

import('./styles.css');


window.addEventListener('hashchange', (e)=>{
    pages.openPage(location.hash);
})
location.hash = '#login';
loginPage.handleEvents();
mainPage.handleEvents();
profilePage.handleEvents();


const pagesMap = {
    login: '.page-login',
    main: '.page-main',
    profile: '.page-profile',
};
export default {
    openPage(name) {
        let allPage = document.querySelectorAll('.page');
        let openingPage = document.querySelector(pagesMap[name])
        allPage.forEach(page => {
            page.classList.add('hidden');
        })
        openingPage.classList.remove('hidden');
    }
};

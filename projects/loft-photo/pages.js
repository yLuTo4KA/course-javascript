const pagesMap = {
    '#login': '.page-login',
    '#main': '.page-main',
    '#profile': '.page-profile',
};
export default {
    openPage(name) {
        const pageName = pagesMap[name]
        if(pageName){
            const openingPage = document.querySelector(pageName)
            if(openingPage){
                if(this.currentPage){
                    this.currentPage.classList.add('hidden');
                }
                openingPage.classList.remove('hidden');
                this.currentPage = openingPage;
            }
        }
    }
};

(function () {
    'use strict';

    angular.module('app', [
        'ui.router',
        'app.index',
        'app.login',
        'app.chat',
        'app.user',
        'app.outros',
        'app.bot',
        'app.filtersC',
        'app.filtersT',
        'app.nav.header',
        'app.nav.menu',
        'app.nav.footer',
        'app.modal',
        'app.directives.divSize'
    ]);
})();

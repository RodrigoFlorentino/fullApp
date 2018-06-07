(function () {
    'use strict';

    angular.module('app.nav.header', [])
        .controller('headerController', headerController);

    headerController.$inject = ['$location','$localStorage'];

    function headerController($location,$localStorage) {

        var vm = this;
        vm.logout = logout;

        function logout(){

            $localStorage.token = '';
            $location.path('/admin');

        }

    }
})();

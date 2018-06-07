(function () {
    'use strict';
    angular.module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('', '/bot');
        $urlRouterProvider.when('/', '/bot');
        $urlRouterProvider.when('/admin', '/login');
        $urlRouterProvider.when('/chat', '/chat/list');
        $urlRouterProvider.when('/user', '/user/list');
        $urlRouterProvider.when('/outros', '/outros/list');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'core/login/login.html',
                controller: 'loginController',
                controllerAs: 'LC',
                restrictions: {
                    ensureAuthenticated: false
                }
            })
            .state('bot', {
                url: '/bot',
                templateUrl: 'core/bot/bot.html',
                controller: 'botController',
                controllerAs: 'BC',
                restrictions: {
                    ensureAuthenticated: false
                }
            })
            .state('root', {
                abstract: true,
                url: '/',
                data: {
                    title: 'Home',
                    breadcrumb: 'Home'
                },
                views: {
                    'header': {
                        templateUrl: 'core/navigation/headerView.html',
                        controller: 'headerController',
                        controllerAs: 'HC'
                    },
                    'menu': {
                        templateUrl: 'core/navigation/menuView.html',
                        controller: 'menuController',
                        controllerAs: 'MC'
                    },
                    'breadcrumbs': {
                        templateUrl: 'core/navigation/breadcrumbsView.html',
                        controller: '',
                        controllerAs: ''
                    },
                    'content': {
                        template: 'Choose option from menu...'
                    },
                    'footer': {
                        templateUrl: 'core/navigation/footerView.html',
                        controller: 'footerController',
                        controllerAs: 'FC'
                    }
                }
            })
            .state('root.chat', {
                abstract: true,
                url: 'chat',
                data: {
                    title: 'Conversas',
                    breadcrumb: 'Conversas'
                }
            })
            .state('root.chat.list', {
                url: '/list',
                restrictions: {
                    ensureAuthenticated: true
                },
                data: {
                    title: 'Conversas',
                    breadcrumb: 'Conversas',
                    caminho: '/chat/list'
                },
                views: {
                    'content@': {
                        templateUrl: 'core/chat/chat.html',
                        controller: 'chatController',
                        controllerAs: 'CC'
                    }
                }
            })
            .state('root.user', {
                abstract: true,
                url: 'user',
                data: {
                    title: 'Usuários',
                    breadcrumb: 'Usuários'
                }
            })
            .state('root.user.list', {
                url: '/list',
                restrictions: {
                    ensureAuthenticated: true
                },
                data: {
                    title: 'Usuários',
                    breadcrumb: 'Usuários',
                    caminho: '/user/list'
                },
                views: {
                    'content@': {
                        templateUrl: 'core/user/user.html',
                        controller: 'userController',
                        controllerAs: 'UC'
                    }
                }
            })
            .state('root.outros', {
                abstract: true,
                url: 'outros',
                data: {
                    title: 'Outros',
                    breadcrumb: 'Outros'
                }
            })
            .state('root.outros.list', {
                url: '/list',
                restrictions: {
                    ensureAuthenticated: true
                },
                data: {
                    title: 'Outros',
                    breadcrumb: 'Outros',
                    caminho: '/outros/list'
                },
                views: {
                    'content@': {
                        templateUrl: 'core/outros/outros.html',
                        controller: 'outrosController',
                        controllerAs: 'OC'
                    }
                }
            })

        };

        angular.module('app').run(run);
        run.$inject = ['$rootScope','$location','$http','$localStorage'];

        function run($rootScope, $location, $http, $localStorage){

            $rootScope.$on("$stateChangeStart", function(evt, to, toP, from, fromP) {

                if(to.restrictions.ensureAuthenticated) {

                    if (!$localStorage.token) {
                        $location.path('/login');
                    }else{
                        var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}}
                        var data = {token: $localStorage.token};

                        $http.post('/api/validate',JSON.stringify(data),config).then(
                            function(response) {
                                $location.path(to.name);
                            },
                            function(error){
                                $location.path('/login');
                            }
                        );
                    }

                } else {
                    $location.path(to.name);
                }

            });

            //$rootScope.$on("$stateChangeStart", function(evt, to, toP, from, fromP) { console.log("Start:   " + message(to, toP, from, fromP)); });
            //$rootScope.$on("$stateChangeSuccess", function(evt, to, toP, from, fromP) { console.log("Success: " + message(to, toP, from, fromP)); });
            //$rootScope.$on("$stateChangeError", function(evt, to, toP, from, fromP, err) { console.log("Error:   " + message(to, toP, from, fromP), err); });

        };

        function message(to, toP, from, fromP) { return from.name  + angular.toJson(fromP) + " -> " + to.name + angular.toJson(toP); };

})();

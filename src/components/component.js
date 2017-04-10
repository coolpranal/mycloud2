import angular from 'angular'

const componentModule = angular.module('component.module', [])
const mods = []

export const register = (route) => {
  componentModule.component(route.name, route.component)
  mods.push(route.route)
}

componentModule.config(['$stateProvider', '$urlRouterProvider', (stateProvider, urlRouterProvider) => {
  mods.forEach(stateProvider.state)
  urlRouterProvider.otherwise('/app/home')
}])

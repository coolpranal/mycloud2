import angular from 'angular'

const serviceModule = angular.module('service.module', [])
const mods = []

export const register = (service) => {
  serviceModule.service(service.name, service)
  mods.push(service)
}

serviceModule.config([() => { }])

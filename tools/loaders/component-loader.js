const path = require('path')
const camelCase = require('lodash.camelcase')
const capitalize = require('./capitalize')

module.exports = function (input) {
  this.cacheable()
  const fileName = path.basename(this.resourcePath, '.component.js')
  const controllerName = `${capitalize(camelCase(fileName))}Controller`
  const directiveName = camelCase(fileName)

  return `${input}

/* eslint-disable */
if (module.hot) {
  module.hot.accept()
  const name = ${controllerName}.name
  const doc = angular.element(document.body)
  const injector = doc.injector()
  if (injector) {
    const directive = injector.get('${directiveName}Directive')[0]
    if (directive) {
      const origin = directive.controller
      const target = ${controllerName}.prototype
      const enumAndNonenum = Object.getOwnPropertyNames(target)
      const enumOnly = Object.keys(target)
      const nonenumOnly = enumAndNonenum.filter(key => enumOnly.indexOf(key) === -1 && key !== 'constructor')
      nonenumOnly.forEach(val => origin.prototype[val] = target[val])
      angular.element(document).find('html').scope().$apply()
      console.info('Hot Swapped ' + name)
    }
  }
}
  `
}

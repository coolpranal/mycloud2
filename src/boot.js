import angular from 'angular'
import $ from 'jquery'
import 'bootstrap/dist/js/bootstrap'

import 'angular-ui-router'
import Highcharts from 'highcharts'
import 'dropzone'
import 'ngdropzone'

import 'highcharts-ng'
import 'angular-toastr'
import 'angular-sanitize'

import './assets/js/app'

import './services'
import './components/app/app.component'
import './components/login/login.component'

// css
import './assets/css/style.scss'

// shim highcharts
global.Highcharts = Highcharts

// main module
angular.module('woo1.kr', [
  'ui.router',
  'component.module',
  'service.module',
  'highcharts-ng',
  'toastr',
  'ngSanitize',
  'thatisuday.dropzone',
])
  .config(['$locationProvider', function (locationProvider) {
    locationProvider.html5Mode(true)
  }])
  .config(['dropzoneOpsProvider', function (dropzoneOpsProvider) {
    dropzoneOpsProvider.setOptions({
      url: '/api',
      maxFilesize: '10',
    })
  }])
  .run(['Socket', (Socket) => {
    Socket.connect()
  }])
  .config(($provide) => {
    $provide.decorator('$q', ['$delegate', '$rootScope', ($delegate, $rootScope) => {
      let pendingPromisses = 0
      $rootScope.$watch(
        () => pendingPromisses > 0,
        (loading) => { $rootScope.loading = loading },
      )
      const $q = $delegate
      const origDefer = $q.defer
      $q.defer = () => {
        const defer = origDefer()
        pendingPromisses += 1
        defer.promise.finally(() => {
          pendingPromisses -= 1
        })
        return defer
      }
      return $q
    }])
  })
  .config(['$qProvider', function ($qProvider) {
    // https://github.com/angular-ui/ui-grid/issues/5890#issuecomment-267515875
    $qProvider.errorOnUnhandledRejections(false)
  }])
  .config(['toastrConfig', (toastrConfig) => {
    angular.extend(toastrConfig, {
      timeOut: 10000,
    })
  }])
  .run(($rootScope, $stateParams, $http, $q,
    $anchorScroll, $transitions, $window, $timeout, $state, $location, Auth) => {
  })

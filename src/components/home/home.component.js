import template from './home.html'
import { register } from '../component'

import './home.scss'

const name = 'home'
const bindings = {
  home: '=',
}

export class HomeController {
  constructor($log, $http, $scope) {
    'ngInject'

    this.log = $log
    this.http = $http
    this.scope = $scope
  }
}

register({
  name,
  route: {
    name: 'app.home',
    url: '/home',
    resolve: {
      home: ['$http', http => http.get('/api/home').then(response => response.data)],
    },
    views: {
      content: {
        component: name,
      },
    },
  },
  component: {
    bindings,
    controller: HomeController,
    template,
  },
})

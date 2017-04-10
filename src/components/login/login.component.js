import template from './login.html'
import { register } from '../component'

const name = 'login'

export class LoginController {
  static bindings = {
    username: '=',
    password: '=',
    loginURL: '<',
  }

  constructor($http, $transitions, $state) {
    'ngInject'

    this.http = $http
    this.transitions = $transitions
    this.state = $state
    this.testValue = 'test'
    this.$onInit = () => {
      // console.log(this.loginURL)
    }
  }

  async onSubmit() {
    const result = (await this.http.post('/api/user/login', {
      username: this.username,
      password: this.password,
    })).data
    if (result.roles.indexOf('admin') !== -1) {
      this.state.go('app.home')
    }
  }
}

register({
  name,
  route: {
    name,
    url: '/login',
    resolve: {
      loginURL: ['$http', http => http.get('/api/user/login-uri').then(response => response.data.url)],
    },
    component: name,
  },
  component: {
    bindings: LoginController.bindings,
    controller: LoginController,
    template,
  },
})

import { register } from './service'

class Auth {
  constructor($http) {
    this.http = $http
    this.loadedAuth = null
  }

  getLoadedAuth() {
    return this.loadedAuth
  }

  loadAuth() {
    return this.http.get('/api/user/load-auth').then(
      (response) => {
        this.loadedAuth = response.data
        return response
      },
      (error) => {
        this.loadedAuth = null
        throw error
      },
    )
  }
}

register(Auth)

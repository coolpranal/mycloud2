import template from './app.html'
import { register } from '../component'

import '../home/home.component'
import '../torrent/torrent.component'

const name = 'app'

const submenus = [
  [
    { link: 'app.torrent', name: 'torrent', invisible: true },
  ],
]

const bindings = {
  companies: '=',
}

export class AppController {
  constructor($http, $state, $transitions, Auth) {
    'ngInject'

    this.http = $http
    this.state = $state
    this.transitions = $transitions

    this.loadedAuth = Auth.getLoadedAuth()
    this.DEVELOPMENT = DEVELOPMENT
    this.submenu = []

    this.setSubmenu($state.current.name)
  }

  /**
   * app global submenu
   * @param {*}
   */
  setSubmenu(currentState) {
    this.submenu = []
    let i
    let j
    try {
      for (i = 0; i < submenus.length; i += 1) {
        for (j = 0; j < submenus[i].length; j += 1) {
          if (currentState === submenus[i][j].link) throw new Error()
        }
      }
    } catch (e) {
      this.submenu = submenus[i]
    }
  }

  $onInit() {
    this.transitions.onEnter({ to: 'app.**' }, (trans, state) => {
      this.setSubmenu(state.name)
    })
  }

  async logout() {
    await this.http.get('/api/user/logout')
    this.state.go('login')
  }
}

register({
  name,
  route: {
    name: 'app',
    abstract: true,
    url: '/app',
    component: name,
  },
  component: {
    bindings,
    controller: AppController,
    template,
  },
})

import template from './torrent.html'
import { register } from '../component'

const name = 'torrent'
const bindings = {
  entries: '<',
}

export class TorrentController {
  constructor($log, $http, $scope, toastr) {
    'ngInject'

    this.log = $log
    this.http = $http
    this.scope = $scope
    this.toastr = toastr
  }

  $onInit = () => {
    this.dzOptions = {
      url: '/api/torrent/torrents',
      paramName: 'file',
      maxFilesize: '10',
      acceptedFiles: 'image/jpeg, images/jpg, image/png',
      addRemoveLinks: true,
    }
    // Handle events for dropzone
    // Visit http://www.dropzonejs.com/#events for more events
    this.dzCallbacks = {
      addedfile(file) {
        console.log(file)
        // this.newFile = file;
      },
      success(file, xhr) {
        console.log(file, xhr)
      },
    }
    this.dzMethods = {}
  }

  // Apply methods for dropzone
  // Visit http://www.dropzonejs.com/#dropzone-methods for more methods
  removeNewFile() {
    // We got $scope.newFile from 'addedfile' event callback
    this.dzMethods.removeFile(this.newFile)
  }
}

register({
  name,
  route: {
    name: 'app.torrent',
    url: '/torrent',
    resolve: {
      entries: ['$http', http => http.get('/api/torrent/entries').then(response => response.data.entries)],
    },
    views: {
      content: {
        component: name,
      },
    },
  },
  component: {
    bindings,
    controller: TorrentController,
    template,
  },
})

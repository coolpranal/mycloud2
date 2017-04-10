import { register } from './service'

class TorrentData {
  constructor($http) {
    this.http = $http
  }

  process(torrents) {
    return torrents
  }

  remap(torrents) {
    return this.process(torrents)
  }

  get(id) {
    return this.http.get(`/api/torrents/${id}`)
      .then(response => response.data.torrents)
      .then(torrents => this.remap(torrents))
  }
}

register(TorrentData)

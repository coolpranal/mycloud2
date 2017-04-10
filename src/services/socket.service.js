import Nes from 'nes'
import { register } from './service'

/**
 * register되기전 들어온 message를 pendings에 저장
 * register되면 pendings를 다시 iterate
 */
class Socket {
  constructor($http, $log, $location) {
    this.http = $http
    this.log = $log
    this.localhost = `ws://${$location.host()}:${$location.port()}`

    this.client = null
    this.callbacks = []
    this.pendings = [] // TODO limit config
  }

  connect() {
    this.client = new Nes.Client(this.localhost)
    this.client.connect((/* err1 */) => {
      this.log.debug('[SOCKET] connected')
      // client.request('hello', (err2, payload) => {
      //   console.log('payload', payload)
      // })

      this.client.onUpdate = (update) => {
        // 아무도 관심없는 메시지인 경우 pendings 보관
        // TODO pendings limit 설정
        if (!this.process(update)) {
          this.pendings.push(update)
        }
      }
      this.log.debug('[SOCKET] registered onUpdate handler')
    })
  }

  process(update) {
    let responseFlag = false
    this.callbacks.forEach((callback) => {
      // 처리한 콜백은 true를 반환하도록 강제
      if (callback(update) && !responseFlag) {
        responseFlag = true
      }
    })
    return responseFlag
  }

  register(callback) {
    this.callbacks.push(callback)
    if (this.pendings.length === 0) return
    const newPending = []
    this.pendings.forEach((update) => {
      if (!this.process(update)) {
        newPending.push(update)
      }
    })
    this.pendings = newPending
  }
}

register(Socket)

import { observable, action, computed } from 'mobx'
import ZeroFrame from 'zeroframe'
import EventEmitter from 'events'

const READ_PIECE_ALERT = 'read_piece'
const PIECE_FINISHED_ALERT = 'piece_finished'
const ADD_TORRENT_ALERT = 'add_torrent'
const TORRENT_CHECKED_ALERT = 'torrent_checked'

class Site extends ZeroFrame {
  @observable serverInfo = {}
  @observable siteInfo = {}

  constructor () {
    super()

    // Work only for one infohash... Need one map of torrent and each a pieces map...
    this.readPiecesCallbacks = new Map()
    this.events = new EventEmitter()

    this.addTorrent = this.addTorrent.bind(this)
  }

  onRequest (cmd, message) {
    switch(cmd) {
      case "setSiteInfo":
        this.setSiteInfo(message.params)
        break
      case READ_PIECE_ALERT:
        if (this.readPiecesCallbacks.has(message.params.pieceIndex)) {
          var callback = this.readPiecesCallbacks.get(message.params.pieceIndex)
          var response = {
            piece: message.params.pieceIndex,
            size: message.params.size,
            buffer: message.params.buffer
          }
          callback(response)
        }
        break
      case PIECE_FINISHED_ALERT:
        this.events.emit(PIECE_FINISHED_ALERT, message.params.pieceIndex)
        break
      case ADD_TORRENT_ALERT:
        this.events.emit(ADD_TORRENT_ALERT)
        break
      case TORRENT_CHECKED_ALERT:
        this.events.emit(TORRENT_CHECKED_ALERT)
        break
      default:
        console.log(`Unknown command: ${cmd}`)
    }
  }

  @computed get hasTorrentPlugin () {
    if (this.serverInfo.plugins && this.serverInfo.plugins.indexOf('Torrent') > 0) {
      return true
    }
    return false
  }

  @computed get hasTorrentPermission () {
    if (this.siteInfo.settings && this.siteInfo.settings.permissions.indexOf('Torrent') > -1) {
      return true
    }
    return false
  }

  @action setServerInfo (info) {
    this.serverInfo = info
  }

  @action setSiteInfo (info) {
    this.siteInfo = info
  }

  fetchServerInfo () {
    return new Promise((resolve, reject) => {
      this.cmd('serverInfo', {}, (response) => {
        if (!response.error) {
          this.setServerInfo(response)
          resolve(response)
        } else {
          reject()
        }
      })
    })
  }

  fetchSiteInfo () {
    return new Promise((resolve, reject) => {
      this.cmd('siteInfo', {}, (response) => {
        if (!response.error) {
          this.setSiteInfo(response)
          resolve(response)
        } else {
          reject()
        }
      })
    })
  }

  addTorrent = (torrentIdentifier) => {
    return new Promise((resolve, reject) => {
      this.cmd('addTorrent', torrentIdentifier, (response) => {
        if (response.info_hash) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }

  getTorrentStatus = (infoHash) => {
    return new Promise((resolve, reject) => {
      this.cmd('torrentStatus', infoHash, function (response) {
        if (!response.error) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }

  getTorrentInfo = (infoHash) => {
    return new Promise((resolve, reject) => {
      this.cmd('getTorrentInfo', infoHash, function (response) {
        if (!response.error) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }

  getPluginVersion = () => {
    return new Promise((resolve, reject) => {
      this.cmd('getVersion', {}, function (response) {
        if (!response.error) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }

  addPluginRequest = (platform) => {
    return new Promise((resolve, reject) => {
      this.cmd('pluginAddRequest', `plugin/Torrent`, function (response) {
        if (!response.error) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }

  addTorrentPermission = () => {
    return new Promise((resolve, reject) => {
      this.cmd('wrapperPermissionAdd', ['Torrent'], function (response) {
        console.log(response)
        if (!response.error && response === "ok") {
          resolve()
        } else {
          reject()
        }
      })
    })
  }

}

export default Site

import { observable, action, computed } from 'mobx'
import ZeroFrame from 'zeroframe'
import EventEmitter from 'events'

const READ_PIECE_ALERT = 'read_piece'
const PIECE_FINISHED_ALERT = 'piece_finished'
const ADD_TORRENT_ALERT = 'add_torrent'
const TORRENT_CHECKED_ALERT = 'torrent_checked'

class Site extends ZeroFrame {
  @observable serverInfo = {}

  constructor () {
    super()

    // Work only for one infohash... Need one map of torrent and each a pieces map...
    this.readPiecesCallbacks = new Map()
    this.events = new EventEmitter()

    this.addTorrent = this.addTorrent.bind(this)
  }

  onRequest (cmd, message) {
    console.log(cmd)
    switch(cmd) {
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
    }
  }

  @computed get hasTorrentPlugin () {
    if (this.serverInfo.plugins && this.serverInfo.plugins.indexOf('Torrent') > 0) {
      return true
    }
    return false
  }

  @action setServerInfo (info) {
    console.log(info)
    this.serverInfo = info
  }

  fetchServerInfo () {
    this.cmd('serverInfo', {}, (response) => {
      this.setServerInfo(response)
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

  addPluginRequest = () => {
    return new Promise((resolve, reject) => {
      this.cmd('pluginAddRequest', 'Torrent', function (response) {
        if (!response.error) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }

}

export default Site

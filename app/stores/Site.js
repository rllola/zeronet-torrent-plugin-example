import { observable, action, computed } from 'mobx'
import ZeroFrame from 'zeroframe'
import EventEmitter from 'events'

const READ_PIECE_ALERT = 'read_piece_alert'
const PIECE_FINISHED_ALERT = 'piece_finished_alert'

class Site extends ZeroFrame {
  @observable serverInfo = {}

  constructor () {
    super()

    this.readPiecesCallbacks = new Map()
    this.events = new EventEmitter()

    this.addTorrent = this.addTorrent.bind(this)

    this.fetchServerInfo()
  }

  route (cmd, message) {
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
        console.log(message)
        this.events.emit(PIECE_FINISHED_ALERT)
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
    this.serverInfo = info
  }

  fetchServerInfo () {
    this.cmd('serverInfo', {}, (response) => {
      this.setServerInfo(response)
    })
  }

  addTorrent (torrentIdentifier) {
    var self = this

    return new Promise((resolve, reject) => {
      self.cmd('addTorrent', torrentIdentifier, (response) => {
        if (response.info_hash) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }

  getTorrentStatus (infoHash) {
    var self = this
    return new Promise((resolve, reject) => {
      self.cmd('torrentStatus', infoHash, function (response) {
        if (!response.error) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }

  getTorrentInfo (infoHash) {
    var self = this
    return new Promise((resolve, reject) => {
      self.cmd('getTorrentInfo', infoHash, function (response) {
        if (!response.error) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }

  readPiece (infoHash, pieceIndex, callback) {
    var self = this
    if (typeof callback !== 'function') {
      throw 'Callback need to be a function !'
    } else {
      this.cmd('readPiece', {info_hash: infoHash, piece_index: pieceIndex}, (response) => {
        if (response === 'ok') {
          console.log('OK')
          self.readPiecesCallbacks.set(pieceIndex, callback)
        } else {
          console.error(response.error)
        }
      })
    }
  }

  havePiece (infoHash, pieceIndex, callback) {
    if (typeof callback !== 'function') {
      throw 'Callback need to be a function !'
    } else {
      this.cmd('havePiece', {info_hash: infoHash, piece_index: pieceIndex}, (response) => {
        if (response.error) {
          console.error(response.error)
        } else {
          callback(response)
        }
      })
    }
  }
}

export default Site

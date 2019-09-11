import { observable, action, computed } from 'mobx'
import ZeroFrame from 'zeroframe'
import EventEmitter from 'events'

const READ_PIECE_ALERT = 'read_piece_alert'
const PIECE_FINISHED_ALERT = 'piece_finished_alert'

class Site extends ZeroFrame {
  @observable serverInfo = {}

  constructor () {
    super()

    // Work only for one infohash... Need one map of torrent and each a pieces map...
    this.readPiecesCallbacks = new Map()
    this.events = new EventEmitter()

    this.addTorrent = this.addTorrent.bind(this)
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
        this.events.emit(PIECE_FINISHED_ALERT, message.params.pieceIndex)
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

  prioritizePiece (infoHash, pieceIndex, newPriority, callback) {
    if (typeof callback !== 'function') {
      throw 'Callback need to be a function !'
    } else {
      this.cmd('prioritizePiece', {info_hash: infoHash, piece_index: pieceIndex, new_priority: newPriority}, (response) => {
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

import { Readable } from 'stream'

const HIGH_PRIORITY = 7

class FileStream extends Readable {
  constructor (offset, size, pieceLength, infoHash, site, opts) {
    super(opts)

    var start = (opts && opts.start) || 0
    var end = (opts && opts.end && opts.end < size)
      ? opts.end
      : size

    this.destroyed = false

    this.site = site

    this._infoHash = infoHash
    this._startPiece = (start + offset) / pieceLength | 0
    this._piece = this._startPiece
    this._offset = (start + offset) - (this._startPiece * pieceLength)
    this._criticalLength = Math.min((1024 * 1024 / pieceLength) | 0, 2) // Took from webtorrent

    this._missing = end - start

    this._onReadPiece = this._onReadPiece.bind(this)
    this._onPieceFinished = this._onPieceFinished.bind(this)

    this.site.events.on('piece_finished_alert', this._onPieceFinished)
   }

   _getCriticalPieces (index, criticalLength) {
     for ( var i = 0; i < criticalLength; i++ ) {
       var nextCriticalPiece = index + i
       this.site.havePiece(this._infoHash, nextCriticalPiece, (response) => {
         if (!response) {
           this.site.prioritizePiece(this._infoHash, nextCriticalPiece, HIGH_PRIORITY, (response) => {
             // console.log(response)
           })
         }
       })
     }
   }

   _onPieceFinished (pieceIndex) {
     if (pieceIndex === this._piece) {
       this.site.readPiece(this._infoHash, this._piece, this._onReadPiece)
     }
   }

   _onReadPiece (response) {
     if (response.error) {
       if (err) {
         this._destroy(err)
         return
       }
     }

     if (response.piece === this._piece) {

       if (this.destroyed) return

       var buffer = Buffer.from(response.buffer, 'base64')

       console.log('read %s (length %s)', this._piece, buffer.length)

       if (this._offset) {
         buffer = buffer.slice(this._offset)
         this._offset = 0
       }

       if (this._missing < buffer.length) {
         buffer = buffer.slice(0, this._missing)
       }
       this._missing -= buffer.length

       console.log('pushing buffer of length %s', buffer.length)
       this._piece += 1

       this.push(buffer)

     }
   }

  _read (size) {
    if (this._missing === 0) {
      // We have transfered the all file
      this.push(null)
      return
    }
    this.site.havePiece(this._infoHash, this._piece, (response) => {
      if (!response) {
        this.site.prioritizePiece(this._infoHash, this._piece, HIGH_PRIORITY, (response) => {
          // console.log(response)
        })
        this._getCriticalPieces(this._piece + 1, this._criticalLength)
      } else {
        this.site.readPiece(this._infoHash, this._piece, this._onReadPiece)
      }
    })
  }

  _destroy (err, onclose) {
    if (err) {
      throw new Error('hoy, not working')
    }
    if (this.destroyed) return
    this.destroyed = true

    this.site.events.removeListener('piece_finished_alert', this._onPieceFinished)


    if (onclose) onclose()
  }

  destroy (onclose) {
    this._destroy(null, onclose)
  }
}

export default FileStream

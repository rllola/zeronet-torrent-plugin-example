import FileStream from './FileStream'

class File {
  constructor (size, offset, pieceLength, name, siteStore) {
    this.name = name

    this.pieceLength = pieceLength
    this.size = size
    this.offset = offset
    this.siteStore = siteStore
  }

  createReadStream (opts) {
    var self = this
    if (!opts) opts = {}

    var fileStream = new FileStream(self, opts)

    return fileStream
  }
}

export default File

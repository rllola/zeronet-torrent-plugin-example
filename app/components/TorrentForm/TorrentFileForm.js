import React, { Component } from 'react'

class TorrentFileForm extends Component {
  constructor () {
    super()

    this.onSubmitTorrentFile = this.onSubmitTorrentFile.bind(this)
    this.handleTorrentFileChange = this.handleTorrentFileChange.bind(this)

    this.state = {
      torrentFile: ''
    }
  }

  onSubmitTorrentFile (event) {
    event.preventDefault()

    var file = this.state.torrentFile[0]

    if (file.type === 'application/x-bittorrent') {
      var reader = new window.FileReader()
      reader.onloadend = () => {
        var arrayBuffer = reader.result
        var array = new Uint8Array(arrayBuffer)
        var binaryString = String.fromCharCode.apply(null, array)
        var base64BinaryString = window.btoa(binaryString)

        this.props.addTorrent(base64BinaryString).then((torrent) => {
          this.props.torrentAdded(torrent)
        }).catch((err) => {
          console.error(err)
        })
      }

      reader.readAsArrayBuffer(file)
    }
  }

  handleTorrentFileChange (event) {
    this.setState({torrentFile: event.target.files})
  }

  render () {
    return (
      <form onSubmit={this.onSubmitTorrentFile}>
        <input type='file' value={this.state.torrentFile.name} onChange={this.handleTorrentFileChange} accept='.torrent' />
        <input type='submit' value='Submit' />
      </form>
    )
  }
}

export default TorrentFileForm

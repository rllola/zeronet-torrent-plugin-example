import React, { Component } from 'react'
import { inject } from 'mobx-react'
import render from 'render-media'
import FileStream from './FileStream'
import TorrentStatus from './TorrentStatus'

@inject('site')
class StreamRenderer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      torrentStatus: null,
      streaming: false
    }
  }

  componentWillMount () {
    window.setInterval(() => {
      this.props.site.getTorrentStatus(this.props.torrentInfoHash).then((response) => {
        this.setState({torrentStatus: response})
        if ((response.state === "seeding" || response.state === "downloading") && !this.state.streaming ) {
          this.startStreaming(this.props.torrentInfoHash)
        }
      })
    }, 1000)
  }

  startStreaming (infoHash) {
    var self = this
    this.setState({streaming: true})
    this.props.site.getTorrentInfo(infoHash).then((response) => {
      console.log(response)
      for (var i in response.files) {
        let fileName = response.files[i].path
        let fileExtension = fileName.split('.').pop()

        if (fileExtension === 'mp4' || fileExtension === 'wbm') {
          // Use render media
          let file = {
            name: fileName,
            createReadStream: function (opts = {}) {
              let offset = response.files[i].offset
              let size  = response.files[i].size
              let pieceLength = response.piece_length

              var fileStream = new FileStream(offset, size, pieceLength, infoHash, self.props.site, opts)

              return fileStream
            }
          }

          render.append(file, '#video-player', function (err, elem) {
            if (err) return console.error(err.message)
          })
          return
        }
      }
      /*this.props.site.havePiece(infoHash, 987, (response) => {
        if (response) {
          this.props.site.readPiece(infoHash, 987, (response) => {
            console.log(response)
          })
        } else {
          console.error('Piece not available !')
        }
      })*/
    })
  }

  render () {
    return (
      <div>
      <div id="video-player"></div>
      <br />
        { this.state.torrentStatus ? <TorrentStatus torrentStatus={this.state.torrentStatus} /> : null}
      </div>
    )
  }
}

export default StreamRenderer

import React, { Component } from 'react'
import { inject } from 'mobx-react'
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

  componentDidMount () {
    window.setInterval(() => {
      this.props.site.getTorrentStatus(this.props.torrentInfoHash).then((response) => {
        console.log(response)
        this.setState({torrentStatus: response})
        if ((response.state === "seeding" || response.state === "downloading") && !this.state.streaming ) {
          this.startStreaming(this.props.torrentInfoHash)
          this.setState({streaming: true})
        }
      })
    }, 1000)
  }

  startStreaming (infoHash) {
    this.props.site.getTorrentInfo(infoHash).then((response) => {
      let player = document.getElementById("video-player")

      // Look at all the files
      for (var i in response.files) {
        let fileName = response.files[i].path
        let fileExtension = fileName.split('.').pop()

        // We can only read mp4, wbm or webm files
        if (fileExtension === 'mp4' || fileExtension === 'wbm' || fileExtension === 'webm') {
            player.src = 'downloads/'+ fileName + "?info_hash="+infoHash+"&file_index="+i
            break
          }
        }
        return
    })
  }

  render () {
    return (
      <div>
      <video id="video-player" controls/>
      <br />
        { this.state.torrentStatus ? <TorrentStatus torrentStatus={this.state.torrentStatus} /> : null}
      </div>
    )
  }
}

export default StreamRenderer

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import TorrentForm from '../components/TorrentForm'
import StreamRenderer from '../components/StreamRenderer'

class Streaming extends Component {
  constructor () {
    super()

    this.torrentAdded = this.torrentAdded.bind(this)

    this.state = {
      torrentInfoHash: null
    }
  }

  torrentAdded (response) {
    this.setState({torrentInfoHash: response.info_hash})
  }

  render () {
    return (
      <div>
        <TorrentForm torrentAdded={this.torrentAdded} />
        { this.state.torrentInfoHash ? <StreamRenderer torrentInfoHash={this.state.torrentInfoHash}/> : null }
      </div>
    )
  }
}

export default Streaming

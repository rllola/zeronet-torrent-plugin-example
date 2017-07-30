import React, { Component } from 'react'
import { inject } from 'mobx-react'

import TorrentFileForm from './TorrentFileForm'
import TorrentURLForm from './TorrentURLForm'

@inject('site')
class Form extends Component {
  render () {
    return (
      <div>
        <br />
        <h3>Add torrent form</h3>
        <br />
        <TorrentFileForm addTorrent={this.props.site.addTorrent} torrentAdded={this.props.torrentAdded} />
        or <br />
        <TorrentURLForm addTorrent={this.props.site.addTorrent} torrentAdded={this.props.torrentAdded} />
      </div>
    )
  }
}

export default Form

import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { Header } from 'semantic-ui-react'

import TorrentFileForm from './TorrentFileForm'
import TorrentURLForm from './TorrentURLForm'

@inject('site')
class Form extends Component {
  render () {
    return (
      <div style={{color: 'white'}}>
        <br />
        <Header as='h2' inverted >Add torrent form</Header>
        <br />
        <TorrentFileForm addTorrent={this.props.site.addTorrent} torrentAdded={this.props.torrentAdded} />
        or <br />
        <TorrentURLForm addTorrent={this.props.site.addTorrent} torrentAdded={this.props.torrentAdded} />
      </div>
    )
  }
}

export default Form

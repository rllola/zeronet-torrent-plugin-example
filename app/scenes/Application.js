import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import Streaming from './Streaming'
import NoTorrentPlugin from './NoTorrentPlugin'

// TODO: We need a splash screen ! Wait until we no if we have the plugin or not...

@inject('site')
@observer
class Application extends Component {
  render () {
    return (
      <div className='container-fluid'>
        <h1>Video streaming with Torrent plugin !</h1>
        {/* this.props.site.hasTorrentPlugin
          ? <Form />
          : <NoTorrentPlugin />
        */}
        <Streaming />
      </div>
    )
  }
}

export default Application

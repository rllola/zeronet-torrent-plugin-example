import React from 'react'
import { Header } from 'semantic-ui-react'

const NoTorrentPlugin = () => {
  return (
    <div>
      <Header as='h2' inverted>Torrent plugin not installed</Header>
      <p>You need to install the zeronet torrent plugin in order to have the example site working.</p>
      <p>You can find the repo for the plugin and more information <a href='https://github.com/rllola/zeronet-torrent-plugin' target='_blank'>here</a></p>
      <p>You can also contact me via ZeroMail : lola@zeroid.bit</p>
    </div>
  )
}

export default NoTorrentPlugin

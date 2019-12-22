import React from 'react'
import { Header } from 'semantic-ui-react'

const NotCompatible = () => {
  return (
    <div>
      <Header as='h2' inverted>Torrent plugin version  0.3.0 or higher required!</Header>
      <p>Please update the plugin with the latest version for full compatibilty with this site. <br />
      You can find the repo for the plugin and more information when visiting  : <a href='https://github.com/rllola/zeronet-torrent-plugin' target='_blank'>https://github.com/rllola/zeronet-torrent-plugin</a> <br />
      You can also contact me via ZeroMail : lola@zeroid.bit </p>
    </div>
  )
}

export default NotCompatible

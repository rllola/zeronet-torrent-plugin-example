import React from 'react'
import { List } from 'semantic-ui-react'

const Download = (props) => {
  return (
    props.rev < 4000 ?
    <List bulleted>
      <List.Item>OSX : <a href='assets/downloads/torrent-plugin-osx.zip'>torrent-plugin-osx.zip</a> ( python 2 version )</List.Item>
      <List.Item>Linux : <a href='assets/downloads/torrent-plugin-linux.zip'>torrent-plugin-linux.zip</a> ( python 2 version )</List.Item>
    </List>
    : <List bulleted>
      <List.Item>OSX : <a href='assets/downloads/torrent-plugin-py3-osx.zip'>torrent-plugin-py3-osx.zip</a> ( python 3 version )</List.Item>
      <List.Item>Linux : <a href='assets/downloads/torrent-plugin-py3-linux.zip'>torrent-plugin-py3-linux.zip</a> ( python 3 version )</List.Item>
      <List.Item>Windows : <a href='assets/downloads/torrent-plugin-py3-windows.zip'>torrent-plugin-py3-windows.zip</a> ( python 3 version )</List.Item>
    </List>
  )
}

export default Download

import React from 'react'

const TorrentStatus = (props) => {
  return (
    <p>Donwload rate: {(props.torrentStatus.download_rate / 1000).toFixed(2)} k/s
     Upload rate : {(props.torrentStatus.upload_rate / 1000).toFixed(2)} k/s
     Progress : {(props.torrentStatus.progress * 100).toFixed(2)} %
     Numbers of peers : {props.torrentStatus.num_peers} State : {props.torrentStatus.state}</p>
  )
}

export default TorrentStatus

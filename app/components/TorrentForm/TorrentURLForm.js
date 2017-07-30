import React, { Component } from 'react'

class TorrentURLForm extends Component {
  constructor () {
    super()

    this.onSubmitTorrentURL = this.onSubmitTorrentURL.bind(this)
    this.handleTorrentURLChange = this.handleTorrentURLChange.bind(this)

    this.state = {
      torrentURL: ''
    }
  }

  onSubmitTorrentURL (event) {
    event.preventDefault()

    this.props.addTorrent(this.state.torrentURL).then(function (torrent) {
      this.props.torrentAdded(torrent)
    }).catch(function (err) {
      console.error(err)
    })
  }

  handleTorrentURLChange (event) {
    this.setState({torrentURL: event.target.value})
  }

  render () {
    return (
      <form onSubmit={this.onSubmitTorrentURL}>
        <input type='text' value={this.state.torrentURL} onChange={this.handleTorrentURLChange} placeholder='Magnet or info hash' />
        <input type='submit' value='Submit' />
      </form>
    )
  }
}

export default TorrentURLForm

import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { Header, Form, Button, Divider, Input } from 'semantic-ui-react'

@inject('site')
class TorrentForm extends Component {
  constructor (props) {
    super()

    this.state = {
      torrentURL: '',
      torrentFile: '',
      latest: null
    }
  }

  submitTorrentURL = () => {
    this.props.site.addTorrent(this.state.torrentURL).then((torrent) => {
      this.props.site.events.on('torrent_checked_alert', () => {
        this.props.torrentAdded(torrent)
      })

    }).catch(function (err) {
      console.error(err)
    })
  }

  submitTorrentFile = () => {
    var file = this.state.torrentFile[0]

    if (file.type === 'application/x-bittorrent') {
      var reader = new window.FileReader()
      reader.onloadend = () => {
        var arrayBuffer = reader.result
        var array = new Uint8Array(arrayBuffer)
        var binaryString = String.fromCharCode.apply(null, array)
        var base64BinaryString = window.btoa(binaryString)

        this.props.site.addTorrent(base64BinaryString).then((torrent) => {
          this.props.site.events.on('add_torrent_alert', () => {
            this.props.torrentAdded(torrent)
          })
        }).catch((err) => {
          console.error(err)
        })
      }

      reader.readAsArrayBuffer(file)
    }
  }

  onSubmit = (event) => {
    event.preventDefault()

    if (this.state.latest === 'TorrentFile') {
      this.submitTorrentFile()
    } else {
      this.submitTorrentURL()
    }

  }

  handleTorrentFileChange = (event) => {
    this.setState({torrentFile: event.target.files, latest: 'TorrentFile'})
  }

  handleTorrentURLChange = (event) => {
    this.setState({torrentURL: event.target.value, latest: 'TorrentUrl'})
  }

  clickSintelMagnet = (event) => {
    event.preventDefault()

    this.setState({torrentURL: event.target.href})
  }

  render () {
    return (
      <div style={{color: 'white', paddingBottom: '48px'}}>
        <br />
        <Header as='h2' inverted >Add torrent form</Header>
        <span style={{ color: 'white' }}>You can find free torrent here so you can test : <a href='https://webtorrent.io/free-torrents'>webtorrent.io/free-torrents</a> or you can test with <a onClick={this.clickSintelMagnet} href='magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'>Sintel (click here)</a>
        </span>
        <br />
        <br/>
        <Form inverted onSubmit={this.onSubmit}>
          <Form.Group widths='equal'>
            <Form.Field style={{ paddingRight: '32px' }}>
              <Form.Input label='Magnet' value={this.state.torrentURL} onChange={this.handleTorrentURLChange} placeholder='Magnet or info hash' />
            </Form.Field>

            <Divider inverted vertical>Or</Divider>

            <Form.Field style={{ paddingLeft: '32px' }}>
              <Form.Input type='file' label='Torrent file' value={this.state.torrentFile.name} onChange={this.handleTorrentFileChange} accept='.torrent' />
            </Form.Field>
          </Form.Group>
          <Button floated='right' inverted type='submit'>Submit</Button>
        </Form>
      </div>
    )
  }
}

export default TorrentForm

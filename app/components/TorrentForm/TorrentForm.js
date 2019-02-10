import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { Header, Form, Button, Divider } from 'semantic-ui-react'

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
    this.props.site.addTorrent(this.state.torrentURL).then(function (torrent) {
      this.props.torrentAdded(torrent)
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
          this.props.torrentAdded(torrent)
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


  render () {
    return (
      <div style={{color: 'white', paddingBottom: '48px'}}>
        <br />
        <Header as='h2' inverted >Add torrent form</Header>
        <span style={{ color: 'white' }}>You can find free torrent here so you can test : <a href='https://webtorrent.io/free-torrents'>webtorrent.io/free-torrents</a></span>
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

import React, { Component } from 'react'
import { inject } from 'mobx-react'

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
      console.log('pong')
      this.props.site.events.on('torrent_checked', () => {
        console.log('ping')
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
          this.props.site.events.on('add_torrent', () => {
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
      <div className='text-white'>
        You can find free torrent here so you can test : <a className='px-1.5 py-0.5 text-xs font-semibold leading-5 uppercase tracking-wide bg-indigo-500 rounded-full' href='https://webtorrent.io/free-torrents'>webtorrent.io/free-torrents</a> or you can test with <a className='px-1.5 py-0.5 text-xs font-semibold leading-5 uppercase tracking-wide bg-indigo-500 rounded-full' onClick={this.clickSintelMagnet} href='magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'>Sintel (click here)</a>
        <br/>
        <br/>
        <form onSubmit={this.onSubmit}>
          <div className='flex justify-center'>
            <label htmlFor='magnet' className='sr-only'>
              Magnet
            </label>
            <input
              type='text'
              name='magnet'
              id='magnet'
              value={this.state.torrentURL}
              onChange={this.handleTorrentURLChange}
              className='text-black px-5 py-1 placeholder-gray-500 focus:outline-none rounded-md'
              placeholder='Magnet or info hash'
            />

            <span className='mx-8 py-3'>Or</span>

            <label htmlFor='torrent' className='sr-only'>
              Torrent file
            </label>
            <input
              type='file'
              name='torrent'
              id='torrent'
              value={this.state.torrentFile.name}
              onChange={this.handleTorrentFileChange}
              className='py-3'
              accept='.torrent'
            />
          </div>
          <br/>
          <br/>
          <input
            type='submit'
            value='Submit'
            className='cursor-pointer px-8 py-3 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none'
          />
        </form>
      </div>
    )
  }
}

export default TorrentForm

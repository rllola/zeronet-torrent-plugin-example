import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import Streaming from './Streaming'
import NoTorrentPlugin from './NoTorrentPlugin'
import NotCompatible from './NotCompatible'

// TODO: We need a splash screen ! Wait until we know if we have the plugin or not...

@inject('site')
@observer
class Application extends Component {

  state = {
    version: null,
  }

  componentDidMount () {
    this.props.site.fetchServerInfo()
    this.props.site.getPluginVersion()
      .then((response) => {
        this.setState({version: response.version})
      })
  }

  render () {
    return (
      <div className="bg-white relative h-height">
      <div className="bg-indigo-700">
      <div className="max-w-7xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-white">
          <span className="block font-extrabold text-5xl">ZeroNet Torrent Plugin</span>
          <br/>
          <span className="block text-2xl">ZeroNet connected to torrent network.</span>
        </h2>
        <br/>
        {this.props.site.hasTorrentPlugin
            ? ( this.state.version && this.state.version.split('.')[1] < 4 ? <NotCompatible /> : <Streaming />)
          : <NoTorrentPlugin />
          }
      </div>
    </div>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">About the project</h2>
          <p className="max-w-5xl mt-5 mx-auto text-xl text-gray-500">
            This project is a plugin that allow using torrent at the same time as ZeroNet. Using this plugin allow you to create a bridge between ZeroNet network and the Torrent newtork.
          </p>
          <br/>
          <br/>
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Important!</h2>
          <p className="max-w-5xl mt-5 mx-auto text-xl text-gray-500">
            Using this plugin will make you as anonymous as torrent would. If you are using ZeroNet with <span className="font-black">Tor</span> and care about your anonimity please do not install ! It is not safe as it is. You can however use it behind a VPN and keep your ip address hidden.
          </p>
          <br/>
          <br/>
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Info</h2>
          <p className="max-w-5xl mt-5 mx-auto text-xl text-gray-500">You can find the repo for the plugin and more information <a className="text-indigo-600 hover:text-indigo-500" href='https://github.com/rllola/zeronet-torrent-plugin' target='_blank'>https://github.com/rllola/zeronet-torrent-plugin</a><br/>
          You can also contact me via ZeroMail : lola@zeroid.bit</p>
        </div>
      </div>

    </div>
    )
  }
}

export default Application

import React, { Component } from 'react'
import { inject } from 'mobx-react'

@inject('site')
class NoTorrentPlugin extends Component {

  handleInstallClicked = (event) => {
    event.preventDefault()

    // TODO: loader
    this.props.site.addPluginRequest(this.props.site.serverInfo.platform)
      .then(function () {
        console.log('installed')
      })
      .catch(function (err) {
        console.log(err)
      })

  }

  render () {
    return (
      <div>
        <a
          href="#"
          className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          onClick={this.handleInstallClicked}
        >
          Install plugin
        </a>
      </div>
    )
  }
}

export default NoTorrentPlugin

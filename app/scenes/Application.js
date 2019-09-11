import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Container, Header, Divider, Loader } from 'semantic-ui-react'

import Streaming from './Streaming'
import NoTorrentPlugin from './NoTorrentPlugin'
import Download from './Download'

// TODO: We need a splash screen ! Wait until we no if we have the plugin or not...

@inject('site')
@observer
class Application extends Component {
  componentDidMount () {
    this.props.site.fetchServerInfo()
  }

  render () {
    return (
      <Container>
        {/* Heads up! We apply there some custom styling, you usually will not need it. */}
        <style>{`
          html, body {
            background-color: #252839 !important;
          }
          p {
            align-content: center;
            background-color: #495285;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 6em;
            padding: 2em;
          }
          p > span {
            opacity: 0.4;
            text-align: center;
          }
        }
        `}</style>
        <Header as='h1' inverted textAlign='center'>
           ZeroNet Torrent plugin
          <Header.Subheader>
            Zeronet connected to torrent network.
          </Header.Subheader>
         </Header>
        <Divider />
        <Header as='h2' inverted>About the project</Header>
        <p>
          This project is a plugin that alow using torrent at the same time as Zeronet. Using this plugin allow you to create a bridge between Zeronet network and the Torrent newtork.
        </p>
        <Header as='h2' inverted>!!! Important !!!</Header>
        <p>
          Using this plugin will make you as anonymous as torrent would. If you are using Zeronet with Tor and care about your anonimity please do not install ! It is not safe as it is. You can however use it behind a VPN and keep your ip address hidden.
        </p>
        <Header as='h2' inverted>Install</Header>
        <p>
          1/ Download the version that fit your platform :
          {this.props.site.serverInfo.rev ? <Download rev={this.props.site.serverInfo.rev} /> : <div style={{position: 'relative'}}><Loader size='big' active inverted >Getting server info!</Loader></div>}
          <br/>
          2/ Go to your Zeronet folder and unzip in `plugins`.
          <br/>
          <br/>
          3/ Rename the folder in `Torrent`.
          <br/>
          <br/>
          4/ Restart Zeronet and come back here...
        </p>
        <Header as='h2' inverted>Help</Header>
        <span style={{color: 'white'}}>
          You can donate to this project : 1BzrPMr7qrca2wMV4a1qeH4CmJEKtAbrKW
        </span>
        <Divider />
        {this.props.site.hasTorrentPlugin
          ? <Streaming />
          : <NoTorrentPlugin />}

      </Container>
    )
  }
}

export default Application

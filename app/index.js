import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

// Import css for UI semantic
import 'semantic-ui-css/semantic.min.css'

import Application from './scenes/Application'

import Site from './stores/Site'

let store = {
  site: new Site()
}

ReactDOM.render(
  <Provider {...store}>
    <Application />
  </Provider>,
  document.getElementById('root')
)

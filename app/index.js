import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import "tailwindcss/tailwind.css"

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

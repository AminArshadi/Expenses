import './index.css'

import reportWebVitals from './reportWebVitals'
import App from './App'
import { UserProvider } from './UserContext'

import React from 'react'
import ReactDOM from 'react-dom/client'

import 'normalize.css/normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
)

reportWebVitals()

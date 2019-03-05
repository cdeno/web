import { Component } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import history from './history'
import Header from './header'
// import Search from './search'
import NotFound from './404'
import User from './user'
import Module from './module'
import Version from './version'
import Home from './home'

class App extends Component {
  render () {
    return (
      <Router history={history}>
        <div>
          <Header />
          {/* <Route path='/' render={props => <Search {...props} />} /> */}
          <Switch>
            <Route path='/' exact render={props => <Home {...props} />} />
            <Route path='/what-is-cdeno' exact component={WhatIsCdeno} />
            <Route path='/u/:username' exact render={props => <User {...props} />} />
            <Route path='/u/:username/:modulename' exact render={props => <Module {...props} />} />
            <Route path='/u/:username/:modulename/:tag+' exact render={props => <Version {...props} />} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    )
  }
}

function WhatIsCdeno () {
  return (
    <div>Hello</div>
  )
}
export default App

import React, { Component } from 'react'
import NotFound from './404'
import api from '../api'
import Modules from './components/modules'

class User extends Component {
  state = {}

  async load (props) {
    const { match } = props

    const username = match.params.username
    const modules = await api.getUserModules(username)

    if (modules.status === 404) {
      this.setState({
        loaded: true,
        notfound: true
      })
    } else {
      this.setState({
        loaded: true,
        notfound: false,
        modules: modules.data
      })
    }
  }

  componentWillReceiveProps (props) {
    this.load(props)
  }

  componentDidMount () {
    this.load(this.props)
  }

  render () {
    const { notfound } = this.state
    const { match } = this.props
    const username = match.params.username

    return (
      <div className='container'>
        <div className='section'>
          <div className='columns is-centered'>
            <div className='column is-half'>
              {this.state.loaded ? (notfound ? (
                <div>
                  <NotFound />
                </div>
              ) : (
                <div>
                  {this.state.modules && (
                    <div>
                      {/* <nav className='breadcrumb'>
                      <ul>
                        <li><Link to={`/u/${username}`}>{username}</Link></li>
                      </ul>
                    </nav> */}

                      <h2 className='title'>{username}</h2>
                      <h4 className='subtitle'>Modules</h4>
                      {/* <h1 className='title'>{username}</h1> */}
                      {/* <p className='content'>{this.state.module.description}</p> */}
                      <nav className='xpanel'>
                        <Modules items={this.state.modules} hideuser />
                      </nav>
                    </div>
                  )}
                </div>
              )) : (
                <div className='panel-block'><span className='loader' /></div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default User

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import NotFound from './404'
import api from '../api'

class Module extends Component {
  state = {}

  goTo (route) {
    this.props.history.replace(`/${route}`)
  }

  async load (props) {
    const { match } = props

    const { username, modulename } = match.params
    const moduleId = `${username}/${modulename}`
    const module = await api.getModule(moduleId)

    if (module.status === 404) {
      this.setState({
        loaded: true,
        notfound: true
      })
    } else {
      this.setState({
        notfound: false,
        module: module.data
      })

      const versions = await api.getVersions(moduleId)

      this.setState({
        loaded: true,
        versions: versions.data.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1)
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
    const { notfound, module, loaded, versions } = this.state
    const { match } = this.props
    const { username, modulename } = match.params

    return (
      <div className='container is-fluid'>
        <div className='section'>
          <div className='columns'>
            <div className='column is-one-third'>
              {loaded ? (notfound ? (
                <div>
                  <NotFound />
                </div>
              ) : (
                <div>
                  {module && (
                    <div>
                      <nav className='breadcrumb'>
                        <ul>`
                          <li><Link to={`/u/${username}`}>{username}</Link></li>
                          <li className='is-active'><a href='#'>{modulename}</a></li>
                        </ul>
                      </nav>
                      <h1 className='title'>{module.name}</h1>
                      <p className='content'>{module.description}</p>
                      <nav className='panel'>
                        {/* <p className='panel-heading'>Versions</p> */}
                        {versions ? versions.map(version => (
                          <Link className='panel-block' to={`/u/${version.moduleId}/${version.version}`} key={version.version}>
                            <span className='panel-icon'>
                              <i className='fas fa-cube' />
                            </span>
                            {version.version}
                          </Link>
                        )) : (
                          <span className='panel-block'>No versions found</span>
                        )}
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

export default Module

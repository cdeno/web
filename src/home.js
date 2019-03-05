import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Modules from './components/modules'

class Home extends Component {
  state = {}

  async load () {
    const modules = await api.findModules({})

    this.setState({
      loaded: true,
      modules: modules.data
    })
  }

  componentDidMount () {
    this.load(this.props)
  }

  render () {
    const { modules, loaded } = this.state

    return (
      <div>
        <section className='hero is-primary'>
          <div className='hero-body'>
            <div className='container'>
              <h1 className='title'>CDeNo</h1>
              <h2 className='subtitle'>A CDN service for deno</h2>
            </div>
          </div>
        </section>
        <div className='container'>
          <div className='section'>
            <div className='columns is-centered'>
              <div className='column is-half'>
                {loaded ? (
                  <div>
                    <h2 className='title'>Modules</h2>
                    <Modules items={modules} />
                  </div>
                ) : (
                  <div className='panel-block'><span className='loader' /></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>)
  }
}

export default Home

// const [releases, tags, branches] = await Promise.all([
//   // api.get(`https://api.github.com/repos/${path}/releases`),
//   api.get(`https://api.github.com/repos/${path}/tags`)
//   // ,
//   // api.get(`https://api.github.com/repos/${path}/branches`)
// ])

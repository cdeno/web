import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Header extends Component {
  state = {}

  toggle = () => {
    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  render () {
    return (
      <nav className='navbar is-white'>
        <div className='navbar-brand'>
          <Link to='/' className='navbar-item'>
            <img src='/assets/logo8.png' /> cdeno
          </Link>
          {/* <a role='button' className={'navbar-burger burger' + (this.state.showMenu ? ' is-active' : '')} aria-label='menu' aria-expanded='false' data-target='navbar' onClick={this.toggle}>
            <span aria-hidden='true' />
            <span aria-hidden='true' />
            <span aria-hidden='true' />
          </a> */}
        </div>
        {/* <div id='navbar' className={'navbar-menu' + (this.state.showMenu ? ' is-active' : '')}>
          <div className='navbar-end'>
            { true !== false
              ? <a className='navbar-item' onClick={this.logout}>Logout</a>
              : <a className='navbar-item' onClick={this.login}>Log In</a>
            }
          </div>
        </div> */}
      </nav>
    )
  }
}

export default Header

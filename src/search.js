import React, { Component } from 'react'

class Search extends Component {
  goTo (route) {
    this.props.history.replace(`/${route}`)
  }

  onSubmit = async (e) => {
    e.preventDefault()
    const path = e.target.query.value.trim()
    this.goTo(path)
  }

  render () {
    return (
      <div className='hero-body'>
        <div className='container'>
          <div className='columns'>
            <div className='column is-half is-offset-one-quarter'>
              <form onSubmit={this.onSubmit}>
                <div className='control has-icons-left'>
                  <input className='input is-large' name='query' type='search' placeholder='user/repo' required />
                  <span className='icon is-medium is-left'>
                    <i className='fab fa-github' />
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Search

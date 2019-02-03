import api from '../api.js'

const { route } = window.preactRouter
const { Component } = window.preact

export default class Page extends Component {
  render () {
    const { auth, protected } = this.props
  }
}

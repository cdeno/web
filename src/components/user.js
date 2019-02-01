import api from '../api.js'
import view from './user.html.js'

const { Component } = window.preact

export default class User extends Component {
  constructor (props) {
    super(props)

    this.render = view
  }

  loadModules () {
    const { username } = this.props

    api
      .getUserModules(username)
      .then(modules => this.setState({
        modules,
        loaded: true,
        hasModules: !!modules.length
      }))
  }

  componentDidMount () {
    this.loadModules()
  }
}

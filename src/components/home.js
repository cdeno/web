import api from '../api.js'
import view from './home.html.js'
const { Component } = window.preact

export default class Home extends Component {
  constructor (props) {
    super(props)

    this.render = view
  }

  componentDidMount () {
    api
      .getModules({ type: 'recent' })
      .then(modules => this.setState({
        modules,
        loaded: true,
        hasModules: !!modules.length
      }))
  }
}

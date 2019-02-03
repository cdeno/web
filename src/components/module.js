import api from '../api.js'
import view from './module.html.js'
const { Component } = window.preact

export default class Module extends Component {
  constructor (props) {
    super(props)
    this.render = view
  }

  componentDidMount () {
    api
      .getModule(this.props)
      .then(({ module, versions }) => this.setState({
        module,
        versions,
        loaded: true,
        hasVersions: !!versions.length
      }))
  }
}

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
      .getModuleVersions(this.props)
      .then(versions => this.setState({
        versions,
        loaded: true,
        hasVersions: !!versions.length
      }))
  }
}

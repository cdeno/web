import api from '../api.js'
import view from './version.html.js'
const { Component } = window.preact

export default class Version extends Component {
  constructor (props) {
    super(props)
    this.render = view
  }

  componentDidMount () {
    const { username, module, version } = this.props
    api
      .getFiles(`${username}/${module}/${version}/`)
      .then(data => this.setState({
        files: data.files,
        folders: data.folders,
        loaded: true,
        hasFiles: !!data.files.length,
        hasFolders: !!data.folders.length
      }))
  }
}

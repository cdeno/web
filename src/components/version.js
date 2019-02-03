import api from '../api.js'
import view from './version.html.js'
const { Component } = window.preact

export default class Version extends Component {
  constructor (props) {
    super(props)
    this.render = view
  }

  get pathCrumbs () {
    const { username, module, version, path } = this.props
    const paths = path.split('/')
    return paths.map((path, index) => ({
      name: path,
      href: `/user/${username}/${module}/${version}/${paths.slice(0, index + 1).join('/')}`
    }))
  }

  getFileUrl () {
    const { username, module, version, path } = this.props
    return `http://cdeno.org/${username}/${module}/${version}/${path}`
  }

  load (props) {
    const { username, module, version, path, type } = props

    if (type === 'file') {
      api.getFile(`${username}/${module}/${version}/${path}`)
        .then(data => this.setState({
          isFile: true,
          loaded: true,
          content: data
        }))
    } else {
      api
        .getFiles(`${username}/${module}/${version}/${path && path + '/'}`)
        .then(data => this.setState({
          isFile: false,
          files: data.files,
          folders: data.folders,
          loaded: true,
          hasFiles: !!data.files.length,
          hasFolders: !!data.folders.length
        }))
    }
  }

  componentDidMount () {
    this.load(this.props)
  }

  componentWillReceiveProps (props) {
    this.load(props)
  }
}

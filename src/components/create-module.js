import api from '../api.js'
import protect from './protect.js'
import view from './create-module.html.js'

const { route } = window.preactRouter
const { Component } = window.preact

export default class CreateModule extends Component {
  constructor (props) {
    super(props)

    this.namePattern = '^[a-z][a-z0-9_-]{0,23}[a-z0-9]$'
    this.auth = props.auth
    this.onSubmit = this.onSubmit.bind(this)
    this.render = protect(this, view)
  }

  componentDidMount () {
    const { username } = this.props

    api
      .getUserModules(username)
      .then(modules => this.setState({ modules }))
  }

  onSubmit (e) {
    e.preventDefault()
    const name = e.target.name.value
    const description = e.target.description.value
    const keywords = e.target.keywords.value
    const repositoryUrl = e.target.repositoryUrl.value

    api
      .createUserModule({ name, description, keywords, repositoryUrl }, this.auth.idToken)
      .then(res => {
        route(`/user/${res.key}create-version`)
      })
      .catch(err => window.alert(err))
  }
}

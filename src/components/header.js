import view from './header.html.js'
const { Component } = window.preact

export default class AppHeader extends Component {
  constructor (props) {
    super(props)
    this.render = view
    this.logout = this.logout.bind(this)
  }

  get callbackUrl () {
    return window.location.origin + '/callback'
  }

  logout () {
    this.props.auth.clearAuthUser()
  }
}

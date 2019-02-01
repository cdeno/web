import view from './header.html.js'
const { Component } = window.preact

export default class AppHeader extends Component {
  constructor (props) {
    super(props)
    this.render = view
  }
}

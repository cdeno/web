import view from './home.html.js'
const { Component } = window.preact

export default class Home extends Component {
  constructor (props) {
    super(props)

    this.render = view
  }
}

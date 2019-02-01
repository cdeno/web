import view from './searchbox.html.js'
const { Component } = window.preact

export default class SearchBox extends Component {
  constructor (props) {
    super(props)

    this.onClick = (e) => {
      console.log(e)
    }

    this.render = view
  }
}

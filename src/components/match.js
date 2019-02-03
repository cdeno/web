const { preact, preactRouter } = window
const { Component } = preact
const { subscribers, getCurrentUrl } = preactRouter

export default class Match extends Component {
  constructor (props) {
    super(props)
    this.update = this.update.bind(this)
  }

  update (url) {
    this.nextUrl = url
    this.setState({})
  }

  componentDidMount () {
    subscribers.push(this.update)
  }

  componentWillUnmount () {
    subscribers.splice(subscribers.indexOf(this.update) >>> 0, 1)
  }

  render (props) {
    let url = this.nextUrl || getCurrentUrl()

    let path = url.replace(/\?.+$/, '')
    this.nextUrl = null
    return props.children[0] && props.children[0]({
      url,
      path,
      matches: path === props.path,
      auth: props.auth
    })
  }
}

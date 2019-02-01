import view from './app.html.js'
const { Component } = window.preact

export default class App extends Component {
  constructor (props) {
    super(props)
    this.auth = props.auth
    this.render = view
    this.handleRoute = this.handleRoute.bind(this)
  }

  handleRoute (e) {
    console.log(e.url)
    // switch (e.url) {
    //   case '/profile':
    //     const isAuthed = await this.isAuthenticated();
    //     if (!isAuthed) route('/', true);
    //     break;
    // }
  }
}

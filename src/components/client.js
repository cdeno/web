const baseUrl = 'https://ltvj5zswmg.execute-api.eu-west-1.amazonaws.com/dev'
const log = console.log.bind(console)
const logErr = console.error.bind(console)

const { preact, preactRouter } = window
const { h, Component, render } = preact
const { Router, route, subscribers, getCurrentUrl, Link: StaticLink } = preactRouter

function uploadFileToS3 (signature, file) {
  var formData = new window.FormData()

  for (let name in signature.fields) {
    formData.append(name, signature.fields[name])
  }

  formData.append('file', file)

  // Construct a file
  var options = {
    method: 'post',
    mode: 'cors',
    body: formData
  }

  return window.fetch(signature.url, options)
}

class Match extends Component {
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
      matches: path === props.path
    })
  }
}

const api = {
  get (url) {
    return window
      .fetch(url, {
        method: 'get',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .catch(logErr)
  },

  post (url, body, idToken) {
    return window
      .fetch(url, {
        method: 'post',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(body)
      })
      .then(res => res.json())
      .catch(logErr)
  },

  getUserModules (username) {
    return api.get(`${baseUrl}/user/${username}`)
  },

  createUserModule (name, idToken) {
    return api.post(`${baseUrl}/create-module`, { name }, idToken)
  },

  createVersion (mod, { major, minor, revision }, idToken) {
    return api.post(`${baseUrl}/create-version`, { mod, major, minor, revision }, idToken)
  },

  getModuleVersions ({ username, mod }) {
    return api.get(`${baseUrl}/user/${username}/${mod}`)
  }
}


function Callback () {
  const hash = window.location.hash.substr(1).split('&')
  const idToken = hash[0].substring('id_token='.length)
  const token = JSON.parse(window.atob(idToken.split('.')[1]))
  token.idToken = idToken

  updateAuthUser(token)

  route('/')
}

function Home (props) {
  return h('a', { href: '/user/djs' }, 'djs')
}

function UserMods (props) {
  const { mods, username } = props

  return h('ul', null, mods.map(mod => (
    h('li', { key: mod }, h('a', { href: `/user/${username}/${mod}` }, mod))))
  )
}

function ModVersions (props) {
  const { versions, mod, username } = props

  return h('ul', null, versions.map(version => (
    h('li', { key: version }, h('a', { href: `/user/${username}/${mod}/${version}` }, version))))
  )
}

function ModCreate (props) {
  function onSubmit (e) {
    e.preventDefault()
    api
      .createUserModule(e.target.name.value, authUser.idToken)
      .then(res => route(`/user/${res.key.slice(0, -1)}`))
  }

  return h('form', { onsubmit: onSubmit }, [
    h('input', { type: 'text', name: 'name' }),
    h('button', { type: 'submit' }, 'Create new module')
  ])
}

function VersionCreate (props) {
  const { mod, username, module } = props

  function onSubmit (e) {
    e.preventDefault()
    const form = e.target
    const major = form.major.value
    const minor = form.minor.value
    const revision = form.revision.value
    const file = form.file.files[0]

    api
      .createVersion(mod, { major, minor, revision }, authUser.idToken)
      .then(res => {
        const { version, mod, signature } = res

        uploadFileToS3(signature, file)
          .then(res => {
            route(`/user/${username}/${mod}`)
          })
      })
  }

  return h('form', { onsubmit: onSubmit }, [
    h('input', { type: 'text', name: 'major' }),
    h('input', { type: 'text', name: 'minor' }),
    h('input', { type: 'text', name: 'revision' }),
    h('input', { type: 'file', name: 'file' }),
    h('button', { type: 'submit' }, 'Create new version')
  ])
}

class User extends Component {
  componentDidMount () {
    const { username } = this.props

    this.setState({ message: 'Hello!' })

    api
      .getUserModules(username)
      .then(mods => this.setState({ mods }))
  }

  render (props, state) {
    const { mods } = state
    const { username } = props

    return h('div', { class: 'user' }, [
      h('h2', null, username),
      mods && h(UserMods, { mods, username }),
      h('a', { href: '/create-module' }, 'Create module')
    ])
  }
}

class Mod extends Component {
  componentDidMount () {
    api
      .getModuleVersions(this.props)
      .then(versions => this.setState({ versions }))
  }

  render (props, state) {
    const { versions } = state
    const { username, mod } = props

    return h('div', { class: 'user' }, [
      h('h2', null, username + ' ' + mod),
      versions && h(ModVersions, { versions, mod, username }),
      h('a', { href: `/user/${username}/${mod}/create-version` }, 'Create version')
    ])
  }
}

class App extends Component {
  componentDidMount () {
    this.setState({ message: 'Hello!' })
  }

  render (props, state) {
    return h('div', null, [
      h(Match, { path: '/user/:username' }, ({ matches, path, url }) => matches && h('h1', null, path)),
      h(Router, null, [
        h(Callback, { path: '/callback' }),
        h(Home, { path: '/' }),
        h(User, { path: '/user/:username' }),
        h(Mod, { path: '/user/:username/:mod' }),
        h(ModCreate, { path: '/create-module' }),
        h(VersionCreate, { path: '/user/:username/:mod/create-version' })
      ])
    ])
  }
}

render(h(App), document.getElementById('app'))

// const MatchLink = ({ activeClassName, path, ...props }) => (
//   <Match path={path || props.href}>
//     { ({ matches }) => (
//       <StaticLink {...props} class={[props.class || props.className, matches && activeClassName].filter(Boolean).join(' ')} />
//     ) }
//   </Match>
// )

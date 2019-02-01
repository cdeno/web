import api from '../api.js'
import view from './create-version.html.js'

const { route } = window.preactRouter
const { Component } = window.preact

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

export default class CreateVersion extends Component {
  constructor (props) {
    super(props)

    this.auth = props.auth
    this.onSubmit = this.onSubmit.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.render = view
  }

  onFileChange (e) {
    e.preventDefault()
    const input = e.target
    const file = input.files[0]
    const fileName = file.name
    this.setState({ fileName })
  }

  onSubmit (e) {
    e.preventDefault()
    const form = e.target
    const major = form.major.value
    const minor = form.minor.value
    const revision = form.revision.value
    const file = form.file.files[0]
    const { module, username } = this.props

    api
      .createVersion(module, { major, minor, revision }, this.auth.idToken)
      .then(res => {
        const { signature } = res
        return uploadFileToS3(signature, file)
      })
      .then(res => route(`/user/${username}/${module}`))
      .catch(err => window.alert(err))
  }
}

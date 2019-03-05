import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import marked from 'marked'
import api from '../api'

const Filename = (props) => {
  const { fileUrl } = props
  const onClick = () => {
    document.getElementById('fileurl').select()
    document.execCommand('copy')
  }

  return (
    <div className='field has-addons has-addons-right'>
      <p className='control is-expanded'>
        <input className='input' type='text' value={fileUrl} readOnly id='fileurl' />
      </p>
      <p className='control' onClick={onClick}>
        <a href='#' className='button is-static tooltip is-tooltip-active is-tooltip-success' data-tooltip='Copy'>
          <i className='far fa-copy' />
        </a>
      </p>
    </div>
  )
}

const Folder = (props) => {
  const sorter = (a, b) => a.name > b.name ? 1 : -1
  const files = props.files.sort(sorter)
  const folders = props.folders.sort(sorter)

  return folders.sort(sorter)
    .map(folder => (
      <Link className='panel-block' to={`/u/${folder.key.slice(0, -1)}`} key={folder.key}>
        <PanelIcon name='far fa-folder' />
        {folder.name}
      </Link>
    ))
    .concat(files.sort(sorter)
      .map(file => (
        <a className='panel-block' onClick={() => props.loadFile(file)} key={file.key}>
          <PanelIcon name='fas fa-file' />
          {file.name}
        </a>
      )))
}

const PanelIcon = (props) => {
  const { name } = props

  return (
    <span className='panel-icon'>
      <i className={name} />
    </span>
  )
}

class Version extends Component {
  state = {}

  constructor (props) {
    super(props)
    this.readmeEl = React.createRef()
  }

  async load (props) {
    const { match } = props

    const path = match.url.slice(3)
    const data = await api.getFiles(path + '/')

    this.setState({
      path: path,
      fileUrl: '',
      files: data.files,
      folders: data.folders,
      loaded: true,
      content: false,
      hasFiles: !!data.files.length,
      hasFolders: !!data.folders.length
    })

    const readmeFile = data.files.find(file => {
      return file.name.toLowerCase() === 'readme.md'
    })

    if (readmeFile) {
      const content = await api.getFile(readmeFile.key)
      this.setState({ readme: marked(content), content: null })
      setTimeout(() => {
        window.Prism.highlightAllUnder(this.readmeEl.current)
      }, 200)
    }
  }

  async loadFile (file) {
    const content = await api.getFile(file.key)
    this.setState({ content, fileUrl: `https://cdeno.org/${file.key}`, readme: null })
  }

  get pathCrumbs () {
    const { match } = this.props

    const path = match.url.slice(3)
    const paths = path.split('/')
    return paths.map((path, index) => ({
      name: path,
      href: `/u/${paths.slice(0, index + 1).join('/')}`
    }))
  }

  componentWillReceiveProps (nextProps) {
    this.load(nextProps)
  }

  componentDidMount () {
    this.load(this.props)
  }

  render () {
    const { loaded, content, fileUrl, readme } = this.state
    const crumbs = this.pathCrumbs

    return (
      <div className='container is-fluid'>
        <div className='section'>
          <div className='columns'>
            <div className='column is-one-third'>
              <nav className='breadcrumb'>
                <ul>
                  {crumbs.map((crumb, index) => (
                    <li key={crumb.href} className={index === crumbs.length - 1 ? 'is-active' : ''}>
                      <Link to={`${crumb.href}`}>{crumb.name}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav className='panel'>
                {loaded ? (
                  <Folder {...this.state} loadFile={file => this.loadFile(file)} />
                ) : (
                  <div className='panel-block'>
                    <span className='loader' />
                  </div>
                )}
              </nav>
            </div>
            <div className='column is-two-thirds'>
              {fileUrl && (
                <Filename fileUrl={fileUrl} />
              )}
              {readme && <div ref={this.readmeEl} className='content' dangerouslySetInnerHTML={{ __html: readme }} />}
              {content && <pre className='language-ts'><code>{content}</code></pre>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Version

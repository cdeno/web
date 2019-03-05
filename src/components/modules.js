import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function Modules (props) {
  const { items, hideuser } = props

  if (!items) {
    return ''
  }

  return items.length ? items.map(module => (
    <article className='media' key={module.fullname}>
      <div className='media-content'>
        <div className='content'>
          <p>
            <strong>
              <Link to={`/u/${module.fullname}`}>
                {module.ID}
              </Link>
            </strong> {!hideuser && (<small>
              <Link to={`/u/${module.username}`}>
              @{module.username}
              </Link>
            </small>)}
            {module.description && (
              <span>
                <br />
                <span>{module.description}</span>
              </span>
            )}
          </p>
        </div>
      </div>
      <div className='media-right'>
        <small>{dayjs(module.createdAt).fromNow()}</small>
      </div>
    </article>
  // <Link className='panel-block' to={`/u/${module.fullname}`} key={module.fullname}>
  //   <span className='panel-icon'>
  //     <i className='fas fa-cubes' />
  //   </span>
  //   <strong>{module.fullname}</strong> <small>{module.description}</small>
  // </Link>
  )) : (
    <span className='zpanel-block'>
    No modules found
    </span>
  )
}

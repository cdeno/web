import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ auth, render, component: Component, ...rest }) => {
  const isAuthenticated = auth.isAuthenticated()

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          render ? render(props) : <Component {...props} auth={auth} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}

export default PrivateRoute

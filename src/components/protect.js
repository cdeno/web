export default (component, view) => {
  return (props, state) => {
    const { auth } = props

    if (auth.isAuthenticated) {
      return view.call(component, props, state)
    }

    return window.h('a', {}, 'Login')
  }
}

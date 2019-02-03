export default class Auth {
  constructor () {
    const token = window.localStorage.getItem('authUser')
    this.token = token ? JSON.parse(token) : null
  }

  get hasToken () { return !!this.token }
  get idToken () { return this.hasToken ? this.token.idToken : null }
  get name () { return this.hasToken ? this.token['cognito:username'] : '' }
  get expiresAt () { return this.hasToken ? new Date(this.token.exp * 1000) : null }
  get isAuthenticated () { return this.hasToken && new Date() < this.expiresAt }

  updateAuthUser (token) {
    this.token = token
    this.saveAuthUser()
  }

  saveAuthUser () {
    window.localStorage.setItem('authUser', JSON.stringify(this.token))
  }

  clearAuthUser () {
    window.localStorage.removeItem('authUser')
  }
}

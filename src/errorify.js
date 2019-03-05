export default function error (err) {
  if (err instanceof Error) {
    return err
  } else if (typeof err === 'string') {
    return new Error(err)
  } else {
    return new Error(err.toString ? err.toString() : 'Unknown Error')
  }
}

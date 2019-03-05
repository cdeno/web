import { log, logErr } from './log.js'

const apiUrl = 'https://93ijlt6nog.execute-api.eu-west-2.amazonaws.com/dev'
const s3ApiUrl = 'https://s3-eu-west-2.amazonaws.com/cdeno'

function logErrAndRethrow (err) {
  logErr(err)
  throw err
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
      .then(res => res.json().then(json => {
        res.data = json
        return res
      }))
      .catch(logErrAndRethrow)
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
      .then(res => res.json().then(json => {
        if (res.ok) {
          res.data = json
          return res
        } else {
          throw new Error(json.error || 'Unknown error')
        }
      }))
      .catch(logErrAndRethrow)
  },

  xhr (url, callback) {
    var xmlhttp = new window.XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        try {
          callback(null, xmlhttp)
        } catch (err) {
          callback(err)
        }
      } else {

      }
    }

    xmlhttp.open('GET', url, true)
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*')
    xmlhttp.send()
  },

  getFiles (prefix) {
    return new Promise((resolve, reject) => {
      const url = `${s3ApiUrl}/?list-type=2&delimiter=/&prefix=${prefix}`
      api.xhr(url, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        const data = formatS3XMLListBucketResult(res.responseXML)
        resolve(data)
      })
    })
  },

  getFile (key) {
    return new Promise((resolve, reject) => {
      const url = `${s3ApiUrl}/${key}`
      api.xhr(url, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        const data = res.responseText
        resolve(data)
      })
    })
  },

  getUserModules (username) {
    return api.get(`${apiUrl}/module/${username}`)
  },

  // createUserModule ({ name, description, keywords, repositoryUrl }, idToken) {
  //   return api.post(`${apiUrl}/create-module`, { name, description, keywords, repositoryUrl }, idToken)
  // },

  // createVersion (module, { major, minor, revision }, idToken) {
  //   return api.post(`${apiUrl}/create-version`, { module, major, minor, revision }, idToken)
  // },

  getModule (moduleId) {
    return api.get(`${apiUrl}/module/${moduleId}`)
  },

  getVersions (moduleId) {
    return api.get(`${apiUrl}/version/${moduleId}`)
  },

  findModules ({ type, query }) {
    return api.get(`${apiUrl}/module?type=${type}&query=${query}`)
  }
}

export default api

function mapFolderItem (prefix, item) {
  const key = item.Prefix['#text']
  return {
    key,
    name: key.slice(prefix.length, -1)
  }
}

function mapFileItem (prefix, item) {
  const key = item.Key['#text']
  return {
    key: key,
    name: key.substr(prefix.length),
    size: item.Size['#text'],
    createdAt: new Date(item.LastModified['#text']).getTime()
  }
}

function mapItems (prefix, items, mapper) {
  if (items) {
    return Array.isArray(items)
      ? items.map(item => mapper(prefix, item))
      : [mapper(prefix, items)]
  } else {
    return []
  }
}

function formatS3XMLListBucketResult (xml) {
  const { ListBucketResult: json } = xmlToJson(xml)
  const prefix = json.Prefix['#text']
  return {
    count: +json.KeyCount['#text'],
    prefix: prefix,
    files: mapItems(prefix, json.Contents, mapFileItem).filter(item => item.key !== prefix),
    folders: mapItems(prefix, json.CommonPrefixes, mapFolderItem)
  }
}

// Changes XML to JSON
function xmlToJson (xml) {
  // Create the return object
  var obj = {}

  if (xml.nodeType === 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {}
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j)
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue
      }
    }
  } else if (xml.nodeType === 3) { // text
    obj = xml.nodeValue
  }

  // do children
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i)
      var nodeName = item.nodeName
      if (typeof (obj[nodeName]) === 'undefined') {
        obj[nodeName] = xmlToJson(item)
      } else {
        if (typeof (obj[nodeName].push) === 'undefined') {
          var old = obj[nodeName]
          obj[nodeName] = []
          obj[nodeName].push(old)
        }
        obj[nodeName].push(xmlToJson(item))
      }
    }
  }
  return obj
}

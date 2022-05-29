import { parse } from 'himalaya'
import { JSDOM } from 'jsdom'

export async function get({ url, request }) {
  const { searchParams } = url

  const queryUrl = searchParams.get('url')
  const selector = searchParams.get('selector')
  const include = searchParams.getAll('include')

  if (include.length === 0) {
    include.push('tagName')
    include.push('textContent')
  }

  if (include.includes('textContent')) {
    include.push('content')
  }

  if (!queryUrl || queryUrl.length === 0) {
    return {
      body: {}
    }
  }

  try {
    const json = await urlToJson(queryUrl, selector || 'body', include)

    return {
      body: {
        query: {
          url: queryUrl,
          selector,
          include
        },
        data: json
      }
    }
  }

  catch ({ status, message }) {
    // unless JSON is explicitly requested, respond with OK and show error in web interface
    const jsonRequest = request.headers.get('Accept').includes('application/json')

    return {
      status: jsonRequest ? status : 200,
      body: { 
        query: {
          url: queryUrl,
          selector,
          include
        },
        status, 
        message 
      }
    }
  }
}

async function urlToJson(url, selector, include) {
  try {
    const res = await fetch(url)

    if (res.ok) {
      const { headers } = res

      const contentType = headers.get('Content-Type')

      if (contentType.includes('text/html')) {
        const { document } = (new JSDOM(await res.text())).window
        const elementArray = Array.from(document.querySelectorAll(selector))

        return elementArray.map(x => { 
          const parsed = parse(x.outerHTML)[0]

          const obj = {
            ...parsed,
            textContent: x.textContent
          }

          return filterKeys(obj, include)
        })
      }

      else {
        throw {
          status: 415,
          message: `Unsupported media type: ${contentType}`
        }
      }
    }
    
    else {
      throw {
        status: res.status,
        message: res.statusText,
      }
    }
  }

  // if fetch fails completely
  catch (error) {
    throw {
      status: 500,
      message: error.message
    }
  }
}

function filterKeys(obj, keys) {
  const newObj = Object.fromEntries(
    keys.map(key => [key, obj[key]])
  )

  if (newObj.children) {
    newChildren = newObj.children.map(
      child => filterKeys(child, keys)
    )
    newObj.children = newChildren
  }

  // remove undefined keys
  Object.keys(newObj).forEach(key => {
    if (newObj[key] === undefined) {
      delete newObj[key]
    }
  })

  return newObj
}
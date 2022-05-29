import { parseDocument } from 'htmlparser2'
import { selectAll } from 'css-select'
import { textContent } from 'domutils'
import render from 'dom-serializer'
import { parse } from 'himalaya'

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

    const headers = jsonRequest 
                    ? { 'Access-Control-Allow-Origin': '*' }
                    : {}

    return {
      status: jsonRequest ? status : 200,
      headers,
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
        const html = await res.text()
        const root = parseDocument(html)
        const elementArray = selectAll(selector, root)

        return elementArray.map(x => { 
          const parsed = parse(render(x))[0]

          const obj = {
            ...parsed,
            textContent: textContent(x)
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
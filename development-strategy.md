# `diy-wiki`

### 0. Setup

> ### Set up was already done by great teamwork of Evan Cole & Frederic De Bleser

### 1. Get the page by name

> Calling this rout will return response to the body page with it's contents

- method: `GET`
- path: `/api/page/:slug`
- success response: `{status: 'ok', body: '<file contents>'}`
- failure response: `{status: 'error', message: 'Page does not exist.'}`

### 2. Create new page

> Calling this rout will write a new page with it's content and will return a ready result

- method: `POST`
- path: `'/api/page/:slug'`
- body: `{body: '<file text content>'}`
- success response: `{status: 'ok'}`
- failure response: `{status: '404 error', message: 'Could not write page.'}`

### 3. Get all the pages

> Calling this rout will return response to the body with all the pages names without `.md`

- method: `GET`
- path: `'/api/pages/all'`
- success response: `{status:'ok', pages: ['fileName','otherFileName']}`
- file names do not have .md, just the name!
- failure response: (no failure response )

### 4. Get all the tags

> Calling this rout will return all of the words from all of the existing pages with a # in front of it as `#new` or `#default` to the body page.

- method: `GET`
- path:`'/api/tags/all'`
- success response: `{status:'ok', tags: ['tagName', 'otherTagName']}`
- tags are any word in all documents with a # in front of it
- failure response: (no failure response)

### 5. Get tag by name

> Calling this rout will return the page with file names without `.md` where the tag name exists.

- method: `GET`
- path: `'/api/tags/:tag'`
- success response: `{status:'ok', tag: 'tagName', pages: ['tagName', 'otherTagName']}`
- file names do not have .md, just the name!
- failure response: (no failure response)
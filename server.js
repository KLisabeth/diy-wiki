const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const util = require('util');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.raw({ type: 'text/plain' }));

// Uncomment this out once you've made your first route.
app.use(express.static(path.join(__dirname, 'client', 'build')));

// some helper functions you can use
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);

// some more helper functions
const DATA_DIR = 'data';
const TAG_RE = /#\w+/g;
function slugToPath(slug) {
  const filename = `${slug}.md`;
  return path.join(DATA_DIR, filename);
}
function jsonOK(res, data) {
  res.json({ status: 'ok', ...data });
}
function jsonError(res, message) {
  res.json({ status: 'error', message });
}

// app.get('/', (req, res) => {
//   res.json({ wow: 'it works!' });
// });
// If you want to see the wiki client, run npm install && npm build in the client folder,
// then comment the line above and uncomment out the lines below and comment the line above.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
// });

// GET: '/api/page/:slug'
// success response: {status: 'ok', body: '<file contents>'}
// failure response: {status: 'error', message: 'Page does not exist.'}
app.get('/api/page/:slug', async (req, res) => {
	try {
    const filePath = slugToPath(req.params.slug);
    const content = await readFile(filePath, 'utf-8');
		const data = {
			body: content
		};
   jsonOK(res, data);
	} catch (err) {
    res.status(404)
   jsonError(res, {message:'Page does not exist.'});
	}
});
// POST: '/api/page/:slug'
// body: {body: '<file text content>'}
// success response: {status: 'ok'}
// failure response: {status: 'error', message: 'Could not write page.'}
app.post('/api/page/:slug', async (req, res) => {
  const filePath = slugToPath(req.params.slug);
  const text = req.body.body;
 try {
   await writeFile(filePath, text ,"utf-8");
   jsonOK(res);
 } catch (err) {
   res.status(500)
   jsonError(res, {message:'Could not write page.'});
 }
});

// GET: '/api/pages/all'
// success response: {status:'ok', pages: ['fileName', 'otherFileName']}
//  file names do not have .md, just the name!
// failure response: no failure response 

app.get('/api/pages/all', async (req, res)=>{
  const fileList = await readDir(DATA_DIR, "utf-8" );
  try{
  const data = {
      pages: fileList.map(file => (file.slice(0, -3)))
  };
  jsonOK(res, data)
} catch(err) {
  res.status(404)
  console.log(err)
}
  
});
// GET: '/api/tags/all'
// success response: {status:'ok', tags: ['tagName', 'otherTagName']}
//  tags are any word in all documents with a # in front of it
// failure response: no failure response
app.get('/api/tags/all', async (req, res) => {
    try {
      const reading = await readDir(DATA_DIR, 'utf-8')

      tagList = [];

      const regex = new RegExp(TAG_RE);

      let tagNames = reading.filter(tagName => { 

        const filePath = slugToPath(tagName.replace('.md', ''));
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const words = fileContent.split('\n')

        words.forEach( word => {
          if (regex.test(word)) {
            word.split(' ').forEach(tag => tagList.push(tag.replace('#', '')))

          }
        });
        // to list all the fileNames
        if (regex.test(fileContent)) {
            return true;
          } else {
            return false;
          }
      });
      //console.log(tagList);
      jsonOK(res, { tags: tagList })
    } catch(err) {
      res.status(400)
    };
});
// GET: '/api/tags/:tag'
// success response: {status:'ok', tag: 'tagName', pages: ['tagName', 'otherTagName']}
//  file names do not have .md, just the name!
// failure response: no failure response
app.get('/api/tags/:tag', async (req, res) => {
  try { 
    const tagName = req.params.tag
    const reading = await readDir(DATA_DIR, 'utf-8')
     const regex = new RegExp(TAG_RE);
     
    let fileNames = reading.filter(fileName => { 
    const filePath = slugToPath(fileName.replace('.md', ''));
        
    const fileContent = fs.readFileSync(filePath, 'utf-8');
     if (regex.test(fileContent)) {
       if(!fileContent.includes(`#${tagName}`)){return false};
            return true;
          } else {
            return false;
          }
     });
     fileNames = fileNames.map(file => (file.slice(0, -3)));
     //console.log(fileNames);

      jsonOK(res, {tag: tagName, pages: fileNames} )
    } catch(err){
      res.status(500);
    };
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// app.get('/api/page/all', async (req, res) => {
//   const names = await fs.readdir(DATA_DIR);
//   console.log(names);
//   jsonOK(res, { });
// }); 

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Wiki app is serving at http://localhost:${port}`));
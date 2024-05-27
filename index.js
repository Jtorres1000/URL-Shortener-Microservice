require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
let urlsRecord = [{}]
let urlcount = 0;
const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
// Your first API endpoint
app.use('/api/shorturl', express.urlencoded({extended:true}))

app.post('/api/shorturl', function(req, res) {
  inputUrl = req.body.url
  
  if (regex.test(inputUrl)) {
    urlcount++
    urlsRecord.push({
      original_url:inputUrl,
      short_url:urlcount
    })
    return res.json({
      original_url:inputUrl,
      short_url:urlcount
    })
  } 

  return res.json({error: 'invalid url'})
});

app.get('/api/shorturl/:id', (req, res) => {
  idInput = req.params.id
  if(/^\d+$/.test(idInput)) {
    return res.redirect(urlsRecord[idInput].original_url)
  }
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

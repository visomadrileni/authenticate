// Main starting point of the application
const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');
const mongoose = require('mongoose');


// DB Setup
mongoose.connect('mongodb://localhost/auth');

// App Setup(using midlleware as morgan ,cors)
//Morgan is used for logging request details,app.use() tells express 
//to log via morgan,and morgan to log in the "combined" pre-defined format
app.use(morgan('combined'));

//That’s it. CORS(Cross-Origin Resource Sharing is a mechanism that uses additional HTTP headers to tell 
//browsers to give a web application running at one origin,access to selected resources from a different
// origin) is now enabled.If we make a request to our app,we will notice a new header being returned:
// Access-Control-Allow-Origin.The Access-Control-Allow-Origin header determines which origins 
//are allowed to access server resources over CORS(CORS allows you to configure the web API's security. 
//It has to do with allowing other domains to make requests against your web API)
app.use(cors());

//means to tell express to accept all app as JSON file
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);

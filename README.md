## Snappy!
Snappy is best app.

Repo contains both the web application and the vm provisioner application. Both of which are MEAN apps.

## PreRequisites
MEAN is an acronym for MongoDB, Express, AngularJs and NodeJs. We need to install some of these before we begin.

<ul>
<li><strong>MongoDB</strong> <a href="http://www.mongodb.org/downloads">Download</a> and Install mongodb - <a href="http://docs.mongodb.org/manual">Checkout their manual</a> if you're just starting</li>
<li><strong>Node.js</strong> - <a href="http://nodejs.org/download/">Download</a> and Install Node.js, codeschool has free <a href="https://www.codeschool.com/courses/real-time-web-with-node-js">node</a> and < a href="https://www.codeschool.com/courses/shaping-up-with-angular-js">angular</a> tutorials</li>
<li><strong>git</strong> - Get git using a package manager or <a href="http://git-scm.com/downloads">download</a> it if you're on </li>
</ul>

## Running the apps
Running the mean apps requires that their dependencies are installed, then executed using grunt.

```bash
 > npm install -g mean-cli       // Get the mean cmdline (if you like)
 > npm install -g grunt-cli      // Install grunt command line

 > cd snappy-web-app
 > npm install       			// Install dependencies locally
 > grunt                        // Launch mean app
```


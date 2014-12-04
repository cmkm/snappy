

var express = require('express');
var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;

app = express();

var mongoDB = null;


app.use("/public", express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Establish mongoDB connection
var mongoClient = require('mongodb').MongoClient;

// Currently pulling data from the database with every API call.
//
// Will need to implement caching later on.
//
app.get('/serviceCategories', function(req, res) {
    mongoDB.collection('serviceCategory').find().toArray(function (err, items) {
        res.json(items);
    });
});

app.get('/serviceCategories/:id', function(req, res) {
    mongoDB.collection('serviceCategory').findOne({ id: req.params.id }, function (err, item) {
        res.json(item);
    });
});

app.get('/services', function(req, res) {
    mongoDB.collection('service').find().toArray(function (err, items) {
        res.json(items);
    });
});

app.get('/services/:catId', function(req, res) {
    mongoDB.collection('service').find({ catId: req.params.catId }).toArray(function (err, items) {
        res.json(items);
    });
});

app.get('/projects/:projID', function(req, res) {
    mongoDB.collection('machine').findOne({ id: req.params.projID }, function (err, item) {
        res.json(item);
    });
});


var cmdWithOutput = function(cmd, args, workingDir) {
  var cmd = spawn(cmd, args, { cwd: workingDir});
  
  cmd.stdout.on('data', function(data) {
    console.log('stdout: '+data);
  });
  
  cmd.stderr.on('data', function(data) {
    console.log('stdout: '+data);
  });
  
  return cmd;
}

var vagrantFileText = '# -*- mode: ruby -*-\n\
# vi: set ft=ruby :\n\
\n\
# Vagrantfile API/syntax version. Don\'t touch unless you know what you\'re doing!\n\
VAGRANTFILE_API_VERSION = "2"\n\
\n\
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|\n\
  config.vm.box = "ready/centos-fixed"\n\
  config.vm.network "private_network", ip: "{{ip}}"\n\
end\n';

var updateMachineStatus = function(machId, machStatus) {
  mongoDB.collection('machine').update(
    { id: machId },
    { $set: {
        status: machStatus 
      }
    },
    { upsert: true },
    
    function(err, result) {
      console.log(err); 
    }
  );
};

app.post('/createProject', function(req, res) {
  
  console.log('Create project posted!');
  
  var safeName = req.body.projectName.toLowerCase().replace(' ', '-');
  
  var vm = {};
  
  vm['id'] = safeName;
  vm['ip'] = '192.168.33.20';
  vm['status'] = 'Freshly Created';
  vm['projectName'] = req.body.projectName;
  vm['projectDesc'] = req.body.projectDesc;
  
  mongoDB.collection('machine').insert(vm, function(err, result){console.log(err);});
  
  var mkdir = spawn('mkdir', [safeName], { cwd: '/vagrant/' });
  var vgDir = '/vagrant/'+safeName;
  
  mkdir.on('close', function (code) {
    
    console.log('Directory created: '+vgDir);
    
    var vgInit = cmdWithOutput('vagrant', ['init'], vgDir);
    vgInit.on('close', function() {
      
      
      var fs = require('fs');
      fs.writeFile(vgDir+'/Vagrantfile', vagrantFileText.replace('{{ip}}', vm.ip), function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log("The file was saved!");
            
              updateMachineStatus(vm['id'], 'Starting');
              var vgUp = cmdWithOutput('vagrant', ['up'], vgDir);
            
              vgUp.on('close', function() {
                // UPDATE MACHINE STATUS
                updateMachineStatus(vm['id'], 'Ready');
              });
          }
      }); 
      
      
    });
    
    
  });
  
  res.json(vm);
  
});

mongoClient.connect('mongodb://localhost:27017/snappy-vm', function(err, db) {
    if(!err) {
        console.log("MongoDB Connected!");
        
        mongoDB = db;
        
        //db.collection('serviceCategory').insert({ id: 'db', name: 'Database', multi: false }, function(err, result){console.log(err);});
        
        //db.collection('service').insert({ id: 'appache', name: 'Apache', catId: 'other' }, function(err, result){console.log(err);});
        
        
    }
    else {
        console.log("MongoDB Fail :(");
        console.log(err);
    }

});


app.listen(3000);
console.log('Express listening on port 3000');


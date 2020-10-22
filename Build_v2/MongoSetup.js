// MongoSetup.js

// Group Project Part 3 
// Mobile Applications CSCI2356
// Theresa Clarke A00429814
// James Heading A00438459
// Shannon Power A00271744

// Set up for MongoDB GroupProject3

// ** functions to save and retrieve data to/from the database are defined outside the scope of establishing the connection to the database

// ** global variable "globalDB" used to contain a reference to the database, initialized within the scope of a function, not visible to the functions used for saving
//    and retrieving data. Simplifies code and makes it easier to understand.

var express = require('express'); // Import the Express Framework

var mongodb = require('mongodb'); // Import the MongoDB API

var username = 'group3';        // username
var password = 'still%40malta%4099';		  // password
var localHost = '127.0.0.1';	  // Just like 140.184.230.209. Address to local host.
var localPort = '27017';		  // port number of the local port
var database = 'group3';		  // name of the database

// create the credentials string used for datababase connection://group3:securepasswd@127.0.0.1:27017/group3
var credentialsString = 'mongodb://' + username + ':' + password + '@' + localHost + ':' + localPort + '/' + database;

// Access the express framework via the variable server
var server = express();

// set port variable
var port = 3017;

// VARIABLE FOR DEBUG -- set to true to clear collection 
var DROP_DB_WHEN_START = false;

// REQUIRED SECTION -- server.use()
// 
// enable recognition of incoming data as JSON
server.use(express.json());
// incoming values in name:value pairs can be any type (true below)
server.use(express.urlencoded({ extended: true }));


// REQUIRED SECTION -- server.use()
// 
// static assets like javascript and css are served from these folders
server.use('/scripts', express.static(__dirname + '/scripts'));
server.use('/css', express.static(__dirname + '/css'));
// root
server.use(express.static(__dirname));

// REQUIRED SECTION -- server.use()
// 
// set up allowance characteristics for cross-origin resource sharing (CORS)
// req - nto used here
// res - response to HTTP request: allow requesting code from any origin;
//								   allowed HTTP request methods;
//								   name of supported request header.
// next - calls the next Express Framework function set to be executed
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
server.use(allowCrossDomain);

// Post and Callback function
server.post('/doSet', setCollectionItem);
server.post('/doSetProperty', setItemProperty);
server.post('/doGet', getCollectionItem);
server.post('/doSetArray', setArrayCollectionItem);
server.post('/doDeleteArrayItem', deleteArrayCollectionItem);

// Create a connection to your mongoDB database
mongodb.connect(credentialsString, getDBReference);

// Create a new collection item in db
function setCollectionItem(req, res) {
    var setData = {};
    setData[req.body.key] = req.body.value;
    console.log("setCollectionItem: ");
    console.log(setData);

    globalDB.collection('emailData').updateOne({}, { $set: setData },
		{
		    upsert: true
		}, function (err, updateRes) {
		    if (err == null) {
		        console.log(updateRes.result.nModified + " document(s) updated");
		        return res.status(200).send("Set array item successful"); // callback function
		    }
		    else {
		        console.log("Failed to Insert");
		    }
		});
}

// allows user to change a single piece of data in an array item in the collection
// useful for unread/read emails and the urgent chekboxes
function setItemProperty(req, res) {
    var setData = { $set: {} };
    setData.$set[String(req.body.property)] = req.body.value;
    console.log("SetItemProperty: " + req.body.property);
    globalDB.collection('emailData').updateOne({}, setData, {upsert: true}, function (err, updateRes) {
        if (err == null) {
            console.log(updateRes.result.nModified + " document(s) updated");
            return res.status(200).send("Set item property successful"); // callback function
        }
        else {
            console.log("Failed to set item property");
        }
    });
}

// Checks if array collection item already exists and either pushes or adds collection item
function setArrayCollectionItem(req, res) {
    var setData = {};
    setData[req.body.key] = req.body.value;
    console.log("setArrayCollectionItem: ");
    console.log(setData);

    var collectionKey = req.body.key;
    globalDB.collection('emailData').findOne({}, function (err, foundRecord) {
        if (err == null) {
            var record = foundRecord[collectionKey];
            // if collection item exists, pushes next array item onto collection
            if (record != null) {
                globalDB.collection('emailData').updateOne({}, { $push: setData },
                   {
                       upsert: true
                   }, function (err, updateRes) {
                       if (err == null) {
                           console.log(updateRes.result.nModified + " document(s) updated");
                           return res.status(200).send("Set array item successful"); // callback function
                       }
                       else {
                           console.log("Failed to Insert array item");
                       }
                   });
            }
            // if collection item is new, call setCollectionItem to add new item
            else {
                console.log("record is null, setting the value instead.");
                req.body.value = [req.body.value];
                setCollectionItem(req, res);
            }
        }
    });
}

// returns collection item to client upon request
function getCollectionItem(req, res) {
    //
    var collectionKey = req.body.key;
    console.log("getCollectionItem: " + collectionKey);
    globalDB.collection('emailData').findOne({}, findCallback);

    // The callback function that is executed when server.post completes its tasks.
    function findCallback(err, foundRecord) {
        // if error is  returned or there is no record create a new record and insert our key
        if (err != null || foundRecord == null) {
            var newRecord = {};
            newRecord[collectionKey] = []; // add empty array
            globalDB.collection('emailData').insertOne({}, newRecord, function (err, insertRes) {
                if (err == null) {
                    return res.status(200).send(newRecord[collectionKey]);  // callback function
                }
                else {
                    console.log("Failed to Insert");
                }
            });
        }
        // if record exists but the key is not found in record (does not yet exist)
        else {
            if (foundRecord[collectionKey] == null) {
                foundRecord[collectionKey] = []; // add empty array
                globalDB.collection('emailData').updateOne({}, { $set: foundRecord }, { upsert: true }, function (err, updateRes) {
                    if (err == null) {
                        console.log(updateRes.result.nModified + " document(s) updated");
                        return res.status(200).send(foundRecord[collectionKey]);  // callback function
                    }
                    else {
                        console.log("Failed to Insert");
                    }
                });
            }
            // record exists and key is found, return success
            else {
                return res.status(200).send(foundRecord[collectionKey]); // callback function
            }
        }
    }
}

// deletes array item from collection on request and updates collection
function deleteArrayCollectionItem(req, res) {
    var collectionKey = req.body.key;
    var index = req.body.index;
    // finds requested item in collection 
    globalDB.collection('emailData').findOne({}, function (err, foundRecord) {
        if (err == null) {
            var record = foundRecord[collectionKey];
            // checks to make sure item in collection is not empty
            // if item exists splice based on index # sent from client
            if (record.length > 0) {
                record.splice(index, 1);
                var arrayData = {};
                arrayData[collectionKey] = record;
                // update collection item and return client 
                globalDB.collection('emailData').updateOne({}, { $set: arrayData },
                   {
                       upsert: true
                   }, function (err, updateRes) {
                       if (err == null) {
                           console.log(updateRes.result.nModified + " document(s) updated");
                           return res.status(200).send("Array Deletion Successful"); // callback function
                       }
                       // error when trying to update collection
                       else {
                           console.log("Failed to Insert");
                       }
                   });
            }
            // no item exists in db collection so no deletion can occur
            else {
                console.log("tried to delete record but collection is empty");
            }
        }
    });
}

// Creating the global varaible 
var globalDB;

function getDBReference(err, ref) {
    if (err == null) {
        // When a SIGTERM event occurs: log info; close DB; and close server (via the anonymous function).
        // An anonymous function is a function without a name. See the second argument to "process.on"
        // just below. It is "function () {...}"
        // SIGTERM is a signal intentionally generated by another process (not by the operating system).
        // It represents a controlled and deliberate administrative decision, to terminate the process.
        process.on('SIGTERM', function () {
            console.log("Shutting server down.");
            ref.close();
            server.close();
        });

        // initialize reference to the database
        globalDB = ref.db("group3");

        if (DROP_DB_WHEN_START) {
            globalDB.collection('emailData').drop(function (dropError, dropSuccess) {
                //var initialData = {};
                //initialData.studentInboxEmails = [];
                //initialData.studentSentEmails = [];
                //initialData.adminInboxEmails = [];
                //initialData.adminSentEmails = [];
                //initialData.lastPage = "";
                server.listen(port, function () {
                    console.log('Listening on port ' + port);
                });
            });
        }
        else {
            // drop function in this section is for debugging purposes only -- to test for when a new db is created
            //globalDB.collection('emailData').drop(function (dropError, dropSuccess) {
                server.listen(port, function () {
                    console.log('Listening on port ' + port);
                });
          //  });
        }
    }
    else {
        // Throw the object err containing detailed error info
        throw err;
    }
}
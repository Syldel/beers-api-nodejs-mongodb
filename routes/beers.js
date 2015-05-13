/*
exports.findAll = function(req, res) {
    res.send([{name:'beer1'}, {name:'beer2'}, {name:'beer3'}]);
};
 
exports.findById = function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
};
*/

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {
    auto_reconnect: true
});
db = new Db('beersdb', server);

db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'beersdb' database");
        db.collection('beers', {
            strict: true
        }, function(err, collection) {
            if (err) {
                console.log("The 'beers' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving beer: ' + id);
    db.collection('beers', function(err, collection) {
        collection.findOne({
            '_id': new BSON.ObjectID(id)
        }, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('beers', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addBeer = function(req, res) {
    var beer = req.body;
    console.log('Adding beer: ' + JSON.stringify(beer));
    db.collection('beers', function(err, collection) {
        collection.insert(beer, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateBeer = function(req, res) {
    var id = req.params.id;
    var beer = req.body;
    console.log('Updating beer: ' + id);
    console.log(JSON.stringify(beer));
    db.collection('beers', function(err, collection) {
        collection.update({
            '_id': new BSON.ObjectID(id)
        }, beer, {
            safe: true
        }, function(err, result) {
            if (err) {
                console.log('Error updating beer: ' + err);
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(beer);
            }
        });
    });
};

exports.deleteBeer = function(req, res) {
    var id = req.params.id;
    console.log('Deleting beer: ' + id);
    db.collection('beers', function(err, collection) {
        collection.remove({
            '_id': new BSON.ObjectID(id)
        }, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred - ' + err
                });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var beers = [{
        name: "Aardmonnik",
        type: "Vieille brune",
        alcool: 8,
        brasserie: "De Struise Brouwers"
    }, {
        name: "Aarschotse Bruine",
        type: "Brune",
        alcool: 6,
        brasserie: "Stadsbrouwerij Aarschot"
    }];

    db.collection('beers', function(err, collection) {
        collection.insert(beers, {
            safe: true
        }, function(err, result) {});
    });

};

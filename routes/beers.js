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
    //BSON = mongo.pure().BSON,
    ObjectID = mongo.ObjectID;

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

    console.log('Retrieving %o ', req);

    var id = req.params.id;
    console.log('Retrieving beer: ' + id);

    db.collection('beers', function(err, collection) {

        if (ObjectID.isValid(id)) {
            collection.findOne({
                '_id': new ObjectID(id)
            }, function(err, item) {
                res.send(item);
            });
        } else {
            res.send({
                'error': id + ' is not a valid ID'
            });
        }

        // ObjectID.createFromHexString(id) ???

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

        if (ObjectID.isValid(id)) {

            collection.update({
                '_id': new ObjectID(id)
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
        } else {
            res.send({
                'error': id + ' is not a valid ID'
            });
        }

    });
};

exports.deleteBeer = function(req, res) {
    var id = req.params.id;
    console.log('Deleting beer: ' + id);
    db.collection('beers', function(err, collection) {

        if (ObjectID.isValid(id)) {
            collection.remove({
                '_id': new ObjectID(id)
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
        } else {
            res.send({
                'error': id + ' is not a valid ID'
            });
        }
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

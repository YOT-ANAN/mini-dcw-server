const functions = require('firebase-functions');
var express = require('express');
var cors = require('cors')
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var firebase = require("firebase");
app.use(cors());
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
};
firebase.initializeApp(config);
exports.api = functions.https.onRequest(router)
var database = firebase.database();
router.route('/members') 
    .post(function (req, res) {
        let memberRef = database.ref('members/');
        memberRef.child(req.body.id).set({
            memberID: req.body.id,
            memberName: req.body.name,
            memberVote: 0
        }, function (error) {
            if (error) {
                res.send({ message: "error" });
            } else {
                res.send({ message: "successfully" });
            }
        });
    });
router.route('/members')
    .get(function (req, res) {
        let memberRef = database.ref('/members/');
        memberRef.on('value', function (snapshot) {
            res.send(snapshot.val());
        });
    });
/*router.route('/members/:member_id')
    .get(function (req, res) {
        let memberID = req.params.member_id;
        let memberRef = database.ref('/members/' + memberID);
        return memberRef.once('value').then(function (snapshot) {
            var data = (snapshot.val() || 'Anonymous');
            res.send(data);
        },function (error) {
            if (error) {
                res.send({ message: "error" });
            } else {
                res.send({ message: "successfully" });
            }
        });
    });*/
router.route('/members/:member_id')
    .put(function (req, res) {
        let memberID = req.params.member_id;
        let updatedMember = {
            memberID: req.body.id,
            memberName: req.body.name,
            memberVote: req.body.vote+1
        }
        let updates = {};
        let memberRef = database.ref('members/');
        updates[memberID] = updatedMember;
        res.send(updates)
        return memberRef.update(updates);
    });
router.route('/members/:member_id')
    .delete(function (req, res) {
        let memberID = req.params.member_id;
        let memberRef = database.ref('members/' + memberID);
        memberRef.remove();
        res.send({ message: "delete" });
    });
app.use('/api', bodyParser.json(), router);
app.listen(8000);

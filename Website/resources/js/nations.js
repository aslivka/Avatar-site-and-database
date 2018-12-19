module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getNationsAll(res, mysql, context, complete){
        mysql.pool.query("SELECT nation_id, name, government, population, location, capital FROM atla_nation", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.nations  = results;
            complete();
        });
    }

    
    /*Display all nations. Requires web based javascript to delete nations with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getNationsAll(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('nations', context);
            }
        }
    });


    /* Adds a nation, redirects to the nation page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO atla_nation (name, government, population, location, capital) VALUES (?,?,?,?,?)";

        if(req.body.location == ""){
            req.body.nationality = null;
        }
        if(req.body.capital == ""){
            req.body.capital = null;
        }
        var inserts = [req.body.name, req.body.government, req.body.population, req.body.location, req.body.capital];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/nations');
            }
        });
    });


    /* Route to delete a nation, simply returns a 202 upon success. Ajax will handle this. */

    router.post('/delete/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM atla_nation WHERE nation_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();

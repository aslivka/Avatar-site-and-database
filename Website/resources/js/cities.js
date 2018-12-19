module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getNations(res, mysql, context, complete){
        mysql.pool.query("SELECT nation_id, name FROM atla_nation", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.nations  = results;
            complete();
        });
    } 

    function getCities(res, mysql, context, complete){
        queryTxt = "SELECT c.city_id, c.name, c.population, n.name AS nation, n.nation_id FROM atla_cities AS c";
        queryTxt += " LEFT JOIN atla_nation AS n ON n.nation_id = c.nation";

        mysql.pool.query(queryTxt, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.cities  = results;
            complete();
        });
    }
    
    /*Display all cities. Requires web based javascript to delete nations with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getNations(res, mysql, context, complete);
        getCities(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('cities', context);
            }
        }
    });

    /* Adds a city, redirects to the cities page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO atla_cities (name, population, nation) VALUES (?,?,?)";

        if(req.body.nation == ""){
            req.body.nation = null;
        }

        var inserts = [req.body.name, req.body.population, req.body.nation];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/cities');
            }
        });
    });

 
    /* Route to delete a city, simply returns a 202 upon success. Ajax will handle this. */

    router.post('/delete/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM atla_cities WHERE city_id = ?";
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

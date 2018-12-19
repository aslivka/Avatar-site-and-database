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

    function getCharacters(res, mysql, context, complete){
        var queryTxt = "SELECT ac.char_id, ac.name, ac.gender, atla_nation.name AS nation_name, ac.nationality, ac.age, atla_org.title AS membership FROM atla_characters AS ac";
        queryTxt += " LEFT JOIN atla_nation ON ac.nationality = atla_nation.nation_id";
        queryTxt += " LEFT JOIN atla_org ON atla_org.org_id = ac.membership";
        mysql.pool.query(queryTxt, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    function getCharFilt(res, mysql, context, query, complete){
        var inserts = [];
        var sql = "SELECT ac.char_id, ac.name, ac.gender, atla_nation.name AS nation_name, ac.nationality, ac.age, atla_org.title AS membership FROM atla_characters AS ac";
        sql += " LEFT JOIN atla_nation ON ac.nationality = atla_nation.nation_id";
        sql += " LEFT JOIN atla_org ON atla_org.org_id = ac.membership";

        if(query["type"] == "nation")
        {
            if(query["value"] == ""){
                sql += " WHERE ac.nationality IS NULL";
            }
            else
            {
                sql += " WHERE ac.nationality = ?";
                inserts.push(query["value"]);
            }
             sql += " ORDER BY ac.name ASC;"
        }

        else if(query["type"] == "age")
        {
            if(query["value"] == ""){
                sql += " WHERE ac.age IS NULL";
            }
            else
            {
                sql += " WHERE ac.age <= ?";
                inserts.push(query["value"]);    
            }
            sql += " ORDER BY ac.age ASC;"
        }
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    function getOrganizations(res, mysql, context, complete){
        var queryTxt = "SELECT org_id, title FROM atla_org";
        mysql.pool.query(queryTxt, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orgs = results;
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        //getCharacters(res, mysql, context, complete);
        getNations(res, mysql, context, complete);
        getOrganizations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('filterchar', context);
            }
        }
    });

        /*Display people filtered by nation. Requires web based javascript to delete users with AJAX*/

    router.post('/nation', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        var query = { type: "nation", value: req.body.nationality };
        getCharFilt(res, mysql, context, query, complete);
        getNations(res, mysql, context, complete);
        getOrganizations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                var tmpNation = context.characters[0].nation_name;
                context.filter = {type: "nation", value: tmpNation};
                res.render('filterchar', context);
            }
        }
    });

    router.post('/age', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [];
        var mysql = req.app.get('mysql');
        var query = { type: "age", value: req.body.age };
        getCharFilt(res, mysql, context, query, complete);
        getNations(res, mysql, context, complete);
        getOrganizations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                context.filter = query;
                res.render('filterchar', context);
            }
        }
    });

    return router;
}();

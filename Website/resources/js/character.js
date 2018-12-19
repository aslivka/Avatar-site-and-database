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
        var queryTxt = "SELECT ac.char_id, ac.name, ac.gender, atla_nation.name AS nationality, ac.age, atla_org.title AS membership FROM atla_characters AS ac";
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

    function getCharacter(res, mysql, context, id, complete){
        var sql = "SELECT char_id, name, gender, nationality, age, membership FROM atla_characters WHERE char_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getCharacters(res, mysql, context, complete);
        getNations(res, mysql, context, complete);
        getOrganizations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('characters', context);
            }
        }
    });

    /* Display one person for the specific purpose of updating people */

     router.get('/:id', function(req, res){
         callbackCount = 0;
         var context = {};
         context.jsscripts = ["updatechar.js"];
         var mysql = req.app.get('mysql');
         getCharacter(res, mysql, context, req.params.id, complete);
         getNations(res, mysql, context, complete);
         getOrganizations(res, mysql, context, complete);
         function complete(){
             callbackCount++;
             if(callbackCount >= 3){
                 res.render('update_char', context);
             }

         }
     });

    /* Adds a person, redirects to the people page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO atla_characters (name, gender, nationality, age, membership) VALUES (?,?,?,?,?)";

        if(req.body.nationality == ""){
            req.body.nationality = null;
        }
        if(req.body.membership == ""){
            req.body.membership = null;
        }
        if(req.body.age == ""){
            req.body.age = null;
        }
        
        var inserts = [req.body.name, req.body.gender, req.body.nationality, req.body.age, req.body.membership];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/characters');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE atla_characters SET name=?, nationality=?, gender=?, age=?, membership=? WHERE char_id=?";
        if(req.body.nationality == ""){
            req.body.nationality = null;
        }
        if(req.body.membership == ""){
            req.body.membership = null;
        }

        if(req.body.age == ""){
            req.body.age = null;
        }

        var inserts = [req.body.name, req.body.nationality, req.body.gender, req.body.age, req.body.membership, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{

                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.post('/delete/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM atla_characters WHERE char_id = ?";
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

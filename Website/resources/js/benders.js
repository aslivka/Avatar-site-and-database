module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getBending(res, mysql, context, complete){
        mysql.pool.query("SELECT bend_id, type FROM atla_bending", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.bending  = results;
            complete();
        });
    } 

    function getCharacters(res, mysql, context, complete){
        mysql.pool.query("SELECT char_id, name FROM atla_characters", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters  = results;
            complete();
        });
    } 

    function getCharacter(res, mysql, context, id, complete){
        var sql = "SELECT char_id, name FROM atla_characters WHERE char_id = ?";
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

    function getBenders(res, mysql, context, complete){
        queryText = "SELECT ch.name, bending.type, benders.char_id, benders.bend_id FROM atla_characters AS ch ";
        queryText += "INNER JOIN atla_benders AS benders ON benders.char_id = ch.char_id ";
        queryText += "INNER JOIN atla_bending AS bending ON bending.bend_id = benders.bend_id ORDER BY ch.name ASC";

        mysql.pool.query(queryText, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.benders  = results;
            complete();
        });
    } 

    /*Display all benders. Requires web based javascript to delete bender's association with a type of bending with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getBending(res, mysql, context, complete);
        getCharacters(res, mysql, context, complete);
        getBenders(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('benders', context);
            }
        }
    });

    /* Adds a bender to the table, redirects to the benders page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO atla_benders (char_id, bend_id) VALUES ";
        var inserts = [];
        var values = "";

        var size = 0, key;
        for (key in req.body.bend_id) {
            if (req.body.bend_id.hasOwnProperty(key)) {
                size++;
                inserts.push(req.body.char_id);
                inserts.push(req.body.bend_id[key]);
            }
        }

        if(size == 1){
            values = "(?,?)";
        }
        else{
             for(var i = 0; i < size; i++){
                if(i == size - 1) {
                    values += "(?,?)";
                }
                else{
                    values += "(?,?), ";
                }       
            }
        }

        sql += values;
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/benders');
            }
        });
    });


        /* Display one person for the specific purpose of updating one of their bending types */

     router.get('/update', function(req, res){

        console.log("got get update request");
        callbackCount = 0;
        var context = {};
        context.char_id = req.query.char_id;
        context.bend_id = req.query.bend_id;
        context.jsscripts = ["updatebender.js"];
        var mysql = req.app.get('mysql');
        getBending(res, mysql, context, complete);
        getCharacter(res, mysql, context,req.query.char_id, complete);
         function complete(){
             callbackCount++;
             if(callbackCount >= 2){
                 res.render('update_bender', context);
             }
         }
     });

         /* The URI that update data is sent to in order to update character's bending*/

    router.put('/update', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE atla_benders SET bend_id=? WHERE char_id=? AND bend_id=?";
        var inserts = [req.body.newBending, req.body.char_id, req.body.origBending];

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

    /* Route to delete a bending association, simply returns a 202 upon success. Ajax will handle this. */

    router.post('/delete/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM atla_benders WHERE char_id = ? AND bend_id = ?";
        var inserts = [req.body.char_id, req.body.bend_id];
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

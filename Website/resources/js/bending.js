module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getBending(res, mysql, context, complete){
        mysql.pool.query("SELECT bend_id, type, rarity, source, learned_from FROM atla_bending", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.bending  = results;
            complete();
        });
    } 

   
    /*Display all bending types. Requires web based javascript to delete bending with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getBending(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('bending', context);
            }
        }
    });

    /* Adds a bending type, redirects to the bending page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO atla_bending (type, rarity, source, learned_from) VALUES (?,?,?,?)";

        if(req.body.rarity == ""){
            req.body.rarity = null;
        }

        var inserts = [req.body.type, req.body.rarity, req.body.source, req.body.learned_from];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/bending');
            }
        });
    });

    /* Route to delete a bending type, simply returns a 202 upon success. Ajax will handle this. */

    router.post('/delete/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM atla_bending WHERE bend_id = ?";
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

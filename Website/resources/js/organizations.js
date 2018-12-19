module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getOrgs(res, mysql, context, complete){
        mysql.pool.query("SELECT org_id, title, purpose, status, influence FROM atla_org", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.organizations  = results;
            complete();
        });
    } 
   
    /*Display all bending types. Requires web based javascript to delete bending with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getOrgs(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('orgs', context);
            }
        }
    });

    /* Adds a bending type, redirects to the bending page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO atla_org (title, purpose, status, influence) VALUES (?,?,?,?)";

        if(req.body.influence == ""){
            req.body.rarity = null;
        }

        var inserts = [req.body.title, req.body.purpose, req.body.status, req.body.influence];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/orgs');
            }
        });
    });


    /* Route to delete a bending type, simply returns a 202 upon success. Ajax will handle this. */

    router.post('/delete/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM atla_org WHERE org_id = ?";
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

function updateCharBending(cid, bid){
    var urlText = '/benders/update';
    $.ajax({
        url: urlText,
        type: 'PUT',
        data: $('#updateBender').serialize(),
        error:    function (){
          console.log("connection error, url:", urlText)},
        success: function(result){
            window.location.replace("./");
        }
    })
};

function selectBending(bend_id){
    $("#bend-menu").val(bend_id);
};




    





function deleteCharacter(id){

    $.ajax({
        url: '/characters/delete/' + id,
        type: 'POST',
        error: function (){
          console.log("connection error, url:", urlText);
        },
        success: function(result){
            window.location.reload(true);
        }
    })
};

// function deletePeopleCert(pid, cid){
//   $.ajax({
//       url: '/people_certs/pid/' + pid + '/cert/' + cid,
//       type: 'DELETE',
//       success: function(result){
//           if(result.responseText != undefined){
//             console.log(result.responseText)
//           }
//           else {
//             window.location.reload(true)
//           } 
//       }
//   })
// };

function deleteBenderRow(cid, bid){
  $.ajax({
      url: '/benders/delete',
      type: 'POST',
      data: {char_id: cid, bend_id: bid},
      success: function(result){
          if(result.responseText != undefined){
            console.log(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};


function deleteNation(id){

    $.ajax({
        url: '/nations/delete/' + id,
        type: 'POST',
        error: function (){
          console.log("connection error, url:", urlText);
        },
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteCity(id){

    $.ajax({
        url: '/cities/delete/' + id,
        type: 'POST',
        error: function (){
          console.log("connection error, url:", urlText);
        },
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteBending(id){

    $.ajax({
        url: '/bending/delete/' + id,
        type: 'POST',
        error: function (){
          console.log("connection error, url:", urlText);
        },
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteOrganization(id){

    $.ajax({
        url: '/orgs/delete/' + id,
        type: 'POST',
        error: function (){
          console.log("connection error, url:", urlText);
        },
        success: function(result){
            window.location.reload(true);
        }
    })
};
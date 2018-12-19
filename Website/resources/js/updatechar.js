function updateCharacter(id){
    $.ajax({
        url: '/characters/' + id,
        type: 'PUT',
        data: $('#updateCharacter').serialize(),
        error:    function (){
          console.log("connection error, url:", url)},
        success: function(result){
            window.location.replace("./");
        }
    })
};

function selectNation(natId){
    $("#nation-menu").val(natId);
};

function selectOrg(orgId){
	$("#org-menu").val(orgId);
	selectGender();
};

function selectGender(){
	var newGen = $("#curGender").val().toString();

	if(newGen == "male")
    {
    	$("#genderM").prop("checked", true);
    	//$("#genderM").val("male");
    }
    else
    {
    	$("#genderF").prop("checked", true);
    	//$("#genderF").val("female");
    }

};
    





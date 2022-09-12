
// current page number right now
var globalPageNumber = 0;

function visibilityTable(pageNumber){

    //update current page number right now
    this.globalPageNumber = pageNumber;

    var url = "http://localhost:8080/rest/players?";

    // pages count
    var howManyAccountOnPage = $("#account_count_on_page").val();
    console.log(howManyAccountOnPage);
    if(howManyAccountOnPage == null){
        howManyAccountOnPage = 3;
    }

    url = url.concat("pageSize=").concat(howManyAccountOnPage);
    url = url.concat("&pageNumber=").concat(pageNumber);

    // remove old table
    $("tr:has(td)").remove();

    $.get(url, function(data) {
        $.each(data, function (i, element) {
            $("<tr>").html(
                "<td>" + element.id + "</td>" +
                "<td>" + element.name + "</td>" +
                "<td>" + element.title + "</td>" +
                "<td>" + element.race + "</td>" +
                "<td>" + element.profession + "</td>" +
                "<td>" + element.level + "</td>" +
                "<td>" + new Date(element.birthday).toLocaleDateString() + "</td>" +
                "<td>" + element.banned + "</td>" +
                "<td><button id='edit_btn"+ element.id +"' onclick='editThisAccount("+ element.id + ")'><img src='/img/edit.png'></img></button></td>" +
                "<td><button id='delete_btn"+ element.id +"' onclick='deleteThisAccount("+ element.id +")'><img src='/img/delete.png'></img></button></td>"
            ).appendTo("#colum");
        });
    });

    // get count Accounts
    var getAccountCount = getAcoountsCount();

    var pagesCount = Math.ceil(getAccountCount / howManyAccountOnPage);

    // delete old btn
    $('button.btn_style').remove();

    // added btn in page
    for (var i = 0; i < pagesCount; i++){
        $("#pages").append($("<button>"+ (i+1) +"</button>")
            .attr("id", "btn"+i)
            .attr("onclick", "visibilityTable(" + i + ")")
            .addClass("btn_style"));
    }

    // color onClick btn
    $("#btn"+pageNumber).css("color", "red");
}

// get how many account have in programmmmmm
function getAcoountsCount(){
    var url = "http://localhost:8080/rest/players/count";
    var count = 0;
    $.ajax({
        url: url,
        async: false,
        success: function (result) {
            count = parseInt(result);
        }
    })
    return count;
}

// function for delete acc
function deleteThisAccount(accountID){
    var url = "http://localhost:8080/rest/players/"+accountID;
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function () {
            visibilityTable(globalPageNumber);
        }
    })
}

// function for edit account info
function editThisAccount(accountID){
    var current_btn = '#edit_btn' + accountID;

    $('#delete_btn' + accountID).remove();
    $(current_btn).html("<img src='/img/save.png'></img>");

    var tr_parent = $(current_btn).parent().parent().children();

    // edit name
    var tr_name = tr_parent[1];
    tr_name.innerHTML = "<input type='text' value='"+ tr_name.innerHTML +"' id='input_name"+ accountID +"'>";

    // edit title
    var tr_title = tr_parent[2];
    tr_title.innerHTML = "<input type='text' value='"+ tr_title.innerHTML +"' id='input_title"+ accountID +"'>";

    // edit race
    var tr_race = tr_parent[3];
    var current_race = tr_race.innerHTML;
    tr_race.innerHTML = getDropdownListOfRace(accountID);
    $("#race_id"+accountID).val(current_race).change();

    // edit prof
    var tr_profession = tr_parent[4];
    var current_profession = tr_profession.innerHTML;
    tr_profession.innerHTML = getDropdownListOfProfession(accountID);
    $("#profession_id"+accountID).val(current_profession).change();

    // edit ban status
    var tr_ban_status = tr_parent[7];
    var ban_id = "#ban_status" + accountID;
    var current_ban_status = tr_ban_status.innerHTML;
    tr_ban_status.innerHTML = getDropdownListOfBanStatus(accountID);
    $(ban_id).val(current_ban_status).change();

    //update info
    var updateString = "saveAccountInfo(" + accountID + ")";
    $(current_btn).attr('onclick', updateString);
}

function getDropdownListOfRace(accountID){
    return "<select id='race_id"+ accountID +"'>"
        +"<option value='HUMAN'>HUMAN</option>"
        +"<option value='DWARF'>DWARF</option>"
        +"<option value='ELF'>ELF</option>"
        +"<option value='GIANT'>GIANT</option>"
        +"<option value='ORC'>ORC</option>"
        +"<option value='TROLL'>TROLL</option>"
        +"<option value='HOBBIT'>HOBBIT</option></select>"
}
function getDropdownListOfProfession(accountID){
    return "<select id='profession_id"+ accountID +"'>"
        +"<option value='WARRIOR'>WARRIOR</option>"
        +"<option value='ROGUE'>ROGUE</option>"
        +"<option value='SORCERER'>SORCERER</option>"
        +"<option value='CLERIC'>CLERIC</option>"
        +"<option value='PALADIN'>PALADIN</option>"
        +"<option value='NAZGUL'>NAZGUL</option>"
        +"<option value='WARLOCK'>WARLOCK</option>"
        +"<option value='DRUID'>DRUID</option></select>"
}
function getDropdownListOfBanStatus(accountID){
    return "<select id='ban_status"+ accountID +"'>"
        +"<option value='true'>TRUE</option>"
        +"<option value='false'>FALSE</option></select>"
}


function saveAccountInfo(accountID){
    var url = "http://localhost:8080/rest/players/"+accountID;
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({
            'name': $('#input_name'+accountID).val(),
            'title': $('#input_title'+accountID).val(),
            'race': $('#race_id'+accountID).val(),
            'profession': $('#profession_id'+accountID).val(),
            'banned': $('#ban_status'+accountID).val()
        }),
        success: function(){
            visibilityTable(globalPageNumber);
        }
    })
}

function createAccount(){

    var url = "/rest/players";
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({
            'name': $('#input_name_new').val(),
            'title': $('#input_title_new').val(),
            'race': $('#select_race_new').val(),
            'profession': $('#select_profession_new').val(),
            'banned': $('#select_ban_status_new').val(),
            'level': $('#input_level_new').val(),
            'birthday': new Date($('#select_birthday_new').val()).getTime()
        }),
        success: function(){
            $('#input_name_new').val(''),
                $('#input_title_new').val(''),
                $('#select_race_new').val(''),
                $('#select_profession_new').val(''),
                $('#input_level_new').val(''),
                $('#select_birthday_new').val(''),
                $('#select_ban_status_new').val(''),
                visibilityTable(globalPageNumber);
        }
    })
}

// function getCurrentPageNumber(){
//     var currentPageNumber = 0;
//     $('button:parent(div)').each(function (){
//         if($(this).css('color') === 'rgb(255, 0, 0)'){
//             currentPageNumber = $(this).text();
//         }
//     })
//     return parseInt(currentPageNumber) - 1;
// }

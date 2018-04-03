( function () {
    "use strict";

    $(document).ready(function () {
        let moyenne;
        let players = [];
        let roles = {"Tank" : 0, "Heal" : 0, "DPS": 0};
        $.getJSON('players1.json', function(data) {
            $('#player_list')
                .append($('<tr />')
                    .append($('<td />').attr("id", "id").html('Numéro'))
                    .append($('<td />').attr("id", "playerID").html('Pseudo'))
                    .append($('<td />').attr("id", "lvl").html('Niveau'))
                    .append($('<td />').attr("id", "role").html('Rôle'))
                    .append($('<td />').attr("id", "premade").html('Equipe avec')));
            for(let i = 0; i < data.length ; i++){
                players.push({id : data[i].id, playerID : data[i].playerID,
                    lvl : data[i].HR, role : data[i].role, premade : data[i].premade  });
                roles = fillUpRoles(roles, data[i].role);

                let premade = '';

                for( let j = 0; j < data[i].premade.length ; j++ ){
                    premade += data[i].premade[j] + " ";
                }
                $('#player_list')
                    .append($('<tr />')
                        .append($('<td />').attr("id", "id").html(data[i].id))
                        .append($('<td />').attr("id", "playerID").html(data[i].playerID))
                        .append($('<td />').attr("id", "lvl").html(data[i].HR))
                        .append($('<td />').attr("id", "role").html(data[i].role))
                        .append($('<td />').attr("id", "premade").html(premade)));
            }
            moyenne = calculerMoyenne(players);
            console.log(roles);
            $('#button_match').click(function () {
                php_match(players, moyenne);
            })
            php_match(players, moyenne);
            //stats_match(players, moyenne);
        });
    });
})();


function fillUpRoles(roles, role) {
    switch(role){
        case "Tank" :
            roles.Tank++;
            break;
        case "Healer" :
            roles.Heal++;
            break;
        case "DPS" :
            roles.DPS++;
            break;
    }
    return roles;
}


function calculerMoyenne(players){
    let count = players.length;
    let lvls = 0;

    for(let i in players ){
        lvls += parseInt( players[i].lvl);
    }

    /*$('#player_list').children().each(function () {
        ++count;
        $(this).children().each(function () {
            if($(this).is("#lvl")){
                lvls += parseInt($(this).html());
            }
        })
    });*/

    let moy = parseFloat(lvls) / parseFloat(count);
    console.log('Moyenne : ' + moy );
    return moy;
}

function php_match(players, moyenne){
    $.ajax({
        url : 'match.php',
        method : 'POST',
        data: {players: players, moyenne: moyenne}
    })
        .done(function (teams) {
            $('#matchs').empty();
            for(let i = 0; i < teams.length ; i++){
                let moyteam = parseFloat( parseInt(teams[i][0].lvl) + parseInt(teams[i][1].lvl)
                    + parseInt(teams[i][2].lvl) + parseInt(teams[i][3].lvl)) / 4.0;
                //console.log(moyteam);

                $('#matchs')
                    .append($('<tr />')
                        .append($('<td />').html(i+1))
                        .append($('<td />').html(teams[i][0].playerID)
                            .css(teams[i][0].role == 'DPS' ? {'background-color' : 'rgba(0,0,255, 0.65)'} :
                                teams[i][0].role == 'Tank' ? {'background-color' : 'rgba(255,0,0, 0.65)'} : {'background-color' : 'rgba(0,255,0, 0.65)'} )
                            .css(  teams[i][0].premade != undefined ? {'color' : 'white'} : {}))
                        .append($('<td />').html(teams[i][1].playerID)
                            .css(teams[i][1].role == 'DPS' ? {'background-color' : 'rgba(0,0,255, 0.65)'} :
                                teams[i][1].role == 'Tank' ? {'background-color' : 'rgba(255,0,0, 0.65)'} : {'background-color' : 'rgba(0,255,0, 0.65)'} )
                            .css(  teams[i][1].premade != undefined ? {'color' : 'white'} : {}))
                        .append($('<td />').html(teams[i][2].playerID)
                            .css(teams[i][2].role == 'DPS' ? {'background-color' : 'rgba(0,0,255, 0.65)'} :
                                teams[i][2].role == 'Tank' ? {'background-color' : 'rgba(255,0,0, 0.65)'} : {'background-color' : 'rgba(0,255,0, 0.65)'} )
                            .css(  teams[i][2].premade != undefined ? {'color' : 'white'} : {}))
                        .append($('<td />').html(teams[i][3].playerID)
                            .css(teams[i][3].role == 'DPS' ? {'background-color' : 'rgba(0,0,255, 0.65)'} :
                                teams[i][3].role == 'Tank' ? {'background-color' : 'rgba(255,0,0, 0.65)'} : {'background-color' : 'rgba(0,255,0, 0.65)'} )
                            .css(  teams[i][3].premade != undefined ? {'color' : 'white'} : {}))
                        .append($('<td />').html(moyteam)));
            }
        })
}

function stats_match(players, moyenne){
    let nbfail = 0;
    let min = 10;
    let max = 2;
    let diff = 10;

    let nbfails = { fail : []};
    for(let j = 0;j < 5000; j++){
        $.ajax({
            url : 'match.php',
            method : 'POST',
            data: {players: players, moyenne: moyenne}
        })
            .done(function (teams) {
                for(let i = 0; i < teams.length ; i++){
                    let moyteam = parseFloat( parseInt(teams[i][0].lvl) + parseInt(teams[i][1].lvl)
                        + parseInt(teams[i][2].lvl) + parseInt(teams[i][3].lvl)) / 4.0;
                    //console.log(moyteam);
                    if(moyteam > moyenne + diff || moyteam < moyenne - diff){
                        //console.log(teams[i])
                        ++nbfail;
                    }
                }
                if(nbfails.fail[nbfail] == undefined)
                    nbfails.fail[nbfail] = 0;
                nbfails.fail[nbfail]++;


                if(nbfail > max){
                    console.log(nbfail);
                    max = nbfail
                }
                if(nbfail < min){
                    console.log(nbfail);
                    min = nbfail
                }
                nbfail = 0;
                if(j == 4999)
                    for(k = 1; k < nbfails.fail.length ; k++)
                        console.log(k + ' ' + nbfails.fail[k]);
            })
    }



}



function match(players) {
    let NotMatchedYet = players;
    let InTemporaryTeam = [];
    let TemporaryTeams = [];
    let AlreadyMatched = [];
    let Teams = [];

    let secu = 0;
    // Tant que tous les joueurs ne sont pas match
    while(AlreadyMatched.length < 100 && secu ++ < 100){
        console.log('Il en reste ' + NotMatchedYet.length + ' a placer' );

        //on parcours tous les joueurs non matchés
        for( let i = NotMatchedYet.length; i >= 0 ; i--){
            //console.log($.inArray(NotMatchedYet[i - 1], InTemporaryTeam ));
            // On esssais de les matcher
            // On les place dans des teams temporaires jusqu'à un maximum de 4
            if(NotMatchedYet[i - 1] !== undefined && $.inArray(NotMatchedYet[i - 1], InTemporaryTeam ) == -1){
                console.log('A');
                let placed = false;
                for( let j = 0; j < TemporaryTeams.length ; j++){
                    if(TemporaryTeams[j].length  == 2){
                        TemporaryTeams[j].push(NotMatchedYet[i - 1]);
                        TemporaryTeams[j].push(NotMatchedYet[i]);
                        InTemporaryTeam.push(NotMatchedYet[i - 1]);
                        InTemporaryTeam.push(NotMatchedYet[i]);
                        placed = true;
                    }
                }
                if(!placed){
                    TemporaryTeams.push([NotMatchedYet[i - 1], NotMatchedYet[i] ]);
                    InTemporaryTeam.push(NotMatchedYet[i - 1]);
                    InTemporaryTeam.push(NotMatchedYet[i]);
                }
            }
        }

        // On parcours les teams temporaires
        for( let i = TemporaryTeams.length; i > 0 ; i--){
            // Si la team est full
            console.log(i);
            if(TemporaryTeams[i -1].length == 4){
                //On la met dans les teams finales
                Teams.push(TemporaryTeams[i]);

                // On parcours les joueurs de cette team
                for(let j in TemporaryTeams[i]){
                    let index = NotMatchedYet.indexOf(j);
                    if(index > -1){
                        // On supprime chaque joueur des joueurs pas encore match
                        NotMatchedYet.splice(index, 1);
                        // Et on les ajoute à ceux déjà match
                        AlreadyMatched.push(j);
                    }
                }

                // On la supprime des teams temporaires
                TemporaryTeams.splice(i, 1);
            }
        }
    }
    return Teams;
}

function afficherJoueurs() {
    $('#matchs').fadeOut(500, function () {
        $('#player_list').fadeIn(500);
    });

    $('#button_player').fadeOut(500, function () {
        $('#button_matchs').fadeIn(500);
    });

    $('#indic').fadeOut(500, function () {
        $('#indic').html('Liste des joueurs');
        $('#indic').fadeIn(500);
    })
    $('#button_match').fadeOut(500);
}

function afficherMatchs() {
    $('#player_list').fadeOut(500, function () {
        $('#matchs').fadeIn(500);
    });

    $('#button_matchs').fadeOut(500, function () {
        $('#button_match').fadeIn(500);
        $('#button_player').fadeIn(500);
    });

    $('#indic').fadeOut(500, function () {
        $('#indic').html('Liste des matchs');
        $('#indic').fadeIn(500);
    })
}
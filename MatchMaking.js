( function () {
    "use strict";

    $(document).ready(function () {
        let moyenne;
        let players = [];
        let roles = {"Tank" : 0, "Heal" : 0, "DPS": 0};
        $.getJSON('data.json', function(data) {
            for(let i = 0; i < data.length ; i++){
                players.push({id : data[i].id, playerID : data[i].playerID,
                    lvl : data[i].lvl, role : data[i].role });
                roles = fillUpRoles(roles, data[i].role);
                $('#player_list')
                    .append($('<tr />')
                        .append($('<td />').attr("id", "id").html(data[i].id))
                        .append($('<td />').attr("id", "playerID").html(data[i].playerID))
                        .append($('<td />').attr("id", "lvl").html(data[i].lvl))
                        .append($('<td />').attr("id", "role").html(data[i].role))
                        .append($('<td />').attr("id", "premade").html(data[i].premade)));
            }
            moyenne = calculerMoyenne(players);
            console.log(roles);
            php_match(players);

            console.log('YAY');

        });
    });
})();

function fillUpRoles(roles, role) {
    switch(role){
        case "Tank" :
            roles.Tank++;
            break;
        case "Heal" :
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

function php_match(players){
    $.ajax({
        url : 'match.php',
        method : 'POST',
        data : { 'players':players}
    })
        .done(function (teams) {
            for(let i = 0; i < teams.length ; i++){
                $('#matchs')
                    .append($('<tr />')
                        .append($('<td />').html(teams[i][0].playerID))
                        .append($('<td />').html(teams[i][1].playerID))
                        .append($('<td />').html(teams[i][2].playerID))
                        .append($('<td />').html(teams[i][3].playerID)));
                console.log(teams[i])
            }
        })
}

function random_match(players){
    let NotMatchedYet = players;
    let Teams = [];

    let secu = 0;
    // Tant que tous les joueurs ne sont pas match
    while(NotMatchedYet.length > 0 && secu ++ < 100) {
        console.log('Il en reste ' + NotMatchedYet.length + ' a placer');

        for( let i = 0; i < NotMatchedYet.length;  i+=4){
            let tab = [NotMatchedYet[i], NotMatchedYet[i+1], NotMatchedYet[i+2], NotMatchedYet[i+3]];
            Teams.push(tab);
        }
        NotMatchedYet = [];
    }
    console.log('Job done');
    return Teams;
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
function testAddTank(number) {
    let roles = {"Tank": number, "DPS" : 56, "Healer" : 5};
    let rolesfn = fillUpRoles(roles, "Tank");
    if (rolesfn.Tank === number+1){
        return true;
    }
    return false;
}

function testAddDPS(number) {
    let roles = {"Tank": 5, "DPS" : number, "Healer" : 5};
    let rolesfn = fillUpRoles(roles, "DPS");
    if (rolesfn.DPS === number+1){
        return true;
    }
    return false;
}

function testAddHeal(number) {
    let roles = {"Tank": 5, "DPS" : 56, "Healer" : number};
    let rolesfn = fillUpRoles(roles, "Healer");
    if (rolesfn.Heal === number+1){
        return true;
    }
    return false;
}

function testAddOn99lvl() {
    for (let i = 0 ; i<99 ; ++i){
        if (testAddTank(i) === false) return false;
        if (testAddDPS(i) === false) return false;
        if (testAddHeal(i) === false) return false;
    }
    return true;
}

function testMoyenne() {
    $.getJSON("players.json", function (data) {
        if (calculerMoyenne(data) === 30) return true;
        return false;
    })
}

function testOnlyValidRoles() {
    $.getJSON("players.json", function (data) {
        if (data.role === "Tank" || data.role === "DPS" || data.role === "Healer") return true;
        return false;
    })
}

function verifNombreTeams() {
    let cpt = 0;
    $('#matchs').find('tr').each(function () {
        ++cpt;
    });
    if (cpt !== 25) return false;
    return true;

}

function verifNombreJoueurs() {
    $.getJSON("../players.json", function (data) {
        if (data.length === 100) return true;
        return false
    })
}

function notSamePlayers() {
    let tab = [];
    $('#matchs').find('td').each(function () {
        if ($.inArray( $(this).text(), tab ) === -1) {
            tab.push($(this).text());
        } else{
            return false;
        }
    });
}

function lvlBetween1and100() {
    $.getJSON("players.json", function (data) {
        if (data.lvl > 100 || data.lvl < 1) return false;
        return true;
    })
}

function verif4PlayersPerTeam() {
    let cpt;
    $('#matchs').find('tr').each(function () {
        cpt = 0;
        $(this).find('td').each(function () {
            ++cpt;
        });
        if (cpt !== 4) return false;
    });
    return true;
}
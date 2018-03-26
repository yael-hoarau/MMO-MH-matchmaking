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
    $.ajax({
        url : 'match.php',
        method : 'POST',
        data : { 'players':players}
    })
        .done(function (teams) {
            if (teams.length === 25) return true;
            return false
        })
}
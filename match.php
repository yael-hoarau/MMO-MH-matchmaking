<?php
/**
 * Created by PhpStorm.
 * User: Yaël
 * Date: 25/03/2018
 * Time: 09:01
 */

$players = $_POST['players'];
$moyenne = (float) $_POST['moyenne'];
$notMatchedYet = $players;
$notMatchedYetDps = array();
$notMatchedYetHeal = array();
$notMatchedYetTank = array();
$inTempTeams = array();
$inTeams = array();
$tempTeams = array();
$teams = array();

$secu = 0;


foreach ($notMatchedYet as $i => $row){

    if( !isset($notMatchedYet[$i]["premade"]) || in_array($notMatchedYet[$i], $inTempTeams))
        continue;

    $tab = array();
    $tab[] = $notMatchedYet[$i];
    $inTempTeams[] = $notMatchedYet[$i];

    foreach($notMatchedYet[$i]["premade"] as $j => $ro){
        foreach($notMatchedYet as $k => $r){
            //var_dump($notMatchedYet[$k]);
            if($notMatchedYet[$k]['id'] == $notMatchedYet[$i]["premade"][$j] ){
                $tab[] = $notMatchedYet[$k];
                $inTempTeams[] = $notMatchedYet[$k];

                break;
            }
        }
        //$tab[] = $notMatchedYet[$i]["premade"][$j];
        //$inTempTeams[] = $notMatchedYet[$i]["premade"][$j];
    }
    $tempTeams[] = $tab;
}

//var_dump($tempTeams);

foreach($tempTeams as $i => $row){

    if(count($tempTeams[$i]) == 4){
        foreach($tempTeams[$i] as $j => $r){
            array_splice($notMatchedYet ,array_search($tempTeams[$i][$j],$notMatchedYet), 1);
            $inTeams[] = $tempTeams[$i][$j];
        }
        $teams[] = $tempTeams[$i];
    }
    else {
        $roles = array("Tank", "Healer", "DPS", "DPS");
        $doubles = array();
        foreach ($tempTeams[$i] as $j => $r){
            array_splice($notMatchedYet, array_search($tempTeams[$i][$j], $notMatchedYet), 1);
            $inTeams[] = $tempTeams[$i][$j];
            if(!isset($tempTeams[$i][$j]["role"]))continue;
            if(in_array($tempTeams[$i][$j]['role'], $roles))
                array_splice($roles, array_search($tempTeams[$i][$j]["role"], $roles), 1);
            else
                $doubles[] = $tempTeams[$i][$j]["role"];
        }
        foreach($roles as $k){
            if(count($tempTeams[$i]) == 4 || in_array($k, $doubles))
                break;

            do{
                if($secu++ >= 100) break;
                $rand = mt_rand(0, count($notMatchedYet) -1);
            }while($notMatchedYet[$rand]["role"] != $k || isset($notMatchedYet[$rand]["premade"])  );

            $tempTeams[$i][] = $notMatchedYet[$rand];
            $inTeams[] = $notMatchedYet[$rand];
            array_splice($notMatchedYet, $rand, 1);
        }
        if(count($tempTeams[$i]) != 4){
            echo 'ET MERDE';
            var_dump($tempTeams[$i]);
        }
        else{
            $teams[] = $tempTeams[$i];
        }
    }
}
//var_dump($teams);



foreach ($notMatchedYet as $i => $row){
    if($notMatchedYet[$i]["role"] == "DPS"){
        $notMatchedYetDps[] = $notMatchedYet[$i];
    }
    if($notMatchedYet[$i]["role"] == "Healer"){
        $notMatchedYetHeal[] = $notMatchedYet[$i];
    }
    if($notMatchedYet[$i]["role"] == "Tank"){
        $notMatchedYetTank[] = $notMatchedYet[$i];
    }
}
//echo count($notMatchedYetTank) . ' ' . count($notMatchedYetHeal) . ' ' . count($notMatchedYetDps) . "\r\n";


while(count($notMatchedYet) > 0){

    foreach ($notMatchedYet as $i => $row) {
        //echo count($notMatchedYetTank) . ' ' . count($notMatchedYetHeal) . ' ' . count($notMatchedYetDps) . ' | ' ;

        if(count($notMatchedYet) <= 0 /*|| mt_rand(0, $i) % 5 == 0*/) break;
        if (in_array($notMatchedYet[$i], $inTeams)) {
            //unset($notMatchedYet[$i]);
            continue;
        }

        $roles = array("Tank", "Healer", "DPS", "DPS");
        if(in_array($notMatchedYet[$i], $notMatchedYetDps))
            array_splice($notMatchedYetDps, array_search($notMatchedYet[$i]["role"],$notMatchedYetDps), 1);
        if(in_array($notMatchedYet[$i], $notMatchedYetHeal))
            array_splice($notMatchedYetHeal, array_search($notMatchedYet[$i]["role"],$notMatchedYetHeal), 1);
        if(in_array($notMatchedYet[$i], $notMatchedYetTank))
            array_splice($notMatchedYetTank, array_search($notMatchedYet[$i]["role"],$notMatchedYetTank), 1);

        array_splice($roles, array_search($notMatchedYet[$i]["role"], $roles), 1);

        $tab = array();
        $tab[] = $notMatchedYet[$i];
        $inTeams[] = $notMatchedYet[$i];
        //unset($notMatchedYet[$i]);
        //echo $notMatchedYet[$i]["role"] . ' ! ';

        if(count($notMatchedYetTank) == 0 || count($notMatchedYetHeal) == 0 || count($notMatchedYetDps) == 0 ){
            for($j = 1; $j < 4; $j++ ){
                if(count($tab) == 4) break;
                if(count($notMatchedYetTank) > 0){
                    $tab[] = $notMatchedYetTank[0];
                    $inTeams[] = $notMatchedYet[array_search($notMatchedYetTank[0], $notMatchedYet)];
                    array_splice($notMatchedYetTank, 0, 1);
                }
                if(count($tab) == 4) break;
                if(count($notMatchedYetHeal) > 0){
                    $tab[] = $notMatchedYetHeal[0];
                    $inTeams[] = $notMatchedYet[array_search($notMatchedYetHeal[0], $notMatchedYet)];
                    array_splice($notMatchedYetHeal, 0, 1);
                }
                if(count($tab) == 4) break;
                if(count($notMatchedYetDps) > 0){
                    $tab[] = $notMatchedYetDps[0];
                    $inTeams[] = $notMatchedYet[array_search($notMatchedYetDps[0], $notMatchedYet)];
                    array_splice($notMatchedYetDps, 0, 1);
                }
            }
            $roles = array();

            //echo count($notMatchedYetTank) . ' ' . count($notMatchedYetHeal) . ' ' . count($notMatchedYetDps);
            //exit();
        }
        $lvls = 0;
        foreach($tab as $j => $ro){
            $lvls += (int) $tab[$j]['lvl'];
        }
        $moyteam = $lvls / count($tab);

        foreach($roles as $k){
            $sec = 0;
            $diff = 10;
            //echo $i . "\r\n";
            if($k == 'DPS'){
                do{
                    if($sec++ >= 1000){
                        $sec = 0;
                        break;
                    }
                    $randDPS = mt_rand(0, count($notMatchedYetDps) -1);
                    $newmoy = ($moyteam + (int) $notMatchedYetDps[$randDPS]['lvl']) / 2.0;
                }while( $moyenne - $diff > $newmoy || $moyenne + $diff < $newmoy );

                $rand = array_search($notMatchedYetDps[$randDPS], $notMatchedYet );
                $tab[] = $notMatchedYet[$rand];
                $moyteam = ($moyteam + (int) $notMatchedYetDps[$randDPS]['lvl']) / 2.0;
                $inTeams[] = $notMatchedYet[$rand];
                array_splice($notMatchedYetDps, $randDPS, 1);
            }
            if($k == 'Tank'){
                do{
                    if($sec++ >= 1000){
                        $sec = 0;
                        break;
                    }
                    $randTank = mt_rand(0, count($notMatchedYetTank) -1);
                    $newmoy = ($moyteam + (int) $notMatchedYetTank[$randTank]['lvl']) / 2.0;
                }while( $moyenne - $diff > $newmoy || $moyenne + $diff < $newmoy );
                $rand = array_search($notMatchedYetTank[$randTank], $notMatchedYet );
                $tab[] = $notMatchedYet[$rand];
                $moyteam = ($moyteam + (int) $notMatchedYetTank[$randTank]['lvl']) / 2.0;
                $inTeams[] = $notMatchedYet[$rand];
                array_splice($notMatchedYetTank, $randTank, 1);
            }
            if($k == 'Healer'){
                do{
                    if($sec++ >= 1000){
                        $sec = 0;
                        break;
                    }
                    $randHeal = mt_rand(0, count($notMatchedYetHeal) -1);
                    $newmoy = ($moyteam + (int) $notMatchedYetHeal[$randHeal]['lvl']) / 2.0;
                }while( $moyenne - $diff > $newmoy || $moyenne + $diff < $newmoy );
                $rand = array_search($notMatchedYetHeal[$randHeal], $notMatchedYet );
                $tab[] = $notMatchedYet[$rand];
                $moyteam = ($moyteam + (int) $notMatchedYetHeal[$randHeal]['lvl']) / 2.0;
                $inTeams[] = $notMatchedYet[$rand];
                array_splice($notMatchedYetHeal, $randHeal, 1);
            }
        }


       /* do{
            if(count($notMatchedYetDps) == 1){
                echo 'AH';
                exit();
            }
            $randDPS1 = mt_rand(0, count($notMatchedYetDps) -1);
        } while( $randDPS1 == $randDPS); */
        //var_dump($tab);
        $teams[] = $tab;
    }

    foreach($inTeams as $i => $row){
        array_splice($notMatchedYet ,array_search($inTeams[$i],$notMatchedYet), 1);
    }
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode($teams);
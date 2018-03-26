<?php
/**
 * Created by PhpStorm.
 * User: Yaël
 * Date: 25/03/2018
 * Time: 09:01
 */

$players = $_POST['players'];
$notMatchedYet = $players;
$inTeams = array();
$teams = array();

while(count($notMatchedYet) > 0){
    foreach ($notMatchedYet as $i => $row) {

        if(count($notMatchedYet) <= 0 /*|| mt_rand(0, $i) % 5 == 0*/) break;
        if (in_array($notMatchedYet[$i], $inTeams)) {
            //unset($notMatchedYet[$i]);
            continue;
        }

        $tab = array();
        $tab[] = $notMatchedYet[$i];
        $inTeams[] = $notMatchedYet[$i];
        //unset($notMatchedYet[$i]);

        for($j = 0; $j < 3; $j++){
            if(count($notMatchedYet) <= 0) break;
            do{
                $rand = mt_rand(0, count($notMatchedYet) -1);
            } while( in_array($notMatchedYet[$rand], $inTeams) );
            $tab[] = $notMatchedYet[$rand];
            $inTeams[] = $notMatchedYet[$rand];
            //unset($notMatchedYet[$rand]);
        }
        $teams[] = $tab;
    }

    foreach($inTeams as $i => $row){
        unset($notMatchedYet[array_search($inTeams[$i],$notMatchedYet)]);
    }
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode($teams);
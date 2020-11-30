<?php
    //Récupération des coordonnées de la map d'accueil
    $list_communes=[];
    $request = $_POST["request"];
    if ($request){
        try{
            $conn = new PDO('pgsql:host=localhost;port=5432;dbname=acilim;','postgres','martinez');
            if ($conn){
                $request=$request;
                $result = $conn->prepare($request);
                $result -> execute();
                while($data = $result->fetch()){
                    array_push($list_communes,[$data[0],$data[1],$data[2],$data[3]]);
                }
                echo(json_encode($list_communes));
            }    
        }catch(PDOException $e){
            var_dump($e->getMessage());
        }
    }
?>
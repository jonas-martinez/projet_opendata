function init() {
    
    // On initialise la latitude et la longitude de Paris (centre de la carte)
    // Utilisé si pas de geolocalisation de la part de l'utilisateur
    var start_location = [48.852969,2.349903];
    var start_zoom = 9
    var macarte = null;
    // On récupère la localisation de l'utilisateur s'il accepte pour qu'elle soit le centre de la carte 
    if(navigator.geolocation){
        function setPosition(pos){
            if (!window.location.href.includes("?")){
                window.location.href+="?lat="+pos.coords.latitude+"&long="+pos.coords.longitude
            }
        }
        // Si l'utilisateur donne la position on modifie 'start_location' pour sa position
        if (window.location.search){
            navigator.geolocation.getCurrentPosition(setPosition)
            new_location = window.location.search.replace("?","").replace("lat=","").replace("long=","").split("&")
            start_location=[new_location[0],new_location[1].replace("?","")]
            L.map('map').setView(start_location)
        }
    }

    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    macarte = L.map('map').setView(start_location,start_zoom);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
    refreshMap(macarte)

    // On écoute les évenements de déplacement de la carte (le zoom est un mouvement)
    macarte.on({'moveend' : moveend,'movestart':movestart});
    
    // Fonction d'ctualisation des villes à la fin du déplacement de la carte
    function moveend(e){
        refreshMap(macarte);
    }
    // Fonction permettant de supprimer tous les layers de la carte dès qu'elle bouge
    function movestart(e){
        $i=0;
        macarte.eachLayer(function(layer){
            if($i!=0){
                macarte.removeLayer(layer);
            }
            $i+=1;

        })
    }

}


// Refresh entièrement la map (visible) à chaque fois qu'elle bouge (même un tout petit peu)
function refreshMap(map){
    // On charge les communes uniquement si le zoom de la carte est >= 9
    if (map.getZoom()>=9){
        var bounds = map.getBounds();
        var coord_map = [[bounds._southWest.lat,bounds._northEast.lng],[bounds._northEast.lat,bounds._northEast.lng],[bounds._northEast.lat,bounds._southWest.lng],[bounds._southWest.lat,bounds._southWest.lng]];
        // On ne charge plus les ville de Paris, Lyon et Marseille (les villes qui ont des arrondissement) à partir d'un certain zoom
        if(map.getZoom()>=10.5){
            var request = "select nom_commune, ST_AsGeoJSON(contours, 9, 4), code_insee from communes where nom_commune!=\'Lyon\' and nom_commune!=\'Marseille\' and nom_commune!=\'Paris\' and ST_Intersects(contours::geography, St_GeomFromText(\'POLYGON(("+coord_map[0][1]+" "+coord_map[0][0]+","+coord_map[1][1]+" "+coord_map[1][0]+","+coord_map[2][1]+" "+coord_map[2][0]+","+coord_map[3][1]+" "+coord_map[3][0]+","+coord_map[0][1]+" "+coord_map[0][0]+"))\'));";
        }else{
            var request = "select nom_commune, ST_AsGeoJSON(contours, 9, 4), code_insee from communes where ST_Intersects(contours::geography, St_GeomFromText(\'POLYGON(("+coord_map[0][1]+" "+coord_map[0][0]+","+coord_map[1][1]+" "+coord_map[1][0]+","+coord_map[2][1]+" "+coord_map[2][0]+","+coord_map[3][1]+" "+coord_map[3][0]+","+coord_map[0][1]+" "+coord_map[0][0]+"))\'));";
        }
        // REQUETE AJAX pour récupérer les contours des communes
        $.post("php/request.php",
            {'request':request}, 
            function(data){
                result = JSON.parse(data);
                $.each(result,function(_, data){
                    commune = JSON.parse(data[1])
                    commune.nom=data[0]
                    commune.INSEE = data[2]
                    oneCommune = L.geoJSON(commune,{
                        style:function(feature){
                            return{
                                fillOpacity:0,
                                color:'rgba(0,0,0,0)'
                            };
                        },
                        onEachFeature: function(feature,layer){
                            layer.on({
                                'mousemove':communeLayoutMouseOver,
                                'mouseout': communeReset,
                                'click':communeClick
                            })
                        }
                    });
                    oneCommune.addTo(map);
                });
        });
    }
}
// Fonction pour surligner la commune au survol
function communeLayoutMouseOver(e){
    e.target.setStyle({
        color:'#a8a8a8',
        fillOpacity:0.4,
        weight: 5
    })
}
// Fonction pour réinitialiser le style des communes (layers)
function communeReset(e){
    e.target.setStyle({
        color:'rgba(0,0,0,0)',
        fillOpacity:0
    })
}

function communeClick(e){
    var nom_ville = e.target.feature.geometry.nom
    var insee = e.target.feature.geometry.INSEE
    document.getElementById("nomVille").innerHTML=nom_ville
    document.getElementById("habitantsParAnnee").lastElementChild.innerHTML=""
    document.getElementById("prixMetreCarre").lastElementChild.innerHTML=""
    document.getElementById("nbConstruction").lastElementChild.innerHTML=""
    // Il faut récupérer l'année choisis par l'utilisateur
    
    let request = "select pr.annee, prixm2, population, c.nombre_constructions from prixm2 pr, population_annee pop, constructions c where pr.code_insee=\'"+insee+"\' and pop.code_insee=\'"+insee+"\' and c.code_insee=\'"+insee+"\' and pr.annee=pop.annee order by pr.annee asc;"
    // and pr.annee="+annee+" and pop.annee="+annee+";";
    $.post("php/request.php",
        {"request":request},
        function(data){
            let result = JSON.parse(data)
            // On modifie le corps html pour mettre à jours la div concernée

            if ( result[result.length-1] != null && result[result.length-1][2] != null){
                var nbHabitants = result[result.length-1][2]
            }else{
                var nbHabitants = "Inconnu"
            }
            if (result[result.length-1] != null && result[result.length-1][1]!=null){
                var prix = result[result.length-1][1]+" €"
            }else{
                var prix = "Inconnu"
            }
            if (result[result.length-1] != null && result[result.length-1][3]!=null){
                var constructions = result[result.length-1][3]
            }else{
                var constructions = "Inconnu"
            }
            if (result[result.length-1]!=null && result[result.length-1][0]!=null)
            {
                let annee=result[result.length-1][0]
            }
            document.getElementById("nomVille").innerHTML=nom_ville
            document.getElementById("nbConstruction").lastElementChild.innerHTML=constructions
            var labels=[]
            var prices = []
            var population = []
            result.forEach(function(item,index){
                if(item[1]!=null){
                    labels.push(item[0])
                    prices.push(item[1])
                    population.push(item[2])
                }
            })
            setChart(labels,prices,"priceChart")
            setChart(labels,population,"populationChart")
        }
    )
}


function setChart(labels,data, element){
    var ctx = document.getElementById(element).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Courbe des prix de l'immobilier",
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}

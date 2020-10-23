var start_location = [48.852969,2.349903];
function init() {
    
    // On initialise la latitude et la longitude de Paris (centre de la carte)
    
    var start_zoom = 9
    var macarte = null;
    // On récupère la localisation de l'utilisateur s'il accepte pour qu'elle soit le centre de la carte
    // NON FONCTIONNEL
    if(navigator.geolocation){
        function setPosition(pos){
            if (!window.location.href.includes("?")){
                window.location.href+="?lat="+pos.coords.latitude+"&long="+pos.coords.longitude
            }
        }
        navigator.geolocation.getCurrentPosition(setPosition)
        new_location = window.location.search.replace("?","").replace("lat=","").replace("long=","").split("&")
        start_location=[new_location[0],new_location[1].replace("?","")]
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
    
    //var marker = L.marker([lat, lon]).addTo(macarte);
    // Coordonnées de la carte au chargement
    
    

    // Actualisation des villes 
    function moveend(e){
        refreshMap(macarte);
    }
    function movestart(e){
        $i=0;
        macarte.eachLayer(function(layer){
            if($i!=0){
                macarte.removeLayer(layer);
            }
            $i+=1;

        })
    }
    macarte.on({'moveend' : moveend,'movestart':movestart});
}

function refreshMap(map){
    if (map.getZoom()>8){
        var bounds = map.getBounds();
        var coord_map = [[bounds._southWest.lat,bounds._northEast.lng],[bounds._northEast.lat,bounds._northEast.lng],[bounds._northEast.lat,bounds._southWest.lng],[bounds._southWest.lat,bounds._southWest.lng]];
        var request = "select nom_commune, ST_AsGeoJSON(contours, 9, 4), code_insee from communes where ST_Intersects(ST_SetSRID(contours,4326)::geography, St_GeomFromText(\'POLYGON(("+coord_map[0][1]+" "+coord_map[0][0]+","+coord_map[1][1]+" "+coord_map[1][0]+","+coord_map[2][1]+" "+coord_map[2][0]+","+coord_map[3][1]+" "+coord_map[3][0]+","+coord_map[0][1]+" "+coord_map[0][0]+"))\'));";
        $.post("php/request.php",
            {'request':request}, 
            function(data){
                result = JSON.parse(data);
                communes=[];
                $.each(result,function(_, data){
                    commune = JSON.parse(data[1])
                    commune.INSEE = data[2]
                    //console.log(commune)
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
                    // Info à afficher dans la popup au clic sur la commune
                    oneCommune.bindPopup(data[0]);
                    oneCommune.addTo(map);
                    communes.push(oneCommune);
                });
        });
    }
}
function communeLayoutMouseOver(e){
    e.target.setStyle({
        color:'#a8a8a8',
        fillOpacity:0.4,
        weight: 6
    })
}
function communeReset(e){
    e.target.setStyle({
        color:'rgba(0,0,0,0)',
        fillOpacity:0
    })
}

function communeClick(e){
    let insee = e.target.feature.geometry.INSEE
    var annee=2019
    let request = "select prixm2, population from prixm2 pr, pop_annee as pop where pr.code_insee=\'"+insee+"\' and pop.code_insee=\'"+insee+"\' and pr.annee="+annee+" and pop.annee="+annee+";";
    console.log(request)
    $.post("php/request.php",
        {"request":request},
        function(data){
            let result = JSON.parse(data)
            // On modifie le corps html pour mettre à jours la div concernée
            console.log(result)
        }
    )
}
var start_location = [48.852969,2.349903]

function init() {
    
    setInformations('la Rochelle', 1998, 10000, 250, 69);

    // On initialise la latitude et la longitude de Paris (centre de la carte)
    var start_zoom = 9
    var macarte = null;
    // On récupère la localisation de l'utilisateur s'il accepte pour qu'elle soit le centre de la carte 
    // NON FONCTIONNEL
    if(navigator.geolocation){
        function setPosition(pos){
            // console.log(start_location);
            start_location[0]=pos.coords.latitude;
            start_location[1]=pos.coords.longitude;
            // console.log(start_location);
            return [pos.coords.latitude, pos.coords.longitude]
        }
        navigator.geolocation.getCurrentPosition(setPosition)
    }
    console.log(start_location);

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
        var request = "select nom_commune, ST_AsGeoJSON(contours, 9, 4) from communes where ST_Intersects(ST_SetSRID(contours,4326)::geography, St_GeomFromText(\'POLYGON(("+coord_map[0][1]+" "+coord_map[0][0]+","+coord_map[1][1]+" "+coord_map[1][0]+","+coord_map[2][1]+" "+coord_map[2][0]+","+coord_map[3][1]+" "+coord_map[3][0]+","+coord_map[0][1]+" "+coord_map[0][0]+"))\'));";
        $.post("php/request.php",
            {'request':request}, 
            function(data){
                result = JSON.parse(data);
                communes=[];
                $.each(result,function(_, data){
                    oneCommune = L.geoJSON(JSON.parse(data[1]),{
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
    //console.log(e.target.feature.geometry.coordinates[0]);
    let coordinates =e.target.feature.geometry.coordinates[0][0]
    let length_array=coordinates.length;
    let texte="ST_GeomFromText(\'POLYGON(("+coordinates[0][0]+" "+coordinates[0][1];
    for(let i=1;i<length_array;i++){
        texte+=","+coordinates[i][0]+" "+coordinates[i][1];
    }
    texte+="))\')";
    console.log(texte);
    let request = "select ";
    // AJAX REQUETE
    // MODIFIER POPUP ? 
}

function setInformations(name, year, pop, priceM2, constructions) {
    $("#info").find("#nomVille").innerHTML = name;
    $("#info").find("#year").innerHTML = year;
    $("#info").find("#habitantsParAnnee").find("p").innerHTML = pop;
    $("#info").find("#prixMetreCarre").find("p").innerHTML = priceM2;
    $("#info").find("#nbConstruction").find("p").innerHTML = constructions;
}
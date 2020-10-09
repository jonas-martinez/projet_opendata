var map; //complex object of type OpenLayers.Map

function init() {
    map = new OpenLayers.Map("map", {
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.Attribution()],
        units: 'm',
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326")
    });

    // Define the map layer
    // Here we use a predefined layer that will be kept up to date with URL changes
    layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    map.addLayer(layerMapnik);
    layerCycleMap = new OpenLayers.Layer.OSM.CycleMap("CycleMap");
    map.addLayer(layerCycleMap);
    layerMarkers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(layerMarkers);

    // Add a Layer with Marker
    var size = new OpenLayers.Size(21, 25);
    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
    var icon = new OpenLayers.Icon('https://www.openstreetmap.org/openlayers/img/marker.png', size, offset);
    layerMarkers.addMarker(new OpenLayers.Marker(lonLat, icon));

    // Start position for the map (hardcoded here for simplicity,
    // but maybe you want to get this from the URL params)
    var lat = 47.496792;
    var lon = 7.571726;
    var zoom = 13;
    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
    map.setCenter(lonLat, zoom);
}
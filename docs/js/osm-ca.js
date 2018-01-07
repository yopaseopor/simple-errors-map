var map = L.map('map', {
  'center': [40.622, 1.622],
  'zoom': 7,
  'layers': [
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      'attribution': "Les dades del mapa són &copy; dels col·laboradors d\'<a href='https://openstreetmap.org/' target='_ blank'>OpenStreetMap</a>"
      +"<br>Data del mapa: 05/01/2018 14:50"
    })
  ]
});

map.attributionControl.setPrefix('');

var controlLayers = L.control.layers().addTo(map);


var overlays = [
  {desc: 'accesibilitat', url: './geojson/elagem.geojson', query: 'ufv', active: 1},
  {desc: 'L·L', url: './geojson/zelagem.geojson', query: 'ufv', active: 1},
  {desc: 'Vies es', url: './geojson/vies-es.geojson', query: 'ufw', active: 1}
];

function addDataToMap(data, map, desc, query, active){
   var geojsonLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            var rawid = feature.id
            var ideditor = rawid.replace("/", "=")
            var josmeditor = rawid.replace("/", "")

            var popupText = "Consulta: " + desc + " (<a href='https://overpass-turbo.eu/s/" + query + "' target='_blank'>Overpass-turbo</a>)"
                + "<br>Nom: " + feature.properties.name
                + "<br><a href='http://www.openstreetmap.org/" + feature.id + "' target='_blank'>Enllaç a OSM</a>"
                + "<br><a href='https://www.openstreetmap.org/edit?editor=id&" + ideditor + "' target='_blank'>Edita a OSM (iD Editor)</a>"
                + "<br><a href='http://127.0.0.1:8111/load_object?new_layer=true&objects=" + josmeditor + "' target='_blank'>Edita amb el JOSM</a>";
            layer.bindPopup(popupText); }
 

       });

    if ( active ) {geojsonLayer.addTo(map);};

    controlLayers.addOverlay(geojsonLayer, desc);
};


var i=0;
for (i=0; i < overlays.length; i++) {

 (function(i) {
   $.getJSON(overlays[i].url, function(data) { addDataToMap(data, map, overlays[i].desc, overlays[i].query, overlays[i].active) });
  })(i);

}






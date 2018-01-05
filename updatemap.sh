#!/bin/bash

inputfile='./geojson.csv'

osmdir='./osm/'
ovqldir='./ovql/'

geojsondir='./geojson/'

htmldir='./html/'

wwwdir='~/public_html/coses/osm/'

overlays=''

dt=$(date '+%d/%m/%Y %H:%M');
dt=${dt//\//\\/}

echo "$dt"

while IFS=',' read desc file query active queue
do
  
  overlays="$overlays  {desc: '${desc//\//\\/}', url: '${geojsondir//\//\\/}$file.geojson', query: '$query', active: $active},"$'\\n'

  wget -O "${osmdir}$file.osm" --post-file="${ovqldir}$file.ovql" "http://overpass-api.de/api/interpreter"
  osmtogeojson "${osmdir}$file.osm" > "${geojsondir}$file.geojson"
done < $inputfile

overlays=${overlays::-3}

sed -e "s/%%overlays%%/${overlays}/" -e "s/%%date%%/${dt}/" ./osm-ca.js.tmpl > "${htmldir}js/osm-ca.js"

cp ${geojsondir}* ${htmldir}geojson

cp -R ${htmldir}* ~/public_html/coses/osm


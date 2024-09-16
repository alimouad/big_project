window.onload = function () {
    ckechdata();
};


var baseMaps;
var overlays;
var marker;
var csvLayer;

var map = L.map('map', {
    crs: L.CRS.EPSG3857
}).setView([30.386, -3.319], 5); //
lyrGoogleHybrid = L.tileLayer('http://mts2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 25,
    maxNativeZoom: 20
})
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);


baseMaps = {
    "Google-sat": googleSat,
    "Google-Hybrid": lyrGoogleHybrid
};
var resolutions = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
    1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1];
const crs = new L.Proj.CRS(
    "EPSG:26191",
    "+proj=lcc +lat_1=33.3 +lat_0=33.3 +lon_0=-5.4 +k_0=0.999625769 +x_0=500000 +y_0=300000 +a=6378249.2+b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs", {
    // // "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs", {
    origin: [336537.75, 137000.85],
    // resolutions: resolutions,
});
const crs2 = new L.Proj.CRS(
    "EPSG:26192",
    "+proj=lcc +lat_1=29.7 + lat_0=29.7 + lon_0=-5.4 + k_0=0.9996155960000001 + x_0=500000 + y_0=300000 + a=6378249.2 + b=6356515 + towgs84=31, 146, 47, 0, 0, 0, 0 + units=m + no_defs", {
    // // "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs", {
    origin: [336537.75, 137000.85],
    resolutions: resolutions,
});
const crs3 = new L.Proj.CRS(
    "EPSG:26194",
    "+proj=lcc +lat_1=26.1 +lat_0=26.1 +lon_0=-5.4 +k_0=0.999616304 +x_0=1200000 +y_0=400000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs ", {
    // // "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs", {
    origin: [336537.75, 137000.85],
    resolutions: resolutions,

});
const crs4 = new L.Proj.CRS(
    "EPSG:26195",
    "+proj=lcc +lat_1=22.5 +lat_0=22.5 +lon_0=-5.4 +k_0=0.999616437 +x_0=1500000 +y_0=400000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs ", {
    // // "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs", {
    origin: [336537.75, 137000.85],
    resolutions: resolutions,
});
var myCRS = new L.Proj.CRS("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs +type=crs");


overlays = L.layerGroup()

layerControl = L.control.layers(baseMaps).setPosition('topright').addTo(map);

L.Control.geocoder({
    position: 'topright'
}).addTo(map);



function saveSelectedOption() {
    const selectElement = document.querySelector('.selection');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const idLabel = selectedOption.value;
    localStorage.setItem('selectedOption', idLabel);
}
document.querySelector('.selection').addEventListener('change', saveSelectedOption);


function coordsToLatLng(coords) {
    if (!coords || coords.length < 2) {
        console.error('Invalid coordinates');
        return;
    }

    // Get the selected option
    const idLabel = localStorage.getItem('selectedOption');
    let srs;
    
        switch (idLabel) {
            case "1":
                console.log(   `the value is 1` )
                srs = myCRS

                break;

            case "2":
                srs = crs
                console.log(`the value is 2`)

                break;
            case "3":

                srs = crs2
                console.log(`the value is 3`)

                break;
            case "4":
                srs = crs3
                console.log(`the value is 4`)
                break;
            case "":
                srs = crs4
                console.log(`the value is 5`)
                break;
            default:
                console.log("No value found");
        }
    if (srs) {
        try {
            var latLng = srs.unproject(L.point(coords[0], coords[1]));
            // console.log(latLng);
            return latLng;
        } catch (e) {
            console.error('Error converting coordinates:', e);
        }
    } else {
        console.error('CRS not defined');
    } 
};


function restoreSelectedOption() {
    const selectElement = document.querySelector('.selection');
    const savedValue = localStorage.getItem('selectedOption');

    if (savedValue) {
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value === savedValue) {
                selectElement.selectedIndex = i;
                break;
            }
        }
    }
}

function pointToLayer(feature, latlng) {
    // Create a new icon with custom properties
    const customIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Create a marker using the custom icon and the provided latlng
    return L.marker(latlng, { icon: customIcon });
}


function csvToGeoJSON(csvData) {
    const geojson = {
        type: "FeatureCollection",
        features: []
    };

    Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            results.data.forEach(row => {
                const lat = parseFloat(row.latitude);
                const lng = parseFloat(row.longitude);

                if (!isNaN(lat) && !isNaN(lng)) {
                    const feature = {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        properties: {
                            name: row.name || 'No Name Found'
                        }
                    };
                    geojson.features.push(feature);
                }
            });
        }
    });

    return geojson;
}

function mainFunction(file){
    map.flyToBounds(csvLayer.getBounds());
    layerControl.addOverlay(csvLayer, file.name);
    setTimeout(showLegend, 1000)
    ItemCsv.classList.add('showe')
    fileNameCsv.textContent = file.name
}


var ItemCsv = document.querySelector('.items .csv')

var fileNameCsv = ItemCsv.querySelector(".file-name")

var deleteItem = document.querySelector('.delete-item')




// show legend /////////////////////////
function showLegend() {
    document.querySelector(".items").classList.add('afficher')
}

// remove all///////////////////////
function clear_all() {
    map.removeLayer(csvLayer);
    layerControl.removeLayer(csvLayer)
    map.invalidateSize();
    map.flyTo([30.386, -3.319], 6);
    localStorage.removeItem('savedFile');
    localStorage.removeItem('savedFileName');
    localStorage.removeItem('selectedOption');


}


// zoom to layer////////////////////////////
fileNameCsv.addEventListener('click', () => {
            map.flyToBounds(csvLayer.getBounds())
   
})

// confirm delete//////////////////////
deleteItem.addEventListener('click', (e) => {
    const userConfirmed = confirm("Are you sure you want to delete the file?");

    if (userConfirmed) {
        // The user clicked "Yes" (OK)
        // alert("Item deleted.");
        clear_all()
        
        var itemParent = e.currentTarget.parentElement
        itemParent.classList.remove('showe')
        
        // Add code here to perform the delete operation
    } else {
        // The user clicked "No" (Cancel)
        alert("Item not deleted.");
        return
    }
    
  

})

let dataRestore = document.querySelector(".restore_data")
let mainContai = document.querySelector(".main_conta")



// Example usag



function onEachFeature(feature, layer) {

    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name, { closeButton: false, offset: L.point(0, 0) });
        layer.on('mouseover', function () { layer.openPopup(); });
        layer.on('mouseout', function () { layer.closePopup(); });
    }
    if (feature.properties && feature.properties.type) {
        layer.bindPopup(feature.properties.type, { closeButton: false, offset: L.point(0, 0) });
        layer.on('mouseover', function () { layer.openPopup(); });
        layer.on('mouseout', function () { layer.closePopup(); });
    }
    

}

document.getElementById('fileInput').addEventListener('change', function (event) {

    if (csvLayer) {
        overlays.clearLayers();
        layerControl.removeLayer(csvLayer)
        map.removeLayer(csvLayer);
        
    }
    const file = event.target.files[0];
    if (!file) return;

    // Use FileReader to read the file
    const reader = new FileReader();

    reader.onload = function (e) {
        const csvData = e.target.result;

        // Convert CSV data to GeoJSON
        const geojson = csvToGeoJSON(csvData);

        // Create a layer for GeoJSON data
        csvLayer = L.geoJson(geojson, {
            onEachFeature: onEachFeature,
            coordsToLatLng: coordsToLatLng,
            pointToLayer: pointToLayer
            
        }).addTo(map);

        // Adjust map view to fit the bounds of the GeoJSON layer
       mainFunction(file)
    
        // Save data to IndexedD

        // Store the ID in localStorage for future reference
        
        try {
            localStorage.setItem('savedFile', JSON.stringify(geojson));
            localStorage.setItem('savedFileName', file.name);
            alert('The file stored successfully.');
        } catch (error) {
            console.error('Failed to save data to localStorage:', error);
        }

    
    };

    // Read the CSV file
    reader.readAsText(file);
    alert('the file ulpoaded successfully')
    

});

function restoreData() {
    const savedFile = localStorage.getItem('savedFile');
    const savedFileName = localStorage.getItem('savedFileName');

    if (savedFile) {
        try {
            // Parse the saved GeoJSON data
            const geojson = JSON.parse(savedFile);

            // Create a layer for the saved GeoJSON data
            csvLayer = L.geoJson(geojson, {
                onEachFeature: onEachFeature,
                coordsToLatLng: coordsToLatLng,
                pointToLayer: pointToLayer
            }).addTo(map);

            // Adjust map view to fit the bounds of the GeoJSON layer
            mainFunction(savedFileName)
        

            // Optionally, restore file name in the UI
            if (fileNameCsv && savedFileName) {
                fileNameCsv.textContent = savedFileName;
            }

            // Show legend or other UI updates
            setTimeout(() => {
                if (typeof showLegend === 'function') {
                    showLegend();
                } else {
                    console.warn('showLegend function is not defined.');
                }
            }, 1000);

            // Show the CSV item
            if (ItemCsv) {
                ItemCsv.classList.add('showe');
            }
            alert('the file found successfully')
        } catch (error) {
            console.error('Failed to parse saved data:', error);
            alert('Failed to restore file from localStorage.');
        }
        removeRestorePanel()
        restoreSelectedOption()
       
    } else {
        alert('No file content found in localStorage.');
    }
}




function quit() {
    localStorage.removeItem('savedFile');
    localStorage.removeItem('savedFileName');
    localStorage.removeItem('selectedOption');
    removeRestorePanel()
}

      // Load the CSV data



var hideData = document.querySelector('.hide-table-attribute')

hideData.addEventListener('click', () => {
    document.getElementById('map').classList.toggle('map_active')
    document.querySelector('.header').classList.toggle('header_inactive')
})

function ckechdata() {
    if (localStorage.length === 0) {
        console.log('LocalStorage is empty.');
    }
       
        else {
        // document.querySelector(".restore_data").classList.add('show')
        dataRestore.classList.add('show')
        mainContai.classList.add('show')
        
        }
}


function removeRestorePanel() {
    if (mainContai.classList.contains('show') && dataRestore.classList.contains('show')) {
        mainContai.classList.remove('show')
        dataRestore.classList.remove('show')
    }
    else {
        return null;
    }
}

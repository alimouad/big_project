$(window).on('load', function () {
    $('sk-cube-grid').css("display", "none")
    $('.loader').fadeOut('5000')
})

let geojsonLayer;
var baseMaps;
var overlays;
var marker;
var csvLayer;
var imageryLayer;
let lyrGoogleMap;
var satelliteLayer;
let currentHighlightLayer = null;  

// define Map/////

const map = L.map('map', {
    crs: L.CRS.EPSG3857
}).setView([30.386, -3.319], 5); //


imageryLayer = L.tileLayer('http://mts2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 25,
    maxNativeZoom: 20
}).addTo(map)

lyrGoogleMap = L.tileLayer('http://mts3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    maxNativeZoom: 20
})
let googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

const ewi = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});


const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    maxNativeZoom: 20
});


var spl = "+proj=longlat +datum=WGS84 +no_defs"
var bnprojct1 = "+proj=lcc +lat_1=33.3 +lat_0=33.3 +lon_0=-5.4 +k_0=0.999625769 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs "
var bnprojct2 = "+proj=lcc +lat_1=29.7 + lat_0=29.7 + lon_0=-5.4 + k_0=0.9996155960000001 + x_0=500000 + y_0=300000 + a=6378249.2 + b=6356515 + towgs84=31, 146, 47, 0, 0, 0, 0 + units=m + no_defs"
var bnprjct3 = "+proj=lcc +lat_1=26.1 +lat_0=26.1 +lon_0=-5.4 +k_0=0.999616304 +x_0=1200000 +y_0=400000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs "
var bnprjct4 = "+proj=lcc +lat_1=22.5 +lat_0=22.5 +lon_0=-5.4 +k_0=0.999616437 +x_0=1500000 +y_0=400000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs ";
let proArr = [bnprojct1, bnprojct2, bnprjct3, bnprjct4]
let proj;



// define projections///////////////////

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









// save selected proj////////////
let idLabel
function saveSelectedOption() {
    let btnCo = document.querySelector('.btnCar')
    const selectElement = document.querySelector('.selection');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    idLabel = selectedOption.value;

    if (idLabel == '1') {
        btnCo.classList.add('disabled')
    }
    else {
        btnCo.classList.remove('disabled')
    }

    return idLabel

}
document.querySelector('.selection').addEventListener('change', saveSelectedOption);





L.Control.geocoder({
    position: 'topright'
}).addTo(map);




// switch between base maps///////////
let currentLayer = imageryLayer;  // Start with OSM by default
function updateBasemap(layer) {
    map.removeLayer(currentLayer);
    currentLayer = layer;
    map.addLayer(currentLayer);
}

// Event listener for radio button changes
document.querySelectorAll('input[name="basemap"]').forEach(radio => {
    radio.addEventListener('change', function () {
        switch (this.value) {
            case 'OpenStreetMap':
                updateBasemap(osmLayer);
                break;
            case 'Imagery':
                updateBasemap(imageryLayer);
                break;
            case 'Satellite':
                updateBasemap(googleStreets);
                break;
            case 'Esri':
                updateBasemap(ewi);
                break;
            case 'GoogleMap':
                updateBasemap(lyrGoogleMap);
                break;
        }
    });
});




function menuToggle() {
    document.querySelector('.side').classList.toggle('hide')
    document.querySelector('.main').classList.toggle('hide')
}


let currentGeojson;
let fileName;
let geojson;
let geoDataList = [];  // Array to hold all GeoJSON layers
let attributeTables = {};
let tableContainer  // Object to store attribute tables by file name

// document.getElementById('geojson-file').addEventListener('change', function (event) {
//     // Check if the list already contains 4 files
//     if (geoDataList.length >= 4) {
//         alert('You cannot upload more than 4 files.');
//         return;  // Prevent further execution
//     }

//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = function (e) {
//         try {
//             const geojson = JSON.parse(e.target.result);
//             const fileName = file.name;

//             // Check if the GeoJSON has features
//             if (geojson && geojson.features) {
//                 // Create a new GeoJSON layer
//                 let geoData = L.geoJson(geojson, {
//                     style: Ethnic2Style,
//                     coordsToLatLng: coordsToLatLng,
//                     onEachFeature: function (feature, layer) {
//                         // Pass the fileName to onEachFeature instead of the tableContainer
//                         onEachFeature(feature, layer, geojson, fileName);
//                     }
//                 }).addTo(map);

//                 // Store the current file's GeoJSON and name
//                 geoDataList.push({ fileName, geoData });

//                 // Create a unique attribute table for this file
//                 createEditableAttributeTable(geojson, geoDataList.length - 1);

//                 // Create a new item in the UI for this file
//                 createGeoJSONItem(fileName, geoData, geoDataList.length - 1);
//                 alert('Uploaded successfully!');


//                 const layerSelect = document.getElementById('layer');
//                 const option = document.createElement('option');
//                 option.value = geoDataList.length - 1;  // Index in geojsonLayersList
//                 option.text = fileName;
//                 layerSelect.appendChild(option);
//                 document.getElementById('layer').addEventListener('change', function () {
//                     const selectedLayerIndex = this.value;

//                     // Clear existing attributes
//                     const attributesSelect = document.getElementById('attributes');
//                     attributesSelect.innerHTML = '<option selected>Select Attribute</option>';

//                     if (selectedLayerIndex !== "Select Layer") {
//                         const geojson = geoDataList[selectedLayerIndex].geojson;

//                         // Get attributes from the first feature's properties
//                         const properties = geojson.features[0].properties;

//                         // Populate the attribute dropdown
//                         Object.keys(properties).forEach(key => {
//                             const option = document.createElement('option');
//                             option.value = key;
//                             option.text = key;
//                             attributesSelect.appendChild(option);
//                         });
//                     }
//                 });


//             } else {
//                 alert("GeoJSON does not have a 'features' property.");
//             }
//         } catch (error) {
//             console.error('Error parsing GeoJSON:', error);
//             alert('Failed to load the GeoJSON file.');
//         }
//     };
//     reader.readAsText(file);
// });





// create Table/////////////
// function createEditableAttributeTable(geojson, index) {
//     let main = document.querySelector('.main');
//     const tableContainer = document.createElement('div');
//     tableContainer.classList.add('attribute-table');

//     const toolsContainer = document.createElement('div');
//     toolsContainer.classList.add('tools-btn', 'flex');
//     toolsContainer.innerHTML = `
//         <button class="btn save" id="saveTable-${index}"><i class="ph ph-floppy-disk"></i> </button>
//         <button class="btn download" id="downloadFile-${index}"><i class="ph ph-file-arrow-down"></i></button>
//         <button class="btn download" id="downloadCSV-${index}"><i class="ph ph-file-csv"></i> </button>
//     `;

//     const table = document.createElement('table');
//     table.innerHTML = `
//         <thead>
//             <tr>
//                 ${Object.keys(geojson.features[0].properties).map(prop => `<th>${prop}</th>`).join('')}
//             </tr>
//         </thead>
//         <tbody>
//             ${geojson.features.map((feature, featureIndex) => `
//                 <tr>
//                     ${Object.values(feature.properties).map((value, valueIndex) => `
//                         <td contenteditable="true" data-feature-index="${featureIndex}" data-property-key="${Object.keys(feature.properties)[valueIndex]}">${value}</td>
//                     `).join('')}
//                 </tr>
//             `).join('')}
//         </tbody>
//     `;

//     tableContainer.appendChild(toolsContainer);
//     tableContainer.appendChild(table);
//     main.appendChild(tableContainer);

//     // Track changes in the table
//     table.addEventListener('input', function (e) {
//         const target = e.target;
//         if (target.tagName === 'TD') {
//             const featureIndex = target.getAttribute('data-feature-index');
//             const propertyKey = target.getAttribute('data-property-key');
//             // Update the geojson properties based on the table's edits
//             geojson.features[featureIndex].properties[propertyKey] = target.textContent;
//         }
//     });

//     // Add event listener for Save Table button
//     document.getElementById(`saveTable-${index}`).addEventListener('click', function () {
//         saveUpdatedGeoJson(geojson, `updated_geojson_${index}.geojson`);
//         alert('Table saved successfully!');
//     });

//     // Add event listener for Download button
//     document.getElementById(`downloadFile-${index}`).addEventListener('click', function () {
//         downloadGeoJson(geojson, `updated_geojson_${index}.geojson`);
//     });

//     document.getElementById(`downloadCSV-${index}`).addEventListener('click', function () {
//         const csvContent = geoJsonToCSV(geojson);
//         downloadCSV(csvContent, `updated_table_${index}.csv`);
//     });
//     const fileName = geoDataList[index].fileName;
//     attributeTables[fileName] = tableContainer;
//     return tableContainer;
// }




// function createEditableAttributeTable(geojson, index) {
//     let main = document.querySelector('.main');
//     const tableContainer = document.createElement('div');
//     tableContainer.classList.add('attribute-table');

//     const toolsContainer = document.createElement('div');
//     toolsContainer.classList.add('tools-btn', 'flex');
//     toolsContainer.innerHTML = `
//         <button class="btn save" id="saveTable-${index}"><i class="ph ph-floppy-disk"></i></button>
//         <button class="btn download" id="downloadFile-${index}"><i class="ph ph-file-arrow-down"></i></button>
//         <button class="btn download" id="downloadCSV-${index}"><i class="ph ph-file-csv"></i></button>
//     `;

//     const table = document.createElement('table');
//     table.innerHTML = `
//         <thead>
//             <tr>
//                 ${Object.keys(geojson.features[0].properties).map(prop => `<th>${prop}</th>`).join('')}
//             </tr>
//         </thead>
//         <tbody>
//             ${geojson.features.map((feature, featureIndex) => `
//                 <tr data-feature-index="${featureIndex}">
//                     ${Object.values(feature.properties).map((value, valueIndex) => `
//                         <td contenteditable="true" data-property-key="${Object.keys(feature.properties)[valueIndex]}">${value}</td>
//                     `).join('')}
//                 </tr>
//             `).join('')}
//         </tbody>
//     `;

//     tableContainer.appendChild(toolsContainer);
//     tableContainer.appendChild(table);
//     main.appendChild(tableContainer);

//     // Track changes in the table
//     table.addEventListener('input', function (e) {
//         const target = e.target;
//         if (target.tagName === 'TD') {
//             const featureIndex = target.closest('tr').getAttribute('data-feature-index');
//             const propertyKey = target.getAttribute('data-property-key');
//             // Update the geojson properties based on the table's edits
//             geojson.features[featureIndex].properties[propertyKey] = target.textContent;
//         }
//     });

//     // Add event listener for Save Table button
//     document.getElementById(`saveTable-${index}`).addEventListener('click', function () {
//         saveUpdatedGeoJson(geojson, `updated_geojson_${index}.geojson`);
//         alert('Table saved successfully!');
//     });

//     // Add event listener for Download button
//     document.getElementById(`downloadFile-${index}`).addEventListener('click', function () {
//         downloadGeoJson(geojson, `updated_geojson_${index}.geojson`);
//     });

//     document.getElementById(`downloadCSV-${index}`).addEventListener('click', function () {
//         const csvContent = geoJsonToCSV(geojson);
//         downloadCSV(csvContent, `updated_table_${index}.csv`);
//     });

//     const fileName = geoDataList[index].fileName;
//     attributeTables[fileName] = tableContainer;
//     return tableContainer;
// }


const layerSelect = document.getElementById('layer');
const tool_layer = document.getElementById('tool-layer');
const tool_layer_one = document.getElementById('tool-layer-one');
const tool_layer_two = document.getElementById('tool-layer-two');
const tool_layer_tree = document.getElementById('tool-layer-tree');
const tool_layer_four = document.getElementById('tool-layer-four');

// Create a separate option for each select element
const addOptionToSelect = (selectElement, index, fileName) => {
    const option = document.createElement('option');
    option.value = index;
    option.text = fileName;
    selectElement.appendChild(option);
};



// importin function ////////////

// geoJson*******************
document.getElementById('geojson-file').addEventListener('change', function (event) {
    // Check if the list already contains 4 files
    if (geoDataList.length >= 4) {
        alert('You cannot upload more than 4 files.');
        return;  // Prevent further execution
    }

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const geojson = JSON.parse(e.target.result);
            let fileName = file.name;

            // Check if the GeoJSON has features
            if (geojson && geojson.features && geojson.features.length > 0) {
                // Create a new GeoJSON layer
                let geoData = L.geoJson(geojson, {
                    style: Ethnic2Style,
                    coordsToLatLng: coordsToLatLng,
                    onEachFeature: function (feature, layer) {
                        // Pass the fileName to onEachFeature instead of the tableContainer
                        onEachFeature(feature, layer, geojson, fileName);
                    }
                }).addTo(map);

                // Store the current file's GeoJSON and name
                geoDataList.push({ fileName, geojson, geoData });
                console.log(geoDataList)

                // Create a unique attribute table for this file
                createEditableAttributeTable(geojson, geoDataList.length - 1);

                // Create a new item in the UI for this file
                createGeoJSONItem(fileName, geoData, geoDataList.length - 1);
                alert('Uploaded successfully!');

                // Populate the layer select dropdown
                const fileNam = geoDataList[geoDataList.length - 1].fileName;  // Assuming you have the fileName in geoDataList
                addOptionToSelect(layerSelect, geoDataList.length - 1, fileNam);
                addOptionToSelect(tool_layer, geoDataList.length - 1, fileNam);
                addOptionToSelect(tool_layer_one, geoDataList.length - 1, fileNam);
                addOptionToSelect(tool_layer_tree, geoDataList.length - 1, fileNam);
                addOptionToSelect(tool_layer_two, geoDataList.length - 1, fileNam);
                addOptionToSelect(tool_layer_four, geoDataList.length - 1, fileNam);

            } else {
                alert("GeoJSON does not have a 'features' property or is empty.");
            }
        } catch (error) {
            console.error('Error parsing GeoJSON:', error);
            alert('Failed to load the GeoJSON file.');
        }
    };
    reader.readAsText(file);
});

// sheape files//////
let shapefile;
document.getElementById('shape-file').addEventListener('change', function (event) {

    if (geoDataList.length >= 4) {
        alert('You cannot upload more than 4 files.');
        return;  // Prevent further execution
    }

    var file = event.target.files[0];
    const fileName = file.name;
    var reader = new FileReader();
    reader.onload = function (e) {
        var data = e.target.result;
        // Convert the shapefile to GeoJSON using shpjs library
        shp(data).then(function (geojson) {
            shapefile = L.geoJson(geojson, {
                style: Ethnic1Style,
                coordsToLatLng: coordsToLatLng,
                onEachFeature: function (feature, layer) {
                    onEachFeature(feature, layer, geojson, fileName);
                }
            }).addTo(map);

            const currentGeojson = geojson;
            // Add the shapefile layer to the list with the fileName
            geoDataList.push({ fileName, geoData: shapefile });

            // Create a unique attribute table for this file
            createEditableAttributeTable(currentGeojson, geoDataList.length - 1);

            // Create a new item in the UI for this file
            createGeoJSONItem(fileName, shapefile, geoDataList.length - 1);

            alert('Uploaded successfully!');

            let restore_data = document.querySelector('.store_data');
            restore_data.classList.add('show');

        }).catch(function (error) {
            console.error('Error converting shapefile to GeoJSON:', error);
        });

    };
    reader.readAsArrayBuffer(file);

});









// Call the function to load and display GeoJSON data
const importSections = document.querySelectorAll('.tool');

// Loop through each import section and add click event listener
importSections.forEach(importSection => {
    const toggleButton = importSection.querySelector('.up');
    const items = importSection.querySelector('.items');
    const icon = importSection.querySelector('.up i');

    toggleButton.addEventListener('click', function () {
        // Toggle the 'show' class to apply transition effect
        if (items.classList.contains('show')) {
            items.classList.remove('show');  // Hide items
            icon.classList.remove('uil-arrow-up');
            icon.classList.add('uil-arrow-down');  // Change arrow direction
        } else {
            items.classList.add('show');  // Show items with transition
            icon.classList.remove('uil-arrow-down');
            icon.classList.add('uil-arrow-up');  // Change arrow direction
        }
    })
});















// query functions//////////////////////


function showQuery() {
    document.querySelector('#query_tab').classList.toggle('show')
}

document.getElementById('layer').addEventListener('change', function () {
    const selectedLayerIndex = this.value;

    // Clear existing attributes
    const attributesSelect = document.getElementById('attributes');
    attributesSelect.innerHTML = '<option selected>Select Attribute</option>';

    if (selectedLayerIndex !== "Select Layer") {
        const selectedLayer = geoDataList[selectedLayerIndex];

        // Make sure geojson exists for the selected layer
        if (selectedLayer && selectedLayer.geojson && selectedLayer.geojson.features.length > 0) {
            const properties = selectedLayer.geojson.features[0].properties;

            // Populate the attribute dropdown
            Object.keys(properties).forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                option.text = key;
                attributesSelect.appendChild(option);
            });
        } else {
            alert("Selected layer doesn't contain any features.");
        }
    }
});

document.getElementById('operator').innerHTML = `
    <option selected>Select Operator</option>
    <option value="=">=</option>
    <option value="!=">!=</option>
    <option value=">">></option>
    <option value="<"><</option>
    <option value=">=">>=</option>
    <option value="<="><=</option>
`;

function query() {
    const selectedLayerIndex = document.getElementById('layer').value;
    const selectedAttribute = document.getElementById('attributes').value;
    const selectedOperator = document.getElementById('operator').value;
    const inputValue = document.getElementById('value').value;

    // Validate selections
    if (selectedLayerIndex === "Select Layer" || selectedAttribute === "Select Attribute") {
        alert('Please select a layer and an attribute.');
        return;
    }

    const selectedLayer = geoDataList[selectedLayerIndex];

    // Ensure the selected layer and GeoJSON exist
    if (!selectedLayer || !selectedLayer.geojson || !selectedLayer.geoData) {
        console.error("GeoJSON layer or data not defined");
        return;
    }

    const geojsonLayer = selectedLayer.geoData;  // Correctly access the GeoJSON layer

    // Array to store matching features' bounds
    let matchingLayersBounds = [];

    // Loop through each feature in the selected GeoJSON layer
    geojsonLayer.eachLayer(function (layer) {
        const feature = layer.feature;
        const featureValue = feature.properties[selectedAttribute];

        let matchesFilter = false;

        // Filter the feature based on the selected operator and input value
        switch (selectedOperator) {
            case "=":
                matchesFilter = (featureValue == inputValue);
                break;
            case "!=":
                matchesFilter = (featureValue != inputValue);
                break;
            case ">":
                matchesFilter = (featureValue > inputValue);
                break;
            case "<":
                matchesFilter = (featureValue < inputValue);
                break;
            case ">=":
                matchesFilter = (featureValue >= inputValue);
                break;
            case "<=":
                matchesFilter = (featureValue <= inputValue);
                break;
            default:
                matchesFilter = false;
        }

        if (matchesFilter) {
            layer.setStyle(findMatch);  // Highlight matching feature

            // Add the layer bounds to the matching layers array
            matchingLayersBounds.push(layer.getBounds());
        } else {
            layer.setStyle({ fillOpacity: 0 });
              // Hide non-matching feature
        }
    });

    // If we found matching layers, zoom to their bounds
    if (matchingLayersBounds.length > 0) {
        // Combine all bounds into a single LatLngBounds object
        const bounds = matchingLayersBounds.reduce(function (accumulatedBounds, currentBounds) {
            return accumulatedBounds.extend(currentBounds);
        }, L.latLngBounds());

        // Fit the map view to the combined bounds of the matching features
        map.fitBounds(bounds);
    }
}


function removeQuery() {
    const selectedLayerIndex = document.getElementById('layer').value;

    if (selectedLayerIndex === "Select Layer") {
        alert('Please select a layer to unload.');
        return;
    }

    const selectedLayer = geoDataList[selectedLayerIndex];

    // Check if the selected layer exists
    if (!selectedLayer || !selectedLayer.geoData) {
        alert('Invalid layer selected.');
        return;
    }

    const geojsonLayer = selectedLayer.geoData;

    // Reset the style of all features in the layer
    geojsonLayer.eachLayer(function (layer) {
        geojsonLayer.resetStyle(layer);  // Reset to the original style
    });

    alert('Layer query has been removed and styles reset.');
}











// Create Attribute Table///////////
function toggleGeoJSON(checkbox, geojsonLayer) {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            // Add the layer to the map when the checkbox is checked
            geojsonLayer.addTo(map);
            map.flyToBounds(geojsonLayer.getBounds(), { padding: [12, 12] });

        } else {
            // Remove the layer from the map when the checkbox is unchecked
            map.removeLayer(geojsonLayer);
        }
    });
}

function createEditableAttributeTable(geojson, index) {
    let main = document.querySelector('.main');
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('attribute-table');

    const toolsContainer = document.createElement('div');
    toolsContainer.classList.add('tools-btn', 'flex');
    toolsContainer.innerHTML = `
        <button class="btn save" id="saveTable-${index}"><i class="ph ph-floppy-disk"></i></button>
        <button class="btn download" id="downloadFile-${index}"><i class="ph ph-file-arrow-down"></i></button>
        <button class="btn download" id="downloadCSV-${index}"><i class="ph ph-file-csv"></i></button>
    `;

    const table = document.createElement('table');
    const hasProperties = geojson.features.length > 0 && geojson.features[0].properties && Object.keys(geojson.features[0].properties).length > 0;

    if (hasProperties) {
        table.innerHTML = `
            <thead>
                <tr>
                    ${Object.keys(geojson.features[0].properties).map(prop => `<th>${prop}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${geojson.features.map((feature, featureIndex) => `
                    <tr data-feature-index="${featureIndex}">
                        ${Object.values(feature.properties).map((value, valueIndex) => `
                            <td contenteditable="true" data-property-key="${Object.keys(feature.properties)[valueIndex]}">${value}</td>
                        `).join('')}
                    </tr>
                `).join('')}
            </tbody>
        `;
    } else {
        // Display message or create an empty table when there are no properties
        table.innerHTML = `
            <thead>
                <tr><th>No Properties Found</th></tr>
            </thead>
            <tbody>
                <tr><td>No properties available for editing</td></tr>
            </tbody>
        `;
    }

    tableContainer.appendChild(toolsContainer);
    tableContainer.appendChild(table);
    main.appendChild(tableContainer);

    if (hasProperties) {
        // Track changes in the table
        table.addEventListener('input', function (e) {
            const target = e.target;
            if (target.tagName === 'TD') {
                const featureIndex = target.closest('tr').getAttribute('data-feature-index');
                const propertyKey = target.getAttribute('data-property-key');
                // Update the geojson properties based on the table's edits
                geojson.features[featureIndex].properties[propertyKey] = target.textContent;
                console.log(`Updated feature ${featureIndex} property ${propertyKey} to ${target.textContent}`);
            }
        });
    }

    // Add event listener for Save Table button
    document.getElementById(`saveTable-${index}`).addEventListener('click', function () {
        saveUpdatedGeoJson(geojson, `updated_geojson_${index}.geojson`);
        alert('Table saved successfully!');
    });

    // Add event listener for Download button
    document.getElementById(`downloadFile-${index}`).addEventListener('click', function () {
        downloadGeoJson(geojson, `updated_geojson_${index}.geojson`);
    });

    document.getElementById(`downloadCSV-${index}`).addEventListener('click', function () {
        const csvContent = geoJsonToCSV(geojson);
        downloadCSV(csvContent, `updated_table_${index}.csv`);
    });

    const fileName = geoDataList[index].fileName;
    if (!fileName) {
        console.error('File name is not defined for index:', index);
        return;
    }
    attributeTables[fileName] = tableContainer;
    console.log('Attribute table created for file:', fileName);

    return tableContainer;
}

function createGeoJSONItem(fileName, geojsonData, index) {
    const container = document.querySelector('.data');
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('geojson');
    const checkboxId = `data-${index}`;

    // Create a unique ID for the table container
    const tableId = `table-${index}`;

    itemDiv.innerHTML = `
        <input type="checkbox" name="data_loaded" id="${checkboxId}" checked>
        <label for="${checkboxId}">${fileName}</label>
        <span class="table tl" id="showTable" onclick="showAttrTable('${index}')"><i class="ph ph-table"></i></span>
        <span class="delete tl"><i class="ph ph-trash"></i></span>
    `;

    // Append the new div to the container
    container.appendChild(itemDiv);

    // Store the table container ID in the item div
    itemDiv.dataset.tableId = tableId;

    const checkbox = document.getElementById(checkboxId);
    checkbox.disabled = false;

    toggleGeoJSON(checkbox, geojsonData);

    const label = itemDiv.querySelector(`label[for="${checkboxId}"]`);
    label.addEventListener('click', function () {
        map.flyToBounds(geojsonData.getBounds(), { padding: [12, 12] });
    });

    const deleteBtn = itemDiv.querySelector('.delete');
    deleteBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
            removeGeoJSONItem(itemDiv, geojsonData);
        }
    });
}
// / Function to highlight the corresponding table row////
function highlightTableRow(feature, geojson, fileName) {
    const tableContainer = attributeTables[fileName];
    if (!tableContainer) {
        console.error(`Table container not found for file: ${fileName}`);
        return;
    }

    // Remove highlight from previously selected row
    const highlightedRow = tableContainer.querySelector('tr.highlighted');
    if (highlightedRow) {
        highlightedRow.classList.remove('highlighted');
    }

    // Find the feature in the geojson array based on a unique property
    const featureIndex = geojson.features.findIndex(f => {
        return JSON.stringify(f.properties) === JSON.stringify(feature.properties);
    });

    if (featureIndex === -1) {
        console.error('Feature not found in GeoJSON features array');
        return;
    }

    const rowToHighlight = tableContainer.querySelector(`tr[data-feature-index="${featureIndex}"]`);

    if (rowToHighlight) {
        rowToHighlight.classList.add('highlighted');
        rowToHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        console.error('Could not find table row for feature');
    }
}

function updateAttributeTable(feature, geojson, tableContainer) {
    if (!geojson || !geojson.features) {
        console.error('GeoJSON or features array not defined');
        return;
    }

    const featureIndex = geojson.features.findIndex(f => f.properties.id === feature.properties.id);

    if (featureIndex === -1) {
        console.error('Feature not found in GeoJSON features array');
        return;
    }

    if (!tableContainer) {
        console.error('Table container not found');
        return;
    }

    // Check if tableRow exists
    const tableRow = tableContainer.querySelector(`tr[data-feature-index="${featureIndex}"]`);
    if (!tableRow) {
        console.error('Corresponding table row not found');
        return;
    }

    // Update the table cells with the new property values
    Object.keys(feature.properties).forEach((key) => {
        const cell = tableRow.querySelector(`td[data-property-key="${key}"]`);
        if (cell) {
            cell.textContent = feature.properties[key];  // Update cell content
        }
    });
}

// show attribute Table for every json uploaded/////
function showAttrTable(index) {
    // Check if the index is valid
    if (index < 0 || index >= geoDataList.length) {
        console.error('Index out of bounds:', index);
        return;
    }

    // Get the GeoJSON layer using the index
    const geoDataEntry = geoDataList[index];

    // Check if geoDataEntry is valid
    if (!geoDataEntry) {
        console.error('GeoData entry not found for index:', index);
        return;
    }

    const { fileName } = geoDataEntry;

    // Check if fileName is available
    if (!fileName) {
        console.error('FileName not found for index:', index);
        return;
    }

    // Access the table associated with the fileName
    const table = attributeTables[fileName];

    if (table) {
        // Toggle the visibility of the attribute table
        table.classList.toggle('show');
    } else {
        console.error('Attribute table not found for file:', fileName);
    }
}

// romove uploaded files///////////////////////
let tables = []
function removeGeoJSONItem(itemDiv, geojsonData) {
    itemDiv.remove();  // Remove item from UI
    geojsonData.removeFrom(map);  // Remove layer from the map

    // Find the index of the geojsonData in geoDataList
    const index = geoDataList.findIndex(item => item.geoData === geojsonData);

    if (index > -1) {
        // Capture the fileName before removing the item from geoDataList
        const { fileName } = geoDataList[index];

        // Remove the associated attribute table if it exists
        const tableContainer = attributeTables[fileName];
        if (tableContainer) {
            tableContainer.remove();  // Remove the table from the DOM
            delete attributeTables[fileName];  // Remove from attributeTables object
        }

        // Finally, remove the item from geoDataList
        geoDataList.splice(index, 1);
    }
}










// uploaded file function /////////////
let srs;
let selectedFeature = null;
function coordsToLatLng(coords) {
    if (!coords || coords.length < 2) {
        console.error('Invalid coordinates');
        return;
    }
    idLabel = saveSelectedOption()

    let srs;

    switch (idLabel) {
        case "1":

            srs = myCRS


            break;

        case "2":
            srs = crs;




            break;
        case "3":

            srs = crs2;



            break;
        case "4":
            srs = crs3;


            break;
        case "":
            srs = crs4


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

function onEachFeature(feature, layer, geojson, fileName) {
    if (!fileName) {
        console.error('fileName is undefined');
        return;
    }

    // Add mouseover and mouseout effects to the feature on the map
    layer.on('mouseover', function (e) {
        e.target.setStyle({
            fillOpacity: 0.8
        });
    });

    layer.on('mouseout', function (e) {
        const tableContainer = attributeTables[fileName];
        // // Remove highlight from previously selected row
        const highlightedRow = tableContainer.querySelector('tr.highlighted');
        if (highlightedRow) {
            highlightedRow.classList.remove('highlighted');
        }
        e.target.setStyle({
            fillOpacity: 0.2
        });
    });


    // Add click event to the feature
    layer.on('click', function (e) {
        const properties = feature.properties;
        selectedFeature = feature;

        // Open popup with feature details
        let popupContent = `<h4 class="edit-h4">Edit Feature Details</h4><form id='popup-form'>`;
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                popupContent += `
                    <label class="feature-label" for="${key}"><strong>${key}:</strong></label>
                    <input class="feature-input" type="text" id="${key}" name="${key}" value="${properties[key]}"><br>`;
            }
        }
        popupContent += `<button type="button" class="btn" id="saveBtn">Save</button></form>`;

        layer.bindPopup(popupContent).openPopup();

        // Color the corresponding table row
        highlightTableRow(feature, geojson, fileName);

        setTimeout(() => {
            const saveButton = document.getElementById('saveBtn');

            if (saveButton) {
                saveButton.addEventListener('click', function () {
                    const form = document.getElementById('popup-form');
                    for (const key in properties) {
                        if (properties.hasOwnProperty(key)) {
                            properties[key] = form.elements[key].value;  // Update properties with new values
                        }
                    }

                    // Close the popup after saving changes
                    layer.closePopup();

                    // Retrieve the table container using the fileName
                    const tableContainer = attributeTables[fileName];
                    if (!tableContainer) {
                        console.error(`Table container not found for file: ${fileName}`);
                        alert('Error: Could not find the attribute table for this file.');
                        return;
                    }

                    // Update the attribute table for this specific GeoJSON and its tableContainer
                    updateAttributeTable(feature, geojson, tableContainer);

                    alert('Feature details updated successfully!');
                });
            } else {
                console.error('Save button not found!');
            }
        }, 100);  // Add a small timeout to ensure the popup is rendered
    });

}


function Ethnic2Style() {
    return {
        fillColor: 'rgb(145, 228, 0)',
        weight: 3,
        opacity: 1,
        color: 'rgb(145, 228, 0)',
        dashArray: '1',
        fillOpacity: 0.2
    };
}
function Ethnic1Style() {
    return {
        fillColor: '#753a88',
        weight: 3,
        opacity: 1,
        color: '#753a88',
        dashArray: '1',
        fillOpacity: 0.2
    };
}
const findMatch = {

    fillColor: '#ff0000',
    weight: 3,
    opacity: 1,
    color: '#ff0000',
    dashArray: '1',
    fillOpacity: 0.8

}
function zoomLayer() {
    return {
        fillColor: '#181818',
        weight: 3,
        opacity: 1,
        color: '#181818',
        dashArray: '1',
        fillOpacity: 0.8
    };
}






// tabele attributesgeojson to csv////////
function geoJsonToCSV(geojson) {
    // Get the property keys (table headers) from the first feature
    const headers = Object.keys(geojson.features[0].properties);

    // Map through the features to collect the property values (table rows)
    const rows = geojson.features.map(feature =>
        headers.map(header => feature.properties[header])
    );

    // Create a CSV string
    let csvContent = `${headers.join(',')}\n` + rows.map(row => row.join(',')).join('\n');

    return csvContent;
}
// download gJSON///////////////
function downloadGeoJson(updatedGeoJSON, fileName) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(updatedGeoJSON));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}
// download CSV///////////////
function downloadCSV(csvContent, fileName) {
    // Create a blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a download link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Append the link to the body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up: remove the link element after triggering the download
    document.body.removeChild(link);
}





// save function to PostGis////////////

document.getElementById('store_data').addEventListener('click', function () {
    if (currentGeojson) {
        storeJson(currentGeojson, fileName);  // Use the correct file name
        document.querySelector('.store_data').classList.remove('show');
    }
});

// When the user clicks the "No" button, hide the confirmation dialog
function removeShow() {
    document.querySelector('.store_data').classList.remove('show');
};






// Save function ///////////////

function saveUpdatedGeoJson(updatedGeoJSON) {
    // saveToPostGIS(updatedGeoJSON);
    // Save logic (e.g., sending updated data to server or performing other operations)
    console.log('GeoJSON saved:', updatedGeoJSON);
}


async function saveToPostGIS(updatedGeoJSON) {
    try {
        const response = await fetch('/save-geojson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                 // You can send the file name for identification
                geojson: updatedGeoJSON  // Send the GeoJSON data
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert(`File  has been stored in PostGIS successfully.`);
        } else {
            alert(`Failed to store  in PostGIS: ${result.error}`);
        }
    } catch (error) {
        console.error('Error storing GeoJSON in PostGIS:', error);
        alert('An error occurred while storing the file in PostGIS.');
    }
}


// load stored files from the BD////////////////
async function loadGeoJSON() {
    try {
        const response = await fetch('/get-geojson');
        const data = await response.json();
        const geojson = data.geojson;
        const fileName = data.fileName;
        
        // Add GeoJSON to the map
        let geoData = L.geoJson(geojson)
        createGeoJSONItem(fileName, geoData, geoDataList.length - 1);
        
        alert('uploaded successfully')

    } catch (error) {
        console.error('Error loading GeoJSON:', error);
    }
}


async function storeJson(geojsonData, fileName) {
    try {
        const response = await fetch('/store-geojson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileName: fileName,  // You can send the file name for identification
                geojson: geojsonData  // Send the GeoJSON data
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert(`File "${fileName}" has been stored in PostGIS successfully.`);
        } else {
            alert(`Failed to store "${fileName}" in PostGIS: ${result.error}`);
        }
    } catch (error) {
        console.error('Error storing GeoJSON in PostGIS:', error);
        alert('An error occurred while storing the file in PostGIS.');
    }
}




// function restoreData() {


//     if (savedFile) {
//         try {
//             // Parse the saved GeoJSON data
//             const geojson = JSON.parse(savedFile);

//             // Create a layer for the saved GeoJSON data
//             csvLayer = L.geoJson(geojson, {
//                 onEachFeature: onEachFeature,
//                 coordsToLatLng: coordsToLatLng,
//                 pointToLayer: pointToLayer
//             }).addTo(map);

//             // Adjust map view to fit the bounds of the GeoJSON layer
//             mainFunction(savedFileName)


//             // Optionally, restore file name in the UI
//             if (fileNameCsv && savedFileName) {
//                 fileNameCsv.textContent = savedFileName;
//             }

//             // Show legend or other UI updates
//             setTimeout(() => {
//                 if (typeof showLegend === 'function') {
//                     showLegend();
//                 } else {
//                     console.warn('showLegend function is not defined.');
//                 }
//             }, 1000);

//             // Show the CSV item
//             if (ItemCsv) {
//                 ItemCsv.classList.add('showe');
//             }
//             alert('the file found successfully')
//         } catch (error) {
//             console.error('Failed to parse saved data:', error);
//             alert('Failed to restore file from localStorage.');
//         }
//         removeRestorePanel()
//         restoreSelectedOption()

//     } else {
//         alert('No file content found in localStorage.');
//     }
// }



























// search coordinates////////////////






var btnCo = document.querySelector('.btnCar')
var btnWgs = document.querySelector('#btnGeo')

btnCo.addEventListener('click', () => 
    searchCoord(proj)
)
btnWgs.addEventListener('click', () => 
    searchWgs()
)
   


function checkSelecProj() {
    idLabel = saveSelectedOption() 
    switch (idLabel) {
        case "1":
            
            console.log(`the value is 1`)
            break;

        case "2":

            proj = proArr[0]
            // btnCo.classList.remove('disabled');

            console.log(`the value is 2`)

            break;
        case "3":


            proj = proArr[1]
            // btnCo.classList.remove('disabled');
            console.log(`the value is 3`)

            break;
        case "4":

            proj = proArr[2]
            // btnCo.classList.remove('disabled');
            console.log(`the value is 4`)
            break;
        case "":

            proj = proArr[3]
            // btnCo.classList.remove('disabled');
            console.log(`the value is 5`)
            break;
        default:
            console.log("No value found");
    }
    return proj

}

// search coordinate//////////////


function searchCoord() {
    const pro = checkSelecProj(); // Check the selected projection
    const xValue = document.querySelector('#x');
    const yValue = document.querySelector('#y');

    // Validate the input coordinates
    if (!xValue.value || !yValue.value || isNaN(xValue.value) || isNaN(yValue.value)) {
        alert('Please enter valid coordinates.');
        return; // Exit if the inputs are not valid
    }

    const coordsArr = [parseFloat(xValue.value), parseFloat(yValue.value)];

    // Log input coordinates for debugging
    console.log(coordsArr);

    // Convert input coordinates using proj4 based on the selected projection
    const projectedCoords = proj4(spl, pro).inverse([coordsArr[0], coordsArr[1]], true);
    const lng = projectedCoords[0];
    const lat = projectedCoords[1];

    // Set map view and add marker to the converted coordinates
    map.setView([lat, lng], 12);

    const marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`
            X: ${coordsArr[0]} || Y: ${coordsArr[1]}<br>
            <br>
            <button class="remove-marker-btn btn">Rv Me</button>
        `)
        .openPopup();

    // Handle marker removal when the "Remove Marker" button is clicked
    marker.on('popupopen', function () {
        const removeBtn = document.querySelector('.remove-marker-btn');
        removeBtn.addEventListener('click', function () {
            map.removeLayer(marker); // Remove marker from the map
        });
    });

    // Clear the input values after adding the marker
    xValue.value = "";
    yValue.value = "";
}





function searchWgs() {
    var longInput = document.querySelector('#lon');
    var latInput = document.querySelector('#lat');
    var latlngArr = [longInput.value, latInput.value];

        // Check if inputs are empty or contain invalid values
        if (!longInput.value || !latInput.value || isNaN(longInput.value) || isNaN(latInput.value)) {
            alert('Please enter valid coordinates.');
            return; // Exit the function if validation fails
        }

        var latlngArr = [longInput.value, latInput.value];

        // Parse the values as numbers
        var lng = parseFloat(latlngArr[0]);
        var lat = parseFloat(latlngArr[1]);

    // Set map view to the provided lat/lng values
    map.setView([lat, lng], 12);

    // Add marker to the map
    var marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`
            Lat: ${lat} || Long: ${lng}<br>
            <br>
            <button class="remove-marker-btn btn">Rv Me</button>
        `)
        .openPopup();

    // Clear input values
    latInput.value = "";
    longInput.value = "";

    // Event delegation for removing marker
    marker.on('popupopen', function () {
        const removeBtn = document.querySelector('.remove-marker-btn');
        removeBtn.addEventListener('click', function () {
            map.removeLayer(marker); // Remove marker from the map
        });
    });
}









// Analysis tabs/////////////////////////

function showAnaTool() {
    document.querySelector('.tabs').classList.toggle('active')
}

// menu switch
let tabs = document.querySelector(".tabs");
let tabHeader = tabs.querySelector(".tab-header");
let tabBody = tabs.querySelector(".tab-body");
let tabIndicator = tabs.querySelector(".tab-indicator");
let tabHeaderNodes = tabs.querySelectorAll(".tab-header > div");
let tabBodyNodes = tabs.querySelectorAll(".tab-body > div");

for (let i = 0; i < tabHeaderNodes.length; i++) {
    tabHeaderNodes[i].addEventListener("click", function () {
        tabHeader.querySelector(".active").classList.remove("active");
        tabHeaderNodes[i].classList.add("active");
        tabBody.querySelector(".active").classList.remove("active");
        tabBodyNodes[i].classList.add("active");
        tabIndicator.style.left = `calc(calc(calc(20% - 5px) * ${i}) + 10px)`;
    });
}



// let draggableElem = document.querySelector(".tabs")

// let initialX = 0,
//     initialY = 0;
// let moveElement = false;

// //Events Object
// let events = {
//     mouse: {
//         down: "mousedown",
//         move: "mousemove",
//         up: "mouseup",
//     },
//     touch: {
//         down: "touchstart",
//         move: "touchmove",
//         up: "touchend",
//     },
// };

// let deviceType = "";

// //Detech touch device
// const isTouchDevice = () => {
//     try {
//         //We try to create TouchEvent (it would fail for desktops and throw error)
//         document.createEvent("TouchEvent");
//         deviceType = "touch";
//         return true;
//     } catch (e) {
//         deviceType = "mouse";
//         return false;
//     }
// };

// isTouchDevice();

// //Start (mouse down / touch start)
// draggableElem.addEventListener(events[deviceType].down, (e) => {
//     e.preventDefault();
//     //initial x and y points
//     initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
//     initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;

//     //Start movement
//     moveElement = true;
// });

// //Move
// draggableElem.addEventListener(events[deviceType].move, (e) => {
//     //if movement == true then set top and left to new X andY while removing any offset
//     if (moveElement) {
//         e.preventDefault();
//         let newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
//         let newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
//         draggableElem.style.top =
//             draggableElem.offsetTop - (initialY - newY) + "px";
//         draggableElem.style.left =
//             draggableElem.offsetLeft - (initialX - newX) + "px";
//         initialX = newX;
//         initialY = newY;
//     }
// });

// //mouse up / touch end
// draggableElem.addEventListener(
//     events[deviceType].up,
//     (stopMovement = (e) => {
//         moveElement = false;
//     })
// );

// draggableElem.addEventListener("mouseleave", stopMovement);
// draggableElem.addEventListener(events[deviceType].up, (e) => {
//     moveElement = false;
// });






// Set up event listeners




let selectedLayer;
let selectedLayerTwo;
let bufferLayer = null;

let intersectionResult = null;
let unionResult = null;
let buffered = null;

let selectedLayerThree;
let selectedLayerFour;
let selectedLayerOne;



// Buffer Tool/////////////
document.getElementById('tool-layer').addEventListener('change', function () {
    const selectedLayerIndex = this.value;

    if (selectedLayerIndex !== "Select Layer") {
        selectedLayer = geoDataList[selectedLayerIndex].geoData; // Get the actual GeoJSON layer
    } else {
        alert("Select a layer");
        selectedLayer = null;  // Reset selectedLayer if no valid layer is selected
    }
});

  // Initialize the bufferLayer to null

function applyBuffer() {
    let bufferDistanceInput = document.querySelector('.buffer-distance-input');
    const distance = parseFloat(bufferDistanceInput.value);

    if (isNaN(distance)) {
        alert('Please enter a valid buffer distance');
        return;
    }

    if (!selectedLayer) {
        alert('Please select a layer first.');
        return;
    }

    // Get all features from the selected layer as GeoJSON
    const featureGeoJson = selectedLayer.toGeoJSON();

    // Apply buffer to the entire layer using Turf.js
     buffered = turf.buffer(featureGeoJson, distance, { units: 'meters' });

    alert('Successfully buffered');
    document.querySelector('.buffer .row').classList.add('active');

    // If a previous bufferLayer exists, remove it from the map before adding a new one
    if (bufferLayer) {
        map.removeLayer(bufferLayer);
    }

    // Create a new buffer layer and add it to the map
    bufferLayer = L.geoJson(buffered, {
        style: {
            color: 'red',
            weight: 2,
            fillOpacity: 0.3
        }
    }).addTo(map);

    // Zoom to the buffered area
    map.flyToBounds(bufferLayer.getBounds());
    const checkbox1 = document.getElementById('s1');
    if (checkbox1 && bufferLayer) {
        toggleJSON(checkbox1, bufferLayer);
    } else {
        console.error('Checkbox or bufferLayer not found');
    }
}






// Union toool/////////
document.getElementById('tool-layer-one').addEventListener('change', function () {
    const selectedLayerIndex = this.value;

    if (selectedLayerIndex !== "Select Layer") {
        selectedLayerOne = geoDataList[selectedLayerIndex].geoData; 
        
        
    } else {
        alert("Select a layer");
        selectedLayerOne = null;  // Reset selectedLayer if no valid layer is selected
    }
});
document.getElementById('tool-layer-two').addEventListener('change', function () {
    const selectedLayerIndex = this.value;

    if (selectedLayerIndex !== "Select Layer") {
        selectedLayerTwo = geoDataList[selectedLayerIndex].geoData; 
        
        
    } else {
        alert("Select a layer");
        selectedLayerTwo = null;  // Reset selectedLayer if no valid layer is selected
    }
});




let uinoLayer = null;
function applyUnion() {
    if (!selectedLayerOne || !selectedLayerTwo) {
        alert('Please select both layers.');
        return;
    }

    const featureGeoJson = selectedLayerOne.toGeoJSON();
    const featureTwoGeoJson = selectedLayerTwo.toGeoJSON();

    const reader = new jsts.io.GeoJSONReader();
    const writer = new jsts.io.GeoJSONWriter();

    

    // Iterate over each feature in the first layer
    featureGeoJson.features.forEach(featureOne => {
        // Check if featureOne has a valid geometry and type
        if (featureOne.geometry && (featureOne.geometry.type === 'Polygon' || featureOne.geometry.type === 'MultiPolygon')) {
            try {
                const geomOne = reader.read(featureOne.geometry);  // Read the geometry of featureOne

                // Iterate over each feature in the second layer
                featureTwoGeoJson.features.forEach(featureTwo => {
                    // Check if featureTwo has a valid geometry and type
                    if (featureTwo.geometry && (featureTwo.geometry.type === 'Polygon' || featureTwo.geometry.type === 'MultiPolygon')) {
                        try {
                            const geomTwo = reader.read(featureTwo.geometry);  // Read the geometry of featureTwo

                            // Perform union using JSTS
                            const unionGeom = geomOne.union(geomTwo);
                            const unionGeoJson = writer.write(unionGeom);

                            // Accumulate union result
                            if (!unionResult) {
                                unionResult = unionGeoJson;
                            } else {
                                const accumulatedUnion = reader.read(unionResult.geometry);
                                unionResult = writer.write(accumulatedUnion.union(unionGeom));
                            }
                        } catch (error) {
                            console.error('Error reading geometry for featureTwo:', error);
                        }
                    } else {
                        console.warn('Invalid geometry in second layer:', featureTwo);
                    }
                });
            } catch (error) {
                console.error('Error reading geometry for featureOne:', error);
            }
        } else {
            console.warn('Invalid geometry in first layer:', featureOne);
        }
    });

    if (!unionResult) {
        alert('No union found between the selected layers.');
        return;
    }
    alert('successfull union')
    document.querySelector('.union .row').classList.add('active')
    // Add union result to map
    uinoLayer = L.geoJson(unionResult, {
        style: {
            color: 'blue',
            weight: 2,
            fillOpacity: 0.3
        }
    }).addTo(map);

    map.flyToBounds(uinoLayer.getBounds());
    const checkbox1 = document.getElementById('s3');
    if (checkbox1 && uinoLayer) {
        toggleJSON(checkbox1, uinoLayer);
    } else {
        console.error('Checkbox or bufferLayer not found');
    }
}





// Intersection toool///////////////////

document.getElementById('tool-layer-tree').addEventListener('change', function () {
    const selectedLayerIndex = this.value;

    if (selectedLayerIndex !== "Select Layer") {
        selectedLayerThree = geoDataList[selectedLayerIndex].geoData; 
        
        
    } else {
        alert("Select a layer");
        selectedLayerThree = null;  // Reset selectedLayer if no valid layer is selected
    }
});
document.getElementById('tool-layer-four').addEventListener('change', function () {
    const selectedLayerIndex = this.value;

    if (selectedLayerIndex !== "Select Layer") {
        selectedLayerFour = geoDataList[selectedLayerIndex].geoData; 
        
        
    } else {
        alert("Select a layer");
        selectedLayerFour = null;  // Reset selectedLayer if no valid layer is selected
    }
});



let intersectionLayer = null;
function applyIntersection() {
    if (!selectedLayerThree) {
        alert('Please select the first layer.');
        return;
    }
    if (!selectedLayerFour) {
        alert('Please select the second layer.');
        return;
    }

    // Get all features from both layers as GeoJSON
    const featureGeoJson = selectedLayerThree.toGeoJSON();
    const featureTwoGeoJson = selectedLayerFour.toGeoJSON();

    // Create JSTS geometry reader and writer
    const reader = new jsts.io.GeoJSONReader();
    const writer = new jsts.io.GeoJSONWriter();

   

    // Iterate over each feature in the first layer
    featureGeoJson.features.forEach(featureOne => {
        if (featureOne.geometry && (featureOne.geometry.type === 'Polygon' || featureOne.geometry.type === 'MultiPolygon')) {
            try {
                const geomOne = reader.read(featureOne.geometry);

                // Iterate over each feature in the second layer
                featureTwoGeoJson.features.forEach(featureTwo => {
                    if (featureTwo.geometry && (featureTwo.geometry.type === 'Polygon' || featureTwo.geometry.type === 'MultiPolygon')) {
                        try {
                            const geomTwo = reader.read(featureTwo.geometry);

                            // Perform intersection using JSTS
                            const intersectionGeom = geomOne.intersection(geomTwo);

                            if (!intersectionGeom.isEmpty()) {
                                // Convert the JSTS geometry back to GeoJSON
                                const intersectionGeoJson = writer.write(intersectionGeom);

                                // Accumulate the intersection results
                                if (!intersectionResult) {
                                    intersectionResult = intersectionGeoJson;
                                } else {
                                    const accumulatedIntersection = reader.read(intersectionResult.geometry);
                                    intersectionResult = writer.write(accumulatedIntersection.intersection(intersectionGeom));
                                }
                            } else {
                                console.log("No intersection found for these features.");
                            }
                        } catch (error) {
                            console.error("Error reading geometry for featureTwo:", error);
                        }
                    } else {
                        console.warn("Invalid geometry in second layer feature:", featureTwo);
                    }
                });
            } catch (error) {
                console.error("Error reading geometry for featureOne:", error);
            }
        } else {
            console.warn("Invalid geometry in first layer feature:", featureOne);
        }
    });

    if (!intersectionResult) {
        alert('No intersection found between the selected layers.');
        return;
    }

    alert('Successful intersection')
    // document.querySelector('.row').classList.add('active')
    // Add the intersection result to the map as a new layer
    intersectionLayer = L.geoJson(intersectionResult, {
        style: {
            color: 'blue',
            weight: 2,
            fillOpacity: 0.3
        }
    }).addTo(map);
    document.querySelector('.intersection .row').classList.add('active')

    // Zoom to the intersection result area
    map.flyToBounds(intersectionLayer.getBounds());
    const checkbox1 = document.getElementById('s2');
    if (checkbox1 && intersectionLayer) {
        toggleJSON(checkbox1, intersectionLayer);
    } else {
        console.error('Checkbox or bufferLayer not found');
    }
}



// show atbs function downlaod and switch/////////////
 
function toggleJSON(checkbox, geojsonLayer) {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            // Add the layer to the map when the checkbox is checked
            geojsonLayer.addTo(map);
            map.flyToBounds(geojsonLayer.getBounds(), { padding: [12, 12] });
        } else {
            // Remove the layer from the map when the checkbox is unchecked
            map.removeLayer(geojsonLayer);
        }
    });
}

document.querySelector('.buffer span.btn').addEventListener('click', () => downloadGeoJSON(buffered, 'buffered_layer.geojson'));
document.querySelector('.union span.btn').addEventListener('click', () => downloadGeoJSON(unionResult, 'union_layer.geojson'));
document.querySelector('.intersection span.btn').addEventListener('click', () => downloadGeoJSON(intersectionResult, 'intersection_layer.geojson'));

// Function to download GeoJSON
function downloadGeoJSON(geojsonData, fileName) {
    if (!geojsonData) {
        alert('No data available to download');
        return;
    }

    const blob = new Blob([JSON.stringify(geojsonData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'layer.geojson'; // Set the download file name, fallback if not provided
    document.body.appendChild(link);
    link.click();

    // Clean up after the download
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


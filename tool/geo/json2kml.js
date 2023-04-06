var GeoJSON = require("geojson");
var tokml = require('@maphubs/tokml')

const data = {};

const points = Object.keys(data)
  .sort((k1, k2) => data[k1]["timestamp"] > data[k2]["timestamp"])
  .map(key => {
    return {
      "latitude": data[key]["latitude"],
      "longitude": data[key]["longitude"],
    };
  });

const geojsonObject = GeoJSON.parse(
  points,
  {
    Point: ["latitude", "longitude"],
  });

const response = tokml(geojsonObject);
console.log(response);

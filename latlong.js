const fetch = require('node-fetch')

// center postcodes, user postcode, radius 
getPostcodesInRadius(['CB74LA', 'CB40WZ'], 'CB74AF', 10).then(data => console.log(data));

function getPostcodesInRadius(centerPostcodes, postcode, radius) {
    centerArr = [];
    centerPostcodes.forEach(postcode => {
        centerArr.push(getCoordinates(postcode));
    })

    return Promise.all(centerArr).then(values => {
        return getCoordinates(postcode).then(postcodeData => {
            const centersInRadius = [];
            values.forEach(centerPostcode => {
                const distance = getDistanceFromLatLonInKm(centerPostcode, postcodeData);
                if (distance < radius) {
                    centersInRadius.push({postcode: centerPostcode.postcode, distance: distance});
                }
            });
            return centersInRadius;
        });
    });
}

// supporting functions

async function getCoordinates(postcode){
    return new Promise((resolve, reject) => {
        fetch(`https://api.postcodes.io/postcodes/${postcode}`)
          .then(response => response.json())
          .then(data => {
              const latlong = {postcode: postcode, latitude: data.result.latitude, longitude: data.result.longitude};
              resolve(latlong);
          });
    });
}

function getDistanceFromLatLonInKm(location1, location2) {
    const EARTH_RADIUS = 6371;
    const dLat = deg2rad(location1.latitude - location2.latitude);
    const dLon = deg2rad(location1.longitude - location2.longitude);
    const a = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(deg2rad(location1.latitude)) * Math.cos(deg2rad(location1.longitude)) * Math.pow(Math.sin(dLon / 2), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = EARTH_RADIUS * c;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

module.exports = getPostcodesInRadius;
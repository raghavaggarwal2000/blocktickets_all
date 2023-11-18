
//returns latitude and longitude
export const getGeoCoordinates = async () => {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  var latitude,longitude;
  function success(pos) {
    var crd = pos.coords;
  
    // //console.log('Your current position is:');
    // //console.log(`Latitude : ${crd.latitude}`);
    // //console.log(`Longitude: ${crd.longitude}`);
    // //console.log(`More or less ${crd.accuracy} meters.`);

    // //console.log(crd);
    latitude = crd.latitude;
    longitude = crd.longitude;
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.getCurrentPosition(success, error, options);


  return {
    latitude:latitude,
    longitude:longitude
  }
}
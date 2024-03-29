var MIN_LAT = de_ra(-90.0); 	
var MAX_LAT = de_ra(90.0);
var MIN_LON = de_ra(-180.0); 
var MAX_LON = de_ra(180.0);
var RADIUS = 6371.010; //km

function ra_de(val) {
	var pi = Math.PI;
	return (val)*(180/pi);
}

function de_ra(val) {
	var pi = Math.PI;
	return (val)*(pi/180);
}

function distancia(lat1, lon1, lat2, lon2) {
	var RADIUS = 6371.010; // km
	var dLat = de_ra(lat2 - lat1);
	var dLon = de_ra(lon2 - lon1);
	var lat1 = de_ra(lat1);
	var lat2 = de_ra(lat2);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2)
			* Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = RADIUS * c;
	return d;
}

function boundingCoordinates(lat, lon, distance) {
		var radLat = de_ra(lat);
		var radLon = de_ra(lon);
		var radDist = distance / RADIUS;
		var minLat = radLat - radDist;
		var maxLat = radLat + radDist;
		var minLon, maxLon;
		if (minLat > MIN_LAT && maxLat < MAX_LAT) {
			var deltaLon = Math.asin(Math.sin(radDist) /
				Math.cos(radLat));
			minLon = radLon - deltaLon;
			if (minLon < MIN_LON) minLon += 2.0 * Math.PI;
			maxLon = radLon + deltaLon;
			if (maxLon > MAX_LON) maxLon -= 2.0 * Math.PI;
		} else {
			// a pole is within the distance
			minLat = Math.max(minLat, MIN_LAT);
			maxLat = Math.min(maxLat, MAX_LAT);
			minLon = MIN_LON;
			maxLon = MAX_LON;
		}
		minLat = ra_de(minLat);
		maxLat = ra_de(maxLat);
		minLon = ra_de(minLon);
		maxLon = ra_de(maxLon);
		var rect = {
				minLa : minLat,
				minLo : minLon,
				maxLa : maxLat,
				maxLo : maxLon
		}
		return rect;
	}
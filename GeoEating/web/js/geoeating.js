var map;
var directionDisplay;
var directionsService;
var restaurantes = [];
var tempDest;
var circulo;
var op;
var fonte;
var destino;
var geocoder;
var inicializado;
var geocodeResults;

function initialize() {
	if (document.getElementById("checkRestaurantsLayer")) {
		document.getElementById("checkRestaurantsLayer").checked="";
	}
	
	incializado = false;
	geocoder = new google.maps.Geocoder();
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsService = new google.maps.DirectionsService();

	var latlng = new google.maps.LatLng(-7.231018, -35.881348);
	tempDest = new google.maps.Marker({
		position : null,
		map : null,
		title : "Origem"
	});

	var myOptions = {
		  zoom: 13,
		  minZoom:0,
		  center: latlng,
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		  scaleControl: true
	};

	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	google.maps.event.addListener(map, 'bounds_changed', function(event) {
		if(inicializado){
			updateMapLayers();
		}
	});
	google.maps.event.addListener(map, 'click', function(event) {
		limpa();
		if (op == 1) {
			op = 0;
			fonte = -1;
			destino = -1;
			lastClick = event.latLng;
			abreCadastro();
		} else if (op == 2) {
			tempDest = new google.maps.Marker({
				position : event.latLng,
				map : map,
				title : "Origem"
			});
			fonte = event.latLng;
		} else if (op == 3) {
			var dist = prompt("Digite a distancia tolerada (em km)", "");
			if (dist == null) {
				return;
			} else if (!isFinite(dist)) {
				alert("Valor invalido!");
				return;
			}
			var posicao = event.latLng;
			circulo = new google.maps.Circle({
				center : posicao,
				radius : dist * 1000,
				clickable : false,
				strokeColor : "#FF0000",
				strokeOpacity : 0.8,
				strokeWeight : 2,
				fillColor : "#FF0000",
				fillOpacity : 0.35
			});
			map.fitBounds(circulo.getBounds());
			circulo.setMap(map);
			op = 0;
		}
	});
}

function limpa() {
	directionsDisplay.setMap(null);
	directionsDisplay.setPanel(null);
	
	if (tempDest) {
		tempDest.setMap(null);
	}

	if (circulo) {
		circulo.setMap(null);
		circulo = null;
	}
	
	if (geocodeResults) {
		geocodeResults = [];
	}

	if (restaurantes) {
		for (i in restaurantes) {
			restaurantes[i].m.setIcon(getIconName(restaurantes[i]));
		}
	}
}

function getIconName(restaurante) {
	if (geocodeResults) {
		// consulta 6
		for (i in geocodeResults) {
			if (geocodeResults[i].geometry.bounds.contains(restaurante.m.getPosition()) && restaurante.wait == 0) {
				return "images/target.png";
			}
		}
	} 
	if (circulo) {
		// consulta 1
		if (distancia(restaurante.m.getPosition().lat(), restaurante.m.getPosition().lng(), circulo.getCenter().lat(), circulo.getCenter().lng()) <= (circulo.getRadius()/1000)) {
			return "images/target.png";
		}
	} 
	if (restaurante.foodTypes.length > 1) {
		return "images/food.png";
	}
	if (restaurante.foodTypes.length == 0) {
		return "images/question.png";
	} 
	if (restaurante.foodTypes[0] == "Regional") {
		return "images/regional.png";
	} 
	if (restaurante.foodTypes[0] == "Japonesa") {
		return "images/sushi.png";
	} 
	if (restaurante.foodTypes[0] == "Chinesa") {
		return "images/chinesa.png";
	} 
	if (restaurante.foodTypes[0] == "Italiana") {
		return "images/pizza.png";
	} 
	if (restaurante.foodTypes[0] == "FastFood") {
		return "images/hamburguer.png";
	} 
	if (restaurante.foodTypes[0] == "Lanche") {
		return "images/hamburguer.png";
	} 
	if (restaurante.foodTypes[0] == "Outras") {
		return "images/outros.png";
	} 
	return "images/question.png";
}

function procurarPorEnd() {
	var end = prompt("Digite o endereço:", "");
	if (end == null) {
		return;
	}
	limpa();

	end += ", Campina Grande, Paraiba, Brasil";

	geocoder.geocode({'address' : end}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			geocodeResults = results;
			if (results) {
				map.setCenter(results[0].geometry.location);
			}
		} else {
			alert("Erro: " + status);
		}
	});
}

function restaurantesProximos() {
	limpa();
	op = 3;
}

function novoRestaurante() {
	limpa();
	op = 1;
}

function calculaRota() {
	limpa();
	fonte = -1;
	destino = -1;
	op = 2;
}

function calcRoute(fonte, destino) {
	var panel = document.getElementById("directionsPanel");
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(panel);
	var request = {
		origin : fonte,
		destination : destino,
		travelMode : google.maps.DirectionsTravelMode.DRIVING
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
	});
	op = 0;
	apagaTemp();
}

function apagaTemp() {
	tempDest.setMap(null);
}
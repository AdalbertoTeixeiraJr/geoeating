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

function initialize() {
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
			
			//placeMarker(event.latLng);
			op = 0;
			fonte = -1;
			destino = -1;
			lastClick = event.latLng;
			abreCadastro();
			//map.setCenter(event.latLng);
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
			if (restaurantes) {
				for (i in restaurantes) {
					if (circulo.getBounds().contains(
							restaurantes[i].getPosition())) {
						restaurantes[i].setIcon("images/target.png");
					}
				}
			}
			map.fitBounds(circulo.getBounds());
			circulo.setMap(map);
		}
	});
}

function salvaCadastro(nome, descricao, endereco, tel, comida) {
}

function placeMarker(location) {
	var clickedLocation = new google.maps.LatLng(location);
	var marker = new google.maps.Marker({
		position : location,
		map : map,
		title : "Restaurante",
		icon : "images/rest.png"
	});

	google.maps.event.addListener(marker, 'click', function(event) {
		if (op == 2) {
			destino = event.latLng;
			if (fonte != -1) {
				calcRoute(fonte, destino);
			}
		}
	});
	map.setCenter(location);
	restaurantes.push(marker);
}

function limpa() {
	directionsDisplay.setMap(null);
	directionsDisplay.setPanel(null);
	
	if (tempDest) {
		tempDest.setMap(null);
	}

	if (circulo) {
		circulo.setMap(null);
	}

	if (restaurantes) {
		for (i in restaurantes) {
			restaurantes[i].setIcon("images/rest.png");
		}
	}
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
			if (restaurantes) {
				for (i in restaurantes) {
					if (results[0].geometry.bounds.contains(restaurantes[i].getPosition())) {
						restaurantes[i].setIcon("images/target.png");
					}
				}
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
var map;
var directionDisplay;
var directionsService;
var amigos = [];
var restaurantes = [];
var tempDest;
var circulo;
var op;
var fonte;
var destino;
var geocoder;
var inicializado;
var geocodeResults;
var convexHull;

var lastClick;
var customMapType;
var rasterOptions;
var layers = [];
var workspace = "geoeating";
var tiposComida = ["Regional","Japonesa","Italiana","Chinesa","FastFood","Lanche","Outras"];

function initialize() {
	if (document.getElementById("checkRestaurantsLayer")) {
		document.getElementById("checkRestaurantsLayer").checked="";
	}
	if (document.getElementById("checkAmigos")) {
		document.getElementById("checkAmigos").checked="";
	}
	updateFiltros();
	
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
			openDialog("#dialogCadastros",520,280);
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
		} else if (op == 4) {
			addAmigo(event.latLng);
		}
	});
}

function updateFiltros() {
	var restauranteChecked = false;
	if (document.getElementById("checkRestaurantsLayer")) {
		restauranteChecked = document.getElementById("checkRestaurantsLayer").checked;
	}
	var checkSemFila = document.getElementById("checkSemFila");
	if (checkSemFila) {
		checkSemFila.disabled=!restauranteChecked;
	}
	for (j in tiposComida) {
		var checkBox = document.getElementById("check" + tiposComida[j]);
		if (checkBox) {
			checkBox.disabled=!restauranteChecked;
			checkBox.checked=restauranteChecked;
		}
	}
}

function filtra() {
	var checkSemFila = document.getElementById("checkSemFila");
	if (restaurantes) {
		for (i in restaurantes) {
			var r = restaurantes[i];
			var show = true;
			if (checkSemFila && checkSemFila.checked && r.wait != 0) {
				show = false;
			} else {
				var possuiAlgumaComidaSelecionada = false;
				for (j in tiposComida) {
					var checkBox = document.getElementById("check" + tiposComida[j]);
					if (checkBox && checkBox.checked) {
						if (possuiComida(r,tiposComida[j])) {
							possuiAlgumaComidaSelecionada = true;
							break;
						}
					}
				}
				show = possuiAlgumaComidaSelecionada;
			}
		
			if (show) {
				r.m.setMap(map);
			} else {
				r.m.setMap(null);
			}
		}
	}
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
	
	if (convexHull) {
		convexHull.setMap(null);
		convexHull = null;
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
			if (geocodeResults[i].geometry.bounds.contains(restaurante.m.getPosition())) {
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
		return "images/fritas.png";
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

function possuiComida(restaurante,tipo) {
	if (restaurante) {
		for (i in restaurante.foodTypes) {
			if (restaurante.foodTypes[i]==tipo) {
				return true;
			}
		}
	}
	return false;
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

function verAreaDoTipoDeComida() {
	limpa();
	
	pegaLayer(workspace,"foodkindconvexhull","convexhull",callbackConvexHull);
}

function adicionaAmigo() {
	limpa();
	op = 4;
	document.getElementById("checkAmigos").checked = true;
	filtraAmigos();
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

// que tavam no html
function updateMapLayers(){
	limpaPlacemarks();
	if(layers && layers.length>0){
		for(i in layers){
			pegaLayer(workspace,layers[i].layer,layers[i].geomColumn,callbackWFS);
		}
	}
}

function limpaPlacemarks(){
	if (restaurantes) {
		for(j in restaurantes){
			restaurantes[j].m.setMap(null);
		}
	}
	restaurantes = [];
}

function addFoodType(restaurante,foodType) {
	for (i in restaurante.foodTypes) {
		if (restaurante.foodTypes[i]==foodType) {
			return;
		}
	}
	restaurante.foodTypes.push(foodType);
}

function callbackWFS(responseXML, status,workspace,layer,geomColumn){
	var wfsCollection = responseXML.firstChild;
	if(wfsCollection.nodeName == "wfs:FeatureCollection"){
		var wfsChilds = wfsCollection.childNodes;
		for(var i=0;i<wfsChilds.length;i++){
			var node = wfsChilds.item(i);
			if(node.nodeName == "gml:featureMember"){
				var camada = node.firstChild;
				if(camada.nodeName == workspace+":"+layer){
					parseRestaurant(camada,workspace,geomColumn);
				}
			}
		}
	}
	setStylesForMarkers();
	filtra();
}

function callbackConvexHull(responseXML,status,workspace,layer,geomColumn){
	var wfsCollection = responseXML.firstChild;
	var tipoComidaSelecionado = document.getElementById("selectComida").value;
	if(wfsCollection.nodeName == "wfs:FeatureCollection"){
		var wfsChilds = wfsCollection.childNodes;
		for(var i=0; i < wfsChilds.length; i++){
			var node = wfsChilds.item(i);
			if(node.nodeName == "gml:featureMember"){
				var camada = node.firstChild;
				var geom = null;
				var tipo = null;
				if (camada.nodeName == workspace+":"+layer) {
					for (var j=0; j < camada.childNodes.length; j++){
						var child = camada.childNodes.item(j);
						if(child.nodeName == workspace+":name") {
							tipo = child.textContent;
						} else if (child.nodeName == workspace+":"+geomColumn) {
							geom = child;
						}
					}
				}
				if (tipo == tipoComidaSelecionado) {
					parseConvexHull(tipo,geom);
				}
			}
		}
	}
}

function setStylesForMarkers() {
	if (restaurantes) {
		for (i in restaurantes) {
			var r = restaurantes[i];
		    var contentString = '<p><b>Nome: </b> ' + r.name + '</p>';
		    contentString += '<p><b>Descri&ccedil;&atilde;o: </b> ' + r.description + '</p>';
		    contentString += '<p><b>Tipos de Comida: </b> ' + r.foodTypes.toString() + '</p>';
		    contentString += '<p><b>Quantidade em Espera: </b> ' + r.wait + '</p>';
		    contentString += '<p><b>Telefone: </b> ' + r.tel + '</p>';
		    contentString += '<p><b>Endere&ccedil;o WEB: </b> <a href="' + r.web + '">' + r.web + '</a></p>';
		    r.info.setContent(contentString);
		    r.m.setIcon(getIconName(r));
		}
	}
}

function parseConvexHull(tipo,geomNode) {
	var points = [];
	if(geomNode.firstChild.firstChild.firstChild.firstChild){
		var coords = geomNode.firstChild.firstChild.firstChild.firstChild;
		if(coords.nodeName == "gml:coordinates"){
			var pointsStr = coords.textContent.split(" ");
			for (i in pointsStr) {
				var pointStr = pointsStr[i].split(",");
				lon = new Number(pointStr[0]);
				lat = new Number(pointStr[1]);
				points.push(new google.maps.LatLng(lat,lon));
			}
		}
	}
	
	convexHull = new google.maps.Polygon({
	      paths: points,
	      strokeColor: "#FF0000",
	      strokeOpacity: 0.8,
	      strokeWeight: 2,
	      fillColor: "#FF0000",
	      fillOpacity: 0.35
	    });
	convexHull.setMap(map);
	
	closeDialog();
}

function parseRestaurant(node,workspace,geomColumn){
	var childNodes = node.childNodes;
	var lat;
	var lon;
	var nome = "";
	var filaDeEspera = "";
	var descricao = "";
	var telefone = "";
	var end_web = "";
	var tipo_comida = "";
	var id = "";
	
	for(var i=0;i<childNodes.length;i++){
		var child = childNodes.item(i);
		if(child.nodeName == workspace+":"+geomColumn){
			if(child.firstChild.firstChild){
				var coords = child.firstChild.firstChild;
				if(coords.nodeName == "gml:coordinates"){
					var coord = coords.textContent.split(",");
					lon = new Number(coord[0]);
					lat = new Number(coord[1]);
				}
			}
		} else if (child.nodeName == workspace+":name"){
			nome = child.textContent;
		} else if (child.nodeName == workspace+":qtt_waiting"){
			filaDeEspera = child.textContent;
		} else if (child.nodeName == workspace+":description"){
			descricao = child.textContent;
		} else if (child.nodeName == workspace+":tel"){
			telefone = child.textContent;
		} else if (child.nodeName == workspace+":end_web"){
			end_web = child.textContent;
		} else if (child.nodeName == workspace+":fkname") {
			tipo_comida = child.textContent;
		} else if (child.nodeName == workspace+":id") {
			id = child.textContent;
		}
	}

	var location = new google.maps.LatLng(lat,lon);
	var restaurante = getRestauranteByLocation(location);
	if (restaurante != null) { // restaurante ja foi criado, apenas adiciona o tipo de comida
		addFoodType(restaurante,tipo_comida);
		return;
	}

	var marker = new google.maps.Marker({
		position : location,
		map : map,
		title : nome
	});
	
    var infowindow = new google.maps.InfoWindow({
        content: ""
    });

	google.maps.event.addListener(marker, 'click', function(event) {
		if (op == 2) {
			destino = event.latLng;
			if (fonte != -1) {
				// consulta 2
				calcRoute(fonte, destino);
			}
		} else {
		    infowindow.open(map, marker);
		}
	});

	google.maps.event.addListener(marker, 'dblclick', function(event) {
		var novaFila = prompt("Digite a fila de espera do restaurante:", "");
		if (novaFila != null) {
			atualizarFila(id, novaFila);
		}
	});
	
	restaurante = {
			name : nome,
			description : descricao,
			wait : parseInt(filaDeEspera),
			m : marker,
			tel : telefone,
			web : end_web,
			foodTypes : [],
			info : infowindow
	};
	addFoodType(restaurante,tipo_comida);
	restaurantes.push(restaurante);
}

function getRestauranteByLocation(location) {
	if (restaurantes) {
		for (i in restaurantes) {
			var r = restaurantes[i];
		    if (r.m.getPosition().lat()==location.lat() && r.m.getPosition().lng()==location.lng()) {
		    	return r;
		    }
		}
	}
	return null;
}

function pegaLayer(workspace,camada,geomColumn,callback){
	var bbox = getBbox();
	var layer = workspace+":"+camada;
	var url = "http://localhost:8080/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName="+layer+"&styles=&bbox="+bbox;
	url = url+"&srs=EPSG:4326";
	downloadUrl(url,callback,null,workspace,camada,geomColumn);
}

function setCentro(ponto) {
	if (map) {
		map.setCenter(ponto);
	}
}

function getBbox(){
	var bounds = map.getBounds();
	var coords = bounds.toUrlValue(4).split(",");
	var aux = coords[0];
	coords[0] = coords[1];
	coords[1] = aux;

	aux = coords[2];
	coords[2] = coords[3];
	coords[3] = aux;
	return coords.toString();
	
}

function addLayer(input,layer,geomColumn){
	inicializado = true;
	var checked = input.checked;
	for(i in layers){
		if(layers[i].layer == layer){
			layers.splice(i,1);
		}
	}
	addLayerOnMap(checked,layer,geomColumn);
}

function addLayerOnMap(checked,layer,geomColumn) {
	if(checked){
		layers.push({"layer":layer, "geomColumn":geomColumn});
	}
	updateMapLayers();
}

function addAmigo(position) {
	var markerAmigo = new google.maps.Marker({
		position : position,
		title : "Amigo",
		icon : "images/hungry.png"
	});
	google.maps.event.addListener(markerAmigo, 'click', function(event) {
		if (op != 2) {
			markerAmigo.setMap(null);
		    for(var i=0; i<amigos.length;i++) {
				if(amigos[i]==markerAmigo) {
				    amigos.splice(i,1);
				}
		    }
		}
	});
	setMapMarkerAmigo(markerAmigo);
	amigos.push(markerAmigo);
}

function filtraAmigos() {
	if (amigos) {
		for (i in amigos) {
			setMapMarkerAmigo(amigos[i]);
		}
	}
}

function setMapMarkerAmigo(marker) {
	var checkAmigos = document.getElementById("checkAmigos").checked;
	if (checkAmigos) {
		marker.setMap(map);
	} else {
		marker.setMap(null);
	}
}
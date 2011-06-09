function ajaxInit() {
	var req;
	req = new XMLHttpRequest();
	return req;
}

function verificaCaratere(tel) {
	var input = document.getElementById(tel);
	if (input.value.length > 0) {
		var ultimoChar = input.value.charAt(input.value.length - 1);
		if (ultimoChar != '0' && ultimoChar != '1' && ultimoChar != '2'
				&& ultimoChar != '3' && ultimoChar != '4' && ultimoChar != '5'
				&& ultimoChar != '6' && ultimoChar != '7' && ultimoChar != '8'
				&& ultimoChar != '9') {
			input.value = replaceAll(input.value, ultimoChar, "");
		}
	}
}

function replaceAll(string, token, newtoken) {
	while (string.indexOf(token) != -1) {
		string = string.replace(token, newtoken);
	}
	return string;
}

function cadastra() {
	var nome = document.getElementById('nome').value;
	var dadosOk = false;
	var descri = document.getElementById('descri').value;
	var endereco = document.getElementById('endereco').value;
	var tel = document.getElementById('tel').value;
	var tipos = new Array();
	if (document.getElementById('comidaRegional').checked) {
		tipos[0] = document.getElementById('comidaRegional').value.toString();
	} else {
		tipos[0] = "";
	}
	if (document.getElementById('comidaJaponesa').checked) {
		tipos[1] = document.getElementById('comidaJaponesa').value.toString();
	} else {
		tipos[1] = "";
	}
	if (document.getElementById('comidaItaliana').checked) {
		tipos[2] = document.getElementById('comidaItaliana').value.toString();
	} else {
		tipos[2] = "";
	}
	if (document.getElementById('comidaChin').checked) {
		tipos[3] = document.getElementById('comidaChin').value.toString();
	} else {
		tipos[3] = "";
	}
	if (document.getElementById('comidaFastFood').checked) {
		tipos[4] = document.getElementById('comidaFastFood').value.toString();
	} else {
		tipos[4] = "";
	}
	if (document.getElementById('comidaLanche').checked) {
		tipos[5] = document.getElementById('comidaLanche').value.toString();
	} else {
		tipos[5] = "";
	}

	if (document.getElementById('comidaOutras').checked) {
		tipos[6] = document.getElementById('comidaOutras').value.toString();
	} else {
		tipos[6] = "";
	}
	var dadosOk = (lastClick != null);
	dadosOk = dadosOk && nome != '';
	var tiposOk = (tipos[0] != '' || tipos[1] != '' || tipos[2] != ''
			|| tipos[3] != '' || tipos[4] != '' || tipos[5] != '' || tipos[6] != '');
	if (dadosOk && tiposOk) {
		var tiposAtt = "" + tipos[0] + " " + tipos[1] + " " + tipos[2] + " "
				+ tipos[3] + " " + tipos[4] + " " + tipos[5] + " " + tipos[6];
		var latLongStr = "" + lastClick;
		latLongStr = latLongStr.replace("(", "");
		latLongStr = latLongStr.replace(")", "");
		latLongStr = latLongStr.replace(",", " ");
		var urlWithoutParams = "http://localhost:8080/geoeating/cadastrar.action?";
		var url = urlWithoutParams + "name=" + nome.toString();
		url = url + "&description=" + descri.toString();
		url = url + "&tel=" + tel.toString();
		url = url + "&endWeb=" + endereco.toString();
		url = url + "&tiposFood=" + tiposAtt.toString().replace(",", " ");
		url = url + "&latLong=" + latLongStr.toString() + "";
		var wmDiv = document.getElementById("resultado");
		ajax = ajaxInit();
		ajax.open("GET", url, true);
		ajax.onreadystatechange = function() {
			// readyState==1 Indica que está carregando, nessa hora que
			// colocamos aquele Loading...
			if (ajax.readyState == 4) {
				if (ajax.responseText == "1") {
					alert('Restaurante Cadastrado');
					closeDialog();
					setCentro(lastClick);
				} else {
					alert('Cadastro não pode ser realizado.\nVerifique os dados fornecidos e tente novamente.');
				}
			}
		}

		ajax.send(null);
	}
}
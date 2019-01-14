// Löst Tabellennamen in ihre Typen auf, damit die Oberfläche weiß wie sie mit verschiedenen Daten umgehen soll.
export function resolveDataType(key) {
	switch (key) {
		case "id":
			return("id");
		case "date":
			return("date");
		default:
			return("text");
	}
}

// Extrahiert den ID-Schlüssel aus einem Datensatz
export function getIdKey(data) {
	let id = null;
	if (Array.isArray(data)) {
		data = data[0];
	}
	if (data) {
		const keys = Object.entries(data);
		for (let i = 0; i < keys.length; i++) {
			if (resolveDataType(keys[i][0]) === "id") {
				id = keys[i][0];
				break;
			}
		}
	}
	return id;
}

// Formatiert die Schlüssel aus einem Array
export function formatKeys(arrayKeys) {
	let resultArray = [];
	for (let index in arrayKeys) {
		resultArray.push(formatKey(arrayKeys[index]));
	}
	return resultArray;
}

// Formatiert einen mitgelieferten String. Wird benutzt um eine benutzerfreundliche Darstellung zu ermöglichen.
export function formatKey(key) {
	switch (key) {
		case "id":
			return("ID");
		default:
			return(capitalize(key));
	}
}

// Extrahiert die Schlüssel eines Objekts aus einem Datensatz
export function getKeys(data, format=true) {
	let keys = [];
	if (data && data.length > 0) {
		if (Object.keys(data[0])[0] === 'column_name') {
			if (format) {
				for (let i = 0; i < data.length; i++) {
					keys.push(formatKey(Object.entries(data[i])[0][1]));
				}
			}
			else {
				for (let i = 0; i < data.length; i++) {
					keys.push(Object.entries(data[i])[0][1]);
				}
			}
		}
		else if (format) {
			keys = formatKeys(Object.keys(data[0]));
		}
		else {
			keys = (Object.keys(data[0]));
		}

	}
	return keys;
}

export function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// Formatiert ein Datum
export function formatData(date) {
	let dateSplit = date.split("-");
	if (dateSplit.length !== 3) {
		console.log("Date in wrong format: "+date);
		return date;
	}
	else {
		return (dateSplit[2] + "." + dateSplit[1] + "." + dateSplit[0]);
	}
}

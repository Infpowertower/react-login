export function doRequest(url, method, data, callback) {
    return new Promise((resolve,reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status.toString().charAt(0) === '2') {
                    if (callback) callback(xhr);
                    resolve(xhr);
                } else {
                    if (callback) callback(xhr);
                    reject(xhr)
                }
            }
        };
        xhr.open(method, url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.responseType = "json";
        xhr.send(JSON.stringify(data));
    })
}
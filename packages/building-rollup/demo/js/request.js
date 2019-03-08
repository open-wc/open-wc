export default url =>
  new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          resolve(xhttp.responseText);
        } else {
          reject(new Error(`Request to ${url} failed with ${xhttp.status}`));
        }
      }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
  });

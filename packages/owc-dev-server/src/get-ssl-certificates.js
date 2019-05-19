/* eslint-disable global-require, no-console */
const fs = require('fs');
const path = require('path');

function getSslCertificates(userSslKeyPath, userSslCertPath) {
  const sslDir = path.join(__dirname, '..', '.ssl');
  const keyPath = path.join(sslDir, 'server.key');
  const certPath = path.join(sslDir, 'server.cert');
  let sslKey;
  let sslCert;

  if ((userSslKeyPath && !userSslCertPath) || (userSslCertPath && !userSslKeyPath)) {
    throw new Error(`You must provide both --ssl-key and --ssl-path.`);
  }

  try {
    // read user's ssl key and cert if given
    if (userSslKeyPath && userSslCertPath) {
      sslKey = fs.readFileSync(userSslKeyPath);
      sslCert = fs.readFileSync(userSslCertPath);
    } else if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      // read generated certificates if cached
      sslKey = fs.readFileSync(keyPath);
      sslCert = fs.readFileSync(certPath);
    } else {
      // otherwise generate the certificates ourselves
      const selfsigned = require('selfsigned');
      const keys = selfsigned.generate();

      sslKey = keys.private;
      sslCert = keys.cert;

      try {
        fs.writeFileSync(keyPath, sslKey);
        fs.writeFileSync(certPath, sslCert);
      } catch (error) {
        // inform the user, but let the program continue since writing to disk is not mandatory
        console.error(`Something went wrong while saving certificates: ${error.message}`);
      }
    }
  } catch (error) {
    throw new Error(`Error while reading or generating SSL certificates: ${error.message}`);
  }

  return { sslKey, sslCert };
}

module.exports = getSslCertificates;

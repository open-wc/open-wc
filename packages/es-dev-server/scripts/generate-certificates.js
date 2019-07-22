/* eslint-disable-next-line import/no-extraneous-dependencies */
const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

const keys = selfsigned.generate();

const dir = path.join(__dirname, '..');
fs.writeFileSync(path.join(dir, '.self-signed-dev-server-ssl.key'), keys.private);
fs.writeFileSync(path.join(dir, '.self-signed-dev-server-ssl.cert'), keys.cert);

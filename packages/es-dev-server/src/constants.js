export const compatibilityModes = {
  NONE: 'none',
  AUTO: 'auto',
  ALWAYS: 'always',
  MIN: 'min',
  MAX: 'max',
};

export const polyfillsModes = {
  NONE: 'none',
  AUTO: 'auto',
};

export const virtualFilePrefix = '/__es-dev-server__/';

export const messageChannelEndpoint = `${virtualFilePrefix}message-channel`;

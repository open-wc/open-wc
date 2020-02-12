import { dedupeMixin } from '../../index.js';
import { LoggingMixin as source } from '../no-dedupe/LoggingMixin.js';

export const LoggingMixin = dedupeMixin(source);

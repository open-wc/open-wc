import { roles } from 'aria-query';
import { implicitRoles } from './implicitRoles.js';

/**
 * Returns an element's implicit role given its attributes and type.
 * Some elements only have an implicit role when certain props are defined.
 */
export const getImplicitRole = (type, attributes) => {
  let implicitRole;
  if (implicitRoles[type]) {
    implicitRole = implicitRoles[type](attributes);
  }
  if (roles.has(implicitRole)) {
    return implicitRole;
  }
  return null;
};

// inject into node_modules/haunted/lib/component.js
// static __renderer__ = renderer;

// static hotReplaceCallback(newClass) {
//     updateObjectMembers(Element, newClass);
//     updateObjectMembers(Element.prototype, newClass.prototype);
// }

// hotReplaceCallback(newClass) {
//     this._scheduler.renderer = newClass.__renderer__;
//     this._scheduler.update();
// }

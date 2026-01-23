/** @type {string} */
export const MODULE_ID = "%config.id%";

/** @type {string} */
export const MODULE_ABBREVIATION = MODULE_ID.split("-").map((x) => x.substring(0, 1)).join("");

/** @type {string} */
export const MODULE_TITLE = "%config.title%";

/** @type {string} */
export const LANG_ID = MODULE_ID.toUpperCase();

/** @type {string} */
export const TEMPLATES_FOLDER = `modules/${MODULE_ID}/templates`;

/** @type {string} */
export const ICONS_FOLDER = `modules/${MODULE_ID}/static/icons`;

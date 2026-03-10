import { LANG_ID, MODULE_ID, SETTINGS } from "./constants.mjs";

const { NumberField } = foundry.data.fields;

export function registerSettings() {
  game.settings.register(MODULE_ID, SETTINGS.MESSAGE_RETENTION, {
    name: `${LANG_ID}.SETTINGS.${SETTINGS.MESSAGE_RETENTION}.name`,
    hint: `${LANG_ID}.SETTINGS.${SETTINGS.MESSAGE_RETENTION}.hint`,
    scope: "world",
    config: true,
    type: new NumberField({
      initial: 100,
      integer: true,
      nullable: false,
    }),
    requiresReload: false,
  });
}

export function getModuleSetting(id) {
  return game.settings.get(MODULE_ID, id);
}

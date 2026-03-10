import "./less/furtherv-clean-chat.less";
import { SETTINGS } from "./scripts/constants.mjs";
import { getModuleSetting, registerSettings } from "./scripts/settings.mjs";

/** @typedef {import("@client/documents/chat-message.mjs").default} ChatMessage */

/* -------------------------------------------- */
/*            Module Initialization             */
/* -------------------------------------------- */

Hooks.on("init", onInit);
Hooks.on("createChatMessage", onCreateChatMessage);
Hooks.on("dnd5e.postCreateUsageMessage", onPostCreateUsageMessage);

function onInit() {
  registerSettings();
}

/**
 * @param {ChatMessage} message
 * @param {object} options
 * @param {string} userId
 */
async function onCreateChatMessage(message, options, userId) {
  // only run for active GM
  if (!game.user.isActiveGM) return;

  const messageRetention = getModuleSetting(SETTINGS.MESSAGE_RETENTION);

  if (game.messages.contents.length <= messageRetention) return;

  // get rerverse sorted array of all messages, newest first
  const messages = game.messages.contents.toSorted((a, b) => b.timestamp - a.timestamp);

  // delete all except the first messageRetention ones
  await Promise.all(messages.slice(messageRetention).map(msg => msg.delete()));
}

/**
 * @param {Activity} activity
 * @param {ChatMessage | object} card
 */
function onPostCreateUsageMessage(activity, card) {
  // only run for active GM
  if (!game.user.isActiveGM) return;

  if (card == null) return;

  // check if the actual message was created or just data
  if (!(card instanceof ChatMessage)) return;

  /**
   * @param {ChatMessage} message
   * @returns {boolean}
   */
  function getMessageType(message) {
    return message?.getFlag("dnd5e", "messageType");
  }

  /**
   * @param {ChatMessage} message
   * @returns {boolean}
   */
  function getMessageItemId(message) {
    return message?.getFlag("dnd5e", "item.id");
  }

  const messageType = getMessageType(card);
  if (messageType !== "usage") return;

  const itemId = getMessageItemId(card);
  if (!itemId) return;

  const speakerId = card.speaker.actor;
  if (!speakerId) return;

  /**
   * @param {ChatMessage} x
   * @returns {boolean}
   */
  function predicate(x) {
    return (x.timestamp < card.timestamp) && // earlier
    (getMessageType(x) === messageType) && // same type
    (getMessageItemId(x) === itemId) && // same item
    (x.speaker.actor === speakerId); // same speaker
  }

  const messages = game.messages.filter(predicate);

  messages.map(msg => msg.delete());
}

import "./less/furtherv-clean-chat.less";

/* -------------------------------------------- */
/*            Module Initialization             */
/* -------------------------------------------- */

Hooks.on("dnd5e.postCreateUsageMessage", onPostCreateUsageMessage);

/**
 *
 * @param {Activity} activity
 * @param {ChatMessage | object} card
 */
function onPostCreateUsageMessage(activity, card) {
  // only run for active GM
  if (!game.user.isActiveGM) return;

  // check if the actual message was created or just data
  if (!(card instanceof ChatMessage)) return;

  function getMessageType(message) {
    return message?.getFlag("dnd5e", "messageType");
  }

  function getMessageItemId(message) {
    return message?.getFlag("dnd5e", "item.id");
  }

  const messageType = getMessageType(card);
  if (messageType !== "usage") return;

  const itemId = getMessageItemId(card);
  if (!itemId) return;

  const speakerId = card.speaker.actor;
  if (!speakerId) return;

  function predicate(a) {
    return (a.timestamp < card.timestamp) && // earlier
    (getMessageType(a) === messageType) && // same type
    (getMessageItemId(a) === itemId) && // same item
    (a.speaker.actor === speakerId); // same speaker
  }

  const messages = game.messages.filter(predicate);

  messages.map(msg => msg.delete());
}

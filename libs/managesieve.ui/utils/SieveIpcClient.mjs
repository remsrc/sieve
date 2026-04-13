/*
 * The content of this file is licensed. You may obtain a copy of
 * the license at https://github.com/thsmi/sieve/ or request it via
 * email from the author.
 *
 * Do not remove or change this comment.
 *
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 */

/* global browser */
import { SieveLogger } from "./SieveLogger.mjs";
import { SieveAbstractIpcClient } from "./SieveAbstractIpcClient.mjs";

/**
 * An abstract implementation for a inter process/frame communication.
 */
class SieveWxIpcClient extends SieveAbstractIpcClient {

  /**
   * @inheritdoc
   */
  static getLogger() {
    return SieveLogger.getInstance();
  }

  /**
   * @inheritdoc
   */
  static parseMessageFromEvent(e) {
    return JSON.parse(e.data);
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line no-unused-vars
  /**
 * CHANGE (remsrc):
 * Hardened runtime message dispatch during window/editor shutdown.
 *
 * - Wraps browser.runtime.sendMessage(...) in controlled error handling
 * - Detects the "Receiving end does not exist" shutdown condition
 * - Prevents unhandled promise rejections when the target side is already gone
 *
 * Rationale:
 * Closing the addon window can race with IPC teardown. This is a normal
 * lifecycle condition and should not surface as an uncaught runtime error.
 */
  static async dispatch(message, target) {
    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }

    try {
      await browser.runtime.sendMessage(message);
    } catch (ex) {
      const msg = String(ex && ex.message ? ex.message : ex);

      if (msg.includes("Could not establish connection. Receiving end does not exist")) {
        this.getLogger().logIpc?.(
          "[SieveIpcClient] IPC target already gone during shutdown"
        );
        return;
      }

      throw ex;
    }
  }
}

browser.runtime.onMessage.addListener((request, sender) => {
  SieveWxIpcClient.onMessage({ data: request, source: sender });
});

export { SieveWxIpcClient as SieveIpcClient };

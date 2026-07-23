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

import { SieveCustomHost } from "./SieveAbstractHost.mjs";

const CONFIG_HOSTNAME = "hostname";
const CONFIG_KEEP_ALIVE_INTERVAL = "keepalive";
// eslint-disable-next-line no-magic-numbers
const ONE_MINUTE = 60 * 1000;
// eslint-disable-next-line no-magic-numbers
const FIVE_MINUTES = 5 * ONE_MINUTE;

/**
 * Loads and stores the ManageSieve hostname in the add-on configuration.
 */
class SieveMozHost extends SieveCustomHost {

  /**
   * @inheritdoc
   */
  async getDisplayName() {
    const account = await browser.accounts.get(this.account.getId());

    if (account && account.name)
      return account.name;

    return this.account.getId();
  }

  /**
   * @inheritdoc
   */
  async getHostname() {
    return await this.account.getConfig().getString(CONFIG_HOSTNAME, "");
  }

  /**
   * Stores the ManageSieve hostname for this account.
   *
   * @param {string} hostname
   *   the ManageSieve server hostname.
   * @returns {SieveMozHost}
   *   a self reference.
   */
  async setHostname(hostname) {
    hostname = String(hostname ?? "").trim();

    if (!hostname)
      throw new Error("ManageSieve hostname is missing");

    await this.account.getConfig().setString(CONFIG_HOSTNAME, hostname);
    return this;
  }

  /**
   * @inheritdoc
   */
  async getKeepAlive() {
    return await this.account.getConfig().getInteger(CONFIG_KEEP_ALIVE_INTERVAL, FIVE_MINUTES);
  }
}

export { SieveMozHost as SieveHost };

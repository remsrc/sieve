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

import { SieveBridgeClient } from "../../../libManageSieve/SieveBridgeClient.mjs";
import { SieveAbstractAuthentication } from "./SieveAbstractAuthentication.mjs";

const CONFIG_USERNAME = "username";
const CONFIG_PASSWORD = "password";

/**
 * Uses account-specific credentials. Passwords are stored in the operating
 * system credential store through the native bridge when a supported secure
 * backend is available. browser.storage.local remains the compatibility
 * fallback and migration source.
 */
class SieveMozAuthentication extends SieveAbstractAuthentication {

  getCredentialId() {
    return `sieve-reloaded:${this.account.getId()}`;
  }

  getBridge() {
    return SieveBridgeClient.getInstance();
  }

  async getLocalPassword() {
    return await this.account.getConfig().getString(CONFIG_PASSWORD, "");
  }

  async setLocalPassword(password) {
    await this.account.getConfig().setString(CONFIG_PASSWORD, password);
  }

  async getBackend() {
    try {
      const backend = await this.getBridge().getCredentialBackend();
      if (backend?.available === true && backend?.secure === true)
        return backend;
      return {
        available: false,
        secure: false,
        backend: backend?.backend ?? "unavailable",
        reason: backend?.reason ?? "Secure credential storage is unavailable"
      };
    } catch (error) {
      return {
        available: false,
        secure: false,
        backend: "unavailable",
        reason: error?.message ?? "Native bridge is unavailable"
      };
    }
  }

  /**
   * Move a legacy local password to the OS credential store. The local value
   * is removed only after the bridge confirms that the credential exists.
   */
  async migrateLocalPassword(backend = null) {
    backend = backend ?? await this.getBackend();
    if (!backend.available || !backend.secure)
      return false;

    const localPassword = await this.getLocalPassword();
    if (!localPassword)
      return false;

    try {
      await this.getBridge().setCredential(this.getCredentialId(), localPassword);
      const result = await this.getBridge().hasCredential(this.getCredentialId());
      if (!result?.exists)
        return false;

      await this.setLocalPassword("");
      return true;
    } catch (error) {
      console.warn("Could not migrate Sieve password to the OS credential store", error);
      return false;
    }
  }

  /**
   * @inheritdoc
   */
  async getPassword() {
    const backend = await this.getBackend();

    if (backend.available && backend.secure) {
      await this.migrateLocalPassword(backend);
      try {
        const result = await this.getBridge().getCredential(this.getCredentialId());
        if (result?.found)
          return result.password;
      } catch (error) {
        console.warn("Could not read Sieve password from the OS credential store", error);
      }
    }

    return await this.getLocalPassword();
  }

  /**
   * @inheritdoc
   */
  async getUsername() {
    return await this.account.getConfig().getString(CONFIG_USERNAME, "");
  }

  async setUsername(username) {
    username = String(username ?? "").trim();

    if (!username)
      throw new Error("ManageSieve username is missing");

    await this.account.getConfig().setString(CONFIG_USERNAME, username);
    return this;
  }

  /**
   * Store a password in the OS credential store if possible. If no supported
   * secure backend is available or storing fails, retain the existing local
   * storage behavior.
   */
  async setPassword(password) {
    password = String(password ?? "");

    if (!password)
      throw new Error("ManageSieve password is missing");

    const backend = await this.getBackend();
    if (backend.available && backend.secure) {
      try {
        await this.getBridge().setCredential(this.getCredentialId(), password);
        const result = await this.getBridge().hasCredential(this.getCredentialId());
        if (result?.exists) {
          await this.setLocalPassword("");
          return this;
        }
      } catch (error) {
        console.warn("Could not store Sieve password in the OS credential store", error);
      }
    }

    await this.setLocalPassword(password);
    return this;
  }

  async clearPassword() {
    const backend = await this.getBackend();
    if (backend.available && backend.secure) {
      try {
        await this.getBridge().deleteCredential(this.getCredentialId());
      } catch (error) {
        console.warn("Could not delete Sieve password from the OS credential store", error);
      }
    }

    await this.setLocalPassword("");
    return this;
  }

  async hasPassword() {
    const backend = await this.getBackend();
    if (backend.available && backend.secure) {
      await this.migrateLocalPassword(backend);
      try {
        const result = await this.getBridge().hasCredential(this.getCredentialId());
        if (result?.exists)
          return true;
      } catch (error) {
        console.warn("Could not query Sieve credential state", error);
      }
    }

    return (await this.getLocalPassword()) !== "";
  }

  async getPasswordStorage() {
    const backend = await this.getBackend();
    if (backend.available && backend.secure) {
      await this.migrateLocalPassword(backend);
      try {
        const result = await this.getBridge().hasCredential(this.getCredentialId());
        if (result?.exists) {
          return {
            type: "system",
            backend: backend.backend,
            secure: true
          };
        }
      } catch (error) {
        console.warn("Could not query Sieve credential storage", error);
      }
    }

    return {
      type: "local",
      backend: backend.backend,
      secure: false,
      reason: backend.reason
    };
  }
}

export { SieveMozAuthentication as SieveAuthentication };

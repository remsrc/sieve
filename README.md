# Sieve Reloaded (Thunderbird Add-on)

Sieve Reloaded is a continuation of the original **Sieve Editor** by thsmi (Thomas Schmid), adapted for current Thunderbird versions and their supported WebExtension APIs.

It restores integrated Sieve script management inside Thunderbird while replacing the former privileged Thunderbird-specific socket APIs with a separate Native Messaging bridge.

> **Important:** Sieve Reloaded requires the companion **SieveBridgeClient** to be installed before the add-on can connect to a ManageSieve server.

The bridge is available at:

<https://github.com/remsrc/sieve-bridge-client>

Follow the bridge repository's installation instructions before using this add-on:

<https://github.com/remsrc/sieve-bridge-client/blob/main/INSTALL.md>

---

## Background

[Sieve](https://en.wikipedia.org/wiki/Sieve_%28mail_filtering_language%29) is a standardized scripting language for server-side mail filtering, commonly used with IMAP mail servers.

The original project provided a graphical editor and an implementation of the ManageSieve protocol ([RFC 5804](https://datatracker.ietf.org/doc/html/rfc5804)) for editing and managing server-side Sieve scripts.

The upstream project later moved away from Thunderbird integration toward a standalone application. Sieve Reloaded takes the opposite direction and focuses specifically on a modern Thunderbird add-on.

---

## Architecture

Sieve Reloaded consists of two required components:

1. **Thunderbird add-on**
   - Provides the user interface and account integration.
   - Uses standard Thunderbird WebExtension APIs.
   - Does not use Experimental APIs.

2. **SieveBridgeClient**
   - Runs as a Native Messaging host outside Thunderbird.
   - Opens the TCP connection to the ManageSieve server.
   - Handles STARTTLS and certificate validation.
   - Can use the operating system's credential store through Python `keyring`.

Communication between the add-on and the bridge uses Thunderbird's standard Native Messaging mechanism.

Because Thunderbird WebExtensions cannot open arbitrary TCP sockets directly, the bridge is mandatory. Installing only the add-on is not sufficient.

---

## Installation

### 1. Install SieveBridgeClient

Download or build the bridge from:

<https://github.com/remsrc/sieve-bridge-client>

Installation instructions for Windows, Linux, macOS, source installations, and prebuilt binaries are documented here:

<https://github.com/remsrc/sieve-bridge-client/blob/main/INSTALL.md>

After installing the bridge, restart Thunderbird completely.

### 2. Install Sieve Reloaded

Install the add-on in Thunderbird. Before the first connection, open the settings for each account and enter the ManageSieve server, port, username, and password.

If Thunderbird reports that the Native Messaging host cannot be found, verify the bridge installation and restart Thunderbird before troubleshooting the add-on itself.

---

## Usage

Sieve Reloaded has no toolbar button and no separate options page. Its entry point is an item registered in Thunderbird's **Tools** menu.

### Opening Sieve Message Filters

1. Restart Thunderbird completely after installing the add-on and the bridge.
2. Open the **Tools** menu:
   - If the classic menu bar is visible, click **Tools** at the top of the window.
   - If the menu bar is hidden, press `Alt` to show it temporarily, or use Thunderbird's application menu and open **Tools** there.
3. Click **Sieve Message Filters**. The add-on opens in a new Thunderbird tab.

### Account overview and first-time setup

The add-on creates one card for each Thunderbird IMAP or POP3 account. The Thunderbird account list is used to identify the accounts, but the ManageSieve connection credentials cannot be read automatically from Thunderbird.

> **Important:** Before connecting an account for the first time, open its **Settings** tab, enter the ManageSieve connection details, and click **Save**.

The current settings are:

| Field | Meaning |
|---|---|
| **Server** | Hostname or IP address of the ManageSieve server and its port. The standard ManageSieve port is **4190** (RFC 5804). |
| **Username** | Username used to authenticate against the ManageSieve server. Depending on the server configuration, this is often the full e-mail address. |
| **Password** | Password used for ManageSieve authentication. When a supported secure credential backend is available, it is stored through the bridge in the operating system's credential store. Otherwise it is stored locally in the add-on configuration. |

Each account card contains the script view and a **Settings** tab for these connection details.

### Managing scripts

- Once an account is connected, its main view lists the Sieve scripts stored on the server; the currently active script is marked.
- **New script** creates an additional script. When no scripts exist yet, the account shows an empty state with a **Create new Script** button.
- Clicking a script opens the built-in editor in a new tab. There you can edit the script, check its syntax, save it, and activate or deactivate it.
- The account menu provides access to actions such as **Settings**, **Disconnect**, **Reconnect**, and **Show Server Capabilities**.
- **Debugging** in the Settings view opens the add-on log and can be useful when diagnosing connection problems.

### Notes on the first connection

- The bridge handles TLS and certificate validation for the ManageSieve connection.
- If certificate validation requires explicit user approval, the bridge/add-on trust workflow is used before the connection proceeds.
- Sieve scripts run on the mail server. The add-on only manages them; it does not execute mail filtering locally.

---

## Purpose

This project intentionally focuses on:

- Restoring native Thunderbird integration
- Supporting modern Thunderbird versions
- Avoiding unsupported or privileged Experimental APIs
- Providing a focused Sieve management workflow
- Preserving the familiar concepts of the original Sieve Editor

It is intended for users who relied on the original Thunderbird extension and require an integrated solution for current Thunderbird releases.

---

## Scope

This implementation includes:

- Thunderbird add-on integration
- ManageSieve account configuration
- Loading, editing, saving, activating, and managing Sieve scripts
- TCP and STARTTLS communication through SieveBridgeClient
- Certificate trust handling
- Optional integration with operating-system credential storage

It does not attempt to reproduce every feature of the upstream standalone application.

---

## Differences from the Original Project

Compared with the original `thsmi/sieve` project, Sieve Reloaded:

- Is focused on Thunderbird rather than a standalone desktop application
- Uses standard WebExtension APIs for Thunderbird integration
- Uses Native Messaging instead of a Thunderbird Experimental socket API
- Moves TCP, TLS, certificate, and credential operations into a separate bridge process
- Has no dependency on custom Thunderbird API experiments
- Follows an independent maintenance and release path

The add-on therefore remains within the standard Thunderbird extension architecture, while the privileged network operations required by ManageSieve are isolated in an explicitly installed companion application.

---

## Security Model

The bridge is installed separately and registered as a Native Messaging host for the Sieve Reloaded extension.

This design provides a clear separation of responsibilities:

- Thunderbird handles the user interface and extension lifecycle.
- SieveBridgeClient handles external socket communication and secure credential access.
- The Native Messaging manifest limits which extension is allowed to start the bridge.

Prebuilt bridge binaries may initially be unsigned. Operating systems can therefore display warnings for unrecognized applications. Users should obtain releases only from the official repository and verify published checksums where available. See the bridge installation documentation for platform-specific details.

---

## Status

This project is actively maintained with a focus on:

- Current Thunderbird compatibility
- Removal of legacy and Experimental APIs
- Reliable Native Messaging communication
- Stability and security improvements
- Incremental modernization of the inherited codebase

---

## Contributing

Contributions are welcome, especially in the following areas:

- Thunderbird WebExtension integration
- Native Messaging integration
- ManageSieve interoperability
- Bug fixes and stability improvements
- Code cleanup and modernization
- Testing on Windows, Linux, and macOS

Please use the issue tracker for bug reports and technical discussion.

---

## License

This project continues to use the original licensing model:

**GNU Affero General Public License v3 (AGPLv3)**

---

## Acknowledgment

This project is based on the original work by thsmi (Thomas Schmid) and its contributors.

Without the original Sieve Editor, this continuation would not exist.

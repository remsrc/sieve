# Sieve Reloaded (Thunderbird Add-on, MV2)

## Overview

This project provides a Thunderbird extension for managing Sieve mail filtering scripts within the mail client.

It is based on the original *Sieve Editor* project and reintroduces core functionality as a Thunderbird add-on compatible with current Thunderbird versions (≥ 128), using the WebExtension API (Manifest V2).

The extension operates entirely within Thunderbird and does not rely on cloud services, telemetry, analytics, or third-party backends.

---

## Scope and Functionality

The add-on focuses on the following capabilities:

- managing Sieve-related account settings and sessions
- connecting to user-configured ManageSieve servers
- listing, retrieving, editing, validating, saving, renaming, deleting, and activating Sieve scripts
- integrating the Sieve editor and account UI into Thunderbird windows and tabs
- supporting optional local test workflows where explicitly enabled by the developer

This implementation is intentionally scoped and does not aim to replicate the full standalone feature set of the upstream project.

---

## Permissions

The extension uses only the permissions required for its functionality.

Current permissions:

- `accountsRead` – required to access Thunderbird account configuration needed for Sieve host, username, and related account metadata
- `tabs` – required to open, focus, query, and manage the account and editor tabs used by the extension UI
- `storage` – required to persist local extension configuration and editor-related settings

The extension does not request permissions for unrelated mailbox access beyond what is necessary for account integration and script management.

---

## Custom Experiment APIs

The add-on uses Thunderbird Experiment APIs because the required functionality is not fully available through standard WebExtension APIs alone.

Implemented custom APIs:

- `sieve.accounts` – access to Thunderbird account-related properties needed for Sieve authentication and connection setup
- `sieve.socket` – low-level socket and STARTTLS handling required for ManageSieve protocol communication
- `sieve.menu` – integration of extension entries into Thunderbird menus

A custom socket API is required because the ManageSieve protocol is not accessible through standard WebExtension APIs. The implementation uses Thunderbird’s native networking interfaces only.

---

## Data Handling and Privacy

- All processing is performed locally within Thunderbird
- No telemetry, tracking, analytics, or advertising components are included
- No user data is transmitted to third-party services
- No user data is persisted outside Thunderbird-controlled local storage used by the extension

The extension accesses account credentials via Thunderbird’s internal account APIs exclusively for authentication against user-configured Sieve servers. Credentials are not sent to any third-party service and are not stored separately by the extension.

Optional test functionality, if enabled during development, operates only on user-provided local files.

---

## Network Activity

All network communication is limited to user-configured mail and Sieve infrastructure.

This includes, where configured by the user:

- ManageSieve server communication
- TLS / STARTTLS negotiation with that server

There is:

- no communication with analytics providers
- no hidden background traffic to third-party services
- no remote code loading
- no use of external cloud APIs

Certificate override handling is only used in the context of user-initiated connections to configured Sieve servers and only to handle certificate validation exceptions within Thunderbird’s native certificate framework.

---

## Security Considerations

- No use of `eval`
- No dynamic execution of downloaded code
- No remote script loading
- All shipped resources are bundled with the extension package
- UI integration, account access, and socket handling are separated across dedicated modules
- Error handling is implemented for connection, TLS, and stream failure scenarios

The socket implementation is limited to the protocol needs of the extension and is not used for arbitrary third-party communication.

---

## Warnings

- The reported "innerHTML" usage originates exclusively from the bundled Bootstrap library.
- The extension itself does not assign dynamic or external data to innerHTML. All application logic uses safe DOM APIs (e.g., textContent, createElement).
- No untrusted content (such as email data, server responses, or user input) is injected into HTML contexts.

---

## Compatibility

- Thunderbird ≥ 128
- Manifest Version 2
- WebExtension-based Thunderbird add-on with Experiment APIs

No compatibility with legacy pre-WebExtension Thunderbird add-ons is intended.

---

## Relationship to Upstream Project

This project is derived from the original *Sieve Editor* but follows an independent development path.

Differences include:

- focus on Thunderbird integration instead of the standalone application model
- adaptation for current Thunderbird versions and APIs
- reduced scope centered on practical in-client usability
- no Azure pipeline references, no donation infrastructure, and no cloud dependencies

---

## Testing

The extension can be tested in two ways:

1. **Standard mode**
   - using a configured account with access to a ManageSieve server

2. **Developer / test mode**
   - using explicitly enabled local test workflows where applicable

This allows functional review without requiring any third-party service beyond the user-configured target server.

---

## License

GNU Affero General Public License v3 (AGPLv3)

---

## Acknowledgment

This project builds on the original work of thsmi (Thomas Schmid) and contributors.

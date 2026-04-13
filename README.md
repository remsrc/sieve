# Sieve Editor (Thunderbird Add-on)

This project is a continuation of the original **Sieve Editor** by Thomas Schmidt, adapted and refocused for modern Thunderbird environments.

It brings back the familiar functionality as a **native Thunderbird Add-on (Manifest V3)**, targeting current Thunderbird versions (≥ 128), while preserving the core idea and usability that many users relied on for years.

---

## Background

[Sieve](https://en.wikipedia.org/wiki/Sieve_%28mail_filtering_language%29) is a standardized scripting language for server-side mail filtering, commonly used in combination with IMAP servers.

The original project provided a powerful graphical editor and an implementation of the ManageSieve protocol ([RFC 5804](https://datatracker.ietf.org/doc/html/rfc5804)) for editing and managing Sieve scripts.

Over time, the upstream project shifted away from Thunderbird integration towards a standalone application :contentReference[oaicite:0]{index=0}.

---

## Purpose of this Branch

This branch intentionally takes a different direction:

- Restore **native Thunderbird integration**
- Ensure compatibility with **modern Thunderbird (≥ 128)**
- Provide a **lightweight, focused Add-on experience**
- Preserve the familiar workflow for long-time users

This project is aimed at users who have used and appreciated the original Thunderbird extension and want a working solution within the current Thunderbird ecosystem.

---

## Scope

This implementation focuses on:

- Thunderbird Add-on (WebExtension / Manifest V2)
- Integration into the Thunderbird UI
- Handling and processing of Sieve-related data within Thunderbird workflows

It does **not** aim to replicate the full standalone application feature set of the upstream project.

---

## Differences to the Original Project

Compared to the upstream repository:

- No standalone desktop application
- No Azure / CI pipeline integration
- No donation or funding infrastructure
- Reduced scope, focused on Thunderbird usage
- Independent development direction

The goal is not feature parity, but **practical usability within Thunderbird**.

---

## Status

This is an actively maintained branch with focus on:

- Stability in Thunderbird ≥ 128
- Compatibility with current APIs
- Incremental improvements based on real-world usage

---

## Contributing

Contributions are welcome, especially in the following areas:

- Thunderbird API integration
- Bug fixes and stability improvements
- Code cleanup and modernization

Please use the issue tracker for bug reports and discussion.

---

## License

This project continues to use the original licensing model:

GNU Affero General Public License v3 (AGPLv3)

---

## Acknowledgment

This project is based on the original work by Thomas Schmidt and contributors.  
Without the original Sieve Editor, this continuation would not exist.
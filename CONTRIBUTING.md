# Contributing to CTRES

CTRES v1.0 is a draft for consultation. Comments from authorities, operators, payment providers, auditors, associations and other readers are invited. This document explains how to submit them and how they are handled.

This repository covers the text of the Standard. Comments on the JSON Schema belong in [ctres-standard/schema](https://github.com/ctres-standard/schema); comments on the validator belong in [ctres-standard/validator-lite](https://github.com/ctres-standard/validator-lite).

## Comments on the text

1. Open an issue in this repository using the **Comment on the text** template.
2. Raise **one point per issue**. A comment that covers several unrelated points is harder to discuss and to resolve; split it into separate issues.
3. **Cite the section, table or annex** the comment concerns, for example "§4.2, field `holder_match`" or "Annex B, Malta row". Give the edition and version if it is not v1.0, universal edition.
4. Quote the current text briefly, state the problem, and, where possible, propose replacement wording.
5. Where the comment concerns a regulatory requirement, cite the published source: instrument, article or paragraph, and the date in force.

Typographical corrections may also be proposed as a pull request against `build/build_spec_universal.js`, which is the source of the text. The rows of Annex B are not held in this repository; corrections to them follow the procedure below. Substantive changes start as an issue.

## Corrections to jurisdiction profiles

The profiles in Annex B are researched from published sources and offered to each authority for review. Profiles belong to the authorities concerned (§5, §13).

- **An authority correcting its own profile** may use the **Jurisdiction profile correction** template, or write to hello@ctres.org, preferably from an official address. Corrections an authority makes to its own profile are adopted as submitted. The editor may ask for confirmation that the sender acts for the authority. Once the authority has reviewed its profile, the profile is published as confirmed.
- **Anyone else** proposing a correction to a profile should use the same template and cite a published source. Such corrections are reviewed by the editor as comments, and the profile remains indicative until the authority concerned has reviewed it.

## What not to include

Issues and pull requests are public. Do not include:

- confidential or non-public information, including correspondence with an authority that is not public;
- personal data, including names, account numbers, wallet addresses or other identifiers of players or staff;
- the content of, or any reference to, a suspicious transaction report;
- data that identifies an operator's customers, transactions or internal controls;
- credentials, keys or other secrets.

Where an example is needed, use synthetic values in the style of Annex C. Information that cannot be made public may be sent to hello@ctres.org; it will not be published without the sender's agreement.

## How comments are handled

- The editor acknowledges each issue and labels it.
- Substantive changes are published for comment before adoption (§13).
- Each resolved issue is closed with a note of the outcome and, where the text changes, the version in which the change appears.
- Versioning follows §13: major versions change the record model, minor versions add fields, rails or profiles, and patches correct text. Changes are recorded in `CHANGELOG.md`.

## Licence of contributions

The text of the Standard is licensed under the Creative Commons Attribution 4.0 International licence (CC BY 4.0). By submitting a comment, proposed wording, a profile correction or any other contribution, you license it under CC BY 4.0 and confirm that you are entitled to do so. The editor may incorporate a contribution in whole or in part. The editor may acknowledge contributors who agree.

## Contact

hello@ctres.org, for general enquiries, comments that cannot be made public, and profile corrections from authorities.

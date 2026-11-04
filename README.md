# CTRES: Common Transaction Reporting and Evidence Standard

This repository holds the text of the Common Transaction Reporting and Evidence Standard (CTRES), version 1.1, universal edition, dated 4 November 2026 (version 1.0 was first published on 2 October 2026). Annex B, the Register of jurisdiction profiles, is published separately in dated editions; the current edition is 4 November 2026, with ninety jurisdictions.

## What CTRES is

CTRES is an open, rail-neutral format in which licensed gambling operators, and the payment providers acting for them, evidence payment flows, and the gaming revenue reconciled to those flows, to the authorities that supervise them. It defines fourteen record types (R1 to R14): funds locations, payment instrument links, deposits, withdrawals, check decisions, internal movements, reconciliation statements, exceptions, incidents, a provider register, provider attestations, references to reports filed with other authorities, gaming revenue statements and venue counts. A gaming revenue statement (R13) carries stakes, winnings, bonus movements and the declared gross gaming revenue per licence, product line, channel and period; a venue count (R14) carries the meters, drop and count behind it in land-based venues; and the money bridge of §4.13 ties the declared revenue to the deposits, withdrawals and balances in the same package. Seven rail modules add the identifiers that belong to one rail only: cards; bank transfers and instant payments; e-money and e-wallets; mobile money and carrier billing; vouchers and prepaid; cash at retail or venue; and virtual assets.

The Standard creates no obligation. It formats evidence of duties that already exist under each jurisdiction's law and licence conditions. Thresholds, aggregation windows, permitted rails, payout deadlines, retention periods, and the levy base and its rules are parameters of a jurisdiction profile, not constants of the format; Annex B gives profiles for ninety jurisdictions, researched from published sources and offered to each authority for review. CTRES does not replace any authority's central system, reporting portal or financial intelligence reporting schema. It is the operator-side evidence layer from which those submissions can be produced.

## Status

Published standard, version 1.1, open for implementation and for public comment. CTRES is an independent standard: it carries no regulatory force and creates no new obligations. Every reference to a jurisdiction's rules is a reading of published sources, offered for correction; a profile reviewed with its authority carries the authority's own wording, and corrections an authority makes to its own profile are adopted as submitted.

## Files

| File | Content |
|---|---|
| `CTRES_v1.1.pdf` | The Standard, for reading and printing |
| `CTRES_v1.1.docx` | The same text in Word format, for comments and tracked changes |
| `CTRES_Register.pdf` | Annex B, the Register of jurisdiction profiles — the current edition (its date is on the cover); a stable file name, so links do not break between editions |
| `CTRES_Register.docx` | The same Register in Word format |
| `build/build_spec_universal.js` | Source of the text, except the rows of the Register; generates both Word documents |
| `build/assets/watermark.png` | Watermark placed behind the text on every page |
| `build/package.json`, `build/package-lock.json` | Build dependency (`docx`), with locked versions |
| `CHANGELOG.md` | Changes by edition and revision |
| `CONTRIBUTING.md` | How to comment and how authorities correct their profiles |
| `LICENSE` | Creative Commons Attribution 4.0 International |

## Building

The Word document is generated from `build/build_spec_universal.js` with Node.js:

```sh
cd build
npm ci
npm run build    # writes ../CTRES_v1.1.docx
node build_spec_universal.js --register ../CTRES_Register.docx   # the Register (rows need the editor's private data file)
```

The lock file pins `docx` 9.7.2, the version that produced the published document (verified with Node.js 26.5 and npm 11.17).

The rows of the Register (Part 1, payments, player funds and reporting; Part 2, revenue and levy; and their principal sources) are included in the published `CTRES_Register.docx` and `CTRES_Register.pdf`. Their source data is maintained by the editor and is not in this repository, so a Register built from this repository shows a placeholder paragraph in place of the tables. The Standard itself is generated in full. Corrections to Annex B are made through the profile correction template or by writing to hello@ctres.org (see `CONTRIBUTING.md`).

The PDF is not produced by the build script. It is exported from the Word document with Microsoft Word (File > Save As > PDF).

Every page of all four documents carries a diagonal watermark behind the text (`build/assets/watermark.png`) giving the name of the Standard and the addresses ctres.org and hello@ctres.org, and a page footer giving the version and ctres.org.

## How to cite

Suggested citation:

> CTRES. *Common Transaction Reporting and Evidence Standard (CTRES)*, version 1.1, universal edition. 4 November 2026. https://ctres.org/standard/

> CTRES. *Register of jurisdiction profiles (Annex B of CTRES v1.1)*, edition of 4 November 2026. https://ctres.org/profiles/

Short forms: CTRES v1.1 (universal edition, 4 November 2026); CTRES Register, edition of 4 November 2026. Version 1.0 and earlier Register editions remain available as GitHub releases.

```bibtex
@misc{ctres-1.1,
  title        = {Common Transaction Reporting and Evidence Standard ({CTRES}), version 1.1, universal edition},
  author       = {{CTRES}},
  howpublished = {Published standard},
  year         = {2026},
  month        = nov,
  url          = {https://ctres.org/standard/}
}
```

When citing a provision, give the section or annex number, for example "CTRES v1.1, §4.13" or "CTRES Register (edition of 4 November 2026), Spain".

## Licence

- **Text.** The text of the Standard, the Word and PDF documents and the build script that generates them are licensed under the [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) licence (CC BY 4.0); see `LICENSE`. The text may be copied, adapted and redistributed, including commercially, provided the source is attributed and changes are indicated. A suitable attribution is: "Based on CTRES v1.1 (universal edition), CC BY 4.0, https://ctres.org/standard/". Reuse does not imply endorsement by the licensor (Section 2(a)(6) of the licence), and an adapted text should not be presented as the Standard itself.
- **Implementation.** Any operator, supplier or authority may implement the Standard without fee or permission.
- **Schema and validator.** The JSON Schema and the reference validator are maintained in their own repositories under the Apache License 2.0 (see below).

## Related repositories

| Repository | Content | Licence |
|---|---|---|
| [ctres-standard/schema](https://github.com/ctres-standard/schema) | JSON Schema for record types R1 to R14, the package manifest and the structure of a jurisdiction profile | Apache 2.0 |
| [ctres-standard/validator-lite](https://github.com/ctres-standard/validator-lite) | Validator for the Structural and Referential classes of §11 | Apache 2.0 |

The Profile conformance and Completeness classes of §11 depend on parameters that the Standard leaves to each authority to set. They are not part of these repositories.

## How to comment

- **Comments on the text.** Open an issue in this repository using the "Comment on the text" template. Raise one point per issue and cite the section or annex number. See `CONTRIBUTING.md`.
- **Corrections to a jurisdiction profile.** An authority may correct its own profile in the Register (Annex B), either through the "Jurisdiction profile correction" issue template or by writing to hello@ctres.org. Corrections an authority makes to its own profile are adopted as submitted (§13).
- Issues are public. Do not include confidential information or personal data.

## Contact

| Purpose | Address |
|---|---|
| General enquiries, comments and profile corrections from authorities | hello@ctres.org |
| Website | https://ctres.org |
| Public comments | [Issues in this repository](https://github.com/ctres-standard/spec/issues) |

## Governance

See §13 of the Standard and https://ctres.org/governance/.

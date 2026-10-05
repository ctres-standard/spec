# CTRES: Common Transaction Reporting and Evidence Standard

This repository holds the text of the Common Transaction Reporting and Evidence Standard (CTRES), version 1.0, universal edition, dated 2 October 2026 and revised for publication on 5 October 2026.

## What CTRES is

CTRES is an open, rail-neutral format in which licensed gambling operators, and the payment providers acting for them, evidence payment flows to the authorities that supervise them. It defines twelve record types (R1 to R12): funds locations, payment instrument links, deposits, withdrawals, check decisions, internal movements, reconciliation statements, exceptions, incidents, a provider register, provider attestations and references to reports filed with other authorities. Seven rail modules add the identifiers that belong to one rail only: cards; bank transfers and instant payments; e-money and e-wallets; mobile money and carrier billing; vouchers and prepaid; cash at retail or venue; and virtual assets.

The Standard creates no obligation. It formats evidence of duties that already exist under each jurisdiction's law and licence conditions. Thresholds, aggregation windows, permitted rails, payout deadlines and retention periods are parameters of a jurisdiction profile, not constants of the format; Annex B gives indicative profiles for sixty-seven jurisdictions, read from published sources. CTRES does not replace any authority's central system, reporting portal or financial intelligence reporting schema. It is the operator-side evidence layer from which those submissions can be produced.

## Status

Draft for consultation. The Standard carries no regulatory force and is not endorsed by any authority. Every reference to a jurisdiction's rules is a reading of published sources, offered for correction. Every profile in Annex B is indicative until the authority concerned has reviewed it.

## Files

| File | Content |
|---|---|
| `CTRES_v1.0.pdf` | The Standard, for reading and printing |
| `CTRES_v1.0.docx` | The same text in Word format, for comments and tracked changes |
| `build/build_spec_universal.js` | Source of the text, except the rows of Annex B; generates the Word document |
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
npm run build    # writes ../CTRES_v1.0.docx
```

The lock file pins `docx` 9.7.2, the version that produced the published document (verified with Node.js 26.5 and npm 11.17).

The rows of Annex B (the indicative jurisdiction profiles and their principal sources) are included in the published `CTRES_v1.0.docx` and `CTRES_v1.0.pdf`. Their source data is maintained by the editor and is not in this repository, so a build from this repository shows a placeholder paragraph in Annex B in place of the table. Every other part of the text is generated in full. Corrections to Annex B are made through the profile correction template or by writing to hello@ctres.org (see `CONTRIBUTING.md`).

The PDF is not produced by the build script. It is exported from the Word document with Microsoft Word (File > Save As > PDF).

Every page of both documents carries a diagonal watermark behind the text (`build/assets/watermark.png`) giving the version, the draft status and the addresses ctres.org and hello@ctres.org, and a page footer giving the version, the draft status and ctres.org.

## Editions

| Edition | Date | Scope |
|---|---|---|
| Universal edition (this repository) | 2 October 2026, revised for publication 5 October 2026 | Every payment rail, under any jurisdiction's rules, through jurisdiction profiles |
| Curaçao edition | September 2026 | Virtual assets only, applied to the Curaçao Gaming Authority's crypto policy guideline |

The universal edition keeps the record model of the Curaçao edition and generalises it. Annex F of the Standard lists the differences. The Curaçao edition is not included in this repository.

## How to cite

Suggested citation:

> CTRES. *Common Transaction Reporting and Evidence Standard (CTRES)*, version 1.0, universal edition. Draft for consultation. 2 October 2026. https://ctres.org/standard/

Short form: CTRES v1.0 (universal edition, 2 October 2026).

```bibtex
@misc{ctres-1.0,
  title        = {Common Transaction Reporting and Evidence Standard ({CTRES}), version 1.0, universal edition},
  author       = {{CTRES}},
  howpublished = {Draft for consultation},
  year         = {2026},
  month        = oct,
  url          = {https://ctres.org/standard/}
}
```

When citing a provision, give the section or annex number, for example "CTRES v1.0, §4.2" or "CTRES v1.0, Annex B".

## Licence

- **Text.** The text of the Standard, the Word and PDF documents and the build script that generates them are licensed under the [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) licence (CC BY 4.0); see `LICENSE`. The text may be copied, adapted and redistributed, including commercially, provided the source is attributed and changes are indicated. A suitable attribution is: "Based on CTRES v1.0 (universal edition), CC BY 4.0, https://ctres.org/standard/". Reuse does not imply endorsement by the licensor (Section 2(a)(6) of the licence), and an adapted text should not be presented as the Standard itself.
- **Implementation.** Any operator, supplier or authority may implement the Standard without fee or permission.
- **Schema and validator.** The JSON Schema and the reference validator are maintained in their own repositories under the Apache License 2.0 (see below).

## Related repositories

| Repository | Content | Licence |
|---|---|---|
| [ctres-standard/schema](https://github.com/ctres-standard/schema) | JSON Schema for record types R1 to R12, the package manifest and the structure of a jurisdiction profile | Apache 2.0 |
| [ctres-standard/validator-lite](https://github.com/ctres-standard/validator-lite) | Validator for the Structural and Referential classes of §11 | Apache 2.0 |

The Profile conformance and Completeness classes of §11 depend on parameters that the Standard leaves to each authority to set. They are not part of these repositories.

## How to comment

- **Comments on the text.** Open an issue in this repository using the "Comment on the text" template. Raise one point per issue and cite the section or annex number. See `CONTRIBUTING.md`.
- **Corrections to a jurisdiction profile.** An authority may correct its own profile in Annex B, either through the "Jurisdiction profile correction" issue template or by writing to hello@ctres.org. Corrections an authority makes to its own profile are adopted as submitted (§13).
- Issues are public. Do not include confidential information or personal data.

## Contact

| Purpose | Address |
|---|---|
| General enquiries, comments and profile corrections from authorities | hello@ctres.org |
| Website | https://ctres.org |
| Public comments | [Issues in this repository](https://github.com/ctres-standard/spec/issues) |

## Governance

Editor: Dmitry Skachko (see §13).

# Changelog

Changes to the text of the Common Transaction Reporting and Evidence Standard (CTRES), most recent first. Section numbers refer to the edition named in each entry.

## 1.0 — editorial revision, 5 October 2026 (release v1.0.1)

- Status wording: CTRES is described as an independent open standard, published for consultation with authorities and industry.
- Annex B is titled "Jurisdiction profiles"; profiles not yet reviewed by their authority are described as researched from published sources.
- No change to the record model, fields or profile parameters.

## 1.0 — publication edits, 5 October 2026

Edits made for the public release of version 1.0. The record model, the rail modules and the profiles in Annex B are unchanged.

### Contact and front matter

- Contact details: the documents now give hello@ctres.org and https://ctres.org, on the cover, in the page footer, in the diagonal watermark and in the document properties. The cover adds a Website row and records the publication revision in its date.
- The editor is named on the cover and in §13 only. The page footer gives the version, the draft status and ctres.org; the watermark gives the version, the draft status, ctres.org and hello@ctres.org; the document properties name CTRES as author.
- Editor contact and attribution moved to ctres.org.
- Licence: the cover and §13 state that the text is licensed under CC BY 4.0, and that the schema (record types R1–R12, the package manifest and the structure of a jurisdiction profile) and the reference validator for the Structural and Referential classes are licensed under the Apache License 2.0. Profiles are published in human-readable form in Annex B.
- Comments: the cover and §13 direct comments to the public issue tracker at github.com/ctres-standard/spec or to hello@ctres.org. The cover repeats that corrections an authority makes to its own profile are adopted as submitted.

### Text

- §4 and Annex A: the machine-readable schema is published under the Apache License 2.0 at github.com/ctres-standard/schema, in place of being available on request.
- §5 and Annex E: a profile is described as a configuration in the machine-readable structure defined by the schema (Annex A).
- §7: detailed mappings to existing formats are maintained separately from the Standard, versioned, and tested against each destination's schema wherever that schema is public.
- §11: the reference validator paragraph now refers to validator-lite, the open validator for the Structural and Referential classes, published at github.com/ctres-standard/validator-lite. Validation under the Profile conformance and Completeness classes depends on parameters left to each authority and is provided separately. No validator is a condition of using the Standard.
- §13: a conformance claim refers to a named conformance suite version.
- §14: the Q2 2027 step refers to versioned mappings to existing formats.

### Repository

- The rows of Annex B are included in the published DOCX and PDF; their source data is not in this repository, and a build from this repository shows a placeholder paragraph in Annex B.
- The PDF is exported from the Word document with Microsoft Word. Page breaks differ from the earlier PDF; the text is the same apart from the edits above.

## 1.0, universal edition (2 October 2026)

The Standard is no longer tied to one jurisdiction or to virtual assets. The short name CTRES is kept; it now stands for Common Transaction Reporting and Evidence Standard. The version number remains 1.0. The Curaçao edition is the application of the virtual-asset module to one jurisdiction's crypto policy.

### Record model

- Twelve record types instead of eleven:
  - R1 Funds Location (formerly Wallet Inventory) describes any place the operator holds money: bank account, provider balance, mobile money collection account, e-money account, virtual-asset wallet or cash float, with its purpose class, protection mechanism and location jurisdiction.
  - R2 Payment Instrument Link (formerly Player Wallet Link) describes any payment instrument, with holder match, funding type (including invoice and buy-now-pay-later), issuer country, national-ID match and payout status.
  - R3 Deposit and R4 Withdrawal have a rail-neutral core: the reference the rail itself issued, the reference issued by an authority's central system where one exists, tax lines, a limit check, payout timing and closed-loop evidence.
  - R5 Check Decision (formerly Screening Decision) covers fifteen check types, including central limit files, credit registers, eligibility and exclusion registers, biometric checks and financial risk.
  - R7 Reconciliation Statement distinguishes location statements from a coverage statement of player liabilities against the funds held to meet them.
  - R10 Provider Register (formerly Counterparty Register) and R11 Provider Attestation (formerly Custody Attestation) apply to any provider role and to any pooled arrangement.
  - New R12 Report Reference links records to suspicious-transaction, threshold and other reports filed with other authorities, without carrying their content.

### Rail modules

- Seven rail modules (§6): cards; bank transfers and instant payments; e-money and e-wallets; mobile money and carrier billing; vouchers and prepaid; cash at retail or venue; virtual assets. Markets differ in the rails they rely on, from mobile money to instant payments to cards and bank transfers, and the core records now describe all of them.
- The virtual-asset module keeps everything the Curaçao edition defined.

### Jurisdiction profiles

- New §5. Thresholds, aggregation windows, payout deadlines, retention periods and permitted rails are parameters of a jurisdiction profile rather than constants of the format.
- New Annex B: profiles for sixty-seven jurisdictions, researched from published sources, grouped by region and offered to each authority for review.
- The Curaçao profile in Annex B states the due-diligence threshold of NAf 4,000 per gaming day, the replacement of the Netherlands Antillean guilder by the Caribbean guilder (XCG) at 1:1, and the four transition steps of the crypto policy guideline.

### Mapping to existing formats

- New §7. The record model is mapped, indicatively, to financial intelligence reporting (goAML and national equivalents), the FINTRAC reporting API, SIGAP, central control systems, data vaults, central limit files and registers, and tax-authority feeds. The principle is to feed existing formats, not to replace them.

### Governance

- New §13. Sets out the role of the editor; states that authorities own their profiles and that corrections an authority makes to its own profile are adopted as submitted; and defines versioning.

### Carried over from the Curaçao edition revisions

So that the two editions do not diverge, the universal edition carries over the record-model and drafting changes made in revisions 2 and 3 of the Curaçao edition:

- account currency and account exchange rate in R3 and R4;
- R2 submitted as the full register at period end;
- `supersedes` in R5;
- a counterparty side and the `conversion` purpose in R6;
- provider-reported balances in R7;
- the design principle "Computed, not declared";
- the package fingerprint, defined as the SHA-256 hash of `manifest.json`;
- completeness checked against independent sources where they exist;
- a question to authorities on whether operators may refer to the Standard in the policies they file;
- the editor's contact details on every page, in a watermark and in the footer.

## Curaçao edition (September 2026)

The first edition, titled Crypto Transaction Reporting and Evidence Standard, covered virtual assets only, under the Curaçao Gaming Authority's crypto policy guideline. This entry lists its record-model changes only. Field names are those of the Curaçao edition; where the universal edition renamed a field, the new name is given in brackets.

### First draft (23 September 2026)

- Ten record types, R1 to R10.

### 1.0 (26 September 2026)

- R1: `custody_model` (self-custody, omnibus at a provider, hybrid), which selects the reconciliation profile.
- New R11 Custody Attestation: the provider's statement, standing in for on-chain evidence where funds sit in the provider's pooled wallet.
- R2: `unique_deposit_address`.
- R2, R3 and R4: `player_ref_scope`, because player references are not unique across the brands of one operator.
- R3 and R4: `credited_at`, the moment the player account was credited or debited, which prior checks must precede; `off_chain_movement`; `processor_reference` as the join key where no transaction hash exists [`rail_reference`].
- R5: `performed_by_party`.
- The value `not_recorded`, reported where a control left no record, so that an absence of evidence is visible.

### Revision 2 (26 September 2026)

- R11: a field table.
- R7: provider-reported opening and closing balances, for the pooled-custody reconciliation profile.

### Revision 3 (26 September 2026)

- R3 and R4: `account_currency` (mandatory) and `account_fx_rate` (conditional); `credited_amount` stated in the account currency; fees stated as deductions borne by the player, in units of the asset; `network_cost_reporting_ccy` (optional) for network costs borne by the operator [`operator_cost_reporting_ccy`].
- R2: submitted as the full register at period end rather than new links only; a player is identified by the pair `player_ref_scope` and `player_ref`.
- R5: `supersedes` links successive decisions, for example a step-up review followed by allow. In R3 and R4, `screening_decision_id` references the decision in force at crediting or dispatch [`check_ids`].
- R6: one side of a movement may be a counterparty from R10 (`counterparty_id`, `counterparty_address`); new purpose `conversion`.

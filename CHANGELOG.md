# Changelog

Changes to the text of the Common Transaction Reporting and Evidence Standard (CTRES), most recent first. Section numbers refer to the edition named in each entry.

## 1.1 — 5 November 2026 (release v1.1.0)

Version 1.1 brings gaming revenue into scope as totals, ties them to the money the package already carries, restructures the text around a core of four records and four conformance levels, and adds a streaming mode and a bet-level record, so that an operator can start from the return it already files, an authority can ask for exactly as much evidence as it will use, and a regime that receives data in real time is served by the same records. Under §13 this is a minor version: three record types, one block of profile parameters and a delivery mode are added; no existing record type changes.

- CTRES in one page: an unnumbered page after the contents — what the format is, the four core records, the money bridge, the four levels, and how an operator and an authority adopt it.
- Core and modules (§2, §4, §10): the core is the package manifest with R3 Deposit, R4 Withdrawal, R7 Reconciliation Statement and R13 Gaming Revenue Statement; the Custody module is R1, R2, R6, R10 and R11; the Supervision module is R5, R8, R9 and R12; the Venue module is R14; the Wagering module is R15. The record table of §4 names the core or module of each record.
- Streaming mode (§8.4; §3 "Two cadences, one record"): the same records delivered as a stream of events — a record in an envelope with a stream identifier, a strictly increasing sequence, the time of emission and an operation (create, update, void) — with a checkpoint per gaming day (first and last sequence, event count, SHA-256 of the event lines) listed in the period package, which remains the signed close. Latency, checkpoint cadence, bet-level data and transport are profile parameters (§5, submission); a reference push/pull interface is published with the schema. Validation (§11) gains a Stream class: envelope, order, checkpoints, latency, and reconciliation of the stream with the package. R13 gains statement_kind interim for hourly or daily statements in a stream.
- R15 Bet Event (§4.15), the Wagering module, optional at every level: the money facts of each bet, round, ticket or hand — player reference, product line, channel, currency, stake, time placed, status, and on settlement the winnings and time — never game content. Where R15 is present, each R13 line is computed from its bets under the profile's recognition parameter. Scope (§1.2, §2) and data protection (§12) say so.
- Conformance levels (§10, Annex D) redefined by scope: Level 1 Return (manifest + R13), Level 2 Evidence (+ R3, R4, R7; + R14 where a line is a venue line), Level 3 Custody (+ the Custody module), Level 4 Supervision (+ the Supervision module). Any record type may be included at any level; field requirements do not change with the level; at Levels 1 and 2 the instrument, provider, location and check identifiers are the operator's own and are resolved within the package only once the module that defines them is included. The former levels (Records, Structured, Continuous) described delivery; delivery is the submission mode of §8.1. The manifest declares the level; the profile may set the level the authority requires.
- Record model (§4): fourteen record types. R13 Gaming Revenue Statement is one line per licence, product line, channel, currency and period, with its core fields listed first (identifiers, period, currency, recognition basis, cash stakes, refunds, cash winnings, the declared gross gaming revenue and its formula, preparer, reviewer and evidence reference) and the conditional fields after them (corrections, brand, taxonomy code, venue, player location, currency conversion, bonus quantities, withholding tax, rake, jackpots, network settlements, open-bet position, volumes, levy self-assessment, the authority's figure). R14 Venue Count is one row per venue, unit and gaming day: meters for slot machines; inventory, fills, credits and drop for tables and counters; hard and soft count and variance for the count room; the win and its formula; and a reference to where the drop was banked. The money bridge between gaming totals and payment records is stated as an identity in §4.13. R1 gains an optional venue identifier; R12 report types include the levy return.
- Jurisdiction profiles (§5): a second block of parameters, Revenue and levy, with five parameters and a notes block: the levy formula per product line (base type, the R13 quantities that enter the base with their sign and any cap, the rate, bands or fixed amount, and the venue win formulas), recognition (stakes and winnings), period and filing (period, cut-off, due date, collector, channel, form and whose figure is the figure of record), negative periods (rule and netting scope) and aggregation (axes and product taxonomy); bonus, refund, chargeback, jackpot and tax treatments are terms of the formula. Notes carry, with their sources, what the parameters do not express. The profile may name a minimum conformance level.
- Design principles (§3): "Revenue is reconciled to money"; "Proportionate" now refers to the four levels.
- Mapping (§7), evidence packs (§9) and questions for authorities (§15) are shortened; §7 gains revenue and levy returns and data models, and gaming-system protocols and wager/win reporting schemas, as destinations for R13 and R14. Submission (§8): the periodic package carries the records of the declared level; the manifest carries the level. Validation (§11): the record types of the declared level present; references resolved by level; the money bridge within the profile's tolerance. Data protection (§12): R13 and R14 carry no personal data.
- Annex B is the Register of jurisdiction profiles and is published separately, in dated editions, as CTRES_Register.pdf and CTRES_Register.docx and at ctres.org/profiles/, where each jurisdiction has its own page; the Standard keeps Annex B as a two-paragraph section that defines the Register. Register edition of 5 November 2026: ninety-seven jurisdictions — seven added: Cabo Verde, Senegal, Côte d'Ivoire, Burkina Faso, Mali, Cameroon and Nigeria (Enugu); Part 1 unchanged for the earlier ninety; Part 2, Revenue and levy, filled for every jurisdiction — the levy base and rate, the bonus and open-bet rules, the period and deadline, and the filing channel; Part 3, Submission and streams, new for every jurisdiction — the submission mode the published rules imply, its cadence or latency, the central system, gateway or data vault and whether it receives bet-level data, and the transport. All researched from published sources and offered to each authority for review; a value seen only in a secondary source is marked "(to be confirmed)". Annex C: example R13 and R14 records. Annex D: the declared level and the records of that level. Annex E: Register, core, module, conformance level, levy formula, gross and net gaming revenue, stake, winnings, bonus stake, open-bet liability, drop, hold and meters.
- Roadmap (§14) revised around version 1.1 and the pilots. Cover: version 1.1, date, coverage and the Register edition; the watermark no longer carries a version. Annex C gains an R15 example and the same bet as two stream events. The Standard is about 26 pages; the Register about 35.

## 1.0 — Annex B edition of 3 November 2026 (release v1.0.6)

- Annex B: Spain — the Sistema de Control Interno is named with its instrument (RD 1613/2011 art. 13; DGOJ data model of 6 June 2024, XSD 3.3 mandatory since 22 March 2025); the row now records that the SCI holds an operator account with GGR per game type monthly and a four-year minimum retention. Re-verified from the primary texts. The record model, fields and profile parameters are unchanged.

## 1.0 — editorial revision, 3 November 2026 (release v1.0.5)

- §1.3 and Annex F, which compared this text with a pre-release draft, are removed, together with the "Editions" row on the cover. The record model, fields, profile parameters and Annex B (edition of 1 November 2026) are unchanged.

## 1.0 — published status, 1 November 2026 (release v1.0.4)

- Status: version 1.0 is published, open for implementation and for public comment, as a voluntary and independent standard. "Draft for consultation" is removed from the cover, the status row, the page footer and the watermark.
- The release v1.0.2 entry below now lists the British Columbia part of the Canada profile as updated rather than reviewed, at the authority's request.
- Annex B (edition of 1 November 2026), the record model, fields and profile parameters are unchanged.

## 1.0 — Annex B edition of 1 November 2026 (release v1.0.3)

A new Annex B edition and a clarification of §13. The record model, fields and profile parameters are unchanged.

- §13 Versioning clarified: Annex B is a dated edition of the register of profiles. Adding or correcting jurisdiction profiles publishes a new Annex B edition and does not change the version of the Standard (the earlier wording listed profiles both as a reason for a minor version and as versioned separately). The cover gains an "Annex B edition" row.

### Annex B

Twenty-three jurisdiction profiles added: Annex B now carries ninety, in four regions, with the Asian region renamed Eurasia, Middle East, Asia and Pacific. Added with values researched from the primary instruments: Australia (Interactive Gambling Act 2001, including the 2024 credit and digital-currency ban and the BetStop register; AML/CTF Act 2006), Liechtenstein (Geldspielgesetz, Geldspielverordnung, Sorgfaltspflichtgesetz), North Macedonia (Law on Games of Chance 2026), Mauritius (GRA Act 2007 as consolidated at 16 June 2026), and eight United States state rows alongside New Jersey - New York, Pennsylvania, Michigan, Delaware, West Virginia, Virginia, Colorado and Iowa (state codes plus the federal 31 CFR 1021 layer). Also added with values researched from the primary instruments: Jersey (JGC codes of practice and the Gambling (Jersey) Law 2012), Belarus (Presidential Decree No. 226 of 2025 and Council of Ministers Resolution No. 764 of 2025 - the SKKS system, next-banking-day payouts), Uruguay (Decretos 366/017 and 379/018, Ley 19.535), Kahnawà:ke (Regulations concerning Interactive Gaming, 25 March 2026, and the AML/CTF Regulations 2021), Comoros (Anjouan) (the published Anjouan Gaming framework), and the United States rows for Nevada, North Carolina, Arkansas, Mississippi and Nebraska (state codes plus the federal layer). Comoros (Mohéli) is recorded as having no locatable regulator or instruments. New rows are researched from published sources, as at 1 November 2026. The record model, fields and profile parameters are unchanged.

Reviewed by their authority:

- Annex B: Czech Republic - reviewed with the Ministry of Finance (Gambling Regulation Unit, 30 October 2026); four amendments adopted as submitted: only monetary funds may be used as stakes; user-account funds paid out without undue delay, extendable to up to 60 days in justified cases; identification always mandatory when the user account is opened; the security deposit (kauce) tied to the operator rather than game types, four categories from CZK 20 million to CZK 300 million set from the gambling tax paid for the preceding period (§ 95), provided by transfer to the Ministry's account or by bank guarantee, and no longer used to cover unpaid winnings.

## 1.0 — Annex B revision, 13 October 2026 (release v1.0.2)

Every profile row below was re-verified cell by cell against the primary instruments - acts, regulations, regulator standards, licence conditions and FIU rules, each opened and quoted - after a regulator's correction showed that parts of v1.0 had been written from index pages. Twenty-four of the 67 rows are updated in this release; three of them were additionally reviewed by their authority, whose corrections are adopted as submitted. The record model, fields and profile parameters are unchanged.

Reviewed by their authority:

- Annex B: Latvia - reviewed with the State Revenue Service (8 October 2026): player-owned credit cards and PSPs permitted with every transaction identified to a person; closed loop confirmed; player funds in a Latvian credit institution; quarterly turnover reports on demand and VID remote access to platforms.
- Annex B: Lithuania - reviewed with the Gaming Control Authority (12 October 2026): operator platform connected to LAKIS, transmitting at least every 30 days; identification and registration at EUR 1,000 on deposits, payouts and exchanges.
- Annex B: Norway - reviewed with Lotteritilsynet (13 October 2026): exclusive-rights model plus a licensed private market for online and internet bingo; eID an operator's choice, full identification at registration; mandatory daily and monthly bet limits; a separate gambling account for each player.

Re-verified from primary sources:

- Annex B: Canada - British Columbia part updated (7 October 2026). FINTRAC corrected: large cash, casino disbursement and large virtual currency reports within 15 calendar days (LVCTR 5 working days), not 24 hours.
- Annex B: United Kingdom - casino due diligence threshold GBP 2,000 (not EUR) since 30 June 2026 (MLR 2017 reg 27(5) as amended); financial-limit prompt wording aligned to RTS 12A/12E.
- Annex B: Ireland - authority named in full (GRAI, commenced 5 March 2025); segregation power s.136 and credit ban s.165 dates verified in the Act and S.I.s.
- Annex B: Malta - VFA deposits only with prior MGA approval under the DLT Policy; 5-working-day payout qualified as in Art 29(1); EUR 2,000 threshold computed daily or over rolling 180 days (two permitted methods).
- Annex B: Isle of Man - winnings paid back to a deposit instrument the operator is satisfied belongs to the customer (AML/CFT guidance V1.3 para 29); EUR 3,000-in-30-days verification confirmed as Code 2019 rule; client account at a recognised Isle of Man bank.
- Annex B: Germany - payouts to a payment account in the player's name (GlüStV § 6b(4)); GwG § 16 payment rules (EUR 25/100 exceptions, no interest) cited from the official text; deposit-limit guideline EUR 10,000/30,000 noted.
- Annex B: Austria - concessions granted by Finanzamt Österreich since 2021; AML duties via GSpG § 31c and FM-GwG; retention ten years, not five; bill 594 d.B. provisions (central Sperrregister, PSP payment stops within 3 banking days) dated to their 1 January 2027 entry into force.
- Annex B: Czech Republic - cash deposits and withdrawals allowed up to CZK 10,000 per 24 hours (not cashless); RVO exclusion register categories completed; blocklists moved to §§ 84a-84h with PSP account blocking; daily automated reporting confirmed.
- Annex B: Slovakia - AML reports to the FSJ of the Police Presidium; payment providers block on the ÚRHH weekly blacklist without a court order (from 1 January 2026); financial guarantees EUR 750k-1.5m; game-data backups and 5-year AML retention cited.
- Annex B: Estonia - stakes may be money or crypto-assets by definition since 1 January 2026 (§ 2(2)); credit-agreement ban § 34; player-account payment rule grounded in § 53(1)(5)-(6); AML retention cited from RahaPTS § 47.
- Annex B: Finland - authorities staged: Poliisihallitus until 30 June 2027, then LVV; licence application dates corrected; player-set transfer limits per licence holder; no payment-blocking provision in the 2026 Act.
- Annex B: Sweden - credit ban is general (any credit-financed play), instrument names come from the preparatory works; own-account rule wording verified.
- Annex B: Poland - state monopoly covers all online gambling except betting and promotional lotteries; payments exclusively through Payment Services Act providers; STRs within 2 business days and EUR 15,000 reports cited; winnings register and quarterly data added.
- Annex B: Bosnia and Herzegovina - AML instrument named (Law 13/24, Official Gazette 19 February 2024): STR before execution, cash and connected KM 30,000 reports within 3 days, 10-year retention; licence guarantees are performance guarantees from Federation-seated banks.
- Annex B: Philippines - payment providers accredited by PAGCOR with BSP licences; BSP M-2025-029 covers all BSP-supervised institutions (48-hour link removal); Circular 1237/2026 marketplace ban; registration at 21+ with government ID; 6-year PAGCOR record retention.
- Annex B: Curaçao - CDD at NAf 4,000 calculated daily across deposits and withdrawals; unusual-transaction threshold XCG 5,000; incident reports within 24 hours; portal deadlines suspended while the CGA portal is offline.
- Annex B: Brazil - row restated on the Lei 14.790 regime with Medida Provisória 1.394/2026 wind-down dates; permitted rails from Portaria 615 art. 3 (Pix, TED, debit, prepaid, book transfer); SIGAP identity checks every 15 days (IN 22/2025); reporting duties and 5 October 2026 balance snapshot from Portaria 3.005/2026.
- Annex B: Paraguay - CONAJZAR an autonomous unit of DNIT under Ley 7438/2025; prizes claimed within 60 working days, unclaimed to FONARESS; CDD from 8 minimum wages, STR within 24 hours of qualification, quarterly nil reports, 5-year retention cited from Res. SEPRELAD 258/2020 (official text OCR'd).
- Annex B: South Africa - cash and EFT usage grounded in the FIC sector risk assessment; Western Cape own-name account and record rules cited from the Bookmakers Operational Rules; registered-remitter reporting via FIC Directive 6/2023.
- Annex B: Botswana - no online gambling regime in the 2012 Act or 2016 Regulations (row scoped to land-based); Bank of Botswana AML regs cited (CDD and cash reports at P10,000, STRs within five working days); VASP licensing under the Virtual Assets Act 2025 noted.
- Annex B: United States (New Jersey) - one account per patron per brand; patron-funds bank account and monthly certification schedule cited from N.J.A.C. 13:69O; no state CTR/SAR rule (federal Title 31 only), 13:69D searched in full.
- Annex B: Canada (federal and provincial parts) and the three reviewed rows above also carry the audit's citation-level corrections.

Register: the review register (authority, date, attribution, cells) is kept in reviews.json and shown on the site's profiles page.

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

First public version: one evidence format for every payment rail, applied under each jurisdiction's rules through jurisdiction profiles.

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
- Virtual assets are one of the seven rail modules (§6).

### Jurisdiction profiles

- New §5. Thresholds, aggregation windows, payout deadlines, retention periods and permitted rails are parameters of a jurisdiction profile rather than constants of the format.
- New Annex B: profiles for sixty-seven jurisdictions, researched from published sources, grouped by region and offered to each authority for review.
- The Curaçao profile in Annex B states the due-diligence threshold of NAf 4,000 per gaming day, the replacement of the Netherlands Antillean guilder by the Caribbean guilder (XCG) at 1:1, and the four transition steps of the crypto policy guideline.

### Mapping to existing formats

- New §7. The record model is mapped, indicatively, to financial intelligence reporting (goAML and national equivalents), the FINTRAC reporting API, SIGAP, central control systems, data vaults, central limit files and registers, and tax-authority feeds. The principle is to feed existing formats, not to replace them.

### Governance

- New §13. Sets out the role of the editor; states that authorities own their profiles and that corrections an authority makes to its own profile are adopted as submitted; and defines versioning.


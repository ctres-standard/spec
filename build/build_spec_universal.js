// CTRES v1.1 (universal edition) — Common Transaction Reporting and Evidence Standard
// v1.1 adds R13 Gaming Revenue Statement, R14 Venue Count, the "Revenue and levy" profile block (§5) and Annex B Part 2.
// Build: node build_spec_universal.js <out.docx>              the Standard (Annex B as a pointer to the Register)
//        node build_spec_universal.js --register <out.docx>   the Register of jurisdiction profiles (Annex B rows)
// Reads assets/watermark.png and, if present, annex_b_data.js (private; never published as data).
const fs = require('fs');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
        WidthType, ShadingType, AlignmentType, PageBreak, Footer, Header, PageNumber, LevelFormat,
        PageOrientation, ImageRun, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom,
        HorizontalPositionAlign, VerticalPositionAlign } = d;
const path = require('path');
const BRAND = { email: 'hello@ctres.org', web: 'ctres.org' };
const WM = fs.readFileSync(path.join(__dirname, 'assets', 'watermark.png'));

const REGISTER = process.argv.includes('--register');
const OUT = process.argv.filter((a) => a !== '--register')[2] || (REGISTER ? 'CTRES_Register.docx' : 'CTRES_v1.1.docx');
const REGISTER_EDITION = '4 November 2026';
const REGISTER_COUNT_WORDS = 'ninety';
const FONT = 'Arial';
const W = 9746;      // A4 portrait usable width (11906 - 2*1080)
const WL = 14678;    // A4 landscape usable width (16838 - 2*1080)
const VERSION = 'CTRES v1.1';
const FOOTER_LEFT = REGISTER ? `CTRES Register — edition of ${REGISTER_EDITION}` : VERSION;

const P = (text, o = {}) => new Paragraph({
  spacing: { before: o.before, after: o.after === undefined ? 120 : o.after, line: 264 },
  alignment: o.align, indent: o.indent,
  children: [new TextRun({ text, font: FONT, size: o.size || 20, bold: o.bold, italics: o.italics, color: o.color })],
});
const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 140 },
  children: [new TextRun({ text: t, font: FONT, size: 28, bold: true, color: '1F3864' })] });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 220, after: 100 },
  children: [new TextRun({ text: t, font: FONT, size: 22, bold: true, color: '2E5496' })] });
const BUL = (t, o = {}) => new Paragraph({ numbering: { reference: 'bul', level: 0 }, spacing: { after: 60, line: 264 },
  children: [new TextRun({ text: t, font: FONT, size: o.size || 20 })] });
const BR = () => new Paragraph({ children: [new PageBreak()] });

const cell = (text, w, o = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA },
  shading: o.head ? { type: ShadingType.CLEAR, fill: '1F3864' } : (o.alt ? { type: ShadingType.CLEAR, fill: 'F2F2F2' } : undefined),
  margins: { top: 50, bottom: 50, left: 80, right: 80 },
  children: [new Paragraph({ spacing: { after: 0, line: 230 },
    children: [new TextRun({ text, font: FONT, size: o.size || 18, bold: o.head || o.bold, color: o.head ? 'FFFFFF' : undefined })] })],
});
const table = (headers, rows, widths, o = {}) => new Table({
  columnWidths: widths,
  width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  rows: [
    new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, widths[i], { head: true, size: o.size })) }),
    ...rows.map((r, ri) => new TableRow({ cantSplit: !!o.cantSplit, children: r.map((c, i) => cell(c, widths[i], { alt: ri % 2 === 1, size: o.size, bold: o.boldFirst && i === 0 })) })),
  ],
});
const fieldTable = (rows) => table(['Field', 'Type', 'Req.', 'Purpose'], rows, [2500, 1500, 700, 5046], { cantSplit: true });
const code = (t) => new Paragraph({ spacing: { after: 120 }, shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
  children: [new TextRun({ text: t, font: 'Courier New', size: 15 })] });

const footer = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  new TextRun({ text: `${FOOTER_LEFT} — ${BRAND.web} — page `, font: FONT, size: 15, color: '808080' }),
  new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 15, color: '808080' })] })] });
// page sizes in points: portrait 595 x 842, landscape 842 x 595; image px at 96 dpi = 0.75 pt
const header = (w, h, pageW, pageH) => new Header({ children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: WM,
  transformation: { width: w, height: h },
  floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: Math.round((pageW - w * 0.75) / 2 * 12700) },
              verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round((pageH - h * 0.75) / 2 * 12700) },
              behindDocument: true, allowOverlap: true } })] })] });

// =====================================================================
const body = [];

// ---------------- COVER ----------------
body.push(new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: 'PUBLISHED STANDARD — INDEPENDENT AND OPEN', font: FONT, size: 16, bold: true, color: '2E5496' })] }));
body.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'Common Transaction Reporting and Evidence Standard', font: FONT, size: 44, bold: true, color: '1F3864' })] }));
body.push(new Paragraph({ spacing: { after: 320 }, children: [new TextRun({ text: 'An open, rail-neutral format for evidencing payment flows and gaming revenue in regulated gambling', font: FONT, size: 24, color: '404040' })] }));
body.push(table(['Item', 'Detail'], [
  ['Short name', 'CTRES v1.1 — universal edition'],
  ['Status', 'Published, version 1.1. Open for implementation and for public comment. A voluntary, independent standard: it carries no regulatory force and creates no new obligations.'],
  ['Date', '4 November 2026 (version 1.1; version 1.0 first published 2 October 2026)'],
  [`Register edition`, `${REGISTER_EDITION} — ${REGISTER_COUNT_WORDS} jurisdictions. Annex B, the Register of jurisdiction profiles, is published separately (CTRES_Register.pdf; ctres.org/profiles/)`],
  ['Editor', 'Dmitry Skachko'],
  ['Contact', 'hello@ctres.org'],
  ['Website', 'https://ctres.org'],
  ['Coverage', 'Every payment rail — cards, bank and instant payments, e-money, mobile money, vouchers, cash at retail, virtual assets — and the gaming revenue reconciled to the money they carry, under any jurisdiction’s rules, through jurisdiction profiles. Four conformance levels: an operator starts with the return it already files (Level 1) and adds the money behind it step by step (§10)'],
  ['Licence to use', 'The text is licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). Any operator, supplier or authority may implement the Standard without fee or permission. The schema and a reference validator for structural and referential checks are published under the Apache License 2.0 at github.com/ctres-standard. Governance is set out in §13.'],
  ['Comments', 'Through the public issue tracker at github.com/ctres-standard/spec, or to hello@ctres.org. Every authority is invited to correct its own profile in the Register (Annex B); corrections an authority makes to its own profile are adopted as submitted.'],
], [2100, 7646]));
body.push(BR());

// ---------------- CONTENTS ----------------
body.push(H1('Contents'));
[['', 'CTRES in one page'], ['1.', 'Purpose and status'], ['2.', 'Scope'], ['3.', 'Design principles'], ['4.', 'Record model (R1–R14)'],
 ['5.', 'Jurisdiction profiles'], ['6.', 'Rail modules'], ['7.', 'Mapping to existing regulatory formats'],
 ['8.', 'Submission and access'], ['9.', 'Evidence pack'], ['10.', 'Conformance levels'], ['11.', 'Validation'],
 ['12.', 'Data protection, confidentiality and retention'], ['13.', 'Governance and versioning'], ['14.', 'Roadmap'],
 ['15.', 'Questions for authorities'],
 ['A.', 'Field catalogue'], ['B.', 'Jurisdiction profiles — the Register (published separately)'], ['C.', 'Example records'],
 ['D.', 'Conformance declaration (template)'], ['E.', 'Glossary']]
 .forEach(([n, t]) => body.push(new Paragraph({ spacing: { after: 60 }, indent: { left: 200 },
   children: [new TextRun({ text: n ? n + '  ' : '', font: FONT, size: 20, bold: true, color: '2E5496' }), new TextRun({ text: t, font: FONT, size: 20 })] })));
body.push(BR());

// ---------------- ONE PAGE ----------------
body.push(H1('CTRES in one page'));
body.push(P('CTRES is a file format in which a licensed gambling operator evidences the money it handles and the gaming revenue it declares, in one shape for every payment rail and every regulator. An operator produces a package of JSON Lines files with a manifest; the authority receives it through the channel it already uses and checks it mechanically. The Standard creates no obligation: it formats evidence of duties that already exist, and a jurisdiction profile (§5) sets the parameters — thresholds, deadlines, permitted rails, the levy base — that apply.'));
body.push(P('Four records are the core. Everything else is a module an authority asks for when it needs it.', { after: 60 }));
body.push(table(['Core record', 'One line per…', 'What it evidences'], [
  ['R3 Deposit / R4 Withdrawal', 'payment', 'What came in and went out, on which instrument, when it was credited or paid'],
  ['R7 Reconciliation Statement', 'funds location and period; licence and period', 'Books against statements; player balances against the funds held to cover them'],
  ['R13 Gaming Revenue Statement', 'licence, product line, channel, currency and period', 'Stakes, winnings, refunds and bonus quantities, and the gross gaming revenue declared on them, with the formula used'],
], [2500, 2700, 4546], { size: 17 }));
body.push(P('', { after: 40 }));
body.push(P('One identity ties the revenue to the money, for a licence, currency and period — the money bridge (§4.13):', { after: 60 }));
body.push(code('(stakes_cash + stakes_bonus − stakes_refunded) − (winnings_cash + winnings_bonus) = deposits − withdrawals − Δ player balances − Δ open-bet liability + bonus_granted − bonus_expired'));
body.push(P('Adoption is stepwise. An operator declares a conformance level (§10) and the package carries at least the records of that level; the authority checks what the level allows it to check.', { after: 60 }));
body.push(table(['Level', 'Records', 'The authority can check'], [
  ['1 — Return', 'manifest + R13', 'The return it already receives, in a structure a validator checks: schema, arithmetic, one statement per currency'],
  ['2 — Evidence', '+ R3, R4, R7 (+ R14 for venues)', 'The money bridge: declared revenue against deposits, withdrawals and balances; venue win against the count'],
  ['3 — Custody', '+ R1, R2, R6, R10, R11', 'Where player money sits, who holds it, provider attestations, segregation'],
  ['4 — Supervision', '+ R5, R8, R9, R12', 'Checks before money moves, exceptions, incidents, reports filed elsewhere'],
], [1700, 2700, 5346], { size: 17 }));
body.push(P('', { after: 40 }));
body.push(BUL('For an operator: Level 1 is the figures of the levy return you already file, as one R13 line per product and period; Level 2 adds the deposits, withdrawals and period balances your payment and wallet systems already hold. The schema and the validator are free (github.com/ctres-standard).'));
body.push(BUL('For an authority: confirm your profile in the Register (Annex B), choose the level you require, and receive packages through your existing channel. The Standard proposes no new system and moves no data across borders (§8).'));
body.push(BUL('Where to look: the record model is §4; profiles and the levy parameters, §5; validation, §11; the Register of ninety jurisdiction profiles is published separately and at ctres.org/profiles/. Questions and corrections: hello@ctres.org.'));
body.push(BR());

// ---------------- 1 ----------------
body.push(H1('1. Purpose and status'));
body.push(H2('1.1 The problem this Standard addresses'));
body.push(P('Every gambling regulator asks operators the same six questions about money. Did it come from the player? Was it checked before it was accepted? Was it credited correctly? Where did it go when it left? Is the money owed to players actually there? What did the house win, by product and period, and does it match the money? Each regulator asks in its own format, on its own calendar and through its own channel.'));
body.push(P('The research behind this version reviewed the published rules of ninety jurisdictions on six continents (the Register, Annex B). The questions are the same in all of them; what differs is a small set of parameters — which rails are permitted, at what amounts checks and reports are triggered, over what window amounts are aggregated, how quickly a payout must be made, where data is held and for how long, and, for revenue, what counts as a stake, a winning and a bonus and over what period the house win is levied. Without a common format an operator licensed in several jurisdictions rebuilds the same evidence for each; more than half of the jurisdictions reviewed run or are building a central system, data vault or state register, each defining the operator-side data afresh; and an operator that has implemented its controls well cannot prove it more cheaply than one that has not. CTRES defines the shape of the evidence once and lets each jurisdiction set its own parameters.'));

body.push(H2('1.2 What this Standard is not'));
body.push(BUL('It creates no obligation. It formats evidence of duties that already exist under each jurisdiction’s law and licence conditions.'));
body.push(BUL('It does not replace any authority’s central system, reporting portal or financial intelligence reporting schema, such as goAML, the FINTRAC reporting API, Infostat-UIF or SIGAP. It is the operator-side evidence layer from which those submissions can be produced (§7).'));
body.push(BUL('It is independent of any authority. Every reference to a jurisdiction’s rules is a reading of published sources, offered to the authority concerned for review.'));
body.push(BUL('It names no vendor and requires none.'));
body.push(BUL('It does not cover records of individual bets, rounds and game outcomes, which it references but does not reproduce; totals of stakes and winnings by product and period are in scope (R13, R14). It does not cover marketing data or behavioural analytics.'));

// ---------------- 2 ----------------
body.push(H1('2. Scope'));
body.push(H2('2.1 In scope'));
body.push(P('Licensed gambling operators — online and, where an authority so chooses, retail and land-based — and the payment providers acting for them, for:'));
body.push(BUL('Core: player deposits and withdrawals on any rail, with taxes levied or withheld at the payment (R3, R4); reconciliation of each funds location and of total player liabilities against the funds held to cover them (R7); totals of stakes, winnings, refunds and bonus credits by product, channel, currency and period, with the gaming revenue declared on them and, where the profile requires self-assessment, the levy base (R13).'));
body.push(BUL('Custody module: every location where the operator holds money, the instruments linked to players, movements between the operator’s own locations, the providers that handle player money and their attestations (R1, R2, R6, R10, R11).'));
body.push(BUL('Supervision module: checks that precede the movement of money — identity and holder verification, sanctions, eligibility and exclusion registers, limits, source of funds, fraud and blockchain analytics — exceptions, incidents, and references to reports filed with other authorities (R5, R8, R9, R12).'));
body.push(BUL('Venue module: for land-based venues, the counts behind the revenue line — meters, drop, fills, credits and the count-room totals (R14).'));
body.push(H2('2.2 Out of scope'));
body.push(P('Records of individual bets, rounds and game outcomes, which the revenue statement references but does not reproduce; marketing and affiliate data; behavioural analytics; and the content of suspicious transaction reports, which remains under the confidentiality rules of each jurisdiction (§12).'));

// ---------------- 3 ----------------
body.push(H1('3. Design principles'));
body.push(table(['Principle', 'What it means in practice'], [
  ['No new obligations', 'The Standard formats evidence of duties that already exist. A field that cannot be traced to a requirement in at least one jurisdiction is optional.'],
  ['Rail-neutral core, rail modules at the edge', 'Fields common to every rail live in the core records. Fields that exist on one rail only — a transaction hash, a card BIN, a mobile money receipt, a retail point identifier — live in a rail module (§6).'],
  ['Jurisdiction as configuration', 'Thresholds, aggregation windows, deadlines, permitted rails and retention periods are profile parameters, never constants in the format. Records carry the raw facts needed to apply any profile.'],
  ['Map, don’t replace', 'Regulators keep their own channels and schemas. CTRES records carry the references those systems issue and can be transformed into their formats.'],
  ['Evidence over assertion', 'A control is reported as the record it produced, with a timestamp and an actor, not as a statement that the control exists.'],
  ['Computed, not declared', 'Where a fact can be derived from other records — a payout to the instrument that funded the account, a movement out of player funds, the time taken to report an incident — validation derives it instead of trusting a flag the operator sets.'],
  ['Revenue is reconciled to money', 'The gaming revenue an operator declares (R13) is tied to the deposits, withdrawals, player balances and open-bet liability the same package carries (R3, R4, R7) through the money bridge (§4.13), so that a declared figure can be tested rather than trusted.'],
  ['Visible gaps', 'Where a control left no record, the field is reported as not_recorded rather than omitted, so that an absence of evidence is visible and is not mistaken for an export error.'],
  ['Pseudonymous by default', 'Periodic submissions carry player references, masked account numbers and hashed phone numbers — never identity documents.'],
  ['Proportionate', 'Four conformance levels (§10) let an operator start with the return it already files and add the money behind it step by step; the profile sets the level an authority requires.'],
  ['Deterministic and verifiable', 'The same inputs produce the same package. Every package carries a manifest with a hash per file and may carry a signature, so a submission can be proved unaltered.'],
  ['Currency-aware', 'Amounts are decimal strings with an ISO 4217 code or an asset identifier, plus a reporting-currency value with its rate and source, so that thresholds in any currency can be applied. Thresholds set in indexed units — minimum wages, UMA, UIT, base units — are converted with the value in force on the transaction date, which the profile records.'],
], [2500, 7246]));

// ---------------- 4 ----------------
body.push(H1('4. Record model (R1–R14)'));
body.push(P('Fourteen record types. Each record is one line of JSON; each file holds one record type for one period. Four of them — R3, R4, R7 and R13, with the package manifest — are the core; the others form three modules, Custody (R1, R2, R6, R10, R11), Supervision (R5, R8, R9, R12) and Venue (R14), which the conformance levels of §10 add in steps. The fields listed below are the ones an implementation needs; rail-module fields are described in §6, and the complete catalogue is maintained as a machine-readable schema (Annex A), published at github.com/ctres-standard/schema.'));
body.push(table(['ID', 'Record', 'Core or module', 'The question it answers'], [
  ['R1', 'Funds Location', 'Custody', 'Where does the operator hold money, for what purpose, and under what protection?'],
  ['R2', 'Payment Instrument Link', 'Custody', 'Does this instrument belong to this player, and may it receive payouts?'],
  ['R3', 'Deposit', 'Core', 'What came in, from which instrument, when was it credited, and what was checked first?'],
  ['R4', 'Withdrawal', 'Core', 'What went out, to which instrument, who released it, and how quickly?'],
  ['R5', 'Check Decision', 'Supervision', 'Which control ran, before which event, with what outcome?'],
  ['R6', 'Internal Movement', 'Custody', 'Did money move between the operator’s own locations, and was segregation kept?'],
  ['R7', 'Reconciliation Statement', 'Core', 'Do the books match the external statements, and are player liabilities covered?'],
  ['R8', 'Exception', 'Supervision', 'What could not be explained, for how much, for how long, and who owns it?'],
  ['R9', 'Incident', 'Supervision', 'What happened that an authority must be told, and when was it told?'],
  ['R10', 'Provider Register', 'Custody', 'Who handles the money, under whose authorisation, after what due diligence?'],
  ['R11', 'Provider Attestation', 'Custody', 'Where the operator cannot see the money directly, what does the provider certify?'],
  ['R12', 'Report Reference', 'Supervision', 'Which reports were filed elsewhere, triggered by which records, against which deadline?'],
  ['R13', 'Gaming Revenue Statement', 'Core', 'What did the house win, by product and period?'],
  ['R14', 'Venue Count', 'Venue', 'What did the gaming floor count — meters, drop, fills, credits?'],
], [700, 2400, 1300, 5346]));

body.push(H2('4.1 R1 Funds Location'));
body.push(P('Every place the operator holds money, in any form. This is the record that answers segregation and protection requirements.'));
body.push(fieldTable([
  ['location_id', 'string', 'M', 'Stable internal identifier'],
  ['location_type', 'enum', 'M', 'bank_account | provider_balance | mobile_money_collection | emoney_account | crypto_wallet | cash_float'],
  ['purpose_class', 'enum', 'M', 'player_funds | operational | treasury | tax_withheld | reserve_or_guarantee'],
  ['provider_id', 'string', 'C', 'Institution holding the location, from R10'],
  ['identifier_masked', 'string', 'M', 'Masked account number, paybill or short code, or wallet address'],
  ['currency_or_asset', 'string', 'M', 'ISO 4217 code or asset identifier'],
  ['protection_mechanism', 'enum', 'M', 'segregated_account | trust | separate_estate | guarantee | reserve | none'],
  ['custody_model', 'enum', 'M', 'direct | omnibus_at_provider | hybrid — selects the reconciliation profile (§4.7)'],
  ['controlling_entity', 'string', 'M', 'Legal entity that controls the location'],
  ['location_jurisdiction', 'string', 'M', 'Country where the funds are held, for location rules'],
  ['venue_id', 'string', 'O', 'Land-based venue a cash float or cage belongs to, so that a venue count (R14) can reference it'],
  ['opened_at / closed_at', 'datetime', 'M/C', 'Lifecycle of the location in the inventory'],
  ['ownership_evidence_ref', 'string', 'M', 'Reference to the proof of control held on file'],
]));

body.push(H2('4.2 R2 Payment Instrument Link'));
body.push(P('The link between a player and a payment instrument: whose it is, how that was established, and whether payouts may go to it. R2 is submitted as the full register at period end — every link ever made, including revoked ones with their status — and a player is identified by the pair player_ref_scope and player_ref, so that the same reference in two brands is never merged.'));
body.push(fieldTable([
  ['instrument_id', 'string', 'M', 'Stable, tokenised identifier'],
  ['player_ref / player_ref_scope', 'string', 'M', 'Pseudonymous player reference, and the brand or licence it belongs to'],
  ['rail', 'enum', 'M', 'card | bank_transfer | emoney | mobile_money | carrier_billing | voucher | cash | virtual_asset'],
  ['instrument_detail', 'object', 'M', 'Rail-module fields (§6): masked card, masked account number, instant-payment key type, hashed phone number, wallet address'],
  ['funding_type', 'enum', 'C', 'debit | credit | prepaid | deferred | invoice | bnpl | unknown — needed wherever credit in any form is prohibited'],
  ['issuer_country', 'string', 'C', 'Country of the institution that issued the instrument — needed wherever only domestic instruments are permitted'],
  ['holder_match', 'enum', 'M', 'match | partial | no_match | not_checked | not_available'],
  ['holder_verification_method', 'enum', 'C', 'issuer_check | bank_name_check | open_banking | instant_payment_directory | mobile_operator_kyc | signed_message | micro_transfer | provider_attestation | document'],
  ['verified_at / verified_by', 'datetime / string', 'C', 'When and by whom'],
  ['national_id_match', 'enum', 'C', 'match | no_match | not_checked — where accounts must be held under the player’s national identifier'],
  ['payout_status', 'enum', 'M', 'not_eligible | pending | active | revoked'],
]));

body.push(H2('4.3 R3 Deposit and 4.4 R4 Withdrawal'));
body.push(P('The two records that carry the money. Both reference the instrument, the checks relied upon and the ledger entry, so that the payment, the decision and the player balance can be tied together without further enquiry. At Level 2 (§10) the instrument, provider and check identifiers are the operator’s own identifiers, carried in the record and resolved within the package only once the Custody and Supervision modules are included; check_ids may then be empty.'));
body.push(fieldTable([
  ['tx_id', 'string', 'M', 'Internal transaction identifier'],
  ['player_ref / player_ref_scope', 'string', 'M', 'As in R2'],
  ['direction', 'enum', 'M', 'deposit | withdrawal'],
  ['rail / instrument_id', 'enum / string', 'M', 'Rail, and the R2 instrument used'],
  ['provider_id', 'string', 'M', 'From R10'],
  ['rail_reference / rail_reference_type', 'string / enum', 'M', 'The identifier the rail itself issued: acquirer reference, end-to-end instant-payment ID, mobile operator receipt, voucher serial or transaction hash'],
  ['authority_reference', 'string', 'C', 'Identifier issued by an authority’s central system, where one exists'],
  ['amount / currency_or_asset', 'decimal / string', 'M', 'As transacted'],
  ['amount_reporting_ccy / fx_rate / fx_source', 'decimal / string', 'M', 'Value used for thresholds, with the rate and its source'],
  ['initiated_at / settled_at', 'datetime', 'M', 'When the payment was initiated, and when the rail settled it'],
  ['credited_at', 'datetime', 'M', 'When the player account was credited or debited — the moment that prior checks must precede'],
  ['account_currency / account_fx_rate', 'string / decimal', 'M/C', 'Currency of the player account, and the rate applied where it differs from the payment currency'],
  ['credited_amount / ledger_entry_ref', 'decimal / string', 'M', 'Amount posted to the player account, in the account currency, and the ledger entry'],
  ['fees', 'object', 'M', 'Rail, provider and network fees charged to the player, separated'],
  ['operator_cost_reporting_ccy', 'decimal', 'O', 'Rail or network costs borne by the operator, in the reporting currency'],
  ['tax_lines', 'array', 'C', 'Tax levied or withheld at this payment: type, rate, amount, authority, due date, remittance reference'],
  ['check_ids', 'array', 'M', 'R5 decisions in force at the moment of crediting or dispatch'],
  ['limit_check', 'enum', 'C', 'within_limit | blocked | reduced | not_applicable | not_recorded'],
  ['outcome', 'enum', 'M', 'accepted | rejected | frozen | returned | pending_review'],
  ['requested_at / paid_at', 'datetime', 'M', 'Withdrawals: measures payout time against the profile’s deadline'],
  ['destination_rule', 'enum', 'M', 'Withdrawals: same_instrument | same_holder_other_instrument | profile_route | exception — the closed-loop evidence'],
  ['source_instrument_ids', 'array', 'C', 'Withdrawals: deposit instruments the payout is matched to'],
  ['approved_by / approved_at', 'string / datetime', 'M', 'Withdrawals: the person or rule that released the payment'],
]));

body.push(H2('4.5 R5 Check Decision'));
body.push(P('Any control that runs before money moves, recorded in a common vocabulary so that outcomes remain comparable across providers and registers. The Standard does not prescribe scoring.'));
body.push(fieldTable([
  ['check_id', 'string', 'M', 'Identifier'],
  ['subject_type / subject_ref', 'enum / string', 'M', 'player | instrument | transaction | address | provider'],
  ['check_type', 'enum', 'M', 'identity | biometric | holder_match | sanctions | pep | eligibility_register | self_exclusion | limit | cross_operator_limit | credit_register | source_of_funds | financial_risk | fraud | blockchain_analytics | travel_rule'],
  ['register_or_provider / version', 'string', 'M', 'The register, list or provider consulted'],
  ['performed_by_party', 'enum', 'M', 'operator | provider | authority_system | other'],
  ['performed_at', 'datetime', 'M', 'Must precede crediting or dispatch wherever the profile requires a prior check'],
  ['result_class', 'enum', 'M', 'clear | low | medium | high | prohibited | match | no_match | error'],
  ['decision', 'enum', 'M', 'allow | step_up | block | freeze | return | refer'],
  ['decided_by', 'enum', 'M', 'automated | analyst'],
  ['supersedes', 'string', 'C', 'Earlier decision this one replaces, for example a step-up followed by allow'],
  ['evidence_ref', 'string', 'M', 'Where the underlying report is retained'],
]));

body.push(H2('4.6 R6 Internal Movement'));
body.push(P('Movements between the operator’s own funds locations — settlement from a provider to a bank, sweeps, tax remittance accounts — which is where segregation either holds or breaks. Fields: movement identifier; source and destination locations, at least one of which must exist in R1 — the other may be a provider from R10, such as an exchange or a settlement account; purpose (settlement | sweep | liquidity | conversion | tax_remittance | correction); whether the movement crosses purpose classes, with a justification where it does; approver and time; rail reference; amount and fees.'));

body.push(H2('4.7 R7 Reconciliation Statement'));
body.push(P('Two kinds of statement turn reconciliation from a claim into a number.'));
body.push(BUL('Location statement — one per funds location per period. Opening and closing balances from the external source (bank statement, provider settlement report, mobile operator statement or chain) and from the ledger, plus the provider’s own reported balances where the custody model is omnibus; inflows, outflows and fees; the unexplained delta, stated rather than hidden; exceptions raised; preparer and reviewer.'));
body.push(BUL('Coverage statement — one per licence per period, or per day where the profile requires. Player balances, pending withdrawals and, where the profile counts them, open bets, giving total player liabilities; funds held against them by protection mechanism; funds in transit; any shortfall, and when it was cured.'));
body.push(P('The custody model declared in R1 selects the reconciliation profile. Applying a direct-custody profile to a pooled arrangement produces an exception on every transaction and tells the reader nothing.'));
body.push(table(['Custody model', 'What the operator can evidence', 'Reconciliation profile'], [
  ['Direct — the operator holds the account, wallet or float', 'Every payment exists in an external statement against a location in R1', 'Statement against ledger, per location and per period; the unexplained delta is the residual'],
  ['Omnibus at a provider — player money sits in a payment provider’s, mobile money operator’s or virtual-asset provider’s pooled account', 'Provider records and references; the provider’s own balance in aggregate', 'Two loops: ledger against provider records by reference, and provider balance against the R11 attestation'],
  ['Hybrid — collection through a provider, funds then swept to the operator', 'Both of the above, on different locations', 'Applied per location; the package carries both'],
], [2700, 3300, 3746]));

body.push(H2('4.8 R8 Exception'));
body.push(P('Anything the operator could not explain, in a common vocabulary, with a value, an age and an owner. A supervisor rarely needs the whole ledger, but always needs the list of things that did not reconcile. Fields: identifier, category, when and by what process it was raised, related records, amount, status (open | under_review | resolved | accepted_risk), age in days, resolution, owner.'));
body.push(P('Categories are drawn from a closed list, which includes at least: external movement without a ledger entry; ledger entry without an external movement; amount mismatch; check missing or performed after crediting; payout to an instrument not eligible for payouts; payout outside the closed-loop rule without justification; holder mismatch; credit-funded instrument where credit is prohibited; payout later than the profile deadline; movement across purpose classes without justification; location outside the inventory; provider without due diligence or authorisation; coverage shortfall; tax withheld but not remitted by its due date.'));

body.push(H2('4.9 R9 Incident and 4.10 R10 Provider Register'));
body.push(P('R9 carries events an authority must be told about, with the deadline clock set by the profile: incident identifier, category, detected and notified times, the deadline that applied, the authority and channel used, related records and status.'));
body.push(P('R10 records each provider that handles player money — acquirer, bank, payment service provider, e-money institution, mobile money operator, voucher issuer, virtual-asset service provider or cash agent — with the authority that authorised it and the licence reference, whether the gambling regulator was notified of or approved it where the profile requires, the dates of due diligence and next review, where its data is held, and, for virtual-asset providers, Travel Rule capability.'));

body.push(H2('4.11 R11 Provider Attestation'));
body.push(P('Where money sits in a provider’s pooled account, the operator cannot evidence individual movements from its own statements. R11 is the provider’s statement standing in their place: the period covered, the balance held for the operator, totals credited and debited, the reference scheme that links the provider’s records to the operator’s, and a signature. It applies equally to a card acquirer’s reserve, a mobile money collection account, an e-money balance and a virtual-asset provider’s pooled wallet. An operator whose provider will not supply R11 has not failed this Standard; it has discovered a control it cannot evidence, and reporting that plainly is more useful than reporting a reconciliation that was never possible.'));

body.push(H2('4.12 R12 Report Reference'));
body.push(P('A link between CTRES records and reports filed with other authorities: suspicious transaction reports, cash and virtual-currency threshold reports, casino disbursement reports, periodic systematic reports, levy returns and revenue declarations (report type levy_return), tax remittances and regulator notifications. Fields: reference identifier; report type; destination authority; channel (goAML, a national reporting API, a regulator portal or other); the profile rule that triggered it; related records; deadline; time filed; the receipt the destination issued.'));
body.push(P('R12 never carries the content of a suspicious transaction report. Where tipping-off and confidentiality rules apply, R12 is held by the operator and disclosed only to an authority entitled by law to see it; periodic packages then carry counts and timeliness only.'));

body.push(H2('4.13 R13 Gaming Revenue Statement'));
body.push(P('One line per licence, product line, channel, currency and period: what was staked, what was won, what was returned, what the bonus wallet added, and the gross gaming revenue the operator declares on those quantities. The statement carries quantities that certified gaming platforms already report and transaction-level regulatory models already receive — stakes, winnings, rake and the settled-or-open status of each bet in all of them; refunds and voids, jackpot contributions and payouts and the open-bet position at each cut-off in most — rather than a single taxable amount, so that any profile’s levy base that rests on gaming quantities can be computed from it (§5); a base fixed per machine or table rests on the unit rows of R14. Cash and bonus are kept as four separate quantities (cash stakes, bonus stakes, cash winnings, bonus winnings), because bonus treatment is where jurisdictions differ most, and the line names the formula that produced the declared figure. Amounts are reported per currency, one statement per currency, and converted by the validator at the rate the statement carries; conversion is never applied at the level of a bet. Winnings are gross of any tax withheld at payout, and the withholding is a separate quantity, so that cash paid out can be reconciled to winnings recorded. A correction is a statement of kind correction that references the statement it replaces and gives the reason; the original statement is never altered, so a closed period is corrected, never restated in place. A correction statement travels in the next package; it does not require the earlier package to be superseded (§8.2).'));
body.push(P('For one licence, currency and period — with stakes recognised when settled and winnings when credited — the revenue statements of the licence summed over product lines and channels, the payment records (R3, R4) and the coverage statements (R7) satisfy one identity, the money bridge:'));
body.push(code('(stakes_cash + stakes_bonus − stakes_refunded) − (winnings_cash + winnings_bonus) = deposits − withdrawals − Δ player balances − Δ open-bet liability + bonus_granted − bonus_expired'));
body.push(P('Deposits and withdrawals are the amounts posted to player accounts (credited_amount in R3 and R4, bounded by credited_at), so that a withdrawal counts when the account is debited and gross of any tax withheld at payout; player balances are the R7 totals, bonus wallets included; the open-bet liability is the R7 open-bet position and applies where stakes are recognised when settled — where they are recognised when placed, the term is omitted. The validator derives the right-hand side from R3, R4 and R7 and compares it with the statements within the tolerance the profile sets; a difference outside tolerance is an exception (R8).'));
body.push(P('The left-hand side is the gross gaming revenue from which the profile’s levy base is computed (§5); the right-hand side is what the deposits, withdrawals, player balances, open bets and bonus movements in the same package show. The bridge is tested where the package carries R3 and R4 in full; where the profile allows a sample (§8.1), it is tested on demand against the operator’s full records (§9). Where the authority computes the figure in its own system, authority_figure_ref carries that figure and the difference is reported in the same way. A declared figure can therefore be tested rather than trusted.'));
body.push(P('Records of individual bets, rounds and game outcomes are not part of this Standard. They remain where they are produced — in the operator’s gaming platform or in the authority’s data vault — and the statement points to the platform report behind each line through evidence_ref, as R5 points to the report behind a check.'));
body.push(P('Core fields — every statement carries them:', { after: 60 }));
body.push(fieldTable([
  ['statement_id', 'string', 'M', 'Identifier'],
  ['statement_kind', 'enum', 'M', 'period | correction'],
  ['licence_ref', 'string', 'M', 'Licence under the manifest'],
  ['product_line', 'string', 'M', 'Operator’s product or game-type code'],
  ['channel', 'enum', 'M', 'online | retail | venue'],
  ['period_start / period_end', 'datetime', 'M', 'Period boundaries, at the gaming-day cut-off the profile sets'],
  ['currency', 'string', 'M', 'Currency of the amounts — one statement per currency'],
  ['stakes_basis / winnings_basis', 'enum', 'M', 'stakes: placed | settled | cash | accrual_at_result; winnings: paid | credited | payable — the recognition rule applied; matches the profile’s recognition parameter (§5)'],
  ['stakes_cash', 'decimal', 'M', 'Stakes funded from real money'],
  ['stakes_refunded', 'decimal', 'M', 'Returned and voided stakes (0 permitted)'],
  ['winnings_cash', 'decimal', 'M', 'Winnings paid or credited from real money, gross of any withholding tax'],
  ['ggr_declared', 'decimal', 'M', 'The operator’s gross gaming revenue for the line'],
  ['ggr_formula', 'enum', 'M', 'all_in (stakes_cash + stakes_bonus − stakes_refunded − winnings_cash − winnings_bonus) | cash_only (stakes_cash − stakes_refunded − winnings_cash) | profile (the terms of the profile’s levy formula, §5) — the formula that produced ggr_declared'],
  ['prepared_by / reviewed_by', 'string', 'M', 'As in R7'],
  ['evidence_ref', 'string', 'M', 'Where the platform report behind the line is retained'],
]));
body.push(P('Conditional and optional fields — as the profile and the product require:', { before: 120, after: 60 }));
body.push(fieldTable([
  ['corrects_statement_id / correction_reason', 'string', 'C', 'Corrections: the statement replaced, and why (re-settlement, void after settlement, jackpot revaluation)'],
  ['brand', 'string', 'O', 'Where the profile splits by brand'],
  ['jurisdiction_category', 'string', 'C', 'Code, in snake_case, from the profile’s product taxonomy, where the profile publishes one'],
  ['venue_id', 'string', 'C', 'Venue the line covers (venue_id in R1, as in R14), where channel is venue and the licence covers more than one venue or the profile splits by premises'],
  ['player_location', 'string', 'C', 'Country or region code (ISO 3166, as the profile’s player-location basis sets) of the players the line covers, where the profile splits by player location'],
  ['fx_rate / fx_source / fx_at', 'decimal / string / datetime', 'C', 'Where the currency differs from the reporting currency'],
  ['stakes_bonus / winnings_bonus', 'decimal', 'C', 'Stakes funded from bonus or promotional credits, and winnings credited as non-cashable credits, where such credits exist'],
  ['winnings_withholding_tax', 'decimal', 'C', 'Tax withheld from winnings at payout, where the profile has one'],
  ['bonus_granted / bonus_expired', 'decimal', 'C', 'Promotional credits issued and forfeited in the period — needed for the money bridge'],
  ['bonus_measurement', 'enum', 'C', 'per_round | allocated_from_wallet_totals — how the bonus split was measured'],
  ['rake_and_fees', 'decimal', 'C', 'Commission, rake, tournament and entry fees, where the product is commission-based'],
  ['jackpot_contributions / jackpot_payouts', 'decimal', 'C', 'Where progressive or pooled jackpots exist'],
  ['network_due_to / network_due_from', 'decimal', 'C', 'Pooled or network products: poker networks, shared jackpots, exchanges'],
  ['open_liability_start / open_liability_end', 'decimal', 'C', 'Unsettled bets and unfinished games at each cut-off, where they can exist'],
  ['bets_count / rounds_count / active_players', 'integer', 'O', 'Volumes'],
  ['levy_base_declared / levy_rate / levy_amount_declared', 'decimal', 'C', 'Where the profile requires self-assessment'],
  ['authority_figure_ref', 'object', 'C', 'Where the profile says the authority computes the figure: the R12 report reference of the return or assessment, which figure it is (ggr | levy_base | levy_amount), the amount and, where it differs from the statement’s, its currency'],
]));

body.push(H2('4.14 R14 Venue Count'));
body.push(P('In a land-based venue money reaches the gaming floor as cash, chips and tickets and, except on a cashless floor, never passes through a player account, so the venue line of R13 rests on the count rather than on payment records. R14 carries the count: one row per venue, unit and gaming day — or per period, where the profile permits — for each slot machine, table and counter, and a venue_total row for the count room. Slot rows carry the accounting meter set at the start and end of the day; table rows carry opening and closing inventory, fills, credits and the drop; counter rows carry opening and closing inventory and, where they apply, fills, credits and the drop; the venue_total row carries the hard and soft count and the variance against the meters. meter_source says how the row’s readings were taken: electronic, from a monitoring or management system; manual_read, from a meter reading or from opener and closer slips; not_recorded, where no meter or slip exists.'));
body.push(P('Each row declares the unit’s win and the formula that produced it — the table drop formula (closing inventory + credits + drop − opening inventory − fills), the slot meter formula (coin in − coin out − hand-paid jackpots − cancelled credits − progressive payouts) or the slot drop formula (drop − fills − hand-paid jackpots) — as the profile sets (§5); tips that pass through the drop box are reported separately where the profile excludes them. The rows of a venue sum to the venue line of R13 for the same period, and the drop is tied to money through drop_deposit_ref: the R6 movement or the R1 cash-float location it was banked to, for which R1 carries venue_id. Under “Computed, not declared” (§3) the validator compares meters, count and bankings with one another and with the R13 line rather than accept any of them. Each row states its currency: a venue counts in the currency of the R1 cash-float location it belongs to, and every row of the venue carries that currency. Records of individual games and hand-pay logs stay with the venue; the count is the evidence, as the platform report is for R13.'));
body.push(fieldTable([
  ['count_id / venue_id', 'string', 'M', 'Identifier of the count, and the venue (venue_id in R1)'],
  ['gaming_day / period_start / period_end', 'date / datetime', 'M/C', 'The gaming day counted; or, where the profile permits a period count, the period'],
  ['unit_type / unit_id', 'enum / string', 'M', 'slot_machine | table | counter | venue_total; the unit'],
  ['currency', 'string', 'M', 'ISO 4217 code of the amounts in the row'],
  ['meter_source', 'enum', 'M', 'electronic | manual_read | not_recorded'],
  ['meters_start / meters_end', 'object', 'C', 'Slot machines: coin_in, coin_out, jackpots_hand_paid, cancelled_credits, progressive_payouts_machine_paid, progressive_payouts_attendant_paid, bill_in, ticket_in, ticket_out, wat_in, wat_out, promo_in, promo_out, games_played — drawn from the GLI-11 §3.9.7 accounting set; a meter the machine does not have is omitted'],
  ['opening_inventory / closing_inventory / fills / credits / drop_cash / drop_markers / coupons_face_value', 'decimal', 'C', 'Tables and counters'],
  ['hard_count / soft_count / count_variance', 'decimal', 'C', 'venue_total rows: count-room totals against the meters'],
  ['tips_excluded', 'decimal', 'O', 'Where tips pass through the drop box'],
  ['win_declared / win_formula', 'decimal / enum', 'M', 'The unit’s win and the formula applied: table_drop_formula | slot_meter_formula | slot_drop_formula | profile'],
  ['drop_deposit_ref', 'string', 'C', 'venue_total rows: the R6 movement or R1 cash-float location the drop was banked to'],
  ['prepared_by / reviewed_by', 'string', 'M', 'As in R7'],
]));

// ---------------- 5 ----------------
body.push(H1('5. Jurisdiction profiles'));
body.push(P('A profile is a short configuration, in the machine-readable structure defined by the schema (Annex A), that turns the neutral record model into one authority’s rule set. It contains parameters only and never adds fields. The table lists the parameters, with examples drawn from the profiles in the Register (Annex B).'));
body.push(table(['Parameter', 'Examples from the Register'], [
  ['Permitted rails and instrument types', 'Credit cards prohibited (United Kingdom, Ireland, Belgium, Brazil); credit in any form, including invoice and buy-now-pay-later (Sweden); virtual assets permitted with conditions (Malta, Isle of Man, Curaçao, Estonia) or not accepted (Italy, Greece, Germany, Brazil, Peru, Ontario)'],
  ['Holder and ownership rules', 'Instruments in the player’s name (Italy, Greece, Brazil, Buenos Aires Province); ownership confirmed above set amounts (Greece: deposits from €5,000, withdrawals from €800)'],
  ['Closed loop and payout routing', 'Withdrawal to the account used to deposit (Buenos Aires Province; planned in Ireland); payout route set by amount (Kenya)'],
  ['Check thresholds and aggregation windows', '€2,000 (most EU jurisdictions), €3,000 over 30 days (Isle of Man), NAf 4,000 (Curaçao), AED 11,000 (United Arab Emirates); rolling 180 days (Malta); fixed 24-hour window (Canada); gaming day (United States, Curaçao); lifetime deposits (Alderney); indexed units (Mexico, Peru, Argentina)'],
  ['Report triggers and deadlines', 'Cash from R49,999.99 within 3 days (South Africa); from C$10,000 under the 24-hour rule (Canada); suspicious reports from 24 hours (Nigeria) to 15 days (South Africa)'],
  ['Payout time limits', '120 minutes (Brazil); 48 hours (Buenos Aires Province); 5 working days (Malta, Gibraltar)'],
  ['Taxes at the point of payment', 'Excise on deposits and withholding on winnings (Kenya); withholding on winnings (Malawi, Lagos, Uganda), at rates that differ by product (Tanzania); withholding on withdrawals (Georgia)'],
  ['Player-funds protection and coverage', 'At least 90% of liabilities in the account plus funds in transit (Malta); shortfall cured within 3 business days (Greece); separate estate covering balances and open bets (Brazil)'],
  ['Submission mode and cadence', 'Real-time central system (Italy, Greece, Bulgaria, Serbia, Kenya); hourly financial summaries (Portugal); daily and monthly files (Brazil, Spain); monthly player-funds report (Malta); quarterly returns (United Kingdom, Gibraltar)'],
  ['Cross-operator limits and registers', 'Real-time query to a central limit file before each deposit (Germany: €1,000 a month); weekly cap per operator, raised only after a credit-register check (Belgium); per-player monthly limits in a state register (Kazakhstan, Uzbekistan)'],
  ['Eligibility screening at payment', 'Self-exclusion registers (Denmark, Sweden, Netherlands, Germany, Spain and many others); insolvency and benefit recipients (Czech Republic); debtors (Kazakhstan); welfare recipients (Brazil); minimum age of 25 (Georgia, Uganda); biometric check on each stake and payout claim (Ghana)'],
  ['Mandatory hubs and gateways', 'Payments or bets that must pass through a state register or gateway (Uzbekistan, Kazakhstan; planned in Uganda), with a unique identifier per transaction (Ukraine)'],
  ['Instrument origin and currency', 'Domestic banks or cards only (Ukraine, Armenia, Uzbekistan); a single settlement currency (Montenegro, Georgia, Angola, Colombia); one nominated account per player (Tanzania, Ukraine)'],
  ['Withdrawal conditions', 'Share of deposits wagered before withdrawal and withdrawals per day (Colombia); winnings-only withdrawal and return of dormant balances (Croatia); cash payout of online winnings at a venue (Lithuania)'],
  ['Payment-blocking lists', 'Lists that bind payment providers by operator or domain (Romania, Poland, Lithuania, Kazakhstan), by bank account (Czech Republic), by merchant category (Norway, Armenia), or for a whole category of games (India)'],
  ['Data vault and integrity', 'Operator-hosted vault in the regulator’s schema (Netherlands, Denmark, Spain, Germany, Romania), sealed daily with a regulator-issued token (Denmark), or pulled through a national data-exchange layer (Estonia)'],
  ['Data location', 'Tier-IV data centre in Curaçao; European Economic Area (Italy, Greece); Nigeria from 2027'],
  ['Retention', '5 years in most jurisdictions; 7 years (Kenya, Malawi, Portugal); 10 years (Argentina, Serbia, Switzerland, Mexico; Italy, Greece, Spain and New Jersey for some records); tied to the tax limitation period (Bulgaria, Peru)'],
], [2900, 6846]));
body.push(P('', { after: 60 }));
body.push(P('A second block, Revenue and levy, fixes how the jurisdiction defines and collects the operator-level levy, so that the gaming revenue statement (R13) and the venue count (R14) can be computed under the profile rather than read. It has five parameters and a notes block. The parameters are what a validator reads; the notes carry, with their sources, what the parameters do not express. Every value below is in force in at least one of the jurisdictions reviewed; the examples are read from published sources.'));
body.push(table(['Parameter — revenue and levy', 'What it fixes, with examples'], [
  ['Levy formula, per product line', 'The base type — gross gaming revenue for the main products (71 of the 90 profiles); turnover (Germany, 5.3% of stakes; Poland, 12% of betting stakes); a fixed amount per machine or table (Latvia, Romania); commission for exchanges and poker (Malta, Spain, United Kingdom); fee bands (Gibraltar, Alderney); the prize pool (Hungary, lotteries) — then the R13 quantities that enter the base, each with its sign and any cap, and the rate, bands or fixed amount. Bonus, refund, chargeback, jackpot and tax treatments are terms of the formula, not separate switches: bonus-funded stakes in (Malta, Denmark, Romania, Ghana, Brazil) or out (Ontario); bonus credits counted at face value with no deduction (United Kingdom, Denmark, Gibraltar, Ireland), deducted when credited (Colombia, Ontario) or deducted with a cap (Michigan, by year; New York, by product; New Jersey, above an industry-wide threshold); returned stakes deducted (Germany, Czech Republic, Hungary, Mexico, Colombia, New Jersey) or not (Denmark); chargebacks deductible (Gibraltar, Delaware) or no relief (United Kingdom, Philippines); progressive contributions deductible when made (Nevada, Philippines, South Africa — Western Cape and Gauteng) or when paid (Denmark, Romania); goods and services tax in the base (Australia), value added tax out of it (Austria, Chile), the levy itself netted from the base (Germany, Mauritius). For venues, the win formula per unit type (§4.14): the table drop formula (Nevada, Mississippi, New York, Philippines, Croatia, Montenegro, South Africa — Western Cape, with coupon face value added), the slot meter or slot drop formula (Nevada, Ghana, Kenya), chips bought less chips exchanged (Czech Republic).'],
  ['Recognition', 'When a stake enters the base — when the bet is accepted (United Kingdom, Sweden, Germany, Australia — New South Wales); when it is settled or the cash is received (Nevada counter games, Mexico, Peru, Hungary, Poland); when the result is known (Colombia, South Africa — Eastern Cape) — and when winnings leave it: when credited (Sweden); only where withdrawable and notified (United Kingdom); when paid or payable (Australia — Victoria; Mauritius); non-convertible credits excluded (New South Wales); the returned stake counted inside the payout (Philippines, Angola). R13 carries the pair as stakes_basis and winnings_basis.'],
  ['Period and filing', 'The period and its cut-off: monthly in about sixty profiles, due between the 5th (Serbia, North Macedonia) and the end of the following month (Cyprus, Angola); weekly (South Africa — Gauteng, Tanzania and Uganda by Wednesday; Philippines; New York); quarterly (United Kingdom, Spain, Czech Republic, Kazakhstan); annual with monthly instalments (Malta, New Jersey); gaming-day cut-offs and Sunday-to-Saturday weeks (Philippines, Iowa, Nebraska); estimates with a later true-up (Romania, Switzerland, Liechtenstein). The collector — tax authority (United Kingdom, Spain, Netherlands, Germany, Denmark, Kenya, Brazil), regulator (Malta, Gibraltar, Serbia, Ontario, Nevada) or both (Italy, Romania, Bulgaria, Philippines) — the channel and form (Spain modelo 763; Poland POG-5; Nevada NGC-01 and NGC-31; New Jersey DGE-101, 105 and 107; Latvia EDS; the URA portal in Uganda), and whose figure is the figure of record: the operator’s declaration, or the authority’s own computation (Italy, Colombia, Ontario; Kenya and Uganda through central monitoring), with an attestation layer where one exists (auditor-attested figures in Norway and Malta; an accuracy certificate in Botswana; six-monthly certification in Greece).'],
  ['Negative periods', 'A period in which winnings exceed stakes: the loss carried forward within the product or class (United Kingdom, Nevada, Michigan, Ghana, Iowa, South Africa — Gauteng); floored at zero per unit (Montenegro, per shop; Colombia); no netting across products (Poland, Czech Republic, the United Kingdom betting duty classes); a minimum per unit (Slovakia, Serbia, North Macedonia). The netting scope — line, product class or licence — goes with the rule.'],
  ['Aggregation', 'The axes along which R13 lines are split, required in 62 of the 90 profiles: by licence type (Denmark, Malta, Bulgaria, Romania, Tanzania); by game within a licence (Czech Republic, eleven partial bases; Poland; Hungary; Nevada; New Jersey); by channel (Czech Republic, Italy, Portugal, Austria, Ukraine); by premises, table or machine, daily (Croatia, Montenegro, Serbia, Switzerland, Nevada); by player residence or territory (Spain, Latvia, Colombia, Malta, South Africa); by currency, with a conversion rule (Czech Republic, Zimbabwe). The profile carries the jurisdiction’s product code list, versioned — Spain, Denmark, Ontario and Italy each define their own.'],
  ['Notes', 'Free text, each with its source, for what the parameters do not express: the scope of a stake (entry and admission fees in the base in the Czech Republic, the Netherlands and Malawi; chips bought rather than cash staked in the Czech Republic and the Philippines; deposits deemed stakes in Pennsylvania interactive gaming); winnings gross or net of the tax withheld at payout, wherever one exists (Malawi, Uganda, Tanzania, Nigeria); expired credits (Romania, New Jersey, West Virginia); uncollectible receivables capped (Virginia, 2%) and markers counted in table win (Nevada, Delaware); tips and tickets in venues (Croatia, Montenegro, Denmark; expired tickets 25% in Nevada); and whether the authority expects per-transaction data behind the statement (Romania, Serbia, Colombia, Denmark, Portugal, Ukraine, Belarus) or aggregates only (United Kingdom, Sweden, Netherlands), which decides whether R13 reconciles to the transaction records line by line or by totals.'],
], [2500, 7246]));
body.push(P('The validator computes the base of each R13 line as the signed sum of the quantities the formula names, applies the rate, bands or fixed amount, the negative-period rule and the aggregation, and compares the result with the operator’s declared figure, rather than accept the declaration; where the base is fixed per machine or table, it counts the unit rows of R14. Where the authority computes the figure in its own system, the profile says so, R13 carries that figure as authority_figure_ref, and the difference between the two is an exception (R8).'));
body.push(P('Profiles carry effective dates, so a new rule, a market opening or a change of regulator becomes a new profile version rather than an edit — Finland’s licensing from July 2027 and Latvia’s transfer of supervision to its tax authority are examples. Where a market is closed to online gambling, as in India and Kosovo, the profile covers payment-side blocking only.'));
body.push(P('Profiles belong to the authorities. The editor publishes a profile as confirmed only when the authority concerned has reviewed it; until then it is marked as researched from published sources, as most profiles in the Register are today. Where a federal or provincial system has several licensing bodies, a profile may inherit from a shared base and override only what differs, so that provinces or states agree the common part once.'));

// ---------------- 6 ----------------
body.push(H1('6. Rail modules'));
body.push(P('Each rail adds the identifiers it naturally carries and the external evidence it naturally produces. A jurisdiction that does not permit a rail leaves it out of its profile; nothing else changes.'));
body.push(table(['Rail', 'Identifiers carried', 'Holder verification typically available', 'External evidence for reconciliation'], [
  ['Card', 'Tokenised card number, BIN, last four digits, funding type, acquirer reference', 'Issuer name check where offered; strong customer authentication', 'Acquirer settlement reports'],
  ['Bank transfer and instant payments (e.g. SEPA, Pix, TED, Interac, CBU/CVU, EFT)', 'Masked account number, instant-payment key type, end-to-end identifier', 'Account-name or national-ID check against the bank or directory; open banking', 'Bank statements; instant-payment confirmations'],
  ['E-money and e-wallets', 'Wallet account identifier, funding-source type', 'Provider identity attestation; funding-source disclosure', 'Provider statements'],
  ['Mobile money and carrier billing', 'Hashed phone number, pay-bill or short code, operator receipt or billing reference', 'Registered-name check with the mobile operator', 'Mobile operator statements; tax-integration records where they exist'],
  ['Vouchers and prepaid', 'Voucher serial, issuer, point of sale', 'None at purchase; holder established at redemption', 'Issuer redemption reports'],
  ['Cash at retail or venue', 'Retail point or cage identifier, cashier, receipt', 'Identity at the counter', 'Till and float reconciliations'],
  ['Virtual assets', 'Chain, asset, transaction hash, address, confirmations, counterparty type, wallet temperature, off-chain flag', 'Signed message, micro-transfer, provider attestation, Travel Rule data', 'On-chain data; provider attestations (R11)'],
], [2100, 2700, 2500, 2446]));
body.push(P('The virtual-asset module covers wallet purpose classes and temperature, key-control models, same-asset and same-wallet withdrawals, blockchain analytics as a check type, and custody models for pooled provider wallets.'));

// ---------------- 7 ----------------
body.push(H1('7. Mapping to existing regulatory formats'));
body.push(P('CTRES does not compete with the formats authorities already receive. It is the source those submissions are produced from, and the place an authority can look when a submission raises a question.'));
body.push(table(['Destination', 'What it receives today', 'CTRES source'], [
  ['Financial intelligence units and national reporting APIs (goAML and national equivalents; FINTRAC)', 'Suspicious and threshold reports in the unit’s own schema', 'R3, R4 and R5 populate transactions and parties; profile windows drive aggregation; R12 keeps the receipt'],
  ['Central control systems and data vaults (e.g. Italy, Greece, Bulgaria, Serbia, Kenya; Netherlands, Denmark, Germany, Spain, Romania)', 'Transaction and account records in the authority’s protocol or schema, in real time or by upload', 'authority_reference on R3 and R4 links each payment to the code the system issued; R12 keeps the seal or upload receipt'],
  ['Central limit files, registers and state hubs (e.g. Germany, Czech Republic, Kazakhstan, Uzbekistan)', 'A query before each deposit or bet, and the hub’s transaction identifier', 'R5 records each query and response, performed by the authority system; authority_reference carries the hub identifier'],
  ['Tax-authority feeds (e.g. Mexico, Kenya, Uganda, Ghana)', 'Transactions and taxes, in real time or daily', 'tax_lines on R3 and R4; R12 keeps remittance receipts'],
  ['Player-funds reports and periodic regulatory returns (e.g. Malta’s monthly report; United Kingdom and Gibraltar returns)', 'Balances, liabilities, supporting statements and aggregated figures', 'R7 coverage statement with evidence references; totals derived from R3, R4 and R7'],
  ['Revenue and levy returns and data models (e.g. Spain SCI operator account, Denmark SAFE end-of-day records, Netherlands CDB, Romania safe-server summaries, United Kingdom regulatory returns)', 'Stakes, winnings, voids, rake, jackpots and liabilities per game type and period — as per-bet records, daily totals or a periodic return', 'R13 lines per product, channel, currency and period, with the profile’s formula applied; R14 where the licence covers venues; R12 keeps the filing receipt and, where the authority computes the figure, that figure'],
  ['Gaming-system protocols and wager/win reporting schemas (e.g. IGSA G2S/S2S meters, RRI; CEN EN 17531)', 'Machine meters and gaming-system events in a protocol; wager and win reports in a published schema', 'R14 meters per unit and gaming day; R12 report references for the wager and win reports produced from R13'],
], [2900, 3300, 3546]));
body.push(P('The mappings above are indicative. Detailed mappings are maintained separately from this Standard, versioned, and tested against the destination’s own schema wherever that schema is public.'));

// ---------------- 8 ----------------
body.push(H1('8. Submission and access'));
body.push(H2('8.1 Modes'));
body.push(P('The profile chooses the mode. None of them adds a channel.'));
body.push(table(['Mode', 'When', 'Contents'], [
  ['Continuous', 'Where the authority runs a central system or requires real-time access', 'Records are generated as events occur. The authority’s system remains the channel; CTRES is the operator-side source and audit trail.'],
  ['Periodic package', 'On the profile’s cadence — monthly, quarterly or semi-annual', 'The records of the declared conformance level (§10): R13 at Level 1; R3, R4, R7 and R13 at Level 2, with R14 where the licence covers venues; the Custody module from Level 3; the Supervision module at Level 4 — with the conformance declaration. R2 to R6 as a full extract or a sample, as the profile sets'],
  ['On demand', 'Within the profile’s deadline for information requests', 'The evidence pack (§9), per player, per transaction or per period'],
  ['Incident', 'Within the profile’s incident deadline', 'R9, with the affected records referenced by identifier'],
], [2000, 3000, 4746]));
body.push(H2('8.2 Formats and integrity'));
body.push(BUL('JSON Lines, UTF-8, one record per line, one record type per file. A CSV profile with identical field names is permitted at Level 1.'));
body.push(BUL('Timestamps in ISO 8601 with an explicit offset. Amounts as decimal strings, never floating point. Currencies as ISO 4217 codes; virtual assets by chain and contract.'));
body.push(BUL('Every package carries manifest.json: the name and version of the Standard (standard_version — 1.1 for any package that lists an R13 or R14 file; a package without them may still declare 1.0), the package identifier, licensee, licensing authority and licence, profile identifier and version, the declared conformance level (§10), period, one entry per file with its record type, record count and SHA-256 hash, and the generating software and version. The SHA-256 of manifest.json is the package fingerprint: a receipt that quotes it proves which package was submitted. The manifest may be signed with the operator’s certificate where the profile requires.'));
body.push(BUL('Corrections are submitted as a new package that supersedes an earlier one by identifier and reason, so that the record of what was known when is preserved.'));
body.push(H2('8.3 Transport and location'));
body.push(P('Through the authority’s existing channel. Periodic packages are pseudonymous, so a package seen in transit reveals no player identity. Data location follows the profile. The Standard proposes no new channel and moves no data across borders.'));

// ---------------- 9 ----------------
body.push(H1('9. Evidence pack'));
body.push(P('The pack answers a single supervisory question on any rail: show me this money, end to end. It is assembled from records already defined and contains, for one deposit and the withdrawal that followed it: the player reference, verification status and the level of due diligence applied at the relevant threshold; the deposit — rail, instrument, holder-match result, amount, rail reference and any authority reference; the checks that preceded crediting, with timestamps that prove the order; the crediting entry and any difference from the amount received, with its reason; taxes levied at the payment and their remittance; the withdrawal — destination, closed-loop result, checks, approver, and the times requested and paid; the location and coverage statements for the period, any exception referencing the transaction, and any report reference the requester is entitled to see.'));
body.push(P('A second pack answers the revenue question: show me what the house won, and show me that it matches the money. For one licence, product line and period it contains the R13 line — stakes, winnings, refunds, bonus quantities, rake, jackpots and the open-bet position at each cut-off, the formula applied and the gaming revenue declared; for a venue, the R14 rows for the period — meters, inventory, fills, credits and drop per unit, the count and its variance, and the win declared per unit; the R7 coverage statements at each cut-off, giving the player balances and open bets the money bridge uses; the totals of deposits (R3) and withdrawals (R4) for the licence and period, so that the money bridge (§4.13) can be recomputed; and the levy return filed with the authority, as an R12 report reference of type levy_return, with its receipt and, where the authority computes the figure, its figure for the same line.'));
body.push(P('An auditor can sample directly from these packs. An operator that can produce them in minutes rather than weeks has reduced the cost of its own audit — the commercial reason to adopt the Standard, irrespective of supervision.'));

// ---------------- 10 ----------------
body.push(H1('10. Conformance levels'));
body.push(P('The record model has a core and three modules. The core is the package manifest with R3 Deposit, R4 Withdrawal, R7 Reconciliation Statement and R13 Gaming Revenue Statement: the money that came in and went out, the balances, and the revenue declared on them. The Custody module (R1, R2, R6, R10, R11) says where player money sits and who holds it; the Supervision module (R5, R8, R9, R12) carries the checks, exceptions, incidents and the reports filed elsewhere; the Venue module (R14) carries the count behind a land-based revenue line. Four conformance levels add them in steps, so that an operator can start from the return it already files and an authority can ask for exactly as much evidence as it will use.'));
body.push(table(['Level', 'Records required (minimum)', 'What the authority can check', 'Typical operator'], [
  ['Level 1 — Return', 'manifest + R13', 'The return it already receives, in a structure a validator checks: schema, the arithmetic of each line under its formula, one statement per currency, corrections that reference what they correct', 'Any operator, from the figures of its levy return; CSV permitted (§8.2)'],
  ['Level 2 — Evidence', 'Level 1 + R3, R4, R7; + R14 where any R13 line is a venue line', 'The money bridge (§4.13): declared revenue against deposits, withdrawals and period balances; the venue win against the count, and the drop against what was banked', 'An online operator with a player wallet; a venue with a count room'],
  ['Level 3 — Custody', 'Level 2 + R1, R2, R6, R10, R11', 'Where player money sits, who holds it, whether segregation held, what pooled providers attest; references between records resolve within the package', 'Operators using pooled providers, mobile money, virtual assets or several funds locations'],
  ['Level 4 — Supervision', 'Level 3 + R5, R8, R9, R12', 'Checks before money moves, exceptions to closure with ageing, incidents against their deadlines, reports filed elsewhere — the full model', 'Operators under AML supervision duties; operators connected to a central system'],
], [1700, 2300, 3546, 2200], { cantSplit: true }));
body.push(P('', { after: 40 }));
body.push(BUL('Any record type may be included at any level; the level fixes the minimum set. The profile may set the level the authority requires (§5, minimum_conformance_level).'));
body.push(BUL('Field requirements inside a record do not change with the level. At Levels 1 and 2 the instrument, provider, location and check identifiers that R3, R4, R7 and R14 carry are the operator’s own identifiers: present in the record, resolved within the package only once the module that defines them is included; check_ids may be empty.'));
body.push(BUL('The package manifest declares the level (conformance_level_declared); the reference validator checks that the records of the declared level are present and resolves references by level (§11). An operator declares its level in the conformance statement at Annex D, signed by the responsible officer. Delivery — files on request, periodic packages or a continuous feed — is the submission mode of §8.1 and is independent of the level.'));

// ---------------- 11 ----------------
body.push(H1('11. Validation'));
body.push(P('A format helps only if conformance can be checked mechanically. Validation is defined here by class, not by rule, so that rules can evolve without reopening the Standard.'));
body.push(table(['Class', 'Question it answers', 'Examples'], [
  ['Structural', 'Is the package well formed?', 'Required fields present; types and enumerations valid; manifest hashes match the files; the record types of the declared conformance level present (§10); R13 and R14 conform to their schemas, one statement per currency'],
  ['Referential', 'Does the package hold together?', 'Every payment references an instrument in R2 and a provider in R10, and every check reference resolves, once the module that defines them is in the package (§10); each transfer is booked once; statement totals agree with the records behind them; a revenue statement’s period lies within the manifest period, its product code is in the profile’s taxonomy, a correction references an existing statement, a venue count references a venue in R1, and authority_figure_ref resolves to a report reference in R12'],
  ['Profile conformance', 'Does the evidence show the control operated under this jurisdiction’s rules?', 'Checks precede crediting; payouts follow the profile’s closed-loop rule or carry a justification; no credit-funded instrument where credit is prohibited; payout times within the profile’s deadline; coverage at or above the required level; the gaming revenue and levy on each R13 line follow the profile’s formula, base and rate, at the profile’s cut-off and under its bonus rule; the money bridge (§4.13) holds within the profile’s tolerance'],
  ['Completeness', 'Is anything missing that should be there?', 'External movements on inventory locations that appear in no record; rail references the external source does not confirm; funding instruments missing from R2; periods with no statement; differences no exception owns; exceptions open beyond their ageing limit; the venue win in R14 agrees with the R13 venue line; the drop agrees with the bankings in R6 and R7'],
], [1900, 2800, 5046], { cantSplit: true }));
body.push(P('The catalogue of individual checks, their severities, the tolerances that separate a rounding difference from a discrepancy, and the materiality thresholds that make an exception reportable are deliberately not fixed in this Standard. They belong to each authority to set, and they will change more often than the format. They are maintained separately as a versioned conformance suite, so that a package can be tested against a named suite version and a named profile version, and the result reproduced later.'));
body.push(P('Wherever an independent source exists — the chain for virtual assets, bank and provider statements, an authority’s own central system — completeness is checked against that source and not only against the operator’s account of it.'));
body.push(P('An open reference validator for the Structural and Referential classes, validator-lite, is published under the Apache License 2.0 at github.com/ctres-standard/validator-lite. Validation under the Profile conformance and Completeness classes depends on the parameters this section leaves to each authority and is provided separately. No validator is a condition of using this Standard; an implementation validated by any other means is equally conformant.'));

// ---------------- 12 ----------------
body.push(H1('12. Data protection, confidentiality and retention'));
body.push(BUL('Periodic packages carry pseudonymous player references, masked account numbers and hashed phone numbers. Names, addresses and identity documents are not included.'));
body.push(BUL('Gaming revenue statements (R13) and venue counts (R14) carry no personal data: they are totals by product, channel, period and unit, and reference no player.'));
body.push(BUL('Identity data is provided only in an evidence pack answering a specific lawful request, and travels under the same arrangements as existing regulatory correspondence.'));
body.push(BUL('Retention follows the profile. An operator licensed in several jurisdictions retains for the longest period that applies.'));
body.push(BUL('Suspicious-report confidentiality is preserved: R12 holds references only and is disclosed only to authorities entitled to see it (§4.12).'));
body.push(BUL('Data location follows the profile.'));
body.push(BUL('Virtual-asset addresses are public by nature; the link between an address and a player is not, and is treated as personal data throughout.'));

// ---------------- 13 ----------------
body.push(H1('13. Governance and versioning'));
body.push(table(['Element', 'Arrangement'], [
  ['Editor', 'Dmitry Skachko. Maintains the text, the schema, the register of profiles and the conformance suite, and publishes versions.'],
  ['Authorities', 'Own their profiles. Corrections an authority makes to its own profile are adopted as submitted.'],
  ['Contributors', 'Operators, suppliers, auditors and associations comment through the public issue tracker at github.com/ctres-standard/spec or to hello@ctres.org. Substantive changes are published for comment before adoption.'],
  ['Versioning', 'Major versions change existing record types or fields; minor versions add record types, fields, rails or profile parameters without changing existing ones; patches correct text. Annex B, the Register of jurisdiction profiles, is published separately as a dated edition: adding or correcting jurisdiction profiles publishes a new Register edition and does not change the version of the Standard. Mapping files and the conformance suite are versioned separately.'],
  ['Licence', 'The text is licensed under CC BY 4.0. The schema (record types R1–R14, the package manifest and the structure of a jurisdiction profile) and the reference validator for the Structural and Referential classes (§11) are licensed under the Apache License 2.0. Profiles are published in human-readable form in the Register (Annex B) and at ctres.org/profiles/. Anyone may implement the Standard without fee or permission.'],
  ['Conformance claims', '“CTRES Conformant” describes an implementation tested against a named conformance suite version. A claim states the suite and profile versions it was tested against.'],
  ['Working group', 'The editor proposes to convene a working group of authorities and practitioners once at least three authorities have reviewed their profiles.'],
], [2200, 7546]));

// ---------------- 14 ----------------
body.push(H1('14. Roadmap'));
body.push(table(['When', 'Step', 'Who'], [
  ['November 2026', 'Version 1.1: four conformance levels over a core of four records; gaming revenue statements and venue counts; revenue and levy profile parameters; the Register of profiles published separately', 'Editor'],
  ['Q4 2026', 'Authorities review their profiles', 'Authorities, editor'],
  ['Q1 2027', 'Pilots with volunteer operators and at least one authority, across three rail mixes and one land-based floor', 'Operators, authorities, editor'],
  ['Q2 2027', 'Version 1.2 with authority-confirmed profiles and the conformance suite versioned alongside', 'Editor'],
  ['From July 2027', 'Alignment review as the EU Anti-Money Laundering Regulation (EU) 2024/1624 (AMLR) begins to apply', 'Editor, with EU authorities'],
], [1600, 6046, 2100]));

// ---------------- 15 ----------------
body.push(H1('15. Questions for authorities'));
body.push(P('Each answer changes the Standard materially.'));
body.push(BUL('Is the profile for your jurisdiction in the Register (Annex B) correct, and what is missing?'));
body.push(BUL('Which conformance level (§10) would you require of your licensees, and in which submission mode (§8.1): files on request, periodic packages, or a continuous feed?'));
body.push(BUL('How is your levy base defined — which quantities enter it, with what treatment of bonuses, refunds and jackpots — and is the operator’s declaration or your own computation the figure of record?'));
body.push(BUL('Would a common operator-side format reduce the cost of connecting operators to your central system or reporting channel? If you run a central register, hub or data vault, would you publish its schema, so that a mapping can be maintained and tested against it?'));
body.push(BUL('Which rails do you expect to permit, restrict or review over the next two years — in particular virtual assets and new instant-payment schemes?'));
body.push(BUL('Where player money sits in a provider’s pooled account — a payment provider, mobile money operator or virtual-asset provider — does a provider attestation (R11) satisfy you, or do you expect the operator to evidence it directly?'));
body.push(BUL('Should report references (R12) be visible to you in periodic packages, as counts only, or not at all?'));
body.push(BUL('May operators refer to this Standard, in the policies and procedures they file with you, as the format in which they will evidence their controls?'));

// ---------------- ANNEX A ----------------
body.push(H1('Annex A. Field catalogue'));
body.push(P('The extracts in §4 and §6 are sufficient to build a working implementation of every record type. The complete catalogue adds formats, enumerations, conditional requirements and examples for each field, together with the profile schema, and states for each record type whether it belongs to the core or to a module (§10). It is maintained as a versioned machine-readable schema — JSON Schema for record types R1–R14, the package manifest and the structure of a jurisdiction profile — published under the Apache License 2.0 at github.com/ctres-standard/schema, so that implementations can be tested automatically rather than read.'));

// =====================================================================
// ANNEX B — in the Standard: a pointer to the Register. In the Register (--register): cover + landscape rows.
body.push(H1('Annex B. Jurisdiction profiles — the Register'));
body.push(P(`Annex B is the Register of jurisdiction profiles: ${REGISTER_COUNT_WORDS} jurisdictions, read from published sources and re-verified against the primary instruments, summarised to the parameters of §5 and grouped by region, in two parts — Part 1, payments, player funds and reporting; Part 2, revenue and levy — with the principal sources. It is published separately from this text, as CTRES_Register.pdf and CTRES_Register.docx at ctres.org/profiles/, where each jurisdiction also has its own page, in dated editions; the edition current at the date of this text is named on the cover (${REGISTER_EDITION}).`));
body.push(P('Register editions change as profiles are added or corrected, without changing the version of the Standard (§13). They are a reference, not legal advice. “Not found” means that no published rule was located, not that none exists. Each row is offered to the authority concerned for review, and a corrected row replaces it as submitted; rows marked reviewed carry the authority’s own wording. The machine-readable profile of a jurisdiction (§5, Annex A) is derived from its Register row and is maintained with the authority.'));

const regCover = [];
const bodyB = [];
const BW = [1750, 2900, 2550, 3050, 2028, 2400]; // sums to 14678
const BW2 = [3000, 11678];                        // Part 2: jurisdiction | revenue and levy; sums to 14678
const PART2_PLACEHOLDER = 'To be published in the next Register edition.';
// Register rows and sources live in annex_b_data.js, maintained by the editor and not published as data.
const ANNEX_B_DATA = path.join(__dirname, 'annex_b_data.js');
const HAS_ANNEX_B = fs.existsSync(ANNEX_B_DATA);
let JURISDICTION_COUNT = null;
if (REGISTER) {
  regCover.push(new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: 'CTRES — ANNEX B — PUBLISHED SEPARATELY', font: FONT, size: 16, bold: true, color: '2E5496' })] }));
  regCover.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'Register of jurisdiction profiles', font: FONT, size: 44, bold: true, color: '1F3864' })] }));
  regCover.push(new Paragraph({ spacing: { after: 320 }, children: [new TextRun({ text: `Annex B of the Common Transaction Reporting and Evidence Standard (${VERSION}) — edition of ${REGISTER_EDITION}`, font: FONT, size: 24, color: '404040' })] }));
  regCover.push(table(['Item', 'Detail'], [
    ['Edition', `${REGISTER_EDITION} — ${REGISTER_COUNT_WORDS} jurisdictions, in four regions`],
    ['Standard', `${VERSION}, universal edition (4 November 2026) — https://ctres.org/standard/. Register editions are dated and change as profiles are added or corrected, without changing the version of the Standard (§13).`],
    ['Status', 'Published. Profiles are read from published sources and re-verified against the primary instruments, summarised to the parameters of §5 of the Standard, and offered to each authority for review. A profile reviewed with its authority carries the authority’s own wording; corrections an authority makes to its own profile are adopted as submitted. The Register is a reference, not legal advice. “Not found” means that no published rule was located, not that none exists.'],
    ['Structure', 'Part 1 — payments, player funds and reporting: rails and virtual assets; ownership, closed loop and payouts; thresholds and reports; player funds; reporting and retention. Part 2 — revenue and levy: the levy base and rate, bonus and open-bet rules, period and deadline, and the form or system through which the operator files. Principal sources follow Part 2.'],
    ['Online', 'https://ctres.org/profiles/ — the same rows, filterable by region, with a page per jurisdiction and its review status'],
    ['Contact', 'hello@ctres.org — corrections from authorities, and comments through github.com/ctres-standard/spec'],
    ['Licence', 'Creative Commons Attribution 4.0 International (CC BY 4.0), as the Standard'],
  ], [2100, 7646]));
}
if (HAS_ANNEX_B) {
  const { REGIONS, SRC } = require(ANNEX_B_DATA);
  JURISDICTION_COUNT = REGIONS.reduce((a, r) => a + r[1].length, 0);
  const regionRow = (name, span) => new TableRow({ cantSplit: true, children: [new TableCell({
    columnSpan: span, width: { size: WL, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: 'D9E2F3' }, margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: name, font: FONT, size: 16, bold: true, color: '1F3864' })] })] })] });
  // Part 1 — payments, player funds and reporting: the first six cells of each row.
  bodyB.push(H2('Part 1. Payments, player funds and reporting'));
  bodyB.push(P(`Edition of ${REGISTER_EDITION}: ${REGISTER_COUNT_WORDS} jurisdictions, grouped by region. Each row summarises the published rules to the parameters of §5 of the Standard: permitted rails and virtual assets; ownership, closed loop and payouts; check thresholds and reports; player funds; reporting and retention.`, { size: 18 }));
  const bRows = [new TableRow({ tableHeader: true, children: ['Jurisdiction', 'Rails and virtual assets', 'Ownership, closed loop, payouts', 'Thresholds and reports', 'Player funds', 'Reporting and retention'].map((h, i) => cell(h, BW[i], { head: true, size: 15 })) })];
  REGIONS.forEach(([name, rows]) => {
    bRows.push(regionRow(name, 6));
    rows.forEach((r, ri) => bRows.push(new TableRow({ cantSplit: true, children: r.slice(0, 6).map((c, i) => cell(c, BW[i], { alt: ri % 2 === 1, size: 14, bold: i === 0 })) })));
  });
  bodyB.push(new Table({ columnWidths: BW, width: { size: WL, type: WidthType.DXA }, rows: bRows }));

  // Part 2 — revenue and levy: the seventh cell of each row (row[6]).
  bodyB.push(BR());
  bodyB.push(H2('Part 2. Revenue and levy'));
  bodyB.push(P('Part 2 gives, for each jurisdiction, the levy base and rate, the bonus and open-bet rules, the period and deadline, and the form or system through which the operator files, as read from published sources and summarised to the revenue and levy parameters of §5 of the Standard; a value seen only in a secondary source, or on which sources conflict, is followed by “(to be confirmed)”. Each row is offered to the authority concerned for review, and a corrected row replaces it as submitted.', { size: 18 }));
  const shortName = (r) => r[0].split(' — ')[0];
  if (REGIONS.some(([, rows]) => rows.some((r) => r[6]))) {
    REGIONS.forEach(([name, rows]) => {
      const rows2 = [new TableRow({ tableHeader: true, children: ['Jurisdiction', 'Revenue and levy'].map((h, i) => cell(h, BW2[i], { head: true, size: 15 })) }), regionRow(name, 2)];
      rows.forEach((r, ri) => rows2.push(new TableRow({ cantSplit: true, children: [
        cell(shortName(r), BW2[0], { alt: ri % 2 === 1, size: 14, bold: true }),
        cell(r[6] || PART2_PLACEHOLDER, BW2[1], { alt: ri % 2 === 1, size: 14 })] })));
      bodyB.push(new Table({ columnWidths: BW2, width: { size: WL, type: WidthType.DXA }, rows: rows2 }));
      bodyB.push(P('', { after: 0 }));
    });
  } else {
    bodyB.push(P(PART2_PLACEHOLDER, { size: 18 }));
  }

  bodyB.push(H2('Principal sources'));
  SRC.forEach((s) => bodyB.push(BUL(s, { size: 15 })));
} else {
  bodyB.push(P('The rows of the Register are maintained by the editor and are included in the published editions (PDF and DOCX at https://ctres.org/profiles/).', { size: 18 }));
}

// =====================================================================
// ANNEXES C–F — portrait
const bodyC = [];
bodyC.push(H1('Annex C. Example records'));
bodyC.push(P('Synthetic records with illustrative values, abbreviated. They show the shape of the data and are not drawn from any operator.'));
bodyC.push(P('Card deposit (R3), with holder match and limit check:'));
bodyC.push(code('{"tx_id":"D-2026-104511","player_ref":"P-20931","player_ref_scope":"licence-A","direction":"deposit","rail":"card","instrument_id":"I-77812","provider_id":"PSP-03","rail_reference_type":"acquirer_reference","rail_reference":"74987506291000123456789","amount":"150.00","currency_or_asset":"EUR","amount_reporting_ccy":"150.00","initiated_at":"2026-11-04T19:02:11+01:00","credited_at":"2026-11-04T19:02:14+01:00","credited_amount":"150.00","ledger_entry_ref":"L-552019","check_ids":["C-90211","C-90212"],"limit_check":"within_limit","outcome":"accepted"}'));
bodyC.push(P('Mobile money deposit (R3), with a tax line and an authority reference:'));
bodyC.push(code('{"tx_id":"D-2026-339120","player_ref":"P-55102","direction":"deposit","rail":"mobile_money","instrument_id":"I-MM-0931","provider_id":"MMO-01","rail_reference_type":"operator_receipt","rail_reference":"TJK4X9ZQ2L","authority_reference":"CMS-20261104-0081734","amount":"1000.00","currency_or_asset":"KES","credited_at":"2026-11-04T20:15:09+03:00","credited_amount":"950.00","tax_lines":[{"type":"excise_on_deposit","rate":"0.05","amount":"50.00","authority":"tax_authority","due_at":"2026-11-05","remittance_ref":"TR-20261105-01"}],"ledger_entry_ref":"L-881204","check_ids":["C-71820"],"outcome":"accepted"}'));
bodyC.push(P('Instant-payment withdrawal (R4), with closed-loop evidence and payout timing:'));
bodyC.push(code('{"tx_id":"W-2026-220871","player_ref":"P-31007","direction":"withdrawal","rail":"bank_transfer","instrument_id":"I-77990","rail_reference_type":"instant_payment_e2e_id","rail_reference":"E1234567820261104193512345678901","amount":"420.00","currency_or_asset":"BRL","requested_at":"2026-11-04T19:30:02-03:00","approved_by":"rule:auto-payout-v4","approved_at":"2026-11-04T19:30:05-03:00","paid_at":"2026-11-04T19:35:12-03:00","destination_rule":"same_instrument","source_instrument_ids":["I-77990"],"check_ids":["C-91002"],"outcome":"accepted"}'));
bodyC.push(P('Virtual-asset deposit (R3), under a pooled provider wallet — no hash exists, so the provider reference is the anchor:'));
bodyC.push(code('{"tx_id":"D-2026-000512","player_ref":"P-1190","direction":"deposit","rail":"virtual_asset","instrument_id":"I-VA-2210","provider_id":"VASP-01","rail_reference_type":"provider_reference","rail_reference":"INV-77120-AA","amount":"250.000000","currency_or_asset":"USDT-ERC20","off_chain_movement":true,"credited_at":"2026-11-04T10:12:44Z","credited_amount":"250.00","check_ids":["C-77401"],"outcome":"accepted","attestation_ref":"ATT-2026-11-VASP1"}'));
bodyC.push(P('Coverage statement (R7), daily:'));
bodyC.push(code('{"statement_id":"COV-2026-11-04-LIC-A","kind":"coverage","period_end":"2026-11-04T23:59:59+01:00","player_balances_total":"1840220.15","pending_withdrawals_total":"61200.00","open_bets_total":"88415.40","player_liability_total":"1989835.55","funds_held":{"segregated_account":"1902400.00","guarantee":"150000.00"},"in_transit_total":"41880.10","shortfall":"0.00","prepared_by":"finance_ops","reviewed_by":"compliance_officer"}'));
bodyC.push(P('Gaming revenue statement (R13), one online product line for a month, with bonus and open-bet quantities:'));
bodyC.push(code('{"statement_id":"GRS-2026-10-LIC-A-SPORTS-EUR","statement_kind":"period","licence_ref":"LIC-A","product_line":"sports_fixed_odds","jurisdiction_category":"betting","channel":"online","period_start":"2026-10-01T00:00:00+02:00","period_end":"2026-10-31T23:59:59+01:00","currency":"EUR","stakes_basis":"settled","winnings_basis":"credited","stakes_cash":"2410500.00","stakes_bonus":"96300.00","stakes_refunded":"12840.00","winnings_cash":"2201150.00","winnings_bonus":"71400.00","bonus_granted":"120000.00","bonus_expired":"23500.00","bonus_measurement":"per_round","open_liability_start":"81930.00","open_liability_end":"94120.00","bets_count":1764210,"active_players":40312,"ggr_declared":"221410.00","ggr_formula":"all_in","levy_base_declared":"221410.00","levy_rate":"0.15","levy_amount_declared":"33211.50","prepared_by":"finance_ops","reviewed_by":"compliance_officer","evidence_ref":"PAM-MTD-2026-10-sports"}'));
bodyC.push(P('Venue count (R14), one slot machine for a gaming day, electronic meters:'));
bodyC.push(code('{"count_id":"VC-2026-10-14-V03-SM-0117","venue_id":"V-03","gaming_day":"2026-10-14","unit_type":"slot_machine","unit_id":"SM-0117","currency":"EUR","meter_source":"electronic","meters_start":{"coin_in":"1884210.00","coin_out":"1702950.00","jackpots_hand_paid":"41200.00","cancelled_credits":"9850.00","progressive_payouts_machine_paid":"0.00","progressive_payouts_attendant_paid":"0.00","bill_in":"312400.00","ticket_in":"98100.00","ticket_out":"226300.00","wat_in":"0.00","wat_out":"0.00","promo_in":"4200.00","promo_out":"0.00","games_played":1402311},"meters_end":{"coin_in":"1902640.00","coin_out":"1719120.00","jackpots_hand_paid":"41200.00","cancelled_credits":"10310.00","progressive_payouts_machine_paid":"0.00","progressive_payouts_attendant_paid":"0.00","bill_in":"315900.00","ticket_in":"99250.00","ticket_out":"228900.00","wat_in":"0.00","wat_out":"0.00","promo_in":"4350.00","promo_out":"0.00","games_played":1415978},"win_declared":"1800.00","win_formula":"slot_meter_formula","prepared_by":"slot_ops","reviewed_by":"finance_ops"}'));
bodyC.push(P('Venue count (R14), the venue_total row for the same gaming day — the count room against the meters, and the drop banked:'));
bodyC.push(code('{"count_id":"VC-2026-10-14-V03-TOTAL","venue_id":"V-03","gaming_day":"2026-10-14","unit_type":"venue_total","unit_id":"V-03","currency":"EUR","meter_source":"electronic","hard_count":"402150.00","soft_count":"1186400.00","count_variance":"-310.00","win_declared":"96480.00","win_formula":"profile","drop_deposit_ref":"M-2026-10-15-0007","prepared_by":"count_room","reviewed_by":"finance_ops"}'));

bodyC.push(H1('Annex D. Conformance declaration (template)'));
bodyC.push(P('For signature by the operator’s responsible officer.'));
bodyC.push(table(['Item', 'Entry'], [
  ['Operator and licence(s)', ''],
  ['Profile(s) applied, with versions', ''],
  ['Reporting period', ''],
  ['Records start date', 'The date from which complete records exist; earlier periods reported as not_recorded'],
  ['Rails in use', 'card / bank_transfer / emoney / mobile_money / voucher / cash / virtual_asset'],
  ['Custody models in use', 'direct / omnibus_at_provider / hybrid, per location type'],
  ['Where the records are held', 'System location, and the arrangement relied upon for any data-location rule'],
  ['Declared conformance level', 'level_1 Return / level_2 Evidence / level_3 Custody / level_4 Supervision (§10)'],
  ['Record types produced', 'The records of the declared level, and any further record types produced, with reasons for any omission'],
  ['Revenue statements and venue counts', 'R13 per product line, channel and currency, with the GGR formula and levy base applied; R14 per venue, where the licence covers venues; or not applicable, with the reason'],
  ['Check providers and registers used', ''],
  ['Conformance suite version tested against', ''],
  ['Exceptions open at period end, and the oldest open exception', ''],
  ['Responsible officer, signature and date', ''],
], [3800, 5946]));

bodyC.push(H1('Annex E. Glossary'));
bodyC.push(table(['Term', 'Meaning in this Standard'], [
  ['Rail', 'A payment system class: card, bank transfer and instant payment, e-money, mobile money, voucher, cash or virtual asset.'],
  ['Instrument', 'A specific means of payment on a rail that is linked to a player: a card, an account, a phone number, a voucher or a wallet address.'],
  ['Funds location', 'Any account, balance, wallet or float in which the operator holds money.'],
  ['Profile', 'A set of parameters, in the machine-readable structure defined by the schema (Annex A), that applies one jurisdiction’s rules to the record model.'],
  ['Register', 'Annex B: the published set of jurisdiction profiles in human-readable form, in dated editions, at ctres.org/profiles/ and as CTRES_Register.pdf.'],
  ['Core', 'The package manifest with R3, R4, R7 and R13 — the records every package carries from Level 2.'],
  ['Module', 'A group of record types added by a conformance level: Custody (R1, R2, R6, R10, R11), Supervision (R5, R8, R9, R12), Venue (R14).'],
  ['Conformance level', 'One of four minimum record sets an operator declares for a package (§10): Return, Evidence, Custody, Supervision.'],
  ['Closed loop', 'The rule that a payout returns to the instrument, or to an instrument of the same holder, from which the player funded the account.'],
  ['Coverage', 'The relationship between total player liabilities and the funds held to meet them.'],
  ['Rail reference', 'The identifier a payment rail issues for a payment.'],
  ['Authority reference', 'The identifier an authority’s own system issues for a transaction.'],
  ['Unexplained delta', 'The residual difference after matching a ledger against an external statement.'],
  ['Evidence pack', 'The set of records that shows one payment end to end.'],
  ['Conformance suite', 'The versioned catalogue of validation rules, tolerances and severities against which a package is tested.'],
  ['Levy formula', 'The profile parameter (§5) that names the R13 quantities entering the levy base, each with its sign and any cap, and the rate, bands or fixed amount applied.'],
  ['Central register or hub', 'A system run by or for an authority that is queried before money moves (a limit file, an exclusion register) or through which transactions must pass.'],
  ['Data vault', 'A store of operator records held in the authority’s schema, from which the authority reads or pulls data.'],
  ['Indexed unit', 'A threshold expressed in a unit whose money value changes over time, such as a minimum wage or an inflation-indexed unit.'],
  ['Gross gaming revenue (GGR)', 'Stakes less winnings for a product and period, under the recognition and bonus rules of the profile.'],
  ['Money bridge', 'The identity in §4.13 that ties stakes less winnings to deposits, withdrawals, player balances, open bets and bonus movements for the same licence, currency and period.'],
  ['Stake', 'The amount a player puts at risk on a bet or round, in cash or in bonus credits.'],
  ['Winnings', 'The amount paid or credited to players on settled bets and rounds, gross of any tax withheld at payout.'],
  ['Bonus stake', 'A stake funded from promotional credits rather than from money the player deposited.'],
  ['Open-bet liability', 'Stakes accepted on bets or games not settled at a cut-off, held for the player until settlement.'],
  ['Retail', 'A betting shop or sales point where bets are taken over a counter and settled in cash or by ticket.'],
  ['Venue', 'A casino, gaming hall or other premises with a gaming floor and a count room, whose units are counted in R14.'],
  ['Gaming day', 'A venue’s or licence’s 24-hour accounting period, starting at the cut-off the profile sets.'],
  ['Drop', 'Cash, markers and coupons removed from a table’s drop box, or cash and tickets from a machine’s bill acceptor, for a gaming day.'],
  ['Meters', 'A gaming machine’s cumulative counters — coin in, coin out, hand-paid jackpots, cancelled credits, progressive payouts, bills in, tickets in and out, promotional credits, cashless transfers in and out, games played — read at the start and end of a gaming day.'],
], [2300, 7446]));

bodyC.push(new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: 'End of the Standard. Corrections to any profile are especially welcome: the Standard is only as good as the authorities’ reading of it.', font: FONT, size: 18, italics: true, color: '595959' })] }));

// =====================================================================
const portrait = { page: { margin: { top: 1000, right: 1080, bottom: 1000, left: 1080 } } };
const landscape = { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 900, right: 1080, bottom: 900, left: 1080 } } };

const doc = new Document({
  creator: 'CTRES',
  lastModifiedBy: 'CTRES',
  title: REGISTER ? `CTRES Register of jurisdiction profiles — edition of ${REGISTER_EDITION}` : 'Common Transaction Reporting and Evidence Standard (CTRES) v1.1',
  subject: REGISTER ? 'Annex B of CTRES v1.1: jurisdiction profiles researched from published sources, in dated editions' : 'An open, rail-neutral format for evidencing payment flows and gaming revenue in regulated gambling',
  keywords: 'CTRES; gambling regulation; payments; AML; evidence; standard',
  description: REGISTER ? `CTRES Register, edition of ${REGISTER_EDITION}. https://ctres.org/profiles/ · hello@ctres.org` : 'CTRES v1.1, published standard. https://ctres.org · hello@ctres.org',
  numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 360, hanging: 200 } } } }] }] },
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  sections: REGISTER ? [
    { properties: portrait, headers: { default: header(560, 380, 595, 842) }, footers: { default: footer() }, children: regCover },
    { properties: landscape, headers: { default: header(760, 516, 842, 595) }, footers: { default: footer() }, children: bodyB },
  ] : [
    { properties: portrait, headers: { default: header(560, 380, 595, 842) }, footers: { default: footer() }, children: [...body, ...bodyC] },
  ],
});

if (HAS_ANNEX_B && JURISDICTION_COUNT !== 90) throw new Error('count '+JURISDICTION_COUNT);
if (REGISTER && !HAS_ANNEX_B) console.log('annex_b_data.js not found: Register built with a placeholder');
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(OUT, buf); console.log('written', OUT); });

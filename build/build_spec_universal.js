// CTRES v1.0 (universal edition) — Common Transaction Reporting and Evidence Standard
// Build: node build_spec_universal.js <out.docx>   (reads assets/watermark.png and, if present, annex_b_data.js)
const fs = require('fs');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
        WidthType, ShadingType, AlignmentType, PageBreak, Footer, Header, PageNumber, LevelFormat,
        PageOrientation, ImageRun, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom,
        HorizontalPositionAlign, VerticalPositionAlign } = d;
const path = require('path');
const BRAND = { email: 'hello@ctres.org', web: 'ctres.org' };
const WM = fs.readFileSync(path.join(__dirname, 'assets', 'watermark.png'));

const OUT = process.argv[2] || 'CTRES_v1.0.docx';
const FONT = 'Arial';
const W = 9746;      // A4 portrait usable width (11906 - 2*1080)
const WL = 14678;    // A4 landscape usable width (16838 - 2*1080)
const VERSION = 'CTRES v1.0';

const P = (text, o = {}) => new Paragraph({
  spacing: { after: o.after === undefined ? 120 : o.after, line: 264 },
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
const fieldTable = (rows) => table(['Field', 'Type', 'Req.', 'Purpose'], rows, [2500, 1500, 700, 5046]);
const code = (t) => new Paragraph({ spacing: { after: 120 }, shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
  children: [new TextRun({ text: t, font: 'Courier New', size: 15 })] });

const footer = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  new TextRun({ text: `${VERSION} — open draft — ${BRAND.web} — page `, font: FONT, size: 15, color: '808080' }),
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
body.push(new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: 'DRAFT FOR CONSULTATION — AN OPEN STANDARD, NOT A PUBLICATION OF ANY REGULATORY AUTHORITY', font: FONT, size: 16, bold: true, color: 'C00000' })] }));
body.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'Common Transaction Reporting and Evidence Standard', font: FONT, size: 44, bold: true, color: '1F3864' })] }));
body.push(new Paragraph({ spacing: { after: 320 }, children: [new TextRun({ text: 'An open, rail-neutral format for evidencing payment flows in regulated gambling', font: FONT, size: 24, color: '404040' })] }));
body.push(table(['Item', 'Detail'], [
  ['Short name', 'CTRES v1.0 — universal edition'],
  ['Status', 'Draft for consultation. Carries no regulatory force and is not endorsed by any authority.'],
  ['Date', '2 October 2026 (revised for publication 5 October 2026)'],
  ['Editor', 'Dmitry Skachko'],
  ['Contact', 'hello@ctres.org'],
  ['Website', 'https://ctres.org'],
  ['Coverage', 'Every payment rail — cards, bank and instant payments, e-money, mobile money, vouchers, cash at retail, virtual assets — under any jurisdiction’s rules, through jurisdiction profiles'],
  ['Editions', 'This universal edition. A Curaçao edition (September 2026) applies the virtual-asset module to the CGA crypto policy guideline.'],
  ['Licence to use', 'The text is licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). Any operator, supplier or authority may implement the Standard without fee or permission. The schema and a reference validator for structural and referential checks are published under the Apache License 2.0 at github.com/ctres-standard. Governance is set out in §13.'],
  ['Comments', 'Through the public issue tracker at github.com/ctres-standard/spec, or to hello@ctres.org. Every authority is invited to correct its own profile in Annex B; corrections an authority makes to its own profile are adopted as submitted.'],
], [2100, 7646]));
body.push(BR());

// ---------------- CONTENTS ----------------
body.push(H1('Contents'));
[['1.', 'Purpose and status'], ['2.', 'Scope'], ['3.', 'Design principles'], ['4.', 'Record model (R1–R12)'],
 ['5.', 'Jurisdiction profiles'], ['6.', 'Rail modules'], ['7.', 'Mapping to existing regulatory formats'],
 ['8.', 'Submission and access'], ['9.', 'Evidence pack'], ['10.', 'Conformance levels'], ['11.', 'Validation'],
 ['12.', 'Data protection, confidentiality and retention'], ['13.', 'Governance and versioning'], ['14.', 'Roadmap'],
 ['15.', 'Questions for authorities'],
 ['A.', 'Field catalogue'], ['B.', 'Indicative jurisdiction profiles'], ['C.', 'Example records'],
 ['D.', 'Conformance declaration (template)'], ['E.', 'Glossary'], ['F.', 'Differences from the Curaçao edition']]
 .forEach(([n, t]) => body.push(new Paragraph({ spacing: { after: 60 }, indent: { left: 200 },
   children: [new TextRun({ text: n + '  ', font: FONT, size: 20, bold: true, color: '2E5496' }), new TextRun({ text: t, font: FONT, size: 20 })] })));
body.push(BR());

// ---------------- 1 ----------------
body.push(H1('1. Purpose and status'));
body.push(H2('1.1 The problem this Standard addresses'));
body.push(P('Every gambling regulator asks operators the same five questions about money. Did it come from the player? Was it checked before it was accepted? Was it credited correctly? Where did it go when it left? Is the money owed to players actually there? Each regulator asks in its own format, on its own calendar and through its own channel.'));
body.push(P('The research behind this version reviewed the published rules of sixty-seven jurisdictions on five continents (Annex B), from long-established online markets to markets that are opening, closed or still writing their rules. The questions are the same in all of them. What differs is a small set of parameters: which payment rails are permitted, at what amounts checks and reports are triggered, over what time window amounts are aggregated, how quickly a payout must be made, where data must be held, and for how long.'));
body.push(P('Three consequences follow from the absence of a common format:'));
body.push(BUL('An operator licensed in several jurisdictions rebuilds the same evidence for each. In federal, provincial and entity systems — Argentina, Bosnia and Herzegovina, Canada, Nigeria, South Africa, the United States — the same facts arrive in as many shapes as there are licensing bodies.'));
body.push(BUL('More than half of the jurisdictions reviewed run, or are building, a central system, data vault or state transaction register — from Italy, Spain, Denmark and Germany to Brazil, Colombia, Kazakhstan, Uzbekistan and Uganda. Each defines the operator-side data afresh, so every new connection is a bespoke integration.'));
body.push(BUL('An operator that has implemented its controls well cannot prove it more cheaply than one that has not.'));
body.push(P('CTRES defines the shape of the evidence once and lets each jurisdiction set its own parameters.'));

body.push(H2('1.2 What this Standard is not'));
body.push(BUL('It creates no obligation. It formats evidence of duties that already exist under each jurisdiction’s law and licence conditions.'));
body.push(BUL('It does not replace any authority’s central system, reporting portal or financial intelligence reporting schema, such as goAML, the FINTRAC reporting API, Infostat-UIF or SIGAP. It is the operator-side evidence layer from which those submissions can be produced (§7).'));
body.push(BUL('It is not endorsed by any authority. Every reference to a jurisdiction’s rules is a reading of published sources, offered for correction.'));
body.push(BUL('It names no vendor and requires none.'));
body.push(BUL('It does not cover game outcomes, wagering records beyond their reference, marketing data or behavioural analytics.'));

body.push(H2('1.3 Relation to the Curaçao edition'));
body.push(P('The first edition of this Standard, prepared in September 2026, covered virtual assets only, under one jurisdiction’s crypto policy. This universal edition keeps its record model and makes three structural changes:'));
body.push(BUL('Rail-neutral core. The record model describes any payment rail. Virtual assets become one rail module among seven (§6), and everything the Curaçao edition defined for them is kept.'));
body.push(BUL('Jurisdiction profiles. Thresholds, windows, permitted rails, deadlines and retention periods are no longer written into the records; they are parameters of a profile (§5). Indicative profiles for sixty-seven jurisdictions are in Annex B.'));
body.push(BUL('Map, don’t replace. Each record carries the references that payment rails and regulators’ own systems issue, so a single source of truth can feed every submission (§7).'));
body.push(P('The full list of differences is in Annex F.'));

// ---------------- 2 ----------------
body.push(H1('2. Scope'));
body.push(H2('2.1 In scope'));
body.push(P('Licensed gambling operators — online and, where an authority so chooses, retail and land-based — and the payment providers acting for them, for the following:'));
body.push(BUL('Player deposits and withdrawals on any rail, and the payment instruments used.'));
body.push(BUL('Every location where the operator holds money: player-funds accounts, operational and treasury accounts, provider balances, mobile money collection accounts, virtual-asset wallets and cash floats.'));
body.push(BUL('Checks that precede the movement of money: identity and holder verification, sanctions, eligibility and exclusion registers, limits, source of funds, fraud and blockchain analytics.'));
body.push(BUL('Taxes levied or withheld at the point of payment.'));
body.push(BUL('Movements between the operator’s own funds locations.'));
body.push(BUL('Reconciliation of each funds location, and of total player liabilities against the funds held to cover them.'));
body.push(BUL('Exceptions, incidents, and references to reports filed with other authorities.'));
body.push(H2('2.2 Out of scope'));
body.push(P('Game and wager records, which are referenced but not reproduced; marketing and affiliate data; behavioural analytics; and the content of suspicious transaction reports, which remains under the confidentiality rules of each jurisdiction (§12).'));

// ---------------- 3 ----------------
body.push(H1('3. Design principles'));
body.push(table(['Principle', 'What it means in practice'], [
  ['No new obligations', 'The Standard formats evidence of duties that already exist. A field that cannot be traced to a requirement in at least one jurisdiction is optional.'],
  ['Rail-neutral core, rail modules at the edge', 'Fields common to every rail live in the core records. Fields that exist on one rail only — a transaction hash, a card BIN, a mobile money receipt, a retail point identifier — live in a rail module (§6).'],
  ['Jurisdiction as configuration', 'Thresholds, aggregation windows, deadlines, permitted rails and retention periods are profile parameters, never constants in the format. Records carry the raw facts needed to apply any profile.'],
  ['Map, don’t replace', 'Regulators keep their own channels and schemas. CTRES records carry the references those systems issue and can be transformed into their formats.'],
  ['Evidence over assertion', 'A control is reported as the record it produced, with a timestamp and an actor, not as a statement that the control exists.'],
  ['Computed, not declared', 'Where a fact can be derived from other records — a payout to the instrument that funded the account, a movement out of player funds, the time taken to report an incident — validation derives it instead of trusting a flag the operator sets.'],
  ['Visible gaps', 'Where a control left no record, the field is reported as not_recorded rather than omitted, so that an absence of evidence is visible and is not mistaken for an export error.'],
  ['Pseudonymous by default', 'Periodic submissions carry player references, masked account numbers and hashed phone numbers — never identity documents.'],
  ['Proportionate', 'Three conformance levels let a small operator comply with files and a large one with an interface.'],
  ['Deterministic and verifiable', 'The same inputs produce the same package. Every package carries a manifest with a hash per file and may carry a signature, so a submission can be proved unaltered.'],
  ['Currency-aware', 'Amounts are decimal strings with an ISO 4217 code or an asset identifier, plus a reporting-currency value with its rate and source, so that thresholds in any currency can be applied. Thresholds set in indexed units — minimum wages, UMA, UIT, base units — are converted with the value in force on the transaction date, which the profile records.'],
], [2500, 7246]));

// ---------------- 4 ----------------
body.push(H1('4. Record model'));
body.push(P('Twelve record types. Each record is one line of JSON; each file holds one record type for one period. Core fields are listed below; rail-module fields are described in §6, and the complete catalogue is maintained as a machine-readable schema (Annex A), published at github.com/ctres-standard/schema.'));
body.push(table(['ID', 'Record', 'The question it answers'], [
  ['R1', 'Funds Location', 'Where does the operator hold money, for what purpose, and under what protection?'],
  ['R2', 'Payment Instrument Link', 'Does this instrument belong to this player, and may it receive payouts?'],
  ['R3', 'Deposit', 'What came in, from which instrument, when was it credited, and what was checked first?'],
  ['R4', 'Withdrawal', 'What went out, to which instrument, who released it, and how quickly?'],
  ['R5', 'Check Decision', 'Which control ran, before which event, with what outcome?'],
  ['R6', 'Internal Movement', 'Did money move between the operator’s own locations, and was segregation kept?'],
  ['R7', 'Reconciliation Statement', 'Do the books match the external statements, and are player liabilities covered?'],
  ['R8', 'Exception', 'What could not be explained, for how much, for how long, and who owns it?'],
  ['R9', 'Incident', 'What happened that an authority must be told, and when was it told?'],
  ['R10', 'Provider Register', 'Who handles the money, under whose authorisation, after what due diligence?'],
  ['R11', 'Provider Attestation', 'Where the operator cannot see the money directly, what does the provider certify?'],
  ['R12', 'Report Reference', 'Which reports were filed elsewhere, triggered by which records, against which deadline?'],
], [700, 2600, 6446]));

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
body.push(P('The two records that carry the money. Both reference the instrument, the checks relied upon and the ledger entry, so that the payment, the decision and the player balance can be tied together without further enquiry.'));
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
body.push(P('A link between CTRES records and reports filed with other authorities: suspicious transaction reports, cash and virtual-currency threshold reports, casino disbursement reports, periodic systematic reports, tax remittances and regulator notifications. Fields: reference identifier; report type; destination authority; channel (goAML, a national reporting API, a regulator portal or other); the profile rule that triggered it; related records; deadline; time filed; the receipt the destination issued.'));
body.push(P('R12 never carries the content of a suspicious transaction report. Where tipping-off and confidentiality rules apply, R12 is held by the operator and disclosed only to an authority entitled by law to see it; periodic packages then carry counts and timeliness only.'));

// ---------------- 5 ----------------
body.push(H1('5. Jurisdiction profiles'));
body.push(P('A profile is a short configuration, in the machine-readable structure defined by the schema (Annex A), that turns the neutral record model into one authority’s rule set. It contains parameters only and never adds fields. The table lists the parameters, with examples drawn from the indicative profiles in Annex B.'));
body.push(table(['Parameter', 'Examples from Annex B'], [
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
body.push(P('Profiles carry effective dates, so a new rule, a market opening or a change of regulator becomes a new profile version rather than an edit — Finland’s licensing from July 2027 and Latvia’s transfer of supervision to its tax authority are examples. Where a market is closed to online gambling, as in India and Kosovo, the profile covers payment-side blocking only.'));
body.push(P('Profiles belong to the authorities. The editor publishes a profile as confirmed only when the authority concerned has reviewed it; until then it is marked indicative, as every profile in Annex B is today. Where a federal or provincial system has several licensing bodies, a profile may inherit from a shared base and override only what differs, so that provinces or states agree the common part once.'));

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
body.push(P('The virtual-asset module carries forward everything in the Curaçao edition: wallet purpose classes and temperature, key-control models, same-asset and same-wallet withdrawals, blockchain analytics as a check type, and custody models for pooled provider wallets.'));

// ---------------- 7 ----------------
body.push(H1('7. Mapping to existing regulatory formats'));
body.push(P('CTRES does not compete with the formats authorities already receive. It is the source those submissions are produced from, and the place an authority can look when a submission raises a question.'));
body.push(table(['Destination', 'What it receives today', 'CTRES source'], [
  ['Financial intelligence units (goAML and national equivalents)', 'Suspicious and threshold reports in the unit’s own schema', 'R3, R4 and R5 populate transactions and parties; profile windows drive aggregation; R12 keeps the receipt'],
  ['FINTRAC (Canada)', 'Large cash, large virtual currency, casino disbursement and suspicious transaction reports through a JSON API', 'R3 and R4 with the 24-hour rule applied by the profile; R12 keeps the receipt'],
  ['SIGAP (Brazil)', 'Signed XML files, daily and monthly', 'R3 and R4 feed the wallet-movement files; R12 keeps the file receipts'],
  ['Central control systems (e.g. Italy, Greece, Bulgaria, Serbia, Ukraine, Kenya)', 'Transaction data in real time, in the authority’s protocol', 'authority_reference on R3 and R4 links each payment to the code the central system issued'],
  ['Data vaults and safe servers (e.g. Netherlands, Denmark, Germany, Spain, Romania)', 'Account and transaction records in the authority’s schema, XML or JSON', 'R3 and R4 map to the vault’s payment records; R12 keeps the seal or upload receipt'],
  ['Central limit files, registers and state hubs (e.g. Germany, Czech Republic, Kazakhstan, Uzbekistan)', 'A query before each deposit or bet, and the hub’s transaction identifier', 'R5 records each query and response, performed by the authority system; authority_reference carries the hub identifier'],
  ['Tax-authority feeds (e.g. Mexico, Kenya, Uganda, Ghana)', 'Transactions and taxes, in real time or daily', 'tax_lines on R3 and R4; R12 keeps remittance receipts'],
  ['Player-funds reporting (e.g. Malta’s monthly report; annual agreed-upon procedures in several jurisdictions)', 'Balances, liabilities and supporting statements', 'R7 coverage statement, with evidence references'],
  ['Periodic regulatory returns (e.g. United Kingdom, Gibraltar)', 'Aggregated figures', 'Derived from R3, R4 and R7'],
], [2900, 3300, 3546]));
body.push(P('The mappings above are indicative. Detailed mappings are maintained separately from this Standard, versioned, and tested against the destination’s own schema wherever that schema is public.'));

// ---------------- 8 ----------------
body.push(H1('8. Submission and access'));
body.push(H2('8.1 Modes'));
body.push(P('The profile chooses the mode. None of them adds a channel.'));
body.push(table(['Mode', 'When', 'Contents'], [
  ['Continuous', 'Where the authority runs a central system or requires real-time access', 'Records are generated as events occur. The authority’s system remains the channel; CTRES is the operator-side source and audit trail.'],
  ['Periodic package', 'On the profile’s cadence — monthly, quarterly or semi-annual', 'R1, R7, R8, R10 and R11, with the conformance declaration; R2 to R6 as a full extract or a sample, as the profile sets'],
  ['On demand', 'Within the profile’s deadline for information requests', 'The evidence pack (§9), per player, per transaction or per period'],
  ['Incident', 'Within the profile’s incident deadline', 'R9, with the affected records referenced by identifier'],
], [2000, 3000, 4746]));
body.push(H2('8.2 Formats and integrity'));
body.push(BUL('JSON Lines, UTF-8, one record per line, one record type per file. A CSV profile with identical field names is permitted at Level 1.'));
body.push(BUL('Timestamps in ISO 8601 with an explicit offset. Amounts as decimal strings, never floating point. Currencies as ISO 4217 codes; virtual assets by chain and contract.'));
body.push(BUL('Every package carries manifest.json: licence, profile identifier and version, period, record counts, a SHA-256 hash per file, and the generating software and version. The SHA-256 of manifest.json is the package fingerprint: a receipt that quotes it proves which package was submitted. The manifest may be signed with the operator’s certificate where the profile requires.'));
body.push(BUL('Corrections are submitted as a new package that supersedes an earlier one by identifier and reason, so that the record of what was known when is preserved.'));
body.push(H2('8.3 Transport and location'));
body.push(P('Through the authority’s existing channel. Periodic packages are pseudonymous, so a package seen in transit reveals no player identity. Data location follows the profile. The Standard proposes no new channel and moves no data across borders.'));

// ---------------- 9 ----------------
body.push(H1('9. Evidence pack'));
body.push(P('The pack answers a single supervisory question on any rail: show me this money, end to end. It is assembled from records already defined and contains, for one deposit and the withdrawal that followed it:'));
body.push(BUL('The player reference, verification status and the level of due diligence applied at the relevant threshold.'));
body.push(BUL('The deposit: rail, instrument, holder-match result, amount, rail reference and any authority reference.'));
body.push(BUL('The checks that preceded crediting, with timestamps that prove the order.'));
body.push(BUL('The crediting entry, and any difference from the amount received, with its reason.'));
body.push(BUL('Taxes levied at the payment and their remittance.'));
body.push(BUL('The withdrawal: destination, closed-loop result, checks, approver, and the times requested and paid.'));
body.push(BUL('The location and coverage statements for the period, any exception referencing the transaction, and any report reference the requester is entitled to see.'));
body.push(P('An auditor can sample directly from these packs. An operator that can produce them in minutes rather than weeks has reduced the cost of its own audit — the commercial reason to adopt the Standard, irrespective of supervision.'));

// ---------------- 10 ----------------
body.push(H1('10. Conformance levels'));
body.push(table(['Level', 'Requirement', 'Typical operator'], [
  ['Level 1 — Records', 'Every record type applicable under the operator’s profile can be produced on request, within the profile’s deadline, in CSV or JSON, with a manifest.', 'Small operator; manual assembly permitted'],
  ['Level 2 — Structured', 'Periodic packages are submitted on the profile’s cadence in the defined format and pass structural and referential validation.', 'Most operators'],
  ['Level 3 — Continuous', 'Records are generated as events occur, exceptions are tracked to closure with ageing, and the authority may pull a period on request.', 'Large or multi-licence operator; operators connected to a central system'],
], [1900, 5200, 2646]));
body.push(P('An operator declares its level in the conformance statement at Annex D, signed by the responsible officer.'));

// ---------------- 11 ----------------
body.push(H1('11. Validation'));
body.push(P('A format helps only if conformance can be checked mechanically. Validation is defined here by class, not by rule, so that rules can evolve without reopening the Standard.'));
body.push(table(['Class', 'Question it answers', 'Examples'], [
  ['Structural', 'Is the package well formed?', 'Required fields present; types and enumerations valid; manifest hashes match the files'],
  ['Referential', 'Does the package hold together?', 'Every payment references an instrument in R2 and a provider in R10; every check reference resolves; each transfer is booked once; statement totals agree with the records behind them'],
  ['Profile conformance', 'Does the evidence show the control operated under this jurisdiction’s rules?', 'Checks precede crediting; payouts follow the profile’s closed-loop rule or carry a justification; no credit-funded instrument where credit is prohibited; payout times within the profile’s deadline; coverage at or above the required level'],
  ['Completeness', 'Is anything missing that should be there?', 'External movements on inventory locations that appear in no record; rail references the external source does not confirm; funding instruments missing from R2; periods with no statement; differences no exception owns; exceptions open beyond their ageing limit'],
], [1900, 2800, 5046]));
body.push(P('The catalogue of individual checks, their severities, the tolerances that separate a rounding difference from a discrepancy, and the materiality thresholds that make an exception reportable are deliberately not fixed in this Standard. They belong to each authority to set, and they will change more often than the format. They are maintained separately as a versioned conformance suite, so that a package can be tested against a named suite version and a named profile version, and the result reproduced later.'));
body.push(P('Wherever an independent source exists — the chain for virtual assets, bank and provider statements, an authority’s own central system — completeness is checked against that source and not only against the operator’s account of it.'));
body.push(P('An open reference validator for the Structural and Referential classes, validator-lite, is published under the Apache License 2.0 at github.com/ctres-standard/validator-lite. Validation under the Profile conformance and Completeness classes depends on the parameters this section leaves to each authority and is provided separately. No validator is a condition of using this Standard; an implementation validated by any other means is equally conformant.'));

// ---------------- 12 ----------------
body.push(H1('12. Data protection, confidentiality and retention'));
body.push(BUL('Periodic packages carry pseudonymous player references, masked account numbers and hashed phone numbers. Names, addresses and identity documents are not included.'));
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
  ['Versioning', 'Major versions change the record model; minor versions add fields, rails or profiles; patches correct text. Profiles, mapping files and the conformance suite are versioned separately.'],
  ['Licence', 'The text is licensed under CC BY 4.0. The schema (record types R1–R12, the package manifest and the structure of a jurisdiction profile) and the reference validator for the Structural and Referential classes (§11) are licensed under the Apache License 2.0. Profiles are published in human-readable form in Annex B. Anyone may implement the Standard without fee or permission.'],
  ['Conformance claims', '“CTRES Conformant” describes an implementation tested against a named conformance suite version. A claim states the suite and profile versions it was tested against.'],
  ['Working group', 'The editor proposes to convene a working group of authorities and practitioners once at least three authorities have reviewed their profiles.'],
], [2200, 7546]));

// ---------------- 14 ----------------
body.push(H1('14. Roadmap'));
body.push(table(['When', 'Step', 'Who'], [
  ['Q4 2026', 'Authorities review their indicative profiles; corrections adopted as submitted', 'Authorities, editor'],
  ['Q1 2027', 'Pilots with volunteer operators across at least three rail mixes: cards and bank transfers; mobile money; virtual assets', 'Operators, editor'],
  ['Q2 2027', 'Version 1.1 with confirmed profiles, versioned mappings to existing formats, and the conformance suite versioned alongside', 'Editor'],
  ['From July 2027', 'Alignment review as the EU Anti-Money Laundering Regulation (EU) 2024/1624 begins to apply', 'Editor, with EU authorities'],
], [1600, 6046, 2100]));

// ---------------- 15 ----------------
body.push(H1('15. Questions for authorities'));
body.push(P('Each answer changes the Standard materially.'));
body.push(BUL('Is the indicative profile for your jurisdiction in Annex B correct, and what is missing?'));
body.push(BUL('Which rails do you expect to permit, restrict or review over the next two years — in particular virtual assets and new instant-payment schemes?'));
body.push(BUL('Would a common operator-side format reduce the cost of connecting operators to your central system or reporting channel?'));
body.push(BUL('Which submission mode fits your supervision: continuous, periodic package, on demand, or a mix?'));
body.push(BUL('Which holder-verification methods do you accept as evidence that an instrument belongs to the player?'));
body.push(BUL('Where player money sits in a provider’s pooled account — a payment provider, mobile money operator or virtual-asset provider — does a provider attestation (R11) satisfy you, or do you expect the operator to evidence it directly?'));
body.push(BUL('Should report references (R12) be visible to you in periodic packages, as counts only, or not at all?'));
body.push(BUL('For federal and provincial systems: would licensing bodies accept a shared base profile with local overrides?'));
body.push(BUL('If you run a central register, hub or data vault, would you publish its schema, so that a mapping file can be maintained and tested against it?'));
body.push(BUL('May operators refer to this Standard, in the policies and procedures they file with you, as the format in which they will evidence their controls?'));

// ---------------- ANNEX A ----------------
body.push(H1('Annex A. Field catalogue'));
body.push(P('The extracts in §4 and §6 are sufficient to build a working implementation of every record type. The complete catalogue adds formats, enumerations, conditional requirements and examples for each field, together with the profile schema. It is maintained as a versioned machine-readable schema — JSON Schema for record types R1–R12, the package manifest and the structure of a jurisdiction profile — published under the Apache License 2.0 at github.com/ctres-standard/schema, so that implementations can be tested automatically rather than read.'));

// =====================================================================
// ANNEX B — landscape section
const bodyB = [];
bodyB.push(H1('Annex B. Indicative jurisdiction profiles'));
bodyB.push(P('Readings of published sources as at 2 October 2026, summarised to the parameters in §5 and grouped by region. They are not legal advice and have not been confirmed by any authority. “Not found” means that no published rule was located, not that none exists; “to be confirmed” marks a reading the sources did not settle. Each row is offered to the authority concerned for correction, and a corrected row replaces this one as submitted.', { size: 18 }));
const BW = [1750, 2900, 2550, 3050, 2028, 2400]; // sums to 14678
// Annex B rows and sources live in annex_b_data.js, maintained by the editor and not published as data.
// Without that file the build still succeeds and Annex B carries a placeholder paragraph.
const ANNEX_B_DATA = path.join(__dirname, 'annex_b_data.js');
const HAS_ANNEX_B = fs.existsSync(ANNEX_B_DATA);
let JURISDICTION_COUNT = null;
if (HAS_ANNEX_B) {
  const { REGIONS, SRC } = require(ANNEX_B_DATA);
  JURISDICTION_COUNT = REGIONS.reduce((a, r) => a + r[1].length, 0);
  const regionRow = (name) => new TableRow({ cantSplit: true, children: [new TableCell({
    columnSpan: 6, width: { size: WL, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: 'D9E2F3' }, margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: name, font: FONT, size: 16, bold: true, color: '1F3864' })] })] })] });
  const bRows = [new TableRow({ tableHeader: true, children: ['Jurisdiction', 'Rails and virtual assets', 'Ownership, closed loop, payouts', 'Thresholds and reports', 'Player funds', 'Reporting and retention'].map((h, i) => cell(h, BW[i], { head: true, size: 15 })) })];
  REGIONS.forEach(([name, rows]) => {
    bRows.push(regionRow(name));
    rows.forEach((r, ri) => bRows.push(new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, BW[i], { alt: ri % 2 === 1, size: 14, bold: i === 0 })) })));
  });
  bodyB.push(new Table({ columnWidths: BW, width: { size: WL, type: WidthType.DXA }, rows: bRows }));

  bodyB.push(H2('Principal sources'));
  SRC.forEach((s) => bodyB.push(BUL(s, { size: 15 })));
} else {
  bodyB.push(P('The rows of this annex are maintained by the editor and are included in the published editions of this Standard (PDF and DOCX at https://ctres.org/standard/).', { size: 18 }));
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
  ['Declared conformance level', 'Level 1 / Level 2 / Level 3'],
  ['Record types produced', 'R1–R12, or the subset applicable, with reasons'],
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
  ['Closed loop', 'The rule that a payout returns to the instrument, or to an instrument of the same holder, from which the player funded the account.'],
  ['Coverage', 'The relationship between total player liabilities and the funds held to meet them.'],
  ['Rail reference', 'The identifier a payment rail issues for a payment.'],
  ['Authority reference', 'The identifier an authority’s own system issues for a transaction.'],
  ['Unexplained delta', 'The residual difference after matching a ledger against an external statement.'],
  ['Evidence pack', 'The set of records that shows one payment end to end.'],
  ['Conformance suite', 'The versioned catalogue of validation rules, tolerances and severities against which a package is tested.'],
  ['Central register or hub', 'A system run by or for an authority that is queried before money moves (a limit file, an exclusion register) or through which transactions must pass.'],
  ['Data vault', 'A store of operator records held in the authority’s schema, from which the authority reads or pulls data.'],
  ['Indexed unit', 'A threshold expressed in a unit whose money value changes over time, such as a minimum wage or an inflation-indexed unit.'],
], [2300, 7446]));

bodyC.push(H1('Annex F. Differences from the Curaçao edition'));
bodyC.push(table(['Area', 'Curaçao edition (September 2026)', 'This edition'], [
  ['Name', 'Crypto Transaction Reporting and Evidence Standard', 'Common Transaction Reporting and Evidence Standard; the short name CTRES is kept'],
  ['Scope', 'Virtual assets only', 'Every payment rail, through rail modules (§6)'],
  ['Jurisdiction', 'One, with its rules written into the text', 'Any, through profiles (§5); sixty-seven indicative profiles (Annex B)'],
  ['R1', 'Wallet Inventory', 'Funds Location: any location type, protection mechanism, location jurisdiction'],
  ['R2', 'Player Wallet Link', 'Payment Instrument Link: holder match, funding type including invoice and buy-now-pay-later, issuer country, national-ID match, payout status'],
  ['R3, R4', 'On-chain fields at the core', 'Rail-neutral core; rail and authority references; tax lines; limit check; payout timing; closed-loop evidence'],
  ['R5', 'Screening Decision', 'Check Decision: fifteen check types, including central limit files, credit registers, eligibility and exclusion registers, biometric checks and financial risk'],
  ['R7', 'Wallet reconciliation', 'Location statements and a coverage statement for player liabilities'],
  ['R10, R11', 'Counterparty register; custody attestation', 'Provider register for any provider role; provider attestation for any pooled arrangement'],
  ['R12', '—', 'New: references to reports filed with other authorities, without their content'],
  ['New sections', '—', 'Jurisdiction profiles (§5), rail modules (§6), mapping to existing formats (§7), governance (§13)'],
  ['R3, R4 currencies', 'Account currency, account rate and operator-side network cost added in the September revisions', 'Kept, for every rail'],
  ['Cadence', 'The periodic package was aligned to one jurisdiction’s semi-annual reporting dates', 'Cadence is set by each profile'],
], [1700, 3300, 4746]));
bodyC.push(new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: 'End of draft. Corrections to any profile are especially welcome: the Standard is only as good as the authorities’ reading of it.', font: FONT, size: 18, italics: true, color: '595959' })] }));

// =====================================================================
const portrait = { page: { margin: { top: 1000, right: 1080, bottom: 1000, left: 1080 } } };
const landscape = { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 900, right: 1080, bottom: 900, left: 1080 } } };

const doc = new Document({
  creator: 'CTRES',
  lastModifiedBy: 'CTRES',
  title: 'Common Transaction Reporting and Evidence Standard (CTRES) v1.0',
  subject: 'Open, rail-neutral format for evidencing payment flows in regulated gambling',
  keywords: 'CTRES; gambling regulation; payments; AML; evidence; standard',
  description: 'Open draft for consultation. https://ctres.org · hello@ctres.org',
  numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 360, hanging: 200 } } } }] }] },
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  sections: [
    { properties: portrait, headers: { default: header(560, 380, 595, 842) }, footers: { default: footer() }, children: body },
    { properties: landscape, headers: { default: header(760, 516, 842, 595) }, footers: { default: footer() }, children: bodyB },
    { properties: portrait, headers: { default: header(560, 380, 595, 842) }, footers: { default: footer() }, children: bodyC },
  ],
});

if (HAS_ANNEX_B && JURISDICTION_COUNT !== 67) throw new Error('count '+JURISDICTION_COUNT);
if (!HAS_ANNEX_B) console.log('annex_b_data.js not found: Annex B built with a placeholder');
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(OUT, buf); console.log('written', OUT); });

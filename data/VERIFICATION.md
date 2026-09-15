# Reference data verification — Georgia & South Carolina legal-notice deadlines

Verification date: **2026-09-15**. Data under review was compiled around April 2022.

Files reviewed (read-only, unmodified):

- `C:\Users\SamTo\OneDrive\Documents\MyProjects\p-deadlines\data\Georgia.csv` (159 counties + header)
- `C:\Users\SamTo\OneDrive\Documents\MyProjects\p-deadlines\data\South Carolina.csv` (46 counties, no header)

> Note: the task described these files as living in `...\p-deadlines\parsing not parsley\`. That directory no longer exists on disk; the files are now in `...\p-deadlines\data\`. Content is identical to what was reviewed.

---

## Summary

**What could be verified**

1. **Which newspaper is each Georgia county's legal organ — verified for all 159 counties.** The Georgia Press Association publishes a current (2026) county-by-county legal organ list as a PDF. This is authoritative and directly comparable to the tool's implicit assumptions.
2. **Two Georgia counties have changed legal organ since 2022**, both confirmed with primary sources:
   - **Fulton** — Fulton County Daily Report → the *Neighbor* newspapers (South Fulton Neighbor), effective **2024-01-01**, because the Daily Report went digital-only. Confirmed by Fulton County government announcement and by the GPA 2026 list.
   - **Bibb** — The Macon Telegraph → **The Macon Reporter** (published by the Monroe County Reporter, Forsyth), effective **2026-01-01**. Confirmed by trade press and by the GPA 2026 list, which shows Bibb's legal organ as the "Monroe County/Macon Reporter, Forsyth" (an adjacent-county organ).
3. **Publication day verified for 8 Georgia counties** and **exact submission deadline verified for 4** (Chatham, Monroe, Cobb, Forsyth; DeKalb and Gwinnett partially).
4. **Several "Daily" South Carolina rows are now factually wrong.** The McClatchy dailies behind those rows cut print frequency in 2024: *The State* (Columbia) → Wed/Fri/Sun (Apr 2024); *The Herald* (Rock Hill) → Wed/Fri/Sun (Jul 2024); *The Sun News* (Myrtle Beach) → twice weekly (Jun 2024). The same applies in Georgia to the *Columbus Ledger-Enquirer* (Muscogee) → Wed/Sun only from 2024-08-19, which contradicts the CSV's "Tuesday".

**What could not be verified**

- **Per-newspaper submission deadlines are mostly not published online.** As expected, most of the 205 rows can only be confirmed by telephoning the paper. Several newspaper sites actively block automated fetching (HTTP 403/429/451): mdjonline.com, rockdalecitizen.com, forsythnews.com, fultonneighbor.com, lexingtonchronicle.com, pubswift.com.
- **South Carolina has no "legal organ" system at all.** S.C. statutes generally require publication in "a newspaper of general circulation in the county," so there is no authoritative state list of *the* paper per county, and the S.C. Press Association's directory groups papers by daily/weekly without stating publication days. **No South Carolina submission deadline could be verified from a primary source.**

**Overall confidence**

- Georgia *newspaper identity*: **high** (authoritative 2026 GPA list, all 159 counties).
- Georgia *publication days*: **low overall** — only 8 counties independently confirmed; the GPA list does not carry publication days, and no other central source does either.
- Georgia *submission deadlines*: **low** — 4 counties confirmed, 2 of which disagree with the CSV.
- South Carolina, both columns: **very low** — essentially unverified, plus three demonstrably stale "Daily" rows.
- Separately, the CSV contains **internal arithmetic errors** (below) that are independently checkable without any web source, and those are the fastest wins.

Row counts across the counties examined (see tables):

| | Match | Mismatch | Newspaper changed | Unverified |
|---|---|---|---|---|
| Georgia (20 examined) | 6 | 6 | 2 | 6 |
| South Carolina (11 examined) | 1 | 3 | 0 | 7 |
| **Total examined: 31** | **7** | **9** | **2** | **13** |

The remaining 174 rows (139 GA + 35 SC) were not individually examined and should be treated as **Unverified**.

---

## Sources consulted

| Source | URL | Covers | Accessed |
|---|---|---|---|
| Georgia Press Association — "Newspapers by county / legal organs – 2026" (PDF) | https://gapress.org/wp-content/uploads/2026/02/LegalOrganList.pdf | Authoritative legal organ for all 159 GA counties; no publication days | 2026-09-15 |
| GPA Newspaper Directory | https://gapress.org/newspaper-directory/ | City / newspaper / county / website only — **no frequency or publication day** | 2026-09-15 |
| GeorgiaPublicNotice.com (GPA) — Public Notice Law | https://www.georgiapublicnotice.com/Public-Notice-Law.aspx | How legal organs are designated (O.C.G.A. § 9-13-140 et seq.); points to GSCCCA list | 2026-09-15 |
| O.C.G.A. § 9-13-142 | https://codes.findlaw.com/ga/title-9-civil-practice/ga-code-sect-9-13-142/ | Statutory requirements for and changing of a county legal organ | 2026-09-15 |
| Fulton County government — "Happening in Fulton: New Legal Organ" | https://www.fultoncountyga.gov/news/2024/01/08/happening-in-fulton-new-legal-organ | Fulton legal organ change effective 2024-01-01 | 2026-09-15 |
| Fulton County government — announcement (Dec 2023) | https://www.fultoncountyga.gov/news/2023/12/22/announcement-of-change-in-fulton-county-legal-organ-for-public-notices | Same change, advance notice | 2026-09-15 |
| The Macon Melody — "Bibb County designates Macon Reporter as legal organ" | https://maconmelody.com/bibb-county-designates-macon-reporter-as-legal-organ/ | Bibb legal organ change eff. 2026-01-01 (page returns 403 to automated fetch; content seen via search index) | 2026-09-15 |
| Monroe County Reporter (mymcr.net) — "Reporter named Bibb County legal organ" | https://www.mymcr.net/free/reporter-named-bibb-county-legal-organ/article_ed6620c1-f3a0-4bc5-bf74-f4e8a8f54829.html | Same (fetch returned 429; content via search index) | 2026-09-15 |
| Chatham County Probate Court — 2025/2026 publication schedules (PDF) | https://cms.chathamcountyga.gov/api/assets/probate-court/16583cb2-7fb2-4fee-b3cf-edf3e414c903/2025-publication-schedules.pdf | **Best single source found**: legal organ, exact run dates (Thursdays) and exact "Notice to SMN by 5pm <Friday>" deadlines | 2026-09-15 |
| Chatham County Probate — Filer Resources | https://courts.chathamcountyga.gov/Probate/FilerResources | Confirms Savannah Morning News is the publisher of Chatham legal notices | 2026-09-15 |
| DeKalb Legal Notices (The Champion) — Deadlines | https://www.dekalblegalnotices.com/deadlines/ | "General deadline is 12:00 noon, one week prior to subsequent Thursday publishing date" | 2026-09-15 |
| The Champion — Legal Advertising Dept | https://thechampionnewspaper.com/legal-login-advertising/ | DeKalb legal organ, contacts; deadline text only via search index (Wed 5pm for following week) | 2026-09-15 |
| Marietta Daily Journal — Contact / legal advertising | https://www.mdjonline.com/site/contact.html | Cobb legals: "Tuesdays at Noon for Friday publication" (page 451 to fetch; text via search index) | 2026-09-15 |
| Forsyth County News — Connect/Contact | https://www.forsythnews.com/connect/forsyth-county-news-connect-contact-about/ | "deadline for placing public notice (legal) advertising … is noon Friday"; notices publish Wednesday (page 403; text via search index) | 2026-09-15 |
| Gwinnett Daily Post — Legals notice | https://www.gwinnettdailypost.com/site/legals_notice.html | Wed/Sun print; "Wednesday legal section … 3pm Tuesday of the previous week" (page 429; text via search index) | 2026-09-15 |
| Rockdale/Newton Citizen — contact | https://www.rockdalecitizen.com/site/contact.html | Rockdale Citizen prints Wed & Sun; legals@rockdalecitizen.com (page 429) | 2026-09-15 |
| The Covington News — About | https://www.covnews.com/site/about.html | Newton legal organ; prints Sunday and Wednesday | 2026-09-15 |
| Wikipedia — Ledger-Enquirer | https://en.wikipedia.org/wiki/Ledger-Enquirer | Print cut to two days/week (Wed & Sun) from 2024-08-19 | 2026-09-15 |
| Wikipedia — The Sun News | https://en.wikipedia.org/wiki/The_Sun_News | Twice-weekly print from June 2024 | 2026-09-15 |
| Wikipedia — The Herald (Rock Hill) | https://en.wikipedia.org/wiki/The_Herald_(Rock_Hill) | Wed/Fri/Sun print from July 2024 | 2026-09-15 |
| Editor & Publisher — The State reduces print | https://www.editorandpublisher.com/stories/the-state-in-columbia-south-carolina-reduces-print-emphasizes-digital,248271 | The State prints Wed/Fri/Sun from April 2024 | 2026-09-15 |
| S.C. Press Association — Newspapers | https://scpress.org/newspapers/ | SC papers by frequency class only; **no publication days** | 2026-09-15 |
| SCPublicNotices.com | https://www.scpublicnotices.com/ | Notice repository; publication filter only, no county→paper directory with days | 2026-09-15 |
| S.C. Press Association — Legal advertising law | https://scpress.org/legal-advertising-law/ | SC uses "newspaper of general circulation"; no legal-organ designation | 2026-09-15 |
| Spartan Weekly News — Legal notices | https://www.spartanweeklyonline.com/legal-notices | Spartanburg County's public-notice paper; no deadline published | 2026-09-15 |
| Greenville Journal — Legal Notices | https://greenvillejournal.com/legalnotices/ | Greenville legal notices now submitted via Column; no deadline published | 2026-09-15 |
| The Post and Courier — Public & legal notices | https://www.postandcourier.com/classifieds_new/community/announcements/legal/ | Charleston/Dorchester notices; no deadline published | 2026-09-15 |

Sources that do **not** exist / did not help, despite being suggested:

- **GSCCCA legal organ list** — georgiapublicnotice.com points to `gsccca.org/clerks/`, but that is a clerk-directory lookup, not a downloadable legal organ list with publication days. Superseded by the GPA PDF.
- **pubswift.com** county pages — appear to carry per-county newspaper data but return HTTP 403 to automated fetches; a human browser could check these.

---

## Georgia

CSV columns are `County | Publication Day | Deadline Description | Late Deadline Description`. "CSV deadline" below quotes the *normal* deadline; the late deadline is mentioned in Notes where relevant.

| County | CSV publication day | Verified publication day | CSV deadline | Verified deadline | Status | Source | Notes |
|---|---|---|---|---|---|---|---|
| CHATHAM | Thursday | **Thursday** | friday Week prior @ 5:00 (6 days prior) | **Friday 5:00 pm, week prior** | **Match** | Chatham Probate 2025/2026 publication schedule PDF | Strongest verification found. Schedule shows runs on 1/9, 1/16, 1/23, 1/30/2025 (all Thursdays) with "Notice to SMN by 5pm 1/3/2025" (the preceding Friday). Late deadline (Tue wk of @ 12:00) not corroborated. |
| MONROE | Wednesday | **Wednesday** | friday Week prior @ 12:00 (5 days prior) | **Friday 12:00 noon before Wednesday publication** | **Match** | Monroe County Reporter (mymcr.net) | Exactly as in CSV. Now also relevant to Bibb (below). |
| COBB | Friday | **Friday** (legals) | friday Week prior @ 12:00 (7 days prior) | **Tuesday 12:00 noon for Friday publication** (3 days prior) | **Mismatch** | Marietta Daily Journal contact page (via search index) | The paper's stated standard deadline equals the CSV's *late* deadline ("tuesday Week of @ 12:00 (3 days prior)"). The CSV's 7-day normal deadline is more conservative, so the tool errs safe, but the normal/late split is mislabelled. |
| FORSYTH | Wednesday | **Wednesday** | thursday Week prior @ 12:00 (6 days prior) | **Friday 12:00 noon** (5 days prior) | **Mismatch** | Forsyth County News contact/connect page | Same time, one day later than the CSV. Paper also notes notices occasionally run on non-Wednesday days with a 3-days-prior deadline, and accepts late ads for a $50 fee. |
| DEKALB | Thursday | **Thursday** | wednesday Week prior @ 12:00 (8 days prior) | **12:00 noon, one week prior to the Thursday publishing date** (reads as Thursday, 7 days prior); a second source states Wednesday 5 pm | **Mismatch (probable, day count)** | dekalblegalnotices.com/deadlines/ ; thechampionnewspaper.com | Publication day confirmed. The time (noon) matches; the day-of-week does not clearly. The site also mentions an "Early deadline (Tuesday at noon)" for some weeks. Needs a phone call to settle. |
| GWINNETT | Wednesday | **Wednesday** (prints Wed & Sun) | monday Week prior @ 12:00 (9 days prior) | **3 pm Tuesday of the previous week** (8 days prior) for the Wednesday legal section | **Mismatch** | Gwinnett Daily Post legals notice page (via search index) | CSV late deadline (Thu wk prior @ 3:00, 6 days) also does not match. Foreclosures/tax sales have separate deadlines. |
| CLARKE | Friday | **Friday** (legals run in the Friday edition) | wednesday Week of @ 12:00 (2 days prior) | not found | **Match** (publication day only) | Athens Banner-Herald / GPA list | Deadline Unverified. ABH legals now go through the Gannett ad portal (legals.gannettclassifieds.com). |
| HALL | Wednesday | **Wednesday** (The Times prints weekly on Wednesdays) | monday Week of @ 5:00 (2 days prior) | not found | **Match** (publication day only) | The Gainesville Times / Wikipedia | Deadline Unverified. |
| ROCKDALE | Wednesday | **Wednesday** (Rockdale Citizen prints Wed & Sun) | monday Week prior @ 12:00 (9 days prior) | not found (site states only "3 p.m. for the next publication") | **Match** (publication day only) | rockdalecitizen.com | Deadline Unverified; the "3 p.m." is consistent with the CSV late deadline's time. Paper sold by SCNI to Times-Journal Inc. in 2022. |
| NEWTON | Sunday | **Sunday** (The Covington News prints Sunday & Wednesday) | wednesday Week prior @ 12:00 (4 days prior) | not found | **Match** (publication day only) | covnews.com About; GPA 2026 list | Legal organ is **The Covington News**, not the Newton Citizen — worth confirming the CSV was built from the right paper. Deadline Unverified. |
| FULTON | Thursday | not confirmed | friday Week prior @ 12:00 (6 days prior) | not found | **Newspaper changed** | Fulton County announcements (Dec 2023 / Jan 2024); GPA 2026 list | Legal organ changed from the **Fulton County Daily Report** (daily, now digital-only) to the **South Fulton Neighbor / Neighbor newspapers**, effective **2024-01-01**. Reporting says the new organ "publishes once a week". The 2022 row was almost certainly built from the Daily Report and should be considered void. Ordering platform: inklynk.com/fultonneighbor (TLS error on fetch); legals office at the Lewis Slaton Courthouse. |
| BIBB | Tuesday | **Wednesday** (implied) | wednesday Week prior @ 12:00 (6 days prior) | **Friday 12:00 noon** (implied) | **Newspaper changed** | Macon Melody; mymcr.net; GPA 2026 list | Legal organ changed from **The Macon Telegraph** to **The Macon Reporter**, effective **2026-01-01**; notice of the change ran 2025-12-10 in the Telegraph's legal section. The Macon Reporter is produced by the Monroe County Reporter (Forsyth), which publishes **Wednesday** with a **Friday noon** legal deadline — so Bibb should almost certainly now mirror the MONROE row. Confirm by phone (478-994-2358) before shipping. |
| MUSCOGEE | Tuesday | **not Tuesday** — Ledger-Enquirer has printed only **Wednesday and Sunday** since 2024-08-19 | wednesday Week prior @ 12:00 (6 days prior) | not found | **Mismatch** | Wikipedia (Ledger-Enquirer); Muscogee Probate Court | Legal organ is unchanged (Columbus Ledger-Enquirer, GPA 2026), but a Tuesday publication day is no longer possible in print. Legal ads dept: 706-324-5526. |
| RICHMOND | Thursday | not confirmed | thursday Week prior @ 4:00 (7 days prior) | not found | **Unverified** | GPA 2026 list; Augusta Chronicle | Organ unchanged (The Augusta Chronicle). Chronicle dropped its Saturday print edition in 2022 and moved to postal delivery in April 2025, so its legals day should be re-confirmed. Legals: 706-724-0851. |
| COLUMBIA | Wednesday | not confirmed | thursday Week prior @ 4:00 (6 days prior) | not found | **Unverified** | GPA 2026 list | Columbia's organ is also **The Augusta Chronicle** (adjacent-county organ), yet the CSV gives Columbia a Wednesday publication day and Richmond a Thursday one. Possible (it is a daily), but worth one call to confirm both. |
| GLYNN | Saturday | The Brunswick News prints **Tuesday–Saturday** | thursday Week of @ 12:00 (2 days prior) | not found | **Unverified** | thebrunswicknews.com About | Saturday is a valid print day; whether legals run Saturday is unconfirmed. |
| CARROLL | Thursday | not confirmed | thursday Week prior @ 4:00 (7 days prior) | not found | **Unverified** | GPA 2026 list (Times-Georgian, Carrollton) | Organ unchanged. Carroll County's own site says publication arrangements are made directly with the Times-Georgian. |
| CHEROKEE | Thursday | not confirmed | friday Week prior @ 12:00 (6 days prior) | not found | **Unverified** | GPA 2026 list (Cherokee Tribune, Canton) | Organ unchanged; site (tribuneledgernews.com) returned 429. Same ownership as the Marietta Daily Journal, so deadlines may follow the MDJ pattern. |
| CLAYTON | Wednesday | not confirmed | monday Week prior @ 12:00 (9 days prior) | not found | **Unverified** | GPA 2026 list ("Clayton News", Jonesboro) | Paper is no longer the "Clayton News-Daily"; it is now a weekly under Times-Journal Inc. Row is identical to Gwinnett/Henry/Rockdale/Butts, which are all different papers — see Notes on internal consistency. |
| HENRY | Wednesday | not confirmed | monday Week prior @ 12:00 (9 days prior) | not found | **Unverified** | GPA 2026 list (Henry Herald, McDonough) | Same as Clayton. |

### Georgia legal organ list — full cross-check (newspaper identity only)

The GPA 2026 PDF was compared against the CSV's 159 county rows. **All 159 counties still have a designated legal organ and every CSV county name appears on the GPA list.** The only organ *changes* for which evidence was found are Fulton (2024) and Bibb (2026). The GPA list gives no publication days, so it cannot validate column 2 beyond those cases.

Sixteen counties are served by an organ physically located in an adjacent county (GPA marks these `**`), which matters because the CSV should give those counties *identical* days and deadlines to their host county. Notable groups:

| Shared legal organ | Counties | CSV agreement |
|---|---|---|
| Mitchell County Enterprise-Journal (Camilla) | Baker, Mitchell | **Consistent** (both Wed / Fri wk prior 12:00) |
| The Valdosta Daily Times | Echols, Lowndes | **Consistent** (both Fri / Mon wk of 12:00) |
| The Advance (Vidalia) | Montgomery, Toombs, Wheeler | **Consistent** (all Wed / Mon wk of 12:00) |
| The Journal (Buena Vista) | Chattahoochee, Marion | **Consistent** |
| The Journal Messenger (Lincolnton) | Lincoln, Wilkes | **Consistent** |
| Jefferson Reporter / News and Farmer (Louisville) | Glascock, Jefferson | **Consistent** |
| **Cuthbert Southern Tribune** | **Clay, Quitman, Randolph** | **INCONSISTENT** — Clay = Thursday / Thu wk prior 12:00; Quitman = Wednesday / Tue wk of 12:00; Randolph = Wednesday / Mon wk of 5:00. One newspaper cannot have three different schedules. |
| **Stewart Webster Journal Patriot-Citizen (Richland)** | **Schley, Stewart, Webster** | **INCONSISTENT** — Schley = Wednesday; Stewart and Webster = Thursday (deadlines otherwise identical). |
| **The Cordele Dispatch** | **Crisp, Wilcox** | **INCONSISTENT** — same day (Wed) and same deadline day (Mon), but Crisp says 11:00 am and Wilcox says 3:30 pm. |
| **The Journal Sentinel (Reidsville)** | **Long, Tattnall** | **INCONSISTENT** — Long = Monday publication / Wed wk prior 5:00; Tattnall = Thursday / Tue wk of 12:00. |
| The Augusta Chronicle | Columbia, Richmond | Different publication days (Wed vs Thu) — possible for a daily, but unconfirmed. |
| Macon Reporter (from 2026) | Bibb, Monroe | **Now inconsistent** — Bibb still carries the Macon Telegraph's Tuesday schedule. |

These shared-organ disagreements are as valuable as any web source: at most one row in each group can be right, and they need no external data to flag.

### Other oddities found inside Georgia.csv

Detected by parsing every row and re-deriving the day arithmetic:

1. **LONG** — "wednesday Week prior @ 5:00 (**9 days prior**)". Publication day is Monday; Wednesday of the prior week is **5 days** before a Monday (12 if two weeks back). 9 is not reachable. Both the normal and late deadline carry the error.
2. **UPSON** — "friday Week prior @ 10:00 (**8 days prior**)". Publication Thursday; the preceding Friday is **6 days** prior (13 if two weeks back). Both deadlines carry the error.
3. **DOUGLAS (late)** — "friday Week prior @ 12:00 (**5 days prior**)". Publication Tuesday; Friday is **4 days** prior. Off by one.
4. **WILKINSON (late)** — "tuesday Week prior @ 12:00" is **missing the `(N days prior …)` parenthetical** that every other row has, so a parser keying on that pattern will fail or silently skip. Worse, Tuesday of the week prior is *9 days* before the Thursday publication, i.e. **earlier than the normal 7-day deadline** — a "late" deadline that is stricter than the standard one is almost certainly a data-entry error.
5. **FULTON (late)** — "monday Week of @ 5:00 (**3 days prior @ 12pm**)": the prose says 5:00 and the parenthetical says 12 pm. Internally contradictory; one is wrong.
6. **CHATHAM (late)** — "(2 days prior**@** 12pm)" is missing the space before `@` that every other row has. Cosmetic, but a brittle regex will miss it.
7. The header's third column is `Deadline Description ` with a **trailing space**.
8. Georgia CSV county names are upper-case and include `BEN HILL`, `JEFF DAVIS`, `MCDUFFIE`, `MCINTOSH` — check the tool's normalisation matches the GPA spellings ("McDuffie", "McIntosh").
9. 139 of the 159 rows have **identical normal and late deadlines**, which makes the "late" column meaningless for those counties. Only ~20 counties have a genuinely distinct late deadline, and in Cobb's case the CSV's *late* value is the one the newspaper actually publishes.

---

## South Carolina

CSV columns are `County | Publication Day(s) | Deadline` (no header, no late-deadline column). South Carolina has no statutory "legal organ": notices run in "a newspaper of general circulation in the county", so the newspaper behind each row is an inference, not a designation. Where the newspaper is obvious it is named in Notes.

| County | CSV publication day | Verified publication day | CSV deadline | Verified deadline | Status | Source | Notes |
|---|---|---|---|---|---|---|---|
| Richland | Daily | **Wed / Fri / Sun only**, since April 2024 | 2 days prior @ 1 pm | not found | **Mismatch** | Editor & Publisher; The State | Row almost certainly refers to *The State* (Columbia). "Daily" is no longer true and any arithmetic assuming a daily paper will produce impossible dates. |
| Saluda | Daily | **not verifiable as daily** | 2 days prior @ 1 pm | not found | **Mismatch** | Editor & Publisher; SCPA newspaper list | Row is a byte-for-byte duplicate of Richland, implying it also uses *The State* — same "Daily" problem. Saluda's own paper (Saluda Standard-Sentinel) is a weekly. Needs a decision about which paper the tool means. |
| York | Daily | **Wed / Fri / Sun only**, since July 2024 | 3 days prior @ 2 pm | not found | **Mismatch** | Wikipedia — The Herald (Rock Hill) | Row refers to *The Herald* (Rock Hill). Also note the county name in the CSV is `"York "` with a **trailing space**. |
| Horry | Daily | **Twice weekly** since June 2024 (*The Sun News*) | 3 days prior @ 4 pm | not found | **Unverified / likely stale** | Wikipedia — The Sun News | If the row means *The Sun News*, "Daily" is stale. If it means the weekly *Horry Independent* (Conway), the whole row is wrong. Horry Independent legals contact: 843-488-7251. Ambiguity needs resolving before changing anything. |
| Charleston | Daily | not confirmed | Tue–Fri: 2 days prior @ 12 pm / Sat–Mon: Thursday @ 4 pm | not found | **Unverified** | postandcourier.com legal notices | *The Post and Courier* still publishes legal notices (notices dated 2026-09-13 seen on the site) and still prints daily, so the row is plausible. No deadline is published online; submissions by email/fax (legals@postandcourier.com, fax 843-937-5473). |
| Dorchester | Daily | not confirmed | identical to Charleston | not found | **Unverified** | postandcourier.com | Row is a duplicate of Charleston, consistent with both counties using the Post and Courier. |
| Lexington | Thursday | **Thursday** | 6 days prior @ 5 pm | not found | **Match** (publication day only) | Lexington County Chronicle | The *Lexington County Chronicle* publishes each Thursday. Deadline Unverified (site returns 403); legals@lexingtonchronicle.com, 803-359-7633 / 803-774-1200. |
| Greenville | Friday | not confirmed | 8 days prior @ 10 am | not found | **Unverified** | greenvillejournal.com/legalnotices | *Greenville Journal* is the county's public-notice paper and is a Friday weekly, but the site no longer publishes a deadline: notices are now submitted through **Column** (greenvillejournal.column.us), where the submitter picks publication dates and the system enforces the cut-off. The 2022 "8 days prior @ 10 am" may predate the Column migration. legals@communityjournals.com, 864-679-1221. |
| Spartanburg | Thursday | not confirmed | 3 days prior @ 12 pm | not found | **Unverified** | spartanweeklyonline.com | *Spartan Weekly News* describes itself as Spartanburg County's public-notice paper of choice; no publication day or deadline is stated online. 864-574-1360. |
| Aiken | Daily | not confirmed | 3 days prior @ 4 pm | not found | **Unverified** | SCPA newspaper list | *Aiken Standard* is still listed as a daily by the SCPA, so the row is plausible, but no deadline is published. |
| Greenwood | Daily | not confirmed | 3 days prior @ 5 pm | not found | **Unverified** | SCPA newspaper list | *Index-Journal* still listed as a daily. Deadline unpublished. |

### Oddities found inside South Carolina.csv

1. `York ` has a **trailing space** in the county name — will break exact-match lookups.
2. **Richland and Saluda rows are identical** ("Daily | 2 days prior @ 1 pm"), as are **Charleston and Dorchester**. The latter pair is explicable (same newspaper); the former is not obviously so.
3. Time formatting is inconsistent across rows: `5pm`, `12 pm`, `12pm`, `11 am`, `4 pm`. A parser must tolerate both.
4. Two rows encode **conditional logic in free text** — Charleston/Dorchester ("Tuesday-Friday: … / Saturday-Monday: Thursday @ 4 pm") and Darlington ("Wednesday: 5 days prior @ 5 pm / Friday: 3 days prior @ 5 pm"). Everything else is a single rule. Confirm the tool actually implements these branches.
5. Six counties are listed as "Daily" (Aiken, Charleston, Dorchester, Greenwood, Horry, Richland, Saluda — seven, in fact). Given the 2024 print cuts at McClatchy, **every "Daily" row should be re-checked**, and the tool's date arithmetic should not assume publication is possible on any calendar day.
6. Oconee lists five publication days (Tue, Wed, Thu, Fri, Sat) with a single "1 day prior @ 12 pm" rule — plausible for a near-daily, but unverified.
7. There is no "late deadline" concept in the SC file at all, unlike Georgia. If the UI offers a late option for both states, SC will silently fall back to the normal deadline.

---

## Recommended data changes

Changes I am confident about, with sources. Nothing below has been applied — the CSVs are unmodified.

**Confident, source-backed:**

1. **FULTON (GA)** — the row is based on a newspaper that is no longer the legal organ. Fulton's legal organ has been the **South Fulton Neighbor / Neighbor newspapers** since **2024-01-01** (previously the Fulton County Daily Report, now digital-only). *Source: [Fulton County, Jan 2024](https://www.fultoncountyga.gov/news/2024/01/08/happening-in-fulton-new-legal-organ), [Fulton County, Dec 2023](https://www.fultoncountyga.gov/news/2023/12/22/announcement-of-change-in-fulton-county-legal-organ-for-public-notices), [GPA 2026 list](https://gapress.org/wp-content/uploads/2026/02/LegalOrganList.pdf).* Recommended action: **mark the row unusable** in the tool until the Neighbor's publication day and deadline are obtained by phone (470-990-4415). Do not guess.
2. **BIBB (GA)** — legal organ changed from The Macon Telegraph to **The Macon Reporter** effective **2026-01-01**. *Source: [GPA 2026 list](https://gapress.org/wp-content/uploads/2026/02/LegalOrganList.pdf) (shows Bibb's organ as "Monroe County/Macon Reporter, Forsyth"), [The Macon Melody](https://maconmelody.com/bibb-county-designates-macon-reporter-as-legal-organ/), [mymcr.net](https://www.mymcr.net/free/reporter-named-bibb-county-legal-organ/article_ed6620c1-f3a0-4bc5-bf74-f4e8a8f54829.html).* Recommended change: publication day `Tuesday` → `Wednesday`, deadline → `friday Week prior @ 12:00 (5 days prior @ 12pm)`, i.e. copy the MONROE row. Confirm with the paper (478-994-2358) first, since the Macon edition may run a different deadline from the Monroe edition.
3. **FORSYTH (GA) deadline** — `thursday Week prior @ 12:00 (6 days prior @ 12pm)` → **`friday Week prior @ 12:00 (5 days prior @ 12pm)`**. *Source: [Forsyth County News](https://www.forsythnews.com/connect/forsyth-county-news-connect-contact-about/) — "the deadline for placing public notice (legal) advertising in Forsyth County News' public notice section is noon Friday."* Note this makes the deadline **later** than the CSV, so the current data is merely conservative, not dangerous.
4. **COBB (GA) late deadline** — the newspaper's own published deadline is **Tuesday noon for Friday publication**, which is exactly the CSV's *late* value. *Source: [MDJ contact](https://www.mdjonline.com/site/contact.html).* Recommended change: treat `tuesday Week of @ 12:00 (3 days prior @ 12pm)` as the **normal** deadline; keep the 7-day value only if the tool deliberately builds in a safety margin, and document it as such.
5. **MUSCOGEE (GA) publication day** — `Tuesday` is no longer attainable; the Ledger-Enquirer has printed only **Wednesday and Sunday** since **2024-08-19**. *Source: [Wikipedia — Ledger-Enquirer](https://en.wikipedia.org/wiki/Ledger-Enquirer).* Recommended action: change to `Wednesday` after confirming with the paper's legal desk (706-324-5526) which of the two days carries legals.
6. **RICHLAND / SALUDA (SC) publication day** — `Daily` → **`Wednesday, Friday, Sunday`**. *Source: [Editor & Publisher](https://www.editorandpublisher.com/stories/the-state-in-columbia-south-carolina-reduces-print-emphasizes-digital,248271) — The State moved to Wed/Fri/Sun print in April 2024.* Confirm first that both rows really do mean *The State*.
7. **YORK (SC) publication day** — `Daily` → **`Wednesday, Friday, Sunday`**. *Source: [Wikipedia — The Herald (Rock Hill)](https://en.wikipedia.org/wiki/The_Herald_(Rock_Hill)) — three print days from July 2024.* Also strip the trailing space from the county name `"York "`.
8. **HORRY (SC) publication day** — `Daily` is stale if the row means *The Sun News* (twice weekly since June 2024). *Source: [Wikipedia — The Sun News](https://en.wikipedia.org/wiki/The_Sun_News).* Resolve which paper the tool intends before editing.

**Confident, no web source needed (internal arithmetic errors):**

9. **LONG (GA)** — "9 days prior" is impossible for a Wednesday deadline against a Monday publication day; the correct figure is 5 (or 12). Both the normal and late deadline are affected. Either the day count or the publication day is wrong; a phone call to the Journal Sentinel (Reidsville) settles it — and note Tattnall, served by the *same* paper, is recorded as Thursday publication.
10. **UPSON (GA)** — "8 days prior" is impossible for a Friday deadline against a Thursday publication day; the correct figure is 6 (or 13). Both deadlines affected.
11. **DOUGLAS (GA) late deadline** — "5 days prior" should be **4** (Friday → Tuesday).
12. **WILKINSON (GA) late deadline** — supply the missing `(N days prior @ time)` parenthetical, and re-check the value: as written the "late" deadline (Tuesday of the prior week, 9 days) is *earlier* than the normal one (7 days), which is backwards.
13. **FULTON (GA) late deadline** — resolve the `@ 5:00` vs `(… @ 12pm)` contradiction (moot if the row is rebuilt for the new legal organ).
14. **CHATHAM (GA) late deadline** — insert the missing space in `prior@ 12pm` for parser consistency.
15. **Clay / Quitman / Randolph (GA)** — all three are served by the Cuthbert Southern Tribune yet carry three different schedules. At most one is correct; harmonise after one phone call.
16. **Schley / Stewart / Webster (GA)** — all served by the Stewart Webster Journal Patriot-Citizen; Schley's Wednesday contradicts the other two (Thursday).
17. **Crisp / Wilcox (GA)** — both served by The Cordele Dispatch; deadline times differ (11:00 am vs 3:30 pm).
18. **Long / Tattnall (GA)** — both served by The Journal Sentinel (Reidsville); publication days differ (Monday vs Thursday). Overlaps with item 9.

**Explicitly NOT recommended:** changing DEKALB. The published deadline text ("12:00 noon, one week prior to subsequent Thursday publishing date") is genuinely ambiguous between Wednesday-8-days (the CSV) and Thursday-7-days, and a second source says Wednesday 5 pm. Leave as-is and verify by phone.

---

## Unverifiable

**Georgia — 139 counties not individually examined.** The GPA list confirms the newspaper for each, but no central source publishes their legal-notice publication days or submission deadlines. To verify, a human should:

- Work from the [GPA 2026 legal organ list](https://gapress.org/wp-content/uploads/2026/02/LegalOrganList.pdf) (the newspaper names are authoritative as of Feb 2026) and phone each paper's legal/classified desk, asking two questions: *"Which day does the legal section run?"* and *"What is the cut-off day and time to get into that section?"* — plus *"is there a late/rush deadline and a late fee?"*, since the CSV's two-column design assumes one exists.
- Prioritise the ~20 counties where the normal and late deadlines differ (those are where the tool's two-column logic actually does something), and the four shared-organ conflict groups listed above, where one call resolves two or three rows at once.
- Check the **Probate Court** website for each county first. Chatham's probate court publishes a month-by-month schedule of run dates and "notice to newspaper by" deadlines, which verified that county completely in one fetch. Any other county publishing a similar schedule can be verified without a phone call.
- Re-check every county whose organ is a former daily (Richmond, Columbia, Clarke, Chatham, Dougherty, Floyd, Lowndes, Whitfield, Spalding, Troup, Glynn, Laurens, Baldwin, Hall, Muscogee, Bibb, Cobb, Gwinnett, Clayton, Henry, Rockdale, Newton). Print-frequency cuts across Gannett, McClatchy and Times-Journal titles between 2022 and 2025 are exactly the kind of change that invalidates a single "publication day".

**South Carolina — all 46 rows, effectively.** Only Lexington's publication day was independently confirmed, and **no** SC submission deadline could be sourced. To verify, a human should:

- First decide, per county, **which newspaper each row is supposed to represent** — the CSV does not record this and SC has no legal-organ designation, so the data cannot be audited without it. Reconstructing that mapping is the single most valuable next step for the SC file.
- Use the [S.C. Media Directory](https://scpress.org/s-c-media-directory/) (published annually by the SCPA, by county, for purchase) — it is the closest thing to an authoritative county→newspaper list and includes contact details.
- Use [scpublicnotices.com](https://www.scpublicnotices.com/) to see which paper is actually running notices for a given county right now: filter by county and read the publication names off recent notices. This is a good cheap proxy for "which paper does this county use".
- Note that several SC papers have moved legal-notice intake to **Column** (greenvillejournal.column.us and others). Where that is the case the newspaper may no longer quote a fixed clock deadline at all, and the tool's model of "submit by X to publish on Y" may need a per-county exception.
- Phone the remainder. Known numbers gathered here: Horry Independent 843-488-7251; Spartan Weekly 864-574-1360; Greenville Journal 864-679-1221; Lexington County Chronicle 803-774-1200; Post and Courier legals legals@postandcourier.com / fax 843-937-5473.

**Blocked sources a human browser could still reach** (all returned 403/429/451 to automated fetching on 2026-09-15): mdjonline.com, gwinnettdailypost.com, rockdalecitizen.com, forsythnews.com, fultonneighbor.com, tribuneledgernews.com, lexingtonchronicle.com, maconmelody.com, mymcr.net, and the per-county pages at pubswift.com. Several of these do publish their deadlines on-page; opening them in a normal browser would likely verify another handful of counties without any phone calls.

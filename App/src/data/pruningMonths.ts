/**
 * Pruning months, by place, for "Help me with [rose name]" (APP-HELP-ME-WITH-ROSE
 * proposal, approved by a Founder in chat, 18 October 2026, section 3D).
 *
 * The timing record PKR-CGD-000022 is written as sentences, so the app keeps this
 * small table of the months each main-pruning statement names. The rule: a rose's
 * pruning months are every month named here for a statement shown where it grows,
 * joined together. A region or town can widen its country's months but never narrow
 * them. This only decides whether Pip suggests the pruning journey; the journey's own
 * dormancy check (PKR-SGT-000001) still decides on the actual rose.
 *
 * Each entry names its statement by how it starts. At run time the entry counts only
 * if that statement is still Published and shown for the rose's place, so a changed
 * record can make Pip suggest the journey less, never more.
 *
 * Reading the statements: a named month counts whole ("mid-April" counts April). A
 * season word counts the matching calendar months for that hemisphere ("late winter
 * or early spring" in Christchurch: August and September; "spring" in Minnesota:
 * March to May). Autumn trims and cut-backs against wind aren't the main pruning and
 * aren't counted (UK autumn trims; Nashville, South Carolina and Colorado cut-backs;
 * San Antonio's October pruning, which its source says is the lighter of two).
 * Statements that name no month or season add nothing.
 */
export interface PruningMonthsEntry {
  /** The opening words of the PKR-CGD-000022 statement. */
  starts: string
  /** Calendar months, 1 = January. */
  months: number[]
}

export const PRUNING_MONTHS_PKR = 'PKR-CGD-000022'

export const PRUNING_MONTHS: PruningMonthsEntry[] = [
  // New Zealand
  { starts: 'In New Zealand, the main winter pruning is done between June and August', months: [6, 7, 8] },
  { starts: 'Up north, one source says pruning starts around early July', months: [6, 7] },
  { starts: 'In the colder parts of the South Island, pruning gets under way in August', months: [7, 8] },
  { starts: 'In Northland, one garden company says the end of July to early August', months: [7, 8] },
  { starts: 'In Auckland, one garden service says to prune in July', months: [6, 7, 8] },
  { starts: 'In Whanganui, one garden centre manager says', months: [7] },
  { starts: 'In Masterton, one garden company says to prune in July to August', months: [7, 8] },
  { starts: 'In Canterbury, one source says pruning can begin towards the end of July', months: [7, 8, 9] },
  { starts: 'In Christchurch, one garden company says to leave pruning until late winter or early spring', months: [8, 9] },
  { starts: 'In Dunedin, one source prunes its modern roses in late July', months: [6, 7, 8] },
  { starts: 'Two garden companies differ on a rose that still has its leaves or flowers in June', months: [6, 7] },
  // Australia
  { starts: 'In most areas, the main winter pruning is done in July', months: [6, 7] },
  { starts: 'In a cold or frosty area, wait until August to prune', months: [8] },
  { starts: 'In New South Wales, one rose society says to prune in July near the coast', months: [6, 7, 8] },
  { starts: 'In Victoria, one rose society says the best time to prune is June or July', months: [6, 7, 8] },
  { starts: 'In South Australia, prune in July', months: [6, 7] },
  { starts: 'For a frost area in South Australia', months: [7, 8] },
  { starts: 'In Western Australia, one rose society says to prune in winter, in June and July', months: [6, 7] },
  { starts: 'In Brisbane, one public rose garden says the best time to prune is June or July', months: [6, 7] },
  // United Kingdom
  { starts: 'In the UK, the main pruning is done in late winter or early spring', months: [11, 12, 1, 2, 3] },
  { starts: 'In the south of the UK, do the main pruning around mid-February', months: [2, 3] },
  // United States
  { starts: 'In the United States, the main pruning is done between December and mid-April', months: [12, 1, 2, 3, 4] },
  { starts: 'In Iowa, one extension service says early spring is the best time to prune', months: [3, 4] },
  { starts: 'In Minnesota, do the main pruning in spring', months: [3, 4, 5] },
  { starts: 'In Wisconsin, one rose expert says to prune in spring', months: [3, 4, 5] },
  { starts: 'In Illinois, one extension service says most pruning is done in spring', months: [3, 4, 5] },
  { starts: 'In Nashville, one rose society says to prune by the end of March', months: [3, 4] },
  { starts: 'In Georgia, one extension service says to prune roses in late winter', months: [2] },
  { starts: 'In Cobb County, one county extension guide says to prune roses', months: [2, 3] },
  { starts: 'In South Carolina, one extension service says to do the main pruning in spring', months: [2, 3, 4] },
  { starts: 'In Arkansas, one extension service says most roses should be pruned in late February', months: [2] },
  { starts: 'In Florida, one extension service says to prune roses in February or March', months: [12, 2, 3] },
  { starts: 'In Colorado, one extension service says to cut tall roses back', months: [4] },
  { starts: "Along Utah's Wasatch Front", months: [3] },
  { starts: "In Oregon's Willamette Valley, one extension service says to prune", months: [2, 3] },
  { starts: 'In Pima County, one extension service says to start pruning', months: [1, 2] },
  { starts: 'In Marin County, one rose society says to begin pruning', months: [12, 1, 2] },
  { starts: 'In Orange County, California, one rose society says to prune in January', months: [1, 2] },
  { starts: 'In Contra Costa County, one extension source says the best time for the main hard pruning', months: [1, 2] },
  { starts: 'In San Antonio, one extension source says roses are usually pruned twice a year', months: [2] },
  // Canada
  { starts: 'In Canada, one rose society says the main pruning is usually done in April', months: [4] },
  { starts: 'In Toronto, one Master Gardener group says the main pruning is usually in April or May', months: [4, 5] },
  { starts: 'On the coast of British Columbia, the main pruning is done in late winter', months: [2, 3] },
  { starts: 'In the Okanagan, one garden company says not to prune in fall', months: [3] },
]

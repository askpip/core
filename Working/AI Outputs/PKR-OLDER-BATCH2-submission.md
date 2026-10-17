# PKR Submission Package — Older Answers Check, Batch 2: Damaged Growth, Weak Growth and the Main Framework (v1.0, Published)

**Published 17 October 2026.** A Founder approved these answers in chat on 17 October 2026 ("approve"), with no change. Built by KIT on 17 October 2026 under the Pip Knowledge Rules v0.5, after the Build Check (ROC Operations Manual Ch. 14). What a Founder reads is `Working/Founder Review/PKR-OLDER-BATCH2-PRUNING-JOURNEY-MIDDLE-CHECKS_Pips_Answers.md`.

**At approval:** each record below got a new version: PKR-OBS-000004 1.1, PKR-DEC-000004 1.2, PKR-OBS-000005 1.1, PKR-DEC-000005 1.2, PKR-OBS-000006 1.2, PKR-DEC-000006 1.2; the versions before them are retired. Their internal notes (`common.preserved_uncertainty`, not shown to gardeners) were brought into line with the corrections. PKR-CGD-000003 is not changed here; it moves to batch 3 with the hard-pruning research. App change: `App/src/components/PkrStatements.tsx` StatementList shows each statement's tag (precaution, disagreement) and its limit, as in the common-question answers.

The corrections to the three approved research records (ROC OM §14.4) are listed in section 3 of Pip's Answers and were made at approval, as a Build Check Corrections section in each ARC (DAMAGEDGROWTH 1.2, WEAKCONGESTED 1.3, PRUNINGFRAMEWORK 1.2); the full list is `corrections_adopted` in `Build_Check_OLDER-BATCH2_statements_v0.1_2026-10-17.json`.

## Records as they will be

### PKR-DEC-000004 (was v1.1)

```json
{
  "choices": [
    {
      "choice": "cut",
      "label": "Cut",
      "cutKind": "remove-stem"
    },
    {
      "choice": "leave",
      "label": "Leave"
    },
    {
      "choice": "decide-later",
      "label": "Decide later"
    },
    {
      "choice": "get-help",
      "label": "Get experienced local help"
    }
  ],
  "decision_notes": [
    {
      "text": "Cut the damaged cane back until you reach healthy wood, where the pith is white. If the pith is brown or grey, keep cutting a little further down.",
      "confidence": "High"
    },
    {
      "text": "If no live buds remain on the cane, remove it whole at its base. Otherwise cut back only as far as healthy wood.",
      "confidence": "Moderate"
    },
    {
      "text": "If it looks like canker or disease: cut well below the patch (one source says at least 2–3 inches, about 5–8 cm). Disinfect your blades after cutting diseased wood; sources range from after each diseased plant to between every cut. Bin the prunings, or burn them where local rules allow.",
      "confidence": "Moderate"
    },
    {
      "text": "If it looks like borer damage: cut below the damaged part, a little at a time, until the pith is white.",
      "confidence": "Moderate"
    },
    {
      "text": "Sources disagree on sealing the fresh cut after removing borer damage: some say to seal it with waterproof glue, while another says pruning cuts made just above a node (where a leaf or bud joins the cane) heal over on their own.",
      "kind": "disagreement"
    },
    {
      "text": "Frost or winter damage often doesn't show its full extent straight away. It's best to wait until spring, before new growth starts, to see what survived, so \"Decide later\" is the recommended choice for a frost-damaged cane. When you come back, I'll help you remove it even if the rose is growing.",
      "confidence": "Moderate"
    },
    {
      "text": "Leave: confirmed damage should be cut back to healthy wood, so leaving it is not recommended.",
      "confidence": "High"
    }
  ],
  "doesnt_match_choices": null,
  "doesnt_match_notes": null,
  "not_sure_choices": [
    {
      "choice": "decide-later",
      "label": "Decide later"
    },
    {
      "choice": "get-help",
      "label": "Get experienced local help"
    }
  ],
  "headline_confidence": "High",
  "gate_conditions": {
    "PKR-SGT-000001": "removal_allowed_after_bud_break",
    "PKR-SGT-000002": "applies",
    "PKR-SGT-000003": "applies"
  },
  "cut_care_guidance": true
}
```

### PKR-DEC-000005 (was v1.1)

```json
{
  "choices": [
    {
      "choice": "cut",
      "label": "Cut",
      "cutKind": "remove-stem"
    },
    {
      "choice": "leave",
      "label": "Leave"
    },
    {
      "choice": "decide-later",
      "label": "Decide later"
    },
    {
      "choice": "get-help",
      "label": "Get experienced local help"
    }
  ],
  "decision_notes": [
    {
      "text": "Weak cane: remove it completely, at its base or where it starts. Don't shorten it.",
      "confidence": "Moderate"
    },
    {
      "text": "Crowded bush: cut out some canes completely rather than shortening them. Keep the stronger canes, evenly spaced around the plant, so the centre stays open. One rose society says not to worry about cutting out the centre.",
      "confidence": "Moderate"
    },
    {
      "text": "Keep roughly 3 to 7 strong canes.",
      "confidence": "Moderate"
    },
    {
      "text": "If the plant already looks weak or small, take out less.",
      "confidence": "Low",
      "kind": "precaution"
    },
    {
      "text": "One source says that in hot-summer areas it helps to leave some growth in the middle to shade the graft (the swollen join near the base) and prevent sunscald (sun damage to the bark).",
      "confidence": "Low",
      "kind": "precaution"
    },
    {
      "text": "Reaching inside the bush, wear eye protection and long-cuffed gloves.",
      "confidence": "Moderate",
      "kind": "precaution"
    }
  ],
  "doesnt_match_choices": null,
  "doesnt_match_notes": null,
  "not_sure_choices": [
    {
      "choice": "decide-later",
      "label": "Decide later"
    },
    {
      "choice": "get-help",
      "label": "Get experienced local help"
    }
  ],
  "headline_confidence": "Moderate",
  "gate_conditions": {
    "PKR-SGT-000001": "applies",
    "PKR-SGT-000002": "applies",
    "PKR-SGT-000003": "applies"
  },
  "cut_care_guidance": true
}
```

### PKR-DEC-000006 (was v1.1)

```json
{
  "choices": [
    {
      "choice": "cut",
      "label": "Keep it, and shorten it",
      "cutKind": "shorten"
    },
    {
      "choice": "leave",
      "label": "Keep it as it is"
    },
    {
      "choice": "decide-later",
      "label": "Decide later"
    },
    {
      "choice": "get-help",
      "label": "Get experienced local help"
    }
  ],
  "decision_notes": [
    {
      "text": "Keep the strong, healthy canes spread around the base, aiming for an open centre. One rose society says not to worry about cutting out the centre.",
      "confidence": "High"
    },
    {
      "text": "Keep roughly 3 to 7 strong canes.",
      "confidence": "Moderate"
    },
    {
      "text": "Shorten kept canes by about a third to a half; one source says half to two-thirds. Hybrid Teas are cut lower, or to fewer canes, than Floribundas. Grandifloras are pruned much like Hybrid Teas.",
      "confidence": "Moderate"
    }
  ],
  "doesnt_match_choices": [
    {
      "choice": "cut",
      "label": "Remove this old cane at its base",
      "cutKind": "remove-stem"
    },
    {
      "choice": "leave",
      "label": "Leave"
    },
    {
      "choice": "decide-later",
      "label": "Decide later"
    },
    {
      "choice": "get-help",
      "label": "Get experienced local help"
    }
  ],
  "doesnt_match_notes": [
    {
      "text": "Remove old, woody or unproductive canes at their base, in favour of younger ones.",
      "confidence": "Moderate"
    }
  ],
  "not_sure_choices": [
    {
      "choice": "leave",
      "label": "Keep it for now and reassess next pruning"
    },
    {
      "choice": "decide-later",
      "label": "Decide later"
    },
    {
      "choice": "get-help",
      "label": "Get experienced local help"
    }
  ],
  "headline_confidence": "High",
  "gate_conditions": {
    "PKR-SGT-000001": "applies",
    "PKR-SGT-000002": "applies",
    "PKR-SGT-000003": "applies"
  },
  "cut_care_guidance": true
}
```

### PKR-OBS-000004 (was v1.0)

```json
{
  "key": "damaged-growth",
  "feature": "Damaged growth",
  "journey_order": 2,
  "look_for": "Now let's look for damaged growth — canes that are injured or diseased.",
  "criteria": [
    {
      "text": "Canker: brown to purplish sunken patches with cracking edges, tiny black dots, or dieback above a patch that rings the cane.",
      "confidence": "High"
    },
    {
      "text": "Frost or winter injury: browned shoot tips and discoloured canes. Cutting into a cane shows the pith (its centre), and the pith's colour tells living wood from dead.",
      "confidence": "Moderate"
    },
    {
      "text": "Physical damage: a broken cane, or damage where canes rub together.",
      "confidence": "Moderate"
    },
    {
      "text": "Borer (an insect that tunnels into canes): a new shoot tip that suddenly wilts, or a swollen spot on the cane.",
      "confidence": "Moderate",
      "limit": "A wilting tip can have other causes."
    },
    {
      "text": "Not damage: mossy or spiny galls on canes are generally harmless.",
      "confidence": "Moderate",
      "limit": "One source says a heavy infestation of mossy gall can weaken the plant above it."
    }
  ],
  "photo_limit": "A photo can show outside signs, but not what's happening inside the cane.",
  "confirm_question": "Find that cane on your rose. Can you see damage like this?",
  "confirm_label": "Yes, I can see damage",
  "doesnt_match_label": "No — it's not damaged",
  "doesnt_match_route": "none",
  "doesnt_match_note": null,
  "not_sure_guidance": "Look closely at that spot on the plant itself, not at a photo.",
  "any_more_question": "Can you see any more damaged stems?",
  "comparison_images": []
}
```

### PKR-OBS-000005 (was v1.0)

```json
{
  "key": "weak-congested",
  "feature": "Weak or congested growth",
  "journey_order": 5,
  "look_for": "Let's look for weak canes — thinner than a pencil — and at whether the middle of the bush is crowded.",
  "criteria": [
    {
      "text": "A cane thinner than about a pencil may be weak.",
      "confidence": "Moderate"
    },
    {
      "text": "Crowded: the bush is densely packed rather than open in the middle.",
      "confidence": "Moderate"
    }
  ],
  "photo_limit": "Thickness is hard to judge from a photo unless something of known size, such as a coin or pencil, is beside the cane. One angle can miss crowding at the back of the bush.",
  "confirm_question": "Check the cane against a pencil, and look at the middle of the bush from more than one side. Is it weak, or is the bush crowded?",
  "confirm_label": "Yes, weak or crowded",
  "doesnt_match_label": "No",
  "doesnt_match_route": "none",
  "doesnt_match_note": null,
  "not_sure_guidance": "Take a photo with a coin or pencil beside the cane, or look at the middle from another side, then check again.",
  "any_more_question": "Can you see any more weak canes?",
  "comparison_images": []
}
```

### PKR-OBS-000006 (was v1.1)

```json
{
  "key": "framework",
  "feature": "The main framework to retain",
  "journey_order": 7,
  "look_for": "Finally, let's choose the framework to keep: the strong canes spread around the base that will form the shape of your rose.",
  "criteria": [
    {
      "text": "Keeper canes: strong, healthy, vigorous canes.",
      "confidence": "High"
    },
    {
      "text": "Target shape: an open centre, with kept canes spread evenly around the base, like a vase or the spokes of a wheel.",
      "confidence": "High"
    },
    {
      "text": "Old wood: the bark is usually grey.",
      "confidence": "Moderate"
    },
    {
      "text": "Keep your rose's own new canes from the base.",
      "confidence": "High"
    },
    {
      "text": "On a grafted rose, a shoot that starts below the bud union (the swollen join near the base) is a sucker from the rootstock, not a new cane.",
      "confidence": "High"
    }
  ],
  "photo_limit": "A photo can show the outline, but not how vigorous a cane really is, the inside of the cane, or the base close up. Check those by hand.",
  "confirm_question": "Check this cane on your rose, down to the base. Is it a strong framework cane?",
  "confirm_label": "Yes, it's a strong cane",
  "doesnt_match_label": "No — it's old, grey or unproductive",
  "doesnt_match_route": "decide",
  "doesnt_match_note": null,
  "not_sure_guidance": "Look closely at the cane and where it starts at the base.",
  "any_more_question": "Are there any more canes to check?",
  "comparison_images": []
}
```

## Check results

- Sources: `Build_Check_OLDER-BATCH2_sources_2026-10-17.json` (86 sources, 85 opened; 365 finding links: 122 yes, 211 partly, 32 no)
- Wording: `Build_Check_OLDER-BATCH2_statements_v0.1` to `v0.3_2026-10-17.json` (v0.1: 54 sentences, 21 fail; v0.2: 39, 2 fail; v0.3: 14, 0 fail; PKR-CGD-000003 excluded)
- Plain read: `Build_Check_OLDER-BATCH2_plain_read_2026-10-17.json` (13 flags; 10 acted on, 3 answered: the keeper-cane line is the check itself, the limit under the borer sign is kept as a limit, and the rose type is chosen earlier in the journey)

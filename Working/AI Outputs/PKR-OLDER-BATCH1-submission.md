# PKR Submission Package — Older Answers Check, Batch 1: the First Checks in the Pruning Journey (draft v0.4)

**Draft, for a Founder's approval.** Built by KIT on 17 October 2026 under the Pip Knowledge Rules v0.5, after the Build Check (ROC Operations Manual Ch. 14). What a Founder reads is `Working/Founder Review/PKR-OLDER-BATCH1-PRUNING-JOURNEY-FIRST-CHECKS_Pips_Answers.md`.

**On approval:** each record below gets a new version (minor version +1), and its current version is retired. PKR-OBS-000003 and PKR-DEC-000003 (inward-growing stems) are retired without a successor; the outward-facing-bud cut moves to PKR-DEC-000002. The app change for PKR-SGT-000002 (no fallback signals: an unknown planting date gets the dead-wood-only check) is in `App/src/lib/suitabilityGates.ts`.

The corrections to the six approved research records (ROC OM §14.4) are listed in section 3 of Pip's Answers and are made on approval.

## Records as they will be

### PKR-DEC-000001 (now v1.1)

```json
{
  "choices": [
    {
      "choice": "cut",
      "label": "Cut",
      "cutKind": "dead-wood"
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
      "text": "Cut a dead cane back into living wood, where the pith is white, not just to where the dead part first shows. One source differs: it says to cut at the point of discoloration.",
      "confidence": "High"
    },
    {
      "text": "If the pith is still brown, keep cutting lower in small steps. One source says to remove the whole cane if no live buds remain on it.",
      "confidence": "Moderate"
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
    "PKR-SGT-000002": "exempt",
    "PKR-SGT-000003": "applies"
  },
  "cut_care_guidance": true
}
```

### PKR-DEC-000002 (now v1.0)

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
      "text": "Where two stems cross or rub, remove one of them as part of ordinary pruning.",
      "confidence": "High"
    },
    {
      "text": "Cut the stem you remove back to the bud union (the swollen join near the base) or to the larger cane it grows from, rather than just shortening it. One source also allows cutting it back to the next outward-facing bud.",
      "confidence": "Moderate"
    },
    {
      "text": "When you shorten a cane, cut just above a bud that faces outward, so the new shoot grows away from the centre of the bush.",
      "confidence": "Moderate"
    },
    {
      "text": "Why: stems rubbing together damage each other's canes, which lets disease in.",
      "confidence": "Moderate"
    },
    {
      "text": "Take care not to damage the stem you're keeping; cut a tangled stem out in sections rather than pulling it whole.",
      "confidence": "Approved default"
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
    "PKR-SGT-000001": "applies",
    "PKR-SGT-000002": "applies",
    "PKR-SGT-000003": "applies"
  },
  "cut_care_guidance": true
}
```

### PKR-DEC-000007 (now v1.0)

```json
{
  "choices": [
    {
      "choice": "cut",
      "label": "Remove the sucker where it starts",
      "cutKind": "sucker"
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
      "text": "Suckers draw strength from your rose and, left alone, can take it over.",
      "confidence": "High"
    },
    {
      "text": "Remove it early, while it's young — it's easier then.",
      "confidence": "High"
    },
    {
      "text": "Don't leave a confirmed sucker. It weakens your rose, so remove it.",
      "confidence": "High"
    }
  ],
  "doesnt_match_choices": null,
  "doesnt_match_notes": null,
  "not_sure_choices": [
    {
      "choice": "leave",
      "label": "Leave it"
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
    "PKR-SGT-000001": "removal_allowed_after_bud_break",
    "PKR-SGT-000002": "applies",
    "PKR-SGT-000003": "applies"
  },
  "cut_care_guidance": false,
  "removal_method": [
    {
      "text": "Uncover the point where the sucker starts, clearing soil if needed, and remove it right there. Don't just cut it off at soil level, because it can grow back.",
      "confidence": "High"
    },
    {
      "text": "Most sources say to grip the sucker as close to where it starts as you can and pull or tear it away, because tearing takes the dormant buds at its base with it and so makes regrowth less likely. Some sources disagree and cut it cleanly instead.",
      "kind": "disagreement"
    },
    {
      "text": "One source says to wear gloves and support the stem with one hand while you pull the sucker off. Another says to refill the soil afterwards and firm it gently around the base.",
      "confidence": "Low",
      "kind": "precaution"
    },
    {
      "text": "Take care around the base when weeding or digging. One source says damaging the roots may cause suckers.",
      "confidence": "Low",
      "kind": "precaution"
    }
  ]
}
```

### PKR-OBS-000001 (now v1.0)

```json
{
  "key": "dead-wood",
  "feature": "Dead versus living wood",
  "journey_order": 1,
  "look_for": "Let's look for dead wood. Dead canes are usually brown, black or shrivelled rather than green, and have no live buds.",
  "criteria": [
    {
      "text": "Bark colour: green suggests living; brown, black or shrivelled suggests dead. One source says living wood on older canes, or on roses with bronze stems, can look brown.",
      "confidence": "Moderate"
    },
    {
      "text": "Buds: plump, healthy buds suggest living wood; no live buds suggests dead.",
      "confidence": "Moderate"
    },
    {
      "text": "Sunken patches or lesions on a cane may be canker, a fungal disease that kills more of the cane as it spreads, rather than ordinary dead wood.",
      "confidence": "Low",
      "kind": "precaution"
    },
    {
      "text": "Cut into the cane and look at the pith (the centre): white is living, brown is dead.",
      "confidence": "High"
    }
  ],
  "photo_limit": "A photo can't show the pith inside the cane — check that on the plant.",
  "confirm_question": "Find that cane on your rose and look at it closely. Is it dead?",
  "confirm_label": "Yes, it looks dead",
  "doesnt_match_label": "No — it's living wood",
  "doesnt_match_route": "none",
  "doesnt_match_note": null,
  "not_sure_guidance": "Look again at the cane on the plant itself — its buds and its bark colour.",
  "any_more_question": "Can you see any more dead canes?",
  "comparison_images": []
}
```

### PKR-OBS-000002 (now v1.0)

```json
{
  "key": "crossing-stems",
  "feature": "Crossing or rubbing stems",
  "journey_order": 3,
  "look_for": "Next, let's look for stems that cross each other or rub together.",
  "criteria": [
    {
      "text": "A stem that crosses another, or rubs against it, is a candidate."
    },
    {
      "text": "Bark damage, wear or a flattened face where two stems touch: treat as rubbing.",
      "confidence": "Approved default"
    },
    {
      "text": "Stems close together with no contact or wear: treat as crossing, not rubbing.",
      "confidence": "Approved default"
    }
  ],
  "photo_limit": "One photo can't reliably show whether two stems actually touch. Look from several sides.",
  "confirm_question": "Follow both stems with your hands. Do they cross or touch?",
  "confirm_label": "Yes, they cross or rub",
  "doesnt_match_label": "No — they don't",
  "doesnt_match_route": "none",
  "doesnt_match_note": null,
  "not_sure_guidance": "Take another photo from a different angle, and look again from another side.",
  "any_more_question": "Can you see any more crossing or rubbing stems?",
  "comparison_images": []
}
```

### PKR-OBS-000007 (now v1.0)

```json
{
  "key": "rootstock-sucker",
  "feature": "Rootstock suckers",
  "journey_order": 6,
  "look_for": "Let's check for suckers. A sucker is a shoot from the rootstock your rose was grafted onto, below the bud union — the swollen join near the base. It isn't your rose's own new cane.",
  "criteria": [
    {
      "text": "Where the shoot starts is the deciding check: below the bud union is a sucker; at the union or just above it is usually your rose's own new cane, which you keep.",
      "confidence": "High",
      "limit": "One nursery says the rootstock can also send up shoots from its stem above the union."
    },
    {
      "text": "A sucker can start below the soil, sometimes a little away from the plant.",
      "confidence": "High"
    },
    {
      "text": "Planting depth varies, so the bud union may be above, at or below the soil.",
      "confidence": "Moderate"
    }
  ],
  "photo_limit": "A photo can't show where a shoot starts, especially under the soil. I never decide a shoot is a sucker from a photo.",
  "confirm_question": "Follow the shoot down with your fingers. Does it start below the bud union, or at or above it?",
  "confirm_label": "Below the bud union",
  "doesnt_match_label": "At or above the bud union",
  "doesnt_match_route": "none",
  "doesnt_match_note": "That is most likely your rose's own new cane. Keep it: new canes from the base are valuable. I'll look at it again when we check the main framework.",
  "not_sure_guidance": "That's alright. Suckers and a rose's own new shoots are easy to mix up. Look again at where the shoot starts, on the plant, not in a photo.",
  "any_more_question": "Can you see any more shoots like this coming from the base?",
  "comparison_images": [],
  "sucker_steps": {
    "hasShoot": "Is there a shoot coming from the base of your rose, or from the ground near it?",
    "unionVisible": "Can you see the bud union — the swollen join near the base where your rose was grafted?",
    "noUnion": "Then I won't call it a sucker. The union may just be buried. If you like, gently clear a little soil and look again — otherwise leave the shoot, and ask experienced local help if you're concerned.",
    "ownRoot": "If you know your rose grows on its own roots (it wasn't grafted), shoots from the base are the same rose, so they are not suckers in the usual sense.",
    "supporting": "In the growing season only, these can help you look, but never decide on their own: sucker leaves are often paler or smaller, or have a different number of leaflets (though counting seven leaflets isn't always a reliable test); sucker flowers often differ from your rose's; suckers are often unusually vigorous."
  }
}
```

### PKR-SGT-000001 (now v1.1)

```json
{
  "question": "Look closely at the buds along your rose's canes. Are they still tight and closed, or just beginning to swell? Or have leaves opened and new shoots started to grow?",
  "caveat": "In a mild winter, a rose may keep some of its leaves, so judge by the buds, not by whether the leaves have dropped. Warm spells can also start buds growing early.",
  "answers": {
    "dormant": "Still dormant — buds are tight and closed, or just beginning to swell; no new leaves have opened anywhere",
    "growing": "Active new growth is already well underway — leaves have opened and new shoots are clearly growing",
    "notSure": "Not sure"
  },
  "notSureFallback": "That's alright — have another look at the buds, not the leaves: are they still tight and closed, or have any started to swell or open?",
  "removalOnly": {
    "intro": {
      "text": "Your rose is already growing, so this is not the time for full pruning. Pruning hard now can cost you flowers. But you can still remove wood that is dead, damaged or diseased.",
      "confidence": "Moderate"
    },
    "notSureIntro": "Since we can't be sure your rose is still dormant, we'll leave full pruning for now — check back in a week or two. You can still remove wood that is dead, damaged or diseased today.",
    "conditions": [
      {
        "text": "Remove only the wood you've confirmed. Don't shorten or shape healthy canes today.",
        "confidence": "Moderate"
      },
      {
        "text": "Go gently and avoid damaging the new leaves and shoots.",
        "confidence": "Low"
      },
      {
        "text": "Cut back until the pith is white or pale green, exactly as at any other time.",
        "confidence": "Moderate"
      },
      {
        "text": "For anything that looks like canker or disease, the usual care applies: cut well below the affected part, clean your blades, and bin the prunings.",
        "confidence": "High"
      }
    ],
    "lateSeason": {
      "text": "Late in the season (advice only): sources advise against pruning late in the growing season, because it can encourage new growth that winter cold may damage. Diseased wood is the exception — remove it whenever you find it. Sources don't say whether dead (as distinct from diseased) wood is exempt.",
      "confidence": "High"
    }
  }
}
```

### PKR-SGT-000002 (now v1.0)

```json
{
  "question": "Was this rose planted this growing season, so that this is its first season in this spot?",
  "answers": {
    "established": "No, it has been growing here longer than that",
    "recent": "Yes, it was planted this growing season",
    "unknown": "I'm not sure"
  },
  "answer_confidence": "Moderate",
  "fallback_questions": [],
  "restricted_reason_recent": "Most sources leave a newly planted rose unpruned, apart from dead wood, until it has established; two prune at planting or in the first winter. So I'll only look at dead wood today.",
  "restricted_reason_fallback": "I can't tell whether this rose has established yet, so I'll only look at dead wood today.",
  "exempt_observations": [
    "PKR-OBS-000001"
  ]
}
```

## Check results

- Sources: `Build_Check_OLDER-BATCH1_sources_2026-10-16.json`
- Wording: `Build_Check_OLDER-BATCH1_statements_v0.1` to `v0.3_2026-10-16.json` (v0.1: 77 sentences, 22 fail; v0.2: 35, 4 fail; v0.3: 13, 0 fail)
- Plain read: `Build_Check_OLDER-BATCH1_plain_read_2026-10-16.json`

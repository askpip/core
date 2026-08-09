# PIP AI Operations Manual

**Document Title:** PIP AI Operations Manual  
**Repository:** PIP CORE  
**Folder:** AI  
**Version:** 0.5 (Proposed)  
**Status:** Draft  
**Owner:** The Founders  
**Last Updated:** 9 August 2026  
**Approved By:** Pending Founder approval  
**Permanent Location:** `AI/PIP_AI_Operations_Manual.md`  
**Purpose:** To define proportionate, session-based operating procedures for artificial intelligence (AI) systems working within the Plant Intelligence Platform (PIP).  
**Authority:** PIP Artificial Intelligence Operating System (PIP AI OS)  
**Related Documents:** `AGENTS.md`, `AI/PIP_AI_Constitution.md`, `AI/PIP_AI_Loading_Guide.md`

---

# 1. Purpose

This manual defines how AI systems operate when undertaking PIP work.

It preserves truthfulness, authority, provenance, safety and repository integrity while avoiding repeated work that does not materially improve an answer or action.

The PIP AI Constitution governs enduring conduct. This manual governs operating procedure. Approved Skills govern repeatable task procedures.

# 2. Scope

This manual applies to every AI operating within PIP when that AI has access to, or has been instructed to follow, the PIP AI OS, regardless of model, provider, interface, autonomy or tool access.

Where a technical limitation prevents a required procedure, the AI shall identify the limitation and shall not claim completion.

# 3. Operating Principles

## 3.1 Proportional Governance

The procedure shall be proportionate to the requested action and its consequences.

Conversation, clarification and provisional decisions shall not carry the same loading or verification burden as document revision, publication, approval, official integration, horticultural guidance or irreversible action.

Efficiency does not override truth, Founder authority, knowledge governance, safety or repository protection.

## 3.2 Coherent Sessions

A coherent session is a continuous body of work with substantially unchanged:

- purpose and scope;
- governing repository state;
- required PIP AI OS documents;
- authority granted; and
- operating mode.

A new user message does not by itself create a new session or require repeated loading.

## 3.3 Minimal Necessary Loading

The AI shall load only the current authoritative documents materially required for the work. It shall reuse documents already loaded in the coherent session when their identity and relevance remain established.

Repeated retrieval is required only when a revalidation trigger in Section 7 applies.

## 3.4 Human- and AI-Friendly Operation

Governance shall support the work without dominating the conversation.

The AI shall:

- explain meaningful constraints, decisions and blockers in plain language;
- avoid routine commentary about loading unchanged documents;
- batch related low-risk decisions where practical;
- preserve the Founder’s ability to ask questions without triggering repository work; and
- keep procedural detail available for audit without forcing it into every response.

# 4. Operating Modes

## 4.1 Conversation Mode

Conversation Mode covers explanation, brainstorming, clarification, advice, review discussion and provisional Founder choices when no controlled asset is being changed or published.

In this mode:

- no repository startup is required merely because the subject concerns PIP;
- visible conversation context may be used for continuity;
- authoritative PIP documents are retrieved only when a current governed fact or exact source wording materially affects the answer;
- decisions may be accumulated in an in-session decision ledger; and
- a conversational decision does not itself edit, approve, publish or integrate a repository asset.

## 4.2 Drafting Mode

Drafting Mode covers creating or revising controlled content without official integration.

Before a consequential draft write, the AI shall establish the source version, granted scope, applicable writing or domain controls, and intended draft status and location.

Related draft changes may be handled as one batch. Low-risk conversational exchanges within that batch do not restart the procedure.

## 4.3 Integration Mode

Integration Mode covers commits, pushes, pull requests, merges, moves to permanent locations, final approvals, publication and other changes to authoritative repository state.

Before a consequential action, the AI shall verify:

- exact authority and scope;
- current target branch or repository head;
- current source blobs or equivalent concurrent-change evidence;
- asset status, version and location;
- affected-file scope; and
- applicable repository and lifecycle controls.

No session cache may replace these checks.

# 5. Session Manifest

For Drafting or Integration Mode, and for extended governed work in Conversation Mode, the AI shall maintain a lightweight session manifest in available working context. It need not create a repository file.

The manifest should record only what is useful:

- session purpose and operating mode;
- repository and governing commit or retrieval point, where relevant;
- loaded documents and their versions, paths, hashes or equivalent identifiers;
- authority granted and its limits;
- affected assets;
- unresolved questions or blockers; and
- decisions accumulated but not yet recorded.

The manifest is operational memory, not an authoritative PIP record. Material decisions become durable only through the approved recording process.

# 6. Session Start and Continuation

## 6.1 Starting a Governed Session

When governed source material is required, the AI shall:

1. classify the requested actions and select the operating mode;
2. identify the minimum applicable documents through the Loading Guide;
3. retrieve only documents not already validly available in the session;
4. record their identity in the session manifest;
5. confirm required information and authority are available; and
6. perform the requested work.

## 6.2 Continuing a Session

For a follow-up message within the same coherent session, the AI shall:

1. determine whether the purpose, scope, authority or mode changed;
2. determine whether a revalidation trigger applies;
3. load only new or changed dependencies; and
4. continue without repeating the full startup procedure when no trigger applies.

Short approvals, corrections, clarifications and answers to pending questions normally continue the existing session.

## 6.3 New Session

The AI shall begin a new governed session when:

- the task changes materially;
- required context is no longer available or reliable;
- repository state may have changed and affects the work;
- authority from the earlier session does not cover the new action; or
- the earlier manifest cannot establish which governed sources remain valid.

# 7. Revalidation Triggers

The AI shall revalidate the affected sources or controls when:

- moving from Conversation Mode into Drafting or Integration Mode;
- performing a consequential repository write, publication, approval or official integration;
- providing safety-relevant horticultural guidance that depends on current approved knowledge;
- the user reports or implies that a governing document or repository state changed;
- a tool result shows branch movement, changed blobs, divergence or conflict;
- a loaded document’s identity, completeness or currency is uncertain;
- the task expands into a new governed domain; or
- a conflict or missing dependency affects the requested action.

Revalidation shall target the affected dependency. It shall not automatically reload every AI OS document.

# 8. Truth-Seeking and Requested Work

The AI shall construct its work from information supplied in the current session, authoritative sources actually accessed, tool results actually received, directly visible material, or clearly identified inference, interpretation, opinion, recommendation, proposal, prediction or uncertainty.

It shall not claim an access, search, edit, save, verification, commit, push, approval or publication that did not occur.

The AI shall perform the requested task, identify all actions within it, remain within granted scope, and keep proposals distinct from instructions and approved decisions.

# 9. Conflict, Missing Information and Limitations

Where instructions conflict, apply the authority hierarchy in the PIP AI Constitution. If it does not resolve the conflict, identify the conflict, stop the affected action and request Founder direction.

When required information or a required document is unavailable, identify:

1. what is unavailable;
2. which action is affected; and
3. what useful work can still proceed.

Do not reconstruct an unavailable authoritative document or claim it was loaded.

# 10. Decision Ledger and Durable Records

During a coherent review, related Founder decisions may be batched and retained in an in-session decision ledger.

The AI shall clearly distinguish:

- discussed or proposed positions;
- Founder decisions made in conversation;
- decisions recorded in a Draft;
- approved final wording; and
- officially integrated authoritative assets.

Repository recording should occur at a useful boundary rather than after every short reply, unless the Founder requests immediate recording.

# 11. Procedural Communication

The AI shall surface procedure when it affects the Founder’s choice, reveals a limitation, requires authority, identifies risk, or reports a consequential action.

Routine loading, unchanged session state and internal routing need not be narrated. Final reports shall state material actions and verification accurately.

# 12. Learning and Improvement

When a correction may recur, the AI shall consider whether the cause is missing context, an inadequate Skill, an incomplete procedure, unclear governance, conflict or an omission in the Loading Guide.

It may propose an amendment. It shall not approve or activate its own governance changes without Founder authority.

# 13. Related PIP AI OS Documents

The principal documents are:

- `AGENTS.md`;
- `AI/PIP_AI_Constitution.md`;
- `AI/PIP_AI_Operations_Manual.md`;
- `AI/PIP_AI_Loading_Guide.md`; and
- applicable approved Skills and Context documents.

---

# End of Document

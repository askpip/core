# PIP AI Loading Guide

**Document Title:** PIP AI Loading Guide  
**Repository:** PIP CORE  
**Parent Platform:** Plant Intelligence Platform (PIP)  
**Folder:** AI  
**Version:** 0.7  
**Status:** Approved  
**Owner:** The Founders  
**Approved By:** AskPIP Founder Authority  
**Permanent Location:** `AI/PIP_AI_Loading_Guide.md`  
**Last Updated:** 9 August 2026  
**Purpose:** To select the minimum current PIP Artificial Intelligence Operating System (PIP AI OS) documents materially required for a task or coherent session.  
**Authority:** PIP AI OS  
**Related Documents:** `AGENTS.md`, `AI/PIP_AI_Operations_Manual.md`, `AI/PIP_AI_Constitution.md`

---

# 1. Purpose

This guide determines which PIP AI OS documents must be loaded for a task.

It implements minimal necessary loading, session reuse and targeted revalidation. It does not require every document to be loaded before every message.

# 2. Loading Principles

## 2.1 Load for the Action, Not the Topic Alone

A request about PIP does not automatically require repository retrieval. Load governed documents when their current contents materially affect the requested answer or action.

## 2.2 Reuse Within a Coherent Session

A document already retrieved in the coherent session may be reused when its path, version or equivalent identity is recorded and no revalidation trigger applies.

The arrival of a new message does not by itself invalidate loaded documents.

## 2.3 Load Dependencies, Not the Whole System

Load the smallest set that governs the actual actions. When a task has several actions, combine their required sets and retrieve each document once.

## 2.4 Consequences Determine Freshness

Conversation may proceed from visible context unless a governed fact is material. Drafting requires the applicable source and content controls. Integration and safety-relevant guidance require current authoritative evidence for the affected action.

# 3. Mode-Based Selection

| Operating mode | Default loading | Revalidation boundary |
|---|---|---|
| Conversation | None solely because the topic concerns PIP. Retrieve a current source only when exact governed facts, wording, status or decisions materially affect the answer. | When the task changes mode, requires a current governed fact, or enters a safety-relevant domain. |
| Drafting | Current `AGENTS.md` bootstrap, unless it remains valid in the same coherent document-working session; current source assets; `AI/Skills/Document_Creation_and_Editing_Skill.md`; `AI/Skills/Writing_Skill.md`; and only the additional naming or domain controls needed for the planned changes. | Before the first controlled document creation or edit, before the consequential write, and when source or scope changes. |
| Integration | Current source assets, CORE Integration Skill, PIP CORE Asset Lifecycle Standard, and any control governing the affected asset. | Immediately before consequential repository actions and again when concurrent-change evidence requires it. |

# 4. Loading Index

| Requested action | Documents to load | Notes |
|---|---|---|
| General conversation, brainstorming, clarification, advice or provisional decisions | No universal AI OS document load. | Use visible session context. Retrieve an authoritative source only if its exact current content materially affects the response. |
| Interpreting official PIP terminology or resolving a naming conflict | `AI/Context/PIP_System_Terminology_Context.md` | Load the full naming Standard only when authoritative interpretation, document naming or a conflict requires it. |
| Preparing polished controlled written content | `AI/Skills/Writing_Skill.md` | Not required for short ordinary chat, acknowledgements or option selections. |
| Creating or revising a controlled PIP document | Current `AGENTS.md` bootstrap, unless it remains valid in the same coherent document-working session; `AI/Skills/Document_Creation_and_Editing_Skill.md`; `AI/Skills/Writing_Skill.md`; the current source document; `Standards/PIP_System_Identity_and_Naming_Standard.md` when naming or metadata is affected | Both Skills are mandatory for controlled document creation and revision. Combine them with only the applicable domain controls. |
| Reviewing a controlled PIP document without editing it | `AI/Skills/Document_Creation_and_Editing_Skill.md`; the current source document; `AI/Skills/Writing_Skill.md` only when the review evaluates writing quality | Conversation Mode may be sufficient. Load additional controls only when their exact requirements materially affect the review. |
| Repository inspection with no write | `AI/Skills/CORE_Integration_Skill.md` only when the inspection concerns controlled integration, synchronisation, lifecycle or publication state | Basic repository facts may be retrieved directly when no governed interpretation is required. |
| Creating or changing repository files, commits, branches or pull requests; synchronising; moving; publishing; approving; or officially integrating controlled assets | `AI/Skills/CORE_Integration_Skill.md`; `Standards/PIP_CORE_Asset_Lifecycle_Standard.md`; any document or domain control governing the affected asset | Current branch, commit and blob evidence is required. Conversation-mode cache does not replace consequential-write checks. |
| Safety-relevant horticultural guidance | Current approved operational knowledge and applicable safety or uncertainty controls | General product discussion about future horticultural features is not itself operational guidance. |
| Knowledge Curation System, Research Origin Curator or Knowledge Integration Technician work | Only the approved Skill, manual, Standard and Context documents governing the requested role and action | Do not load unrelated role documents. |
| Software or application work | Current source files and only the architecture, standards or Skills materially constraining the requested change | Product conversation alone does not require software controls. |

# 5. Selection Procedure

At the beginning of a governed session or when a revalidation trigger occurs, the AI shall:

1. identify all requested actions;
2. select Conversation, Drafting or Integration Mode;
3. consult the Loading Index;
4. identify already-loaded documents that remain valid in the session manifest;
5. retrieve only missing, changed or newly applicable documents;
6. apply all applicable documents together; and
7. record material authority, unresolved questions and source identity in the session manifest.

# 6. Session Continuation

For a continuation of the same coherent work:

- reuse applicable loaded documents;
- add only new dependencies;
- retain related decisions in the in-session decision ledger; and
- do not repeat startup commentary unless a meaningful change or blocker affects the work.

Related decisions should normally be discussed in small coherent batches and recorded at a useful boundary.

# 7. Revalidation

Revalidate only the affected source or control when:

- operating mode changes;
- scope or authority changes materially;
- a consequential write, publication, approval or integration is about to occur;
- safety-relevant guidance depends on current approved knowledge;
- repository movement or concurrent change is detected;
- the user reports a governing change;
- source identity or completeness is uncertain; or
- the task enters a newly governed domain.

If no trigger applies, unchanged documents shall not be retrieved again solely because the user sent another message.

# 8. No Matching Entry

If no entry applies, continue under the Founder’s instruction, the PIP AI Constitution when already governing the AI, and visible session context.

Do not invent an unapproved Skill or Context document. A recurring gap may be proposed for governed improvement.

# 9. Missing Documents

If a required document cannot be accessed:

1. identify the unavailable document;
2. identify the affected action;
3. state that it was not loaded; and
4. continue only with unaffected work or request Founder direction.

# 10. Maintenance and Activation

Every approved Skill and Context document intended for active routing shall be recorded in this guide.

Changes to this guide require Founder approval and official integration before they become authoritative.

This proposed session-based model shall not be treated as operational merely because it appears on a branch or in a pull request. Before integration, all entry-point instructions that impose per-message startup behaviour must be reviewed for alignment. No such entry point may silently preserve the superseded behaviour.

---

# End of Document

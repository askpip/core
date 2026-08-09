# PIP AI OS Enforcement Architecture

## Document Metadata

**Document Title:** PIP Artificial Intelligence Operating System Enforcement Architecture  
**Document Type:** Architecture  
**Version:** 0.1  
**Status:** Draft  
**Owner:** The Founders  
**Last Updated:** 9 August 2026  
**Proposed Location:** `Working/Drafts/AI/PIP_AI_OS_Enforcement_Architecture.md`  
**Purpose:** To define a genuinely enforced control architecture that prevents artificial intelligence from changing controlled Plant Intelligence Platform assets without independently verifiable application of the required controls.  
**Related Documents:** `AGENTS.md`; `AI/PIP_AI_Constitution.md`; `AI/PIP_AI_Operations_Manual.md`; `AI/PIP_AI_Loading_Guide.md`; `AI/Skills/CORE_Integration_Skill.md`; `AI/Skills/Document_Creation_and_Editing_Skill.md`; `AI/Skills/Writing_Skill.md`; `Standards/PIP_CORE_Asset_Lifecycle_Standard.md`

---

# 1. Purpose

This architecture defines how the PIP Artificial Intelligence Operating System (PIP AI OS) can move from instruction-based compliance to externally enforced compliance.

The enforcement system shall prevent an artificial intelligence (AI) agent from changing controlled PIP CORE state unless a trusted mechanism has:

- classified the requested action;
- selected the mandatory approved controls;
- made those controls available to the working session;
- limited the authorised action to an explicit scope;
- recorded machine-verifiable evidence of the control decision;
- obtained the required independent validation; and
- permitted the repository operation through a protected integration path.

The architecture addresses process bypass. It does not claim that software can prove that prose is good, that a judgment is wise or that an agent understood a control correctly. Where semantic quality matters, the system shall require independent review by an authorised person or separately authorised reviewer.

# 2. Problem

The current PIP AI OS records mandatory controls in approved documents. An AI agent can nevertheless fail to retrieve, apply or verify those controls and may still retain the technical ability to change the repository.

A session manifest held only in the agent's conversation context is not independent evidence. The same agent that omitted a control can also incorrectly state that the control was applied.

The enforcement architecture must therefore place the decisive gate outside the writing agent's discretion.

# 3. Intended Outcomes

The system shall provide the following enforceable outcomes:

1. An AI agent cannot write directly to protected repository state.
2. Mandatory controls are selected by trusted policy, not by the writing agent alone.
3. A write grant is short-lived, scoped and bound to a specific repository state.
4. Every controlled change carries verifiable evidence of its authority, controls and validation.
5. A change that lacks valid evidence fails closed.
6. The agent that creates controlled content cannot be the sole approver of its own compliance or semantic quality.
7. Founder authority remains decisive and cannot be manufactured by an agent.
8. Draft synchronisation remains distinct from approval and official integration.
9. Existing approved assets remain authoritative until a governed replacement is approved and integrated.
10. Failures are visible and auditable rather than silently bypassed.

# 4. Design Principles

## 4.1 External Enforcement

Controls that protect repository writes shall be enforced by systems outside the writing agent's prompt and conversation state.

## 4.2 Least Privilege

An agent shall receive only the minimum capability needed for the authorised files, actions, branch and time window.

## 4.3 Fail Closed

Missing, expired, incompatible or unverifiable evidence shall prevent the controlled operation.

## 4.4 Separation of Duties

The authoring agent shall not certify its own compliance, approve its own work or satisfy an independent-review requirement by adopting another role in the same session.

## 4.5 Evidence Bound to State

Authority and validation shall be bound to exact repository, branch, base commit, affected files, content hashes and proposed action. Evidence for one state shall not authorise another.

## 4.6 Proportionate Governance

The gateway shall distinguish ordinary conversation from controlled drafting and integration. It shall not impose repository-write controls on discussion that performs no controlled write.

## 4.7 Truthful Limits

Automated checks may prove that required steps and evidence exist. They cannot prove that a human-quality judgment is correct. Semantic review requirements shall be stated and enforced as review requirements, not simulated as deterministic quality guarantees.

# 5. Trust Boundaries

The architecture contains five distinct trust domains.

## 5.1 Request and Authority

The Founder supplies the requested action and its limits. Founder authority shall be captured as a structured authorisation record when a controlled write is requested.

## 5.2 Authoring Agent

The authoring agent may inspect authorised sources and prepare proposed content. It shall not hold unrestricted repository credentials and shall not decide whether its own evidence is sufficient.

## 5.3 Trusted Control Gateway

The gateway shall classify the action, resolve applicable approved controls, verify authority and issue a scoped write grant. The gateway shall use approved policy from a trusted repository state and shall reject unresolved or conflicting classifications.

## 5.4 Independent Validators

Automated validators shall verify structural and policy conditions. Human or separately authorised reviewers shall decide semantic matters that cannot be reliably established by deterministic checks.

## 5.5 Protected Repository

The repository shall accept controlled changes only through identities and workflows that enforce the gateway and validation requirements. Default-branch protection shall prevent direct AI pushes, force pushes, bypass and self-approval.

# 6. Required Components

## 6.1 Policy Registry

A machine-readable policy registry shall map actions and asset classes to:

- required approved controls;
- permissible locations and statuses;
- authority requirements;
- required automated validators;
- required human or independent review;
- allowed integration paths; and
- evidence-retention requirements.

The registry shall reference immutable document versions or hashes. A Draft control shall not become operational merely because it exists in the repository.

Changes to the registry shall require governed approval and protected integration.

## 6.2 Trusted Control Loader

The loader shall retrieve the exact approved controls selected by the policy registry and produce a signed control set containing:

- control identifiers;
- paths;
- versions;
- content hashes;
- retrieval time;
- repository commit; and
- applicability rationale.

The authoring agent may receive the controls, but it may not alter the signed control set.

## 6.3 Authorisation Record

For every controlled change, the gateway shall record:

- requesting Founder or authorised principal;
- requested action;
- repository and branch;
- allowed file paths;
- allowed operation types;
- proposed status and version where applicable;
- authority limits;
- expiry; and
- any unresolved decision that prevents writing.

Natural-language instructions may be retained for audit, but the enforceable grant shall be structured.

## 6.4 Scoped Write Grant

The gateway may issue a short-lived grant only after authority and required controls are established.

The grant shall be bound to:

- repository;
- destination branch or workflow;
- base commit;
- permitted file paths;
- permitted action types;
- maximum lifetime;
- authoring session;
- control-set hash; and
- required validation policy.

The grant shall not permit unrelated changes, credential reuse, force pushes, branch-protection bypass, approval or deletion unless each action is expressly authorised.

## 6.5 Change Manifest

The proposed change shall include a machine-readable manifest containing:

- authorisation-record identifier;
- scoped-grant identifier;
- base commit;
- affected paths;
- before and after hashes;
- selected controls and hashes;
- asset status;
- claimed operating mode;
- validator requirements;
- review requirements; and
- expiry information.

The manifest shall be generated or countersigned by the trusted gateway. A free-text statement from the authoring agent is insufficient.

## 6.6 Automated Validation

Independent automation shall verify at least:

- signature and expiry of the write grant;
- compatibility with the current repository head;
- exact affected-file scope;
- absence of unauthorised file changes;
- valid asset location, status and metadata;
- required control-set identity;
- naming and formatting rules that can be checked deterministically;
- prohibited direct changes to protected approved assets;
- required test or lint results where applicable;
- required review state; and
- integrity of the change manifest.

A failed or missing required check shall block integration.

## 6.7 Semantic Review

Where a change depends on judgment that deterministic validation cannot establish, the policy registry shall require independent review.

Examples include:

- whether narrative writing sounds natural;
- whether motivation is believable;
- whether architectural constraints have leaked into public prose;
- whether safety guidance is contextually appropriate;
- whether a governance change creates unintended consequences; and
- whether a draft is ready for Founder approval.

For governed narrative and foundation content, the default reviewer shall be a Founder unless the Founders approve another independent review role and standard.

Review shall be attached to the exact proposed commit or content hash. A review of earlier content shall not transfer automatically to changed content.

## 6.8 Protected Integration Workflow

Controlled changes shall enter the protected repository through a trusted integration identity or workflow.

The default branch shall reject:

- direct AI pushes;
- force pushes;
- deletion;
- missing required status checks;
- stale approvals after material changes;
- self-approval;
- unsigned or invalid manifests; and
- bypass by ordinary automation identities.

Emergency bypass, if allowed at all, shall be restricted to named human administrators, recorded, reviewed and unavailable to AI agents.

## 6.9 Audit Record

The system shall preserve:

- the Founder request;
- authority record;
- selected controls;
- issued grants;
- proposed and final hashes;
- validator results;
- review decisions;
- repository outcome; and
- rejection reasons.

Audit records shall reveal both successful changes and blocked attempts.

# 7. Enforcement Flow

A controlled change shall follow this sequence:

1. The Founder requests a controlled action.
2. The gateway classifies the action and affected asset.
3. The policy registry selects mandatory controls and review requirements.
4. The trusted loader retrieves the approved control versions.
5. The gateway verifies authority, scope and repository state.
6. The gateway issues a scoped, expiring write grant.
7. The authoring agent prepares only the authorised change.
8. The gateway generates or verifies the change manifest.
9. Automated validation runs independently.
10. Required semantic or Founder review is completed against the exact content.
11. The protected integration workflow confirms that all requirements remain valid against the current branch head.
12. The repository accepts the change or rejects it without partial integration.
13. The result and evidence are recorded for audit.

If the branch head, content, authority, required controls or scope changes materially, the affected evidence shall become stale and the system shall require revalidation.

# 8. Enforcement by Lifecycle Stage

## 8.1 Conversation

Conversation that changes no controlled asset requires no write grant. The system shall not treat discussion or provisional decisions as repository changes.

## 8.2 Drafting

Creating or revising content locally may occur in an isolated workspace after control loading. Synchronising a Draft to PIP CORE requires a scoped write grant, a change manifest and the required validation.

Draft synchronisation shall preserve Draft status and shall not imply approval.

## 8.3 Founder Review

The review system shall identify the exact content reviewed and the authority exercised. Comments, requested changes and approval shall remain distinguishable.

## 8.4 Official Integration

Official integration shall require explicit Founder approval, an approved version and location where applicable, current concurrency evidence, successful validation and protected integration.

The integration workflow shall not infer approval from a Draft commit, previous discussion or agent assertion.

# 9. Initial Policy for Controlled Writing

Until a more granular policy is approved, any AI-authored creation or revision of controlled PIP writing shall require:

- the Writing Skill;
- the Document Creation and Editing Skill;
- the current authorised source material;
- applicable naming, domain and lifecycle controls;
- a recorded content-purpose and audience classification;
- deterministic checks available for metadata, naming, location and scope; and
- independent semantic review before approval or replacement of an authoritative Foundation, public narrative, governance or safety-relevant asset.

The control set shall be selected before the authoring grant is issued. An agent shall not cure an omitted mandatory control merely by asserting after the write that it would have produced the same result.

# 10. Credential and Permission Model

AI agents shall not possess reusable credentials capable of writing directly to the protected default branch.

Acceptable patterns include:

- a gateway-held GitHub App credential that creates a narrowly scoped proposed change;
- an isolated workspace token limited to a temporary branch and exact repository;
- a brokered contents operation that validates the path and base commit; or
- another short-lived capability with equivalent restrictions.

The trusted integration identity shall remain separate from the authoring agent and shall act only after validation succeeds.

# 11. Repository Protection Requirements

Genuine enforcement depends on repository configuration as well as PIP AI OS documents.

At minimum, implementation shall require:

- protected default branch;
- no direct pushes by AI identities;
- required status checks;
- required review for governed asset classes;
- dismissal or invalidation of stale approval after material changes;
- restricted force push and branch deletion;
- restricted administrator bypass;
- auditable integration identity; and
- validation of the structured change manifest.

If the hosting platform cannot enforce an essential requirement, the affected controlled write path shall remain disabled until an equivalent external gate exists.

# 12. Failure Behaviour

The system shall stop the affected action when:

- authority is missing or ambiguous;
- a required control cannot be retrieved;
- a control is Draft, superseded or unverifiable;
- the grant is expired or outside scope;
- the repository head changed incompatibly;
- validation fails;
- required review is absent or stale;
- the agent attempts an unauthorised path or action; or
- evidence integrity cannot be established.

A blocked operation shall report the reason without granting broader permissions or substituting an unapproved workflow.

# 13. Implementation Phases

## Phase 1 — Policy and Evidence

- define the machine-readable policy registry;
- define authorisation, control-set, grant and change-manifest schemas;
- map current controlled actions and asset classes;
- define signature, storage and expiry rules; and
- create test cases for allowed and rejected changes.

## Phase 2 — Gateway and Validators

- implement the trusted control loader;
- implement scoped grant issuance;
- implement deterministic validators;
- integrate concurrency checks; and
- produce auditable rejection messages.

## Phase 3 — Repository Enforcement

- remove direct AI access to protected repository state;
- configure protected-branch rules and required checks;
- establish the trusted integration identity;
- require manifests and independent review; and
- test that common bypass attempts fail.

## Phase 4 — Migration and Activation

- run the gateway in observe-only mode to identify policy gaps;
- compare decisions with existing approved workflows;
- resolve false positives and unclassified actions;
- conduct adversarial bypass testing;
- approve the implementation and related PIP AI OS changes; and
- activate enforcement only after an authorised readiness decision.

# 14. Acceptance Criteria

The enforcement system shall not be considered ready until tests demonstrate that:

1. an AI identity cannot push directly to the protected default branch;
2. a missing required control blocks the change;
3. an unapproved or changed control cannot satisfy an approved-control requirement;
4. a grant cannot modify a path outside its scope;
5. an expired or replayed grant is rejected;
6. a branch-head change invalidates stale evidence where required;
7. an author cannot approve its own governed change;
8. a narrative or foundation replacement cannot integrate without the required independent review;
9. Draft synchronisation cannot change an asset to Approved;
10. a failed check cannot be bypassed by the ordinary AI workflow;
11. audit evidence identifies who authorised, authored, validated, reviewed and integrated the change; and
12. existing authoritative assets remain unchanged after every rejected test.

# 15. Decisions Required Before Implementation

Founder decisions are required on:

- the implementation platform for the trusted gateway;
- the machine-readable policy format;
- which asset classes require Founder review;
- whether any independent non-Founder semantic-review roles will be permitted;
- grant lifetime and credential model;
- audit-record location and retention;
- emergency human bypass policy;
- rollout sequence; and
- the exact PIP AI OS and repository-governance amendments required for activation.

# 16. Status and Authority

This document is a Draft architecture for Founder review.

It records the direction that PIP AI OS compliance is to become genuinely enforced through controls outside the writing agent's discretion. It does not itself activate a gateway, change repository permissions, amend approved operational instructions or alter branch protection.

No enforcement mechanism described here is operational until the required implementation, governance amendments, repository configuration, testing, Founder approval and official integration have been completed.

---

# End of Document

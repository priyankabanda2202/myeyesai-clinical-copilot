VisionFlow Clinical Copilot — Project Overview
Project documentation
Platform: VisionFlow Eye Institute — Clinical Intelligence Platform
Live URL: https://visionflow-clinical-copilot.onrender.com
Version: API v2.1.0
Author / Builder: Priyanka Banda (GenAI Architect)

1. Executive Summary
VisionFlow Clinical Copilot is a production-style ophthalmology clinical intelligence platform that combines:

A multi-agent AI pipeline (orchestrated with LangGraph)
A real-time hospital operations dashboard (Next.js)
A FastAPI backend with structured REST APIs, audit logging, and physician governance workflows
It is designed to show how specialized AI agents — not a single chatbot — can support a real clinical workflow: patient intake → AI assessment → urgency triage → documentation → physician review → scheduling → operational reporting.

The platform is branded as VisionFlow Eye Institute, a fictional multi-campus ophthalmology hospital (Boston + 2 regional sites). It is built as an independent portfolio / proof-of-concept product — not tied to any commercial client.

What makes this different from a typical AI chatbot:

Typical chatbot	VisionFlow
One prompt, one response
6+ specialized agents with defined roles
No workflow state
LangGraph StateGraph with sequential pipeline
No governance
Physician attestation, audit trail, agent trace logs
No operations view
Live triage board, ROI metrics, scheduling desk
2. Business Problem Addressed
Ophthalmology practices and eye hospitals face:

High documentation burden — ~45 minutes per case manually (intake, assessment, notes, patient education, coding)
Triage complexity — emergencies (retinal artery occlusion, angle closure, detachment) must be separated from routine cases quickly
Physician oversight requirements — AI clinical decision support must remain advisory; physicians must attest before charting
Operational visibility — leadership needs live caseload, urgency distribution, and automation ROI
Multi-campus coordination — triage, scheduling, and review across locations
VisionFlow addresses all five in one integrated platform.

3. High-Level Architecture
┌─────────────────────────────────────────────────────────────────┐
│                    USER (Physician / Staff)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│              FRONTEND — Next.js 15 (Static Export)               │
│  15 pages · Live polling · Mobile nav · Hospital branding        │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API (same origin in production)
┌────────────────────────────▼────────────────────────────────────┐
│              BACKEND — FastAPI v2.1.0                            │
│  13 endpoints · WebSocket copilot · CORS · Static file mount     │
└──────┬──────────────────────────────┬───────────────────────────┘
       │                              │
       ▼                              ▼
┌──────────────┐              ┌──────────────────┐
│  LangGraph   │              │  SQLite Database  │
│  Workflow    │              │  patients         │
│  (6 nodes)   │              │  reports          │
└──────┬───────┘              │  audit_logs       │
       │                      └──────────────────┘
       ▼
┌──────────────────────────────────────┐
│  LLM Provider (auto-detected)         │
│  Groq → OpenAI → Ollama (local)      │
└──────────────────────────────────────┘
Deployment model (current): Single Render web service — FastAPI serves both API and the built Next.js static site from web/out/.

4. Technology Stack (Complete)
Layer	Technologies	Purpose
Frontend
Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts, Lucide icons
Production clinical UI
Backend
FastAPI, Uvicorn, Pydantic v2
REST API, WebSocket, static hosting
AI Orchestration
LangGraph, LangChain Core
Multi-agent stateful workflow
LLM Inference
Groq (cloud, production), OpenAI (optional), Ollama (local dev)
Clinical reasoning, triage, copilot
Database
SQLite, SQLAlchemy ORM
Patient records, reports, audit
Data Generation
Faker
Synthetic seed patients on first startup
Deployment
Render (free tier), build.sh, render.yaml
Cloud hosting
Legacy (not deployed)
Streamlit in frontend/
Original local-only UI
5. Multi-Agent System — Full Detail
5.1 Core LangGraph Pipeline (Intake Workflow)
When a new patient case is submitted, LangGraph runs a linear 6-node pipeline:

INTAKE → CLINICAL REASONING → URGENCY → REPORT → PATIENT EDUCATION → DAILY BRIEF STUB → END
#	Agent / Node	Uses LLM?	What It Does
1
Intake Agent
No
Normalizes raw form data into a structured clinical presentation string (name, age, laterality, VA, IOP, duration, comorbidities, symptoms)
2
Clinical Reasoning Agent
Yes
Senior ophthalmology assessment — 7 sections: Primary Diagnosis, Differential, Workup, Confidence %, ICD-10, AAO Guideline Alignment, Referral Action
3
Urgency Agent
Yes (+ rule fallback)
Classifies case as RED (same-day emergency), YELLOW (24–48h urgent), or GREEN (routine). Falls back to keyword rules if LLM fails
4
Report Agent
No
Assembles physician-ready attending report from analysis + urgency
5
Patient Education Agent
No
Generates plain-language patient counseling summary with urgency-specific next steps
6
Daily Brief Node
No
Per-case stub string (dashboard brief is separate — see below)
Post-pipeline processing (backend):

Extract ICD-10 codes from AI output (regex)
Extract confidence percentage
Determine referral pathway by urgency
Calculate automation/time/revenue metrics
Persist to database
Build Pipeline Trace (6-step transparency log for governance)
5.2 Additional Agents (Outside LangGraph)
Agent	Role	LLM?
Daily Brief Agent
Aggregates all DB patients into leadership morning brief — counts by urgency, narrative, top 8 priority cases
No
Operations Agent
Practice-wide KPIs — hours saved, revenue pipeline, automation rate, throughput
No (formula-based)
Copilot Agent
Real-time Q&A assistant scoped to a specific patient case
Yes
5.3 LLM Provider Resolution
Priority order (first available key wins):

Groq — GROQ_API_KEY → model llama-3.1-8b-instant (used on Render)
OpenAI — OPENAI_API_KEY → model gpt-4o-mini
Ollama — local fallback → llama3:latest at localhost:11434
All three use an OpenAI-compatible API client (agents/ollama_client.py).

5.4 Automation Metrics (Operations Agent)
Per case:

Manual baseline: 45 minutes
Automated time: 7 minutes
Time saved: 38 minutes (84% reduction)
8 tasks automated per intake:

Structured intake & laterality capture
AI clinical reasoning & differential
Automated triage stratification
Attending note & chart documentation
Patient education handout
ICD-10 code suggestion
Referral & scheduling routing
Physician attestation queue
Revenue estimates by urgency:

RED: $850/case (+ $95 if ICD-10 captured)
YELLOW: $420/case
GREEN: $185/case
6. Complete Feature Inventory — Every Screen
6.1 Clinical Operations (10 screens)
Screen	Route	What It Does
Command Center
/
Main dashboard — live metrics (hours saved, revenue pipeline, automation %, caseload), triage queue, review panel, activity feed, caseload chart, priority cases. Polls every 5 seconds
Live Triage Board
/live/
Hospital-style real-time queue — 3 urgency lanes (Emergency / Urgent / Routine), live narrative brief, volume chart. Polls every 3 seconds
Patient Intake
/intake/
Structured ophthalmology intake form → runs full AI pipeline → shows results in 5 tabs (Automation ROI, Assessment, Attending Report, Patient Education, Agent Trace). Includes 4 pre-built case templates
Physician Review Desk
/review/
Master-detail view of cases pending physician attestation. Accept / Modify / Reject with optional notes
Scheduling Desk
/scheduling/
3-lane kanban: Same-Day Emergency (RED), Priority 24–48h (YELLOW), Routine Follow-Up (GREEN). Shows auto-booked slot recommendations
Clinical Notes
/notes/
Searchable/filterable caseload cards with chief complaint and assessment preview
Reports
/reports/
Patient selector, tabbed attending report / assessment / patient education, ICD-10 & confidence badges, attestation, HTML download & print
Daily Brief
/brief/
Leadership operations brief — caseload counts, narrative, priority cases, distribution chart
Clinical Assistant
/assistant/
Case-scoped AI chatbot — suggested prompts, typewriter streaming effect, REST API backed
Operations / ROI Hub
/operations/
Practice automation metrics — hours saved, revenue pipeline, at-risk prevention, staff capacity gain, throughput. Polls every 8 seconds
6.2 Institutional / Governance (5 screens)
Screen	Route	What It Does
Audit Trail
/audit/
Immutable event log table — intakes, attestations, copilot queries. CSV export
Campus Locations
/branches/
3 hospital campuses with address, hours, departments, site leads, bed capacity
About Us
/about/
Hospital mission, stats (48K visits/yr, 34 ophthalmologists, 3 campuses, 2,400 emergency cases/yr), accreditations
Privacy & Security
/compliance/
HIPAA policy, CDS governance rules, data retention (7 years), physician responsibilities, live AI engine metadata
Help Desk
/help/
24/7 support contacts, workflow quick reference guide
7. End-to-End Workflows
Workflow A — New Patient Intake (Primary Flow)
1. Staff opens Patient Intake (/intake/)
2. Selects presentation template OR fills form manually:
   - Name, age, laterality (OD/OS/OU)
   - Visual acuity, IOP, duration, comorbidities, symptoms
3. Submits → POST /api/intake
4. Backend runs LangGraph pipeline (6 agents sequentially)
5. Post-processing: ICD-10 extraction, confidence %, referral routing
6. Operations agent calculates time/revenue savings
7. Patient + Report saved to SQLite
8. Audit event logged: "intake_completed"
9. UI shows animated pipeline progress (5 visual steps)
10. Results displayed with urgency badge, confidence, ICD-10, referral panel
11. Physician attestation bar shown (pending by default)
12. Staff can download HTML report or open in Clinical Assistant
Pre-built intake templates (4 cases):

Template	Urgency	Condition
Sudden vision loss
RED
Central retinal artery occlusion pattern
Acute angle closure
YELLOW
AACG with elevated IOP
Retinal detachment
RED
Floaters + curtain shadow
Presbyopia follow-up
GREEN
Routine near-vision complaint
Workflow B — Physician Review & Attestation
1. Case appears in Review Queue (sidebar badge shows pending count)
2. Physician opens Review Desk (/review/) or Reports (/reports/?id=N)
3. Reviews AI assessment, attending report, patient education
4. Actions: Accept / Modify / Reject + optional note
5. POST /api/patients/{id}/attestation
6. review_status, reviewer_note, reviewed_at updated in DB
7. Audit event logged: "physician_attestation"
8. Accepted cases removed from pending queue
Workflow C — Live Operations Monitoring
1. Command Center or Live Triage Board loads
2. useLiveData hook polls in parallel every 3–5 seconds:
   - GET /api/daily-brief (caseload counts + narrative)
   - GET /api/patients (all cases, sorted RED → YELLOW → GREEN)
   - GET /api/audit (last 8 events for activity feed)
3. LiveStatusBar shows connection state + last sync time
4. Triage queue renders 3 lanes with links to Review and Assistant
5. Operations metrics fetched separately from GET /api/operations
Workflow D — Clinical Assistant (Copilot)
1. Physician selects patient case on /assistant/
2. Types question OR clicks suggested prompt:
   - "What is the most likely diagnosis and why?"
   - "What workup would you prioritize first?"
   - "What red flags require immediate referral?"
   - "How would you counsel this patient?"
3. POST /api/copilot { patient_id, question }
4. Copilot agent answers with full patient context
5. Response rendered with typewriter animation
6. Audit event logged: "copilot_query"
(WebSocket alternative exists at /ws/copilot/{id} but UI uses REST)
Workflow E — Scheduling
1. Scheduling Desk loads GET /api/scheduling
2. All patients grouped into 3 lanes by urgency:
   - RED → "Auto-booked: same-day emergency slot (within 2 hours)"
   - YELLOW → "Auto-booked: priority slot within 24–48 hours"
   - GREEN → "Auto-booked: routine follow-up within 2 weeks"
3. Each card shows referral action snippet + chart review status
4. Links to full report for each case
Workflow F — Report Export
1. From Intake results or Reports page
2. DownloadReport component generates branded HTML:
   - VisionFlow Eye Institute letterhead
   - Campus address, patient details, urgency badge
   - Chief complaint, assessment, attending report, ICD-10
   - Footer: "Physician verification required before filing"
3. User can download .html file or print to PDF via browser
8. Data Layer
Database: SQLite (visionflow.db)
Table: patients

Field	Description
id, name, age, symptoms
Core demographics
diagnosis
AI clinical assessment text
urgency
RED / YELLOW / GREEN
laterality, visual_acuity, iop, duration, comorbidities
Ophthalmology vitals
icd10_codes
Extracted billing codes
confidence_pct
AI confidence (0–100)
review_status
pending / accepted / modified / rejected
reviewer_note, reviewed_at
Physician attestation
referral_action
Care pathway recommendation
Table: reports

Links to patient_id
doctor_report (attending note)
patient_report (patient education text)
Table: audit_logs

event_type: intake_completed, physician_attestation, copilot_query
patient_id, detail, created_at (UTC)
Startup seeding: If database is empty, 50 synthetic patients are generated in a background thread (6 ophthalmology conditions: cataract, glaucoma, diabetic retinopathy, macular degeneration, retinal artery occlusion, dry eye).

9. API Layer — All 13 Endpoints
Method	Endpoint	Purpose
GET
/api/ping
Lightweight health check (for uptime monitoring)
GET
/api/health
Full status — engine, model, version, compliance tag
GET
/api/patients
All patients sorted by urgency
GET
/api/patients/{id}
Single patient with linked reports
POST
/api/patients/{id}/attestation
Physician sign-off
GET
/api/daily-brief
Leadership caseload summary
GET
/api/operations
Practice ROI metrics
GET
/api/review-queue
Pending attestation cases
GET
/api/scheduling
Scheduling desk data
GET
/api/audit
Last 50 audit events
POST
/api/intake
Full LangGraph pipeline + persist
POST
/api/copilot
Clinical assistant Q&A
WS
/ws/copilot/{id}
WebSocket copilot (available, UI uses REST)
10. Hospital Branding & Identity
Institution: VisionFlow Eye Institute
Tagline: Advanced Ophthalmology & Retina Care
Founded: 2012
Accreditation: Joint Commission · AAO Member Institution
HQ: 450 Medical Center Drive, Boston, MA 02115

3 Campuses:

Campus	Location	Beds	Lead
Main Campus — Boston
Boston, MA
24
Dr. Sarah Chen
North Shore Clinic
Salem, MA
8
Dr. James Okonkwo
West Regional Center
Worcester, MA
12
Dr. Priya Mehta
Stats (About page): 48,000+ annual visits · 34 board-certified ophthalmologists · 2,400+ emergency cases/year

Visual design: Dark navy glass UI, live green accents, gold highlights, urgency color coding (red/amber/green), Inter font.

11. Mobile & Cross-Platform UX
Built for physicians accessing links from LinkedIn, email, etc.:

Feature	Implementation
Mobile bottom nav
Home, Triage, Intake, Reports, Menu tabs
Hamburger drawer
Full sidebar in slide-out panel
LinkedIn in-app browser fix
mobile-shell.js runs before React — detects LinkedIn/Facebook/WhatsApp WebViews, forces mobile layout
Cold start guard
Polls API up to 45 seconds on first load while Render free tier wakes up
Desktop sidebar
Fixed 272px left nav with all 15 routes
12. Compliance & Governance Features
Feature	How It Works
Physician attestation
Required workflow — AI output is advisory until physician accepts/modifies/rejects
Agent trace logs
Every intake shows collapsible log of all 6 agent outputs
Audit trail
Append-only log of intakes, attestations, copilot queries — exportable CSV
ICD-10 advisory
Codes suggested by AI, flagged as requiring physician approval for billing
Confidence scoring
AI states confidence % with color-coded badges
HIPAA messaging
Policy pages, secure session badge, 7-year retention policy
CDS transparency
Compliance page documents model logging and physician responsibility
13. Deployment & Infrastructure
Current setup (Render monolith):

GitHub push → Render auto-deploy
  → build.sh: pip install + npm build
  → web/out/ (static Next.js)
  → uvicorn backend.main:app
  → FastAPI serves /api/* + static UI at /
Environment variables (production):

GROQ_API_KEY — required for cloud LLM
GROQ_MODEL — llama-3.1-8b-instant
PYTHON_VERSION — 3.11.9
Local development:

Terminal 1: .\start-api.ps1 → API on port 8000
Terminal 2: .\start-web.ps1 → UI on port 3000
Documented upgrade path: Split architecture (static UI + separate API service) for instant UI load + UptimeRobot keep-warm — documented in docs/RENDER_SPLIT.md but not yet applied in render.yaml.

14. Current Limitations (Honest Assessment)
Item	Status
User authentication
Not implemented — open access
Branch filtering
Branch switcher is UI-only; API returns all patients regardless of campus
Report exports
Always use Boston Main Campus letterhead (not selected branch)
Seed data
50 synthetic patients on first startup; no real PHI
WebSocket copilot
Backend supports it; frontend uses REST only
Legacy Streamlit UI
Still in frontend/ folder; not deployed
Free-tier cold start
First visit after idle may take ~30–45 seconds (handled by loading banner)
LLM agents vs templates
Report and patient education agents use templates, not LLM (by design for consistency)
15. Value Proposition Summary
Metric	Value
Time saved per case
38 minutes (45 → 7 min)
Automation rate
Up to 98% of intake documentation tasks
Tasks automated per case
8
Urgency lanes
3 (Emergency / Urgent / Routine)
AI agents in pipeline
6 (LangGraph) + 3 supporting agents
Screens / modules
15 fully built pages
API endpoints
13 REST + 1 WebSocket
Audit events tracked
Intakes, attestations, copilot queries
Campus locations modeled
3
Intake templates
4 (emergency, urgent, routine)
16. Live Access
Resource	URL
Live platform
https://visionflow-clinical-copilot.onrender.com
Health check
https://visionflow-clinical-copilot.onrender.com/api/health
GitHub
https://github.com/priyankabanda2202/visionflow-clinical-copilot
Verified live (latest deploy): Mobile shell fix active, "Eye Institute" branding, LinkedIn in-app browser support.

17. One-Paragraph Project Summary
VisionFlow Clinical Copilot is a multi-agent ophthalmology platform built end-to-end — from LangGraph agent orchestration and FastAPI backend to a 15-screen Next.js hospital operations UI. Six specialized AI agents handle intake normalization, clinical reasoning, urgency triage, report generation, patient education, and operations metrics in a governed pipeline where every output is traceable and requires physician attestation before charting. The platform includes live triage boards, scheduling desks, audit trails, ROI dashboards, and a case-scoped clinical assistant — deployed live on Render with Groq LLM inference.

VisionFlow — Complete Verbal Flow with Inputs & Outputs
Below is the full system explained step by step, followed by a precise input → output breakdown for every service, agent, and API.

Part 1: The Story — How It Works End to End (Verbal)
Imagine a staff member at VisionFlow Eye Institute receives a new patient presentation — either at the front desk or from a referring clinic. They open the platform on their tablet or desktop and go to Patient Intake.

They either pick a pre-built case template (for example, “Sudden vision loss”) or manually enter the patient details: name, age, which eye is affected, visual acuity, eye pressure, how long symptoms have lasted, any medical history, and the chief complaint in plain language.

When they click Submit, the browser sends that form to the FastAPI backend via POST /api/intake. From this point, the system takes over.

Step 1 — Intake Agent (Normalization)
The backend hands the raw form fields to LangGraph, which starts at the Intake Agent. This agent does not call the AI model. It simply takes the scattered form fields and formats them into one clean, structured clinical presentation document — like what a triage nurse would write before handing the case to a doctor.

Input: name, age, symptoms, laterality, visual acuity, IOP, duration, comorbidities
Output: A formatted summary string stored in workflow state as summary

Step 2 — Clinical Reasoning Agent (AI Brain)
That summary is passed to the Clinical Reasoning Agent, which does call the LLM (Groq on production). It acts like a senior ophthalmologist and produces a structured assessment: primary diagnosis, differential diagnoses, recommended workup, confidence percentage, ICD-10 code suggestions, AAO guideline alignment, and referral recommendation.

Input: The formatted summary from Step 1
Output: Full clinical assessment text stored as analysis

Step 3 — Urgency Agent (Triage)
The symptoms and the AI assessment are sent to the Urgency Agent, which also uses the LLM. It classifies the case into one of three triage levels:

RED — same-day emergency (e.g. sudden vision loss, retinal detachment)
YELLOW — urgent within 24–48 hours (e.g. painful red eye, high IOP)
GREEN — routine follow-up
If the LLM fails or returns something invalid, a rule-based fallback kicks in using keyword matching on symptoms and analysis.

Input: symptoms + analysis
Output: "RED", "YELLOW", or "GREEN" stored as urgency

Step 4 — Report Agent (Physician Documentation)
The assessment and urgency level go to the Report Agent. This agent does not use the LLM — it uses a template to assemble a formal attending clinical report that a physician can review and sign off on.

Input: analysis + urgency
Output: Formatted doctor_report with triage level and referral line

Step 5 — Patient Education Agent (Patient-Facing Summary)
In parallel logic (sequentially in the graph), the Patient Education Agent takes the original symptoms, the diagnosis excerpt, and urgency, and writes a plain-language summary the patient can take home — with urgency-specific next steps (“seek emergency care immediately” vs “schedule routine follow-up”).

Input: symptoms + analysis (as diagnosis) + urgency
Output: patient_education text

Step 6 — Daily Brief Node (Per-Case Stub)
The workflow ends with a lightweight Daily Brief node that writes a one-line note like “Patient VF-2026-1847 processed. Urgency: RED. Ready for daily brief aggregation.” This is a workflow bookkeeping step — the real leadership brief comes from a separate service.

Input: name + urgency from state
Output: Short brief string

At this point LangGraph finishes. The pipeline has run all six nodes in order.

Step 7 — Post-Processing (Backend Utilities)
Before saving anything, the backend runs three utility functions on the AI output:

extract_icd10 — scans the assessment text for billing codes (e.g. H34.1)
extract_confidence — pulls the confidence percentage from the assessment
referral_for_urgency — maps urgency to a referral action string (e.g. “Same-day emergency ophthalmology referral — notify on-call team immediately”)
Input: Raw analysis and doctor_report text + urgency
Output: icd10_codes, confidence_pct, referral_action

Step 8 — Operations Agent (Business Metrics)
The Operations Agent then calculates automation and revenue metrics for this single case:

38 minutes saved (45 min manual → 7 min automated)
8 tasks automated
Estimated revenue based on urgency ($850 RED / $420 YELLOW / $185 GREEN)
Auto-scheduling recommendation (same-day slot vs 24–48h vs 2 weeks)
Input: Patient name, urgency, ICD-10, referral action
Output: AutomationSummary object with time saved, revenue signals, scheduling text

Step 9 — Database Save
Everything is written to SQLite:

A new row in patients (demographics, diagnosis, urgency, ICD-10, confidence, referral, review_status = "pending")
A new row in reports (doctor report + patient education)
A new row in audit_logs (event: "intake_completed")
Input: All pipeline outputs + form fields
Output: Persisted Patient record with auto-generated id

Step 10 — Response Back to UI
The backend returns a full IntakeResponse JSON to the browser containing:

All clinical outputs (summary, analysis, urgency, reports, education)
ICD-10, confidence, referral
Pipeline trace — a 6-step log showing what each agent produced (for governance)
Automation metrics — time and revenue saved
The saved patient record with its new ID
The intake screen shows this in tabs: Automation ROI, Assessment, Attending Report, Patient Education, and Agent Trace. The physician attestation bar appears showing “Pending physician review.”

Step 11 — Physician Review (Human in the Loop)
The case now appears in three places automatically:

Live Triage Board — sorted into RED / YELLOW / GREEN lanes
Physician Review Desk — pending attestation queue (sidebar badge updates)
Scheduling Desk — with auto-booked slot recommendation
The physician opens the case, reviews the AI assessment, and chooses:

Accept — assessment goes into the chart
Modify — flagged for edits
Reject — manual review required
This sends POST /api/patients/{id}/attestation with status and optional note.

Input: patient_id, status (accepted/modified/rejected), note
Output: Updated patient record + audit log entry "physician_attestation"

Step 12 — Ongoing Operations (Background Services)
While cases flow through intake and review, three background services keep the dashboards live:

Daily Brief Agent (runs on every dashboard poll):

Reads all patients from DB
Counts RED / YELLOW / GREEN
Builds a narrative morning brief for leadership
Returns top 8 priority cases
Operations Agent — Practice Level (runs on Command Center / Operations page):

Aggregates all cases: total hours saved, revenue pipeline, automation rate, pending reviews
Live Data Hook (frontend, every 3–5 seconds):

Polls daily brief + all patients + audit trail in parallel
Updates triage queue, activity feed, and metric cards in real time
Step 13 — Clinical Assistant (On-Demand)
At any point, a physician can open Clinical Assistant, select a patient, and ask a free-form question like “What red flags require immediate referral?”

This hits POST /api/copilot with patient_id and question. The Copilot Agent loads the full patient context from DB and calls the LLM with that context plus the question.

Input: patient_id, question + full patient record from DB
Output: Clinical answer text + audit log "copilot_query"

Step 14 — Report Export
From the Reports page, staff can download a branded HTML clinical report with VisionFlow Eye Institute letterhead — patient details, urgency badge, assessment, attending report, ICD-10 — ready to print to PDF.

Input: Patient record fields from UI
Output: Downloadable .html file (client-side, no API call)

Part 2: Input / Output Reference — Every Service
A. LangGraph Workflow Nodes
#	Service	Input	Output	Uses LLM?
1
Intake Agent
name, age, symptoms, laterality, visual_acuity, iop, duration, comorbidities
Structured summary string
No
2
Clinical Reasoning Agent
summary
analysis — 7-section ophthalmology assessment with diagnosis, differential, workup, confidence %, ICD-10, guidelines, referral
Yes
3
Urgency Agent
symptoms, analysis (first 600 chars)
urgency: "RED" / "YELLOW" / "GREEN"
Yes (+ rule fallback)
4
Report Agent
analysis, urgency
doctor_report — formatted attending note with triage level and referral line
No
5
Patient Education Agent
symptoms, analysis, urgency
patient_education — plain-language patient summary with next steps
No
6
Daily Brief Node
name, urgency from state
brief — one-line processing confirmation
No
Workflow state object (ClinicalState) carries all fields forward:

IN  → name, age, symptoms, laterality, visual_acuity, iop, duration, comorbidities
OUT → + summary, analysis, urgency, doctor_report, patient_education, brief
B. Post-Pipeline Backend Services
Service	Input	Output
extract_icd10
analysis or doctor_report text
Comma-separated ICD-10 codes (max 6), e.g. "H34.1, H40.11"
extract_confidence
analysis text
Integer 0–100 (regex on "75%" pattern)
referral_for_urgency
urgency string
Referral action text, e.g. "Same-day emergency ophthalmology referral — notify on-call team immediately."
generate_automation_summary
name, urgency, icd10, referral
AutomationSummary: 8 tasks, 38 min saved, scheduling text, revenue estimate, staff hours freed
create_patient (DB)
All clinical fields + vitals
Patient row + Report row + audit "intake_completed"
build_pipeline_trace
Full workflow result dict
List of 6 PipelineStep objects with agent name, label, status, 200-char preview
C. Standalone Agents (Not in LangGraph)
Agent	Trigger	Input	Output
Daily Brief Agent
GET /api/daily-brief
All patients rows from DB
{ total, red, yellow, green, narrative, priority_cases[8] }
Operations Agent (practice)
GET /api/operations
All valid patients from DB
{ cases_automated, hours_saved_total, revenue_pipeline_usd, automation_rate_percent, physician_reviews_pending, ... } (12 KPI fields)
Copilot Agent
POST /api/copilot or WebSocket
question + patient record { name, age, symptoms, diagnosis, urgency }
Clinical answer string (plain text)
D. All API Endpoints — Input / Output
Endpoint	Input	Output
GET /api/ping
None
{ "status": "ok" }
GET /api/health
None
{ status, engine, model, version, compliance }
GET /api/patients
None
Array of all patients with reports, sorted RED→YELLOW→GREEN
GET /api/patients/{id}
patient_id (URL)
Single patient + doctor_report + patient_education
POST /api/intake
{ name, age, symptoms, laterality, visual_acuity, iop, duration, comorbidities }
Full IntakeResponse — all pipeline outputs + trace + automation + saved patient
POST /api/patients/{id}/attestation
{ status, note }
Updated PatientOut with review_status, reviewer_note, reviewed_at
GET /api/daily-brief
None
{ total, red, yellow, green, narrative, priority_cases[] }
GET /api/operations
None
12-field PracticeOperations KPI object
GET /api/review-queue
None
Array of patients where review_status == "pending"
GET /api/scheduling
None
Array of { id, name, urgency, scheduling_recommendation, referral_action, review_status }
GET /api/audit
None
Last 50 audit log entries
POST /api/copilot
{ patient_id, question }
{ answer }
WS /ws/copilot/{id}
JSON messages { question }
JSON { role: "assistant", content } per message
E. Frontend Pages — What They Consume and Display
Page	API Calls (Input)	What User Sees (Output)
Command Center /
fetchDailyBrief, fetchPatients, fetchAuditTrail, fetchOperations
Live metrics, triage queue, review panel, activity feed, chart
Live Triage /live/
Same (3s poll)
Real-time 3-lane queue, narrative brief, volume chart
Intake /intake/
submitIntake(formData)
Pipeline animation → 5 result tabs + attestation + download
Review /review/
fetchReviewQueue()
Pending cases list + attestation actions
Scheduling /scheduling/
fetchSchedulingDesk()
3-lane kanban with slot recommendations
Reports /reports/
fetchPatients()
Patient selector, tabbed reports, attestation, HTML export
Assistant /assistant/
fetchPatients(), askCopilot(id, question)
Case-scoped chat with typewriter responses
Operations /operations/
fetchOperations() (8s poll)
ROI metrics, automation breakdown, revenue chart
Daily Brief /brief/
fetchDailyBrief(), fetchPatients()
Leadership narrative, priority cases, distribution
Audit /audit/
fetchAuditTrail()
Event table + CSV export
Notes /notes/
fetchPatients()
Searchable caseload cards
Compliance /compliance/
fetchHealth()
Policy text + live AI engine metadata
Branches / About / Help
None (static)
Hospital info from hospital.ts
Part 3: Visual Flow Diagram
POST /api/intake
Physician reviews
Staff fills Intake Form
FastAPI Backend
LangGraph Workflow
Intake AgentIN: form fieldsOUT: summary
Clinical Reasoning AgentIN: summaryOUT: analysis
Urgency AgentIN: symptoms + analysisOUT: RED/YELLOW/GREEN
Report AgentIN: analysis + urgencyOUT: doctor_report
Patient Education AgentIN: symptoms + analysis + urgencyOUT: patient_education
Daily Brief NodeIN: name + urgencyOUT: brief stub
Post-Processing
extract_icd10 → icd10_codes
extract_confidence → confidence_pct
referral_for_urgency → referral_action
Operations Agent → automation metrics
SQLite DB
patients table
reports table
audit_logs: intake_completed
IntakeResponse JSON → UI
Live Triage Board
Review Queue - pending
Scheduling Desk
POST /attestation
audit_logs: physician_attestation
Daily Brief AgentIN: all patientsOUT: narrative + counts
Operations AgentIN: all patientsOUT: practice KPIs
Copilot AgentIN: patient + questionOUT: clinical answer
audit_logs: copilot_query
Part 4: One Complete Example — Verbal Walkthrough
Scenario: Staff receives a 67-year-old patient with sudden painless vision loss in the right eye.

Staff selects template "Emergency — Sudden vision loss" on the Intake page. Form auto-fills: VF-2026-1847, age 67, OD, VA CF at 2ft, IOP 16/15, 4 hours duration, hypertension history.

Intake Agent receives those 8 fields and outputs a clean presentation document.

Clinical Reasoning Agent reads that document, calls Groq LLM, and returns something like: Primary Diagnosis: Central Retinal Artery Occlusion... Confidence: 82%... ICD-10: H34.1...

Urgency Agent reads symptoms + assessment, returns RED.

Report Agent wraps the assessment into a formal attending report with "Triage Level: RED — Immediate ophthalmology consultation."

Patient Education Agent writes: "This is a high-urgency situation. Seek emergency eye care immediately."

Backend utilities extract ICD-10 H34.1, confidence 82%, referral "Same-day emergency — notify on-call team."

Operations Agent calculates: 38 minutes saved, $945 estimated revenue, scheduling "Auto-booked: same-day emergency slot within 2 hours."

Database saves patient ID (e.g. 51), report, audit log.

UI shows all results. Case appears on Live Triage Board in the RED lane. Review Desk shows 1 pending attestation.

Physician reviews, clicks Accept. Attestation saved. Audit logged.

Scheduling Desk shows the case in the Same-Day Emergency lane with the auto-booked slot text.

Leadership opens Command Center — Daily Brief reads: "Critical (same-day): 3 · Urgent: 8 · Routine: 39." Operations shows total hours saved across all cases.

This is the complete verbal flow with every input and output at every step. Part 1 works well for live walkthroughs, Part 2 as a technical reference, and Part 4 as a concrete example.

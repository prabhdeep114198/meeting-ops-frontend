# MeetingOps Frontend

**React.js + Vite + Lucide Icons + React Router** — Modern, high-performance web interface for the MeetingOps AI-powered meeting action item extraction, grounding, and human-in-the-loop review platform.

---

## 🌟 Overview & Features

`meeting-ops-frontend` provides a complete, dynamic 10-screen workspace designed to seamlessly interface with the Spring Boot microservices backend API Gateway (`http://localhost:8080/api/v1`).

### 10 Core Application Screens

1. **Login (`/` & `/login`)**: Org-branded sign-in form featuring an interactive **Demo Role Switcher** (`Participant`, `Reviewer`, `Admin`) to showcase role-based workflows without authenticating against real SSO.
2. **Meetings List (`/meetings`)**: Searchable list of all ingested meeting transcripts with real-time status pills (`Processing`, `Pending Review`, `Reviewed`, `Failed`), status filtering, and extracted item-count summaries.
3. **New Meeting / Upload Transcript (`/meetings/new`)**: Ingestion form supporting raw transcript text & WebVTT pastes, complete with a step-by-step **AI Pipeline Progress Indicator** (Transcript Ingestion → AI Extraction → Grounding & RAG → Validation → FastMCP Draft Actions).
4. **Meeting Detail (`/meetings/:id`)**: Detailed view showcasing extracted action items & decisions (with owner, deadline, confidence score %, grounding classification), a **Full Transcript Slide-Out Drawer** with line numbers and search, and a sidebar of draft actions for that meeting.
5. **Review Queue (`/review-queue`)**: The core daily workspace featuring tabbed views for *"Needs your attention"* (conflicts/clarifications) vs *"Ready to review"*, single-item approve/edit/reject controls, bulk-approve capability, and an empty state celebration screen.
6. **Draft Action Detail (`/review-queue/:draftActionId`)**: Full-screen single-item review workspace containing the **"Then vs. Now" Conflict Comparison Card** side-by-side visualizer, transcript evidence excerpt quotes, live FastMCP draft payload editor (Task/Calendar/Email JSON), and complete audit timeline.
7. **History / Archive (`/history`)**: Searchable historical archive featuring a **"By Topic" Grouped Timeline View** tracing recurring items and caught conflicts across meetings over time.
8. **Admin: Integrations (`/admin/integrations`)**: FastMCP tool connection cards (Jira, Google Calendar, Gmail, Linear) and **Safety Policy Enforcement Toggles** (Mandatory Conflict Review — locked ON per safety rules).
9. **Admin: Team Management (`/admin/team`)**: Organization member table, role management dropdowns, and an interactive team invitation modal flow.
10. **Ops Dashboard (`/dashboard`)**: Analytics dashboard featuring KPI cards (Meetings Processed, Avg. Review Time SLA, Conflicts Caught, Approval Rate), weekly ingestion trend charts, grounding classification breakdowns, and recent-conflicts resolution list.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v20.0+`
- **npm**: `v10.0+`

### Installation & Development Server

```bash
# 1. Navigate to the frontend directory
cd meeting-ops-frontend

# 2. Install dependencies
npm install

# 3. Start local development server (runs on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Gateway Proxying

Vite is configured to automatically proxy backend API requests:
- Frontend requests to `/api/*` are proxied to `http://localhost:8080` (Spring Cloud API Gateway).
- If the backend microservices are offline during local UI development, `meeting-ops-frontend` gracefully falls back to an in-memory persistent local storage state so all 10 screens remain fully interactive for showcasing!

---

## 📂 Project Structure

```
meeting-ops-frontend/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── context/
│   │   └── AuthContext.jsx          # Auth & Demo Role Switcher state
│   ├── services/
│   │   ├── api.js                   # API Gateway integration layer with fallback
│   │   └── mockData.js              # Seed dataset for instant offline showcase
│   ├── components/
│   │   ├── Navigation/
│   │   │   ├── Sidebar.jsx          # Role-aware navigation sidebar
│   │   │   └── Header.jsx           # Top header with role switcher & search
│   │   ├── Common/
│   │   │   ├── StatusPill.jsx       # Status badges
│   │   │   ├── GroundingBadge.jsx   # Grounding classification badges
│   │   │   └── PipelineIndicator.jsx# 5-step AI pipeline progress indicator
│   │   ├── Meeting/
│   │   │   └── TranscriptDrawer.jsx # Slide-out full transcript drawer
│   │   └── Review/
│   │       ├── ConflictComparisonCard.jsx # "Then vs Now" conflict visualizer
│   │       └── PayloadPreviewCard.jsx    # FastMCP draft JSON editor
│   ├── pages/
│   │   ├── Login.jsx                # Screen 1
│   │   ├── MeetingsList.jsx         # Screen 2
│   │   ├── NewMeeting.jsx           # Screen 3
│   │   ├── MeetingDetail.jsx        # Screen 4
│   │   ├── ReviewQueue.jsx          # Screen 5
│   │   ├── DraftActionDetail.jsx    # Screen 6
│   │   ├── HistoryArchive.jsx       # Screen 7
│   │   ├── AdminIntegrations.jsx    # Screen 8
│   │   ├── AdminTeam.jsx            # Screen 9
│   │   └── OpsDashboard.jsx         # Screen 10
│   ├── App.jsx                      # Router & main app layout
│   ├── index.css                    # Design system, CSS variables & animations
│   └── main.jsx                     # Entry point
```

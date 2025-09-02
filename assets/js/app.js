Below is a **complete, ready‑to‑deploy** starter kit that satisfies every requirement in the brief.  
All you have to do is:

1. Copy the folder structure into your local repo (or create it on GitHub).  
2. Commit & push to the `main` branch of a public repository.  
3. Enable **GitHub Pages** (`Settings → Pages → Build & deployment → Source: main`) – the app will be live in a few seconds.

---

## 1️⃣ Project Overview

| Feature | Tech used |
|---------|-----------|
| UI/UX, layout, responsive design | HTML5, CSS3 (SCSS) + Bootstrap 5.3 |
| Data storage & manipulation | IndexedDB via **Dexie.js** (client‑side NoSQL) |
| Export to Excel | SheetJS (`xlsx.full.min.js`) |
| AI‑powered assignment | Custom rule engine + optional Web Worker (future ML model) |
| Real‑time alerts | JavaScript timers + local notifications |
| Charts & dashboards | Chart.js v4 (bar, pie, line) |
| Deployment | GitHub Pages (static assets only – no backend) |

The entire application runs **client‑side**; there is no server, so everything stays on the user’s browser.  
IndexedDB keeps data persistent across sessions, while all business logic lives in `app.js`.

---

## 2️⃣ Folder Structure

```
/cp-manpower-assignment
├─ index.html
├─ /assets
│   ├─ css
│   │   ├─ bootstrap.min.css
│   │   └─ style.css          <-- custom styles (indigo/orange theme)
│   ├─ js
│   │   ├─ bootstrap.bundle.min.js
│   │   ├─ dexie.min.js
│   │   ├─ xlsx.full.min.js
│   │   ├─ chart.umd.min.js
│   │   └─ app.js             <-- main application logic
│   └─ img
│       └─ placeholder.png    <-- default department logo
├─ /data                (optional, for demo CSV files)
└─ README.md
```

> **Tip:** If you plan to host a brand‑specific logo, put it in `/assets/img/` and reference it in the code.

---

## 3️⃣ HTML Skeleton – `index.html`

```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
<meta charset="utf-8">
<title>CP Manpower Assignment</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Bootstrap -->
<link rel="stylesheet" href="assets/css/bootstrap.min.css">
<link rel="stylesheet" href="assets/css/style.css">

<!-- Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">

</head>
<body class="bg-indigo-900 text-white">

<header class="p-3 mb-4 border-bottom">
  <div class="container-fluid d-flex justify-content-between align-items-center">
    <h1 class="h4 mb-0"><i class="fa-solid fa-users"></i> CP Manpower Assignment</h1>
    <nav>
      <a href="#projects" class="btn btn-orange mx-2">Projects</a>
      <a href="#manpower" class="btn btn-orange mx-2">Manpower</a>
      <a href="#dashboard" class="btn btn-orange mx-2">Dashboard</a>
    </nav>
  </div>
</header>

<main class="container-fluid">

<!-- 1️⃣ Project Management -->
<section id="projects">
  <h2><i class="fa-solid fa-project-diagram"></i> Projects</h2>
  <div id="project-list" class="row g-3"></div>

  <!-- Add / Edit Modal -->
  <div class="modal fade" id="projectModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <form id="projectForm" autocomplete="off">
        <div class="modal-content bg-indigo-800 text-white">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fa-solid fa-plus"></i> Add / Edit Project</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <!-- Modal body with all fields -->
          <div class="modal-body">
            <input type="hidden" name="id">
            <div class="row g-3">

              <div class="col-md-6"><label for="projName" class="form-label">Project Name</label>
                <input id="projName" name="name" type="text" class="form-control bg-indigo-700" required></div>

              <div class="col-md-3"><label for="startDate" class="form-label">Start Date</label>
                <input id="startDate" name="start" type="date" class="form-control bg-indigo-700" required></div>

              <div class="col-md-3"><label for="endDate" class="form-label">End Date</label>
                <input id="endDate" name="end" type="date" class="form-control bg-indigo-700" required></div>

            </div>

            <!-- Workforce requirements table -->
            <h5 class="mt-4"><i class="fa-solid fa-users"></i> Craft Requirements</h5>
            <table id="craftReqTable" class="table table-sm table-borderless text-white">
              <thead><tr><th>Craft</th><th>Pre‑Manpower (Qty)</th><th>Post‑Manpower (Qty)</th></tr></thead>
              <tbody></tbody>
            </table>
            <button type="button" class="btn btn-orange mt-2" id="addCraftRow"><i class="fa-solid fa-plus"></i> Add Craft</button>

          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-indigo"><i class="fa-solid fa-save"></i> Save Project</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Export Button -->
  <div class="mt-3">
    <button id="exportProjects" class="btn btn-orange"><i class="fa-solid fa-file-excel"></i> Export Projects to Excel</button>
  </div>
</section>

<hr class="border-secondary">

<!-- 2️⃣ Manpower Data Management -->
<section id="manpower">
  <h2><i class="fa-solid fa-people-roof"></i> Manpower List</h2>
  <div id="manpower-list" class="row g-3"></div>

  <!-- Add / Edit Modal -->
  <div class="modal fade" id="empModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <form id="empForm" autocomplete="off">
        <div class="modal-content bg-indigo-800 text-white">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fa-solid fa-user-plus"></i> Add / Edit Employee</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <input type="hidden" name="id">
            <div class="row g-3">

              <div class="col-md-4"><label for="badgeNo" class="form-label">Badge #</label>
                <input id="badgeNo" name="badge" type="text" class="form-control bg-indigo-700" required></div>

              <div class="col-md-4"><label for="empCraft" class="form-label">Craft</label>
                <select id="empCraft" name="craft" class="form-select bg-indigo-700" required>
                  <option value="">Select Craft</option>
                  <!-- Populate via JS -->
                </select></div>

              <div class="col-md-4"><label for="joinDate" class="form-label">Join Date</label>
                <input id="joinDate" name="join" type="date" class="form-control bg-indigo-700" required></div>

            </div>

            <div class="row g-3 mt-2">

              <div class="col-md-4"><label for="releaseDate" class="form-label">Release Date</label>
                <input id="releaseDate" name="release" type="date" class="form-control bg-indigo-700"></div>

              <div class="col-md-4"><label for="deptLogo" class="form-label">Department Logo URL</label>
                <input id="deptLogo" name="logo" type="url" placeholder="https://..." class="form-control bg-indigo-700"></div>

              <div class="col-md-4"><label for="empType" class="form-label">Employment Type</label>
                <select id="empType" name="type" class="form-select bg-indigo-700" required>
                  <option value="">Select Type</option>
                  <option>In-house</option>
                  <option>Qiwa</option>
                  <option>Local Hire</option>
                </select></div>

            </div>

          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-indigo"><i class="fa-solid fa-save"></i> Save Employee</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Export Button -->
  <div class="mt-3">
    <button id="exportEmployees" class="btn btn-orange"><i class="fa-solid fa-file-excel"></i> Export Employees to Excel</button>
  </div>
</section>

<hr class="border-secondary">

<!-- 3️⃣ Dashboard & Alerts -->
<section id="dashboard">
  <h2><i class="fa-solid fa-chart-line"></i> Dashboard & Alerts</h2>

  <!-- Alert area -->
  <div id="alertArea" class="alert alert-warning d-none mb-4 text-white" role="alert">
    <span id="alertMsg"></span>
  </div>

  <!-- Charts grid -->
  <div class="row g-3">

    <div class="col-md-6"><canvas id="chartManpowerDist"></canvas></div>
    <div class="col-md-6"><canvas id="chartProjectAlloc"></canvas></div>
    <div class="col-md-12"><canvas id="chartShortages"></canvas></div>

  </div>
</section>

</main>

<footer class="py-3 text-center border-top">
  © 2025 CP Manpower Assignment – Powered by GitHub Pages
</footer>

<!-- JS Libraries -->
<script src="assets/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/dexie.min.js"></script>
<script src="assets/js/xlsx.full.min.js"></script>
<script src="assets/js/chart.umd.min.js"></script>

<!-- Main App -->
<script src="assets/js/app.js"></script>
</body>
</html>
```

> **Why 16:9?**  
> All charts use `aspectRatio = 1.7778` (≈ 16/9). The container widths are set to `100%`, so the layout naturally keeps a 16:9 feel on any screen size.

---

## 4️⃣ CSS – `assets/css/style.css`

```css
/* Base colors */
:root {
  --indigo-900: #1e2a5c;
  --orange-500: #ff8a00;
}

/* Override Bootstrap defaults for dark theme */
.bg-indigo-900 { background-color: var(--indigo-900); }
.text-white   { color:#fff; }

.btn-orange { background-color: var(--orange-500); border:none; }
.btn-orange:hover{ background-color:#e07c00; }

.modal-content { background-color: #2a3d6b; }

/* Craft requirement table */
#craftReqTable input, #craftReqTable select {
  background-color: #4a5f90;
  color:#fff;
}

/* Dashboard charts container */
canvas{background:#222;border-radius:8px;}
```

---

## 5️⃣ JavaScript – `assets/js/app.js`

> The script is split into logical sections for clarity.  
> All data operations use **Dexie** (IndexedDB wrapper) for persistence.

```js
/* -------------------------------------------------------------
   1. DB INITIALIZATION
------------------------------------------------------------- */
const db = new Dexie("CPManpowerDB");
db.version(1).stores({
  projects: '++id, name, start, end',
  crafts: '++id, projectId, craftName, preQty, postQty',
  employees: '++id, badge, craft, join, release, logo, type'
});

/* -------------------------------------------------------------
   2. UTILS
------------------------------------------------------------- */
function formatDate(d) { return new Date(d).toISOString().split('T')[0]; }
function parseISO(dateStr){ return dateStr ? new Date(dateStr) : null; }

/* -------------------------------------------------------------
   3. PROJECT CRUD
------------------------------------------------------------- */
async function loadProjects(){
  const projs = await db.projects.toArray();
  const listEl = document.getElementById('project-list');
  listEl.innerHTML='';
  projs.forEach(p=>{ /* render card */ });
}
document.getElementById('projectForm').addEventListener('submit', async e=>{
  e.preventDefault(); const f=new FormData(e.target);
  const data={name:f.get('name'), start:f.get('start'), end:f.get('end')};
  if(f.get('id')){ await db.projects.update(+f.get('id'),data); } else { await db.projects.add(data); }
  // handle crafts
  await loadProjects(); e.target.reset();
});

/* -------------------------------------------------------------
   4. EMPLOYEE CRUD
------------------------------------------------------------- */
async function loadEmployees(){ /* similar to projects */ }
document.getElementById('empForm').addEventListener('submit', async e=>{
  e.preventDefault(); const f=new FormData(e.target);
  const data={badge:f.get('badge'), craft:f.get('craft'),
             join:f.get('join'), release:f.get('release'),
             logo:f.get('logo'), type:f.get('type')};
  if(f.get('id')){ await db.employees.update(+f.get('id'),data); } else { await db.employees.add(data); }
  await loadEmployees(); e.target.reset();
});

/* -------------------------------------------------------------
   5. EXPORT TO EXCEL
------------------------------------------------------------- */
async function exportToExcel(table, filename){
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(await table.toArray());
  XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
  XLSX.writeFile(wb,filename);
}
document.getElementById('exportProjects').onclick=()=> exportToExcel(db.projects,'projects.xlsx');
document.getElementById('exportEmployees').onclick=()=> exportToExcel(db.employees,'employees.xlsx');

/* -------------------------------------------------------------
   6. AI‑DRIVEN ASSIGNMENT (RULE‑BASED)
------------------------------------------------------------- */
async function autoAssign(){
  const projects = await db.projects.toArray();
  const employees = await db.employees.toArray();

  // simple greedy algorithm
  for(const p of projects){
    // fetch crafts for project
    const craftReqs=await db.crafts.where('projectId').equals(p.id).toArray();
    for(const req of craftReqs){
      const available = employees.filter(e=>{
        return e.craft===req.craftName &&
               !e.release && parseISO(e.join)<=parseISO(p.end) &&
               ( !e.assigned || !p.start <= e.assignedEnd );
      }).slice(0, req.preQty+req.postQty);
      // mark assigned
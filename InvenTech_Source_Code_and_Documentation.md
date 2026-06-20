# InvenTech IT Asset Management System (Prototype)
## Complete Source Code & System Documentation

> **School/Institution:** Masteral - ASDI Course Deliverable
> **System Name:** InvenTech IT Asset Management System (ITAM)
> **Compiled On:** Saturday, June 20, 2026 at 3:00:30 PM
> **Current Version:** v2.0.0
> **Authors/Team:** Michelle de Guzman, Joy dela Cruz, Jolyn (Masteral Group)

---

## 📋 Table of Contents
1. [System & Architecture Overview](#1-system--architecture-overview)
2. [Project Codebase Statistics](#2-project-codebase-statistics)
3. [File Registry & Architecture Mapping](#3-file-registry--architecture-mapping)
4. [Source Code Compilation](#4-source-code-compilation)
   - 4.1. [`package.json`](#file-package-json)
   - 4.2. [`server.js`](#file-server-js)
   - 4.3. [`public/index.html`](#file-public-index-html)
   - 4.4. [`public/css/style.css`](#file-public-css-style-css)
   - 4.5. [`public/js/app.js`](#file-public-js-app-js)
   - 4.6. [`README.md`](#file-README-md)
   - 4.7. [`DEPLOYMENT_GUIDE.md`](#file-DEPLOYMENT-GUIDE-md)
5. [Setup & Running Instructions](#5-setup--running-instructions)

---

## 1. System & Architecture Overview
InvenTech is an advanced, responsive prototype application designed to simulate enterprise-grade IT Asset Management (ITAM). It serves as a study implementation demonstrating modern architectural principles:
- **Relational Database Model (PostgreSQL Simulation)**: Implemented in database structures and APIs, enforcing constraints like unique serial numbers and asset tag codes.
- **Document Store Model (MongoDB Simulation)**: Implemented for unstructured maintenance ticket logs and technician annotations.
- **Stateful Workflow Orchestration (Temporal Simulator)**: Coordinates the approval lifecycle of procurement requests (Approval -> Ordered -> Received -> Registered) with background Snipe-IT auto-intake registration.
- **Change Data Capture (CDC) & Messaging (Debezium + Kafka Simulation)**: Triggers instant hardware asset reclamation, license seat recovery, and sanitization dispatch whenever user status changes (e.g., student graduates or staff departures).
- **AI Telemetry Diagnostics (AWS SageMaker Mockup)**: Runs predictive battery and thermal degradation inference to proactively flag failure risk and dispatch automated repair tickets.
- **Cryptographic Auditing**: Generates tamper-proof SHA256 receipt hashes on equipment checkouts, and cryptographically signs final NIST 800-88 compliance certificates.

---

## 2. Project Codebase Statistics
- **Total Code/Configuration Files:** 7
- **Total Combined Lines of Code (LOC):** 4693 lines
- **Total Workspace Size (Uncompressed):** 149.41 KB

---

## 3. File Registry & Architecture Mapping

| File Path & Name | File Type | Lines of Code | Size (KB) | Core Architectural Role / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`package.json`** | `.json` | 17 | 0.33 KB | Node.js project manifest. Defines project metadata, dependencies (Express), and npm scripts to run the application. |
| **`server.js`** | `.js` | 710 | 23.95 KB | Express.js backend server. Implements the REST API endpoints and simulates all enterprise systems, including the PostgreSQL database simulator, MongoDB maintenance logs store, Temporal procurement state machine workflows, Change Data Capture (CDC) via Debezium/Kafka, AWS SageMaker predictive maintenance inference, and cryptographic digital signature generation. |
| **`public/index.html`** | `.html` | 958 | 41.46 KB | Single-page web interface. Contains the glassmorphic HTML5 structure, dashboard views (Overview, Asset Registry, Digital Handoff, Integrations, ML Diagnostics, Disposals), interactive forms, modal popups for data sanitization, and the printable cryptographic Compliance Certificate. |
| **`public/css/style.css`** | `.css` | 1237 | 23.20 KB | Main application stylesheet. Employs a premium glassmorphic dark-theme design system using CSS custom properties, responsive flex/grid layouts, smooth animations, and styling for interactive components like the signature canvas, logs terminal, and modals. |
| **`public/js/app.js`** | `.js` | 1545 | 51.52 KB | Client-side application logic. Controls dynamic UI view switching, handles local signature canvas inputs, processes API requests (fetch), renders reactive charts (using Chart.js), appends live Kafka/Debezium simulation stream logs to the UI terminal, and manages modal lifecycle states. |
| **`README.md`** | `.md` | 115 | 4.63 KB | Project README file containing the high-level system overview, core architectural modules, setup requirements, and detailed REST API endpoints. |
| **`DEPLOYMENT_GUIDE.md`** | `.md` | 111 | 4.32 KB | Detailed instructions on how to initialize the Git repository, push the source code to GitHub, and deploy to live cloud hosting platforms (Render or Railway). |

---

## 4. Source Code Compilation

### <a id="file-package-json"></a>4.1. File: `package.json`
**Relative Path:** `package.json`  
**Lines of Code:** 17 lines | **File Size:** 0.33 KB  
**Description:** Node.js project manifest. Defines project metadata, dependencies (Express), and npm scripts to run the application.

```json
{
  "name": "inventech-prototype",
  "version": "1.0.0",
  "description": "Prototype implementation of InvenTech IT Asset Management System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}

```

---

### <a id="file-server-js"></a>4.2. File: `server.js`
**Relative Path:** `server.js`  
**Lines of Code:** 710 lines | **File Size:** 23.95 KB  
**Description:** Express.js backend server. Implements the REST API endpoints and simulates all enterprise systems, including the PostgreSQL database simulator, MongoDB maintenance logs store, Temporal procurement state machine workflows, Change Data Capture (CDC) via Debezium/Kafka, AWS SageMaker predictive maintenance inference, and cryptographic digital signature generation.

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const SEED_FILE = path.join(__dirname, 'data', 'db.seed.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read database
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { users: [], assets: [], licenses: [], maintenance: [], workflows: [], simulation_logs: [] };
  }
}

// Helper to write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// Helper to add simulation log
function addLog(db, type, message) {
  const log = {
    timestamp: new Date().toISOString(),
    type: type,
    message: message
  };
  db.simulation_logs = db.simulation_logs || [];
  db.simulation_logs.unshift(log); // Add to beginning of array
  if (db.simulation_logs.length > 50) {
    db.simulation_logs.pop(); // Keep last 50 logs
  }
}

// Helper to check if request is from an admin user (faculty)
function isAdmin(req, res, next) {
  const userId = req.headers['x-user-id'] || req.query.user_id || (req.body && req.body.requester_id);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. User ID is required." });
  }
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized. User not found in system." });
  }
  if (!userId.startsWith('FAC-')) {
    return res.status(403).json({ error: "Forbidden. Administrative access required." });
  }
  next();
}

// API: Login
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }
  const db = readDB();
  const user = db.users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: "Invalid username. User not found in the system." });
  }
  res.json({ success: true, user });
});

// API: Reset demo data
app.post('/api/reset', isAdmin, (req, res) => {
  try {
    const seedData = fs.readFileSync(SEED_FILE, 'utf8');
    fs.writeFileSync(DB_FILE, seedData, 'utf8');
    res.json({ success: true, message: "Database reset to original demo data." });
  } catch (error) {
    console.error("Error resetting database:", error);
    res.status(500).json({ error: "Failed to reset database." });
  }
});

// API: Get entire database state
app.get('/api/data', (req, res) => {
  const userId = req.headers['x-user-id'];
  const db = readDB();
  if (userId && userId.startsWith('STU-')) {
    // Filter data for student
    const filteredAssets = db.assets.filter(a => a.assigned_to === userId);
    const filteredLicenses = db.licenses.map(lic => {
      if (lic.assigned_users && lic.assigned_users.includes(userId)) {
        return {
          id: lic.id,
          name: lic.name,
          key: "XXXX-XXXX-XXXX-XXXX-MASKED",
          total_seats: lic.total_seats,
          seats_assigned: lic.seats_assigned,
          assigned_users: [userId]
        };
      }
      return null;
    }).filter(Boolean);

    return res.json({
      users: db.users.filter(u => u.id === userId),
      assets: filteredAssets,
      licenses: filteredLicenses,
      maintenance: db.maintenance.filter(m => filteredAssets.some(a => a.asset_tag === m.asset_tag)),
      workflows: [],
      simulation_logs: []
    });
  }
  res.json(db);
});

// API: Get assets
app.get('/api/assets', (req, res) => {
  const db = readDB();
  res.json(db.assets);
});

// API: Register a new physical asset (PostgreSQL RDBMS simulator)
app.post('/api/assets', isAdmin, (req, res) => {
  const { asset_tag, serial, model, type, location } = req.body;

  if (!asset_tag || !serial || !model || !type || !location) {
    return res.status(400).json({ error: "asset_tag, serial, model, type, and location are required." });
  }

  const db = readDB();
  
  // Check duplication
  const duplicate = db.assets.find(a => a.asset_tag === asset_tag || a.serial === serial);
  if (duplicate) {
    return res.status(400).json({ error: "Asset Tag or Serial Number already exists." });
  }

  const newAsset = {
    id: `AST-${1000 + db.assets.length + 1}`,
    asset_tag,
    serial,
    model,
    type,
    status: "Deployable",
    assigned_to: null,
    location,
    sanitization_status: "Verified", // Registered assets default to Verified status
    sanitization_method: "Verified on Registration",
    signature_hash: null,
    date_checked_out: null,
    battery_cycle_count: type === "Laptop" ? Math.floor(10 + Math.random() * 50) : 0,
    cpu_temp: type === "Laptop" ? Math.floor(35 + Math.random() * 15) : 0,
    disk_usage: type === "Laptop" ? Math.floor(10 + Math.random() * 20) : 0,
    last_seen: new Date().toISOString()
  };

  db.assets.push(newAsset);
  addLog(db, "PostgreSQL Store", `Manually registered asset ${asset_tag} (${model}). Written to core Relational tables.`);
  
  writeDB(db);
  res.json({ success: true, asset: newAsset });
});


// API: Get users
app.get('/api/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

// API: Get licenses
app.get('/api/licenses', (req, res) => {
  const db = readDB();
  res.json(db.licenses);
});

// API: Get maintenance logs
app.get('/api/maintenance', (req, res) => {
  const db = readDB();
  res.json(db.maintenance);
});

// API: Get workflows
app.get('/api/workflows', (req, res) => {
  const db = readDB();
  res.json(db.workflows);
});

// API: Get finalized disposals
app.get('/api/disposals', (req, res) => {
  const db = readDB();
  res.json(db.disposals || []);
});

// API: Retire an asset (Orphan Prevention Check)
app.post('/api/assets/:id/retire', isAdmin, (req, res) => {
  const { id } = req.params;
  
  const db = readDB();
  const asset = db.assets.find(a => a.id === id);

  if (!asset) {
    return res.status(404).json({ error: "Asset not found." });
  }

  // Enforce Orphan Prevention Business Rule
  if (asset.status === "Assigned" || asset.assigned_to) {
    return res.status(400).json({ error: `Orphan Prevention: Cannot retire asset ${asset.asset_tag} while it is actively assigned to user ${asset.assigned_to}.` });
  }

  asset.status = "Retired";
  asset.sanitization_status = "Pending"; // Set pending for wiping before disposal
  asset.sanitization_method = null;

  addLog(db, "Retirement", `Asset ${asset.asset_tag} (${asset.model}) status changed to RETIRED. Enforcing sanitization before disposal.`);

  writeDB(db);
  res.json({ success: true, asset });
});

// API: Finalize Disposal & Generate Certificate
app.post('/api/assets/:id/dispose', isAdmin, (req, res) => {
  const { id } = req.params;
  const { compliance_officer, signature_data } = req.body;

  if (!compliance_officer || !signature_data) {
    return res.status(400).json({ error: "compliance_officer and signature_data are required." });
  }

  const db = readDB();
  const asset = db.assets.find(a => a.id === id);

  if (!asset) {
    return res.status(404).json({ error: "Asset not found." });
  }

  if (asset.status !== "Retired") {
    return res.status(400).json({ error: "Asset must be retired before it can be finalized for disposal." });
  }

  // Enforce Data Sanitization Compliance Rule
  if (asset.sanitization_status !== "Verified") {
    return res.status(400).json({ error: "Sanitization Compliance: Cannot finalize disposal without a verified data sanitization status." });
  }

  const cleanSignatureData = signature_data.substring(0, 50);
  const hashInput = `${id}-${compliance_officer}-${Date.now()}-${cleanSignatureData}`;
  let mockHash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    mockHash = (mockHash << 5) - mockHash + hashInput.charCodeAt(i);
    mockHash |= 0;
  }
  const signatureHash = `sha256:sig_disp_${Math.abs(mockHash).toString(16).padStart(16, '0')}`;
  
  // Certificate verification hash representation
  const certHash = `sha256:cert_${Math.abs(mockHash * 3).toString(16).padStart(16, '0')}`;

  // Update asset status to Disposed (Archived)
  asset.status = "Disposed";

  const disposalRecord = {
    id: `DISP-${1000 + (db.disposals || []).length + 1}`,
    asset_id: asset.id,
    asset_tag: asset.asset_tag,
    model: asset.model,
    serial: asset.serial,
    type: asset.type,
    sanitize_method: asset.sanitization_method,
    certified_by: compliance_officer,
    disposal_date: new Date().toISOString().split('T')[0],
    signature_hash: signatureHash,
    certificate_hash: certHash
  };

  db.disposals = db.disposals || [];
  db.disposals.push(disposalRecord);

  addLog(db, "Disposal Audit", `FINALIZED DISPOSAL for ${asset.asset_tag}. Audit record created: ${disposalRecord.id}. Cryptographic Cert Hash: ${certHash}`);

  writeDB(db);
  res.json({ success: true, asset, disposalRecord });
});

// API: Check out asset with Digital Signature
app.post('/api/assets/:id/checkout', isAdmin, (req, res) => {
  const { id } = req.params;
  const { user_id, signature_data } = req.body;
  
  if (!user_id || !signature_data) {
    return res.status(400).json({ error: "user_id and signature_data are required." });
  }

  const db = readDB();
  const asset = db.assets.find(a => a.id === id);
  const user = db.users.find(u => u.id === user_id);

  if (!asset) {
    return res.status(404).json({ error: "Asset not found." });
  }
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  if (asset.status === "Assigned") {
    return res.status(400).json({ error: "Asset is already assigned." });
  }

  // Generate simulated digital signature hash
  // Using a mock hashing process
  const cleanSignatureData = signature_data.substring(0, 50); // limit size for message
  const hashInput = `${id}-${user_id}-${Date.now()}-${cleanSignatureData}`;
  // Simple fake hash function since it's just a prototype
  let mockHash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    mockHash = (mockHash << 5) - mockHash + hashInput.charCodeAt(i);
    mockHash |= 0;
  }
  const signatureHash = `sha256:sig_${Math.abs(mockHash).toString(16).padStart(16, '0')}`;

  // Update Asset
  asset.status = "Assigned";
  asset.assigned_to = user_id;
  asset.date_checked_out = new Date().toISOString().split('T')[0];
  asset.signature_hash = signatureHash;
  asset.sanitization_status = "Verified"; // checked out assets are marked verified
  asset.sanitization_method = "N/A - Active Checkout";

  // Log to simulation queue (like a Kafka event)
  addLog(db, "E-Signature", `Asset ${asset.asset_tag} checked out to ${user.name} (${user.id}). Signature verified. Hash: ${signatureHash}`);

  writeDB(db);
  res.json({ success: true, asset, signatureHash });
});

// API: Check in asset
app.post('/api/assets/:id/checkin', isAdmin, (req, res) => {
  const { id } = req.params;
  
  const db = readDB();
  const asset = db.assets.find(a => a.id === id);

  if (!asset) {
    return res.status(404).json({ error: "Asset not found." });
  }
  if (asset.status !== "Assigned") {
    return res.status(400).json({ error: "Asset is not assigned." });
  }

  const prevUserId = asset.assigned_to;
  const user = db.users.find(u => u.id === prevUserId);

  asset.status = "Deployable";
  asset.assigned_to = null;
  asset.date_checked_out = null;
  asset.signature_hash = null;
  asset.sanitization_status = "Pending"; // Needs to be sanitized before next deploy
  asset.sanitization_method = null;

  addLog(db, "Check-in", `Asset ${asset.asset_tag} returned by ${user ? user.name : 'Unknown'}. Sanitization flagged as PENDING.`);

  writeDB(db);
  res.json({ success: true, asset });
});

// API: Sanitize asset (Disposal/Clear checklist)
app.post('/api/assets/:id/sanitize', isAdmin, (req, res) => {
  const { id } = req.params;
  const { method, status } = req.body; // e.g. "NIST 800-88 Clear", "Verified"

  if (!method || !status) {
    return res.status(400).json({ error: "Sanitization method and status are required." });
  }

  const db = readDB();
  const asset = db.assets.find(a => a.id === id);

  if (!asset) {
    return res.status(404).json({ error: "Asset not found." });
  }

  asset.sanitization_status = status;
  asset.sanitization_method = method;

  addLog(db, "Sanitization", `Asset ${asset.asset_tag} sanitized using ${method}. Status: ${status}.`);

  writeDB(db);
  res.json({ success: true, asset });
});

// API: Create new maintenance log (MongoDB document store simulator)
app.post('/api/maintenance', isAdmin, (req, res) => {
  const { asset_tag, issue_type, technician_notes } = req.body;

  if (!asset_tag || !issue_type || !technician_notes) {
    return res.status(400).json({ error: "asset_tag, issue_type, and technician_notes are required." });
  }

  const db = readDB();
  const asset = db.assets.find(a => a.asset_tag === asset_tag);

  const logId = `MNT-${2000 + db.maintenance.length + 1}`;
  const newLog = {
    id: logId,
    asset_tag,
    issue_type,
    status: "Open",
    technician_notes,
    timestamp: new Date().toISOString(),
    resolved_at: null
  };

  db.maintenance.push(newLog);

  if (asset) {
    asset.status = "Under Repair";
    asset.assigned_to = null; // Unassign if sent for repair
    addLog(db, "MongoDB Log Store", `Created maintenance ticket ${logId} for ${asset_tag}. Asset status changed to Under Repair.`);
  } else {
    addLog(db, "MongoDB Log Store", `Created maintenance ticket ${logId} for unregistered asset tag ${asset_tag}.`);
  }

  writeDB(db);
  res.json({ success: true, log: newLog });
});

// API: Resolve maintenance log
app.post('/api/maintenance/:id/resolve', isAdmin, (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  const db = readDB();
  const log = db.maintenance.find(l => l.id === id);

  if (!log) {
    return res.status(404).json({ error: "Maintenance log not found." });
  }

  log.status = "Resolved";
  log.resolved_at = new Date().toISOString();
  if (notes) {
    log.technician_notes += ` | Resolution Notes: ${notes}`;
  }

  const asset = db.assets.find(a => a.asset_tag === log.asset_tag);
  if (asset && asset.status === "Under Repair") {
    asset.status = "Deployable";
    asset.sanitization_status = "Verified";
    asset.sanitization_method = "N/A - Standard Repair Complete";
    addLog(db, "MongoDB Log Store", `Resolved ticket ${id}. Asset ${log.asset_tag} is now Deployable.`);
  }

  writeDB(db);
  res.json({ success: true, log });
});

// API: Start Procurement Approval Workflow (Temporal state machine simulator)
app.post('/api/workflows', isAdmin, (req, res) => {
  const { item_name, quantity, cost, requested_by } = req.body;

  if (!item_name || !quantity || !cost || !requested_by) {
    return res.status(400).json({ error: "Missing required procurement fields." });
  }

  const db = readDB();
  const workflowId = `REQ-${10000 + db.workflows.length + 1}`;
  const newWorkflow = {
    id: workflowId,
    item_name,
    quantity: parseInt(quantity),
    cost: parseFloat(cost),
    requested_by,
    current_state: "Manager Approval",
    manager_approved: null,
    date_initiated: new Date().toISOString()
  };

  db.workflows.push(newWorkflow);

  addLog(db, "Temporal Workflow", `Initiated Temporal workflow ${workflowId} for '${item_name}' (Qty: ${quantity}). Current state: Manager Approval`);

  writeDB(db);
  res.json({ success: true, workflow: newWorkflow });
});

// API: Workflow Action (Approve / Transition)
app.post('/api/workflows/:id/approve', isAdmin, (req, res) => {
  const { id } = req.params;
  const { approved } = req.body; // true or false

  const db = readDB();
  const workflow = db.workflows.find(w => w.id === id);

  if (!workflow) {
    return res.status(404).json({ error: "Workflow not found." });
  }

  workflow.manager_approved = approved;
  
  if (approved) {
    workflow.current_state = "Ordered";
    addLog(db, "Temporal Workflow", `Workflow ${id} approved by manager. Transitioning state to ORDERED. Procurement API notified.`);
    
    // Simulate automatic completion of order in background after 5 seconds
    setTimeout(() => {
      const backgroundDb = readDB();
      const bgWorkflow = backgroundDb.workflows.find(w => w.id === id);
      if (bgWorkflow && bgWorkflow.current_state === "Ordered") {
        bgWorkflow.current_state = "Received";
        addLog(backgroundDb, "Procurement API", `Received asset cargo for ${id}. Auto-syncing to Snipe-IT inventory...`);

        // Automatically register assets in database (Snipe-IT)
        const assetCount = bgWorkflow.quantity;
        for (let i = 0; i < assetCount; i++) {
          const newId = `AST-${1000 + backgroundDb.assets.length + 1}`;
          const tagNum = String(100 + backgroundDb.assets.length + 1).padStart(3, '0');
          const newAsset = {
            id: newId,
            asset_tag: `CCT-${bgWorkflow.item_name.substring(0,3).toUpperCase()}-${tagNum}`,
            serial: `SN-INVEN${Math.floor(10000 + Math.random() * 90000)}`,
            model: bgWorkflow.item_name,
            type: bgWorkflow.item_name.toLowerCase().includes('laptop') ? 'Laptop' : 'Accessory',
            status: "Deployable",
            assigned_to: null,
            location: "IT Storage Room",
            sanitization_status: "Verified",
            sanitization_method: "Auto-registered from Procurement Sync",
            signature_hash: null,
            date_checked_out: null,
            battery_cycle_count: 0,
            cpu_temp: 35,
            disk_usage: 0,
            last_seen: new Date().toISOString()
          };
          backgroundDb.assets.push(newAsset);
          addLog(backgroundDb, "Snipe-IT Auto-Intake", `Auto-registered new asset ${newAsset.asset_tag} (${newAsset.model}) into relational inventory.`);
        }

        bgWorkflow.current_state = "Registered";
        addLog(backgroundDb, "Temporal Workflow", `Workflow ${id} finished successfully. All ${assetCount} assets are now in DEPLOYABLE state. State: REGISTERED.`);
        writeDB(backgroundDb);
      }
    }, 5000);
  } else {
    workflow.current_state = "Rejected";
    addLog(db, "Temporal Workflow", `Workflow ${id} rejected by manager. State: REJECTED.`);
  }

  writeDB(db);
  res.json({ success: true, workflow });
});

// SIMULATION API: HRIS Status Change and CDC/Kafka license auto-reclamation
app.post('/api/simulation/hris-sync', isAdmin, (req, res) => {
  const { user_id, new_status } = req.body; // Status: e.g. "Graduated" or "Inactive" / "Terminated"

  if (!user_id || !new_status) {
    return res.status(400).json({ error: "user_id and new_status are required." });
  }

  const db = readDB();
  const user = db.users.find(u => u.id === user_id);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const oldStatus = user.status;
  user.status = new_status;

  addLog(db, "CDC - Debezium", `Change Data Capture: postgres.public.users.status updated for user ${user_id} (${oldStatus} -> ${new_status}).`);
  addLog(db, "Kafka Stream", `Published event USER_STATUS_CHANGE (ID: ${user_id}) to topic 'hris-status-updates'`);

  // Auto-Reclamation Logic: Check licenses assigned to this user and unassign them
  let reclaimedCount = 0;
  let licenseDetails = [];

  db.licenses.forEach(lic => {
    if (lic.assigned_users && lic.assigned_users.includes(user_id)) {
      lic.assigned_users = lic.assigned_users.filter(id => id !== user_id);
      lic.seats_assigned = lic.assigned_users.length;
      reclaimedCount++;
      licenseDetails.push(lic.name);
      
      addLog(db, "Auto-Reclamation Engine", `Automated Rule Triggered: Reclaimed license seat for '${lic.name}' from user ${user_id}.`);
    }
  });

  // Also unassign physical assets assigned to the user
  let physicalReclaimedCount = 0;
  db.assets.forEach(asset => {
    if (asset.assigned_to === user_id) {
      asset.status = "Deployable";
      asset.assigned_to = null;
      asset.date_checked_out = null;
      asset.signature_hash = null;
      asset.sanitization_status = "Pending"; // needs sanitization
      asset.sanitization_method = null;
      physicalReclaimedCount++;
      addLog(db, "Auto-Reclamation Engine", `Asset ${asset.asset_tag} unassigned from departed user ${user_id}. Flagged for Sanitization.`);
    }
  });

  if (reclaimedCount > 0 || physicalReclaimedCount > 0) {
    addLog(db, "Kafka Stream", `Finished auto-reclamation process. Total seats reclaimed: ${reclaimedCount} licenses, ${physicalReclaimedCount} hardware assets.`);
  } else {
    addLog(db, "Auto-Reclamation Engine", `No active software licenses or physical assets found for user ${user_id}.`);
  }

  writeDB(db);
  res.json({
    success: true,
    user,
    licensesReclaimed: reclaimedCount,
    reclaimedLicenses: licenseDetails,
    assetsReclaimed: physicalReclaimedCount
  });
});

// SIMULATION API: AI Diagnostics & Predictive Maintenance (AWS SageMaker mockup)
app.post('/api/simulation/predictive-maintenance', isAdmin, (req, res) => {
  const db = readDB();
  addLog(db, "SageMaker ML", "Started batch inference job on device telemetry data...");

  let criticalCount = 0;
  let warningCount = 0;
  const issuesFound = [];

  db.assets.forEach(asset => {
    // Determine risk based on battery cycles or high temperatures
    let riskScore = 0;
    let failureReasons = [];

    // Laptops check
    if (asset.type === "Laptop") {
      if (asset.battery_cycle_count > 500) {
        riskScore += 45;
        failureReasons.push(`High battery cycle count (${asset.battery_cycle_count})`);
      } else if (asset.battery_cycle_count > 400) {
        riskScore += 25;
        failureReasons.push(`Moderate battery cycle count (${asset.battery_cycle_count})`);
      }

      if (asset.cpu_temp > 80) {
        riskScore += 40;
        failureReasons.push(`Extreme thermal throttling (CPU Temp: ${asset.cpu_temp}°C)`);
      } else if (asset.cpu_temp > 70) {
        riskScore += 20;
        failureReasons.push(`Elevated thermal levels (CPU Temp: ${asset.cpu_temp}°C)`);
      }

      if (asset.disk_usage > 90) {
        riskScore += 15;
        failureReasons.push(`Critical disk space depletion (Disk: ${asset.disk_usage}%)`);
      }
    }

    if (riskScore >= 70) {
      criticalCount++;
      issuesFound.push({ asset_tag: asset.asset_tag, score: riskScore, severity: "Critical", reasons: failureReasons });
      
      // Auto-create maintenance log if one doesn't exist
      const existingTicket = db.maintenance.find(m => m.asset_tag === asset.asset_tag && m.status === "Open");
      if (!existingTicket) {
        const logId = `MNT-${2000 + db.maintenance.length + 1}`;
        const newLog = {
          id: logId,
          asset_tag: asset.asset_tag,
          issue_type: "Thermal / Fan",
          status: "Open",
          technician_notes: `AUTOMATED AI ALERT: High Risk Profile Score (${riskScore}%). Triggered by: ${failureReasons.join(', ')}`,
          timestamp: new Date().toISOString(),
          resolved_at: null
        };
        db.maintenance.push(newLog);
        asset.status = "Under Repair";
        asset.assigned_to = null;
        
        addLog(db, "SageMaker ML", `CRITICAL RISK: Asset ${asset.asset_tag} Failure Probability is ${riskScore}%. Auto-created ticket ${logId}.`);
        addLog(db, "Slack Notification", `🚨 [ITAM-ALERT] Asset ${asset.asset_tag} has a ${riskScore}% chance of imminent failure. Auto-ticket created.`);
      }
    } else if (riskScore >= 40) {
      warningCount++;
      issuesFound.push({ asset_tag: asset.asset_tag, score: riskScore, severity: "Warning", reasons: failureReasons });
      addLog(db, "SageMaker ML", `WARNING: Asset ${asset.asset_tag} Failure Probability is ${riskScore}%. Monitoring closely.`);
    }
  });

  addLog(db, "SageMaker ML", `Batch inference completed. Scanned ${db.assets.length} items. Found ${criticalCount} Critical and ${warningCount} Warning conditions.`);

  writeDB(db);
  res.json({
    success: true,
    scannedCount: db.assets.length,
    criticalCount,
    warningCount,
    issues: issuesFound
  });
});

app.listen(PORT, () => {
  console.log(`InvenTech Prototype Server running on http://localhost:${PORT}`);
});

```

---

### <a id="file-public-index-html"></a>4.3. File: `public/index.html`
**Relative Path:** `public/index.html`  
**Lines of Code:** 958 lines | **File Size:** 41.46 KB  
**Description:** Single-page web interface. Contains the glassmorphic HTML5 structure, dashboard views (Overview, Asset Registry, Digital Handoff, Integrations, ML Diagnostics, Disposals), interactive forms, modal popups for data sanitization, and the printable cryptographic Compliance Certificate.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>InvenTech | IT Asset Management Optimization</title>
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Custom CSS -->
  <link rel="stylesheet" href="css/style.css">
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
</head>
<body>

  <!-- LOGIN SCREEN -->
  <div class="login-overlay" id="login-overlay">
    <div class="login-card">
      <div class="login-logo">
        <div class="logo-icon"><i class="fa-solid fa-cube"></i></div>
        <h1>InvenTech</h1>
      </div>
      <p class="login-subtitle">IT Asset Management System</p>
      <form class="login-form" id="login-form" onsubmit="handleLogin(event)">
        <div class="form-group">
          <label for="login-username">Username</label>
          <input type="text" id="login-username" class="form-input" placeholder="Enter your username" autocomplete="username" required>
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" class="form-input" placeholder="Enter your password" value="demo123" required>
        </div>
        <p class="login-error" id="login-error"></p>
        <button type="submit" class="btn btn-primary login-btn">
          <i class="fa-solid fa-right-to-bracket"></i> Sign In
        </button>
      </form>
      <div class="login-footer">
        <p>&copy; 2026 InvenTech ITAM v2.0 — CCT College</p>
      </div>
    </div>
  </div>

  <!-- LOADING SCREEN -->
  <div class="loading-overlay" id="loading-overlay" style="display:none;">
    <div class="loading-spinner">
      <i class="fa-solid fa-cube"></i>
    </div>
    <div class="loading-text">Initializing InvenTech...</div>
    <div class="loading-bar">
      <div class="loading-bar-inner"></div>
    </div>
  </div>

  <!-- TOAST NOTIFICATIONS -->
  <div class="toast-container" id="toast-container"></div>

  <!-- SIDEBAR OVERLAY (Mobile) -->
  <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleMobileMenu()"></div>

  <div class="app-container" id="app-container" style="display:none;">
    
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo-container">
        <div class="logo-icon"><i class="fa-solid fa-cube"></i></div>
        <div class="logo-text">
          <h1>InvenTech</h1>
          <span>ITAM System v2.0</span>
        </div>
      </div>
      
      <ul class="nav-links">
        <li>
          <a class="nav-item active" data-view="overview">
            <i class="fa-solid fa-chart-pie"></i>
            <span>Overview</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-view="registry">
            <i class="fa-solid fa-boxes-stacked"></i>
            <span>Asset Registry</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-view="handoff">
            <i class="fa-solid fa-signature"></i>
            <span>Digital Handoff</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-view="integrations">
            <i class="fa-solid fa-network-wired"></i>
            <span>Integrations & Sync</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-view="diagnostics">
            <i class="fa-solid fa-microchip"></i>
            <span>ML Diagnostics</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-view="disposal">
            <i class="fa-solid fa-trash-can"></i>
            <span>Disposal & Wipes</span>
          </a>
        </li>
      </ul>
      
      <div class="sidebar-footer">
        <div class="status-badge">
          <div class="status-dot"></div>
          <span>Integration Engine Active</span>
        </div>
        <button class="btn-reset" onclick="resetDemoData()">
          <i class="fa-solid fa-rotate-left"></i> Reset Demo Data
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      
      <!-- HEADER -->
      <header class="content-header">
        <div style="display:flex; align-items:center; gap:1rem;">
          <button class="hamburger-btn" id="hamburger-btn" onclick="toggleMobileMenu()">
            <i class="fa-solid fa-bars"></i>
          </button>
          <div class="header-title">
            <h2 id="view-title">System Overview</h2>
            <p id="view-desc">Real-time status of InvenTech asset infrastructure</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="user-profile" id="user-profile">
            <div class="user-avatar" id="user-avatar">TJ</div>
            <div class="user-info">
              <span class="user-name" id="user-display-name">Tom Jason</span>
              <span class="user-role" id="user-display-role">SCS Faculty</span>
            </div>
            <button class="btn-logout" onclick="handleLogout()">
              <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
          <button class="btn btn-secondary" onclick="refreshData()">
            <i class="fa-solid fa-rotate"></i> Sync Data
          </button>
          <button class="btn btn-primary" onclick="openNewWorkflowModal()">
            <i class="fa-solid fa-plus"></i> Procurement Request
          </button>
        </div>
      </header>

      <!-- VIEW: OVERVIEW -->
      <section id="view-overview" class="dashboard-view active">
        
        <!-- Admin Overview Content -->
        <div id="admin-overview-content">
          <!-- KPI Row -->
          <div class="card-grid">
            <div class="glass-card">
              <div class="card-kpi">
                <div class="kpi-info">
                  <p>Total Hardware Assets</p>
                  <div class="kpi-value" id="kpi-total-assets">-</div>
                </div>
                <div class="kpi-icon"><i class="fa-solid fa-laptop"></i></div>
              </div>
              <div class="kpi-trend trend-up">
                <i class="fa-solid fa-arrow-trend-up"></i> <span>100% Tracking Rate</span>
              </div>
            </div>
            
            <div class="glass-card">
              <div class="card-kpi">
                <div class="kpi-info">
                  <p>Software License Seats</p>
                  <div class="kpi-value" id="kpi-license-seats">-</div>
                </div>
                <div class="kpi-icon"><i class="fa-solid fa-key"></i></div>
              </div>
              <div class="kpi-trend">
                <span id="kpi-license-allocated">-</span> / <span id="kpi-license-total">-</span> seats allocated
              </div>
            </div>

            <div class="glass-card">
              <div class="card-kpi">
                <div class="kpi-info">
                  <p>Pending Approvals</p>
                  <div class="kpi-value" id="kpi-pending-approvals">-</div>
                </div>
                <div class="kpi-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
              </div>
              <div class="kpi-trend trend-down">
                <i class="fa-solid fa-circle-notch fa-spin"></i> <span>Temporal workflow active</span>
              </div>
            </div>

            <div class="glass-card">
              <div class="card-kpi">
                <div class="kpi-info">
                  <p>Staff Time Saved</p>
                  <div class="kpi-value">10 hr</div>
                </div>
                <div class="kpi-icon"><i class="fa-solid fa-clock"></i></div>
              </div>
              <div class="kpi-trend trend-up">
                <i class="fa-solid fa-bolt"></i> <span>Zero Latency CDC Sync</span>
              </div>
            </div>
          </div>

          <div class="panel-grid">
            <!-- Recent Workflows & Queue -->
            <div class="glass-card">
              <div class="panel-header">
                <h3>Active Workflows (Temporal Orchestrator)</h3>
                <span class="badge badge-active">Live state machine tracking</span>
              </div>
              <div class="table-container">
                <table class="custom-table" id="table-workflows">
                  <thead>
                    <tr>
                      <th>Workflow ID</th>
                      <th>Item Requested</th>
                      <th>Qty</th>
                      <th>Total Cost</th>
                      <th>Current State</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Filled by JS -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Quick Statistics -->
            <div class="glass-card">
              <div class="panel-header">
                <h3>Sanitization Status</h3>
              </div>
              <div class="chart-container">
                <canvas id="sanitizationChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Recent Checked Out Assets -->
          <div class="panel-single glass-card">
            <div class="panel-header">
              <h3>Active Hardware Assignments</h3>
              <button class="btn btn-secondary" onclick="switchView('handoff')">
                <i class="fa-solid fa-handshake"></i> Start Handoff Check-out
              </button>
            </div>
            <div class="table-container">
              <table class="custom-table" id="table-active-assignments">
                <thead>
                  <tr>
                    <th>Asset Tag</th>
                    <th>Model</th>
                    <th>Assigned User</th>
                    <th>Email</th>
                    <th>Check-out Date</th>
                    <th>Signature Receipt (Hash)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Filled by JS -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Student Overview Content -->
        <div id="student-overview-content" style="display:none;">
          <!-- KPI Row for Students -->
          <div class="card-grid">
            <div class="glass-card">
              <div class="card-kpi">
                <div class="kpi-info">
                  <p>My Checked Out Hardware</p>
                  <div class="kpi-value" id="student-kpi-assets">0</div>
                </div>
                <div class="kpi-icon"><i class="fa-solid fa-laptop"></i></div>
              </div>
              <div class="kpi-trend trend-up">
                <i class="fa-solid fa-shield-halved"></i> <span>Personally Assigned</span>
              </div>
            </div>
            
            <div class="glass-card">
              <div class="card-kpi">
                <div class="kpi-info">
                  <p>My Software Licenses</p>
                  <div class="kpi-value" id="student-kpi-licenses">0</div>
                </div>
                <div class="kpi-icon"><i class="fa-solid fa-key"></i></div>
              </div>
              <div class="kpi-trend trend-up">
                <i class="fa-solid fa-circle-check"></i> <span>Active Seats</span>
              </div>
            </div>

            <div class="glass-card">
              <div class="card-kpi">
                <div class="kpi-info">
                  <p>Compliance Status</p>
                  <div class="kpi-value">Verified</div>
                </div>
                <div class="kpi-icon"><i class="fa-solid fa-file-shield"></i></div>
              </div>
              <div class="kpi-trend trend-up">
                <i class="fa-solid fa-check"></i> <span>NIST 800-88 Compliant</span>
              </div>
            </div>
          </div>

          <div class="panel-grid">
            <!-- Student Assigned Assets -->
            <div class="glass-card">
              <div class="panel-header">
                <h3>My Assigned Hardware Assets</h3>
              </div>
              <div class="table-container">
                <table class="custom-table" id="student-table-assets">
                  <thead>
                    <tr>
                      <th>Asset Tag</th>
                      <th>Model</th>
                      <th>Serial Number</th>
                      <th>Checkout Date</th>
                      <th>Security Receipt (Hash)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Filled by JS -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Student Assigned Licenses -->
            <div class="glass-card">
              <div class="panel-header">
                <h3>My Software Licenses</h3>
              </div>
              <div class="table-container">
                <table class="custom-table" id="student-table-licenses">
                  <thead>
                    <tr>
                      <th>License Name</th>
                      <th>License Key</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Filled by JS -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Accountability Policy Panel -->
          <div class="panel-single glass-card" style="margin-top: 1.5rem;">
            <div class="panel-header">
              <h3>Digital Handoff & Security Accountability Policy</h3>
            </div>
            <div style="padding: 1rem 0; display:flex; flex-direction:column; gap:0.75rem; font-size:0.95rem; line-height:1.6;">
              <p>As a student of CCT College, you are personally responsible for the custody and safe handling of all IT hardware and software licenses assigned to you. By signing the digital handover signature pad upon checkout, you agree to the following conditions:</p>
              <ul style="margin-left: 2rem; display:flex; flex-direction:column; gap:0.5rem;">
                <li><strong>Equipment Security:</strong> You must not leave physical equipment unattended in public SCS labs or classrooms.</li>
                <li><strong>Software Licensing:</strong> Assigned license keys are for academic work on verified CCT assets only. Shared use or relocation of keys is strictly prohibited.</li>
                <li><strong>Decommission & Sanitization:</strong> Upon course graduation or status change, all assigned hardware must be checked back in. Assets will undergo standard NIST 800-88 data sanitization to scrub personal data.</li>
                <li><strong>Cryptographic Verification:</strong> Checkouts generate an immutable SHA256 receipt hash, establishing an audit trail in the PostgreSQL relational system.</li>
              </ul>
            </div>
          </div>
        </div>

      </section>

      <!-- VIEW: REGISTRY -->
      <section id="view-registry" class="dashboard-view">
        <div class="panel-single glass-card">
          <div class="panel-header">
            <h3>Hardware Asset Inventory (PostgreSQL database simulator)</h3>
            <div class="header-actions">
              <button class="btn btn-secondary" onclick="openNewAssetModal()">
                <i class="fa-solid fa-plus"></i> Add Physical Asset
              </button>
            </div>
          </div>
          
          <div class="table-container">
            <table class="custom-table" id="table-full-assets">
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Serial Number</th>
                  <th>Model</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Sanitization</th>
                  <th>Signature Hash</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <!-- Filled by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- VIEW: HANDOFF -->
      <section id="view-handoff" class="dashboard-view">
        <div class="panel-grid">
          <!-- Handoff signature form -->
          <div class="glass-card">
            <div class="panel-header">
              <h3>Digital Handover sign-off (E-Signature Module)</h3>
            </div>
            
            <form id="form-checkout" class="simulator-panel" onsubmit="handleCheckoutSubmit(event)">
              <div class="form-group">
                <label for="checkout-asset">Select Hardware Asset to Deploy</label>
                <select id="checkout-asset" class="form-input" required>
                  <!-- Filled by JS -->
                </select>
              </div>

              <div class="form-group">
                <label for="checkout-user">Select Student / Faculty Member</label>
                <select id="checkout-user" class="form-input" required>
                  <!-- Filled by JS -->
                </select>
              </div>

              <div class="form-group">
                <label>Signee Digital E-Signature (Touch/Mouse/Trackpad)</label>
                <div class="signature-area">
                  <canvas id="sig-canvas"></canvas>
                </div>
                <div class="signature-actions">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="clearSignatureCanvas()">
                    Clear Canvas
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary">
                Verify Signature & Complete Checkout
              </button>
            </form>
          </div>

          <!-- Details / Explanation -->
          <div class="glass-card" style="display:flex; flex-direction:column; gap:1rem;">
            <h3>Digital Accountability Policy</h3>
            <p>To comply with standard IT auditing rules, <strong>paper receipts have been entirely deprecated</strong>.</p>
            <p>Every equipment handoff requires an interactive **E-Signature** which is merged with transaction timestamp and security credentials to generate a unique SHA256 cryptographic receipt hash.</p>
            <div style="background: rgba(255,255,255,0.03); border: 1px dashed var(--border-color); padding: 1rem; border-radius: 8px; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.4;">
              <span style="color:var(--primary); font-weight:600;">Security Audit Trace:</span><br>
              - Unique barcoded Asset Tag<br>
              - Federated Active Directory ID<br>
              - Cryptographic signature data<br>
              - Hash stored permanently in PostgreSQL Core
            </div>
            <p style="color:var(--text-muted); font-size:0.85rem;">
              <i class="fa-solid fa-shield-halved"></i> Audit trail records are tamper-proof once signature receipt is saved.
            </p>
          </div>
        </div>
      </section>

      <!-- VIEW: INTEGRATIONS -->
      <section id="view-integrations" class="dashboard-view">
        <div class="panel-grid">
          <!-- Simulation triggers -->
          <div class="simulator-panel">
            <!-- HRIS Simulator -->
            <div class="glass-card">
              <div class="panel-header">
                <h3>HRIS status Change Simulator</h3>
                <span class="badge badge-active">Real-time Webhook</span>
              </div>
              <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom: 1rem;">
                Simulates a student graduating or employee leaving. The CDC/Debezium connector intercepts the DB row change, pushing an event to Kafka which reclaims their licenses in &lt;1 hour.
              </p>
              
              <form id="form-hris-sync" onsubmit="handleHrisSubmit(event)" style="display:flex; flex-direction:column; gap:1rem;">
                <div class="form-group">
                  <label for="hris-user">Select Student/Faculty Profile</label>
                  <select id="hris-user" class="form-input" required>
                    <!-- Filled by JS -->
                  </select>
                </div>
                <div class="form-group">
                  <label for="hris-status">Set Status in HRIS Database</label>
                  <select id="hris-status" class="form-input" required>
                    <option value="Graduated">Graduated (Reclaim all resources)</option>
                    <option value="Inactive">Inactive/Terminated (Reclaim all resources)</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-danger">
                  <i class="fa-solid fa-shuffle"></i> Trigger Status Update (CDC Sync)
                </button>
              </form>
            </div>

            <!-- Procurement Simulator -->
            <div class="glass-card">
              <div class="panel-header">
                <h3>Procurement Intake Simulator</h3>
                <span class="badge badge-pending">Nightly Batch</span>
              </div>
              <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom: 1rem;">
                Triggers a simulated purchase request to the procurement workflow. Once approved by the manager, a Temporal state engine auto-registers it into Snipe-IT.
              </p>
              
              <form id="form-procurement" onsubmit="handleProcurementSubmit(event)" style="display:flex; flex-direction:column; gap:1rem;">
                <div class="form-group">
                  <label for="proc-item">Item Name</label>
                  <select id="proc-item" class="form-input">
                    <option value="ThinkPad L14 Gen 4">ThinkPad L14 Gen 4 Laptop</option>
                    <option value="iPad Pro 11-inch">iPad Pro 11-inch Tablet</option>
                    <option value="Dell OptiPlex 7010">Dell OptiPlex 7010 Desktop</option>
                  </select>
                </div>
                <div class="form-row" style="display:flex; gap:1rem;">
                  <div class="form-group" style="flex:1;">
                    <label for="proc-qty">Quantity</label>
                    <input type="number" id="proc-qty" class="form-input" value="3" min="1" max="10">
                  </div>
                  <div class="form-group" style="flex:1;">
                    <label for="proc-cost">Cost (₱)</label>
                    <input type="number" id="proc-cost" class="form-input" value="195000">
                  </div>
                </div>
                <button type="submit" class="btn btn-primary">
                  <i class="fa-solid fa-cart-shopping"></i> Submit Purchase Request
                </button>
              </form>
            </div>
          </div>

          <!-- Kafka/Debezium Logs window -->
          <div class="glass-card">
            <div class="panel-header">
              <h3>Unified Integration Engine Output (Debezium + Kafka)</h3>
              <button class="btn btn-secondary btn-sm" onclick="clearLogs()">Clear Console</button>
            </div>
            <div class="terminal-window">
              <div class="terminal-header">
                <div class="terminal-dots">
                  <div class="dot dot-red"></div>
                  <div class="dot dot-yellow"></div>
                  <div class="dot dot-green"></div>
                </div>
                <div class="terminal-title">bash - InvenTech CDC Listener</div>
              </div>
              <div class="terminal-body" id="log-terminal">
                <!-- Log streams appended here -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- VIEW: DIAGNOSTICS -->
      <section id="view-diagnostics" class="dashboard-view">
        <div class="panel-grid">
          <!-- ML Diagnostics control -->
          <div class="glass-card" style="display:flex; flex-direction:column; gap:1.25rem;">
            <div class="panel-header">
              <h3>AI-based Predictive Maintenance</h3>
              <span class="badge badge-active">SageMaker Engine</span>
            </div>
            <p>
              InvenTech uses automated failure prediction to transition from reactive repairs to proactive support.
            </p>
            <p style="color:var(--text-muted); font-size:0.85rem;">
              The ML algorithm scans device metrics (e.g. CPU operating temperatures and battery cycle capacity logs) from InfluxDB to compute an active <strong>Failure Risk Score</strong>.
            </p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem; display:flex; flex-direction:column; gap:0.75rem;">
              <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                <span>Inference Model status:</span>
                <span class="badge badge-active">Model Loaded</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                <span>Input telemetries:</span>
                <span>InfluxDB (MDM streams)</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                <span>Proactive Alert Channel:</span>
                <span>Slack webhook endpoint</span>
              </div>
            </div>

            <button class="btn btn-primary" onclick="runMlInference()">
              <i class="fa-solid fa-brain"></i> Trigger SageMaker Inference Job
            </button>
          </div>

          <!-- Active Telemetry Visualizer -->
          <div class="glass-card">
            <div class="panel-header">
              <h3>Live Telemetry Monitor (InfluxDB time-series DB)</h3>
              <select id="telemetry-asset-select" class="form-input" style="padding:0.4rem 0.8rem; font-size:0.8rem;" onchange="updateTelemetryChart()">
                <!-- Filled by JS -->
              </select>
            </div>
            <div class="chart-container" style="height:250px;">
              <canvas id="telemetryChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Devices risk metrics -->
        <div class="panel-single glass-card">
          <div class="panel-header">
            <h3>Device Diagnostics & Risk Catalog</h3>
          </div>
          <div class="table-container">
            <table class="custom-table" id="table-device-risk">
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Model</th>
                  <th>Battery Cycles</th>
                  <th>CPU Temperature</th>
                  <th>Disk Space Used</th>
                  <th>Diagnostic Health Status</th>
                  <th>Action Needed</th>
                </tr>
              </thead>
              <tbody>
                <!-- Filled by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- VIEW: DISPOSAL & WIPES -->
      <section id="view-disposal" class="dashboard-view">
        <div class="panel-grid">
          <!-- Retired equipment to dispose -->
          <div class="glass-card">
            <div class="panel-header">
              <h3>Equipment Awaiting Final Disposal</h3>
              <span class="badge badge-repair">Sanitization required</span>
            </div>
            <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1.25rem;">
              Before an asset can be finalized for physical disposal or recycling, standard data scrubbing must be verified. Once verified, the Compliance Officer must sign off.
            </p>
            <div class="table-container">
              <table class="custom-table" id="table-retired-assets">
                <thead>
                  <tr>
                    <th>Asset Tag</th>
                    <th>Model</th>
                    <th>Sanitization</th>
                    <th>Method</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Filled by JS -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- History of Finalized Disposals -->
          <div class="glass-card">
            <div class="panel-header">
              <h3>Disposal & Decommission Logs</h3>
            </div>
            <div class="table-container">
              <table class="custom-table" id="table-disposal-records">
                <thead>
                  <tr>
                    <th>Record ID</th>
                    <th>Asset Tag</th>
                    <th>Officer</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Filled by JS -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

    </main>

  </div>

  <!-- MODAL: NEW WORKFLOW -->
  <div class="modal" id="modal-workflow">
    <div class="modal-content">
      <button class="modal-close" onclick="closeWorkflowModal()">&times;</button>
      <div class="modal-header">
        <h3>Initiate Procurement Workflow</h3>
      </div>
      <form id="form-modal-procurement" onsubmit="handleModalProcurementSubmit(event)" style="display:flex; flex-direction:column; gap:1.25rem;">
        <div class="form-group">
          <label for="modal-proc-item">Item Description</label>
          <input type="text" id="modal-proc-item" class="form-input" placeholder="e.g. ThinkPad L14 Gen 4" required>
        </div>
        <div class="form-group">
          <label for="modal-proc-qty">Quantity</label>
          <input type="number" id="modal-proc-qty" class="form-input" min="1" value="5" required>
        </div>
        <div class="form-group">
          <label for="modal-proc-cost">Total Estimated Cost (₱)</label>
          <input type="number" id="modal-proc-cost" class="form-input" value="325000" required>
        </div>
        <div class="form-group">
          <label for="modal-proc-by">Requested By</label>
          <input type="text" id="modal-proc-by" class="form-input" value="IT Asset Team" required>
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top:0.5rem;">
          Start Temporal Workflow Process
        </button>
      </form>
    </div>
  </div>

  <!-- MODAL: NEW ASSET -->
  <div class="modal" id="modal-asset">
    <div class="modal-content">
      <button class="modal-close" onclick="closeAssetModal()">&times;</button>
      <div class="modal-header">
        <h3>Register New Physical Asset</h3>
      </div>
      <form id="form-modal-asset" onsubmit="handleModalAssetSubmit(event)" style="display:flex; flex-direction:column; gap:1.25rem;">
        <div class="form-group">
          <label for="modal-asset-tag">Asset Tag Code</label>
          <input type="text" id="modal-asset-tag" class="form-input" placeholder="CCT-LPT-XXX" required>
        </div>
        <div class="form-group">
          <label for="modal-asset-serial">Serial Number</label>
          <input type="text" id="modal-asset-serial" class="form-input" placeholder="SN-XXXXX" required>
        </div>
        <div class="form-group">
          <label for="modal-asset-model">Equipment Model</label>
          <input type="text" id="modal-asset-model" class="form-input" placeholder="ThinkPad L14 Gen 4" required>
        </div>
        <div class="form-group">
          <label for="modal-asset-type">Asset Type</label>
          <select id="modal-asset-type" class="form-input" required>
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
            <option value="Tablet">Tablet</option>
            <option value="Accessory">Accessory</option>
          </select>
        </div>
        <div class="form-group">
          <label for="modal-asset-loc">Physical Location</label>
          <input type="text" id="modal-asset-loc" class="form-input" value="IT Storage Room" required>
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top:0.5rem;">
          Write Asset to PostgreSQL
        </button>
      </form>
    </div>
  </div>

  <!-- MODAL: SANITIZE -->
  <div class="modal" id="modal-sanitize">
    <div class="modal-content">
      <button class="modal-close" onclick="closeSanitizeModal()">&times;</button>
      <div class="modal-header">
        <h3>Asset Data Sanitization Checklist</h3>
      </div>
      <form id="form-modal-sanitize" onsubmit="handleModalSanitizeSubmit(event)" style="display:flex; flex-direction:column; gap:1.25rem;">
        <input type="hidden" id="sanitize-asset-id">
        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.4;">
          Ensure compliance guidelines are strictly followed. Data must be sanitized before checking out this equipment again or marking it for disposal.
        </p>
        <div class="form-group">
          <label for="sanitize-method">Sanitization Standard</label>
          <select id="sanitize-method" class="form-input" required>
            <option value="NIST 800-88 Clear (ATA Overwrite)">NIST 800-88 Clear (ATA Overwrite)</option>
            <option value="NIST 800-88 Purge (Cryptographic Erase)">NIST 800-88 Purge (Cryptographic Erase)</option>
            <option value="DoD 5220.22-M (3 passes)">DoD 5220.22-M (3 passes)</option>
          </select>
        </div>
        
        <div style="background:rgba(255,255,255,0.02); padding:1rem; border-radius:8px; border:1px solid var(--border-color); display:flex; flex-direction:column; gap:0.5rem; font-size:0.85rem;">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <input type="checkbox" id="check-bios" required>
            <label for="check-bios">Verify UEFI/BIOS password lock is removed</label>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <input type="checkbox" id="check-mdm" required>
            <label for="check-mdm">Remove device record from Intune/Jamf MDM enrollment</label>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <input type="checkbox" id="check-firmware" required>
            <label for="check-firmware">Verify full firmware-wipe complete</label>
          </div>
        </div>

        <button type="submit" class="btn btn-primary">
          Log Sanitization Certificate
        </button>
      </form>
    </div>
  </div>

  <!-- MODAL: FINAL DISPOSE -->
  <div class="modal" id="modal-dispose">
    <div class="modal-content">
      <button class="modal-close" onclick="closeDisposeModal()">&times;</button>
      <div class="modal-header">
        <h3>Final Decommission & Disposal Sign-off</h3>
      </div>
      <form id="form-modal-dispose" onsubmit="handleModalDisposeSubmit(event)" style="display:flex; flex-direction:column; gap:1.25rem;">
        <input type="hidden" id="dispose-asset-id">
        
        <div class="form-group">
          <label for="dispose-officer">Compliance Officer Name</label>
          <input type="text" id="dispose-officer" class="form-input" value="Dr. Joy dela Cruz" required>
        </div>

        <div style="background:rgba(255,255,255,0.02); padding:1rem; border-radius:8px; border:1px solid var(--border-color); font-size:0.85rem; display:flex; flex-direction:column; gap:0.4rem;">
          <div style="display:flex; justify-content:space-between;">
            <span>Asset Tag:</span>
            <strong id="dispose-info-tag">-</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Serial:</span>
            <strong id="dispose-info-serial">-</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Sanitization Standard:</span>
            <strong id="dispose-info-sanitize" style="color:var(--success);">-</strong>
          </div>
        </div>

        <div class="form-group">
          <label>Compliance Officer E-Signature Sign-off</label>
          <div class="signature-area">
            <canvas id="disp-sig-canvas"></canvas>
          </div>
          <div class="signature-actions">
            <button type="button" class="btn btn-secondary btn-sm" onclick="clearDispSignatureCanvas()">
              Clear Canvas
            </button>
          </div>
        </div>

        <button type="submit" class="btn btn-danger">
          <i class="fa-solid fa-file-shield"></i> Finalize Disposal & Generate Audit Certificate
        </button>
      </form>
    </div>
  </div>

  <!-- MODAL: COMPLIANCE CERTIFICATE PREVIEW -->
  <div class="modal" id="modal-certificate">
    <div class="modal-content" style="width: 650px; background:#0b0e1b; border: 2px solid var(--border-glow); box-shadow: 0 0 30px rgba(59,130,246,0.25);">
      <button class="modal-close" onclick="closeCertificateModal()">&times;</button>
      
      <div style="border: 2px double rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; position:relative; overflow:hidden;">
        <!-- Watermark -->
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-45deg); font-size:5.5rem; font-weight:800; color:rgba(255,255,255,0.015); pointer-events:none; letter-spacing:10px;">
          SANITIZED
        </div>
        
        <div style="text-align:center; margin-bottom:1.5rem;">
          <div style="width: 60px; height: 60px; background: rgba(16,185,129,0.15); border-radius: 50%; display:inline-flex; align-items:center; justify-content:center; color:var(--success); border:1px solid var(--success); font-size:1.8rem; margin-bottom:0.75rem;">
            <i class="fa-solid fa-file-shield"></i>
          </div>
          <h2 style="font-family:'Outfit'; font-size:1.6rem; font-weight:700; letter-spacing:-0.5px; color:#fff;">CERTIFICATE OF DATA SANITIZATION</h2>
          <p style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:0.25rem;">NIST 800-88 Compliance Audit Record</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.9rem; margin-bottom:2rem; border-top:1px solid rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.05); padding:1.25rem 0;">
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Certificate ID:</span>
            <strong id="cert-id" style="font-family:var(--font-mono); color:var(--secondary);">-</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Asset Description:</span>
            <strong id="cert-model">-</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Asset Tag Code:</span>
            <strong><code id="cert-tag" style="background:rgba(255,255,255,0.05); padding:0.1rem 0.4rem; border-radius:4px;">-</code></strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Hardware Serial:</span>
            <strong id="cert-serial">-</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Sanitization Standard:</span>
            <strong id="cert-method" style="color:var(--success);">-</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Decommission Date:</span>
            <strong id="cert-date">-</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Certified By:</span>
            <strong id="cert-officer">-</strong>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <p style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Verification Hash</p>
            <code id="cert-hash" style="font-size:0.72rem; color:var(--text-muted); display:block; margin-top:0.25rem; font-family:var(--font-mono);">-</code>
          </div>
          <div style="text-align:right; border-top:1px solid rgba(255,255,255,0.1); padding-top:0.5rem; width:150px;">
            <div style="height:35px; overflow:hidden; opacity:0.85;" id="cert-signature-draw">
              <span style="font-family:'Courier New', monospace; font-size:0.8rem; font-style:italic; color:var(--primary);">[DIGITAL SIGN]</span>
            </div>
            <p style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:0.25rem;">Compliance Sign-off</p>
          </div>
        </div>
      </div>
      
      <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
        <button class="btn btn-secondary" onclick="closeCertificateModal()">Close Preview</button>
        <button class="btn btn-primary" onclick="window.print()"><i class="fa-solid fa-print"></i> Print Certificate</button>
      </div>
    </div>
  </div>

  <!-- Custom App JS -->
  <script src="js/app.js"></script>
</body>
</html>

```

---

### <a id="file-public-css-style-css"></a>4.4. File: `public/css/style.css`
**Relative Path:** `public/css/style.css`  
**Lines of Code:** 1237 lines | **File Size:** 23.20 KB  
**Description:** Main application stylesheet. Employs a premium glassmorphic dark-theme design system using CSS custom properties, responsive flex/grid layouts, smooth animations, and styling for interactive components like the signature canvas, logs terminal, and modals.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --bg-dark: #070913;
  --bg-card: rgba(17, 22, 43, 0.65);
  --bg-card-hover: rgba(26, 32, 62, 0.8);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-glow: rgba(59, 130, 246, 0.25);
  
  --primary: #3b82f6;
  --primary-glow: rgba(59, 130, 246, 0.5);
  --secondary: #06b6d4;
  --accent: #8b5cf6;
  
  --text-main: #f3f4f6;
  --text-muted: #9ca3af;
  --text-dark: #4b5563;
  
  --success: #10b981;
  --success-bg: rgba(16, 185, 129, 0.15);
  --warning: #f59e0b;
  --warning-bg: rgba(245, 158, 11, 0.15);
  --danger: #ef4444;
  --danger-bg: rgba(239, 68, 68, 0.15);
  
  --transition-speed: 0.3s;
  --font-sans: 'Outfit', 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-main);
  font-family: var(--font-sans);
  min-height: 100vh;
  overflow-x: hidden;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 40%);
  background-attachment: fixed;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-dark);
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Layout */
.app-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar styling */
.sidebar {
  width: 280px;
  background: rgba(9, 11, 23, 0.85);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--border-color);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 3rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px var(--primary-glow);
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
}

.logo-text h1 {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #ffffff, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-text span {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-muted);
  display: block;
}

.nav-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  border: 1px solid transparent;
}

.nav-item i {
  font-size: 1.2rem;
  transition: all var(--transition-speed) ease;
}

.nav-item:hover, .nav-item.active {
  color: #fff;
  background: var(--bg-card-hover);
  border-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.nav-item.active {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.05));
  border-color: var(--border-glow);
  color: var(--primary);
}

.nav-item.active i {
  color: var(--primary);
  filter: drop-shadow(0 0 5px var(--primary-glow));
}

.sidebar-footer {
  margin-top: auto;
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: var(--success);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--success);
  animation: pulse 2s infinite;
}

/* Main Content area */
.main-content {
  flex-grow: 1;
  margin-left: 280px;
  padding: 2.5rem;
  max-width: 1600px;
  width: calc(100% - 280px);
}

header.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.header-title h2 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-title p {
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all var(--transition-speed) ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #fff;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger);
  border-color: rgba(239, 68, 68, 0.3);
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.3);
  transform: translateY(-2px);
}

/* Glass Cards */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all var(--transition-speed) ease;
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: transparent;
  transition: all var(--transition-speed) ease;
}

.glass-card:hover {
  background: var(--bg-card-hover);
  transform: translateY(-4px);
  border-color: var(--border-glow);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1);
}

.glass-card:hover::before {
  background: linear-gradient(95deg, var(--primary), var(--secondary));
}

.card-kpi {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.kpi-info p {
  color: var(--text-muted);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.kpi-value {
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 0.5rem;
  letter-spacing: -1px;
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--primary);
}

.kpi-trend {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trend-up { color: var(--success); }
.trend-down { color: var(--danger); }

/* Dashboard Sections */
.dashboard-view {
  display: none; /* hidden by default, toggled via JS */
  animation: fadeIn 0.4s ease-in-out forwards;
}

.dashboard-view.active {
  display: block;
}

/* Tables and Panels */
.panel-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.panel-single {
  width: 100%;
  margin-bottom: 2rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.panel-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

/* Custom Table Design */
.table-container {
  overflow-x: auto;
}

table.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

table.custom-table th {
  padding: 1rem;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color);
}

table.custom-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.9rem;
}

table.custom-table tbody tr {
  transition: background var(--transition-speed) ease;
}

table.custom-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

/* Badges */
.badge {
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.badge-active, .badge-deployable, .badge-resolved, .badge-verified, .badge-registered {
  background: var(--success-bg);
  color: var(--success);
}

.badge-pending, .badge-approval, .badge-ordered {
  background: var(--warning-bg);
  color: var(--warning);
}

.badge-repair, .badge-critical, .badge-rejected {
  background: var(--danger-bg);
  color: var(--danger);
}

/* Simulator / Live log window */
.terminal-window {
  background: #02040a;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-family: var(--font-mono);
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
}

.terminal-header {
  background: #0d1117;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.terminal-dots {
  display: flex;
  gap: 0.35rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-red { background: #ef4444; }
.dot-yellow { background: #f59e0b; }
.dot-green { background: #10b981; }

.terminal-title {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.terminal-body {
  padding: 1.25rem;
  height: 350px;
  overflow-y: auto;
  font-size: 0.85rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-entry {
  display: flex;
  gap: 0.75rem;
  animation: slideInLeft 0.2s ease-out;
}

.log-time {
  color: var(--text-dark);
  white-space: nowrap;
}

.log-type {
  color: var(--primary);
  font-weight: 600;
  min-width: 140px;
  display: inline-block;
}

.log-msg {
  color: #e5e7eb;
  word-break: break-all;
}

/* Simulation Control Panel */
.simulator-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
}

.form-input, select.form-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all var(--transition-speed) ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
}

/* E-Signature Canvas styling */
.signature-area {
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  background: rgba(0,0,0,0.3);
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

canvas#sig-canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.signature-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-15px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Chart Canvas container */
.chart-container {
  position: relative;
  height: 220px;
  width: 100%;
}

/* Modals */
.modal {
  display: none;
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.modal.active {
  display: flex;
}

.modal-content {
  background: #0e1222;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: 500px;
  max-width: 90%;
  padding: 2rem;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.25rem;
}

.modal-header h3 {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
}

/* Workflow Stage Indicator */
.workflow-stages {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 2rem 0;
  padding: 0 1rem;
}

.workflow-stages::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 20px;
  right: 20px;
  height: 3px;
  background: var(--border-color);
  z-index: 1;
}

.workflow-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  font-size: 0.8rem;
  color: var(--text-muted);
  width: 80px;
  text-align: center;
}

.stage-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-dark);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.workflow-stage.active .stage-dot {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 0 15px var(--primary-glow);
}

.workflow-stage.complete .stage-dot {
  background: var(--success-bg);
  border-color: var(--success);
  color: var(--success);
}

.workflow-stage.active {
  color: #fff;
  font-weight: 600;
}

/* ===== LOGIN SCREEN ===== */
.login-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: var(--bg-dark);
  background-image:
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.10) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.06) 0%, transparent 60%);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.5s ease;
}

.login-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

.login-card {
  background: var(--bg-card);
  backdrop-filter: blur(24px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 3rem;
  width: 420px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.08);
  animation: loginSlideUp 0.6s ease-out;
}

@keyframes loginSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  justify-content: center;
}

.login-logo .logo-icon {
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
}

.login-logo h1 {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #ffffff, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-subtitle {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 2rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-form .form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.login-form .form-input {
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  border-radius: 12px;
}

.login-error {
  color: var(--danger);
  font-size: 0.85rem;
  text-align: center;
  min-height: 1.25rem;
}

.login-btn {
  width: 100%;
  padding: 0.9rem;
  font-size: 1rem;
  border-radius: 12px;
  margin-top: 0.5rem;
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-size: 0.75rem;
}

/* ===== LOADING / SPLASH SCREEN ===== */
.loading-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: var(--bg-dark);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  transition: opacity 0.6s ease;
}

.loading-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

.loading-spinner {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: #fff;
  box-shadow: 0 0 30px var(--primary-glow);
  animation: loadingPulse 1.5s ease-in-out infinite;
}

@keyframes loadingPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px var(--primary-glow); }
  50% { transform: scale(1.08); box-shadow: 0 0 40px var(--primary-glow); }
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.loading-bar {
  width: 200px;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.loading-bar-inner {
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 4px;
  animation: loadingSlide 1.2s ease-in-out infinite;
}

@keyframes loadingSlide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

/* ===== TOAST NOTIFICATIONS ===== */
.toast-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 11000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.toast {
  background: rgba(14, 18, 34, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  min-width: 340px;
  max-width: 420px;
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  pointer-events: all;
  animation: toastSlideIn 0.35s ease-out;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.toast.toast-exit {
  animation: toastSlideOut 0.3s ease-in forwards;
}

@keyframes toastSlideIn {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes toastSlideOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(40px); }
}

.toast-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-success .toast-icon { background: var(--success-bg); color: var(--success); }
.toast-error .toast-icon { background: var(--danger-bg); color: var(--danger); }
.toast-info .toast-icon { background: rgba(59, 130, 246, 0.15); color: var(--primary); }

.toast-body {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.15rem;
}

.toast-message {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.4;
  word-break: break-word;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.toast-close:hover { opacity: 1; }

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  border-radius: 0 0 14px 14px;
  animation: toastProgress 4s linear forwards;
}

.toast-success .toast-progress { background: var(--success); }
.toast-error .toast-progress { background: var(--danger); }
.toast-info .toast-progress { background: var(--primary); }

.toast-success { border-left: 3px solid var(--success); }
.toast-error { border-left: 3px solid var(--danger); }
.toast-info { border-left: 3px solid var(--primary); }

@keyframes toastProgress {
  from { width: 100%; }
  to { width: 0%; }
}

/* ===== USER PROFILE HEADER ===== */
.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: #fff;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-main);
  line-height: 1.2;
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.btn-logout {
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.2);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* ===== HAMBURGER MENU (Mobile) ===== */
.hamburger-btn {
  display: none;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-overlay.active {
  opacity: 1;
}

/* ===== RESET BUTTON ===== */
.btn-reset {
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.08);
  color: var(--warning);
  border: 1px solid rgba(245, 158, 11, 0.15);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  margin-top: 0.75rem;
}

.btn-reset:hover {
  background: rgba(245, 158, 11, 0.15);
  transform: translateY(-1px);
}

/* ===== RESPONSIVE LAYOUT ===== */

/* Tablet breakpoint */
@media (max-width: 1200px) {
  .panel-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 1024px) {
  .hamburger-btn {
    display: flex;
  }

  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 200;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
  }

  .main-content {
    margin-left: 0;
    width: 100%;
    padding: 1.5rem;
  }

  .panel-grid {
    grid-template-columns: 1fr;
  }

  header.content-header {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header-actions {
    flex-wrap: wrap;
  }
}

/* Mobile breakpoint */
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .main-content {
    padding: 1rem;
  }

  .header-title h2 {
    font-size: 1.4rem;
  }

  .kpi-value {
    font-size: 1.75rem;
  }

  .glass-card {
    padding: 1.15rem;
    border-radius: 14px;
  }

  .btn {
    padding: 0.6rem 1rem;
    font-size: 0.82rem;
  }

  .toast {
    min-width: 280px;
    max-width: calc(100vw - 2rem);
  }

  .toast-container {
    right: 0.75rem;
    top: 0.75rem;
  }

  .user-info {
    display: none;
  }

  .modal-content {
    padding: 1.5rem;
    border-radius: 16px;
  }
}

@media (max-width: 480px) {
  .card-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn {
    flex: 1;
    justify-content: center;
  }

  .login-card {
    padding: 2rem 1.5rem;
  }
}

```

---

### <a id="file-public-js-app-js"></a>4.5. File: `public/js/app.js`
**Relative Path:** `public/js/app.js`  
**Lines of Code:** 1545 lines | **File Size:** 51.52 KB  
**Description:** Client-side application logic. Controls dynamic UI view switching, handles local signature canvas inputs, processes API requests (fetch), renders reactive charts (using Chart.js), appends live Kafka/Debezium simulation stream logs to the UI terminal, and manages modal lifecycle states.

```javascript
// InvenTech Prototype Client-Side Application Logic

// State management
let state = {
  users: [],
  assets: [],
  licenses: [],
  maintenance: [],
  workflows: [],
  simulation_logs: []
};

// Current logged-in user
let currentUser = null;

// Canvas drawing state
let drawing = false;
let canvas, ctx;

// Charts instances
let sanitizationChartInstance = null;
let telemetryChartInstance = null;

// Selected asset for telemetry chart
let selectedTelemetryAssetTag = '';

// ===== TOAST NOTIFICATION SYSTEM =====
function showToast(type, title, message) {
  const container = document.getElementById('toast-container');
  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${icons[type] || icons.info}"></i></div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  // Auto-remove after 4.5 seconds
  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// ===== LOGIN / LOGOUT SYSTEM =====
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    const result = await response.json();
    if (response.ok) {
      currentUser = result.user;
      sessionStorage.setItem('inventech_user', JSON.stringify(currentUser));
      showAppAfterLogin();
    } else {
      errorEl.textContent = result.error || 'Login failed.';
    }
  } catch (err) {
    errorEl.textContent = 'Connection error. Please try again.';
  }
}

function handleLogout() {
  sessionStorage.removeItem('inventech_user');
  currentUser = null;
  // Restore all sidebar displays
  const navRegistry = document.querySelector('.nav-item[data-view="registry"]');
  const navHandoff = document.querySelector('.nav-item[data-view="handoff"]');
  const navIntegrations = document.querySelector('.nav-item[data-view="integrations"]');
  const navDiagnostics = document.querySelector('.nav-item[data-view="diagnostics"]');
  const navDisposal = document.querySelector('.nav-item[data-view="disposal"]');
  const btnReset = document.querySelector('.btn-reset');
  const btnProcure = document.querySelector('.header-actions button[onclick="openNewWorkflowModal()"]');

  if (navRegistry) navRegistry.parentElement.style.display = 'block';
  if (navHandoff) navHandoff.parentElement.style.display = 'block';
  if (navIntegrations) navIntegrations.parentElement.style.display = 'block';
  if (navDiagnostics) navDiagnostics.parentElement.style.display = 'block';
  if (navDisposal) navDisposal.parentElement.style.display = 'block';
  if (btnReset) btnReset.style.display = 'block';
  if (btnProcure) btnProcure.style.display = 'block';

  // Show login overlay
  document.getElementById('login-overlay').classList.remove('hidden');
  document.getElementById('app-container').style.display = 'none';
  document.getElementById('login-username').value = '';
  document.getElementById('login-error').textContent = '';
}

function showAppAfterLogin() {
  // Hide login, show loading
  document.getElementById('login-overlay').classList.add('hidden');
  document.getElementById('loading-overlay').style.display = 'flex';

  // Update user profile in header
  updateUserProfile();

  // Show/hide sidebar links and header actions based on role
  const isStudent = currentUser.id.startsWith('STU-');
  const navRegistry = document.querySelector('.nav-item[data-view="registry"]');
  const navHandoff = document.querySelector('.nav-item[data-view="handoff"]');
  const navIntegrations = document.querySelector('.nav-item[data-view="integrations"]');
  const navDiagnostics = document.querySelector('.nav-item[data-view="diagnostics"]');
  const navDisposal = document.querySelector('.nav-item[data-view="disposal"]');
  const btnReset = document.querySelector('.btn-reset');
  const btnProcure = document.querySelector('.header-actions button[onclick="openNewWorkflowModal()"]');

  if (isStudent) {
    if (navRegistry) navRegistry.parentElement.style.display = 'none';
    if (navHandoff) navHandoff.parentElement.style.display = 'none';
    if (navIntegrations) navIntegrations.parentElement.style.display = 'none';
    if (navDiagnostics) navDiagnostics.parentElement.style.display = 'none';
    if (navDisposal) navDisposal.parentElement.style.display = 'none';
    if (btnReset) btnReset.style.display = 'none';
    if (btnProcure) btnProcure.style.display = 'none';

    document.getElementById('admin-overview-content').style.display = 'none';
    document.getElementById('student-overview-content').style.display = 'block';
    
    // Default student view is overview
    switchView('overview');
  } else {
    if (navRegistry) navRegistry.parentElement.style.display = 'block';
    if (navHandoff) navHandoff.parentElement.style.display = 'block';
    if (navIntegrations) navIntegrations.parentElement.style.display = 'block';
    if (navDiagnostics) navDiagnostics.parentElement.style.display = 'block';
    if (navDisposal) navDisposal.parentElement.style.display = 'block';
    if (btnReset) btnReset.style.display = 'block';
    if (btnProcure) btnProcure.style.display = 'block';

    document.getElementById('admin-overview-content').style.display = 'block';
    document.getElementById('student-overview-content').style.display = 'none';
  }

  // Load data then show app
  fetchState().then(() => {
    renderAll();
    // Short delay for loading screen effect
    setTimeout(() => {
      document.getElementById('loading-overlay').classList.add('hidden');
      document.getElementById('app-container').style.display = 'flex';
      setTimeout(() => {
        document.getElementById('loading-overlay').style.display = 'none';
      }, 600);
    }, 1200);
  });
}

function updateUserProfile() {
  if (!currentUser) return;
  const names = currentUser.name.split(' ');
  const initials = names.map(n => n[0]).join('').substring(0, 2).toUpperCase();
  document.getElementById('user-avatar').textContent = initials;
  document.getElementById('user-display-name').textContent = currentUser.name;
  document.getElementById('user-display-role').textContent = currentUser.department;
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('mobile-open');
  overlay.classList.toggle('active');
}

// ===== RESET DEMO DATA =====
async function resetDemoData() {
  if (!confirm('Are you sure you want to reset all data back to the original demo state? This cannot be undone.')) {
    return;
  }

  try {
    const response = await fetch('/api/reset', {
      method: 'POST',
      headers: { 'x-user-id': currentUser ? currentUser.id : '' }
    });
    if (response.ok) {
      showToast('success', 'Data Reset', 'Database has been restored to original demo data.');
      await refreshData();
    } else {
      showToast('error', 'Reset Failed', 'Could not reset the database.');
    }
  } catch (err) {
    showToast('error', 'Connection Error', 'Failed to connect to the server.');
  }
}

// On Document Load
document.addEventListener('DOMContentLoaded', () => {
  // Check for existing session
  const savedUser = sessionStorage.getItem('inventech_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showAppAfterLogin();
  }

  // Navigation handling
  setupNavigation();
  
  // Initialize E-Signature canvas
  setupSignaturePad();
  
  // Set up periodic sync to show background workflow updates
  setInterval(refreshDataSilent, 3000);
});

// Navigation Switcher
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetView = item.getAttribute('data-view');
      switchView(targetView);
    });
  });
}

function switchView(viewName) {
  // Update nav UI
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.getAttribute('data-view') === viewName) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Update views
  document.querySelectorAll('.dashboard-view').forEach(view => {
    if (view.id === `view-${viewName}`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Set titles
  const viewTitles = {
    overview: { title: "System Overview", desc: "Real-time status of InvenTech asset infrastructure" },
    registry: { title: "Hardware Registry", desc: "View and manage all active physical assets in the PostgreSQL database" },
    handoff: { title: "Digital Handoff Module", desc: "Perform secure equipment assignments with digital sign-offs" },
    integrations: { title: "Integration Control Panel", desc: "Simulate CDC/Kafka data flows and automated license reclamation" },
    diagnostics: { title: "AI Analytics & Diagnostics", desc: "Monitor live device telemetries and execute predictive failure inference" },
    disposal: { title: "Asset Decommissioning", desc: "Enforce sanitization protocols and sign off physical asset disposal" }
  };

  const titleConfig = viewTitles[viewName] || { title: "InvenTech", desc: "IT Asset Management" };
  document.getElementById('view-title').textContent = titleConfig.title;
  document.getElementById('view-desc').textContent = titleConfig.desc;

  // Render view-specific setups
  if (viewName === 'handoff') {
    resizeSignatureCanvas();
  }
  if (viewName === 'overview') {
    renderSanitizationChart();
  }
  if (viewName === 'diagnostics') {
    setTimeout(renderTelemetryChart, 100);
  }
  if (viewName === 'disposal') {
    renderDisposalView();
    resizeDispSignatureCanvas();
  }
}

// Data Fetching and UI Rendering
async function refreshData() {
  await fetchState();
  renderAll();
}

async function refreshDataSilent() {
  await fetchState();
  renderAllSilent();
}

async function fetchState() {
  try {
    const headers = {};
    if (currentUser) {
      headers['x-user-id'] = currentUser.id;
    }
    const response = await fetch('/api/data', { headers });
    if (response.ok) {
      state = await response.json();
    }
  } catch (err) {
    console.error("Failed to load application state:", err);
  }
}

// Full Render with Charts
function renderAll() {
  renderKPIs();
  renderWorkflowsTable();
  renderActiveAssignmentsTable();
  renderFullAssetsTable();
  renderHandoffDropdowns();
  renderIntegrationsView();
  renderDiagnosticsView();
  renderSanitizationChart();
  renderTelemetryChart();
  renderDisposalView();
  renderStudentDashboard();
}

// Light Render (preserves form states and selections)
function renderAllSilent() {
  renderKPIs();
  renderWorkflowsTable();
  renderActiveAssignmentsTable();
  renderFullAssetsTable();
  renderLogsTerminal();
  updateHandoffDropdownsSilent();
  updateIntegrationUsersSilent();
  updateDiagnosticsTable();
  renderDisposalViewSilent();
  renderStudentDashboard();
}

// Render KPI Cards
function renderKPIs() {
  document.getElementById('kpi-total-assets').textContent = state.assets.length;
  
  // Total licenses seats calculation
  let totalSeats = 0;
  let allocatedSeats = 0;
  state.licenses.forEach(lic => {
    totalSeats += lic.total_seats;
    allocatedSeats += lic.seats_assigned;
  });

  document.getElementById('kpi-license-seats').textContent = `${totalSeats - allocatedSeats}`;
  document.getElementById('kpi-license-allocated').textContent = allocatedSeats;
  document.getElementById('kpi-license-total').textContent = totalSeats;

  // Pending workflows calculation
  const pendingWorkflows = state.workflows.filter(w => w.current_state === 'Manager Approval' || w.current_state === 'Ordered').length;
  document.getElementById('kpi-pending-approvals').textContent = pendingWorkflows;
}

// Render Workflows Table
function renderWorkflowsTable() {
  const tbody = document.querySelector('#table-workflows tbody');
  tbody.innerHTML = '';

  if (state.workflows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No active workflows</td></tr>`;
    return;
  }

  state.workflows.forEach(w => {
    const tr = document.createElement('tr');
    
    let stateBadge = `<span class="badge badge-pending">${w.current_state}</span>`;
    if (w.current_state === 'Registered' || w.current_state === 'Received') {
      stateBadge = `<span class="badge badge-active">${w.current_state}</span>`;
    } else if (w.current_state === 'Rejected') {
      stateBadge = `<span class="badge badge-repair">${w.current_state}</span>`;
    }

    let actionButton = '';
    if (w.current_state === 'Manager Approval') {
      actionButton = `
        <button class="btn btn-secondary" style="padding:0.35rem 0.75rem; font-size:0.8rem;" onclick="approveWorkflow('${w.id}', true)">Approve</button>
        <button class="btn btn-danger" style="padding:0.35rem 0.75rem; font-size:0.8rem; background:rgba(239,68,68,0.1);" onclick="approveWorkflow('${w.id}', false)">Reject</button>
      `;
    } else if (w.current_state === 'Ordered') {
      actionButton = `<span style="font-size:0.8rem; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Wait Cargo Sync</span>`;
    } else if (w.current_state === 'Received') {
      actionButton = `<span style="font-size:0.8rem; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Snipe-IT Intake</span>`;
    } else {
      actionButton = `<span style="font-size:0.8rem; color:var(--success);"><i class="fa-solid fa-circle-check"></i> Done</span>`;
    }

    tr.innerHTML = `
      <td><strong>${w.id}</strong></td>
      <td>${w.item_name}</td>
      <td>${w.quantity}</td>
      <td>₱${w.cost.toLocaleString()}</td>
      <td>${stateBadge}</td>
      <td>${actionButton}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Active Assignments (Overview Page)
function renderActiveAssignmentsTable() {
  const tbody = document.querySelector('#table-active-assignments tbody');
  tbody.innerHTML = '';

  const assignedAssets = state.assets.filter(a => a.status === 'Assigned');

  if (assignedAssets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No active hardware assignments</td></tr>`;
    return;
  }

  assignedAssets.forEach(a => {
    const user = state.users.find(u => u.id === a.assigned_to);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${a.asset_tag}</strong></td>
      <td>${a.model}</td>
      <td>${user ? user.name : 'Unknown User'}</td>
      <td>${user ? user.email : 'N/A'}</td>
      <td>${a.date_checked_out || '-'}</td>
      <td><code style="font-size:0.75rem; color:var(--secondary);">${a.signature_hash ? a.signature_hash.substring(0, 24) + '...' : '-'}</code></td>
      <td>
        <button class="btn btn-secondary" style="padding:0.35rem 0.75rem; font-size:0.8rem;" onclick="checkinAsset('${a.id}')">
          Check-in
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Full Registry table
function renderFullAssetsTable() {
  const tbody = document.querySelector('#table-full-assets tbody');
  tbody.innerHTML = '';

  state.assets.forEach(a => {
    const tr = document.createElement('tr');
    
    let statusBadge = `<span class="badge badge-deployable">${a.status}</span>`;
    if (a.status === 'Assigned') {
      statusBadge = `<span class="badge badge-active">Assigned</span>`;
    } else if (a.status === 'Under Repair') {
      statusBadge = `<span class="badge badge-repair">Under Repair</span>`;
    } else if (a.status === 'Retired') {
      statusBadge = `<span class="badge badge-pending">Retired</span>`;
    } else if (a.status === 'Disposed') {
      statusBadge = `<span class="badge badge-critical">Disposed</span>`;
    }

    let sanitBadge = '';
    if (a.sanitization_status === 'Verified') {
      sanitBadge = `<span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>`;
    } else if (a.sanitization_status === 'Pending') {
      sanitBadge = `<span class="badge badge-pending"><i class="fa-solid fa-circle-exclamation"></i> Pending</span>`;
    } else {
      sanitBadge = `<span class="badge badge-active">${a.sanitization_status || '-'}</span>`;
    }

    let actionBtn = '';
    if (a.status === 'Assigned') {
      actionBtn = `<button class="btn btn-secondary" style="padding:0.35rem 0.65rem; font-size:0.8rem;" onclick="checkinAsset('${a.id}')">Check-in</button>`;
    } else if (a.status === 'Retired') {
      actionBtn = `<button class="btn btn-primary" style="padding:0.35rem 0.65rem; font-size:0.8rem;" onclick="switchView('disposal')">Disposal Signoff</button>`;
    } else if (a.status === 'Disposed') {
      const dispRecord = (state.disposals || []).find(d => d.asset_id === a.id);
      if (dispRecord) {
        actionBtn = `<button class="btn btn-secondary" style="padding:0.35rem 0.65rem; font-size:0.8rem;" onclick="showCertificate('${dispRecord.id}')"><i class="fa-solid fa-file-shield"></i> Certificate</button>`;
      } else {
        actionBtn = `<span style="font-size:0.8rem; color:var(--text-muted);">Decommissioned</span>`;
      }
    } else if (a.sanitization_status === 'Pending') {
      actionBtn = `
        <button class="btn btn-primary" style="padding:0.35rem 0.65rem; font-size:0.8rem;" onclick="openSanitizeModal('${a.id}')"><i class="fa-solid fa-signature"></i> Sanitize</button>
        <button class="btn btn-danger" style="padding:0.35rem 0.65rem; font-size:0.8rem; background:rgba(239,68,68,0.1);" onclick="retireAsset('${a.id}')">Retire</button>
      `;
    } else {
      actionBtn = `
        <button class="btn btn-secondary" style="padding:0.35rem 0.65rem; font-size:0.8rem;" onclick="checkoutFromRegistry('${a.id}')">Check-out</button>
        <button class="btn btn-danger" style="padding:0.35rem 0.65rem; font-size:0.8rem; background:rgba(239,68,68,0.1);" onclick="retireAsset('${a.id}')">Retire</button>
      `;
    }

    tr.innerHTML = `
      <td><strong>${a.asset_tag}</strong></td>
      <td>${a.serial}</td>
      <td>${a.model}</td>
      <td>${a.type}</td>
      <td>${statusBadge}</td>
      <td>${a.location}</td>
      <td>${sanitBadge}</td>
      <td><code style="font-size:0.75rem; color:var(--text-muted);">${a.signature_hash ? a.signature_hash.substring(0, 16) + '...' : '-'}</code></td>
      <td>${actionBtn}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Dropdowns for Handoff View
function renderHandoffDropdowns() {
  const assetSelect = document.getElementById('checkout-asset');
  assetSelect.innerHTML = '<option value="" disabled selected>-- Select an asset --</option>';
  
  const deployableAssets = state.assets.filter(a => a.status === 'Deployable');
  deployableAssets.forEach(a => {
    const isPending = a.sanitization_status === 'Pending';
    assetSelect.innerHTML += `
      <option value="${a.id}" ${isPending ? 'disabled' : ''}>
        ${a.asset_tag} - ${a.model} ${isPending ? '(PENDING SANITIZATION)' : ''}
      </option>
    `;
  });

  const userSelect = document.getElementById('checkout-user');
  userSelect.innerHTML = '<option value="" disabled selected>-- Select a student/faculty member --</option>';
  state.users.forEach(u => {
    userSelect.innerHTML += `<option value="${u.id}">${u.name} (${u.id}) - ${u.department}</option>`;
  });
}

function updateHandoffDropdownsSilent() {
  const assetSelect = document.getElementById('checkout-asset');
  const userSelect = document.getElementById('checkout-user');
  
  const currentAssetVal = assetSelect.value;
  const currentUserVal = userSelect.value;
  
  renderHandoffDropdowns();
  
  if (currentAssetVal) assetSelect.value = currentAssetVal;
  if (currentUserVal) userSelect.value = currentUserVal;
}

// Render Integrations panel dropdowns
function renderIntegrationsView() {
  const userSelect = document.getElementById('hris-user');
  userSelect.innerHTML = '<option value="" disabled selected>-- Select Profile to Change Status --</option>';
  state.users.forEach(u => {
    const displayStatus = u.status !== 'Active' ? ` [${u.status}]` : '';
    userSelect.innerHTML += `<option value="${u.id}">${u.name} (${u.id}) - Current: ${u.status}${displayStatus}</option>`;
  });

  renderLogsTerminal();
}

function updateIntegrationUsersSilent() {
  const userSelect = document.getElementById('hris-user');
  const currentVal = userSelect.value;
  renderIntegrationsView();
  if (currentVal) userSelect.value = currentVal;
}

// Terminal logs update
function renderLogsTerminal() {
  const terminal = document.getElementById('log-terminal');
  terminal.innerHTML = '';
  
  if (!state.simulation_logs || state.simulation_logs.length === 0) {
    terminal.innerHTML = `<div class="log-entry" style="color:var(--text-muted);">No log streams captured yet...</div>`;
    return;
  }

  state.simulation_logs.forEach(log => {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    // Format timestamp
    const t = new Date(log.timestamp);
    const timeStr = `${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}:${t.getSeconds().toString().padStart(2,'0')}`;

    let logColorClass = 'log-type';
    if (log.type.includes('CDC') || log.type.includes('Debezium')) {
      logColorClass = 'log-type text-cyan';
    } else if (log.type.includes('Auto-Reclamation')) {
      logColorClass = 'log-type text-green';
    } else if (log.type.includes('CRITICAL')) {
      logColorClass = 'log-type text-red';
    }

    entry.innerHTML = `
      <span class="log-time">[${timeStr}]</span>
      <span class="${logColorClass}">${log.type}</span>
      <span class="log-msg">${log.message}</span>
    `;
    terminal.appendChild(entry);
  });
}

// Render diagnostics view
function renderDiagnosticsView() {
  // Telemetry asset select
  const select = document.getElementById('telemetry-asset-select');
  const oldVal = select.value || selectedTelemetryAssetTag;
  
  select.innerHTML = '';
  
  const laptopAssets = state.assets.filter(a => a.type === 'Laptop');
  laptopAssets.forEach(a => {
    select.innerHTML += `<option value="${a.asset_tag}">${a.asset_tag} (${a.model})</option>`;
  });

  if (oldVal && laptopAssets.find(a => a.asset_tag === oldVal)) {
    select.value = oldVal;
    selectedTelemetryAssetTag = oldVal;
  } else if (laptopAssets.length > 0) {
    select.value = laptopAssets[0].asset_tag;
    selectedTelemetryAssetTag = laptopAssets[0].asset_tag;
  }

  updateDiagnosticsTable();
}

function updateDiagnosticsTable() {
  const tbody = document.querySelector('#table-device-risk tbody');
  tbody.innerHTML = '';

  const laptopAssets = state.assets.filter(a => a.type === 'Laptop');
  
  laptopAssets.forEach(a => {
    const tr = document.createElement('tr');
    
    // Calculate failure probability score
    let score = 0;
    if (a.battery_cycle_count > 500) score += 45;
    else if (a.battery_cycle_count > 400) score += 25;
    if (a.cpu_temp > 80) score += 40;
    else if (a.cpu_temp > 70) score += 20;
    if (a.disk_usage > 90) score += 15;

    let healthBadge = '';
    let actionTxt = '';

    if (score >= 70) {
      healthBadge = `<span class="badge badge-critical"><i class="fa-solid fa-triangle-exclamation"></i> Critical Risk (${score}%)</span>`;
      actionTxt = `<span style="color:var(--danger); font-weight:600;"><i class="fa-solid fa-circle-exclamation"></i> Auto-Ticket Raised</span>`;
    } else if (score >= 40) {
      healthBadge = `<span class="badge badge-pending"><i class="fa-solid fa-circle-info"></i> Elevated Warning (${score}%)</span>`;
      actionTxt = `<span style="color:var(--warning);"><i class="fa-solid fa-clock"></i> Monitor Closely</span>`;
    } else {
      healthBadge = `<span class="badge badge-active"><i class="fa-solid fa-circle-check"></i> Healthy (${score}%)</span>`;
      actionTxt = `<span style="color:var(--text-muted);"><i class="fa-solid fa-circle-check"></i> Normal Ops</span>`;
    }

    tr.innerHTML = `
      <td><strong>${a.asset_tag}</strong></td>
      <td>${a.model}</td>
      <td>${a.battery_cycle_count} cycles</td>
      <td>${a.cpu_temp}°C</td>
      <td>${a.disk_usage}%</td>
      <td>${healthBadge}</td>
      <td>${actionTxt}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Chart Renderings
function renderSanitizationChart() {
  const canvasElement = document.getElementById('sanitizationChart');
  if (!canvasElement) return;

  const ctx = canvasElement.getContext('2d');
  
  // Calculate states
  let verified = 0;
  let pending = 0;
  let other = 0;
  
  state.assets.forEach(a => {
    if (a.sanitization_status === 'Verified') verified++;
    else if (a.sanitization_status === 'Pending') pending++;
    else other++;
  });

  if (sanitizationChartInstance) {
    sanitizationChartInstance.destroy();
  }

  sanitizationChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Verified Secure', 'Pending Scrub', 'Under Repair/Active'],
      datasets: [{
        data: [verified, pending, other],
        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
        borderColor: '#0e1222',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#9ca3af',
            font: { family: 'Outfit', size: 11 }
          }
        }
      },
      cutout: '65%'
    }
  });
}

function renderTelemetryChart() {
  const canvasElement = document.getElementById('telemetryChart');
  if (!canvasElement) return;

  const ctx = canvasElement.getContext('2d');
  
  // Find selected asset
  const asset = state.assets.find(a => a.asset_tag === selectedTelemetryAssetTag);
  if (!asset) return;

  // Generate simulated history based on current value to draw a nice chart
  const labels = ['10m ago', '8m ago', '6m ago', '4m ago', '2m ago', 'Now'];
  
  // Build a trend line for CPU temp
  const baseTemp = asset.cpu_temp;
  const cpuData = [
    Math.round(baseTemp - 10 + Math.random() * 5),
    Math.round(baseTemp - 5 + Math.random() * 5),
    Math.round(baseTemp - 2 + Math.random() * 5),
    Math.round(baseTemp - 8 + Math.random() * 5),
    Math.round(baseTemp - 1 + Math.random() * 5),
    baseTemp
  ];

  // Build trend line for Disk Space
  const baseDisk = asset.disk_usage;
  const diskData = [
    baseDisk,
    baseDisk,
    baseDisk,
    baseDisk,
    baseDisk,
    baseDisk
  ];

  if (telemetryChartInstance) {
    telemetryChartInstance.destroy();
  }

  telemetryChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'CPU Temp (°C)',
          data: cpuData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        },
        {
          label: 'Disk Usage (%)',
          data: diskData,
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.05)',
          borderWidth: 2,
          tension: 0.1,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { family: 'Outfit' } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { family: 'Outfit' } },
          min: 0,
          max: 100
        }
      },
      plugins: {
        legend: {
          labels: { color: '#9ca3af', font: { family: 'Outfit' } }
        }
      }
    }
  });
}

function updateTelemetryChart() {
  const select = document.getElementById('telemetry-asset-select');
  selectedTelemetryAssetTag = select.value;
  renderTelemetryChart();
}

// Interactive Operations API Calls

// E-Signature Drawing Logic
function setupSignaturePad() {
  canvas = document.getElementById('sig-canvas');
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  
  // Mouse Events
  canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const pos = getMousePos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const pos = getMousePos(canvas, e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  });

  canvas.addEventListener('mouseup', () => {
    drawing = false;
  });

  // Touch Events for Mobile
  canvas.addEventListener('touchstart', (e) => {
    drawing = true;
    const touch = e.touches[0];
    const pos = getMousePos(canvas, touch);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    e.preventDefault();
  });

  canvas.addEventListener('touchmove', (e) => {
    if (!drawing) return;
    const touch = e.touches[0];
    const pos = getMousePos(canvas, touch);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    e.preventDefault();
  });

  canvas.addEventListener('touchend', () => {
    drawing = false;
  });
}

function getMousePos(canvasDom, e) {
  const rect = canvasDom.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function resizeSignatureCanvas() {
  // Wait slightly for layout to calculate parent width
  setTimeout(() => {
    if (!canvas) return;
    const rect = canvas.parentNode.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    clearSignatureCanvas();
  }, 50);
}

function clearSignatureCanvas() {
  if (!ctx || !canvas) return;
  ctx.fillStyle = '#0a0d1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Write guidance text
  ctx.font = '14px Outfit';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.textAlign = 'center';
  ctx.fillText('Draw signature here', canvas.width / 2, canvas.height / 2);
}

// API Submission handlers

// Check out Asset
async function handleCheckoutSubmit(e) {
  e.preventDefault();
  const assetId = document.getElementById('checkout-asset').value;
  const userId = document.getElementById('checkout-user').value;

  if (!assetId || !userId) {
    showToast('error', 'Missing Selection', 'Please select both an asset and a user.');
    return;
  }

  // Get drawing signature as base64 string
  const sigDataUrl = canvas.toDataURL();

  try {
    const response = await fetch(`/api/assets/${assetId}/checkout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': currentUser ? currentUser.id : ''
      },
      body: JSON.stringify({ user_id: userId, signature_data: sigDataUrl })
    });

    const result = await response.json();
    if (response.ok) {
      showToast('success', 'Checkout Complete', `Asset checked out. Signature hash: ${result.signatureHash.substring(0, 24)}...`);
      // Clean form
      document.getElementById('checkout-asset').value = '';
      document.getElementById('checkout-user').value = '';
      clearSignatureCanvas();
      
      // Update UI
      await refreshData();
      switchView('overview');
    } else {
      showToast('error', 'Checkout Failed', result.error);
    }
  } catch (err) {
    console.error("Checkout request failed:", err);
  }
}

// Checkout asset directly from registry page (pre-selects values)
function checkoutFromRegistry(assetId) {
  switchView('handoff');
  setTimeout(() => {
    document.getElementById('checkout-asset').value = assetId;
  }, 100);
}

// Check in Asset
async function checkinAsset(assetId) {
  if (!confirm("Are you sure you want to check in this asset? It will be flagged as PENDING SANITIZATION before deployment.")) {
    return;
  }

  try {
    const response = await fetch(`/api/assets/${assetId}/checkin`, {
      method: 'POST',
      headers: { 'x-user-id': currentUser ? currentUser.id : '' }
    });

    if (response.ok) {
      showToast('success', 'Asset Returned', 'Status reset to DEPLOYABLE. Marked for sanitization audit.');
      await refreshData();
    } else {
      const err = await response.json();
      showToast('error', 'Check-in Failed', err.error);
    }
  } catch (err) {
    console.error("Check-in failed:", err);
  }
}

// Sanitization modal actions
function openSanitizeModal(assetId) {
  document.getElementById('sanitize-asset-id').value = assetId;
  document.getElementById('modal-sanitize').classList.add('active');
  // reset checkboxes
  document.getElementById('check-bios').checked = false;
  document.getElementById('check-mdm').checked = false;
  document.getElementById('check-firmware').checked = false;
}

function closeSanitizeModal() {
  document.getElementById('modal-sanitize').classList.remove('active');
}

async function handleModalSanitizeSubmit(e) {
  e.preventDefault();
  const assetId = document.getElementById('sanitize-asset-id').value;
  const method = document.getElementById('sanitize-method').value;

  try {
    const response = await fetch(`/api/assets/${assetId}/sanitize`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': currentUser ? currentUser.id : ''
      },
      body: JSON.stringify({ method: method, status: "Verified" })
    });

    if (response.ok) {
      showToast('success', 'Sanitization Verified', 'Asset is now ready for deployment.');
      closeSanitizeModal();
      await refreshData();
    } else {
      const err = await response.json();
      showToast('error', 'Sanitization Failed', err.error);
    }
  } catch (err) {
    console.error("Sanitize post failed:", err);
  }
}

// Approval action
async function approveWorkflow(id, isApproved) {
  try {
    const response = await fetch(`/api/workflows/${id}/approve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': currentUser ? currentUser.id : ''
      },
      body: JSON.stringify({ approved: isApproved })
    });

    if (response.ok) {
      const actionName = isApproved ? 'approved' : 'rejected';
      showToast(isApproved ? 'success' : 'info', `Workflow ${actionName.charAt(0).toUpperCase() + actionName.slice(1)}`, `Temporal Workflow ${id} ${actionName}. State machine processing.`);
      await refreshData();
    } else {
      const err = await response.json();
      showToast('error', 'Workflow Error', err.error);
    }
  } catch (err) {
    console.error("Workflow update failed:", err);
  }
}

// HRIS sync simulator
async function handleHrisSubmit(e) {
  e.preventDefault();
  const userId = document.getElementById('hris-user').value;
  const status = document.getElementById('hris-status').value;

  if (!userId || !status) {
    showToast('error', 'Missing Selection', 'Please select a profile to modify.');
    return;
  }

  try {
    const response = await fetch('/api/simulation/hris-sync', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': currentUser ? currentUser.id : ''
      },
      body: JSON.stringify({ user_id: userId, new_status: status })
    });

    const result = await response.json();
    if (response.ok) {
      showToast('success', 'HRIS Sync Complete', `Reclaimed ${result.licensesReclaimed} license seats and ${result.assetsReclaimed} hardware assets. Check CDC logs for details.`);
      await refreshData();
    } else {
      showToast('error', 'HRIS Sync Error', result.error);
    }
  } catch (err) {
    console.error("HRIS sync simulator failed:", err);
  }
}

// Procurement simulator
async function handleProcurementSubmit(e) {
  e.preventDefault();
  const item = document.getElementById('proc-item').value;
  const qty = document.getElementById('proc-qty').value;
  const cost = document.getElementById('proc-cost').value;

  try {
    const response = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': currentUser ? currentUser.id : ''
      },
      body: JSON.stringify({ item_name: item, quantity: qty, cost: cost, requested_by: "Procurement Simulator" })
    });

    if (response.ok) {
      showToast('success', 'Request Submitted', 'Procurement request sent to Temporal workflow. Approve it in the workflows table.');
      await refreshData();
      switchView('overview');
    } else {
      const err = await response.json();
      showToast('error', 'Procurement Error', err.error);
    }
  } catch (err) {
    console.error("Procurement submission failed:", err);
  }
}

// SageMaker Inference
async function runMlInference() {
  try {
    const response = await fetch('/api/simulation/predictive-maintenance', {
      method: 'POST',
      headers: { 'x-user-id': currentUser ? currentUser.id : '' }
    });

    const result = await response.json();
    if (response.ok) {
      showToast('info', 'ML Inference Complete', `Scanned ${result.scannedCount} devices. Critical: ${result.criticalCount}, Warnings: ${result.warningCount}. Check diagnostics for details.`);
      await refreshData();
    } else {
      showToast('error', 'Inference Failed', result.error);
    }
  } catch (err) {
    console.error("Inference run failed:", err);
  }
}

// Modal open/close helpers
function openNewWorkflowModal() {
  document.getElementById('modal-workflow').classList.add('active');
}
function closeWorkflowModal() {
  document.getElementById('modal-workflow').classList.remove('active');
}
async function handleModalProcurementSubmit(e) {
  e.preventDefault();
  const item = document.getElementById('modal-proc-item').value;
  const qty = document.getElementById('modal-proc-qty').value;
  const cost = document.getElementById('modal-proc-cost').value;
  const by = document.getElementById('modal-proc-by').value;

  try {
    const response = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': currentUser ? currentUser.id : ''
      },
      body: JSON.stringify({ item_name: item, quantity: qty, cost: cost, requested_by: by })
    });

    if (response.ok) {
      showToast('success', 'Workflow Created', 'Procurement workflow initiated. Approve it in the workflows table.');
      closeWorkflowModal();
      await refreshData();
      switchView('overview');
    } else {
      const err = await response.json();
      showToast('error', 'Workflow Error', err.error);
    }
  } catch (err) {
    console.error("Modal workflow fail:", err);
  }
}

function openNewAssetModal() {
  document.getElementById('modal-asset').classList.add('active');
  
  // Auto-generate tag code
  const lastNum = state.assets.length + 1;
  document.getElementById('modal-asset-tag').value = `CCT-LPT-${String(100 + lastNum).substring(1)}`;
  document.getElementById('modal-asset-serial').value = `SN-PF4X${Math.floor(1000 + Math.random() * 9000)}`;
}
function closeAssetModal() {
  document.getElementById('modal-asset').classList.remove('active');
}
async function handleModalAssetSubmit(e) {
  e.preventDefault();
  const tag = document.getElementById('modal-asset-tag').value;
  const serial = document.getElementById('modal-asset-serial').value;
  const model = document.getElementById('modal-asset-model').value;
  const type = document.getElementById('modal-asset-type').value;
  const loc = document.getElementById('modal-asset-loc').value;


  try {
    const response = await fetch('/api/assets', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': currentUser ? currentUser.id : ''
      },
      body: JSON.stringify({ asset_tag: tag, serial, model, type, location: loc })
    });

    if (response.ok) {
      showToast('success', 'Asset Registered', `Asset ${tag} saved to PostgreSQL database.`);
      closeAssetModal();
      await refreshData();
    } else {
      const err = await response.json();
      showToast('error', 'Registration Failed', err.error);
    }
  } catch (err) {
    console.error("Asset register failed:", err);
  }
}

// Clear logs simulator terminal
function clearLogs() {
  state.simulation_logs = [];
  renderLogsTerminal();
}

// === Asset Retirement & Disposal Workflow Implementation ===

let dispCanvas, dispCtx;
let dispDrawing = false;

// Initialize signature canvas for compliance officer
function setupDispSignaturePad() {
  dispCanvas = document.getElementById('disp-sig-canvas');
  if (!dispCanvas) return;

  dispCtx = dispCanvas.getContext('2d');
  
  dispCanvas.addEventListener('mousedown', (e) => {
    dispDrawing = true;
    const pos = getMousePos(dispCanvas, e);
    dispCtx.beginPath();
    dispCtx.moveTo(pos.x, pos.y);
    dispCtx.strokeStyle = '#ef4444'; // Red signature for warning/disposal
    dispCtx.lineWidth = 3;
    dispCtx.lineCap = 'round';
  });

  dispCanvas.addEventListener('mousemove', (e) => {
    if (!dispDrawing) return;
    const pos = getMousePos(dispCanvas, e);
    dispCtx.lineTo(pos.x, pos.y);
    dispCtx.stroke();
  });

  dispCanvas.addEventListener('mouseup', () => {
    dispDrawing = false;
  });

  // Touch support
  dispCanvas.addEventListener('touchstart', (e) => {
    dispDrawing = true;
    const touch = e.touches[0];
    const pos = getMousePos(dispCanvas, touch);
    dispCtx.beginPath();
    dispCtx.moveTo(pos.x, pos.y);
    dispCtx.strokeStyle = '#ef4444';
    dispCtx.lineWidth = 3;
    dispCtx.lineCap = 'round';
    e.preventDefault();
  });

  dispCanvas.addEventListener('touchmove', (e) => {
    if (!dispDrawing) return;
    const touch = e.touches[0];
    const pos = getMousePos(dispCanvas, touch);
    dispCtx.lineTo(pos.x, pos.y);
    dispCtx.stroke();
    e.preventDefault();
  });

  dispCanvas.addEventListener('touchend', () => {
    dispDrawing = false;
  });
}

function resizeDispSignatureCanvas() {
  setTimeout(() => {
    if (!dispCanvas) {
      setupDispSignaturePad();
    }
    if (!dispCanvas) return;
    const rect = dispCanvas.parentNode.getBoundingClientRect();
    dispCanvas.width = rect.width;
    dispCanvas.height = rect.height;
    clearDispSignatureCanvas();
  }, 50);
}

function clearDispSignatureCanvas() {
  if (!dispCtx || !dispCanvas) return;
  dispCtx.fillStyle = '#0a0d1a';
  dispCtx.fillRect(0, 0, dispCanvas.width, dispCanvas.height);
  
  dispCtx.font = '14px Outfit';
  dispCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  dispCtx.textAlign = 'center';
  dispCtx.fillText('Compliance Officer Sign Here', dispCanvas.width / 2, dispCanvas.height / 2);
}

// API Action: Move Asset to "Retired"
async function retireAsset(id) {
  const asset = state.assets.find(a => a.id === id);
  if (!asset) return;

  if (!confirm(`Are you sure you want to retire asset ${asset.asset_tag} (${asset.model})? This enforces data sanitization before final disposal.`)) {
    return;
  }

  try {
    const response = await fetch(`/api/assets/${id}/retire`, {
      method: 'POST',
      headers: { 'x-user-id': currentUser ? currentUser.id : '' }
    });

    if (response.ok) {
      showToast('info', 'Asset Retired', `${asset.asset_tag} retired. Go to Disposal & Wipes to sanitize and decommission.`);
      await refreshData();
    } else {
      const err = await response.json();
      showToast('error', 'Retirement Failed', err.error);
    }
  } catch (err) {
    console.error("Retire asset failed:", err);
  }
}

// Render Decommission & Disposal tables
function renderDisposalView() {
  renderRetiredAssetsTable();
  renderDisposalRecordsTable();
}

function renderDisposalViewSilent() {
  renderRetiredAssetsTable();
  renderDisposalRecordsTable();
}

// Populate retired assets
function renderRetiredAssetsTable() {
  const tbody = document.querySelector('#table-retired-assets tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  
  const retiredAssets = state.assets.filter(a => a.status === 'Retired');

  if (retiredAssets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No assets currently retired</td></tr>`;
    return;
  }

  retiredAssets.forEach(a => {
    const tr = document.createElement('tr');
    
    let sanitBadge = '';
    let actionBtn = '';
    
    if (a.sanitization_status === 'Verified') {
      sanitBadge = `<span class="badge badge-verified"><i class="fa-solid fa-check-double"></i> Verified</span>`;
      actionBtn = `<button class="btn btn-danger" style="padding:0.35rem 0.65rem; font-size:0.8rem;" onclick="openDisposeModal('${a.id}')"><i class="fa-solid fa-file-shield"></i> Finalize Decommission</button>`;
    } else {
      sanitBadge = `<span class="badge badge-pending"><i class="fa-solid fa-circle-exclamation"></i> Scrub Required</span>`;
      actionBtn = `<button class="btn btn-primary" style="padding:0.35rem 0.65rem; font-size:0.8rem;" onclick="openSanitizeModal('${a.id}')"><i class="fa-solid fa-soap"></i> Perform Sanitization</button>`;
    }

    tr.innerHTML = `
      <td><strong>${a.asset_tag}</strong></td>
      <td>${a.model}</td>
      <td>${sanitBadge}</td>
      <td>${a.sanitization_method || '<em style="color:var(--text-muted)">Unwiped</em>'}</td>
      <td>${actionBtn}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Populate historical disposals
function renderDisposalRecordsTable() {
  const tbody = document.querySelector('#table-disposal-records tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  const disposals = state.disposals || [];

  if (disposals.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No decommission audit records found</td></tr>`;
    return;
  }

  disposals.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${d.id}</strong></td>
      <td>${d.asset_tag}</td>
      <td>${d.certified_by}</td>
      <td>${d.disposal_date}</td>
      <td>
        <button class="btn btn-secondary" style="padding:0.35rem 0.65rem; font-size:0.8rem;" onclick="showCertificate('${d.id}')">
          <i class="fa-solid fa-file-pdf"></i> View Certificate
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Open final dispose modal
function openDisposeModal(assetId) {
  const asset = state.assets.find(a => a.id === assetId);
  if (!asset) return;

  document.getElementById('dispose-asset-id').value = assetId;
  document.getElementById('dispose-info-tag').textContent = asset.asset_tag;
  document.getElementById('dispose-info-serial').textContent = asset.serial;
  document.getElementById('dispose-info-sanitize').textContent = asset.sanitization_method;

  document.getElementById('modal-dispose').classList.add('active');
  
  // Resize signature pad and initialize drawing
  resizeDispSignatureCanvas();
}

function closeDisposeModal() {
  document.getElementById('modal-dispose').classList.remove('active');
}

// Submit final disposal sign-off
async function handleModalDisposeSubmit(e) {
  e.preventDefault();
  const assetId = document.getElementById('dispose-asset-id').value;
  const officer = document.getElementById('dispose-officer').value;
  const sigDataUrl = dispCanvas.toDataURL();

  try {
    const response = await fetch(`/api/assets/${assetId}/dispose`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': currentUser ? currentUser.id : ''
      },
      body: JSON.stringify({ compliance_officer: officer, signature_data: sigDataUrl })
    });

    const result = await response.json();
    if (response.ok) {
      showToast('success', 'Disposal Finalized', `Audit certificate generated: ${result.disposalRecord.certificate_hash.substring(0, 30)}...`);
      closeDisposeModal();
      
      // Update data and refresh UI
      await refreshData();
      
      // Open the certificate preview automatically for the newly created record
      showCertificate(result.disposalRecord.id);
    } else {
      showToast('error', 'Disposal Failed', result.error);
    }
  } catch (err) {
    console.error("Disposal sign-off failed:", err);
  }
}

// Show Printable Certificate Modal
function showCertificate(dispRecordId) {
  const disposals = state.disposals || [];
  const record = disposals.find(d => d.id === dispRecordId);
  if (!record) return;

  document.getElementById('cert-id').textContent = record.id;
  document.getElementById('cert-model').textContent = record.model;
  document.getElementById('cert-tag').textContent = record.asset_tag;
  document.getElementById('cert-serial').textContent = record.serial;
  document.getElementById('cert-method').textContent = record.sanitize_method;
  document.getElementById('cert-date').textContent = record.disposal_date;
  document.getElementById('cert-officer').textContent = record.certified_by;
  document.getElementById('cert-hash').textContent = record.certificate_hash;

  // Render compliance officer name signature representation
  const sigContainer = document.getElementById('cert-signature-draw');
  sigContainer.innerHTML = `<span style="font-family:'Courier New', monospace; font-size:1.1rem; font-style:italic; font-weight:700; color:#ef4444; border-bottom:1px solid rgba(255,255,255,0.2); letter-spacing:-1px;">/s/ ${record.certified_by}</span>`;

  document.getElementById('modal-certificate').classList.add('active');
}

function closeCertificateModal() {
  document.getElementById('modal-certificate').classList.remove('active');
}

// Render student dashboard information (KPIs and custom tables)
function renderStudentDashboard() {
  if (!currentUser) return;
  const isStudent = currentUser.id.startsWith('STU-');
  if (!isStudent) return;

  // KPIs
  const myAssets = state.assets.filter(a => a.assigned_to === currentUser.id);
  const myLicenses = state.licenses.filter(lic => lic.assigned_users && lic.assigned_users.includes(currentUser.id));
  
  const kpiAssetsEl = document.getElementById('student-kpi-assets');
  const kpiLicensesEl = document.getElementById('student-kpi-licenses');
  if (kpiAssetsEl) kpiAssetsEl.textContent = myAssets.length;
  if (kpiLicensesEl) kpiLicensesEl.textContent = myLicenses.length;

  // Assets Table
  const assetTbody = document.querySelector('#student-table-assets tbody');
  if (assetTbody) {
    assetTbody.innerHTML = '';
    if (myAssets.length === 0) {
      assetTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No hardware assets currently assigned to you</td></tr>`;
    } else {
      myAssets.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${a.asset_tag}</strong></td>
          <td>${a.model}</td>
          <td>${a.serial}</td>
          <td>${a.date_checked_out || '-'}</td>
          <td><code style="font-size:0.75rem; color:var(--secondary);">${a.signature_hash ? a.signature_hash.substring(0, 24) + '...' : '-'}</code></td>
        `;
        assetTbody.appendChild(tr);
      });
    }
  }

  // Licenses Table
  const licenseTbody = document.querySelector('#student-table-licenses tbody');
  if (licenseTbody) {
    licenseTbody.innerHTML = '';
    if (myLicenses.length === 0) {
      licenseTbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">No software licenses currently assigned to you</td></tr>`;
    } else {
      myLicenses.forEach(lic => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${lic.name}</strong></td>
          <td><code style="font-size:0.8rem; color:var(--text-muted);">${lic.key}</code></td>
          <td><span class="badge badge-verified"><i class="fa-solid fa-check"></i> Active Seat</span></td>
        `;
        licenseTbody.appendChild(tr);
      });
    }
  }
}


```

---

### <a id="file-README-md"></a>4.6. File: `README.md`
**Relative Path:** `README.md`  
**Lines of Code:** 115 lines | **File Size:** 4.63 KB  
**Description:** Project README file containing the high-level system overview, core architectural modules, setup requirements, and detailed REST API endpoints.

```markdown
# InvenTech IT Asset Management System (Prototype)

InvenTech is a modern, prototype IT Asset Management (ITAM) application designed to simulate enterprise-grade asset lifecycle management. It showcases data integrity controls, automated workflows, predictive diagnostics, change data capture (CDC), and cryptographic audit logging.

---

## 🚀 Key Features & Simulations

### 1. Relational Database Simulator (PostgreSQL)
- Supports registration, lookup, and updates of physical assets.
- Enforces relational constraints (such as preventing asset creation with duplicate serial numbers or asset tags).

### 2. Document Store Simulator (MongoDB)
- Manages unstructured/semi-structured maintenance tickets, tracking technician notes, issue types, and resolution states.

### 3. Change Data Capture & Messaging (Debezium + Kafka)
- Simulates real-time HRIS status synchronization (e.g., when a user is marked "Inactive" or "Terminated").
- Triggers Kafka message streams to automatically reclaim software licenses and unassign physical devices, moving them back to inventory with a pending sanitization status.

### 4. Stateful Orchestration Workflows (Temporal)
- Manages the procurement process (Manager Approval -> Ordered -> Received -> Registered).
- Simulates automated back-end job queuing and Snipe-IT inventory sync.

### 5. AI Diagnostics & Analytics (AWS SageMaker)
- Telemetry batch inference simulation that analyzes battery health, temperature, and storage metrics to predict imminent hardware failures and automatically open preventive maintenance logs.

### 6. Sanitization & Cryptographic Signatures
- Enforces NIST 800-88 sanitization standards before asset retirement or disposal.
- Cryptographically signs check-out actions and final disposal certificates, storing tamper-evident hashes.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (Modern dark-mode glassmorphic theme), JavaScript (ES6 Modules & Fetch API).
- **Backend**: Node.js, Express.js.
- **Database**: File-based database simulation (`data/db.json` / `data/db.seed.json`).

---

## 📂 Project Structure

```
asdi-nila-mich-joy-jolyn/
├── data/
│   ├── db.json             # Live database state (simulated)
│   └── db.seed.json        # Original seed state for resets
├── public/
│   ├── css/
│   │   └── style.css       # Premium responsive stylesheet
│   ├── js/
│   │   └── app.js          # Main frontend control logic
│   ├── favicon.svg         # InvenTech Favicon
│   └── index.html          # Core single-page interface
├── server.js               # Node/Express server and API simulators
├── package.json            # Node.js dependencies and run scripts
├── README.md               # Project documentation
└── DEPLOYMENT_GUIDE.md     # Step-by-step GitHub & Hosting deploy instructions
```

---

## ⚙️ Local Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (Version v18.0.0 or higher recommended)
- npm (Node Package Manager)

### Step 1: Install Dependencies
Navigate to the root directory of the application and install the required Express package:
```bash
npm install
```

### Step 2: Run the Server
You can start the server in development mode using:
```bash
npm run dev
```
Alternatively, start it via node:
```bash
npm start
```

### Step 3: Access the App
Open your web browser and navigate to:
```
http://localhost:3000
```

---

## 📜 API Documentation Summary

| Endpoint | Method | Description |
|---|---|---|
| `/api/data` | GET | Retrieve full system state |
| `/api/assets` | GET / POST | Fetch assets / Register a new physical asset |
| `/api/assets/:id/checkout` | POST | Check out an asset with a digital signature |
| `/api/assets/:id/checkin` | POST | Check in an asset and set sanitization status to pending |
| `/api/assets/:id/retire` | POST | Retire an asset (triggers sanitization check) |
| `/api/assets/:id/dispose` | POST | Finalize disposal and generate cryptographic audit certificate |
| `/api/maintenance` | POST | Open new maintenance logs |
| `/api/maintenance/:id/resolve`| POST | Resolve open maintenance logs |
| `/api/workflows` | POST | Trigger Temporal procurement approvals |
| `/api/workflows/:id/approve` | POST | Approve procurement workflow (starts Snipe-IT auto-intake) |
| `/api/simulation/hris-sync` | POST | Simulate user departure CDC & license/asset auto-reclamation |
| `/api/simulation/predictive-maintenance` | POST | Run SageMaker ML diagnostic batch inference |
| `/api/reset` | POST | Reset simulated database back to initial seed data |

---

## 📝 License
This project was developed as part of academic work. All rights reserved.

```

---

### <a id="file-DEPLOYMENT-GUIDE-md"></a>4.7. File: `DEPLOYMENT_GUIDE.md`
**Relative Path:** `DEPLOYMENT_GUIDE.md`  
**Lines of Code:** 111 lines | **File Size:** 4.32 KB  
**Description:** Detailed instructions on how to initialize the Git repository, push the source code to GitHub, and deploy to live cloud hosting platforms (Render or Railway).

```markdown
# InvenTech Deployment & GitHub Guide

This guide provides step-by-step instructions to upload the **InvenTech IT Asset Management System** to a GitHub repository and deploy it to live hosting platforms.

---

## 🐙 Part 1: Uploading the Source Code to GitHub

Follow these steps to host your source code on GitHub.

### Step 1: Initialize Git Local Repository
If you haven't already initialized git in the project directory, run:
```bash
git init
```

### Step 2: Configure `.gitignore`
Make sure you have a `.gitignore` file to avoid committing unnecessary files (e.g., `node_modules`). Verify your `.gitignore` contains at least:
```text
node_modules/
.DS_Store
.env
```

### Step 3: Stage and Commit Files
Add all project files to Git staging and make an initial commit:
```bash
git add .
git commit -m "Initial commit of InvenTech Prototype"
```

### Step 4: Create a New GitHub Repository
1. Go to [GitHub](https://github.com/) and log in.
2. Click the **New** button (or "+" sign in the top-right corner) to create a new repository.
3. Name your repository (e.g., `inventech-app`).
4. Set the visibility to **Public** or **Private** based on your needs.
5. Do **NOT** initialize the repository with a README, `.gitignore`, or License (since we already have them).
6. Click **Create repository**.

### Step 5: Link Local Repository and Push to GitHub
Under the heading **"…or push an existing repository from the command line"**, copy and run the commands in your terminal:
```bash
# Rename default branch to main
git branch -M main

# Add your GitHub repository as remote origin (replace URL with your repository's URL)
git remote add origin https://github.com/YOUR_USERNAME/inventech-app.git

# Push your code
git push -u origin main
```

---

## 🚀 Part 2: Deploying to Render (Recommended)

[Render](https://render.com/) is a cloud hosting platform that supports Node.js applications natively. It offers a generous free tier perfect for prototype deployment.

### Step 1: Create a Render Account
Go to [Render](https://render.com/) and sign up. Connecting your GitHub account is recommended as it automates deployments.

### Step 2: Create a New Web Service
1. On your Render dashboard, click the blue **New** button and select **Web Service**.
2. Select **Connect repository**.
3. Choose the `inventech-app` repository you pushed in Part 1. (If you don't see it, configure Render's GitHub app permissions to grant access).

### Step 3: Configure Settings
Provide the following configurations on the creation page:
- **Name**: `inventech-app` (or any unique name)
- **Region**: Select the region closest to your audience (e.g., Singapore or US Oregon).
- **Branch**: `main`
- **Root Directory**: Leave blank (representing the root directory)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Select **Free** (or Starter/Individual if preferred).

### Step 4: Click Deploy Web Service
Render will download your code, run `npm install`, and start your server using `npm start`.
- Once completed, the log output will say `InvenTech Prototype Server running on http://localhost:3000`.
- The live URL of your application will be displayed in the top-left corner of the dashboard page (e.g., `https://inventech-app.onrender.com`).

---

## ⚡ Part 3: Deploying to Railway (Alternative)

[Railway](https://railway.app/) is another developer-friendly platform that makes deploying Node.js servers extremely fast.

### Step 1: Sign up
Sign up on [Railway](https://railway.app/) using your GitHub account.

### Step 2: Create a Project
1. Click **New Project** on your dashboard.
2. Select **Deploy from GitHub repo**.
3. Select your `inventech-app` repository.
4. Click **Deploy Now**.

### Step 3: Configure Public URL
Railway will build and deploy the app automatically. Once it builds:
1. Go to the project settings of your newly deployed service.
2. Scroll to the **Networking** section.
3. Click **Generate Domain** to get a public link to your application.

---

## 🔍 Verifying the Deployment
After your application is live, navigate to your public URL (e.g., `https://your-app.onrender.com`) to verify that:
1. The dashboard page loads correctly with the CSS styling.
2. Data updates (like creating a new physical asset or starting a maintenance ticket) work seamlessly.
3. Database resets and simulation syncs return positive API responses.

```

---

## 5. Setup & Running Instructions
For complete instructions on running the prototype server locally or hosting it on production, please refer to Section 4.6 (`README.md`) and Section 4.7 (`DEPLOYMENT_GUIDE.md`) in this document.

### Quick Start:
1. Ensure Node.js (version 18+) is installed.
2. Open terminal in this folder and install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web interface in your browser at:
   ```
   http://localhost:3000
   ```

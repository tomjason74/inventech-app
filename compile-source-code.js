const fs = require('fs');
const path = require('path');

// Configuration: files to compile in order
const FILES_TO_COMPILE = [
  {
    path: 'package.json',
    lang: 'json',
    description: 'Node.js project manifest. Defines project metadata, dependencies (Express), and npm scripts to run the application.'
  },
  {
    path: 'server.js',
    lang: 'javascript',
    description: 'Express.js backend server. Implements the REST API endpoints and simulates all enterprise systems, including the PostgreSQL database simulator, MongoDB maintenance logs store, Temporal procurement state machine workflows, Change Data Capture (CDC) via Debezium/Kafka, AWS SageMaker predictive maintenance inference, and cryptographic digital signature generation.'
  },
  {
    path: 'public/index.html',
    lang: 'html',
    description: 'Single-page web interface. Contains the glassmorphic HTML5 structure, dashboard views (Overview, Asset Registry, Digital Handoff, Integrations, ML Diagnostics, Disposals), interactive forms, modal popups for data sanitization, and the printable cryptographic Compliance Certificate.'
  },
  {
    path: 'public/css/style.css',
    lang: 'css',
    description: 'Main application stylesheet. Employs a premium glassmorphic dark-theme design system using CSS custom properties, responsive flex/grid layouts, smooth animations, and styling for interactive components like the signature canvas, logs terminal, and modals.'
  },
  {
    path: 'public/js/app.js',
    lang: 'javascript',
    description: 'Client-side application logic. Controls dynamic UI view switching, handles local signature canvas inputs, processes API requests (fetch), renders reactive charts (using Chart.js), appends live Kafka/Debezium simulation stream logs to the UI terminal, and manages modal lifecycle states.'
  },
  {
    path: 'README.md',
    lang: 'markdown',
    description: 'Project README file containing the high-level system overview, core architectural modules, setup requirements, and detailed REST API endpoints.'
  },
  {
    path: 'DEPLOYMENT_GUIDE.md',
    lang: 'markdown',
    description: 'Detailed instructions on how to initialize the Git repository, push the source code to GitHub, and deploy to live cloud hosting platforms (Render or Railway).'
  }
];

const ROOT_DIR = __dirname;
const MD_OUTPUT = path.join(ROOT_DIR, 'InvenTech_Source_Code_and_Documentation.md');
const HTML_OUTPUT = path.join(ROOT_DIR, 'InvenTech_Source_Code_and_Documentation.html');

console.log('Starting InvenTech source code compiler...');

let totalLines = 0;
let totalBytes = 0;
let fileStats = [];

// Prepare contents
const compiledFiles = FILES_TO_COMPILE.map(fileConf => {
  const fullPath = path.join(ROOT_DIR, fileConf.path);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Warning: File not found - ${fileConf.path}`);
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const size = fs.statSync(fullPath).size;
  const linesCount = content.split('\n').length;

  totalLines += linesCount;
  totalBytes += size;

  fileStats.push({
    path: fileConf.path,
    size: (size / 1024).toFixed(2) + ' KB',
    lines: linesCount,
    description: fileConf.description
  });

  return {
    ...fileConf,
    content,
    linesCount,
    sizeBytes: size
  };
}).filter(Boolean);

// 1. GENERATE MARKDOWN
console.log('Generating Markdown documentation...');
let mdContent = `# InvenTech IT Asset Management System (Prototype)
## Complete Source Code & System Documentation

> **School/Institution:** Masteral - ASDI Course Deliverable
> **System Name:** InvenTech IT Asset Management System (ITAM)
> **Compiled On:** ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US')}
> **Current Version:** v2.0.0
> **Authors/Team:** Michelle de Guzman, Joy dela Cruz, Jolyn (Masteral Group)

---

## 📋 Table of Contents
1. [System & Architecture Overview](#1-system--architecture-overview)
2. [Project Codebase Statistics](#2-project-codebase-statistics)
3. [File Registry & Architecture Mapping](#3-file-registry--architecture-mapping)
4. [Source Code Compilation](#4-source-code-compilation)
${compiledFiles.map((f, i) => `   - 4.${i + 1}. [\`${f.path}\`](#file-${f.path.replace(/[^a-zA-Z0-9]/g, '-')})`).join('\n')}
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
- **Total Code/Configuration Files:** ${compiledFiles.length}
- **Total Combined Lines of Code (LOC):** ${totalLines} lines
- **Total Workspace Size (Uncompressed):** ${(totalBytes / 1024).toFixed(2)} KB

---

## 3. File Registry & Architecture Mapping

| File Path & Name | File Type | Lines of Code | Size (KB) | Core Architectural Role / Description |
| :--- | :--- | :--- | :--- | :--- |
${fileStats.map(f => `| **\`${f.path}\`** | \`${path.extname(f.path) || 'Config'}\` | ${f.lines} | ${f.size} | ${f.description} |`).join('\n')}

---

## 4. Source Code Compilation

`;

compiledFiles.forEach((file, index) => {
  mdContent += `### <a id="file-${file.path.replace(/[^a-zA-Z0-9]/g, '-')}"></a>4.${index + 1}. File: \`${file.path}\`
**Relative Path:** \`${file.path}\`  
**Lines of Code:** ${file.linesCount} lines | **File Size:** ${(file.sizeBytes / 1024).toFixed(2)} KB  
**Description:** ${file.description}

\`\`\`${file.lang}
${file.content}
\`\`\`

---

`;
});

mdContent += `## 5. Setup & Running Instructions
For complete instructions on running the prototype server locally or hosting it on production, please refer to Section 4.6 (\`README.md\`) and Section 4.7 (\`DEPLOYMENT_GUIDE.md\`) in this document.

### Quick Start:
1. Ensure Node.js (version 18+) is installed.
2. Open terminal in this folder and install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Access the web interface in your browser at:
   \`\`\`
   http://localhost:3000
   \`\`\`
`;

fs.writeFileSync(MD_OUTPUT, mdContent, 'utf8');
console.log(`Markdown documentation generated successfully: ${MD_OUTPUT}`);

// 2. GENERATE STANDALONE HTML
console.log('Generating Standalone HTML documentation...');
const escapedFiles = compiledFiles.map(f => {
  return {
    ...f,
    escapedContent: f.content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  };
});

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>InvenTech Source Code & Documentation</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --bg-dark: #0b0f19;
      --bg-light: #161c2d;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --border-color: rgba(255, 255, 255, 0.08);
      --primary: #3b82f6;
      --secondary: #06b6d4;
      --accent: #8b5cf6;
      --font-sans: 'Outfit', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * {
      margin: 0; padding: 0; box-sizing: border-box;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font-sans);
      line-height: 1.6;
      display: flex;
    }

    /* Print styling overrides */
    @media print {
      body {
        display: block;
        background: #fff;
        color: #000;
      }
      .sidebar {
        display: none !important;
      }
      .main-content {
        margin-left: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }
      .file-card {
        page-break-before: always;
        background: #fff !important;
        color: #000 !important;
        border: 1px solid #ccc !important;
        box-shadow: none !important;
      }
      pre {
        background: #f8f8f8 !important;
        color: #000 !important;
        border: 1px solid #ddd !important;
        white-space: pre-wrap !important;
        font-size: 8pt !important;
      }
      .btn-print {
        display: none !important;
      }
    }

    /* Sidebar Navigation */
    .sidebar {
      width: 320px;
      height: 100vh;
      position: fixed;
      left: 0; top: 0;
      background: #070912;
      border-right: 1px solid var(--border-color);
      padding: 2rem 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 1.1rem; color: #fff;
    }

    .logo-text h1 {
      font-size: 1.25rem; font-weight: 800;
    }

    .logo-text span {
      font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; display: block;
    }

    .toc-title {
      font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 600; margin-top: 1rem;
    }

    .toc-links {
      list-style: none;
      display: flex; flex-direction: column; gap: 0.5rem;
    }

    .toc-link {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.88rem;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      display: flex; align-items: center; gap: 0.5rem;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .toc-link:hover {
      color: #fff; background: rgba(255,255,255,0.04);
    }

    .toc-link.active {
      color: var(--primary); background: rgba(59,130,246,0.08); font-weight: 600;
    }

    /* Main Content Area */
    .main-content {
      margin-left: 320px;
      padding: 3rem 4rem;
      width: calc(100% - 320px);
      max-width: 1300px;
    }

    .header-area {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 3rem; border-bottom: 1px solid var(--border-color); padding-bottom: 2rem;
    }

    .subtitle {
      color: var(--text-muted); margin-top: 0.5rem; font-size: 1.1rem;
    }

    .metadata-box {
      background: var(--bg-light); border: 1px solid var(--border-color); border-radius: 12px;
      padding: 1.5rem; margin-bottom: 2.5rem;
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;
    }

    .meta-item span {
      display: block; font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;
    }

    .meta-item strong {
      font-size: 1.1rem; color: #fff;
    }

    .section-title {
      font-size: 1.75rem; margin-top: 3rem; margin-bottom: 1.5rem; border-left: 4px solid var(--primary); padding-left: 1rem;
    }

    .stats-table {
      width: 100%; border-collapse: collapse; margin-bottom: 3rem;
    }

    .stats-table th, .stats-table td {
      padding: 0.85rem 1rem; border-bottom: 1px solid var(--border-color); text-align: left;
    }

    .stats-table th {
      color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;
    }

    .file-card {
      background: var(--bg-light); border: 1px solid var(--border-color); border-radius: 16px;
      padding: 2rem; margin-bottom: 3rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }

    .file-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem;
    }

    .file-name {
      font-size: 1.3rem; font-weight: 700; color: #fff; font-family: var(--font-mono);
    }

    .file-meta {
      font-size: 0.8rem; color: var(--text-muted);
    }

    .file-desc {
      color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;
    }

    pre {
      background: #070912; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;
      padding: 1.5rem; overflow-x: auto; font-family: var(--font-mono); font-size: 0.88rem;
      max-height: 700px;
    }

    code {
      color: #e5e7eb;
    }

    .btn-print {
      background: var(--primary); color: #fff; border: none; padding: 0.75rem 1.25rem; border-radius: 8px;
      font-family: inherit; font-size: 0.9rem; font-weight: 600; cursor: pointer;
      display: inline-flex; align-items: center; gap: 0.5rem; transition: background 0.2s;
    }

    .btn-print:hover {
      background: #2563eb;
    }

    .directory-tree {
      background: #070912; border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem;
      font-family: var(--font-mono); font-size: 0.9rem; margin-bottom: 2.5rem;
    }
  </style>
</head>
<body>

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="logo-area">
      <div class="logo-icon"><i class="fa-solid fa-cube"></i></div>
      <div class="logo-text">
        <h1>InvenTech</h1>
        <span>ITAM System v2.0</span>
      </div>
    </div>

    <div class="toc-title">Documentation</div>
    <ul class="toc-links">
      <li><a href="#overview" class="toc-link"><i class="fa-solid fa-circle-info"></i> System Overview</a></li>
      <li><a href="#stats" class="toc-link"><i class="fa-solid fa-chart-simple"></i> Codebase Statistics</a></li>
      <li><a href="#structure" class="toc-link"><i class="fa-solid fa-folder-tree"></i> Directory Structure</a></li>
    </ul>

    <div class="toc-title">Source Code Files</div>
    <ul class="toc-links">
      ${escapedFiles.map((f, i) => `
        <li>
          <a href="#file-${i}" class="toc-link">
            <i class="fa-solid fa-file-code"></i> ${f.path.split('/').pop()}
          </a>
        </li>
      `).join('')}
    </ul>
    
    <div style="margin-top:auto; padding-top:1.5rem; border-top:1px solid var(--border-color);">
      <button class="btn-print" onclick="window.print()">
        <i class="fa-solid fa-print"></i> Print to PDF
      </button>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="main-content">
    <div class="header-area">
      <div>
        <h2>InvenTech IT Asset Management System</h2>
        <p class="subtitle">Complete Source Code & System Documentation Deliverable</p>
      </div>
      <div>
        <button class="btn-print" onclick="window.print()">
          <i class="fa-solid fa-print"></i> Print Documentation
        </button>
      </div>
    </div>

    <div class="metadata-box">
      <div class="meta-item">
        <span>Prepared For</span>
        <strong>School / Masteral ASDI</strong>
      </div>
      <div class="meta-item">
        <span>Team</span>
        <strong>Mich, Joy, Jolyn</strong>
      </div>
      <div class="meta-item">
        <span>Total Files</span>
        <strong>${escapedFiles.length} files</strong>
      </div>
      <div class="meta-item">
        <span>Total Lines</span>
        <strong>${totalLines} LOC</strong>
      </div>
    </div>

    <!-- Overview Section -->
    <section id="overview">
      <h3 class="section-title">1. System & Architecture Overview</h3>
      <p style="margin-bottom: 1rem;">
        InvenTech is a high-fidelity IT Asset Management System (ITAM) prototype simulating modern multi-model database integrations, messaging buses, workflow orchestration engines, and predictive analytics platforms.
      </p>
      <p style="margin-bottom: 2rem;">
        This codebase implements a responsive Single Page Application (SPA) on the frontend styled with vanilla CSS glassmorphic aesthetics. The backend runs on Node.js and Express.js, providing realistic mock simulations of:
      </p>
      <ul style="margin-left: 2rem; margin-bottom: 3rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <li><strong>PostgreSQL Relational DB:</strong> Handles core hardware registrations, enforcing unique constraints on Serial Numbers and Asset Tags.</li>
        <li><strong>MongoDB Document Store:</strong> Manages unstructured maintenance tickets, resolving status logs, and tracking technician annotations.</li>
        <li><strong>Change Data Capture (CDC) via Debezium + Kafka:</strong> Automatically triggers immediate software license reclaiming and schedules hardware sanitization whenever a student status updates to "Graduated" or "Inactive".</li>
        <li><strong>Temporal Workflow Orchestration:</strong> Coordinates MANAGER APPROVAL -> ORDERED -> RECEIVED -> REGISTERED procurement approvals, synchronizing newly arrived hardware with relational inventories.</li>
        <li><strong>AWS SageMaker Analytics:</strong> Batch-processes time-series hardware telemetries (temperature, battery cycles) from InfluxDB to predict component failure rates.</li>
        <li><strong>NIST 800-88 Sanitization & Signature Standards:</strong> Digitally signs handoffs and generates cryptographic proof of data-wiping certificates.</li>
      </ul>
    </section>

    <!-- Stats Section -->
    <section id="stats">
      <h3 class="section-title">2. Codebase Statistics</h3>
      <table class="stats-table">
        <thead>
          <tr>
            <th>Relative File Path</th>
            <th>Type</th>
            <th>Lines of Code</th>
            <th>File Size</th>
          </tr>
        </thead>
        <tbody>
          ${escapedFiles.map(f => `
            <tr>
              <td><code>${f.path}</code></td>
              <td><code>${path.extname(f.path) || 'Config'}</code></td>
              <td><strong>${f.linesCount}</strong> lines</td>
              <td>${(f.sizeBytes / 1024).toFixed(2)} KB</td>
            </tr>
          `).join('')}
          <tr style="border-top:2px solid var(--primary); background: rgba(59,130,246,0.05);">
            <td><strong>TOTAL SUMMARY</strong></td>
            <td><strong>-</strong></td>
            <td><strong>${totalLines} LOC</strong></td>
            <td><strong>${(totalBytes / 1024).toFixed(2)} KB</strong></td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Structure Section -->
    <section id="structure">
      <h3 class="section-title">3. Directory Structure</h3>
      <div class="directory-tree">
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
      </div>
    </section>

    <!-- Files Section -->
    <section id="files">
      <h3 class="section-title">4. Source Code Compilation</h3>
      
      ${escapedFiles.map((f, i) => `
        <div class="file-card" id="file-${i}">
          <div class="file-header">
            <div class="file-name">${f.path}</div>
            <div class="file-meta">${f.linesCount} lines | ${(f.sizeBytes / 1024).toFixed(2)} KB</div>
          </div>
          <div class="file-desc"><strong>Module Description:</strong> ${f.description}</div>
          <pre><code class="language-${f.lang}">${f.escapedContent}</code></pre>
        </div>
      `).join('')}
    </section>

  </main>

  <script>
    // Simple navigation highlighting
    const links = document.querySelectorAll('.toc-link');
    window.addEventListener('scroll', () => {
      let fromTop = window.scrollY + 50;
      links.forEach(link => {
        const id = link.getAttribute('href').substring(1);
        const section = document.getElementById(id);
        if (section) {
          if (
            section.offsetTop <= fromTop &&
            section.offsetTop + section.offsetHeight > fromTop
          ) {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(HTML_OUTPUT, htmlContent, 'utf8');
console.log(`HTML documentation generated successfully: ${HTML_OUTPUT}`);
console.log('Compilation finished successfully!');

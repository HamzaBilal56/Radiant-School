// ═══════════════════════════════════════════════
//   DATABASE (localStorage)
// ═══════════════════════════════════════════════
const DB_KEY = "educore_db";
const DB_VERSION = 4; // bumped: adds materials + subjects tables

function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    const db = JSON.parse(raw);
    // If DB version doesn't match, wipe and re-seed
    if (!db._version || db._version < DB_VERSION) {
      localStorage.removeItem(DB_KEY);
      return initDB();
    }
    return db;
  }
  return initDB();
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function initDB() {
  const db = {
    users: [
      // Admin — credentials unchanged
      {
        id: "u1",
        name: "Principal Admin",
        email: "admin@educore.school",
        password: "admin123",
        role: "admin",
        avatar: "PA",
      },
    ],
    classes: [
      "Class 1-A",
      "Class 1-B",
      "Class 2-A",
      "Class 2-B",
      "Class 3-A",
      "Class 4-A",
      "Class 5-A",
      "Class 6-A",
      "Class 7-A",
      "Class 8-A",
      "Class 9-A",
      "Class 9-B",
      "Class 10-A",
      "Class 10-B",
      "Class 11-A",
      "Class 12-A",
    ],
    students: [],
    teachers: [],
    fees: [],
    attendance: [],
    activities: [],
  };
  seedData(db);

  // ── Generate teacher accounts ──
  // Email : firstname.lastnameT001@educore.school  (no spaces, lowercase)
  // Password : DOB in YYYY-MM-DD format (e.g. 1985-06-14)
  db.teachers.forEach((t) => {
    const email = `${t.firstName.toLowerCase()}.${t.lastName.toLowerCase()}${t.teacherId.toLowerCase()}@educore.school`;
    const pass = t.dob; // e.g. "1985-06-14"
    t.email = email; // keep teacher record in sync
    db.users.push({
      id: uid(),
      name: `${t.firstName} ${t.lastName}`,
      email,
      password: pass,
      role: "teacher",
      avatar: `${t.firstName.charAt(0)}${t.lastName.charAt(0)}`,
      subject: t.subject,
      teacherId: t.teacherId,
    });
  });

  // ── Generate student accounts ──
  // Email : firstname.lastnameS0001@school.edu
  // Password : DOB in YYYY-MM-DD format
  db.students.forEach((s) => {
    const email = `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}${s.studentId.toLowerCase()}@school.edu`;
    const pass = s.dob;
    s.email = email;
    db.users.push({
      id: uid(),
      name: `${s.firstName} ${s.lastName}`,
      email,
      password: pass,
      role: "student",
      avatar: `${s.firstName.charAt(0)}${s.lastName.charAt(0)}`,
      class: s.class,
      studentId: s.studentId,
    });
  });

  db._version = DB_VERSION;
  saveDB(db);
  return db;
}

function uid() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

const NAMES = {
  first: [
    "Amelia",
    "Oliver",
    "Sophia",
    "Liam",
    "Emma",
    "Noah",
    "Ava",
    "Elijah",
    "Isabella",
    "Lucas",
    "Mia",
    "Mason",
    "Charlotte",
    "James",
    "Evelyn",
    "Aiden",
    "Harper",
    "Logan",
    "Abigail",
    "Jackson",
    "Emily",
    "Sebastian",
    "Elizabeth",
    "Mateo",
    "Mila",
    "Jack",
    "Ella",
    "Owen",
    "Avery",
    "Samuel",
  ],
  last: [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Wilson",
    "Taylor",
    "Moore",
    "Anderson",
    "Thomas",
    "Martin",
    "Lee",
    "Thompson",
    "White",
    "Harris",
    "Clark",
    "Lewis",
    "Robinson",
    "Walker",
    "Hall",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Green",
    "Baker",
  ],
};
const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Art",
  "Physical Education",
  "Economics",
  "Literature",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function rndInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function seedData(db) {
  // Seed Students
  for (let i = 0; i < 42; i++) {
    const fn = rnd(NAMES.first),
      ln = rnd(NAMES.last);
    const cls = rnd(db.classes);
    db.students.push({
      id: uid(),
      studentId: `S${String(i + 1).padStart(4, "0")}`,
      firstName: fn,
      lastName: ln,
      gender: rnd(["Male", "Female"]),
      dob: `${rndInt(2005, 2012)}-${String(rndInt(1, 12)).padStart(2, "0")}-${String(rndInt(1, 28)).padStart(2, "0")}`,
      class: cls,
      rollNumber: `${cls.replace(/\s/g, "")}-${rndInt(1, 40)}`,
      parentName: `${rnd(NAMES.first)} ${ln}`,
      phone: `+1${rndInt(200, 999)}${rndInt(1000000, 9999999)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@students.edu`,
      address: `${rndInt(100, 999)} ${rnd(["Oak", "Pine", "Maple", "Cedar"])} St, City`,
      status: Math.random() > 0.1 ? "Active" : "Inactive",
      admissionDate: `${rndInt(2020, 2023)}-08-15`,
      feeAmount: rndInt(400, 800),
    });
  }
  // Seed Teachers
  for (let i = 0; i < 14; i++) {
    const fn = rnd(NAMES.first),
      ln = rnd(NAMES.last);
    const sub = SUBJECTS[i % SUBJECTS.length];
    const dob = `${rndInt(1975, 1992)}-${String(rndInt(1, 12)).padStart(2, "0")}-${String(rndInt(1, 28)).padStart(2, "0")}`;
    db.teachers.push({
      id: uid(),
      teacherId: `T${String(i + 1).padStart(3, "0")}`,
      firstName: fn,
      lastName: ln,
      subject: sub,
      dob,
      qualification: `${rnd(["B.Sc", "M.Sc", "Ph.D", "B.Ed", "M.Ed"])} ${sub}`,
      phone: `+1${rndInt(200, 999)}${rndInt(1000000, 9999999)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@educore.school`,
      salary: rndInt(38000, 75000),
      joinDate: `${rndInt(2015, 2022)}-${String(rndInt(1, 12)).padStart(2, "0")}-01`,
      status: Math.random() > 0.1 ? "Active" : "On Leave",
      classes: `${rnd(db.classes)}, ${rnd(db.classes)}`,
      address: `${rndInt(10, 99)} ${rnd(["Elm", "Birch", "Walnut"])} Ave, Town`,
    });
  }
  // Seed Fees
  const today = new Date();
  db.students.forEach((s) => {
    MONTHS.slice(0, today.getMonth() + 1).forEach((month, mi) => {
      const status =
        mi < today.getMonth()
          ? Math.random() > 0.15
            ? "Paid"
            : "Overdue"
          : Math.random() > 0.5
            ? "Paid"
            : "Pending";
      const paidDate =
        status === "Paid"
          ? `2024-${String(mi + 1).padStart(2, "0")}-${rndInt(1, 25)}`
          : "";
      db.fees.push({
        id: uid(),
        studentId: s.id,
        amount: s.feeAmount,
        month,
        year: 2024,
        dueDate: `2024-${String(mi + 1).padStart(2, "0")}-10`,
        paidDate,
        status,
        receiptNo: `RCP${rndInt(10000, 99999)}`,
        notes: "",
      });
    });
  });
  // Seed Attendance (last 30 days)
  for (let d = 29; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateStr = date.toISOString().split("T")[0];
    db.students.slice(0, 20).forEach((s) => {
      const r = Math.random();
      db.attendance.push({
        id: uid(),
        studentId: s.id,
        date: dateStr,
        status: r > 0.85 ? "Absent" : r > 0.7 ? "Late" : "Present",
        class: s.class,
      });
    });
  }
  // Seed Activities
  db.activities = [
    {
      text: "New student Amelia Johnson enrolled in Class 10-A",
      time: "2 hours ago",
      color: "var(--green)",
    },
    {
      text: "Fee payment received from Oliver Smith — $500",
      time: "4 hours ago",
      color: "var(--accent)",
    },
    {
      text: "Attendance marked for Class 9-B",
      time: "5 hours ago",
      color: "var(--teal)",
    },
    {
      text: "Teacher Dr. Garcia added to Mathematics department",
      time: "Yesterday",
      color: "var(--purple)",
    },
    {
      text: "Monthly fee report generated for December 2024",
      time: "Yesterday",
      color: "var(--amber)",
    },
    {
      text: "Class 10-A attendance: 28/32 students present",
      time: "2 days ago",
      color: "var(--green)",
    },
    {
      text: "3 students marked overdue on fee payment",
      time: "2 days ago",
      color: "var(--red)",
    },
    {
      text: "New teacher Mrs. Thompson joined Physics dept.",
      time: "3 days ago",
      color: "var(--purple)",
    },
  ];
}

// ═══════════════════════════════════════════════
//   THEME
// ═══════════════════════════════════════════════
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle("light");
  localStorage.setItem("educore_theme", isLight ? "light" : "dark");
  // Redraw charts to match new theme tick colours
  if (currentPage === "dashboard") setTimeout(renderDashboard, 50);
}

function applyTheme() {
  const saved = localStorage.getItem("educore_theme");
  if (saved === "light") document.documentElement.classList.add("light");
  else document.documentElement.classList.remove("light"); // dark default
}

// ═══════════════════════════════════════════════
//   AUTH
// ═══════════════════════════════════════════════
function toggleLoginPw() {
  const inp = document.getElementById("login-password");
  const eye = document.getElementById("pw-eye");
  if (inp.type === "password") {
    inp.type = "text";
    eye.textContent = "🙈";
  } else {
    inp.type = "password";
    eye.textContent = "👁";
  }
}

function showLoginError(msg) {
  const el = document.getElementById("login-error");
  el.textContent = msg;
  el.style.display = "block";
}
function hideLoginError() {
  document.getElementById("login-error").style.display = "none";
}

let currentUser = null;

function handleLogin() {
  const email = document
    .getElementById("login-email")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("login-password").value.trim();
  const role = document.getElementById("login-role").value;
  hideLoginError();
  if (!email) {
    showLoginError("Please enter your email address.");
    return;
  }
  if (!password) {
    showLoginError("Please enter your password.");
    return;
  }
  const db = getDB();
  const user = db.users.find(
    (u) =>
      u.email.toLowerCase() === email &&
      u.password === password &&
      u.role === role,
  );
  if (!user) {
    showLoginError(
      "Incorrect email, password, or role. Please check your credentials and try again.",
    );
    return;
  }
  currentUser = user;
  sessionStorage.setItem("currentUser", JSON.stringify(user));
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app").style.display = "flex";
  initApp();
}

function handleLogout(e) {
  if (e) e.stopPropagation();
  currentUser = null;
  sessionStorage.removeItem("currentUser");
  document.getElementById("app").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  hideLoginError();
  showToast("Signed out successfully", "info");
}

// ═══════════════════════════════════════════════
//   APP INIT
// ═══════════════════════════════════════════════
const NAV_CONFIG = {
  admin: [
    {
      section: "Main",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "🏠" },
        { id: "students", label: "Students", icon: "🎓" },
        { id: "teachers", label: "Teachers", icon: "👩‍🏫" },
      ],
    },
    { section: "Finance", items: [{ id: "fees", label: "Fees", icon: "💰" }] },
    {
      section: "Academic",
      items: [
        { id: "attendance", label: "Attendance", icon: "📋" },
        { id: "classes",    label: "Class Materials", icon: "📂" },
        { id: "reports",    label: "Reports", icon: "📊" },
      ],
    },
    {
      section: "Account",
      items: [{ id: "notifications", label: "Notifications", icon: "🔔" }],
    },
  ],
  teacher: [
    {
      section: "Main",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "🏠" },
        { id: "students",  label: "Students", icon: "🎓" },
        { id: "attendance",label: "Attendance", icon: "📋" },
        { id: "classes",   label: "Class Materials", icon: "📂" },
        { id: "reports",   label: "Reports", icon: "📊" },
      ],
    },
    {
      section: "Account",
      items: [{ id: "notifications", label: "Notifications", icon: "🔔" }],
    },
  ],
  student: [
    {
      section: "Main",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "🏠" },
        { id: "fees",      label: "My Fees", icon: "💰" },
        { id: "attendance",label: "Attendance", icon: "📋" },
        { id: "classes",   label: "Class Materials", icon: "📂" },
      ],
    },
    {
      section: "Account",
      items: [{ id: "notifications", label: "Notifications", icon: "🔔" }],
    },
  ],
};

let currentPage = "dashboard";

function initApp() {
  buildSidebar();
  updateUserDisplay();
  updateRoleAccess();
  populateFilters();
  initClassModule();    // class materials module
  populateCMFilters();  // populate class/subject dropdowns in upload modal
  // Show dashboard directly and render it — no refresh needed
  showPage("dashboard");
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  sidebar.classList.toggle("mobile-open");
  overlay.classList.toggle("open");
}

function closeMobileSidebar() {
  document.getElementById("sidebar").classList.remove("mobile-open");
  document.getElementById("sidebar-overlay").classList.remove("open");
}

function buildSidebar() {
  const nav = document.getElementById("sidebar-nav");
  nav.innerHTML = "";
  const config = NAV_CONFIG[currentUser.role] || NAV_CONFIG.admin;
  config.forEach((section) => {
    const sec = document.createElement("div");
    sec.className = "nav-section";
    sec.innerHTML = `<div class="nav-section-title">${section.section}</div>`;
    section.items.forEach((item) => {
      const el = document.createElement("div");
      el.className = "nav-item";
      el.id = `nav-${item.id}`;
      el.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${item.label}</span>`;
      el.onclick = () => showPage(item.id);
      sec.appendChild(el);
    });
    nav.appendChild(sec);
  });
}

function updateUserDisplay() {
  document.getElementById("user-avatar-sidebar").textContent =
    currentUser.avatar || currentUser.name.charAt(0);
  document.getElementById("user-name-sidebar").textContent = currentUser.name;
  document.getElementById("user-role-sidebar").textContent =
    currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
}

function updateRoleAccess() {
  const isAdmin = currentUser.role === "admin";
  const isTeacher = currentUser.role === "teacher";
  const el = (id) => {
    const e = document.getElementById(id);
    if (e) return e;
  };
  if (!isAdmin) {
    el("btn-add-student") && (el("btn-add-student").style.display = "none");
    el("btn-add-teacher") && (el("btn-add-teacher").style.display = "none");
    el("btn-add-fee") && (el("btn-add-fee").style.display = "none");
  }
}

function populateFilters() {
  const db = getDB();
  // Class filters
  ["student-class-filter", "att-rep-class"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const baseOption = el.options[0];
    el.innerHTML = "";
    el.appendChild(baseOption.cloneNode(true));
    db.classes.forEach((c) => {
      const o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      el.appendChild(o);
    });
  });
  // Attendance mark class — has its own placeholder
  const attCls = document.getElementById("att-class");
  if (attCls) {
    attCls.innerHTML = '<option value="">— Select Class —</option>';
    db.classes.forEach((c) => {
      const o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      attCls.appendChild(o);
    });
  }
  // Teacher department filter
  const deptFilter = document.getElementById("teacher-dept-filter");
  if (deptFilter) {
    SUBJECTS.forEach((s) => {
      const o = document.createElement("option");
      o.value = s;
      o.textContent = s;
      deptFilter.appendChild(o);
    });
  }
  // Student select for fees
  const fStu = document.getElementById("f-student");
  if (fStu) {
    db.students
      .filter((s) => s.status === "Active")
      .forEach((s) => {
        const o = document.createElement("option");
        o.value = s.id;
        o.textContent = `${s.firstName} ${s.lastName} (${s.class})`;
        fStu.appendChild(o);
      });
  }
  // Fee month filter
  const fMonth = document.getElementById("fee-month-filter");
  if (fMonth) {
    MONTHS.forEach((m) => {
      const o = document.createElement("option");
      o.value = m;
      o.textContent = m;
      fMonth.appendChild(o);
    });
  }
  // Student class for forms
  const sClass = document.getElementById("s-class");
  if (sClass) {
    db.classes.forEach((c) => {
      const o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      sClass.appendChild(o);
    });
  }
  // Attendance date — default today
  const attDate = document.getElementById("att-date");
  if (attDate) attDate.value = new Date().toISOString().split("T")[0];
  // Monthly report month filter
  const repMonth = document.getElementById("att-rep-month");
  if (repMonth) {
    MONTHS.forEach((m, i) => {
      const o = document.createElement("option");
      o.value = i + 1;
      o.textContent = m;
      repMonth.appendChild(o);
    });
    repMonth.value = new Date().getMonth() + 1;
  }
  // att-rep-class already handled above
}

// ═══════════════════════════════════════════════
//   NAVIGATION
// ═══════════════════════════════════════════════
function showPage(pageId) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add("active");
  const navItem = document.getElementById(`nav-${pageId}`);
  if (navItem) navItem.classList.add("active");
  document.getElementById("topbar-title").textContent =
    {
      dashboard:     "Dashboard",
      students:      "Students",
      teachers:      "Teachers",
      fees:          "Fee Management",
      attendance:    "Attendance",
      classes:       "Class Materials",
      reports:       "Reports",
      profile:       "My Profile",
      notifications: "Notifications",
    }[pageId] || pageId;
  currentPage = pageId;
  // Close mobile sidebar on navigation
  closeMobileSidebar();
  if (pageId === "dashboard")  renderDashboard();
  if (pageId === "students")   renderStudents();
  if (pageId === "teachers")   renderTeachers();
  if (pageId === "fees")       renderFees();
  if (pageId === "attendance") { resetAttTabs(); loadAttendanceForMark(); }
  if (pageId === "classes")    renderClassesPage();
  if (pageId === "reports")    renderReport("summary");
  if (pageId === "notifications") renderNotifications();
  if (pageId === "profile")    renderProfile();
}

// ═══════════════════════════════════════════════
//   DASHBOARD
// ═══════════════════════════════════════════════
let charts = {};

function renderDashboard() {
  const db = getDB();
  const totalStudents = db.students.filter((s) => s.status === "Active").length;
  const totalTeachers = db.teachers.filter((t) => t.status === "Active").length;
  const paidFees = db.fees.filter((f) => f.status === "Paid");
  const totalFees = paidFees.reduce((a, f) => a + Number(f.amount), 0);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayAtt = db.attendance.filter((a) => a.date === todayStr);
  const attPct = todayAtt.length
    ? Math.round(
        (todayAtt.filter((a) => a.status === "Present").length /
          todayAtt.length) *
          100,
      )
    : 87;

  document.getElementById("dash-stats").innerHTML = `
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon" style="background:var(--accent-glow)">🎓</div>
        <span class="stat-badge badge-blue">+3 this week</span>
      </div>
      <div class="stat-val">${totalStudents}</div>
      <div class="stat-label">Total Students</div>
    </div>
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon" style="background:var(--purple-bg)">👩‍🏫</div>
        <span class="stat-badge badge-purple">Active</span>
      </div>
      <div class="stat-val">${totalTeachers}</div>
      <div class="stat-label">Total Teachers</div>
    </div>
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon" style="background:var(--green-bg)">💰</div>
        <span class="stat-badge badge-green">This year</span>
      </div>
      <div class="stat-val">$${(totalFees / 1000).toFixed(1)}k</div>
      <div class="stat-label">Fees Collected</div>
    </div>
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon" style="background:var(--teal-bg)">📋</div>
        <span class="stat-badge badge-teal">Today</span>
      </div>
      <div class="stat-val">${attPct}%</div>
      <div class="stat-label">Attendance Rate</div>
    </div>
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon" style="background:var(--amber-bg)">📚</div>
        <span class="stat-badge badge-amber">${db.classes.length} classes</span>
      </div>
      <div class="stat-val">${db.classes.length}</div>
      <div class="stat-label">Active Classes</div>
    </div>
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon" style="background:var(--red-bg)">⚠</div>
        <span class="stat-badge badge-red">Pending</span>
      </div>
      <div class="stat-val">${db.fees.filter((f) => f.status !== "Paid").length}</div>
      <div class="stat-label">Pending Fees</div>
    </div>
  `;

  // Activities
  document.getElementById("activity-list").innerHTML = db.activities
    .map(
      (a) => `
    <div class="activity-item">
      <div class="activity-dot" style="background:${a.color}"></div>
      <div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>`,
    )
    .join("");

  renderCharts(db);
}

function refreshDashboard() {
  renderDashboard();
  showToast("Dashboard refreshed", "success");
}

function renderCharts(db) {
  const isMobile = window.innerWidth <= 640;
  const isLight = document.documentElement.classList.contains("light");
  const tickColor = isLight ? "#6b7280" : "#8b91a8";
  const gridColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";
  const legendColor = isLight ? "#4b5563" : "#8b91a8";

  const colors = {
    accent: "rgba(79,124,255,",
    green: "rgba(34,197,94,",
    amber: "rgba(245,158,11,",
    red: "rgba(239,68,68,",
    purple: "rgba(168,85,247,",
    teal: "rgba(20,184,166,",
  };

  const baseScales = {
    x: {
      grid: { color: gridColor },
      ticks: {
        color: tickColor,
        font: { family: "DM Sans", size: 10 },
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: isMobile ? 6 : 12,
      },
    },
    y: {
      grid: { color: gridColor },
      ticks: { color: tickColor, font: { family: "DM Sans", size: 10 } },
    },
  };
  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: baseScales,
  };

  // Adjust container heights for mobile
  const containerH = isMobile ? 170 : 210;
  document.querySelectorAll(".chart-card > div[style]").forEach((d) => {
    d.style.height = containerH + "px";
  });

  // Enrollment line
  if (charts.enrollment) charts.enrollment.destroy();
  charts.enrollment = new Chart(document.getElementById("chartEnrollment"), {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Students",
          data: [28, 30, 32, 31, 34, 36, 35, 38, 40, 42, 41, 42],
          borderColor: colors.accent + "1)",
          backgroundColor: colors.accent + "0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: isMobile ? 2 : 3,
          pointBackgroundColor: colors.accent + "1)",
        },
      ],
    },
    options: { ...baseOpts },
  });

  // Attendance doughnut
  const present = db.attendance.filter((a) => a.status === "Present").length;
  const absent = db.attendance.filter((a) => a.status === "Absent").length;
  const late = db.attendance.filter((a) => a.status === "Late").length;
  if (charts.attendance) charts.attendance.destroy();
  charts.attendance = new Chart(document.getElementById("chartAttendance"), {
    type: "doughnut",
    data: {
      labels: ["Present", "Absent", "Late"],
      datasets: [
        {
          data: [present, absent, late],
          backgroundColor: [
            colors.green + "0.85)",
            colors.red + "0.85)",
            colors.amber + "0.85)",
          ],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: legendColor,
            font: { family: "DM Sans", size: isMobile ? 10 : 11 },
            padding: isMobile ? 8 : 14,
            boxWidth: 12,
          },
        },
      },
      cutout: "65%",
    },
  });

  // Fee bar
  const monthlyFees = MONTHS.map((m) =>
    db.fees
      .filter((f) => f.month === m && f.status === "Paid")
      .reduce((a, f) => a + Number(f.amount), 0),
  );
  if (charts.fees) charts.fees.destroy();
  charts.fees = new Chart(document.getElementById("chartFees"), {
    type: "bar",
    data: {
      labels: MONTHS.map((m) => m.slice(0, 3)),
      datasets: [
        {
          label: "Collected",
          data: monthlyFees,
          backgroundColor: colors.green + "0.7)",
          borderRadius: 4,
          hoverBackgroundColor: colors.green + "0.9)",
        },
      ],
    },
    options: { ...baseOpts },
  });

  // Class distribution
  const classCounts = {};
  db.students.forEach((s) => {
    classCounts[s.class] = (classCounts[s.class] || 0) + 1;
  });
  const topClasses = Object.entries(classCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, isMobile ? 5 : 6);
  if (charts.classes) charts.classes.destroy();
  charts.classes = new Chart(document.getElementById("chartClasses"), {
    type: "polarArea",
    data: {
      labels: topClasses.map((c) => c[0]),
      datasets: [
        {
          data: topClasses.map((c) => c[1]),
          backgroundColor: [
            "rgba(79,124,255,0.7)",
            "rgba(34,197,94,0.7)",
            "rgba(245,158,11,0.7)",
            "rgba(239,68,68,0.7)",
            "rgba(168,85,247,0.7)",
            "rgba(20,184,166,0.7)",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: !isMobile,
          position: "right",
          labels: {
            color: legendColor,
            font: { family: "DM Sans", size: 10 },
            padding: 8,
            boxWidth: 10,
          },
        },
      },
    },
  });
}

// ═══════════════════════════════════════════════
//   STUDENTS
// ═══════════════════════════════════════════════
let studentPage = 1,
  studentPageSize = 10,
  filteredStudents = [];

function renderStudents() {
  const db = getDB();
  filteredStudents = db.students;
  applyStudentFilters();
  document.getElementById("student-count-label").textContent =
    `${db.students.length} students enrolled`;
}

function filterStudents() {
  studentPage = 1;
  applyStudentFilters();
}

function applyStudentFilters() {
  const db = getDB();
  const search = document.getElementById("student-search").value.toLowerCase();
  const cls = document.getElementById("student-class-filter").value;
  const status = document.getElementById("student-status-filter").value;
  filteredStudents = db.students.filter((s) => {
    const name = `${s.firstName} ${s.lastName}`.toLowerCase();
    return (
      (!search ||
        name.includes(search) ||
        s.studentId.toLowerCase().includes(search) ||
        (s.parentName || "").toLowerCase().includes(search)) &&
      (!cls || s.class === cls) &&
      (!status || s.status === status)
    );
  });
  renderStudentsTable();
}

function renderStudentsTable() {
  const start = (studentPage - 1) * studentPageSize;
  const page = filteredStudents.slice(start, start + studentPageSize);
  const isAdmin = currentUser.role === "admin";
  document.getElementById("students-tbody").innerHTML = page.length
    ? page
        .map((s) => {
          const initials = `${s.firstName.charAt(0)}${s.lastName.charAt(0)}`;
          const colors = [
            "#4f7cff",
            "#22c55e",
            "#f59e0b",
            "#a855f7",
            "#14b8a6",
            "#ef4444",
          ];
          const color = colors[s.firstName.charCodeAt(0) % colors.length];
          return `<tr>
      <td><div class="avatar-cell"><div class="avatar" style="background:${color}22;color:${color}">${initials}</div>
        <div><div class="cell-name">${s.firstName} ${s.lastName}</div><div class="cell-sub">${s.email || ""}</div></div></div></td>
      <td class="hide-sm"><code style="font-size:11px;font-family:var(--mono);color:var(--text2)">${s.studentId}</code></td>
      <td>${s.class}</td>
      <td class="hide-sm">${s.parentName || "—"}</td>
      <td class="hide-sm">${s.phone || "—"}</td>
      <td><span class="badge ${s.status === "Active" ? "badge-green" : "badge-red"}">${s.status}</span></td>
      <td>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" onclick="viewStudent('${s.id}')">View</button>
          ${
            isAdmin
              ? `<button class="btn btn-ghost btn-sm" onclick="openStudentModal('${s.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteStudent('${s.id}')">Del</button>`
              : ""
          }
        </div>
      </td>
    </tr>`;
        })
        .join("")
    : `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">🎓</div><p>No students found</p></div></td></tr>`;
  renderPagination(
    "students",
    filteredStudents.length,
    studentPage,
    studentPageSize,
  );
}

function viewStudent(id) {
  const db = getDB();
  const s = db.students.find((x) => x.id === id);
  if (!s) return;
  const fees = db.fees.filter((f) => f.studentId === id);
  const paidFees = fees
    .filter((f) => f.status === "Paid")
    .reduce((a, f) => a + Number(f.amount), 0);
  const att = db.attendance.filter((a) => a.studentId === id);
  const attPct = att.length
    ? Math.round(
        (att.filter((a) => a.status === "Present").length / att.length) * 100,
      )
    : "N/A";
  const initials = `${s.firstName.charAt(0)}${s.lastName.charAt(0)}`;
  showConfirmModal(
    "Student Details",
    `
    <div class="detail-card" style="border:none;padding:0;">
      <div class="detail-header">
        <div class="detail-avatar" style="background:var(--accent-glow);color:var(--accent)">${initials}</div>
        <div class="detail-meta">
          <h3>${s.firstName} ${s.lastName}</h3>
          <p>${s.class} • ${s.studentId}</p>
          <span class="badge ${s.status === "Active" ? "badge-green" : "badge-red"}" style="margin-top:4px">${s.status}</span>
        </div>
      </div>
      <div class="detail-fields">
        <div class="detail-field"><label>Date of Birth</label><span>${s.dob || "—"}</span></div>
        <div class="detail-field"><label>Gender</label><span>${s.gender || "—"}</span></div>
        <div class="detail-field"><label>Roll Number</label><span>${s.rollNumber || "—"}</span></div>
        <div class="detail-field"><label>Parent</label><span>${s.parentName || "—"}</span></div>
        <div class="detail-field"><label>Phone</label><span>${s.phone || "—"}</span></div>
        <div class="detail-field"><label>Login Email</label><span style="font-size:11px;word-break:break-all;">${s.email || "—"}</span></div>
        <div class="detail-field"><label>Login Password</label><span style="font-family:var(--mono);font-size:12px;">${s.dob || "(set DOB)"}</span></div>
        <div class="detail-field"><label>Fees Paid</label><span>$${paidFees.toLocaleString()}</span></div>
        <div class="detail-field"><label>Attendance</label><span>${attPct}%</span></div>
        <div class="detail-field"><label>Admission</label><span>${s.admissionDate || "—"}</span></div>
      </div>
      ${s.address ? `<div style="margin-top:16px;"><label style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">Address</label><p style="font-size:13px;margin-top:4px;color:var(--text2)">${s.address}</p></div>` : ""}
    </div>
  `,
    null,
    null,
  );
}

let editStudentId = null;
function openStudentModal(id) {
  editStudentId = id || null;
  document.getElementById("student-modal-title").textContent = id
    ? "Edit Student"
    : "Add Student";
  const db = getDB();
  if (id) {
    const s = db.students.find((x) => x.id === id);
    if (!s) return;
    document.getElementById("s-fname").value = s.firstName || "";
    document.getElementById("s-lname").value = s.lastName || "";
    document.getElementById("s-dob").value = s.dob || "";
    document.getElementById("s-gender").value = s.gender || "";
    document.getElementById("s-class").value = s.class || "";
    document.getElementById("s-roll").value = s.rollNumber || "";
    document.getElementById("s-parent").value = s.parentName || "";
    document.getElementById("s-phone").value = s.phone || "";
    document.getElementById("s-address").value = s.address || "";
    // email is auto-generated, no field to set
    document.getElementById("s-status").value = s.status || "Active";
    document.getElementById("s-admission").value = s.admissionDate || "";
    document.getElementById("s-fee").value = s.feeAmount || "";
  } else {
    [
      "s-fname",
      "s-lname",
      "s-dob",
      "s-parent",
      "s-phone",
      "s-address",
      "s-admission",
      "s-fee",
    ].forEach((id) => {
      document.getElementById(id).value = "";
    });
    document.getElementById("s-gender").value = "";
    document.getElementById("s-class").value = "";
    document.getElementById("s-status").value = "Active";
    document.getElementById("s-roll").value = "";
  }
  ["s-fname-err", "s-lname-err", "s-class-err"].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
  openModal("student-modal");
}

function saveStudent() {
  const fname = document.getElementById("s-fname").value.trim();
  const lname = document.getElementById("s-lname").value.trim();
  const cls = document.getElementById("s-class").value;
  const dob = document.getElementById("s-dob").value;
  let valid = true;
  if (!fname) {
    document.getElementById("s-fname-err").textContent = "Required";
    valid = false;
  }
  if (!lname) {
    document.getElementById("s-lname-err").textContent = "Required";
    valid = false;
  }
  if (!cls) {
    document.getElementById("s-class-err").textContent = "Required";
    valid = false;
  }
  if (!valid) return;
  const db = getDB();
  const data = {
    firstName: fname,
    lastName: lname,
    dob,
    gender: document.getElementById("s-gender").value,
    class: cls,
    parentName: document.getElementById("s-parent").value,
    phone: document.getElementById("s-phone").value,
    address: document.getElementById("s-address").value,
    status: document.getElementById("s-status").value,
    admissionDate: document.getElementById("s-admission").value,
    feeAmount: document.getElementById("s-fee").value,
  };
  if (editStudentId) {
    const idx = db.students.findIndex((s) => s.id === editStudentId);
    if (idx > -1) {
      db.students[idx] = { ...db.students[idx], ...data };
      // Update matching user account password if DOB changed
      const s = db.students[idx];
      const uIdx = db.users.findIndex(
        (u) => u.studentId === s.studentId && u.role === "student",
      );
      if (uIdx > -1 && dob) db.users[uIdx].password = dob;
    }
    logActivity(`Student ${fname} ${lname} updated`, "var(--accent)");
    showToast("Student updated successfully", "success");
  } else {
    const sid = `S${String(db.students.length + 1).padStart(4, "0")}`;
    const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${sid.toLowerCase()}@school.edu`;
    const newStudent = {
      id: uid(),
      studentId: sid,
      rollNumber: `${cls.replace(/\s/g, "")}-${db.students.length + 1}`,
      email,
      ...data,
    };
    db.students.push(newStudent);
    // Create login account: email = firstname.lastnameS0001@school.edu, password = DOB
    db.users.push({
      id: uid(),
      name: `${fname} ${lname}`,
      email,
      password: dob || sid,
      role: "student",
      avatar: `${fname.charAt(0)}${lname.charAt(0)}`,
      class: cls,
      studentId: sid,
    });
    logActivity(`New student ${fname} ${lname} enrolled`, "var(--green)");
    showToast(`Student added — Login: ${email} / ${dob || sid}`, "success");
  }
  saveDB(db);
  closeModal("student-modal");
  renderStudents();
  refreshFilters();
}

function deleteStudent(id) {
  const db = getDB();
  const s = db.students.find((x) => x.id === id);
  showConfirm(
    `Delete student "${s.firstName} ${s.lastName}"? This will also remove their attendance and fee records.`,
    () => {
      const db2 = getDB();
      db2.students = db2.students.filter((x) => x.id !== id);
      db2.fees = db2.fees.filter((f) => f.studentId !== id);
      db2.attendance = db2.attendance.filter((a) => a.studentId !== id);
      logActivity(
        `Student ${s.firstName} ${s.lastName} removed`,
        "var(--red)",
        db2,
      );
      saveDB(db2);
      renderStudents();
      showToast("Student deleted", "info");
    },
  );
}

// ═══════════════════════════════════════════════
//   TEACHERS
// ═══════════════════════════════════════════════
let teacherPage = 1,
  teacherPageSize = 10,
  filteredTeachers = [];

function renderTeachers() {
  const db = getDB();
  filteredTeachers = db.teachers;
  applyTeacherFilters();
}

function filterTeachers() {
  teacherPage = 1;
  applyTeacherFilters();
}

function applyTeacherFilters() {
  const db = getDB();
  const search = document.getElementById("teacher-search").value.toLowerCase();
  const dept = document.getElementById("teacher-dept-filter").value;
  filteredTeachers = db.teachers.filter(
    (t) =>
      (!search ||
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(search) ||
        t.teacherId.toLowerCase().includes(search)) &&
      (!dept || t.subject === dept),
  );
  renderTeachersTable();
}

function renderTeachersTable() {
  const start = (teacherPage - 1) * teacherPageSize;
  const page = filteredTeachers.slice(start, start + teacherPageSize);
  const isAdmin = currentUser.role === "admin";
  document.getElementById("teachers-tbody").innerHTML = page.length
    ? page
        .map((t) => {
          const initials = `${t.firstName.charAt(0)}${t.lastName.charAt(0)}`;
          const colors = [
            "#a855f7",
            "#14b8a6",
            "#f59e0b",
            "#4f7cff",
            "#22c55e",
            "#ef4444",
          ];
          const color = colors[t.firstName.charCodeAt(0) % colors.length];
          return `<tr>
      <td><div class="avatar-cell"><div class="avatar" style="background:${color}22;color:${color}">${initials}</div>
        <div><div class="cell-name">${t.firstName} ${t.lastName}</div><div class="cell-sub">${t.email || ""}</div></div></div></td>
      <td class="hide-sm"><code style="font-size:11px;font-family:var(--mono);color:var(--text2)">${t.teacherId}</code></td>
      <td><span class="badge badge-purple">${t.subject}</span></td>
      <td class="hide-sm">${t.phone || "—"}</td>
      <td class="hide-sm">$${Number(t.salary || 0).toLocaleString()}</td>
      <td><span class="badge ${t.status === "Active" ? "badge-green" : t.status === "On Leave" ? "badge-amber" : "badge-red"}">${t.status}</span></td>
      <td><div style="display:flex;gap:4px;flex-wrap:wrap;">
        ${
          isAdmin
            ? `<button class="btn btn-ghost btn-sm" onclick="openTeacherModal('${t.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTeacher('${t.id}')">Del</button>`
            : '<span style="font-size:12px;color:var(--text3)">View only</span>'
        }
      </div></td>
    </tr>`;
        })
        .join("")
    : `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">👩‍🏫</div><p>No teachers found</p></div></td></tr>`;
  renderPagination(
    "teachers",
    filteredTeachers.length,
    teacherPage,
    teacherPageSize,
  );
}

let editTeacherId = null;
function openTeacherModal(id) {
  editTeacherId = id || null;
  document.getElementById("teacher-modal-title").textContent = id
    ? "Edit Teacher"
    : "Add Teacher";
  if (id) {
    const db = getDB();
    const t = db.teachers.find((x) => x.id === id);
    if (!t) return;
    document.getElementById("t-fname").value = t.firstName || "";
    document.getElementById("t-lname").value = t.lastName || "";
    document.getElementById("t-subject").value = t.subject || "";
    document.getElementById("t-qual").value = t.qualification || "";
    document.getElementById("t-phone").value = t.phone || "";
    document.getElementById("t-dob").value = t.dob || "";
    document.getElementById("t-salary").value = t.salary || "";
    document.getElementById("t-join").value = t.joinDate || "";
    document.getElementById("t-status").value = t.status || "Active";
    document.getElementById("t-classes").value = t.classes || "";
    document.getElementById("t-address").value = t.address || "";
  } else {
    [
      "t-fname",
      "t-lname",
      "t-subject",
      "t-qual",
      "t-phone",
      "t-dob",
      "t-salary",
      "t-join",
      "t-classes",
      "t-address",
    ].forEach((id) => {
      document.getElementById(id).value = "";
    });
    document.getElementById("t-status").value = "Active";
  }
  ["t-fname-err", "t-lname-err", "t-subject-err"].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
  openModal("teacher-modal");
}

function saveTeacher() {
  const fname = document.getElementById("t-fname").value.trim();
  const lname = document.getElementById("t-lname").value.trim();
  const subject = document.getElementById("t-subject").value.trim();
  const dob = document.getElementById("t-dob").value;
  let valid = true;
  if (!fname) {
    document.getElementById("t-fname-err").textContent = "Required";
    valid = false;
  }
  if (!lname) {
    document.getElementById("t-lname-err").textContent = "Required";
    valid = false;
  }
  if (!subject) {
    document.getElementById("t-subject-err").textContent = "Required";
    valid = false;
  }
  if (!valid) return;
  const db = getDB();
  const data = {
    firstName: fname,
    lastName: lname,
    subject,
    dob,
    qualification: document.getElementById("t-qual").value,
    phone: document.getElementById("t-phone").value,
    salary: document.getElementById("t-salary").value,
    joinDate: document.getElementById("t-join").value,
    status: document.getElementById("t-status").value,
    classes: document.getElementById("t-classes").value,
    address: document.getElementById("t-address").value,
  };
  if (editTeacherId) {
    const idx = db.teachers.findIndex((t) => t.id === editTeacherId);
    if (idx > -1) {
      db.teachers[idx] = { ...db.teachers[idx], ...data };
      // Update matching user account if DOB changed
      const t = db.teachers[idx];
      const uIdx = db.users.findIndex(
        (u) => u.teacherId === t.teacherId && u.role === "teacher",
      );
      if (uIdx > -1 && dob) db.users[uIdx].password = dob;
    }
    showToast("Teacher updated", "success");
  } else {
    const tid = `T${String(db.teachers.length + 1).padStart(3, "0")}`;
    const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${tid.toLowerCase()}@educore.school`;
    const newTeacher = { id: uid(), teacherId: tid, email, ...data };
    db.teachers.push(newTeacher);
    // Create login account
    db.users.push({
      id: uid(),
      name: `${fname} ${lname}`,
      email,
      password: dob || tid,
      role: "teacher",
      avatar: `${fname.charAt(0)}${lname.charAt(0)}`,
      subject,
      teacherId: tid,
    });
    logActivity(
      `New teacher ${fname} ${lname} joined (${subject})`,
      "var(--purple)",
    );
    showToast(`Teacher added — Login: ${email} / ${dob || tid}`, "success");
  }
  saveDB(db);
  closeModal("teacher-modal");
  renderTeachers();
}

function deleteTeacher(id) {
  const db = getDB();
  const t = db.teachers.find((x) => x.id === id);
  showConfirm(`Delete teacher "${t.firstName} ${t.lastName}"?`, () => {
    const db2 = getDB();
    db2.teachers = db2.teachers.filter((x) => x.id !== id);
    saveDB(db2);
    renderTeachers();
    showToast("Teacher removed", "info");
  });
}

// ═══════════════════════════════════════════════
//   FEES
// ═══════════════════════════════════════════════
let feePage = 1,
  feePageSize = 10,
  filteredFees = [],
  feeTab = "all";

function renderFees() {
  const db = getDB();
  const paid = db.fees.filter((f) => f.status === "Paid");
  const pending = db.fees.filter((f) => f.status === "Pending");
  const overdue = db.fees.filter((f) => f.status === "Overdue");
  const totalPaid = paid.reduce((a, f) => a + Number(f.amount), 0);
  const totalPending = pending.reduce((a, f) => a + Number(f.amount), 0);
  document.getElementById("fee-summary").innerHTML = `
    <div class="stat-card"><div class="stat-top"><div class="stat-icon" style="background:var(--green-bg)">💰</div><span class="stat-badge badge-green">${paid.length} payments</span></div><div class="stat-val">$${(totalPaid / 1000).toFixed(1)}k</div><div class="stat-label">Total Collected</div></div>
    <div class="stat-card"><div class="stat-top"><div class="stat-icon" style="background:var(--amber-bg)">⏳</div><span class="stat-badge badge-amber">${pending.length} students</span></div><div class="stat-val">$${(totalPending / 1000).toFixed(1)}k</div><div class="stat-label">Pending Amount</div></div>
    <div class="stat-card"><div class="stat-top"><div class="stat-icon" style="background:var(--red-bg)">⚠</div><span class="stat-badge badge-red">${overdue.length} overdue</span></div><div class="stat-val">${overdue.length}</div><div class="stat-label">Overdue Fees</div></div>
  `;
  applyFeeFilters();
}

function setFeeTab(tab, el) {
  feeTab = tab;
  feePage = 1;
  document
    .querySelectorAll("#fee-tabs .tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  applyFeeFilters();
}

function filterFees() {
  feePage = 1;
  applyFeeFilters();
}

function applyFeeFilters() {
  const db = getDB();
  const search = document.getElementById("fee-search").value.toLowerCase();
  const month = document.getElementById("fee-month-filter").value;
  filteredFees = db.fees.filter((f) => {
    const s = db.students.find((x) => x.id === f.studentId);
    const name = s ? `${s.firstName} ${s.lastName}`.toLowerCase() : "";
    return (
      (!search || name.includes(search)) &&
      (!month || f.month === month) &&
      (feeTab === "all" ||
        (feeTab === "paid" && f.status === "Paid") ||
        (feeTab === "pending" && f.status !== "Paid"))
    );
  });
  renderFeesTable(db);
}

function renderFeesTable(db) {
  db = db || getDB();
  const start = (feePage - 1) * feePageSize;
  const page = filteredFees.slice(start, start + feePageSize);
  const isAdmin = currentUser.role === "admin";
  document.getElementById("fees-tbody").innerHTML = page.length
    ? page
        .map((f) => {
          const s = db.students.find((x) => x.id === f.studentId);
          const name = s ? `${s.firstName} ${s.lastName}` : "Unknown";
          const statusClass =
            f.status === "Paid"
              ? "badge-green"
              : f.status === "Overdue"
                ? "badge-red"
                : "badge-amber";
          return `<tr>
      <td><div class="cell-name">${name}</div></td>
      <td class="hide-sm">${s ? s.class : "—"}</td>
      <td style="font-weight:600">$${Number(f.amount).toLocaleString()}</td>
      <td class="hide-sm">${f.month}</td>
      <td class="hide-sm">${f.dueDate || "—"}</td>
      <td><span class="badge ${statusClass}">${f.status}</span></td>
      <td class="hide-sm"><button class="btn btn-ghost btn-sm" onclick="showReceipt('${f.id}')">🧾 Receipt</button></td>
      <td><div style="display:flex;gap:4px;flex-wrap:wrap;">
        ${isAdmin && f.status !== "Paid" ? `<button class="btn btn-success btn-sm" onclick="markFeePaid('${f.id}')">✓ Paid</button>` : ""}
        ${isAdmin ? `<button class="btn btn-danger btn-sm" onclick="deleteFee('${f.id}')">Del</button>` : ""}
      </div></td>
    </tr>`;
        })
        .join("")
    : `<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">💰</div><p>No fee records found</p></div></td></tr>`;
  renderPagination("fees", filteredFees.length, feePage, feePageSize);
}

let editFeeId = null;
function openFeeModal(id) {
  editFeeId = id || null;
  document.getElementById("fee-modal-title").textContent = id
    ? "Edit Payment"
    : "Record Payment";
  const today = new Date().toISOString().split("T")[0];
  if (!id) {
    document.getElementById("f-amount").value = "";
    document.getElementById("f-notes").value = "";
    document.getElementById("f-status").value = "Paid";
    document.getElementById("f-paid-date").value = today;
    document.getElementById("f-due").value = today;
    document.getElementById("f-month").value = MONTHS[new Date().getMonth()];
    document.getElementById("f-student").value = "";
  }
  ["f-student-err", "f-amount-err"].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
  openModal("fee-modal");
}

function saveFee() {
  const studentId = document.getElementById("f-student").value;
  const amount = document.getElementById("f-amount").value;
  let valid = true;
  if (!studentId) {
    document.getElementById("f-student-err").textContent = "Select a student";
    valid = false;
  }
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    document.getElementById("f-amount-err").textContent = "Enter valid amount";
    valid = false;
  }
  if (!valid) return;
  const db = getDB();
  const s = db.students.find((x) => x.id === studentId);
  const feeData = {
    studentId,
    amount: Number(amount),
    month: document.getElementById("f-month").value,
    dueDate: document.getElementById("f-due").value,
    paidDate: document.getElementById("f-paid-date").value,
    status: document.getElementById("f-status").value,
    notes: document.getElementById("f-notes").value,
    receiptNo: `RCP${rndInt(10000, 99999)}`,
  };
  if (editFeeId) {
    const idx = db.fees.findIndex((f) => f.id === editFeeId);
    if (idx > -1) db.fees[idx] = { ...db.fees[idx], ...feeData };
    showToast("Fee record updated", "success");
  } else {
    db.fees.push({ id: uid(), year: new Date().getFullYear(), ...feeData });
    if (s && feeData.status === "Paid")
      logActivity(
        `Fee $${amount} received from ${s.firstName} ${s.lastName}`,
        "var(--accent)",
      );
    showToast("Payment recorded", "success");
  }
  saveDB(db);
  closeModal("fee-modal");
  renderFees();
}

function markFeePaid(id) {
  const db = getDB();
  const idx = db.fees.findIndex((f) => f.id === id);
  if (idx > -1) {
    db.fees[idx].status = "Paid";
    db.fees[idx].paidDate = new Date().toISOString().split("T")[0];
  }
  saveDB(db);
  renderFees();
  showToast("Payment marked as paid", "success");
}

function deleteFee(id) {
  showConfirm("Delete this fee record?", () => {
    const db = getDB();
    db.fees = db.fees.filter((f) => f.id !== id);
    saveDB(db);
    renderFees();
    showToast("Fee record deleted", "info");
  });
}

function showReceipt(id) {
  const db = getDB();
  const f = db.fees.find((x) => x.id === id);
  const s = db.students.find((x) => x.id === f.studentId);
  const name = s ? `${s.firstName} ${s.lastName}` : "Unknown";
  document.getElementById("receipt-content").innerHTML = `
    <div style="border:1px solid var(--border2);border-radius:12px;padding:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border);">
        <div><div style="font-size:20px;font-weight:700">EduCore</div><div style="font-size:12px;color:var(--text2)">School Management System</div></div>
        <div style="text-align:right"><div style="font-size:12px;color:var(--text3)">RECEIPT</div><div style="font-size:18px;font-weight:700;font-family:var(--mono)">${f.receiptNo}</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">Student</div><div style="font-weight:600;margin-top:4px">${name}</div></div>
        <div><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">Class</div><div style="font-weight:600;margin-top:4px">${s ? s.class : "—"}</div></div>
        <div><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">Month</div><div style="font-weight:600;margin-top:4px">${f.month} ${f.year}</div></div>
        <div><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">Payment Date</div><div style="font-weight:600;margin-top:4px">${f.paidDate || "Pending"}</div></div>
        <div><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">Due Date</div><div style="font-weight:600;margin-top:4px">${f.dueDate || "—"}</div></div>
        <div><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">Status</div><span class="badge ${f.status === "Paid" ? "badge-green" : f.status === "Overdue" ? "badge-red" : "badge-amber"}" style="margin-top:4px">${f.status}</span></div>
      </div>
      <div style="background:var(--bg3);border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:14px;color:var(--text2)">Total Amount</span>
        <span style="font-size:24px;font-weight:700;color:var(--green)">$${Number(f.amount).toLocaleString()}</span>
      </div>
      ${f.notes ? `<div style="margin-top:12px;font-size:12px;color:var(--text2)">Note: ${f.notes}</div>` : ""}
    </div>`;
  openModal("receipt-modal");
}

function printReceipt() {
  window.print();
}

// ═══════════════════════════════════════════════
//   ATTENDANCE
// ═══════════════════════════════════════════════
let currentAttStatus = {};

function resetAttTabs() {
  // Reset to "Mark Attendance" tab whenever attendance page is opened
  document
    .querySelectorAll("#att-tabs .tab")
    .forEach((t, i) => t.classList.toggle("active", i === 0));
  document.getElementById("att-mark-section").style.display = "block";
  document.getElementById("att-records-section").style.display = "none";
  document.getElementById("att-report-section").style.display = "none";
  document.getElementById("btn-save-att").style.display = "";
}

function setAttTab(tab, el) {
  document
    .querySelectorAll("#att-tabs .tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("att-mark-section").style.display =
    tab === "mark" ? "block" : "none";
  document.getElementById("att-records-section").style.display =
    tab === "records" ? "block" : "none";
  document.getElementById("att-report-section").style.display =
    tab === "report" ? "block" : "none";
  document.getElementById("btn-save-att").style.display =
    tab === "mark" ? "" : "none";
  if (tab === "records") renderAttRecords();
  if (tab === "report") renderAttReport();
}

function loadAttendanceForMark() {
  const cls = document.getElementById("att-class").value;
  const date = document.getElementById("att-date").value;
  const summaryBar = document.getElementById("att-summary-bar");

  if (!cls || !date) {
    document.getElementById("att-cards").innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:var(--text3);">
        <div style="font-size:40px;margin-bottom:10px">📋</div>
        <p style="font-size:13px;">Select a class and date above to begin marking attendance</p>
      </div>`;
    if (summaryBar) summaryBar.style.display = "none";
    return;
  }

  const db = getDB();
  const students = db.students.filter(
    (s) => s.class === cls && s.status === "Active",
  );

  if (!students.length) {
    document.getElementById("att-cards").innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:var(--text3);">
        <div style="font-size:40px;margin-bottom:10px">👥</div>
        <p style="font-size:13px;">No active students found in ${cls}</p>
      </div>`;
    if (summaryBar) summaryBar.style.display = "none";
    return;
  }

  currentAttStatus = {};
  students.forEach((s) => {
    const existing = db.attendance.find(
      (a) => a.studentId === s.id && a.date === date,
    );
    currentAttStatus[s.id] = existing ? existing.status : "Present";
  });

  if (summaryBar) summaryBar.style.display = "flex";
  renderAttCards(students);
  updateAttCounter();
}

function updateAttCounter() {
  const vals = Object.values(currentAttStatus);
  const p = vals.filter((s) => s === "Present").length;
  const a = vals.filter((s) => s === "Absent").length;
  const l = vals.filter((s) => s === "Late").length;
  const cp = document.getElementById("att-count-present");
  const ca = document.getElementById("att-count-absent");
  const cl = document.getElementById("att-count-late");
  if (cp) cp.textContent = `✓ ${p} Present`;
  if (ca) ca.textContent = `✗ ${a} Absent`;
  if (cl) cl.textContent = `⏰ ${l} Late`;
}

function renderAttCards(students) {
  document.getElementById("att-cards").innerHTML = students
    .map((s) => {
      const st = currentAttStatus[s.id] || "Present";
      const isPresent = st === "Present";
      const isAbsent = st === "Absent";
      const isLate = st === "Late";
      const avatarStyle = isPresent
        ? "background:var(--green-bg);color:var(--green)"
        : isAbsent
          ? "background:var(--red-bg);color:var(--red)"
          : "background:var(--amber-bg);color:var(--amber)";
      const statusColor = isPresent
        ? "var(--green)"
        : isAbsent
          ? "var(--red)"
          : "var(--amber)";
      const icon = isPresent ? "✓" : isAbsent ? "✗" : "⏰";
      return `<div class="att-card ${st.toLowerCase()}" id="att-${s.id}" onclick="cycleAttStatus('${s.id}')" title="Click to change status">
      <div class="avatar" style="width:30px;height:30px;font-size:11px;flex-shrink:0;${avatarStyle}">${s.firstName.charAt(0)}${s.lastName.charAt(0)}</div>
      <div style="min-width:0;">
        <div class="att-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${s.firstName} ${s.lastName}</div>
        <div class="att-status" style="color:${statusColor};font-weight:600;">${icon} ${st}</div>
      </div>
    </div>`;
    })
    .join("");
}

function cycleAttStatus(id) {
  const cycle = { Present: "Absent", Absent: "Late", Late: "Present" };
  currentAttStatus[id] = cycle[currentAttStatus[id]] || "Present";
  // Update just the changed card for performance
  const cls = document.getElementById("att-class").value;
  const db = getDB();
  const students = db.students.filter(
    (s) => s.class === cls && s.status === "Active",
  );
  renderAttCards(students);
  updateAttCounter();
}

function markAllAttendance(status) {
  if (!Object.keys(currentAttStatus).length) {
    showToast("Select a class first", "error");
    return;
  }
  Object.keys(currentAttStatus).forEach((id) => {
    currentAttStatus[id] = status;
  });
  const cls = document.getElementById("att-class").value;
  const db = getDB();
  const students = db.students.filter(
    (s) => s.class === cls && s.status === "Active",
  );
  renderAttCards(students);
  updateAttCounter();
}

function saveAttendance() {
  const cls = document.getElementById("att-class").value;
  const date = document.getElementById("att-date").value;
  if (!cls) {
    showToast("Please select a class first", "error");
    return;
  }
  if (!date) {
    showToast("Please select a date first", "error");
    return;
  }
  if (!Object.keys(currentAttStatus).length) {
    showToast("No students to save attendance for", "error");
    return;
  }
  const db = getDB();
  Object.entries(currentAttStatus).forEach(([studentId, status]) => {
    const idx = db.attendance.findIndex(
      (a) => a.studentId === studentId && a.date === date,
    );
    if (idx > -1) db.attendance[idx].status = status;
    else db.attendance.push({ id: uid(), studentId, date, status, class: cls });
  });
  const total = Object.keys(currentAttStatus).length;
  const present = Object.values(currentAttStatus).filter(
    (s) => s === "Present",
  ).length;
  const absent = Object.values(currentAttStatus).filter(
    (s) => s === "Absent",
  ).length;
  logActivity(
    `Attendance for ${cls} on ${date}: ${present}/${total} present`,
    "var(--teal)",
  );
  saveDB(db);
  showToast(
    `✓ Saved — ${present} present, ${absent} absent, ${total - present - absent} late`,
    "success",
  );
}

let attRecPage = 1,
  attRecPageSize = 15,
  filteredAttRec = [];
function renderAttRecords() {
  const db = getDB();
  filteredAttRec = db.attendance;
  filterAttRecords();
}

function filterAttRecords() {
  const db = getDB();
  const search = document.getElementById("att-rec-search").value.toLowerCase();
  const date = document.getElementById("att-rec-date").value;
  filteredAttRec = db.attendance
    .filter((a) => {
      const s = db.students.find((x) => x.id === a.studentId);
      const name = s ? `${s.firstName} ${s.lastName}`.toLowerCase() : "";
      return (!search || name.includes(search)) && (!date || a.date === date);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
  const db2 = db;
  const start = (attRecPage - 1) * attRecPageSize;
  const page = filteredAttRec.slice(start, start + attRecPageSize);
  document.getElementById("att-records-tbody").innerHTML =
    page
      .map((a) => {
        const s = db2.students.find((x) => x.id === a.studentId);
        const name = s ? `${s.firstName} ${s.lastName}` : "Unknown";
        const sc =
          a.status === "Present"
            ? "badge-green"
            : a.status === "Absent"
              ? "badge-red"
              : "badge-amber";
        return `<tr><td>${name}</td><td>${s ? s.class : "—"}</td><td>${a.date}</td><td><span class="badge ${sc}">${a.status}</span></td></tr>`;
      })
      .join("") ||
    `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">📋</div><p>No records</p></div></td></tr>`;
  renderPagination(
    "att-rec",
    filteredAttRec.length,
    attRecPage,
    attRecPageSize,
  );
}

function renderAttReport() {
  const db = getDB();
  const month = parseInt(document.getElementById("att-rep-month").value);
  const cls = document.getElementById("att-rep-class").value;
  const monthStr = String(month).padStart(2, "0");
  const attData = db.attendance.filter(
    (a) => a.date.includes(`-${monthStr}-`) && (!cls || a.class === cls),
  );
  const students = db.students.filter(
    (s) => (!cls || s.class === cls) && s.status === "Active",
  );
  document.getElementById("att-report-tbody").innerHTML =
    students
      .map((s) => {
        const rec = attData.filter((a) => a.studentId === s.id);
        const present = rec.filter((a) => a.status === "Present").length;
        const absent = rec.filter((a) => a.status === "Absent").length;
        const late = rec.filter((a) => a.status === "Late").length;
        const total = rec.length;
        const pct = total ? Math.round((present / total) * 100) : 0;
        return `<tr>
      <td>${s.firstName} ${s.lastName}</td>
      <td>${s.class}</td>
      <td style="color:var(--green)">${present}</td>
      <td style="color:var(--red)">${absent}</td>
      <td style="color:var(--amber)">${late}</td>
      <td>${total}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="progress-bar" style="width:60px;"><div class="progress-fill" style="width:${pct}%;background:${pct > 80 ? "var(--green)" : pct > 60 ? "var(--amber)" : "var(--red)"}"></div></div>
          <span style="font-size:12px;font-weight:600">${pct}%</span>
        </div>
      </td>
    </tr>`;
      })
      .join("") ||
    `<tr><td colspan="7"><div class="empty-state"><p>No data for this period</p></div></td></tr>`;
}

// ═══════════════════════════════════════════════
//   REPORTS
// ═══════════════════════════════════════════════
function setReportTab(tab, el) {
  document
    .querySelectorAll("#page-reports .tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  renderReport(tab);
}

function renderReport(tab) {
  const db = getDB();
  const el = document.getElementById("report-content");
  if (tab === "summary") {
    const totalStudents = db.students.length;
    const activeStudents = db.students.filter(
      (s) => s.status === "Active",
    ).length;
    const totalFees = db.fees
      .filter((f) => f.status === "Paid")
      .reduce((a, f) => a + Number(f.amount), 0);
    const pendingFees = db.fees
      .filter((f) => f.status !== "Paid")
      .reduce((a, f) => a + Number(f.amount), 0);
    const att = db.attendance;
    const attPct = att.length
      ? Math.round(
          (att.filter((a) => a.status === "Present").length / att.length) * 100,
        )
      : 0;
    el.innerHTML = `
      <div class="stats-grid" style="margin-bottom:24px;">
        <div class="stat-card"><div class="stat-top"><div class="stat-icon" style="background:var(--accent-glow)">🎓</div></div><div class="stat-val">${totalStudents}</div><div class="stat-label">Total Students</div></div>
        <div class="stat-card"><div class="stat-top"><div class="stat-icon" style="background:var(--purple-bg)">👩‍🏫</div></div><div class="stat-val">${db.teachers.length}</div><div class="stat-label">Total Teachers</div></div>
        <div class="stat-card"><div class="stat-top"><div class="stat-icon" style="background:var(--green-bg)">💰</div></div><div class="stat-val">$${(totalFees / 1000).toFixed(1)}k</div><div class="stat-label">Fees Collected</div></div>
        <div class="stat-card"><div class="stat-top"><div class="stat-icon" style="background:var(--teal-bg)">📋</div></div><div class="stat-val">${attPct}%</div><div class="stat-label">Avg Attendance</div></div>
      </div>
      <div class="table-card">
        <div class="table-toolbar"><h3>Class Summary</h3></div>
        <table><thead><tr><th>Class</th><th>Students</th><th>Active</th><th>Fees Collected</th><th>Avg Attendance</th></tr></thead>
        <tbody>${db.classes
          .slice(0, 10)
          .map((cls) => {
            const clsStu = db.students.filter((s) => s.class === cls);
            const clsFees = db.fees.filter((f) => {
              const s = db.students.find((x) => x.id === f.studentId);
              return s && s.class === cls && f.status === "Paid";
            });
            const clsAtt = db.attendance.filter((a) => a.class === cls);
            const ap = clsAtt.length
              ? Math.round(
                  (clsAtt.filter((a) => a.status === "Present").length /
                    clsAtt.length) *
                    100,
                )
              : 0;
            return `<tr><td>${cls}</td><td>${clsStu.length}</td><td>${clsStu.filter((s) => s.status === "Active").length}</td><td>$${clsFees.reduce((a, f) => a + Number(f.amount), 0).toLocaleString()}</td><td>${ap}%</td></tr>`;
          })
          .join("")}</tbody></table>
      </div>`;
  } else if (tab === "students") {
    const classCounts = {};
    db.students.forEach((s) => {
      classCounts[s.class] = (classCounts[s.class] || 0) + 1;
    });
    el.innerHTML = `<div class="table-card">
      <div class="table-toolbar"><h3>Student Report</h3><div class="spacer"></div><span style="font-size:12px;color:var(--text2)">${db.students.length} total</span></div>
      <table><thead><tr><th>Name</th><th>ID</th><th>Class</th><th>Status</th><th>Fees</th></tr></thead>
      <tbody>${db.students
        .slice(0, 20)
        .map((s) => {
          const fees = db.fees
            .filter((f) => f.studentId === s.id && f.status === "Paid")
            .reduce((a, f) => a + Number(f.amount), 0);
          return `<tr><td>${s.firstName} ${s.lastName}</td><td><code style="font-size:11px;font-family:var(--mono)">${s.studentId}</code></td><td>${s.class}</td><td><span class="badge ${s.status === "Active" ? "badge-green" : "badge-red"}">${s.status}</span></td><td>$${fees.toLocaleString()}</td></tr>`;
        })
        .join("")}</tbody></table></div>`;
  } else if (tab === "fees") {
    const byMonth = MONTHS.map((m) => ({
      month: m,
      collected: db.fees
        .filter((f) => f.month === m && f.status === "Paid")
        .reduce((a, f) => a + Number(f.amount), 0),
      pending: db.fees
        .filter((f) => f.month === m && f.status !== "Paid")
        .reduce((a, f) => a + Number(f.amount), 0),
    }));
    el.innerHTML = `<div class="table-card">
      <div class="table-toolbar"><h3>Monthly Fee Report</h3></div>
      <table><thead><tr><th>Month</th><th>Collected</th><th>Pending</th><th>Total</th><th>Collection Rate</th></tr></thead>
      <tbody>${byMonth
        .map((r) => {
          const total = r.collected + r.pending;
          const rate = total ? Math.round((r.collected / total) * 100) : 0;
          return `<tr><td>${r.month}</td><td style="color:var(--green)">$${r.collected.toLocaleString()}</td><td style="color:var(--amber)">$${r.pending.toLocaleString()}</td><td>$${total.toLocaleString()}</td><td><div style="display:flex;align-items:center;gap:8px;"><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${rate}%;background:${rate > 80 ? "var(--green)" : rate > 60 ? "var(--amber)" : "var(--red)"}"></div></div>${rate}%</div></td></tr>`;
        })
        .join("")}</tbody></table></div>`;
  } else if (tab === "attendance") {
    const summary = {};
    db.attendance.forEach((a) => {
      if (!summary[a.studentId])
        summary[a.studentId] = { present: 0, absent: 0, late: 0 };
      summary[a.studentId][a.status.toLowerCase()]++;
    });
    el.innerHTML = `<div class="table-card">
      <div class="table-toolbar"><h3>Attendance Summary</h3></div>
      <table><thead><tr><th>Student</th><th>Class</th><th>Present</th><th>Absent</th><th>Rate</th></tr></thead>
      <tbody>${db.students
        .slice(0, 20)
        .map((s) => {
          const d = summary[s.id] || { present: 0, absent: 0, late: 0 };
          const total = d.present + d.absent + d.late;
          const rate = total ? Math.round((d.present / total) * 100) : 0;
          return `<tr><td>${s.firstName} ${s.lastName}</td><td>${s.class}</td><td style="color:var(--green)">${d.present}</td><td style="color:var(--red)">${d.absent}</td><td><span class="badge ${rate > 80 ? "badge-green" : rate > 60 ? "badge-amber" : "badge-red"}">${rate}%</span></td></tr>`;
        })
        .join("")}</tbody></table></div>`;
  }
}

function exportPDF() {
  showToast("Printing report... Use browser print dialog", "info");
  setTimeout(() => window.print(), 300);
}

// ═══════════════════════════════════════════════
//   NOTIFICATIONS
// ═══════════════════════════════════════════════
function renderNotifications() {
  const db = getDB();
  document.getElementById("notif-list").innerHTML = db.activities
    .map(
      (a) => `
    <div class="activity-item">
      <div class="activity-dot" style="background:${a.color}"></div>
      <div><div class="activity-text">${a.text}</div><div class="activity-time">${a.time}</div></div>
    </div>`,
    )
    .join("");
}

// ═══════════════════════════════════════════════
//   PROFILE
// ═══════════════════════════════════════════════
function renderProfile() {
  const u = currentUser;
  const isAdmin = u.role === "admin";
  let adminPanel = "";
  if (isAdmin) {
    const db = getDB();
    const sampleTeacher = db.users.find((x) => x.role === "teacher");
    const sampleStudent = db.users.find((x) => x.role === "student");
    adminPanel = `
      <div class="detail-card" style="max-width:600px;margin-top:20px;">
        <div style="margin-bottom:16px;">
          <h3 style="font-size:15px;margin-bottom:4px;">🔐 Credential Scheme</h3>
          <p style="font-size:13px;color:var(--text2);">How login accounts are structured for all roles</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="background:var(--bg3);border-radius:10px;padding:14px 16px;border:1px solid var(--border);">
            <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px;">👑 Admin</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div><div style="font-size:11px;color:var(--text3);margin-bottom:2px;">Email</div><code style="font-size:12px;font-family:var(--mono);color:var(--accent)">admin@educore.school</code></div>
              <div><div style="font-size:11px;color:var(--text3);margin-bottom:2px;">Password</div><code style="font-size:12px;font-family:var(--mono);color:var(--green)">admin123</code></div>
            </div>
          </div>
          <div style="background:var(--bg3);border-radius:10px;padding:14px 16px;border:1px solid var(--border);">
            <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px;">📚 Teachers</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
              <div><div style="font-size:11px;color:var(--text3);margin-bottom:2px;">Email format</div><code style="font-size:11px;font-family:var(--mono);color:var(--accent)">firstname.lastnameT001@educore.school</code></div>
              <div><div style="font-size:11px;color:var(--text3);margin-bottom:2px;">Password</div><code style="font-size:12px;font-family:var(--mono);color:var(--green)">Date of Birth (YYYY-MM-DD)</code></div>
            </div>
            ${sampleTeacher ? "<div style='font-size:11px;color:var(--text3);padding-top:8px;border-top:1px solid var(--border);line-height:2;'>Example — <b style='color:var(--text)'>" + sampleTeacher.name + "</b><br>Email: <code style='font-family:var(--mono);color:var(--accent)'>" + sampleTeacher.email + "</code><br>Password: <code style='font-family:var(--mono);color:var(--green)'>" + sampleTeacher.password + "</code></div>" : ""}
          </div>
          <div style="background:var(--bg3);border-radius:10px;padding:14px 16px;border:1px solid var(--border);">
            <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px;">🎓 Students</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
              <div><div style="font-size:11px;color:var(--text3);margin-bottom:2px;">Email format</div><code style="font-size:11px;font-family:var(--mono);color:var(--accent)">firstname.lastnameS0001@school.edu</code></div>
              <div><div style="font-size:11px;color:var(--text3);margin-bottom:2px;">Password</div><code style="font-size:12px;font-family:var(--mono);color:var(--green)">Date of Birth (YYYY-MM-DD)</code></div>
            </div>
            ${sampleStudent ? "<div style='font-size:11px;color:var(--text3);padding-top:8px;border-top:1px solid var(--border);line-height:2;'>Example — <b style='color:var(--text)'>" + sampleStudent.name + "</b><br>Email: <code style='font-family:var(--mono);color:var(--accent)'>" + sampleStudent.email + "</code><br>Password: <code style='font-family:var(--mono);color:var(--green)'>" + sampleStudent.password + "</code></div>" : ""}
          </div>
        </div>
      </div>`;
  }
  document.getElementById("profile-content").innerHTML =
    `
    <div class="detail-card" style="max-width:600px;">
      <div class="detail-header">
        <div class="detail-avatar" style="background:var(--accent-glow);color:var(--accent);font-size:20px">${u.avatar || u.name.charAt(0)}</div>
        <div class="detail-meta">
          <h3>${u.name}</h3>
          <p style="word-break:break-all;font-size:12px;">${u.email}</p>
          <span class="badge badge-blue" style="margin-top:6px">${u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span>
        </div>
      </div>
      <div style="padding-top:16px;border-top:1px solid var(--border)">
        <div class="info-banner">🔒 To reset a password, contact the system administrator.</div>
        <div class="detail-fields">
          <div class="detail-field"><label>Full Name</label><span>${u.name}</span></div>
          <div class="detail-field"><label>Email</label><span style="word-break:break-all;font-size:12px;">${u.email}</span></div>
          <div class="detail-field"><label>Role</label><span>${u.role}</span></div>
          ${u.subject ? `<div class="detail-field"><label>Subject</label><span>${u.subject}</span></div>` : ""}
          ${u.class ? `<div class="detail-field"><label>Class</label><span>${u.class}</span></div>` : ""}
          ${u.studentId ? `<div class="detail-field"><label>Student ID</label><span>${u.studentId}</span></div>` : ""}
          ${u.teacherId ? `<div class="detail-field"><label>Teacher ID</label><span>${u.teacherId}</span></div>` : ""}
        </div>
      </div>
    </div>` + adminPanel;
}

// ═══════════════════════════════════════════════
//   GLOBAL SEARCH
// ═══════════════════════════════════════════════
function globalSearch(val) {
  if (!val) return;
  const lower = val.toLowerCase();
  const db = getDB();
  const students = db.students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(lower),
  );
  if (students.length) {
    showPage("students");
    document.getElementById("student-search").value = val;
    filterStudents();
  }
}

// ═══════════════════════════════════════════════
//   PAGINATION
// ═══════════════════════════════════════════════
function renderPagination(key, total, current, pageSize) {
  const el = document.getElementById(`${key}-pagination`);
  if (!el) return;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);
  let btns = "";
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - current) <= 1)
      btns += `<button class="pg-btn ${i === current ? "active" : ""}" onclick="changePage('${key}',${i})">${i}</button>`;
    else if (Math.abs(i - current) === 2)
      btns += `<span style="color:var(--text3);padding:0 4px">…</span>`;
  }
  el.innerHTML = `<span class="pagination-info">Showing ${start}–${end} of ${total}</span><div class="pagination-btns"><button class="pg-btn" onclick="changePage('${key}',${current - 1})" ${current === 1 ? "disabled" : ""}>‹</button>${btns}<button class="pg-btn" onclick="changePage('${key}',${current + 1})" ${current === totalPages ? "disabled" : ""}>›</button></div>`;
}

function changePage(key, page) {
  if (key === "students") { studentPage = page; applyStudentFilters(); }
  if (key === "teachers") { teacherPage = page; applyTeacherFilters(); }
  if (key === "fees")     { feePage = page;     applyFeeFilters();     }
  if (key === "att-rec")  { attRecPage = page;  filterAttRecords();    }
  if (key === "cm")       { cmState.page = page; renderMaterialsList(); }
}

// ═══════════════════════════════════════════════
//   MODALS
// ═══════════════════════════════════════════════
function openModal(id) {
  document.getElementById(id).classList.add("open");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

function showConfirm(msg, onConfirm) {
  document.getElementById("confirm-msg").textContent = msg;
  document.getElementById("confirm-ok-btn").onclick = () => {
    onConfirm();
    closeModal("confirm-modal");
  };
  openModal("confirm-modal");
}

function showConfirmModal(title, html, okLabel, onConfirm) {
  document.getElementById("confirm-title").textContent = title;
  document.getElementById("confirm-msg").innerHTML = html;
  const btn = document.getElementById("confirm-ok-btn");
  if (onConfirm) {
    btn.textContent = okLabel || "OK";
    btn.onclick = () => {
      onConfirm();
      closeModal("confirm-modal");
    };
    btn.style.display = "";
  } else btn.style.display = "none";
  openModal("confirm-modal");
}

// Close modals on overlay click — delegated so it works for all modals including late-added ones
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("modal-overlay")) closeModal(e.target.id);
});

// ═══════════════════════════════════════════════
//   TOAST
// ═══════════════════════════════════════════════
function showToast(msg, type = "info") {
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type] || "ℹ"}</span><span>${msg}</span>`;
  document.getElementById("toast-container").appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ═══════════════════════════════════════════════
//   HELPERS
// ═══════════════════════════════════════════════
function logActivity(text, color, db) {
  const database = db || getDB();
  const times = ["Just now", "1 min ago", "2 mins ago"];
  database.activities.unshift({ text, color, time: times[0] });
  if (database.activities.length > 20) database.activities.pop();
  if (!db) saveDB(database);
}

function refreshFilters() {
  const fStu = document.getElementById("f-student");
  if (fStu) {
    const db = getDB();
    fStu.innerHTML = '<option value="">Select Student</option>';
    db.students
      .filter((s) => s.status === "Active")
      .forEach((s) => {
        const o = document.createElement("option");
        o.value = s.id;
        o.textContent = `${s.firstName} ${s.lastName} (${s.class})`;
        fStu.appendChild(o);
      });
  }
}

// Redraw charts on resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (currentPage === "dashboard") renderDashboard();
  }, 250);
});

// ═══════════════════════════════════════════════
//   CLASS MANAGEMENT MODULE
// ═══════════════════════════════════════════════

const CM_TYPES = {
  notes:      { label:"Notes",      icon:"📝", color:"#4f7cff", bg:"rgba(79,124,255,0.12)"  },
  slides:     { label:"Slides",     icon:"📊", color:"#a855f7", bg:"rgba(168,85,247,0.12)"  },
  assignment: { label:"Assignment", icon:"📋", color:"#f59e0b", bg:"rgba(245,158,11,0.12)"  },
  video:      { label:"Video",      icon:"🎥", color:"#ef4444", bg:"rgba(239,68,68,0.12)"   },
  reference:  { label:"Reference",  icon:"📚", color:"#14b8a6", bg:"rgba(20,184,166,0.12)"  },
  other:      { label:"Other",      icon:"📎", color:"#8b91a8", bg:"rgba(139,145,168,0.12)" }
};

const CM_DEFAULT_SUBJECTS = [
  "Mathematics","Physics","Chemistry","Biology","English",
  "History","Geography","Computer Science","Art",
  "Physical Education","Economics","Literature"
];

let cmState = { activeSubject:"all", view:"grid", page:1, pageSize:12, filtered:[] };
let editMaterialId = null;
let pendingFileData = null;

/* ── DB helpers ── */
function ensureCMTables() {
  const db = getDB();
  let changed = false;
  if (!db.materials) { db.materials = []; changed = true; }
  if (!db.subjects)  { db.subjects  = [...CM_DEFAULT_SUBJECTS]; changed = true; }
  if (changed) { seedMaterials(db); saveDB(db); }
  return db;
}

function offsetDate(days) {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function cmSampleTags(subject) {
  const map = {
    Mathematics:["algebra","equations","exam-prep"], Physics:["mechanics","laws","kinematics"],
    Chemistry:["periodic-table","organic","bonds"],   Biology:["cells","genetics","ecology"],
    English:["writing","grammar","literature"],        History:["wwii","modern","sources"],
    Geography:["climate","maps","human-geo"],          "Computer Science":["python","algorithms","data"],
    Economics:["macro","gdp","markets"]
  };
  return (map[subject] || ["study","notes"]).join(",");
}

function seedMaterials(db) {
  if (db.materials && db.materials.length) return;
  db.materials = [];
  const teachers = db.teachers || [];
  if (!teachers.length) return;
  const classes = db.classes || ["Class 9-A","Class 10-A","Class 11-A"];
  const samples = [
    { title:"Introduction to Algebra",          subject:"Mathematics",     type:"notes",      desc:"Covers variables, expressions, and basic equations for Class 9 students." },
    { title:"Quadratic Equations — Chapter 5",  subject:"Mathematics",     type:"slides",     desc:"Full slide deck covering the quadratic formula, discriminant, and graphing parabolas." },
    { title:"Algebra Practice Problems",        subject:"Mathematics",     type:"assignment", desc:"50 practice questions. Show all working.", due:offsetDate(7) },
    { title:"Newton's Laws of Motion",          subject:"Physics",         type:"notes",      desc:"Detailed notes on all three Newton's laws with real-world examples." },
    { title:"Khan Academy — Kinematics",        subject:"Physics",         type:"video",      desc:"Video series covering displacement, velocity, and acceleration.", url:"https://www.khanacademy.org/science/physics" },
    { title:"Periodic Table Reference Sheet",   subject:"Chemistry",       type:"reference",  desc:"Full periodic table with atomic masses and electron configurations." },
    { title:"Organic Chemistry — Hydrocarbons", subject:"Chemistry",       type:"notes",      desc:"Notes on alkanes, alkenes, alkynes and nomenclature." },
    { title:"Cell Biology Study Guide",         subject:"Biology",         type:"notes",      desc:"Covers prokaryotic vs eukaryotic cells, organelles, and cell division." },
    { title:"Essay Writing Workshop",           subject:"English",         type:"slides",     desc:"Structuring arguments, thesis statements, and conclusion writing." },
    { title:"World War II — Causes & Effects",  subject:"History",         type:"notes",      desc:"Comprehensive notes on political, economic, and social causes of WWII." },
    { title:"Python Basics — Lists & Loops",    subject:"Computer Science",type:"notes",      desc:"Introduction to Python lists, for-loops, while-loops with code examples." },
    { title:"Midterm Assignment — CS",          subject:"Computer Science",type:"assignment", desc:"Build a simple student grade calculator in Python.", due:offsetDate(14) },
    { title:"Climate Zones Map",                subject:"Geography",       type:"reference",  desc:"Colour-coded world map showing all major climate zones." },
    { title:"Macroeconomics — GDP & Inflation", subject:"Economics",       type:"slides",     desc:"Slides covering national income, GDP calculation, and inflation." }
  ];
  samples.forEach((d, i) => {
    const teacher = teachers[i % teachers.length];
    const cls     = classes[i % Math.min(classes.length, 6)];
    db.materials.push({
      id:uid(), title:d.title, subject:d.subject, class:cls, type:d.type,
      desc:d.desc||"", url:d.url||"", fileName:d.type!=="video"?`${d.title.replace(/\s+/g,"-").toLowerCase()}.pdf`:"",
      fileSize:d.type!=="video"?`${(Math.random()*4+0.5).toFixed(1)} MB`:"",
      fileData:"", tags:cmSampleTags(d.subject), visibility:"all",
      teacherId:teacher.id, teacherName:`${teacher.firstName} ${teacher.lastName}`,
      dueDate:d.due||"", uploadedAt:offsetDate(-(i*3)),
      views:Math.floor(Math.random()*80)+5, downloads:Math.floor(Math.random()*40)+1
    });
  });
}

/* ── Init ── */
function initClassModule() {
  ensureCMTables();
  updateRoleAccessCM();
}

function updateRoleAccessCM() {
  const uploadBtn  = document.getElementById("btn-upload-material");
  const subjectBtn = document.getElementById("btn-manage-subjects");
  if (!uploadBtn || !subjectBtn) return;
  const role = currentUser ? currentUser.role : "student";
  uploadBtn.style.display  = role === "student" ? "none" : "";
  subjectBtn.style.display = role === "admin"   ? ""     : "none";
}

function populateCMFilters() {
  const db = ensureCMTables();
  // cm-class-filter
  const ccf = document.getElementById("cm-class-filter");
  if (ccf) {
    while (ccf.options.length > 1) ccf.remove(1);
    (db.classes||[]).forEach(c => { const o=document.createElement("option");o.value=c;o.textContent=c;ccf.appendChild(o); });
  }
  // um-class
  const umc = document.getElementById("um-class");
  if (umc) {
    while (umc.options.length > 1) umc.remove(1);
    (db.classes||[]).forEach(c => { const o=document.createElement("option");o.value=c;o.textContent=c;umc.appendChild(o); });
  }
  populateSubjectSelect();
}

function populateSubjectSelect() {
  const db  = ensureCMTables();
  const sel = document.getElementById("um-subject");
  if (!sel) return;
  while (sel.options.length > 1) sel.remove(1);
  (db.subjects || CM_DEFAULT_SUBJECTS).forEach(s => {
    const o=document.createElement("option");o.value=s;o.textContent=s;sel.appendChild(o);
  });
}

/* ── Render page ── */
function renderClassesPage() {
  const db = ensureCMTables();
  updateRoleAccessCM();
  renderCMStats(db);
  renderSubjectTabs(db);
  filterMaterials();
  const el = document.getElementById("classes-subtitle");
  if (!el) return;
  const role = currentUser ? currentUser.role : "";
  if (role === "teacher") {
    const mine = (db.materials||[]).filter(m => m.teacherId === currentUser.id);
    el.textContent = `You have uploaded ${mine.length} material${mine.length!==1?"s":""}`;
  } else if (role === "student") {
    el.textContent = "Browse notes, slides, and resources shared by your teachers";
  } else {
    el.textContent = `${(db.materials||[]).length} materials across ${(db.subjects||[]).length} subjects`;
  }
}

function renderCMStats(db) {
  const el = document.getElementById("cm-stats-row");
  if (!el) return;
  const visible  = getVisibleMaterials(db);
  const subjects = [...new Set(visible.map(m => m.subject))].length;
  const notes    = visible.filter(m => m.type === "notes").length;
  const today    = new Date().toISOString().split("T")[0];
  const due      = visible.filter(m => m.type === "assignment" && m.dueDate && m.dueDate >= today).length;
  el.innerHTML = `
    <div class="cm-stat"><div class="cm-stat-icon" style="background:var(--accent-glow)">📂</div>
      <div><div class="cm-stat-val">${visible.length}</div><div class="cm-stat-label">Total Materials</div></div></div>
    <div class="cm-stat"><div class="cm-stat-icon" style="background:var(--purple-bg)">📚</div>
      <div><div class="cm-stat-val">${subjects}</div><div class="cm-stat-label">Subjects</div></div></div>
    <div class="cm-stat"><div class="cm-stat-icon" style="background:var(--green-bg)">📝</div>
      <div><div class="cm-stat-val">${notes}</div><div class="cm-stat-label">Notes</div></div></div>
    <div class="cm-stat"><div class="cm-stat-icon" style="background:var(--amber-bg)">⏰</div>
      <div><div class="cm-stat-val">${due}</div><div class="cm-stat-label">Pending Assignments</div></div></div>`;
}

function renderSubjectTabs(db) {
  const el = document.getElementById("cm-subject-tabs");
  if (!el) return;
  const visible  = getVisibleMaterials(db);
  const subjects = [...new Set(visible.map(m => m.subject))].sort();
  let html = `<div class="cm-subject-tab ${cmState.activeSubject==="all"?"active":""}" data-subject="all">All <span class="cm-tab-count">${visible.length}</span></div>`;
  subjects.forEach(s => {
    const count  = visible.filter(m => m.subject === s).length;
    const active = cmState.activeSubject === s ? "active" : "";
    html += `<div class="cm-subject-tab ${active}" data-subject="${cmEsc(s)}">${cmEsc(s)} <span class="cm-tab-count">${count}</span></div>`;
  });
  el.innerHTML = html;
  // Attach click handlers via JS — avoids any quoting issues with subject names
  el.querySelectorAll(".cm-subject-tab").forEach(tab => {
    tab.addEventListener("click", () => setActiveSubject(tab.dataset.subject));
  });
}

function setActiveSubject(sub) {
  cmState.activeSubject = sub;
  cmState.page = 1;
  document.querySelectorAll(".cm-subject-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.subject === sub);
  });
  filterMaterials();
}

function getVisibleMaterials(db) {
  const mats = db.materials || [];
  if (!currentUser) return mats;
  if (currentUser.role === "admin" || currentUser.role === "teacher") return mats;
  // Students see visibility=all OR their own class
  return mats.filter(m => m.visibility==="all" || m.class===currentUser.class);
}

function filterMaterials() {
  const db     = ensureCMTables();
  const search = (document.getElementById("cm-search-input")?.value||"").toLowerCase();
  const type   = document.getElementById("cm-type-filter")?.value||"";
  const cls    = document.getElementById("cm-class-filter")?.value||"";
  let list     = getVisibleMaterials(db);
  if (cmState.activeSubject !== "all") list = list.filter(m => m.subject===cmState.activeSubject);
  if (type)   list = list.filter(m => m.type===type);
  if (cls)    list = list.filter(m => m.class===cls);
  if (search) list = list.filter(m =>
    m.title.toLowerCase().includes(search) || m.subject.toLowerCase().includes(search) ||
    m.desc.toLowerCase().includes(search)  || (m.tags||"").toLowerCase().includes(search));
  list = list.slice().sort((a,b) => (b.uploadedAt||"").localeCompare(a.uploadedAt||""));
  cmState.filtered = list;
  cmState.page = Math.min(cmState.page, Math.ceil(list.length/cmState.pageSize)||1);
  renderMaterialsList();
}

function renderMaterialsList() {
  const container = document.getElementById("cm-materials-container");
  if (!container) return;
  const { filtered, page, pageSize, view } = cmState;
  const start = (page-1)*pageSize;
  const items = filtered.slice(start, start+pageSize);
  if (!filtered.length) {
    container.innerHTML = `<div class="cm-empty"><div class="cm-empty-icon">📂</div><h3>No materials found</h3><p>Try adjusting your filters${currentUser?.role!=="student"?", or upload the first material!":"."}</p></div>`;
    renderPagination("cm", 0, page, pageSize);
    return;
  }
  container.innerHTML = view==="grid"
    ? `<div class="cm-grid">${items.map(renderMaterialCard).join("")}</div>`
    : `<div class="cm-list">${items.map(renderMaterialListItem).join("")}</div>`;
  renderPagination("cm", filtered.length, page, pageSize);
}

function getCMDueBadge(m) {
  if (m.type!=="assignment"||!m.dueDate) return "";
  const today   = new Date().toISOString().split("T")[0];
  const overdue = m.dueDate < today;
  const days    = Math.ceil((new Date(m.dueDate)-new Date())/86400000);
  const label   = overdue?"Overdue":days===0?"Due Today":`Due in ${days}d`;
  return `<span class="cm-due-badge ${overdue?"overdue":""}">⏰ ${label}</span>`;
}

function renderMaterialCard(m) {
  const t       = CM_TYPES[m.type]||CM_TYPES.other;
  const tags    = (m.tags||"").split(",").map(s=>s.trim()).filter(Boolean).slice(0,3);
  const canEdit = currentUser?.role==="admin"||(currentUser?.role==="teacher"&&m.teacherId===currentUser?.id);
  const dueB    = getCMDueBadge(m);
  return `<div class="cm-card" onclick="viewMaterial('${m.id}')">
    <div class="cm-card-strip" style="background:${t.color}"></div>
    <div class="cm-card-body">
      <div class="cm-card-top">
        <div class="cm-type-icon" style="background:${t.bg};color:${t.color}">${t.icon}</div>
        <div>
          <div class="cm-card-title">${cmEsc(m.title)}</div>
          <div style="margin-top:4px;">
            <span class="badge badge-blue" style="font-size:10px;">${cmEsc(m.subject)}</span>
            &nbsp;<span style="font-size:10px;color:var(--text3);">${cmEsc(m.class)}</span>
          </div>
        </div>
      </div>
      ${m.desc?`<div class="cm-card-desc">${cmEsc(m.desc)}</div>`:""}
      <div class="cm-card-meta">
        <div class="cm-card-tags">${tags.map(tag=>`<span class="cm-tag">${cmEsc(tag)}</span>`).join("")}</div>
        ${dueB}
      </div>
    </div>
    <div class="cm-card-footer">
      <div class="cm-uploader">
        <div class="cm-uploader-avatar">${(m.teacherName||"?").charAt(0)}</div>
        <span>${cmEsc((m.teacherName||"Unknown").split(" ")[0])}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="cm-date">${cmFmtDate(m.uploadedAt)}</span>
        <div onclick="event.stopPropagation()" style="display:flex;gap:4px;">
          ${canEdit?`<button class="btn btn-ghost btn-sm" onclick="openUploadModal('${m.id}')">✏</button>
          <button class="btn btn-danger btn-sm" onclick="deleteMaterial('${m.id}')">🗑</button>`:""}
        </div>
      </div>
    </div>
  </div>`;
}

function renderMaterialListItem(m) {
  const t       = CM_TYPES[m.type]||CM_TYPES.other;
  const canEdit = currentUser?.role==="admin"||(currentUser?.role==="teacher"&&m.teacherId===currentUser?.id);
  const dueB    = getCMDueBadge(m);
  return `<div class="cm-list-item" onclick="viewMaterial('${m.id}')">
    <div class="cm-list-icon" style="background:${t.bg};color:${t.color}">${t.icon}</div>
    <div class="cm-list-info">
      <div class="cm-list-title">${cmEsc(m.title)}</div>
      <div class="cm-list-sub">${cmEsc(m.subject)} · ${cmEsc(m.class)} · ${cmEsc(m.teacherName||"Unknown")} · ${cmFmtDate(m.uploadedAt)}</div>
    </div>
    <div class="cm-list-right">
      ${dueB}
      <span class="badge badge-blue" style="font-size:10px;">${t.label}</span>
      ${canEdit?`<div onclick="event.stopPropagation()" style="display:flex;gap:4px;">
        <button class="btn btn-ghost btn-sm" onclick="openUploadModal('${m.id}')">✏</button>
        <button class="btn btn-danger btn-sm" onclick="deleteMaterial('${m.id}')">🗑</button>
      </div>`:""}
    </div>
  </div>`;
}

function setCMView(v, btn) {
  cmState.view = v;
  document.querySelectorAll(".cm-view-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderMaterialsList();
}

/* ── Upload / Edit modal ── */
function openUploadModal(id) {
  if (!currentUser || currentUser.role === "student") { showToast("Students cannot upload materials","error"); return; }
  editMaterialId = id || null;
  pendingFileData = null;
  document.getElementById("upload-modal-title").textContent = id ? "Edit Material" : "Upload Material";
  document.getElementById("upload-btn-text").textContent    = id ? "Save Changes"  : "Upload Material";
  const hint = document.getElementById("upload-teacher-hint");
  const name = document.getElementById("upload-teacher-name");
  if (currentUser.role === "teacher") { hint.style.display=""; name.textContent=currentUser.name; }
  else hint.style.display = "none";
  resetDropzone();
  ["um-title-err","um-subject-err","um-class-err","um-url-err"].forEach(i => { const e=document.getElementById(i);if(e)e.textContent=""; });
  if (id) {
    const db = ensureCMTables();
    const m  = db.materials.find(x => x.id===id);
    if (!m) return;
    document.getElementById("um-title").value      = m.title||"";
    document.getElementById("um-subject").value    = m.subject||"";
    document.getElementById("um-class").value      = m.class||"";
    document.getElementById("um-type").value       = m.type||"notes";
    document.getElementById("um-visibility").value = m.visibility||"all";
    document.getElementById("um-desc").value       = m.desc||"";
    document.getElementById("um-due").value        = m.dueDate||"";
    document.getElementById("um-tags").value       = m.tags||"";
    document.getElementById("um-url").value        = m.url||"";
    if (m.fileName) document.getElementById("cm-dropzone-sub").textContent = `Current: ${m.fileName}`;
    toggleUrlField(m.type);
  } else {
    ["um-title","um-desc","um-due","um-tags","um-url"].forEach(i => { const e=document.getElementById(i);if(e)e.value=""; });
    document.getElementById("um-type").value       = "notes";
    document.getElementById("um-visibility").value = "all";
    document.getElementById("um-subject").value    = "";
    document.getElementById("um-class").value      = "";
    toggleUrlField("notes");
  }
  document.getElementById("um-type").onchange = function() { toggleUrlField(this.value); };
  openModal("upload-modal");
}

function toggleUrlField(type) {
  const fg = document.getElementById("um-file-group");
  const ug = document.getElementById("um-url-group");
  if (!fg||!ug) return;
  fg.style.display = type==="video" ? "none" : "";
  ug.style.display = type==="video" ? ""     : "none";
}

function saveMaterial() {
  ["um-title-err","um-subject-err","um-class-err","um-url-err"].forEach(i => { const e=document.getElementById(i);if(e)e.textContent=""; });
  const title   = document.getElementById("um-title").value.trim();
  const subject = document.getElementById("um-subject").value;
  const cls     = document.getElementById("um-class").value;
  const type    = document.getElementById("um-type").value;
  const url     = document.getElementById("um-url").value.trim();
  let valid = true;
  if (!title)   { document.getElementById("um-title-err").textContent   = "Required"; valid=false; }
  if (!subject) { document.getElementById("um-subject-err").textContent = "Required"; valid=false; }
  if (!cls)     { document.getElementById("um-class-err").textContent   = "Required"; valid=false; }
  if (type==="video"&&!url) { document.getElementById("um-url-err").textContent = "URL required"; valid=false; }
  if (!valid) return;
  const db   = ensureCMTables();
  const data = {
    title, subject, class:cls, type,
    visibility: document.getElementById("um-visibility").value,
    desc:       document.getElementById("um-desc").value.trim(),
    dueDate:    document.getElementById("um-due").value,
    tags:       document.getElementById("um-tags").value.trim(),
    url:        type==="video" ? url : ""
  };
  if (pendingFileData) {
    data.fileName = pendingFileData.name;
    data.fileSize = cmFmtBytes(pendingFileData.size);
    data.fileData = pendingFileData.dataUrl;
  }
  if (editMaterialId) {
    const idx = db.materials.findIndex(m => m.id===editMaterialId);
    if (idx>-1) db.materials[idx] = { ...db.materials[idx], ...data };
    logActivity(`Material "${title}" updated`, "var(--accent)");
    showToast("Material updated successfully","success");
  } else {
    db.materials.push({
      id:uid(), teacherId:currentUser.id||currentUser.teacherId||"admin",
      teacherName:currentUser.name, uploadedAt:new Date().toISOString().split("T")[0],
      views:0, downloads:0, fileName:"", fileSize:"", fileData:"", ...data
    });
    logActivity(`New material "${title}" uploaded by ${currentUser.name}`, "var(--green)");
    showToast("Material uploaded successfully! 🎉","success");
  }
  saveDB(db);
  closeModal("upload-modal");
  renderClassesPage();
  pendingFileData = null;
}

function deleteMaterial(id) {
  const db = ensureCMTables();
  const m  = db.materials.find(x => x.id===id);
  if (!m) return;
  showConfirm(`Delete "${m.title}"? This cannot be undone.`, () => {
    const db2 = ensureCMTables();
    db2.materials = db2.materials.filter(x => x.id!==id);
    saveDB(db2); renderClassesPage();
    showToast("Material deleted","info");
  });
}

/* ── Detail modal ── */
function viewMaterial(id) {
  const db  = ensureCMTables();
  const idx = db.materials.findIndex(x => x.id===id);
  if (idx===-1) return;
  db.materials[idx].views = (db.materials[idx].views||0)+1;
  saveDB(db);
  const m       = db.materials[idx];
  const t       = CM_TYPES[m.type]||CM_TYPES.other;
  const tags    = (m.tags||"").split(",").map(s=>s.trim()).filter(Boolean);
  const canEdit = currentUser?.role==="admin"||(currentUser?.role==="teacher"&&m.teacherId===currentUser?.id);
  const hasFile = !!m.fileData;
  const isVideo = m.type==="video"&&m.url;
  const dueB    = getCMDueBadge(m);
  document.getElementById("md-title").textContent = m.title;
  document.getElementById("md-body").innerHTML = `
    <div class="md-hero">
      <div class="md-hero-icon" style="background:${t.bg};color:${t.color}">${t.icon}</div>
      <div>
        <div class="md-hero-title">${cmEsc(m.title)}</div>
        <div class="md-hero-sub">
          <span class="badge badge-blue" style="margin-right:6px;">${cmEsc(m.subject)}</span>
          <span style="font-size:11px;color:var(--text3);">${t.label} · ${cmEsc(m.class)}</span>
        </div>
        ${dueB?`<div style="margin-top:8px;">${dueB}</div>`:""}
      </div>
    </div>
    <div class="md-fields">
      <div class="md-field"><label>Uploaded By</label><span>${cmEsc(m.teacherName||"Unknown")}</span></div>
      <div class="md-field"><label>Date</label><span>${cmFmtDate(m.uploadedAt)}</span></div>
      <div class="md-field"><label>Class</label><span>${cmEsc(m.class)}</span></div>
      <div class="md-field"><label>Visibility</label><span>${m.visibility==="all"?"🌍 All Students":"🏫 This Class Only"}</span></div>
      ${m.fileName?`<div class="md-field"><label>File</label><span>📄 ${cmEsc(m.fileName)}</span></div>`:""}
      ${m.fileSize?`<div class="md-field"><label>Size</label><span>${cmEsc(m.fileSize)}</span></div>`:""}
      ${m.dueDate ?`<div class="md-field"><label>Due Date</label><span>${m.dueDate}</span></div>`:""}
    </div>
    ${m.desc?`<div class="md-desc-block">${cmEsc(m.desc)}</div>`:""}
    ${tags.length?`<div class="md-tags-row">${tags.map(tag=>`<span class="cm-tag">${cmEsc(tag)}</span>`).join("")}</div>`:""}
    ${isVideo?`<a href="${cmEsc(m.url)}" target="_blank" rel="noopener" class="md-download-btn" onclick="cmRecordDownload('${m.id}')">🎥 Open Video Link</a>`:""}
    ${hasFile?`<button class="md-download-btn" onclick="downloadMaterial('${m.id}')">⬇ Download ${cmEsc(m.fileName||"File")} ${m.fileSize?"("+m.fileSize+")":""}</button>`:""}
    ${!hasFile&&!isVideo?`<div style="background:var(--bg3);border-radius:var(--radius);padding:14px;text-align:center;color:var(--text3);font-size:13px;margin-bottom:12px;">📎 No file attached (demo material)</div>`:""}
    <div class="md-views-row">
      <span>👁 ${m.views||1} views</span>
      <span>⬇ ${m.downloads||0} downloads</span>
      <span>📅 ${cmFmtDate(m.uploadedAt)}</span>
    </div>`;
  document.getElementById("md-footer").innerHTML = `
    <button class="btn btn-ghost" onclick="closeModal('material-detail-modal')">Close</button>
    ${canEdit?`<button class="btn btn-ghost" onclick="closeModal('material-detail-modal');openUploadModal('${m.id}')">✏ Edit</button>
    <button class="btn btn-danger" onclick="closeModal('material-detail-modal');deleteMaterial('${m.id}')">🗑 Delete</button>`:""}
    ${hasFile?`<button class="btn btn-accent" onclick="downloadMaterial('${m.id}')">⬇ Download</button>`:""}
    ${isVideo?`<a href="${cmEsc(m.url)}" target="_blank" rel="noopener" class="btn btn-accent" onclick="cmRecordDownload('${m.id}')">🎥 Open Link</a>`:""}`;
  openModal("material-detail-modal");
}

function downloadMaterial(id) {
  const db  = ensureCMTables();
  const idx = db.materials.findIndex(x => x.id===id);
  if (idx===-1) return;
  db.materials[idx].downloads = (db.materials[idx].downloads||0)+1;
  saveDB(db);
  if (db.materials[idx].fileData) {
    const a = document.createElement("a");
    a.href = db.materials[idx].fileData;
    a.download = db.materials[idx].fileName||"material";
    a.click();
    showToast(`Downloading ${db.materials[idx].fileName}`,"success");
  } else {
    showToast("Demo materials don't have real files attached","info");
  }
}

function cmRecordDownload(id) {
  const db=ensureCMTables();
  const idx=db.materials.findIndex(x=>x.id===id);
  if(idx>-1){db.materials[idx].downloads=(db.materials[idx].downloads||0)+1;saveDB(db);}
}

/* ── File handling ── */
function handleFileSelect(input) {
  if (input.files && input.files[0]) cmProcessFile(input.files[0]);
}
function handleFileDrop(event) {
  event.preventDefault();
  document.getElementById("cm-dropzone").classList.remove("drag-over");
  if (event.dataTransfer.files[0]) cmProcessFile(event.dataTransfer.files[0]);
}
function cmProcessFile(file) {
  if (file.size > 10*1024*1024) { showToast("File too large. Max 10MB.","error"); return; }
  const dz = document.getElementById("cm-dropzone");
  dz.classList.add("has-file");
  document.getElementById("cm-dropzone-sub").textContent = `✓ ${file.name} (${cmFmtBytes(file.size)})`;
  const reader = new FileReader();
  reader.onload = e => {
    pendingFileData = { name:file.name, size:file.size, type:file.type, dataUrl:e.target.result };
    showToast(`"${file.name}" ready to upload`,"success");
  };
  reader.readAsDataURL(file);
}
function resetDropzone() {
  const dz = document.getElementById("cm-dropzone");
  const fi = document.getElementById("um-file-input");
  if (dz) dz.classList.remove("has-file","drag-over");
  const sub = document.getElementById("cm-dropzone-sub");
  if (sub) sub.textContent = "Supports PDF, DOCX, PPTX, PNG, JPG";
  if (fi) fi.value = "";
  pendingFileData = null;
}

/* ── Manage subjects ── */
function openManageSubjectsModal() {
  if (currentUser?.role !== "admin") { showToast("Only admins can manage subjects","error"); return; }
  renderSubjectsList();
  openModal("manage-subjects-modal");
}
function renderSubjectsList() {
  const db = ensureCMTables();
  const el = document.getElementById("subjects-list");
  if (!el) return;
  el.innerHTML = (db.subjects||[]).map((s,i) => {
    const count = (db.materials||[]).filter(m=>m.subject===s).length;
    return `<div class="subject-manage-item">
      <div class="subject-manage-name"><span>${cmEsc(s)}</span><span class="subject-manage-count">${count} material${count!==1?"s":""}</span></div>
      <button class="btn btn-danger btn-sm" onclick="removeSubject(${i})">Remove</button>
    </div>`;
  }).join("")||`<p style="color:var(--text3);font-size:13px;text-align:center;padding:16px;">No subjects yet.</p>`;
}
function addSubject() {
  const input = document.getElementById("new-subject-input");
  const name  = input.value.trim();
  if (!name) return;
  const db = ensureCMTables();
  if ((db.subjects||[]).map(s=>s.toLowerCase()).includes(name.toLowerCase())) { showToast("Subject already exists","error"); return; }
  db.subjects = db.subjects||[];
  db.subjects.push(name);
  saveDB(db); input.value="";
  renderSubjectsList(); populateSubjectSelect();
  const db2 = ensureCMTables(); renderSubjectTabs(db2);
  showToast(`Subject "${name}" added`,"success");
}
function removeSubject(idx) {
  const db   = ensureCMTables();
  const name = db.subjects[idx];
  db.subjects.splice(idx, 1);
  saveDB(db); renderSubjectsList(); populateSubjectSelect();
  const db2 = ensureCMTables(); renderSubjectTabs(db2);
  showToast(`Subject "${name}" removed`,"info");
}

/* ── Utilities ── */
function cmEsc(str) {
  if (!str) return "";
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function cmFmtDate(str) {
  if (!str) return "—";
  try { return new Date(str).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"}); }
  catch { return str; }
}
function cmFmtBytes(bytes) {
  if (!bytes) return "0 B";
  const k=1024, s=["B","KB","MB","GB"];
  const i=Math.floor(Math.log(bytes)/Math.log(k));
  return parseFloat((bytes/Math.pow(k,i)).toFixed(1))+" "+s[i];
}

// ═══════════════════════════════════════════════
//   BOOT
// ═══════════════════════════════════════════════
(function boot() {
  applyTheme(); // apply saved theme immediately
  getDB(); // ensure DB is seeded (creates all user accounts)

  const saved = sessionStorage.getItem("currentUser");
  if (saved) {
    currentUser = JSON.parse(saved);
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app").style.display = "flex";
    initApp();
  }
})();

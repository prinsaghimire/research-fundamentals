// ── Sidebar toggle ──────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  // Inject overlay element
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebarOverlay';
  overlay.onclick = toggleSidebar;
  document.body.appendChild(overlay);

  // ── Active nav link ──────────────────────────────────────
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ── Tabs ─────────────────────────────────────────────────
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const panels = btn.closest('.tabs-container') || document.body;
        panels.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  });

  // ── Accordions ───────────────────────────────────────────
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const acc = header.closest('.accordion');
      acc.classList.toggle('open');
    });
  });

  // ── Quiz options ─────────────────────────────────────────
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const question = opt.closest('.quiz-question');
      question.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      if (opt.querySelector('input[type="radio"]')) {
        opt.querySelector('input[type="radio"]').checked = true;
      }
    });
  });
});

// ── Grade storage (localStorage) ───────────────────────────
const GradeStore = {
  key: 'hci_course_grades',
  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || {}; }
    catch { return {}; }
  },
  set(grades) {
    localStorage.setItem(this.key, JSON.stringify(grades));
  },
  save(id, score, max) {
    const g = this.get();
    g[id] = { score, max, date: new Date().toISOString() };
    this.set(g);
  }
};

// ── Submission storage ──────────────────────────────────────
const SubmitStore = {
  key: 'hci_course_submissions',
  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || {}; }
    catch { return {}; }
  },
  save(id, data) {
    const s = this.get();
    s[id] = { ...data, date: new Date().toISOString() };
    localStorage.setItem(this.key, JSON.stringify(s));
  }
};

// ── Discussion posts storage ────────────────────────────────
const DiscussionStore = {
  key: 'hci_course_discussions',
  get(threadId) {
    try {
      const all = JSON.parse(localStorage.getItem(this.key)) || {};
      return all[threadId] || [];
    } catch { return []; }
  },
  add(threadId, post) {
    try {
      const all = JSON.parse(localStorage.getItem(this.key)) || {};
      if (!all[threadId]) all[threadId] = [];
      all[threadId].push({ ...post, id: Date.now(), date: new Date().toISOString() });
      localStorage.setItem(this.key, JSON.stringify(all));
      return all[threadId];
    } catch { return []; }
  }
};

// ── Quiz runner ─────────────────────────────────────────────
function submitQuiz(quizId, answersMap) {
  // answersMap: { questionIndex: selectedOptionIndex }
  // Returns score. Answers must be provided by the page.
  return 0;
}

// ── Utility ────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function initGradeDisplay() {
  const grades = GradeStore.get();
  document.querySelectorAll('[data-grade-id]').forEach(el => {
    const id = el.dataset.gradeId;
    if (grades[id]) {
      const { score, max } = grades[id];
      el.textContent = `${score} / ${max}`;
      el.style.color = score / max >= 0.7 ? 'var(--primary)' : 'var(--danger)';
    }
  });
}

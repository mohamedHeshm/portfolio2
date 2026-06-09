/**
 * views/SkillsView.js — Skills section DOM rendering
 */
export class SkillsView {
  constructor() {
    this.grid = document.getElementById('skills-grid');
  }

  render(skills) {
    if (!this.grid || !skills.length) return this;
    this.grid.innerHTML = skills.map((s, i) => `
      <div class="skill-card reveal-scale" data-delay="${i * 60}">
        <span class="skill-icon">${s.icon || '⚙️'}</span>
        <div class="skill-name">${s.name}</div>
        <div class="skill-category">${s.category || ''}</div>
        <div class="skill-level-label">
          <span>Proficiency</span>
          <span class="skill-level-pct">${s.level || 80}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" data-level="${s.level || 80}"></div>
        </div>
      </div>
    `).join('');
    this._observeBars();
    return this;
  }

  _observeBars() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.level + '%';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    this.grid?.querySelectorAll('.progress-fill').forEach(f => obs.observe(f));
  }

  addTiltEffect() {
    this.grid?.querySelectorAll('.skill-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
      });
    });
  }
}

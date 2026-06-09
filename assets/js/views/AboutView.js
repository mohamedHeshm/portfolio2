/**
 * views/AboutView.js — About section DOM rendering
 */
export class AboutView {
  render(about) {
    if (!about) return this;

    const intro = document.getElementById('about-intro');
    if (intro && about.bio) intro.textContent = about.bio;

    const img = document.getElementById('about-image');
    if (img && about.image_url) img.src = about.image_url;

    if (about.timeline?.length) this._renderTimeline(about.timeline);
    this._renderCounters(about);
    return this;
  }

  _renderTimeline(items) {
    const container = document.getElementById('about-timeline');
    if (!container) return;
    container.innerHTML = items.map((item, i) => `
      <div class="timeline-item reveal" data-delay="${i * 100}">
        <div class="timeline-year">${item.year}</div>
        <div class="timeline-title">${item.title}</div>
        <div class="timeline-desc">${item.description}</div>
      </div>
    `).join('');
  }

  _renderCounters(about) {
    const grid = document.getElementById('counters-grid');
    if (!grid) return;
    const items = [
      { key: 'years_exp',     label: 'Years Experience', suffix: '+' },
      { key: 'projects_done', label: 'Projects Done',    suffix: '+' },
      { key: 'clients',       label: 'Happy Clients',    suffix: '+' },
      { key: 'awards',        label: 'Awards Won',       suffix: ''  }
    ];
    grid.innerHTML = items.map((item, i) => `
      <div class="counter-card reveal-scale" data-delay="${i * 80}">
        <div class="counter-number" data-target="${about[item.key] || 0}" data-suffix="${item.suffix}">
          0${item.suffix}
        </div>
        <div class="counter-label">${item.label}</div>
      </div>
    `).join('');
  }
}

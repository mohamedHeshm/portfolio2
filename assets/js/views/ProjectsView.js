/**
 * views/ProjectsView.js — Projects section DOM rendering
 */
export class ProjectsView {
  constructor() {
    this.grid         = document.getElementById('projects-grid');
    this.filterBar    = document.getElementById('projects-filter');
    this.featuredWrap = document.getElementById('featured-project');
  }

  renderFeatured(project) {
    if (!this.featuredWrap || !project) return;
    const tags = (project.technologies || []).map(t => `<span class="tag">${t}</span>`).join('');
    this.featuredWrap.style.display = '';
    this.featuredWrap.innerHTML = `
      <div class="featured-thumb reveal-left">
        ${project.image_url
          ? `<img src="${project.image_url}" alt="${project.title}" loading="lazy">`
          : `<div class="project-thumb-placeholder" style="height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem">🚀</div>`}
      </div>
      <div class="featured-body reveal-right">
        <div class="featured-eyebrow">⭐ Featured Project</div>
        <h3 class="featured-title">${project.title}</h3>
        <p class="featured-desc">${project.description}</p>
        <div class="featured-tags">${tags}</div>
        <div class="featured-actions">
          ${project.demo_url   ? `<a href="${project.demo_url}"   target="_blank" rel="noopener" class="btn btn-primary">Live Demo ↗</a>` : ''}
          ${project.github_url ? `<a href="${project.github_url}" target="_blank" rel="noopener" class="btn btn-ghost">GitHub ↗</a>`     : ''}
        </div>
      </div>
    `;
  }

  renderFilters(categories, activeCategory, onFilter) {
    if (!this.filterBar) return;
    this.filterBar.innerHTML = categories.map(cat => `
      <button class="filter-btn ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">
        ${cat === 'all' ? 'All' : cat}
      </button>
    `).join('');
    this.filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        onFilter(btn.dataset.cat);
      });
    });
  }

  renderProjects(projects) {
    if (!this.grid) return;
    if (!projects.length) {
      this.grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--clr-text-muted)">
          No projects found in this category.
        </div>`;
      return;
    }
    this.grid.innerHTML = projects.map((p, i) => this._card(p, i)).join('');
  }

  _card(p, i) {
    const tags = (p.technologies || []).slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('');
    return `
      <article class="project-card reveal" data-delay="${i * 80}" data-id="${p.id}">
        <div class="project-thumb">
          ${p.image_url
            ? `<img data-src="${p.image_url}" alt="${p.title}" loading="lazy">`
            : `<div class="project-thumb-placeholder">💡</div>`}
          <div class="project-thumb-overlay">
            ${p.demo_url   ? `<a href="${p.demo_url}"   target="_blank" rel="noopener" class="btn btn-primary" style="font-size:.75rem;padding:6px 16px">Demo ↗</a>` : ''}
            ${p.github_url ? `<a href="${p.github_url}" target="_blank" rel="noopener" class="btn btn-ghost"   style="font-size:.75rem;padding:6px 16px">Code ↗</a>` : ''}
          </div>
        </div>
        <div class="project-body">
          <div class="project-header">
            <div class="project-category">${p.category || 'Project'}</div>
            ${p.featured ? `<span class="badge badge-featured">⭐ Featured</span>` : ''}
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">${tags}</div>
          <div class="project-links">
            ${p.demo_url   ? `<a href="${p.demo_url}"   target="_blank" rel="noopener" class="btn btn-ghost" style="font-size:.8rem;padding:5px 14px">Live Demo ↗</a>` : ''}
            ${p.github_url ? `<a href="${p.github_url}" target="_blank" rel="noopener" class="btn btn-ghost" style="font-size:.8rem;padding:5px 14px">GitHub ↗</a>`    : ''}
          </div>
        </div>
      </article>
    `;
  }
}

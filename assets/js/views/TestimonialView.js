/**
 * views/TestimonialView.js — Testimonials slider DOM rendering
 */
export class TestimonialView {
  constructor() {
    this.track    = document.getElementById('testimonial-track');
    this.dotsEl   = document.getElementById('testimonial-dots');
    this.current  = 0;
    this.total    = 0;
    this._timer   = null;
  }

  render(testimonials) {
    if (!this.track || !testimonials.length) return this;
    this.total = testimonials.length;

    this.track.innerHTML = testimonials.map(t => `
      <div class="testimonial-slide">
        <div class="testimonial-card">
          <p class="testimonial-quote">"${t.quote}"</p>
          <div class="testimonial-author">
            ${t.avatar_url
              ? `<img src="${t.avatar_url}" class="testimonial-avatar" alt="${t.name}" loading="lazy">`
              : `<div class="testimonial-avatar-placeholder">👤</div>`}
            <div class="testimonial-author-name">${t.name}</div>
            <div class="testimonial-author-role">${[t.role, t.company].filter(Boolean).join(' @ ')}</div>
            <div class="testimonial-rating">
              ${'⭐'.repeat(Math.min(t.rating || 5, 5))}
            </div>
          </div>
        </div>
      </div>
    `).join('');

    this._renderDots();
    this._bindNav();
    this.goto(0);
    this._startAuto();
    return this;
  }

  _renderDots() {
    if (!this.dotsEl) return;
    this.dotsEl.innerHTML = Array.from({ length: this.total }, (_, i) =>
      `<button class="testimonial-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Go to slide ${i+1}"></button>`
    ).join('');
    this.dotsEl.querySelectorAll('.testimonial-dot').forEach(d =>
      d.addEventListener('click', () => { this.goto(+d.dataset.i); this._resetAuto(); })
    );
  }

  goto(idx) {
    this.current = ((idx % this.total) + this.total) % this.total;
    if (this.track) this.track.style.transform = `translateX(-${this.current * 100}%)`;
    document.querySelectorAll('.testimonial-dot').forEach((d, i) =>
      d.classList.toggle('active', i === this.current)
    );
  }

  _bindNav() {
    document.getElementById('testimonial-prev')?.addEventListener('click', () => { this.goto(this.current - 1); this._resetAuto(); });
    document.getElementById('testimonial-next')?.addEventListener('click', () => { this.goto(this.current + 1); this._resetAuto(); });
  }

  _startAuto() { this._timer = setInterval(() => this.goto(this.current + 1), 5000); }
  _resetAuto()  { clearInterval(this._timer); this._startAuto(); }

  appendSlide(t) {
    if (!this.track) return;
    this.total++;
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide';
    slide.innerHTML = `
      <div class="testimonial-card">
        <p class="testimonial-quote">"${t.quote}"</p>
        <div class="testimonial-author">
          <div class="testimonial-author-name">${t.name}</div>
          <div class="testimonial-author-role">${t.role || ''}</div>
        </div>
      </div>`;
    this.track.appendChild(slide);
    this._renderDots();
  }
}

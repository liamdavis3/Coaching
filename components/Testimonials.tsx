import Image from 'next/image'
 
type Testimonial = {
  quote: string
  name: string
  detail: string
  initials: string
  image?: string
  accentClass: string
}
 
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Following this training plan for 10 weeks took 4 minutes off my half marathon PR. The structure and weekly check-ins made all the difference.',
    name: 'Adam K.',
    detail: 'Mile: 4:46 -> 4:26',
    initials: 'AK',
    accentClass: 'avatar-orange',
  },
  {
    quote:
      'I had been running consistently for two years but never knew how to actually structure my training. This coaching gave me a real plan and I finally hit sub-20 in the 5K.',
    name: 'Taitwoine S.',
    detail: '5K: 25:00 → 21:30',
    initials: 'TS',
    accentClass: 'avatar-dark',
  },
  {
    quote:
      'Juggling a full-time job and family, I needed a plan that fit my life. Every week was realistic, progressive, and actually fun to follow.',
    name: 'Haley W.',
    detail: '5k: Never ran -> 31:00',
    initials: 'HW',
    accentClass: 'avatar-orange',
  },
]
 
export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials-section">
      <p className="section-label">What athletes say</p>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-quote-mark">&ldquo;</div>
            <p className="testimonial-quote">{t.quote}</p>
            <div className="testimonial-footer">
              {t.image ? (
                <Image
                  src={t.image}
                  alt={t.name}
                  width={36}
                  height={36}
                  className="testimonial-avatar-img"
                />
              ) : (
                <div className={`testimonial-avatar ${t.accentClass}`}>
                  {t.initials}
                </div>
              )}
              <div className="testimonial-meta">
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-detail">{t.detail}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
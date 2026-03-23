import { ScrollBehavior } from "next/dist/client/components/router-reducer/router-reducer-types";

export default function HeroSection() {
  return (
    <div className="hero" id="home">
      <div>
        <p className="hero-eyebrow">D1 Athlete · Personal Coaching</p>
        <h1 className="hero-title">
          Run faster. <em>Train smarter.</em>
        </h1>
        <p className="hero-body">
          Personalized distance running coaching built around your life - not a generic
          plan. I&apos;m a D1 collegiate runner who coaches based on real life mistakes and experiences
          I have gained throughout my career of what works and does not.
        </p>
        {/* Scroll to form — needs client interactivity, so use an anchor instead */}
        <a href="#intake-form" className="hero-cta">
          Apply for coaching
        </a>
      </div>

      <div className="hero-stats">
        <div className="stat-card">
          <div className="stat-num">Realistic</div>
          <div className="stat-label">Price modeling</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">D1</div>
          <div className="stat-label">Competitive background</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">4–12</div>
          <div className="stat-label">Week plan cycles</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">48hr</div>
          <div className="stat-label">Response guarantee</div>
        </div>
      </div>
    </div>
  )
}

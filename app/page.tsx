import HeroSection from '@/components/HeroSection'
import IntakeForm from '@/components/IntakeForm'
import Image from 'next/image'

export const metadata = {
  title: 'Stride Coaching',
  description: 'Personalized distance running coaching from a D1 athlete.',
}

export default function Home() {
  return (
    <main className="page">
      <HeroSection />

      <div className="divider" />

      <section className="about">
        <p className="about-label">About the coach</p>
        <div className="about-content">
          <div className="about-photo-wrapper">
                <Image src="/coach.jpg" alt="/" width={280} height={300}className="about-photo" />
          </div>
        <div>
          <h2 className="about-title">Training rooted in experience</h2>
          <p className="about-body">
            I&apos;ve been competing in distance events at the D1 level while studying Computer
            Science and Economics. I understand the data behind performance — from lactate
            thresholds to race-day nutrition — and I build plans that fit real life: jobs,
            classes, family, and everything in between.
          </p>
          <div className="credentials">
            <span className="badge badge-orange">D1 Distance Runner</span>
            <span className="badge badge-dark">CS + Econ Major</span>
            <span className="badge badge-dark">4:07 mile</span>
            <span className="badge badge-orange">Real Understanding</span>
          </div>
        </div>
        </div>
      </section>

      <div className="divider" />

      <section className="form-section">
        <p className="section-label">Intake questionnaire</p>
        <IntakeForm />
      </section>

      <div className="divider" />

      <div className="bottom-strip">
        <div className="strip-card">
          <div className="strip-icon">📋</div>
          <div className="strip-title">Realistic Approach</div>
          <p className="strip-body">
            I have failed many times. Yet, I learned what works and what doesn't. I am here to bring that 
            experience to you, providing a realistic and battle tested point of view.
          </p>
        </div>
        <div className="strip-card">
          <div className="strip-icon">📊</div>
          <div className="strip-title">Data-driven approach</div>
          <p className="strip-body">
            Training is based in science.
          </p>
        </div>
        <div className="strip-card">
          <div className="strip-icon">💬</div>
          <div className="strip-title">Ongoing support</div>
          <p className="strip-body">
            Consistent feedback and adjustments are welcome. I will always root for you. 
          </p>
        </div>
      </div>
    </main>
  )
}

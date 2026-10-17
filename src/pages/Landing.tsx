import { Link } from 'react-router-dom';
import { Button, Waves } from '../components/ui';

const props = [
  [
    'Compare programmes side by side',
    'One wide table for requirements, deadlines, tuition and status across every programme.',
  ],
  [
    'Reuse documents, not effort',
    'Link one transcript or reference to many applications and see where it is still missing.',
  ],
  [
    'Never miss a deadline',
    'Dependencies such as "request reference before submitting" are tracked and flagged early.',
  ],
];

export default function Landing() {
  return (
    <>
      <section className="relative overflow-hidden bg-indigo text-card">
        <Waves
          light
          className="pointer-events-none absolute -right-10 -bottom-4 h-40 w-[480px] opacity-30"
        />
        <Waves
          light
          className="pointer-events-none absolute -top-6 -left-16 h-32 w-[400px] opacity-15"
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 lg:pt-24">
          <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-accent-soft uppercase">
            For final-year students applying to master's programmes
          </p>
          <h1 className="max-w-3xl text-[44px] leading-[1.05] font-extrabold tracking-tight lg:text-[56px]">
            Every master's application, one clear plan.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-accent-soft">
            GradPath Atlas replaces scattered spreadsheets, emails and notes with a single workspace
            for requirements, documents, deadlines and tasks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup">
              <Button className="bg-card text-indigo hover:bg-accent-soft">
                Start planning — free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="ghost" className="text-card hover:bg-card/10">
                See pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-14 md:grid-cols-3">
        {props.map(([t, b]) => (
          <div key={t} className="rounded-sheet border border-line bg-card p-6">
            <h2 className="text-[17px] font-bold">{t}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{b}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-sheet bg-accent-soft p-8">
          <h2 className="text-xl font-bold text-indigo">Simple pricing</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-muted">
            Free for up to three programmes. One Application Pass per season for unlimited
            programmes and exports. Licences for advisers and universities.
          </p>
          <Link
            to="/pricing"
            className="mt-4 inline-block text-[15px] font-semibold text-accent hover:underline"
          >
            Compare plans →
          </Link>
        </div>
      </section>
    </>
  );
}

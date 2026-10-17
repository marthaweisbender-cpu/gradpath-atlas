import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

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
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-16 lg:pt-20">
        <p className="mb-3 text-sm font-medium text-accent-strong">
          For final-year students applying to master's programmes
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight lg:text-5xl">
          Every master's application, one clear plan.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          GradPath Atlas replaces scattered spreadsheets, emails and notes with a single workspace
          for requirements, documents, deadlines and tasks.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/signup">
            <Button>Start planning — free</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="secondary">See pricing</Button>
          </Link>
        </div>
      </section>
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
          {props.map(([t, b]) => (
            <div key={t} className="rounded-lg border border-line bg-white p-5">
              <h2 className="font-semibold">{t}</h2>
              <p className="mt-2 text-sm text-muted">{b}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-xl font-semibold">Simple pricing</h2>
        <p className="mt-2 text-sm text-muted">
          Free for up to three programmes. One Application Pass per season for unlimited programmes
          and exports. Licences for advisers and universities.
        </p>
        <Link
          to="/pricing"
          className="mt-4 inline-block text-sm font-medium text-accent-strong hover:underline"
        >
          Compare plans →
        </Link>
      </section>
    </>
  );
}

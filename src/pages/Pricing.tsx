import { Link, useNavigate } from 'react-router-dom';
import { Banner, Button } from '../components/ui';
import type { Plan } from '../data/types';
import { useAppStore, useCurrentUser } from '../store/useAppStore';

const tiers: { plan: Plan; name: string; price: string; blurb: string; features: string[] }[] = [
  {
    plan: 'free',
    name: 'Free',
    price: '$0',
    blurb: 'Basic planning for a short shortlist.',
    features: ['Up to 3 active programmes', 'Requirements, documents, tasks', 'Deadline tracker'],
  },
  {
    plan: 'season',
    name: 'Application Pass',
    price: '$29 / season',
    blurb: 'One payment for the whole application season.',
    features: ['Unlimited programmes', 'Adviser review view + exports', 'Priority support'],
  },
  {
    plan: 'adviser',
    name: 'Adviser licence',
    price: '$199 / year',
    blurb: 'For careers services and education advisers.',
    features: [
      'Everything in Application Pass',
      'Review multiple students',
      'Cohort licences available',
    ],
  },
];

export default function Pricing() {
  const user = useCurrentUser();
  const setPlan = useAppStore((s) => s.setPlan);
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-2 text-muted">Students pay once per season. Institutions license seats.</p>
      <div className="mt-4">
        <Banner tone="warn">
          Test mode: upgrades are simulated. No payment is taken and no card details are requested.
        </Banner>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((t) => {
          const current = user?.plan === t.plan;
          return (
            <div
              key={t.plan}
              className={`rounded-lg border bg-white p-6 ${t.plan === 'season' ? 'border-accent' : 'border-line'}`}
            >
              <h2 className="text-lg font-semibold">{t.name}</h2>
              <p className="mt-1 text-2xl font-semibold">{t.price}</p>
              <p className="mt-1 text-sm text-muted">{t.blurb}</p>
              <ul className="mt-4 space-y-1 text-sm">
                {t.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <div className="mt-6">
                {!user ? (
                  <Link to="/signup">
                    <Button
                      variant={t.plan === 'season' ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      Get started
                    </Button>
                  </Link>
                ) : current ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    variant={t.plan === 'season' ? 'primary' : 'secondary'}
                    className="w-full"
                    onClick={() => {
                      setPlan(t.plan);
                      navigate('/app/settings');
                    }}
                  >
                    {t.plan === 'free' ? 'Downgrade (test)' : 'Upgrade (test)'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

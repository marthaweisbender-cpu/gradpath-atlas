import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Field, PageHeader } from '../components/ui';
import { useAppStore, useCurrentUser } from '../store/useAppStore';

export default function Settings() {
  const user = useCurrentUser();
  const updateProfile = useAppStore((s) => s.updateProfile);
  const resetDemoData = useAppStore((s) => s.resetDemoData);
  const clearAllData = useAppStore((s) => s.clearAllData);
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? '');
  const [saved, setSaved] = useState(false);

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile({ name: name.trim() });
    setSaved(true);
  };

  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Profile">
          <form onSubmit={save} className="space-y-4">
            <Field
              label="Name"
              id="st-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
            />
            <Field label="Email" id="st-email" value={user?.email ?? ''} readOnly />
            <div className="flex items-center gap-3">
              <Button type="submit">Save</Button>
              {saved && (
                <span role="status" className="text-sm text-ok">
                  Saved
                </span>
              )}
            </div>
          </form>
        </Card>
        <Card title="Plan">
          <p className="text-sm">
            Current plan: <strong className="capitalize">{user?.plan}</strong>
          </p>
          <p className="mt-1 text-sm text-muted">Free plan allows up to 3 active programmes.</p>
          <Link
            to="/pricing"
            className="mt-3 inline-block text-sm text-accent-strong hover:underline"
          >
            Change plan →
          </Link>
        </Card>
        <Card title="Data">
          <p className="text-sm text-muted">
            All data lives in this browser only. Nothing is uploaded.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                if (confirm('Replace your programmes, documents and tasks with the demo data?'))
                  resetDemoData();
              }}
            >
              Reset demo data
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (
                  confirm(
                    'Erase your account and all data from this browser? This cannot be undone.',
                  )
                ) {
                  clearAllData();
                  navigate('/');
                }
              }}
            >
              Erase everything
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

import { useState, type FormEvent } from 'react';
import { PROGRAMME_STATUSES, type Programme } from '../data/types';
import { useAppStore } from '../store/useAppStore';
import { Button, Field, Modal, Select } from './ui';

type Values = Omit<Programme, 'id'>;

const empty: Values = {
  universityId: '',
  name: '',
  degree: 'MSc',
  field: '',
  tuitionUsd: 0,
  durationMonths: 12,
  intake: 'September',
  deadline: '',
  status: 'researching',
  priority: 2,
};

export default function ProgrammeDialog({
  open,
  onClose,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Programme;
  onSaved?: (id: string) => void;
}) {
  const universities = useAppStore((s) => s.universities);
  const addUniversity = useAppStore((s) => s.addUniversity);
  const addProgramme = useAppStore((s) => s.addProgramme);
  const updateProgramme = useAppStore((s) => s.updateProgramme);

  const [v, setV] = useState<Values>(
    initial ? { ...initial } : { ...empty, universityId: universities[0]?.id ?? '' },
  );
  const [newUni, setNewUni] = useState({ name: '', country: '', city: '' });
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((s) => ({ ...s, [k]: val }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!v.name.trim()) return setError('Programme name is required.');
    if (!v.deadline) return setError('Deadline is required.');
    let universityId = v.universityId;
    if (universityId === '__new') {
      if (!newUni.name.trim()) return setError('University name is required.');
      universityId = addUniversity(newUni);
    }
    if (!universityId) return setError('Select a university.');
    const values = {
      ...v,
      universityId,
      tuitionUsd: Number(v.tuitionUsd),
      durationMonths: Number(v.durationMonths),
    };
    if (initial) {
      updateProgramme(initial.id, values);
      onSaved?.(initial.id);
    } else {
      const res = addProgramme(values);
      if (!res.ok) return setError(res.error ?? 'Could not add programme.');
      onSaved?.(res.id!);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit programme' : 'Add programme'}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Select
          label="University"
          id="pf-uni"
          value={v.universityId}
          onChange={(e) => set('universityId', e.target.value)}
        >
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} — {u.country}
            </option>
          ))}
          <option value="__new">+ New university…</option>
        </Select>
        {v.universityId === '__new' && (
          <div className="grid grid-cols-3 gap-3 rounded-md bg-surface p-3">
            <Field
              label="Name"
              id="nu-name"
              value={newUni.name}
              onChange={(e) => setNewUni({ ...newUni, name: e.target.value })}
            />
            <Field
              label="Country"
              id="nu-country"
              value={newUni.country}
              onChange={(e) => setNewUni({ ...newUni, country: e.target.value })}
            />
            <Field
              label="City"
              id="nu-city"
              value={newUni.city}
              onChange={(e) => setNewUni({ ...newUni, city: e.target.value })}
            />
          </div>
        )}
        <Field
          label="Programme name"
          id="pf-name"
          value={v.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Degree"
            id="pf-degree"
            value={v.degree}
            onChange={(e) => set('degree', e.target.value)}
          />
          <Field
            label="Field"
            id="pf-field"
            value={v.field}
            onChange={(e) => set('field', e.target.value)}
          />
          <Field
            label="Tuition (USD)"
            id="pf-tuition"
            type="number"
            min={0}
            value={v.tuitionUsd}
            onChange={(e) => set('tuitionUsd', Number(e.target.value))}
          />
          <Field
            label="Duration (months)"
            id="pf-duration"
            type="number"
            min={1}
            value={v.durationMonths}
            onChange={(e) => set('durationMonths', Number(e.target.value))}
          />
          <Field
            label="Intake"
            id="pf-intake"
            value={v.intake}
            onChange={(e) => set('intake', e.target.value)}
          />
          <Field
            label="Deadline"
            id="pf-deadline"
            type="date"
            value={v.deadline}
            onChange={(e) => set('deadline', e.target.value)}
            required
          />
          <Select
            label="Status"
            id="pf-status"
            value={v.status}
            onChange={(e) => set('status', e.target.value as Values['status'])}
          >
            {PROGRAMME_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select
            label="Priority"
            id="pf-priority"
            value={v.priority}
            onChange={(e) => set('priority', Number(e.target.value) as Values['priority'])}
          >
            <option value={1}>1 — top choice</option>
            <option value={2}>2 — strong option</option>
            <option value={3}>3 — backup</option>
          </Select>
        </div>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initial ? 'Save' : 'Add programme'}</Button>
        </div>
      </form>
    </Modal>
  );
}

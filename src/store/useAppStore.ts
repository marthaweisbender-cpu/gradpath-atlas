import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { buildSeed } from '../data/seed';
import {
  FREE_PLAN_PROGRAMME_LIMIT,
  type Doc,
  type Note,
  type Plan,
  type Programme,
  type ProgrammeStatus,
  type Requirement,
  type Task,
  type University,
  type User,
  type Workspace,
} from '../data/types';
import { sha256, uid } from '../lib/crypto';

export interface AuthResult {
  ok: boolean;
  error?: string;
}

interface State extends Workspace {
  users: User[];
  currentUserId: string | null;
  // auth
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<AuthResult>;
  updateProfile: (patch: Pick<User, 'name'>) => void;
  setPlan: (plan: Plan) => void;
  // programmes
  addProgramme: (p: Omit<Programme, 'id'>) => { ok: boolean; id?: string; error?: string };
  updateProgramme: (id: string, patch: Partial<Omit<Programme, 'id'>>) => void;
  setProgrammeStatus: (id: string, status: ProgrammeStatus) => void;
  removeProgramme: (id: string) => void;
  addUniversity: (u: Omit<University, 'id'>) => string;
  // requirements
  addRequirement: (r: Omit<Requirement, 'id'>) => void;
  updateRequirement: (id: string, patch: Partial<Omit<Requirement, 'id'>>) => void;
  removeRequirement: (id: string) => void;
  linkDocument: (requirementId: string, documentId: string | null) => void;
  // documents
  addDocument: (d: Omit<Doc, 'id' | 'updatedAt'>) => string;
  updateDocument: (id: string, patch: Partial<Omit<Doc, 'id'>>) => void;
  removeDocument: (id: string) => void;
  // tasks
  addTask: (t: Omit<Task, 'id' | 'done'>) => void;
  toggleTask: (id: string) => { ok: boolean; error?: string };
  removeTask: (id: string) => void;
  // notes
  addNote: (programmeId: string, body: string) => void;
  removeNote: (id: string) => void;
  // data
  resetDemoData: () => void;
  clearAllData: () => void;
}

const emptyWorkspace: Workspace = {
  universities: [],
  programmes: [],
  requirements: [],
  documents: [],
  tasks: [],
  notes: [],
  advisers: [],
  statusRecords: [],
};

const normaliseEmail = (e: string) => e.trim().toLowerCase();

export const useAppStore = create<State>()(
  persist(
    (set, get) => ({
      ...buildSeed(),
      users: [],
      currentUserId: null,

      async signUp(name, email, password) {
        const e = normaliseEmail(email);
        if (!name.trim()) return { ok: false, error: 'Name is required.' };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
          return { ok: false, error: 'Enter a valid email.' };
        if (password.length < 8)
          return { ok: false, error: 'Password must be at least 8 characters.' };
        if (get().users.some((u) => u.email === e))
          return { ok: false, error: 'An account with this email already exists.' };
        const user: User = {
          id: uid(),
          email: e,
          name: name.trim(),
          passwordHash: await sha256(password),
          plan: 'free',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ users: [...s.users, user], currentUserId: user.id }));
        return { ok: true };
      },

      async signIn(email, password) {
        const e = normaliseEmail(email);
        const user = get().users.find((u) => u.email === e);
        if (!user || user.passwordHash !== (await sha256(password)))
          return { ok: false, error: 'Email or password is incorrect.' };
        set({ currentUserId: user.id });
        return { ok: true };
      },

      signOut: () => set({ currentUserId: null }),

      async resetPassword(email, newPassword) {
        const e = normaliseEmail(email);
        if (!get().users.some((u) => u.email === e))
          return { ok: false, error: 'No account found for this email.' };
        if (newPassword.length < 8)
          return { ok: false, error: 'Password must be at least 8 characters.' };
        const passwordHash = await sha256(newPassword);
        set((s) => ({ users: s.users.map((u) => (u.email === e ? { ...u, passwordHash } : u)) }));
        return { ok: true };
      },

      updateProfile: (patch) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, ...patch } : u)),
        })),

      setPlan: (plan) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, plan } : u)),
        })),

      addProgramme(p) {
        const s = get();
        const user = s.users.find((u) => u.id === s.currentUserId);
        const plan = user?.plan ?? 'free';
        const active = s.programmes.filter((x) => x.status !== 'dropped').length;
        if (plan === 'free' && active >= FREE_PLAN_PROGRAMME_LIMIT)
          return {
            ok: false,
            error: `Free plan is limited to ${FREE_PLAN_PROGRAMME_LIMIT} active programmes. Upgrade to add more.`,
          };
        const id = uid();
        set((st) => ({
          programmes: [...st.programmes, { ...p, id }],
          statusRecords: [
            ...st.statusRecords,
            { id: uid(), programmeId: id, status: p.status, changedAt: new Date().toISOString() },
          ],
        }));
        return { ok: true, id };
      },

      updateProgramme: (id, patch) =>
        set((s) => ({
          programmes: s.programmes.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      setProgrammeStatus: (id, status) =>
        set((s) => ({
          programmes: s.programmes.map((p) => (p.id === id ? { ...p, status } : p)),
          statusRecords: [
            ...s.statusRecords,
            { id: uid(), programmeId: id, status, changedAt: new Date().toISOString() },
          ],
        })),

      removeProgramme: (id) =>
        set((s) => ({
          programmes: s.programmes.filter((p) => p.id !== id),
          requirements: s.requirements.filter((r) => r.programmeId !== id),
          tasks: s.tasks.filter((t) => t.programmeId !== id),
          notes: s.notes.filter((n) => n.programmeId !== id),
          statusRecords: s.statusRecords.filter((r) => r.programmeId !== id),
        })),

      addUniversity(u) {
        const id = uid();
        set((s) => ({ universities: [...s.universities, { ...u, id }] }));
        return id;
      },

      addRequirement: (r) =>
        set((s) => ({ requirements: [...s.requirements, { ...r, id: uid() }] })),
      updateRequirement: (id, patch) =>
        set((s) => ({
          requirements: s.requirements.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),
      removeRequirement: (id) =>
        set((s) => ({ requirements: s.requirements.filter((r) => r.id !== id) })),
      linkDocument: (requirementId, documentId) =>
        set((s) => ({
          requirements: s.requirements.map((r) =>
            r.id === requirementId ? { ...r, documentId } : r,
          ),
        })),

      addDocument(d) {
        const id = uid();
        set((s) => ({
          documents: [...s.documents, { ...d, id, updatedAt: new Date().toISOString() }],
        }));
        return id;
      },
      updateDocument: (id, patch) =>
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d,
          ),
        })),
      removeDocument: (id) =>
        set((s) => ({
          documents: s.documents.filter((d) => d.id !== id),
          requirements: s.requirements.map((r) =>
            r.documentId === id ? { ...r, documentId: null } : r,
          ),
        })),

      addTask: (t) => set((s) => ({ tasks: [...s.tasks, { ...t, id: uid(), done: false }] })),
      toggleTask(id) {
        const s = get();
        const task = s.tasks.find((t) => t.id === id);
        if (!task) return { ok: false, error: 'Task not found.' };
        if (!task.done && task.dependsOnId) {
          const dep = s.tasks.find((t) => t.id === task.dependsOnId);
          if (dep && !dep.done) return { ok: false, error: `Complete "${dep.title}" first.` };
        }
        set((st) => ({ tasks: st.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
        return { ok: true };
      },
      removeTask: (id) =>
        set((s) => ({
          tasks: s.tasks
            .filter((t) => t.id !== id)
            .map((t) => (t.dependsOnId === id ? { ...t, dependsOnId: null } : t)),
        })),

      addNote: (programmeId, body) =>
        set((s) => ({
          notes: [
            ...s.notes,
            {
              id: uid(),
              programmeId,
              body: body.trim(),
              createdAt: new Date().toISOString(),
            } as Note,
          ],
        })),
      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      resetDemoData: () => set({ ...buildSeed() }),
      clearAllData: () => set({ ...emptyWorkspace, users: [], currentUserId: null }),
    }),
    { name: 'gradpath-atlas-v1' },
  ),
);

export const useCurrentUser = (): User | null =>
  useAppStore((s) => s.users.find((u) => u.id === s.currentUserId) ?? null);

import { HashRouter, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import PublicLayout from './components/PublicLayout';
import RequireAuth from './components/RequireAuth';
import Adviser from './pages/Adviser';
import { Login, Reset, SignOut, SignUp } from './pages/Auth';
import Compare from './pages/Compare';
import Dashboard from './pages/Dashboard';
import Deadlines from './pages/Deadlines';
import Documents from './pages/Documents';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import ProgrammeDetail from './pages/ProgrammeDetail';
import Settings from './pages/Settings';
import Tasks from './pages/Tasks';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/signout" element={<SignOut />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="compare" element={<Compare />} />
            <Route path="programmes/:id" element={<ProgrammeDetail />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="documents" element={<Documents />} />
            <Route path="deadlines" element={<Deadlines />} />
            <Route path="adviser" element={<Adviser />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<PublicLayout />}>
          <Route
            path="*"
            element={<p className="p-10 text-center text-muted">Page not found.</p>}
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

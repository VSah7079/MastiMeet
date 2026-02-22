import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '../../lib/api';

const stats = [
  { label: 'Total Users', value: '24,580', delta: '+6.2%', trend: 'up' },
  { label: 'Active Sessions', value: '1,284', delta: '-1.1%', trend: 'down' },
  { label: 'Matches Today', value: '8,904', delta: '+12.4%', trend: 'up' },
  { label: 'Open Reports', value: '37', delta: '+4', trend: 'up' },
];

const userRows = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav.s@example.com', role: 'Moderator', status: 'Active', lastSeen: '2m ago' },
  { id: 2, name: 'Isha Kapoor', email: 'isha.k@example.com', role: 'User', status: 'Active', lastSeen: '11m ago' },
  { id: 3, name: 'Rohan Mehta', email: 'rohan.m@example.com', role: 'User', status: 'Suspended', lastSeen: '1d ago' },
  { id: 4, name: 'Zara Ali', email: 'zara.a@example.com', role: 'Admin', status: 'Active', lastSeen: '5m ago' },
  { id: 5, name: 'Dev Patel', email: 'dev.p@example.com', role: 'User', status: 'Pending', lastSeen: '3h ago' },
  { id: 6, name: 'Anaya Singh', email: 'anaya.s@example.com', role: 'Moderator', status: 'Active', lastSeen: '9m ago' },
];

const reports = [
  { id: 'RPT-4821', category: 'Harassment', severity: 'High', age: '12m ago' },
  { id: 'RPT-4815', category: 'Spam', severity: 'Medium', age: '34m ago' },
  { id: 'RPT-4799', category: 'Impersonation', severity: 'High', age: '2h ago' },
  { id: 'RPT-4788', category: 'Inappropriate Content', severity: 'Low', age: '6h ago' },
];

const roles = [
  { name: 'Admin', users: 6, summary: 'Full access, billing, settings, and moderation.' },
  { name: 'Moderator', users: 24, summary: 'Can resolve reports and manage flagged content.' },
  { name: 'User', users: 24550, summary: 'Standard access to match, chat, and profile.' },
];

const activity = [
  { title: 'User verification spike', meta: ' +18% since morning' },
  { title: 'Report queue stabilized', meta: '12 resolved in last hour' },
  { title: 'Video sessions uptime', meta: '99.98% last 24h' },
];

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Suspended: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
};

const severityStyles = {
  High: 'text-rose-600',
  Medium: 'text-amber-600',
  Low: 'text-emerald-600',
};

const formatRelativeTime = (value) => {
  if (!value) return '—';
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return '—';
  const diff = Date.now() - time;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const AdminPanel = () => {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState(userRows);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadAdminData = async () => {
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const [summaryRes, usersRes] = await Promise.all([
          apiGet('/api/admin/summary', token),
          apiGet('/api/admin/users', token)
        ]);

        if (!isMounted) return;
        if (summaryRes?.summary) setSummary(summaryRes.summary);
        if (Array.isArray(usersRes?.users)) setUsers(usersRes.users);
      } catch (err) {
        if (isMounted) {
          setLoadError(err?.message || 'Failed to load admin data');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAdminData();
    return () => {
      isMounted = false;
    };
  }, []);

  const statsData = useMemo(() => {
    if (!summary) return stats;
    return [
      {
        label: 'Total Users',
        value: summary.totalUsers.toLocaleString(),
        delta: `+${summary.newUsers7d} in 7d`,
        trend: 'up'
      },
      {
        label: 'Verified Users',
        value: summary.verifiedUsers.toLocaleString(),
        delta: `${summary.pendingUsers} pending`,
        trend: summary.pendingUsers > 0 ? 'down' : 'up'
      },
      {
        label: 'Admins',
        value: summary.admins.toLocaleString(),
        delta: `${summary.moderators} moderators`,
        trend: 'up'
      },
      {
        label: 'Pending Users',
        value: summary.pendingUsers.toLocaleString(),
        delta: summary.pendingUsers > 0 ? 'needs review' : 'all clear',
        trend: summary.pendingUsers > 0 ? 'down' : 'up'
      }
    ];
  }, [summary]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesQuery =
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [query, roleFilter, statusFilter, users]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200 p-6">
          <div className="mb-10">
            <div className="text-2xl font-semibold text-slate-900">MastiMeet</div>
            <p className="text-sm text-slate-500">Admin Control</p>
          </div>
          <nav className="flex-1 space-y-1 text-sm">
            {['Overview', 'Users', 'Reports', 'Safety', 'Settings'].map((item) => (
              <button
                key={item}
                className="w-full text-left px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-slate-200 p-4 bg-slate-50">
            <p className="text-xs uppercase tracking-wide text-slate-500">System Health</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">99.98% uptime</p>
            <p className="text-xs text-slate-500">No incidents in last 24h</p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="px-6 lg:px-10 pt-8 pb-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-slate-500">Welcome back, Admin</p>
                <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-500 mt-1">Monitor platform health, users, and safety reports.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                  <input
                    className="bg-transparent outline-none text-sm w-48"
                    placeholder="Search users"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <button className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold shadow-sm hover:bg-primary-700 transition">
                  Create Report
                </button>
                <button className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-100 transition">
                  Export Data
                </button>
              </div>
            </div>
            {loadError ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {loadError}
              </div>
            ) : null}
          </header>

          <section className="px-6 lg:px-10">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statsData.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-semibold text-slate-900">{stat.value}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        stat.trend === 'up'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {stat.delta}
                    </span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-primary-500" style={{ width: '68%' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="px-6 lg:px-10 mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Engagement Trend</h2>
                <div className="text-xs text-slate-500">Last 7 days</div>
              </div>
              <div className="mt-6 grid grid-cols-7 gap-2 items-end h-36">
                {[42, 68, 54, 72, 63, 88, 74].map((value, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-full bg-primary-500/20"
                      style={{ height: `${value}%` }}
                    >
                      <div
                        className="w-full rounded-full bg-primary-500"
                        style={{ height: `${value}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">D{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {activity.map((item) => (
                  <div key={item.title} className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="text-sm text-slate-700">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.meta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Reports Queue</h2>
                <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                  Review all
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{report.category}</p>
                      <p className="text-xs text-slate-500">{report.id} · {report.age}</p>
                    </div>
                    <span className={`text-xs font-semibold ${severityStyles[report.severity]}`}>
                      {report.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 lg:px-10 mt-6 grid gap-6 lg:grid-cols-[2fr_1fr] pb-12">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">User Directory</h2>
                  <p className="text-xs text-slate-500">Search, filter, and manage access</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {['All', 'Admin', 'Moderator', 'User'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                        roleFilter === role
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                  {['All', 'Active', 'Pending', 'Suspended'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                        statusFilter === status
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                      <th className="py-3">User</th>
                      <th className="py-3">Role</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Last Seen</th>
                      <th className="py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="py-3">
                          <div className="font-medium text-slate-800">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </td>
                        <td className="py-3 text-slate-600">{user.role}</td>
                        <td className="py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[user.status]}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">{formatRelativeTime(user.lastSeen)}</td>
                        <td className="py-3 text-right">
                          <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 mr-3">
                            View
                          </button>
                          <button className="text-xs font-semibold text-slate-600 hover:text-slate-800">
                            Suspend
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {isLoading ? (
                <div className="mt-4 text-xs text-slate-500">Loading admin data...</div>
              ) : null}
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Roles & Permissions</h2>
              <p className="text-xs text-slate-500">Manage access levels</p>
              <div className="mt-5 space-y-4">
                {roles.map((role) => (
                  <div key={role.name} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{role.name}</p>
                        <p className="text-xs text-slate-500">{role.summary}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
                        {role.users} users
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['View', 'Edit', 'Moderate', 'Export'].map((perm) => (
                        <span key={perm} className="text-[11px] uppercase tracking-wide text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                Edit Roles
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;

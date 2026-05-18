"use client";
import { useState } from "react";
import { useCRM } from "@/lib/store";
import { Activity, ActivityType } from "@/lib/types";
import TopBar from "@/components/TopBar";
import Modal from "@/components/Modal";
import { Plus, Trash2, Phone, Mail, Calendar, Users, MessageSquare, Zap } from "lucide-react";

const TYPES: ActivityType[] = ["call", "email", "meeting", "note", "task"];

const TYPE_ICONS: Record<ActivityType, React.ReactNode> = {
  call: <Phone size={14} />,
  email: <Mail size={14} />,
  meeting: <Calendar size={14} />,
  note: <MessageSquare size={14} />,
  task: <Zap size={14} />,
};
const TYPE_COLORS: Record<ActivityType, string> = {
  call: "bg-blue-100 text-blue-700",
  email: "bg-purple-100 text-purple-700",
  meeting: "bg-emerald-100 text-emerald-700",
  note: "bg-amber-100 text-amber-700",
  task: "bg-slate-100 text-slate-700",
};

const EMPTY: Omit<Activity, "id" | "createdAt"> = {
  type: "note", title: "", description: "",
};

export default function ActivitiesPage() {
  const { activities, contacts, deals, addActivity, deleteActivity } = useCRM();
  const [filter, setFilter] = useState<ActivityType | "all">("all");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<Activity, "id" | "createdAt">>(EMPTY);

  const sorted = [...activities].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const filtered = filter === "all" ? sorted : sorted.filter(a => a.type === filter);

  function save() {
    if (!form.title) return;
    addActivity(form);
    setModal(false);
    setForm(EMPTY);
  }

  return (
    <div>
      <TopBar title="Activities" subtitle={`${activities.length} logged`} />
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              All ({activities.length})
            </button>
            {TYPES.map(t => {
              const count = activities.filter(a => a.type === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {TYPE_ICONS[t]} {t} ({count})
                </button>
              );
            })}
          </div>
          <button onClick={() => { setForm(EMPTY); setModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus size={16} /> Log Activity
          </button>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">No activities yet.</div>
          )}
          {filtered.map(a => {
            const contact = a.contactId ? contacts.find(c => c.id === a.contactId) : null;
            const deal = a.dealId ? deals.find(d => d.id === a.dealId) : null;
            return (
              <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLORS[a.type]}`}>
                  {TYPE_ICONS[a.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-slate-900">{a.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_COLORS[a.type]}`}>{a.type}</span>
                  </div>
                  {a.description && <p className="text-sm text-slate-500 mt-0.5">{a.description}</p>}
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                    <span>{new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    {contact && <span className="text-blue-500">{contact.firstName} {contact.lastName}</span>}
                    {deal && <span className="text-purple-500">{deal.title}</span>}
                  </div>
                </div>
                <button onClick={() => deleteActivity(a.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Log Activity">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Type</label>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as ActivityType }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Contact</label>
              <select value={form.contactId || ""} onChange={e => setForm(p => ({ ...p, contactId: e.target.value || undefined }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Deal</label>
              <select value={form.dealId || ""} onChange={e => setForm(p => ({ ...p, dealId: e.target.value || undefined }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None</option>
                {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={save} className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useCRM } from "@/lib/store";
import { formatRelativeDate } from "@/lib/utils";
import Modal from "@/components/Modal";
import type { ActivityType } from "@/lib/types";
import { Plus, Mail, Phone, Calendar, FileText, MessageSquare, Trash2 } from "lucide-react";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  email: { icon: Mail, color: "bg-blue-50 text-blue-600", label: "Email" },
  call: { icon: Phone, color: "bg-green-50 text-green-600", label: "Call" },
  meeting: { icon: Calendar, color: "bg-purple-50 text-purple-600", label: "Meeting" },
  note: { icon: FileText, color: "bg-gray-50 text-gray-600", label: "Note" },
  deal_created: { icon: MessageSquare, color: "bg-emerald-50 text-emerald-600", label: "Deal Created" },
  contact_created: { icon: MessageSquare, color: "bg-indigo-50 text-indigo-600", label: "Contact Created" },
};

const MANUAL_TYPES: ActivityType[] = ["email", "call", "meeting", "note"];

const blank = () => ({ type: "note" as ActivityType, title: "", description: "", contactId: "", dealId: "" });

export default function ActivitiesPage() {
  const { activities, contacts, deals, addActivity, deleteActivity } = useCRM();
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(blank());

  const sorted = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter(a => filterType === "all" || a.type === filterType);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const contact = contacts.find(c => c.id === form.contactId);
    addActivity({
      type: form.type,
      title: form.title,
      description: form.description,
      contactId: form.contactId || undefined,
      contactName: contact ? `${contact.firstName} ${contact.lastName}` : undefined,
      dealId: form.dealId || undefined,
    });
    setShowModal(false);
    setForm(blank());
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Feed</h1>
          <p className="text-sm text-slate-500 mt-0.5">{activities.length} total activities</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Log Activity
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", ...Object.keys(TYPE_CONFIG)].map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${filterType === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
            {t === "all" ? "All" : TYPE_CONFIG[t]?.label ?? t}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {sorted.map(activity => {
          const cfg = TYPE_CONFIG[activity.type] ?? { icon: MessageSquare, color: "bg-slate-50 text-slate-600", label: activity.type };
          const Icon = cfg.icon;
          return (
            <div key={activity.id} className="flex gap-4 group">
              <div className={`w-9 h-9 rounded-full ${cfg.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 flex-1 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-slate-900">{activity.title}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    {activity.description && <p className="text-sm text-slate-500">{activity.description}</p>}
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      {activity.contactName && <span>Contact: {activity.contactName}</span>}
                      {activity.duration && <span>{activity.duration} min</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400">{formatRelativeDate(activity.createdAt)}</span>
                    <button onClick={() => deleteActivity(activity.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className="py-16 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            No activities found.
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Activity">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
            <div className="flex gap-2">
              {MANUAL_TYPES.map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${form.type === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                  {TYPE_CONFIG[t].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Contact</label>
            <select value={form.contactId} onChange={e => setForm(f => ({ ...f, contactId: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">None</option>
              {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Deal</label>
            <select value={form.dealId} onChange={e => setForm(f => ({ ...f, dealId: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">None</option>
              {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">Log Activity</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

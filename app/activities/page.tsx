"use client";

import { useState } from "react";
import { useCRM } from "@/lib/store";
import { formatRelativeDate } from "@/lib/utils";
import { Plus, Mail, Phone, Calendar, FileText, MessageSquare, Trash2 } from "lucide-react";
import Modal from "@/components/Modal";
import type { Activity, ActivityType } from "@/lib/types";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  email: { icon: Mail, color: "bg-blue-50 text-blue-600", label: "Email" },
  call: { icon: Phone, color: "bg-green-50 text-green-600", label: "Call" },
  meeting: { icon: Calendar, color: "bg-purple-50 text-purple-600", label: "Meeting" },
  note: { icon: FileText, color: "bg-gray-50 text-gray-600", label: "Note" },
  deal_created: { icon: MessageSquare, color: "bg-emerald-50 text-emerald-600", label: "Deal" },
  deal_updated: { icon: MessageSquare, color: "bg-amber-50 text-amber-600", label: "Deal Update" },
  contact_created: { icon: MessageSquare, color: "bg-indigo-50 text-indigo-600", label: "Contact" },
  task_completed: { icon: MessageSquare, color: "bg-teal-50 text-teal-600", label: "Task" },
};

const MANUAL_TYPES: ActivityType[] = ["email", "call", "meeting", "note"];

const blank = () => ({
  type: "note" as ActivityType,
  title: "",
  description: "",
  contactId: "",
  contactName: "",
  dealId: "",
  dealName: "",
});

export default function ActivitiesPage() {
  const { activities, contacts, deals, addActivity, deleteActivity } = useCRM();
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(blank());

  const sorted = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter(a => filterType === "all" || a.type === filterType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = contacts.find(c => c.id === form.contactId);
    const deal = deals.find(d => d.id === form.dealId);
    addActivity({
      ...form,
      contactName: contact ? `${contact.firstName} ${contact.lastName}` : "",
      dealName: deal?.title ?? "",
    });
    setShowModal(false);
    setForm(blank());
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
          <p className="text-sm text-gray-500 mt-0.5">{activities.length} total activities</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Log Activity
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", ...Object.keys(TYPE_CONFIG)].map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${filterType === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
            {t === "all" ? "All" : (TYPE_CONFIG[t]?.label ?? t)}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {sorted.map(activity => {
          const cfg = TYPE_CONFIG[activity.type] ?? { icon: MessageSquare, color: "bg-gray-50 text-gray-600", label: activity.type };
          const Icon = cfg.icon;
          return (
            <div key={activity.id} className="flex gap-4 group">
              <div className={`w-9 h-9 rounded-full ${cfg.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-gray-900">{activity.title}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    {activity.description && <p className="text-sm text-gray-500">{activity.description}</p>}
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      {activity.contactName && <span>Contact: {activity.contactName}</span>}
                      {activity.dealName && <span>Deal: {activity.dealName}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">{formatRelativeDate(activity.createdAt)}</span>
                    <button onClick={() => { if (confirm("Delete?")) deleteActivity(activity.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className="py-16 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            No activities yet. Log the first one!
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Log Activity" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <div className="flex gap-2">
                {MANUAL_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${form.type === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                    {TYPE_CONFIG[t].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contact</label>
              <select value={form.contactId} onChange={e => setForm(f => ({ ...f, contactId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Deal</label>
              <select value={form.dealId} onChange={e => setForm(f => ({ ...f, dealId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None</option>
                {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Log Activity</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

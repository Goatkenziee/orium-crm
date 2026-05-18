"use client";

import { useState } from "react";
import { useCRM } from "@/lib/store";
import TopBar from "@/components/TopBar";
import Modal from "@/components/Modal";
import { formatDate, initials, statusBadge, uid, CONTACT_STATUSES } from "@/lib/utils";
import type { Contact } from "@/lib/types";
import { Trash2, Pencil, Mail, Phone, Tag } from "lucide-react";

const empty: Omit<Contact, "id" | "createdAt" | "updatedAt"> = {
  firstName: "", lastName: "", email: "", phone: "",
  company: "", companyId: "", title: "", status: "lead", tags: [], notes: "",
};

export default function ContactsPage() {
  const { state, addContact, updateContact, deleteContact, addActivity } = useCRM();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState(empty);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const search = state.searchQuery.toLowerCase();
  const contacts = state.contacts.filter(c => {
    const matchSearch = !search || `${c.firstName} ${c.lastName} ${c.email} ${c.company}`.toLowerCase().includes(search);
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function openNew() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(c: Contact) {
    setEditing(c);
    setForm({ firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone, company: c.company, companyId: c.companyId, title: c.title, status: c.status, tags: c.tags, notes: c.notes });
    setOpen(true);
  }

  function save() {
    const now = new Date().toISOString();
    if (editing) {
      updateContact({ ...editing, ...form, updatedAt: now });
    } else {
      const nc: Contact = { id: uid(), ...form, createdAt: now, updatedAt: now };
      addContact(nc);
      addActivity({ id: uid(), type: "contact_created", title: `Contact added: ${form.firstName} ${form.lastName}`, description: `${form.title} at ${form.company}`, contactId: nc.id, contactName: `${form.firstName} ${form.lastName}`, createdAt: now });
    }
    setOpen(false);
  }

  const set = (field: keyof typeof form, val: string) => setForm(p => ({ ...p, [field]: val }));

  return (
    <div className="flex-1 bg-slate-50">
      <TopBar title="Contacts" subtitle={`${contacts.length} records`} action={{ label: "Add Contact", onClick: openNew }} />

      <div className="p-6">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["all", ...CONTACT_STATUSES.map(s => s.key)].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filterStatus === s ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Company</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Added</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">No contacts found</td>
                  </tr>
                )}
                {contacts.map(c => {
                  const badge = statusBadge(c.status);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {initials(c.firstName, c.lastName)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{c.firstName} {c.lastName}</p>
                            <p className="text-xs text-slate-500">{c.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{c.company || "—"}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex flex-col gap-0.5">
                          {c.email && <span className="flex items-center gap-1 text-xs text-slate-500"><Mail className="w-3 h-3" />{c.email}</span>}
                          {c.phone && <span className="flex items-center gap-1 text-xs text-slate-500"><Phone className="w-3 h-3" />{c.phone}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 hidden xl:table-cell">{formatDate(c.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteContact(c.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Contact" : "New Contact"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">First Name *</label>
              <input value={form.firstName} onChange={e => set("firstName", e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Last Name *</label>
              <input value={form.lastName} onChange={e => set("lastName", e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
              <input value={form.phone} onChange={e => set("phone", e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Company</label>
            <input value={form.company} onChange={e => set("company", e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
            <select value={form.status} onChange={e => set("status", e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {CONTACT_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={save} disabled={!form.firstName || !form.lastName} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {editing ? "Update" : "Create"} Contact
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

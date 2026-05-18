"use client";
import { useState } from "react";
import { useCRM } from "@/lib/store";
import TopBar from "@/components/TopBar";
import Modal from "@/components/Modal";
import { fullName, initials, statusColor, generateId } from "@/lib/utils";
import type { Contact, ContactStatus } from "@/lib/types";
import { Plus, Search, Pencil, Trash2, Phone, Mail, Building2 } from "lucide-react";

const STATUS_OPTIONS: ContactStatus[] = ["lead", "prospect", "customer", "churned"];
const STATUS_LABELS: Record<ContactStatus, string> = { lead: "Lead", prospect: "Prospect", customer: "Customer", churned: "Churned" };

const EMPTY: Omit<Contact, "id" | "createdAt" | "updatedAt"> = {
  firstName: "", lastName: "", email: "", phone: "", company: "", companyId: "",
  title: "", status: "lead", tags: [], notes: "", value: 0,
};

export default function ContactsPage() {
  const { state, addContact, updateContact, deleteContact } = useCRM();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<Omit<Contact, "id" | "createdAt" | "updatedAt">>(EMPTY);

  const filtered = state.contacts.filter(c => {
    const name = fullName(c).toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || c.email.includes(q) || c.company.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setShowModal(true);
  }

  function openEdit(c: Contact) {
    setEditing(c);
    const { id, createdAt, updatedAt, ...rest } = c;
    setForm(rest);
    setShowModal(true);
  }

  function handleSave() {
    const now = new Date().toISOString();
    if (editing) {
      updateContact({ ...editing, ...form, updatedAt: now });
    } else {
      addContact({ id: generateId(), ...form, createdAt: now, updatedAt: now });
    }
    setShowModal(false);
  }

  return (
    <div className="p-6 space-y-4">
      <TopBar title="Contacts" subtitle={`${filtered.length} contacts`} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div className="flex gap-1">
          {(["all", ...STATUS_OPTIONS] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${statusFilter === s ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {initials(c.firstName, c.lastName)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{fullName(c)}</p>
                      <p className="text-xs text-slate-400">{c.title}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {c.company}
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-slate-500 text-xs"><Mail className="w-3 h-3" /> {c.email}</div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs"><Phone className="w-3 h-3" /> {c.phone}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(c.status)}`}>
                    {STATUS_LABELS[c.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteContact(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">No contacts found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Contact" : "New Contact"}>
        <div className="grid grid-cols-2 gap-3">
          {[["First Name", "firstName"], ["Last Name", "lastName"], ["Email", "email"], ["Phone", "phone"], ["Company", "company"], ["Title", "title"]] .map(([label, key]) => (
            <div key={key} className={key === "email" || key === "phone" ? "col-span-2" : ""}>
              <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
              <input value={(form as Record<string, unknown>)[key] as string} onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ContactStatus })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium">
            {editing ? "Save Changes" : "Create Contact"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

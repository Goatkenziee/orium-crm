"use client";
import { useState } from "react";
import { useCRM } from "@/lib/store";
import { Contact, ContactStatus } from "@/lib/types";
import TopBar from "@/components/TopBar";
import Modal from "@/components/Modal";
import { Plus, Trash2, Edit2, Search, Mail, Phone } from "lucide-react";
import { initials } from "@/lib/utils";

const STATUS_COLORS: Record<ContactStatus, string> = {
  lead: "bg-amber-100 text-amber-700",
  prospect: "bg-blue-100 text-blue-700",
  customer: "bg-emerald-100 text-emerald-700",
  churned: "bg-slate-100 text-slate-500",
};

const EMPTY: Omit<Contact, "id" | "createdAt"> = {
  firstName: "", lastName: "", email: "", phone: "", company: "",
  title: "", status: "lead", tags: [],
};

export default function ContactsPage() {
  const { contacts, addContact, updateContact, deleteContact } = useCRM();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<Contact, "id" | "createdAt">>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = contacts.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.company}`.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() { setForm(EMPTY); setEditId(null); setModal(true); }
  function openEdit(c: Contact) {
    setForm({ firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone, company: c.company, title: c.title, status: c.status, tags: c.tags });
    setEditId(c.id);
    setModal(true);
  }
  function save() {
    if (!form.firstName || !form.email) return;
    if (editId) { updateContact(editId, form); } else { addContact(form); }
    setModal(false);
    setForm(EMPTY);
    setEditId(null);
  }

  const AVATAR_COLORS = ["from-blue-400 to-blue-600", "from-purple-400 to-purple-600", "from-emerald-400 to-emerald-600", "from-amber-400 to-amber-600", "from-pink-400 to-pink-600"];

  return (
    <div>
      <TopBar title="Contacts" subtitle={`${contacts.length} total`} />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shrink-0">
            <Plus size={16} /> Add Contact
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">No contacts found.</td></tr>
              )}
              {filtered.map((c, i) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {initials(c.firstName, c.lastName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-slate-400">{c.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-sm text-slate-700">{c.company || "—"}</span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Mail size={12} className="text-slate-400" />
                      {c.email}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"><Edit2 size={13} /></button>
                      <button onClick={() => deleteContact(c.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? "Edit Contact" : "Add Contact"}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">First Name *</label>
              <input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Last Name</label>
              <input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Phone</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as ContactStatus }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
                <option value="churned">Churned</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Company</label>
            <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Title</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={save} className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700">{editId ? "Update" : "Add"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useCRM } from "@/lib/store";
import { formatDate, avatarColor, getInitials } from "@/lib/utils";
import { Plus, Search, Trash2, Edit2, Globe, Users } from "lucide-react";
import Modal from "@/components/Modal";
import type { Company } from "@/lib/types";

const blank = (): Omit<Company, "id" | "createdAt" | "updatedAt"> => ({
  name: "", industry: "", website: "", phone: "", email: "", address: "",
  employees: 0, revenue: 0, notes: "", ownerId: "",
});

export default function CompaniesPage() {
  const { companies, contacts, addCompany, updateCompany, deleteCompany } = useCRM();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState(blank());

  const filtered = companies.filter(c =>
    `${c.name} ${c.industry} ${c.website}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(blank()); setShowModal(true); };
  const openEdit = (c: Company) => { setEditing(c); setForm({ ...c }); setShowModal(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateCompany(editing.id, form);
    else addCompany(form);
    setShowModal(false);
  };

  const field = (key: keyof typeof form, label: string, type = "text", required = false) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && " *"}</label>
      <input type={type} required={required} value={(form as any)[key] ?? ""}
        onChange={e => setForm(f => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-sm text-gray-500 mt-0.5">{companies.length} companies</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies…"
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(co => {
          const contactCount = contacts.filter(c => c.companyId === co.id || c.company === co.name).length;
          const bg = avatarColor(co.name);
          return (
            <div key={co.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center text-white font-bold text-sm`}>
                    {co.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{co.name}</div>
                    <div className="text-xs text-gray-400">{co.industry || "Unknown industry"}</div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(co)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm("Delete?")) deleteCompany(co.id); }} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-500">
                {co.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                    <a href={co.website.startsWith("http") ? co.website : `https://${co.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{co.website}</a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{contactCount} contact{contactCount !== 1 ? "s" : ""}</span>
                </div>
                {co.employees > 0 && <div className="text-xs text-gray-400">{co.employees.toLocaleString()} employees</div>}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center text-gray-400">No companies found.</div>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? "Edit Company" : "Add Company"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {field("name", "Company Name", "text", true)}
            {field("industry", "Industry")}
            {field("website", "Website")}
            <div className="grid grid-cols-2 gap-4">
              {field("phone", "Phone")}
              {field("email", "Email", "email")}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("employees", "Employees", "number")}
              {field("revenue", "Annual Revenue ($)", "number")}
            </div>
            {field("address", "Address")}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">{editing ? "Save" : "Add Company"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

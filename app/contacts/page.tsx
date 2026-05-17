"use client";
import { useState } from "react";
import { useCRM } from "@/store/crm";
import TopBar from "@/components/TopBar";
import AddContactModal from "@/components/AddContactModal";
import { Search, Trash2, Mail, Phone, Tag } from "lucide-react";
import clsx from "clsx";
import { Contact } from "@/lib/data";

const STATUS_STYLES: Record<Contact["status"], string> = {
  lead: "bg-slate-100 text-slate-600",
  prospect: "bg-blue-100 text-blue-700",
  customer: "bg-emerald-100 text-emerald-700",
  churned: "bg-red-100 text-red-600",
};

export default function ContactsPage() {
  const { contacts, deleteContact, updateContact } = useCRM();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Contact["status"]>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const selectedContact = contacts.find((c) => c.id === selected);

  return (
    <div className="flex-1 flex flex-col">
      <TopBar title="Contacts" subtitle={`${contacts.length} total contacts`} action={{ label: "Add Contact", onClick: () => setShowAdd(true) }} />
      {showAdd && <AddContactModal onClose={() => setShowAdd(false)} />}

      <div className="flex-1 flex overflow-hidden">
        {/* List */}
        <div className={clsx("flex flex-col border-r border-slate-200", selected ? "w-2/3" : "flex-1")}>
          {/* Filters */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 rounded-lg border border-transparent focus:outline-none focus:border-indigo-400 focus:bg-white" />
            </div>
            <div className="flex gap-1">
              {(["all", "lead", "prospect", "customer", "churned"] as const).map((s) => (
                <button key={s} onClick={() => setFilter(s)}
                  className={clsx("px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors",
                    filter === s ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden sm:table-cell">Company</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">Value</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden xl:table-cell">Tags</th>
                  <th className="px-4 py-3 w-16" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}
                    onClick={() => setSelected(selected === c.id ? null : c.id)}
                    className={clsx("border-b border-slate-100 cursor-pointer transition-colors",
                      selected === c.id ? "bg-indigo-50" : "hover:bg-slate-50")}>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                          <p className="text-xs text-slate-400 truncate">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-sm text-slate-600">{c.company}</p>
                      {c.role && <p className="text-xs text-slate-400">{c.role}</p>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <select value={c.status} onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateContact(c.id, { status: e.target.value as Contact["status"] })}
                        className={clsx("text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer capitalize appearance-none", STATUS_STYLES[c.status])}>
                        <option value="lead">Lead</option>
                        <option value="prospect">Prospect</option>
                        <option value="customer">Customer</option>
                        <option value="churned">Churned</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-sm font-semibold text-slate-700">${c.value.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={(e) => { e.stopPropagation(); deleteContact(c.id); }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <p className="text-lg font-semibold">No contacts found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedContact && (
          <div className="w-1/3 overflow-y-auto bg-white p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {selectedContact.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-slate-900">{selectedContact.name}</h2>
                <p className="text-sm text-slate-500">{selectedContact.role}</p>
                <p className="text-sm text-indigo-600 font-medium">{selectedContact.company}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400" />
                <a href={`mailto:${selectedContact.email}`} className="hover:text-indigo-600 truncate">{selectedContact.email}</a>
              </div>
              {selectedContact.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={14} className="text-slate-400" />
                  {selectedContact.phone}
                </div>
              )}
              {selectedContact.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-slate-400" />
                  <div className="flex flex-wrap gap-1">
                    {selectedContact.tags.map((t) => (
                      <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  <span className={clsx("text-xs font-semibold px-2 py-0.5 rounded-full capitalize mt-0.5 inline-block", STATUS_STYLES[selectedContact.status])}>
                    {selectedContact.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Lifetime Value</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">${selectedContact.value.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Added</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{selectedContact.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

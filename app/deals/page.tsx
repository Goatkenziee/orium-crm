"use client";

import { useState } from "react";
import { useCRM } from "@/lib/store";
import { formatCurrency, formatDate, stageColor, avatarColor, getInitials } from "@/lib/utils";
import { Plus, Trash2, Edit2, GripVertical, TrendingUp } from "lucide-react";
import Modal from "@/components/Modal";
import type { Deal, DealStage } from "@/lib/types";

const STAGES: { value: DealStage; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won 🎉" },
  { value: "lost", label: "Lost" },
];

const blank = (): Omit<Deal, "id" | "createdAt" | "updatedAt"> => ({
  title: "", contactId: "", contactName: "", companyId: "", companyName: "",
  stage: "lead", value: 0, currency: "USD", probability: 20,
  closeDate: new Date().toISOString().slice(0, 10), notes: "", ownerName: "Alexander",
});

export default function DealsPage() {
  const { deals, contacts, addDeal, updateDeal, deleteDeal, addActivity } = useCRM();
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [form, setForm] = useState(blank());
  const [dragging, setDragging] = useState<string | null>(null);

  const openAdd = (stage?: DealStage) => {
    setEditing(null);
    setForm({ ...blank(), stage: stage ?? "lead" });
    setShowModal(true);
  };
  const openEdit = (d: Deal) => { setEditing(d); setForm({ ...d }); setShowModal(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = contacts.find(c => c.id === form.contactId);
    const payload = { ...form, contactName: contact ? `${contact.firstName} ${contact.lastName}` : form.contactName };
    if (editing) {
      updateDeal(editing.id, payload);
      addActivity({ type: "deal_updated", title: `Deal updated: ${payload.title}`, description: `Stage: ${payload.stage} · Value: ${formatCurrency(payload.value)}`, dealId: editing.id, dealName: payload.title });
    } else {
      const created = addDeal(payload);
      addActivity({ type: "deal_created", title: `New deal: ${payload.title}`, description: `${formatCurrency(payload.value)} · ${payload.stage}`, dealId: created.id, dealName: payload.title, contactId: payload.contactId, contactName: payload.contactName });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this deal?")) deleteDeal(id);
  };

  const handleDrop = (stage: DealStage, dealId: string) => {
    updateDeal(dealId, { stage });
    setDragging(null);
  };

  const totalsByStage = STAGES.map(s => ({
    ...s,
    deals: deals.filter(d => d.stage === s.value),
    total: deals.filter(d => d.stage === s.value).reduce((sum, d) => sum + d.value, 0),
  }));

  const field = (key: keyof typeof form, label: string, type = "text", required = false) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && " *"}</label>
      <input type={type} required={required} value={(form as any)[key] ?? ""}
        onChange={e => setForm(f => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500 mt-0.5">{deals.length} deals · {formatCurrency(deals.filter(d => !["won","lost"].includes(d.stage)).reduce((s,d)=>s+d.value,0))} open pipeline</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setView("kanban")} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "kanban" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>Kanban</button>
            <button onClick={() => setView("table")} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "table" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>Table</button>
          </div>
          <button onClick={() => openAdd()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Deal
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {totalsByStage.map(({ value: stage, label, deals: stageDeals, total }) => (
            <div key={stage} className="flex-shrink-0 w-64"
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); if (dragging) handleDrop(stage, dragging); }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stageColor(stage)}`}>{label}</span>
                  <span className="text-xs text-gray-400 ml-2">{stageDeals.length}</span>
                </div>
                <span className="text-xs font-semibold text-gray-600">{formatCurrency(total)}</span>
              </div>
              <div className="space-y-2 min-h-12">
                {stageDeals.map(deal => (
                  <div key={deal.id}
                    draggable
                    onDragStart={() => setDragging(deal.id)}
                    className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-shadow group">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{deal.title}</p>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button onClick={() => openEdit(deal)} className="p-1 rounded hover:bg-gray-100"><Edit2 className="w-3 h-3 text-gray-400" /></button>
                        <button onClick={() => handleDelete(deal.id)} className="p-1 rounded hover:bg-red-50"><Trash2 className="w-3 h-3 text-red-400" /></button>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-900 mb-2">{formatCurrency(deal.value)}</div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{deal.contactName}</span>
                      <span>{deal.probability}%</span>
                    </div>
                    {deal.closeDate && (
                      <div className="text-xs text-gray-400 mt-1">Close: {formatDate(deal.closeDate)}</div>
                    )}
                  </div>
                ))}
                <button onClick={() => openAdd(stage)} className="w-full py-2 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500 text-xs transition-colors">
                  + Add deal
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Deal</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Stage</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Value</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Prob.</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Close Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deals.map(deal => (
                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{deal.title}</td>
                  <td className="px-4 py-3 text-gray-600">{deal.contactName || "—"}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stageColor(deal.stage)}`}>{deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}</span></td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(deal.value)}</td>
                  <td className="px-4 py-3 text-gray-600">{deal.probability}%</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(deal.closeDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(deal)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(deal.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title={editing ? "Edit Deal" : "New Deal"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {field("title", "Deal Title", "text", true)}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contact</label>
              <select value={form.contactId} onChange={e => setForm(f => ({ ...f, contactId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select contact…</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stage</label>
              <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value as DealStage }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("value", "Value ($)", "number", true)}
              {field("probability", "Probability (%)", "number")}
            </div>
            {field("closeDate", "Close Date", "date")}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">{editing ? "Save Changes" : "Create Deal"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

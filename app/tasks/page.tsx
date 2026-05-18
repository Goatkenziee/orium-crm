"use client";
import { useState } from "react";
import { useCRM } from "@/lib/store";
import { Task, TaskStatus, TaskPriority } from "@/lib/types";
import TopBar from "@/components/TopBar";
import Modal from "@/components/Modal";
import { Plus, Trash2, Pencil, Check } from "lucide-react";

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];
const STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};
const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-emerald-100 text-emerald-700",
};

const EMPTY: Omit<Task, "id" | "createdAt"> = {
  title: "", description: "", priority: "medium", status: "todo", dueDate: "",
};

export default function TasksPage() {
  const { tasks, contacts, deals, addTask, updateTask, deleteTask } = useCRM();
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<Omit<Task, "id" | "createdAt">>(EMPTY);

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);
  const counts = { todo: 0, in_progress: 0, done: 0 };
  tasks.forEach(t => counts[t.status]++);

  function openAdd() { setEditing(null); setForm(EMPTY); setModal(true); }
  function openEdit(t: Task) { setEditing(t); setForm({ title: t.title, description: t.description, contactId: t.contactId, dealId: t.dealId, priority: t.priority, status: t.status, dueDate: t.dueDate }); setModal(true); }
  function save() {
    if (!form.title) return;
    if (editing) updateTask(editing.id, form);
    else addTask(form);
    setModal(false);
  }
  function toggleDone(t: Task) {
    updateTask(t.id, { status: t.status === "done" ? "todo" : "done" });
  }

  return (
    <div>
      <TopBar title="Tasks" subtitle={`${counts.todo} todo · ${counts.in_progress} in progress · ${counts.done} done`} />
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2">
            {(["all", "todo", "in_progress", "done"] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {s === "all" ? "All" : s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}{s !== "all" ? ` (${counts[s as TaskStatus]})` : ` (${tasks.length})`}
              </button>
            ))}
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus size={16} /> Add Task
          </button>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">No tasks found.</div>
          )}
          {filtered.map(t => {
            const contact = t.contactId ? contacts.find(c => c.id === t.contactId) : null;
            const deal = t.dealId ? deals.find(d => d.id === t.dealId) : null;
            return (
              <div key={t.id} className={`bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3 hover:shadow-sm transition-shadow ${t.status === "done" ? "opacity-60" : ""}`}>
                <button
                  onClick={() => toggleDone(t)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${t.status === "done" ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 hover:border-blue-500"}`}
                >
                  {t.status === "done" && <Check size={12} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-medium text-slate-900 ${t.status === "done" ? "line-through" : ""}`}>{t.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[t.status]}`}>{t.status === "in_progress" ? "In Progress" : t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span>
                  </div>
                  {t.description && <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>}
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {t.dueDate && <span className="text-xs text-slate-400">Due {t.dueDate}</span>}
                    {contact && <span className="text-xs text-blue-500">{contact.firstName} {contact.lastName}</span>}
                    {deal && <span className="text-xs text-purple-500">{deal.title}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"><Pencil size={14} /></button>
                  <button onClick={() => deleteTask(t.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Task" : "Add Task"}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as TaskPriority }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {PRIORITIES.map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as TaskStatus }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {STATUSES.map(s => <option key={s} value={s}>{s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

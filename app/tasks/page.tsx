"use client";

import { useState } from "react";
import { useCRM } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Edit2, CheckCircle2, Circle, AlertCircle, Clock } from "lucide-react";
import Modal from "@/components/Modal";
import type { Task, TaskStatus, TaskPriority } from "@/lib/types";

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];
const STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

const priorityConfig: Record<TaskPriority, { label: string; className: string; icon: string }> = {
  low: { label: "Low", className: "text-gray-500 bg-gray-100", icon: "·" },
  medium: { label: "Medium", className: "text-blue-600 bg-blue-50", icon: "●" },
  high: { label: "High", className: "text-orange-600 bg-orange-50", icon: "▲" },
  urgent: { label: "Urgent", className: "text-red-600 bg-red-50", icon: "!!!" },
};

const blank = (): Omit<Task, "id" | "createdAt" | "updatedAt"> => ({
  title: "", description: "", status: "todo", priority: "medium",
  dueDate: "", contactId: "", contactName: "", dealId: "", dealName: "", assignedTo: "Alexander",
});

export default function TasksPage() {
  const { tasks, contacts, deals, addTask, updateTask, deleteTask, addActivity } = useCRM();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState(blank());

  const filtered = tasks.filter(t => {
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    return matchStatus && matchPriority;
  }).sort((a, b) => {
    const po: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
    return (po[a.priority] ?? 4) - (po[b.priority] ?? 4);
  });

  const openAdd = () => { setEditing(null); setForm(blank()); setShowModal(true); };
  const openEdit = (t: Task) => { setEditing(t); setForm({ ...t }); setShowModal(true); };

  const toggleDone = (t: Task) => {
    const newStatus: TaskStatus = t.status === "done" ? "todo" : "done";
    updateTask(t.id, { status: newStatus });
    if (newStatus === "done") addActivity({ type: "task_completed", title: `Task completed: ${t.title}`, description: t.description || "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = contacts.find(c => c.id === form.contactId);
    const deal = deals.find(d => d.id === form.dealId);
    const payload = {
      ...form,
      contactName: contact ? `${contact.firstName} ${contact.lastName}` : form.contactName,
      dealName: deal ? deal.title : form.dealName,
    };
    if (editing) updateTask(editing.id, payload);
    else addTask(payload);
    setShowModal(false);
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length,
    urgent: tasks.filter(t => t.priority === "urgent" && t.status !== "done").length,
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500 mt-0.5">{stats.todo} to do · {stats.in_progress} in progress · {stats.done} done</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Stats */}
      {stats.urgent > 0 && (
        <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {stats.urgent} urgent task{stats.urgent > 1 ? "s" : ""} need attention
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{priorityConfig[p].label}</option>)}
        </select>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400">No tasks found. Add one above!</div>
        )}
        {filtered.map((task, idx) => (
          <div key={task.id} className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors group ${idx > 0 ? "border-t border-gray-100" : ""}`}>
            <button onClick={() => toggleDone(task)} className="mt-0.5 flex-shrink-0 text-gray-300 hover:text-blue-500 transition-colors">
              {task.status === "done"
                ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                : <Circle className="w-5 h-5" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className={`text-sm font-medium ${task.status === "done" ? "line-through text-gray-400" : "text-gray-900"}`}>{task.title}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${priorityConfig[task.priority].className}`}>{priorityConfig[task.priority].label}</span>
                {task.status === "in_progress" && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium flex items-center gap-1"><Clock className="w-3 h-3" />In Progress</span>
                )}
              </div>
              {task.description && <p className="text-xs text-gray-500 truncate">{task.description}</p>}
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                {task.contactName && <span>@ {task.contactName}</span>}
                {task.dealName && <span>Deal: {task.dealName}</span>}
                {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {task.status !== "done" && (
                <button onClick={() => updateTask(task.id, { status: "in_progress" })} className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">Start</button>
              )}
              <button onClick={() => openEdit(task)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => { if (confirm("Delete?")) deleteTask(task.id); }} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? "Edit Task" : "New Task"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {PRIORITIES.map(p => <option key={p} value={p}>{priorityConfig[p].label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
              <input type="date" value={form.dueDate || ""} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Linked Contact</label>
              <select value={form.contactId} onChange={e => setForm(f => ({ ...f, contactId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">{editing ? "Save" : "Add Task"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

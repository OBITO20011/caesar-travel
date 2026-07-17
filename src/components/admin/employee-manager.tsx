import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Loader2, Plus, Trash2, UserRoundCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { employeesService } from "@/services/admin";
import type { Employee, EmployeeRole } from "@/types/admin";

const roleLabels: Record<EmployeeRole, string> = {
  admin: "مدير النظام",
  manager: "مدير",
  staff: "موظف",
};

type EmployeeForm = {
  email: string;
  name: string;
  role: EmployeeRole;
  active: boolean;
  permissions: Record<string, boolean>;
};

const emptyForm: EmployeeForm = {
  email: "",
  name: "",
  role: "staff",
  active: true,
  permissions: { trips: true, bookings: true, gallery: false, settings: false },
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "تعذر إكمال العملية.";
}

export function EmployeeManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState<EmployeeForm>(emptyForm);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const employeesQuery = useQuery({
    queryKey: ["admin-employees"],
    queryFn: employeesService.getAll,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-employees"] });

  const saveMutation = useMutation({
    mutationFn: () =>
      editing ? employeesService.update(editing.id, form) : employeesService.create(form),
    onSuccess: async () => {
      await refresh();
      setDialogOpen(false);
      setEditing(null);
      setFeedback(editing ? "تم تحديث بيانات الموظف." : "تمت إضافة الموظف.");
    },
    onError: (error) => setFormError(errorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: employeesService.delete,
    onSuccess: async () => {
      await refresh();
      setFeedback("تم حذف سجل الموظف.");
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });

  function createEmployee() {
    setEditing(null);
    setForm({ ...emptyForm, permissions: { ...emptyForm.permissions } });
    setFormError(null);
    setDialogOpen(true);
  }

  function editEmployee(employee: Employee) {
    setEditing(employee);
    setForm({
      email: employee.email,
      name: employee.name,
      role: employee.role,
      active: employee.active,
      permissions: employee.permissions ?? {},
    });
    setFormError(null);
    setDialogOpen(true);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (!form.name.trim() || !form.email.trim()) {
      setFormError("الاسم والبريد الإلكتروني مطلوبان.");
      return;
    }
    saveMutation.mutate();
  }

  const employees = employeesQuery.data ?? [];

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_24%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 md:p-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:flex-row md:items-end md:justify-between md:p-8">
          <div>
            <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100">
              فريق الإدارة
            </Badge>
            <h1 className="text-3xl font-black text-slate-900">إدارة المستخدمين</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              إدارة ملفات الموظفين والأدوار وصلاحيات الوصول إلى أقسام نظام المحتوى.
            </p>
          </div>
          <Button
            onClick={createEmployee}
            className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            إضافة موظف
          </Button>
        </header>

        {feedback ? (
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-right text-sm text-sky-700"
          >
            {feedback}
          </button>
        ) : null}

        <Card className="overflow-hidden border-none bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <CardContent className="p-0">
            {employeesQuery.isLoading ? (
              <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جاري تحميل الموظفين...
              </div>
            ) : employeesQuery.isError ? (
              <div className="p-8 text-center text-sm text-rose-600">
                {errorMessage(employeesQuery.error)}
              </div>
            ) : employees.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-500">
                لا توجد سجلات موظفين بعد.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">الموظف</th>
                      <th className="px-5 py-4 font-medium">الدور</th>
                      <th className="px-5 py-4 font-medium">الصلاحيات</th>
                      <th className="px-5 py-4 font-medium">الحالة</th>
                      <th className="px-5 py-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="text-slate-700">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-slate-100 p-2 text-slate-500">
                              <UserRoundCheck className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{employee.name}</p>
                              <p className="text-xs text-slate-500" dir="ltr">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">{roleLabels[employee.role]}</td>
                        <td className="px-5 py-4">
                          <div className="flex max-w-xs flex-wrap gap-1">
                            {Object.entries(employee.permissions ?? {})
                              .filter(([, allowed]) => allowed)
                              .map(([permission]) => (
                                <Badge key={permission} variant="secondary">
                                  {permission}
                                </Badge>
                              ))}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            className={
                              employee.active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }
                          >
                            {employee.active ? "نشط" : "موقوف"}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => editEmployee(employee)}
                              aria-label="تعديل"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-rose-600"
                              onClick={() => {
                                if (window.confirm(`حذف سجل ${employee.name}؟`))
                                  deleteMutation.mutate(employee.id);
                              }}
                              aria-label="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle>{editing ? "تعديل الموظف" : "إضافة موظف"}</DialogTitle>
            <DialogDescription>
              هذا السجل يحدد الدور وصلاحيات CMS، بينما بيانات تسجيل الدخول تُدار عبر Supabase Auth.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">الاسم</span>
              <Input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">البريد الإلكتروني</span>
              <Input
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">الدور</span>
              <select
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value as EmployeeRole })}
                className="h-9 rounded-md border border-input bg-white px-3"
              >
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="grid gap-2 rounded-xl border border-slate-200 p-3">
              <legend className="px-1 text-sm font-medium">الصلاحيات</legend>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ["trips", "الرحلات"],
                  ["bookings", "الحجوزات"],
                  ["gallery", "المعرض"],
                  ["settings", "الإعدادات"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(form.permissions[key])}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          permissions: { ...form.permissions, [key]: event.target.checked },
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm({ ...form, active: event.target.checked })}
              />
              الحساب نشط
            </label>
            {formError ? (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="bg-slate-900 text-white"
              >
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                حفظ الموظف
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useGetIdentity, useNotification } from "@refinedev/core";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/services/apiService";
import { authService } from "@/services/auth/authService";
import { userService } from "@/services/user/userService";
import type { RegisterRequest } from "@/types/auth/authTypes";
import type { UserResponse } from "@/types/user/userTypes";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  WAITER: "Garçom",
  KITCHEN: "Cozinheiro",
};
const isAdminLevel = (role: string) => role === "ADMIN" || role === "MANAGER";
const emptyForm: RegisterRequest = { name: "", email: "", password: "", role: "WAITER" };
const selectClass = "h-10 rounded-xl border border-input bg-background px-3 text-sm";

async function errorMessage(error: unknown): Promise<string> {
  if (error instanceof ApiError) {
    const body = await error.response.text().catch(() => "");
    if (error.status === 409) return body || "Este e-mail já está cadastrado.";
    if (error.status === 403) return body || "Você não tem permissão para esta operação.";
    if (error.status === 422) return body || "Dados inválidos.";
  }
  return "Não foi possível concluir. Tente novamente.";
}

export const UsersPage = () => {
  const { open } = useNotification();
  const { data: me } = useGetIdentity<UserResponse>();
  const [users, setUsers] = useState<UserResponse[] | null>(null);
  const [form, setForm] = useState<RegisterRequest>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fail = useCallback(
    async (error: unknown) => open?.({ type: "error", message: await errorMessage(error) }),
    [open],
  );
  const load = useCallback(() => {
    userService.getAll().then(setUsers).catch(fail);
  }, [fail]);
  useEffect(load, [load]);

  // Only the global admin may create or manage administrators (the API enforces the same rule).
  const roleOptions = me?.root ? ["ADMIN", "WAITER", "KITCHEN"] : ["WAITER", "KITCHEN"];
  const canManage = (user: UserResponse) => !user.root && (me?.root || !isAdminLevel(user.role));

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await authService.register(form);
      open?.({ type: "success", message: `Usuário ${form.name} criado.` });
      setForm(emptyForm);
      load();
    } catch (error) {
      await fail(error);
    } finally {
      setSaving(false);
    }
  };

  const changeRole = async (user: UserResponse, role: string) => {
    try {
      await userService.update(user.id, { name: user.name, email: user.email, role });
      open?.({ type: "success", message: `${user.name} agora é ${roleLabels[role]}.` });
    } catch (error) {
      await fail(error);
    }
    load();
  };

  const remove = async (user: UserResponse) => {
    if (!window.confirm(`Excluir o usuário ${user.name}?`)) return;
    try {
      await userService.delete(user.id);
      open?.({ type: "success", message: `Usuário ${user.name} excluído.` });
      load();
    } catch (error) {
      await fail(error);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] space-y-6 p-4 sm:p-6">
      <header>
        <p className="text-sm text-muted-foreground">Crie acessos e defina o papel de cada pessoa.</p>
        <h1 className="font-heading text-3xl font-bold">Usuários</h1>
      </header>

      <Card>
        <CardHeader><CardTitle>Novo usuário</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={create} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nome</Label>
              <Input id="user-name" required value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">E-mail</Label>
              <Input id="user-email" type="email" required value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-password">Senha inicial</Label>
              <Input id="user-password" type="password" required minLength={6} value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Papel</Label>
              <select id="user-role" className={`${selectClass} w-full`} value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}>
                {roleOptions.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
              </select>
            </div>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar usuário
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Equipe</CardTitle></CardHeader>
        <CardContent>
          {users === null ? (
            <p className="text-sm text-muted-foreground">Carregando usuários...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum usuário cadastrado.</p>
          ) : (
            <ul className="divide-y">
              {users.map((user) => (
                <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium">
                      {user.name} {user.id === me?.id && <span className="text-sm text-muted-foreground">(você)</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.root ? (
                      <Badge>Administrador global</Badge>
                    ) : canManage(user) ? (
                      <select aria-label={`Papel de ${user.name}`} className={selectClass} value={user.role}
                        onChange={(event) => changeRole(user, event.target.value)}>
                        {[...new Set([user.role, ...roleOptions])].map((role) => (
                          <option key={role} value={role}>{roleLabels[role] ?? role}</option>
                        ))}
                      </select>
                    ) : (
                      <Badge variant="secondary">{roleLabels[user.role] ?? user.role}</Badge>
                    )}
                    {canManage(user) && (
                      <Button variant="ghost" size="icon" aria-label={`Excluir ${user.name}`} onClick={() => remove(user)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

import { useState } from "react";
import { useLogin, useRefineOptions } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputPassword } from "@/components/refine-ui/form/input-password";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { title } = useRefineOptions();
  const { mutate: login, isPending } = useLogin();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[radial-gradient(circle_at_top,var(--secondary),transparent_48%)] px-6 py-8">
      <div className="text-foreground [&>svg]:h-12 [&>svg]:w-12">{title.icon}</div>
      <Card className="mt-6 w-full max-w-[456px] p-6 sm:p-10">
        <CardHeader className="px-0">
          <CardTitle className="text-3xl font-semibold text-accent-foreground">Entrar</CardTitle>
          <CardDescription>Acesse o painel administrativo.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={(event) => { event.preventDefault(); login({ email, password }); }}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <InputPassword value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <Button type="submit" size="lg" disabled={isPending} className="mt-6 w-full">
              {isPending ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

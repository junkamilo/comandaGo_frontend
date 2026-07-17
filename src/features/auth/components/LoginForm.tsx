"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login.schema";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-12 rounded-lg border-border/80 bg-background px-4 text-base shadow-none sm:h-11 sm:text-sm";

const labelClassName = "text-sm font-medium sm:text-sm";

export function LoginForm() {
  const { login, isPending, fieldErrors, reset } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!fieldErrors?.length) return;
    fieldErrors.forEach(({ field, message }) => {
      if (field === "email" || field === "password") {
        form.setError(field, { message });
      }
    });
  }, [fieldErrors, form]);

  function onSubmit(values: LoginFormValues) {
    reset();
    form.clearErrors();
    login(values);
  }

  return (
    <div
      className={cn(
        "flex min-h-full flex-col justify-center bg-background",
        "px-4 py-6 sm:px-6 md:px-8 lg:py-10",
        "pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]",
      )}
    >
      <Card
        className={cn(
          "mx-auto w-full border-border/60 bg-card/90 shadow-xl",
          "max-w-[min(100%,28rem)] rounded-2xl",
          "sm:max-w-md md:max-w-lg",
        )}
      >
        <CardHeader className="space-y-4 px-5 pb-2 pt-7 text-center sm:px-8 sm:pt-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:h-16 sm:w-16">
            <UtensilsCrossed className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
              ComandaGo
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">Iniciar sesión</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-7 sm:px-8 sm:pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={labelClassName}>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        enterKeyHint="next"
                        placeholder="tu@email.com"
                        disabled={isPending}
                        className={inputClassName}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={labelClassName}>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        enterKeyHint="go"
                        placeholder="••••••••"
                        disabled={isPending}
                        className={inputClassName}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-2 h-12 w-full rounded-lg text-base font-semibold sm:h-11 sm:text-sm"
                size="lg"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  "Ingresar"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

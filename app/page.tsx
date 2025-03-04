import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import Logo from "./ui/login/logo";

export default function LoginPage() {
  return (
    <main
      className="flex items-center justify-center md:h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/images/nairobibackgroung.jpg')` }}
    >
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-center justify-center rounded-lg bg-secondaryColor p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <Logo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

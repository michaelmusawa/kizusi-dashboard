import { headers } from "next/headers";
import GoBackAndLogin from "./ui/NotFound";
import Image from "next/image";

export default async function NotFound() {
  const headersList = headers();
  const domain = (await headersList).get("host") || "Our Site";
  // Optionally, call your data function here (e.g. getSiteData(domain))
  const data = { name: domain };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8 text-center">
        <Image
          width={1024}
          height={576}
          alt="Not found"
          src="/images/notfound.png"
        />
        <p className="mt-2 text-gray-600">
          We couldn’t find the page you were looking for on {data.name}.
        </p>
        <div className="mt-8">
          <GoBackAndLogin />
        </div>
      </div>
    </div>
  );
}

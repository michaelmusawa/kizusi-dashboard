import Image from "next/image";

export default function Logo() {
  return (
    <div className="max-w-36 h-auto m-auto max-md:max-w-20">
      <Image src="/images/logo.png" width={884} height={278} alt="logo" />
    </div>
  );
}

import React from "react";
import Image from "next/image";

const Car = () => {
  return (
    <div>
      <Image
        src="/car.svg"
        alt="Car icon"
        width={24}
        height={24}
        className="w-5 h-5"
      />
    </div>
  );
};

export default Car;

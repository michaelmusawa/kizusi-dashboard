import React from "react";
import Image from "next/image";

const Car = () => {
  return (
    <div>
      <Image
        src="/images/car.png"
        alt="Car icon"
        width={500}
        height={500}
        className="w-8 h-8"
      />
    </div>
  );
};

export default Car;

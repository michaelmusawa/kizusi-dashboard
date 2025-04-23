-- CreateTable
CREATE TABLE "PesapalMapping" (
    "merchant_reference" TEXT NOT NULL,
    "order_tracking_id" TEXT,
    "booking_id" TEXT NOT NULL,

    CONSTRAINT "PesapalMapping_pkey" PRIMARY KEY ("merchant_reference")
);

-- AddForeignKey
ALTER TABLE "PesapalMapping" ADD CONSTRAINT "PesapalMapping_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

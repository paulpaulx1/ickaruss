import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBookingsForDisplay } from "@/hooks/useBookingsForDisplay";
import { useSession } from "next-auth/react";
import PayButton from "./PayButton";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const BookingsTable = () => {
  const { data: session } = useSession();
  const { bookings, isLoading } = useBookingsForDisplay(
    session?.user?.id ?? "",
  );

  const columns: ColumnDef<(typeof bookings)[0]>[] = [
    {
      accessorKey: "vendor.businessName",
      header: "Business Name",
    },
    {
      accessorKey: "service.name",
      header: "Service Name",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => info.getValue() ?? "Unknown",
    },
    {
      accessorKey: "depositPaid",
      header: "Deposit Paid",
      cell: (info) =>
        info.getValue() ? (
          "Paid!"
        ) : bookings ? (
          <PayButton
            priceId={info.row.original.service?.depositPriceId ?? ""}
            stripeAccountId={info.row.original.vendor?.stripeAccountId ?? ""}
            bookingId={info.row.original.bookingId ?? -1}
          />
        ) : (
          "hi"
        ),
    },
    {
      accessorKey: "finalPaymentPaid",
      header: "Final Payment Paid",
      cell: (info) =>
        info.getValue() ? (
          "Paid!"
        ) : bookings ? (
          <PayButton
            priceId={info.row.original.service?.finalPaymentPriceId ?? ""}
            stripeAccountId={info.row.original.vendor?.stripeAccountId ?? ""}
            bookingId={info.row.original.bookingId ?? -1}
          />
        ) : (
          "hi"
        ),
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
    },
    {
      accessorKey: "endTime",
      header: "End Time",
    },
  ];

  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(bookings, "bookings", isLoading, "isLoading");

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="rounded-md border m-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* <Table>
      <TableCaption>Upcoming Bookings</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Business Name</TableHead>
          <TableHead>Service Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Deposit Paid</TableHead>
          <TableHead>Final Payment Paid</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.bookingId}>
            <TableCell>{booking.vendor?.businessName}</TableCell>
            <TableCell>{booking.service?.name}</TableCell>
            <TableCell>{booking.status ?? "Unknown"}</TableCell>
            <TableCell>

              {booking.depositPaid ? (
                "Paid!"
              ) : (
                'Pay Deposit'
                // <PayButton priceId={booking.depositPriceId}/>
              )}
            </TableCell>
            <TableCell>{booking.finalPaymentPaid ? "Yes" : "No"}</TableCell>
            <TableCell>{booking.date}</TableCell>
            <TableCell>{booking.startTime ?? ""}</TableCell>
            <TableCell>{booking.endTime}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table> */}
    </>
  );
};

export default BookingsTable;

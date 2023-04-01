import pool from "../../configs";
import { Request, Response } from "express";

const bookings = [
  {
    room_id: 2,
    client_id: 3,
    check_in: new Date(2023, 3, 15),
    check_out: new Date(2023, 3, 15),
    total_price: "2500000",
  },
  {
    room_id: 2,
    client_id: 3,
    check_in: new Date(2023, 3, 1),
    check_out: new Date(2023, 3, 1),
    total_price: "2500000",
  },
  {
    room_id: 3,
    client_id: 3,
    check_in: new Date(2023, 3, 1),
    check_out: new Date(2023, 3, 1),
    total_price: "2500000",
  },
];

const seederBooking = async (req: Request, res: Response) => {
  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Insert each user in parallel
    await Promise.all(
      bookings.map(async (booking) => {
        const insertValues = [
          booking.room_id,
          booking.client_id,
          booking.check_in,
          booking.check_out,
          booking.total_price,
        ];
        const insertQuery =
          "INSERT INTO bookings(room_id, client_id, check_in, check_out, total_price ) VALUES($1, $2, $3, $4, $5)";
        await pool.query(insertQuery, insertValues);
      })
    );

    // Commit the transaction
    const { rows } = await pool.query("COMMIT");
    res.status(201).json(rows);
  } catch (err) {
    console.log(err);
    // Rollback the transaction if there was an error
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Data seeding error" });
  }
};

export { seederBooking };

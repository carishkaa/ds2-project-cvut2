import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { Alert, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiURL } from "../../lib/utils";

export async function getServerSideProps(context: any) {
  try {
    let res = await fetch(`${process.env.BASE_URL}/concerts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let concerts = (await res.json())?.concerts;

    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}

export default function Index({ isConnected }: { isConnected: boolean }) {
  const [concerts, setConcerts] = useState([] as any);

  const handleDelete = async (id: string) => {
    console.log(id);
    try {
      await fetch(`${apiURL}/concerts?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setConcerts([])
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetch(`${apiURL}/concerts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ concerts }) => setConcerts(concerts))
      .catch((e) => console.error(e));
  }, [concerts]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          padding: "20px",
        }}
      >
        <h1>Symphony Orchestra Concerts</h1>
        {isConnected ? (
          <Alert severity="success">You are connected to MongoDB</Alert>
        ) : (
          <Alert severity="error">Fetching data failed</Alert>
        )}

        <Link key={"create"} href={"/concerts/create"} passHref>
          <Button variant="contained" color={"primary"}>
            {"Add new"}
          </Button>
        </Link>

        <TableContainer
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            padding: "20px",
          }}
          component={Paper}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Concert Name</TableCell>
                <TableCell align="right">Date & time</TableCell>
                <TableCell align="right">Total Capacity</TableCell>
                <TableCell align="right">Sold out</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {concerts.map((concert: any) => (
                <TableRow
                  key={concert._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {concert.name}
                  </TableCell>
                  <TableCell align="right">
                    {dayjs(concert.date).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                  <TableCell align="right">{concert.totalCapacity}</TableCell>
                  <TableCell align="right">
                    {Number(concert.totalCapacity - concert.soldCapacity) === 0
                      ? "Yes"
                      : "No"}
                  </TableCell>
                  <TableCell align="right">{concert.price}</TableCell>
                  <TableCell align="right">
                    <Link
                      key={concert._id}
                      href={`/concerts/${concert._id}`}
                      passHref
                    >
                      <Button variant="contained" color={"primary"}>
                        {"edit"}
                      </Button>
                    </Link>
                    <IconButton onClick={() => handleDelete(concert._id)}>
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

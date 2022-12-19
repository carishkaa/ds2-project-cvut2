import {
  Box,
  Button,
  Checkbox,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { apiURL } from "../../lib/utils";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export async function getServerSideProps(context: any) {
  try {
    let res = await fetch(`${apiURL}/musicians`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const allMusicians = (await res.json())?.musicians.map((musician: any) => ({
      value: musician._id,
      label: `${musician.name.first} ${musician.name.last} (${
        musician.instrument ?? musician.role
      })`,
    }));

    return {
      props: {
        isConnected: true,
        allMusicians: allMusicians ? allMusicians : [],
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}

export default function Index({
  allMusicians,
}: {
  allMusicians?: any;
}) {
  const router = useRouter();
  const [concert, setConcert] = useState({} as any);

  useEffect(() => {
    if (router.query.id !== "create") {
      fetch(`${apiURL}/concerts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) =>
          json.concerts.find((concert: any) => concert._id === router.query.id)
        )
        .then((concert) =>
          setConcert({
            name: concert.name,
            date: dayjs(concert.date),
            duration: concert.duration,
            price: concert.price,
            program: concert.program,
            soldCapacity: concert.soldCapacity,
            totalCapacity: concert.totalCapacity,
            musicians: concert.musicians,
          })
        )
        .catch((e) => console.error(e));
    } else {
      setConcert({});
    }
  }, [router.query.id]);

  let submitForm = async (e: any) => {
    e.preventDefault();
    if (router.query.id !== "create") {
      await fetch(`${apiURL}/concerts?id=${router.query.id}`, {
        method: "PUT",
        body: JSON.stringify(concert),
      });
    } else {
      await fetch(`${apiURL}/concerts`, {
        method: "POST",
        body: JSON.stringify(concert),
      });
    }
    router.push("/concerts");
  };

  return (
    <>
      Edit
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          component="form"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          noValidate
          autoComplete="off"
        >
          <Stack spacing={3}>
            <TextField
              required
              fullWidth
              id="name"
              label="Name"
              value={concert.name}
              onChange={(e) => setConcert({ ...concert, name: e.target.value })}
              variant="filled"
              defaultValue={" "}
            />
            <DateTimePicker
              label="Date"
              value={concert.date}
              onChange={(newValue: Dayjs | null) => {
                setConcert({ ...concert, date: newValue });
              }}
              renderInput={(params) => (
                <TextField {...params} variant="filled" />
              )}
            />
            <TextField
              required
              id="duration"
              label="Duration (minutes)"
              value={concert.duration}
              onChange={(e) =>
                setConcert({ ...concert, duration: Number(e.target.value) })
              }
              type="number"
              variant="filled"
            />
            <TextField
              required
              id="capacity"
              label="Capacity"
              value={concert.totalCapacity}
              onChange={(e) =>
                setConcert({
                  ...concert,
                  totalCapacity: Number(e.target.value),
                })
              }
              type="number"
              variant="filled"
            />
            <TextField
              required
              id="price"
              label="Ticket Price"
              value={concert.price}
              onChange={(e) =>
                setConcert({ ...concert, price: Number(e.target.value) })
              }
              type="number"
              variant="filled"
            />

            <InputLabel id="musicians-label">Musicians</InputLabel>
            <Select
              labelId="musicians-label"
              id="musicians-select"
              multiple
              value={concert.musicians ?? []}
              onChange={(e) =>
                setConcert({ ...concert, musicians: e.target.value })
              }
              input={<OutlinedInput label="Musicians" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {allMusicians.map((m: any) => (
                <MenuItem key={m.value} value={m.value}>
                  {/* {concert.musicians ?? <Checkbox checked={concert.musicians.indexOf(m.value)} />} */}
                  <ListItemText primary={m.label} />
                </MenuItem>
              ))}
            </Select>

            <Button variant="contained" color={"primary"} onClick={submitForm}>
              {"Save"}
            </Button>
          </Stack>
        </Box>

        {JSON.stringify(concert)}
        {JSON.stringify(allMusicians)}
      </LocalizationProvider>
    </>
  );
}

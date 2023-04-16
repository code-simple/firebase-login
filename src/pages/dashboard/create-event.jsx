import React, { useEffect, useState } from "react";
import Layout from "@/src/layout/dashboard/Layout";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import Cross from "@/src/assets/cross";
import DataTable from "react-data-table-component";
import {
  doc,
  Timestamp,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/src/components/config/firebase";
import { v4 as uuidv4 } from "uuid";
import LoadingSVG from "@/src/assets/loading";

Create_Event.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
const defaultValues = {
  description: "",
  date: new Date(),
};

export default function Create_Event() {
  const [user] = useAuthState(auth);
  const [events, setEvents] = useState([]);

  const schema = Yup.object().shape({
    // date: Yup.date().typeError("Incorrect value").required("Date is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.date().required("Date is Required"),
  });

  const {
    handleSubmit,
    register,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const deleteRow = async (uuid) => {
    await deleteDoc(doc(db, "events", uuid));
    allEvents();
  };

  const columns = [
    {
      name: "DESCRIPTION",
      selector: (row) => row?.description,
      sortable: true,
      width: "70%",
    },
    {
      name: "DATE",
      selector: (row) => row.created_on?.toDate().toDateString(),
      sortable: true,
    },

    {
      name: "ACTION",
      selector: (row) => (
        <button
          onClick={() => deleteRow(row?.uuid)}
          className="text-red-600 text-xs font-bold"
        >
          Delete
        </button>
      ),
      sortable: false,
    },
  ];

  // Stripped Rows Style
  const conditionalRowStyles = [
    {
      when: (row) => parseInt(row.ID) % 2 == 0,
      style: {
        backgroundColor: "#ECEAEA",
      },
    },
  ];
  // Head Row style
  const customStyles = {
    headRow: {
      style: {
        background: "#E5E5E5",
        fontSize: "12px",
        fontWeight: "bold",
        color: "#9F9F9F",
        borderBottom: "1px solid gray",
      },
    },
  };

  //watch
  const description = watch("description");
  const date = watch("date");

  const onSubmit = async () => {
    const uuid = uuidv4();
    await setDoc(doc(db, "events", uuid), {
      uuid,
      createdBy: user.email,
      description,
      created_on: Timestamp.fromDate(date),
    });
    allEvents();
  };

  const allEvents = async () => {
    const ref = collection(db, "events");
    const q = query(ref, where("createdBy", "==", user.email));
    const data = await getDocs(q);
    setEvents(data.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    allEvents();
  }, []);
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold pt-14 pl-16">Events</h1>
      <div className="flex justify-center text-black/50 text-xl font-bold pt-8">
        <h1>Create an Event</h1>
      </div>
      <div className="flex justify-center pb-16 pt-14">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-md  pl-8 pb-7 "
        >
          <div className="pt-7 pb-14">
            <Link href="/dashboard/">
              <Cross />
            </Link>
          </div>
          <div>
            <label
              htmlFor="date"
              className="text-[#000000]/40 text-sm font-bold mt-8 pb-2"
            >
              Date
            </label>

            {/* Using Controller for DatePicker Because setValue doesn't work in components */}
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  placeholderText="Select date"
                  onChange={(date) => field.onChange(date)}
                  selected={field.value}
                  className="rounded-md px-7 p-2 w-[338px] text-center border-2 border-[#C4C4C4] pt-2  border-1 "
                />
              )}
            />
          </div>
          <div className="flex flex-col lg:pr-10">
            <label
              htmlFor="details"
              className="text-[#000000]/40 text-sm font-bold mt-8 pb-2"
            >
              Description
            </label>
            <textarea
              {...register("description")}
              className="   h-[127px] resize-none  w-[338px] border-2 border-[#C4C4C4] pt-2 p-2 border-1 rounded-md "
            />
            {errors.description && (
              <p className="text-red-400">{errors.description.message}</p>
            )}

            <div className="flex lg:justify-center pt-9">
              {isSubmitting ? (
                <LoadingSVG />
              ) : (
                <button className="bg-[#074279] text-white text-base font-semibold rounded-full py-2 px-36 ">
                  Create
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="flex justify-center text-black/50 text-xl font-bold py-14">
        <h1>Event History</h1>
      </div>
      {/* Event History Table */}
      <div className="px-14 pb-14">
        <DataTable
          columns={columns}
          data={events}
          conditionalRowStyles={conditionalRowStyles}
          customStyles={customStyles}
        />
      </div>
    </div>
  );
}

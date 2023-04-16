import React, { useEffect, useState } from "react";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuthState } from "react-firebase-hooks/auth";
// layout
import Layout from "@/src/layout/dashboard/Layout";
import Radio from "@/src/components/Radio";
import Tick from "@/src/assets/tick";
import CrossRed from "@/src/assets/cross-red";
import Employees from "@/src/contents/dashboard/data";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/src/components/config/firebase";
import { Timestamp } from "firebase/firestore";

Attendence.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default function Attendence() {
  const [user] = useAuthState(auth);
  const [filterValue, setFilterValue] = useState("");

  const [employees, setEmployees] = useState([]);
  const [surname, setSurname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [department, setDepartment] = useState("");
  const [endDate, setEndDate] = useState(null);

  // const [attendence, setAttendence] = useState("");

  const getDocuments = async () => {
    try {
      const empRef = collection(db, "employees");
      const employeesQuery = query(empRef, where("createdBy", "==", user.uid));
      const data = await getDocs(employeesQuery);
      setEmployees(data.docs.map((doc) => doc.data()));
    } catch (error) {
      console.log(error);
    }
  };
  // const changeAttendance = async (uuid, attendance) => {
  //   try {
  //     await updateDoc(doc(db, "employees", uuid), {
  //       attendence: attendance,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // Filter by Date
  const handleDate = async () => {
    // handleDate execute on Calender close, if Calander open/close without
    // selecting date then enddate will be null so it cause errors , after all
    // operation set endDate to null
    if (endDate === null) return;
    const empRef = collection(db, "employees");
    const q = query(
      empRef,
      where("created_on", "<=", Timestamp.fromDate(endDate)),
      where("createdBy", "==", user.uid)
    );
    await getDocs(q).then((resp) => {
      setEmployees(resp.docs.map((doc) => doc.data()));
      console.log(resp.docs.map((doc) => doc.data()));
    });

    setEndDate(null);
  };
  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div className="grid px-4 lg:px-14 pt-14">
      <div className="grid md:flex justify-between">
        <h1 className="text-base lg:text-2xl font-bold">Attendance Tracker</h1>
        <div className="grid md:flex gap-2 md:gap-5 rounded-md ">
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="rounded-md  p-2 text-center"
            placeholder="Filter by name"
          />
          <DatePicker
            selected={endDate}
            onCalendarClose={handleDate}
            onChange={(date) => setEndDate(date)}
            className="rounded-md p-2 text-center"
            placeholderText="12-01-2019"
          />
        </div>
      </div>
      <div className="relative overflow-x-auto grid">
        <table className="pt-7 border-separate border-spacing-y-2  ">
          <thead className="text-[#9F9F9F] text-center border-spacing-x-5 md:text-left font-semibold text-base">
            <tr>
              <td>PERSONAL DETAILS</td>
              <td>DEPARTMENT</td>
              <td>ACTION</td>
              <td>STATUS</td>
            </tr>
          </thead>

          <tbody className="text-base">
            {employees
              .filter((employee) =>
                // Filtereing by surname and firstname
                (employee.surname + employee.firstname)
                  .toLowerCase()
                  .includes(filterValue.toLowerCase())
              )
              .map((obj) => {
                return (
                  <tr key={obj.uuid} className="bg-white">
                    <td>
                      <p className="py-4 lg:pl-5">
                        {obj.surname + " " + obj.firstname}
                      </p>
                    </td>
                    <td>
                      <p>{obj.department}</p>
                    </td>
                    <td>
                      <div className="flex gap-1 lg:gap-14">
                        <Radio
                          id={`present-${obj.uuid}`}
                          name={`attendence-${obj.uuid}`}
                          value={obj.attendence}
                          label="Present"
                          checked={obj.attendence === "present"}
                          onChange={() => {}}
                        />
                        <Radio
                          id={`absent-${obj.uuid}`}
                          name={`attendence-${obj.uuid}`}
                          value={obj.attendance}
                          label="Absent"
                          checked={obj.attendence === "absent"}
                          onChange={() => {}}
                        />
                      </div>
                    </td>
                    <td className="pl-5 text-center">
                      <p>
                        {obj.attendence == "present" ? <Tick /> : <CrossRed />}
                      </p>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="flex md:justify-center pt-1 md:pt-10 pb-3 lg:pb-10">
        <Link
          href="#"
          className="bg-[#074279] py-2 px-5 md:py-3 lg:px-16 rounded-full text-white text-sm font-bold "
        >
          <span>Submit Attendance Tracker</span>
        </Link>
      </div>
    </div>
  );
}

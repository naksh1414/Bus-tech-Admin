// components

import CardTable from "components/Cards/CardTable.js";
import { useState, useEffect } from "react";
import axios from "axios";
// layout for page

import Admin from "layouts/Admin.js";

export default function Tables() {
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("table Component rendered");

  const fetchBuses = async () => {
    try {
      console.log1("fetching buses");
      const response = await axios.get(
        "https://ql9ww8rp-3030.inc1.devtunnels.ms/api/buses/available"
      );
      console.log("Response:", response.data);
      if (!response.ok) {
        throw new Error("Failed to fetch buses");
      }
      const data = await response.json();
      console.log(data);
      setBuses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable
            color="dark"
            buses={buses}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </>
  );
}

Tables.layout = Admin;

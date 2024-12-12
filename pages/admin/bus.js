import { useState, useEffect } from "react";
import CardTable from "components/Cards/CardTable.js";
import axios from "axios";
import Admin from "layouts/Admin.js";
import { FaBusAlt } from "react-icons/fa";
export default function Bus() {
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Bus Component rendered");

  const fetchBuses = async () => {
    try {
      console.log("Fetching buses...");
      setIsLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const response = await axios.get(
        "https://ql9ww8rp-8080.inc1.devtunnels.ms/api/buses/all",
        config
      );

      console.log("API Response:", response.data);
      setBuses(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching buses:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");
    fetchBuses();

    return () => {
      console.log("Component cleanup");
    };
  }, []);

  console.log("Current buses state:", buses);

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable
            buses={buses}
            isLoading={isLoading}
            error={error}
            icon={<FaBusAlt></FaBusAlt>}
          />
        </div>
      </div>
    </>
  );
}

Bus.layout = Admin;

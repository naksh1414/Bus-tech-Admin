import { useState, useEffect } from "react";
import StaffCard from "components/Cards/StaffCard";
import axios from "axios";
import Admin from "layouts/Admin.js";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("staff Component rendered");

  const fetchBuses = async () => {
    try {
      console.log("Fetching buses...");
      setIsLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "Bearer eyJ1IjoyMjMsImUiOjE4Mjg1MjIyNjd9LjBGAiEAq-OhxH0pz1A3FpD9oBBYAXfh5-qDqQ839xeytA0v75oCIQDzH2bPMIiAVQORjft7CrIFA37AMd0x8Voj9GqPWl4XHQ",
          // Add CORS headers
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      };

      const response = await axios.get(
        "http://localhost:3030/api/v1/staff",
        config
      );

      console.log("API Response:", response.data);
      setStaff(response.data);
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

  console.log("Current staff state:", staff);

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <StaffCard staff={staff} isLoading={isLoading} error={error} />
        </div>
      </div>
    </>
  );
}

Staff.layout = Admin;

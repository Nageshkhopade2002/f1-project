import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NextEvent from "./NextEvent";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function PublicLayout() {
  const [nextRace, setNextRace] = useState(null);

  useEffect(() => {
    const fetchNextRace = async () => {
      try {
        const response = await api.get("/schedule/2026");
        const now = new Date();
        const upcoming = response.data.filter(race => new Date(race.startDate) >= now);
        if (upcoming.length > 0) {
          setNextRace(upcoming[0]);
        }
      } catch (error) {
        console.error("Error fetching next race:", error);
      }
    };
    fetchNextRace();
  }, []);

  return (
    <>
      <Navbar />
      {/* <NextEvent race={nextRace} /> */}
      <Outlet />
      <Footer />
    </>
  );
}

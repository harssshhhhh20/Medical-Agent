import React from "react";
import HistoryList from "./_components/HistoryList";
import DoctorsAgent from "./_components/DoctorsAgent";
import NewSession from "./_components/NewSession";

function Dashboard() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Welcome to the Dashboard</h2>
        <NewSession/>
      </div>
      <HistoryList />
      <DoctorsAgent/>
    </div>
  );
}

export default Dashboard;

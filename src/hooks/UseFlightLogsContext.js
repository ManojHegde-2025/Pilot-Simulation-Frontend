import {useContext } from "react";
import { FlightLogsContext } from "../context/FlightLogsContext";

export const useFlightLogsContext = () => {
    const context = useContext(FlightLogsContext);
    if (!context) {
        throw new Error("useFlightLogsContext must be used within a FlightLogsContextProvider");
    }
    return context;
}
import { useState } from "react";
import RoundTripFlightSearchForm from "./components/RoundTripFlightSearchForm";
import TabsContainer from "./components/TabsContainer";
import Layout from "./pages/layout";

function App() {
  const [startBooking, setStartBooking] = useState(false);
  return (
    <Layout>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Welcome to AirBooking</h2>
        <p className="mb-2">Find and book flights with ease.</p>
        <p className="mb-2">Search from thousands of destinations.</p>
        {!startBooking && (
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            onClick={() => setStartBooking(true)}
          >
            Start Booking
          </button>
        )}
        {startBooking && <TabsContainer />}
      </div>
    </Layout>
    // <div className="min-h-screen bg-gray-100 py-10 px-4">
    //   <FlightSearchForm />
    // </div>
  );
}

export default App;

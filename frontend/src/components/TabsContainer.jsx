import React, { useEffect, useState } from "react";
import OneWayFlightSearchForm from "./OneWayFlightSearchForm";
import RoundTripFlightSearchForm from "./RoundTripFlightSearchForm";
import ToggleTab from "./sub-component/ToggleTab";
import TravelClassSelector from "./sub-component/TravelClassSelector";
import Itinerary from "./sub-component/Itinerary";

const TabsContainer = () => {
  const [activeTab, setActiveTab] = useState("one-way");
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [flightItineraries, setFlightItineraries] = useState(null);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    travelers: 1,
    travelClass: travelClass,
  });

  useEffect(() => setFlightItineraries([]), [activeTab]);

  return (
    <>
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="flex flex-wrap items-center justify-between border-b border-gray-300 mb-4">
          <ToggleTab activeTab={activeTab} setActiveTab={setActiveTab} />
          <TravelClassSelector
            travelClass={travelClass}
            setTravelClass={setTravelClass}
          />
        </div>

        <div>
          {activeTab === "one-way" && (
            <OneWayFlightSearchForm
              travelClass={travelClass}
              setFlightItineraries={setFlightItineraries}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {activeTab === "round-trip" && (
            <RoundTripFlightSearchForm
              travelClass={travelClass}
              setFlightItineraries={setFlightItineraries}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
      </div>
      <div className="pt-4">
        {flightItineraries &&
          Array.isArray(flightItineraries.data) &&
          flightItineraries.data.length === 0 && (
            <div className="border rounded-2xl shadow-md p-6 bg-white">
              <div className="flex justify-center items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  No flight itineraries available
                </h2>
              </div>
              <div className="flex justify-center items-center mt-4">
                <span className="text-sm font-medium text-gray-500">
                  We couldn't find any flights for your search criteria. Try
                  adjusting your filters or check back later.
                </span>
              </div>
            </div>
          )}
        {flightItineraries && flightItineraries.data && (
          <div className="space-y-6">
            {flightItineraries.data.map((offer, index) => (
              <Itinerary
                key={index}
                index={index}
                offer={offer}
                flightItineraries={flightItineraries}
                travelClass={travelClass}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TabsContainer;

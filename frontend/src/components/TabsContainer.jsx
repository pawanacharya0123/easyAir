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
        {flightItineraries && flightItineraries.data && (
          <div className="space-y-6">
            {flightItineraries.data.map((offer, index) => (
              <Itinerary
                offer={offer}
                index={index}
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

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

function PublicTransitStops() {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [map, setMap] = useState(null); // State to hold reference to the map

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        // Fetch stops
        const stopsCollection = await getDocs(collection(db, "stops2"));
        const stopsData = stopsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStops(stopsData);

        // Fetch routes
        const routesCollection = await getDocs(collection(db, "routes"));
        const routesData = routesCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRoutes(routesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const upcomingRoutes = routes
    .filter((route) => {
      // Filter routes based on their scheduled time
      // For demonstration, let's assume routes are scheduled in the next 2 hours
      const scheduledTime = new Date(route.scheduled_time);
      return scheduledTime > currentTime && scheduledTime - currentTime <= 7200000; // 2 hours in milliseconds
    })
    .sort((a, b) => {
      // Sort routes by scheduled time
      return new Date(a.scheduled_time) - new Date(b.scheduled_time);
    })
    .slice(0, 5); // Take the first 5 upcoming routes

  const renderUpcomingRoutes = () => {
    // Filter routes based on their scheduled time
    const filteredRoutes = routes.filter((route) => {
      const scheduledTime = new Date(route.scheduled_time);
      return scheduledTime > currentTime && scheduledTime - currentTime <= 7200000; // 2 hours in milliseconds
    });

    // Sort filtered routes by scheduled time
    const sortedRoutes = filteredRoutes.sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));

    // Take the first 5 upcoming routes
    const upcomingRoutes = sortedRoutes.slice(0, 5);

    if (upcomingRoutes.length === 0) {
      return <p>No routes available</p>;
    }

    return upcomingRoutes.map((route) => (
      <div key={route.id}>
        <p>Route Name: {route.route_name}</p>
        <p>Scheduled Time: {new Date(route.scheduled_time).toLocaleTimeString()}</p>
        {/* Add other route information here */}
      </div>
    ));
  };

  const renderMarkers = () => {
    return stops.map((stop) => (
      <div
        key={stop.id}
        lat={parseFloat(stop.stop_lat)}
        lng={parseFloat(stop.stop_lon)}
        style={{
          color: "white",
          background: "blue",
          padding: "5px",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute", // Ensure proper positioning of the marker
          zIndex: 1, // Ensure the marker is above the map
        }}
      >
        {stop.stop_name}
      </div>
    ));
  };

  // Calculate bounds for highlighted routes
  const calculateBounds = () => {
    if (map && upcomingRoutes.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      upcomingRoutes.forEach((route) => {
        route.coordinates.forEach((coordinate) => {
          bounds.extend(coordinate);
        });
      });
      map.fitBounds(bounds);
    }
  };

  return (
    <Container>
       <div className="text-center mt-3 ">
        <h2 className="text-uppercase p-2 page-title">Public Transit Stops</h2>
        </div>
      <Row>
        <Col md={8}>
          <div style={{ height: "80vh", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyBDDCT1y6vpC4jJ3_LGzRnMF6OclbkDEfU", // Replace with your Google Maps API key
              }}
              defaultCenter={{ lat: 41.9028, lng: 12.4964 }}
              defaultZoom={10}
              yesIWantToUseGoogleMapApiInternals // Allow access to Google Maps API internals
              onGoogleApiLoaded={({ map }) => {
                setMap(map);
                calculateBounds();
              }}
            >
              {renderMarkers()}
            </GoogleMapReact>
          </div>
        </Col>
        <Col md={4}>
          <h2 className="mt-3">Upcoming Routes Information</h2>
          {renderUpcomingRoutes()}
        </Col>
      </Row>
    </Container>
  );
}

export default PublicTransitStops;

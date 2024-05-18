import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

function PublicTransitStops() {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [map, setMap] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);

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

        // Fetch shapes
        const shapesCollection = await getDocs(collection(db, "shapes2"));
        const shapesData = shapesCollection.docs.map((doc) => ({
          id: doc.id,
          shapeId: doc.data().shape_id,
          lat: doc.data().shape_pt_lat,
          lng: doc.data().shape_pt_lon,
        }));
        setShapes(shapesData);
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
      const scheduledTime = new Date(route.scheduled_time);
      return scheduledTime > currentTime && scheduledTime - currentTime <= 7200000; // 2 hours in milliseconds
    })
    .sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time))
    .slice(0, 5);

  const renderUpcomingRoutes = () => {
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
          position: "absolute",
          zIndex: 1,
        }}
      >
        {stop.stop_name}
      </div>
    ));
  };

  // Suppress ESLint warning for 'google' variable
  /* eslint-disable no-undef */
  const renderShapes = () => {
    if (mapsApi && map && shapes) {
      if (google && google.maps && google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        shapes.forEach((shape) => {
          new google.maps.marker.AdvancedMarkerElement({
            position: { lat: parseFloat(shape.lat), lng: parseFloat(shape.lng) },
            map,
            title: shape.shapeId
          });
        });
      } else {
        console.error("Error: google.maps.marker.AdvancedMarkerElement is not available.");
      }
    } else {
      console.error("Error: Necessary dependencies are not available.");
    }
  };
  
  
  /* eslint-enable no-undef */
  
  const calculateBounds = () => {
    if (map && mapsApi && upcomingRoutes.length > 0) {
      const bounds = new mapsApi.LatLngBounds();
      upcomingRoutes.forEach((route) => {
        route.coordinates.forEach((coordinate) => {
          bounds.extend(new mapsApi.LatLng(coordinate.lat, coordinate.lon));
        });
      });
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    if (mapsApi && map) {
      renderShapes();
      calculateBounds();
    }
  }, [mapsApi, map, shapes, upcomingRoutes]);

  return (
    <Container>
      <div className="text-center mt-3">
        <h2 className="text-uppercase p-2 page-title">Public Transit Stops</h2>
      </div>
      <Row>
        <Col md={8}>
          <div style={{ height: "80vh", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: "AIzaSyBDDCT1y6vpC4jJ3_LGzRnMF6OclbkDEfU" }}
              defaultCenter={{ lat: 41.9028, lng: 12.4964 }}
              defaultZoom={10}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => {
                setMap(map);
                setMapsApi(maps);
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

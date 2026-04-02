// // import { useEffect } from "react";

// // const MapPicker = ({ onSelect }) => {

// //   useEffect(() => {

// //     const map = window.L.map("map").setView([19.0760, 72.8777], 13);

// //     window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
// //       attribution: "© OpenStreetMap"
// //     }).addTo(map);

// //     let marker;

// //     map.on("click", function (e) {

// //       const lat = e.latlng.lat;
// //       const lng = e.latlng.lng;

// //       if (marker) {
// //         map.removeLayer(marker);
// //       }

// //       marker = window.L.marker([lat, lng]).addTo(map);

// //       onSelect({ lat, lng });
// //     });

// //     return () => {
// //       map.remove();
// //     };

// //   }, []);

// //   return (
// //     <div
// //       id="map"
// //       style={{
// //         height: "300px",
// //         width: "100%",
// //         marginTop: "10px",
// //         borderRadius: "10px"
// //       }}
// //     />
// //   );
// // };

// // export default MapPicker;


// import { useEffect } from "react";

// const MapPicker = ({ onSelect }) => {

//   useEffect(() => {

//     const map = window.L.map("map").setView([19.0760, 72.8777], 13);

//     window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "© OpenStreetMap"
//     }).addTo(map);

//     let marker;

//     map.on("click", async (e) => {

//       const lat = e.latlng.lat;
//       const lng = e.latlng.lng;

//       if (marker) map.removeLayer(marker);

//       marker = window.L.marker([lat, lng]).addTo(map);

//       try {

//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//         );

//         const data = await res.json();
//         const addr = data.address || {};

//         onSelect({
//           latitude: lat,
//           longitude: lng,
//           state: addr.state,
//           district: addr.county || addr.state_district,
//           taluka: addr.suburb || addr.village || addr.town,
//           location: addr.road || addr.neighbourhood
//         });

//       } catch {
//         onSelect({ latitude: lat, longitude: lng });
//       }

//     });

//     return () => map.remove();

//   }, []);

//   return (
//     <div
//       id="map"
//       style={{
//         height: "300px",
//         width: "100%",
//         marginTop: "10px",
//         borderRadius: "10px"
//       }}
//     />
//   );
// };

// export default MapPicker;

import { useEffect, useRef, useState } from "react";

const MapPicker = ({ onSelect }) => {

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const containerRef = useRef(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    // 🔥 prevent multiple map instances
    if (mapRef.current) return;

    const map = window.L.map(containerRef.current, {
      center: [19.0760, 72.8777], // Mumbai default
      zoom: 13,
      zoomControl: true
    });

    mapRef.current = map;

    // 🌍 Tile layer
    window.L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap"
      }
    ).addTo(map);

    // 🖱️ Click handler
    map.on("click", async (e) => {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // 🔥 Remove old marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // 🔥 Add new marker
      markerRef.current = window.L.marker([lat, lng]).addTo(map);

      setLoading(true);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await res.json();
        const addr = data.address || {};

        // 🔥 Smart extraction (India optimized)
        const locationData = {
          latitude: lat,
          longitude: lng,

          state: addr.state || "",

          district:
            addr.state_district ||
            addr.county ||
            addr.city_district ||
            addr.city ||
            "",

          taluka:
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.municipality ||
            addr.city ||
            "",

          location:
            addr.road ||
            addr.neighbourhood ||
            addr.suburb ||
            addr.hamlet ||
            addr.city ||
            ""
        };

        onSelect(locationData);

      } catch (err) {
        console.error("Reverse geocode error:", err);

        // fallback (only coords)
        onSelect({
          latitude: lat,
          longitude: lng
        });
      }

      setLoading(false);
    });

    // 🧹 cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };

  }, [onSelect]);

  return (
    <div style={{ position: "relative", marginTop: "10px" }}>

      {/* 🗺️ MAP */}
      <div
        ref={containerRef}
        style={{
          height: "320px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden"
        }}
      />

      {/* 🔄 LOADING OVERLAY */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "12px"
          }}
        >
          Fetching location...
        </div>
      )}

      {/* 📍 INSTRUCTION */}
      <p style={{ marginTop: "6px", fontSize: "12px", opacity: 0.7 }}>
        Click anywhere on the map to select your exact location
      </p>

    </div>
  );
};

export default MapPicker;
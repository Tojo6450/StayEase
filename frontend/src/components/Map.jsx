// src/components/MapComponent.jsx
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// Ensure token is set (check your .env file: VITE_MAPBOX_TOKEN=...)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_DEFAULT_MAPBOX_TOKEN';

function MapComponent({ coordinates }) { // Expect coordinates prop: [lng, lat]
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    // Use a safe default center if initial coordinates are invalid
    const defaultCenter = [78.9629, 20.5937]; // India center
    const defaultZoom = 3;

    // Function to check if coordinates are valid
    const isValidCoordinates = (coords) => {
        return Array.isArray(coords) && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]);
    };

    // Initialize map on mount
    useEffect(() => {
        if (!mapboxgl.accessToken || mapboxgl.accessToken === 'YOUR_DEFAULT_MAPBOX_TOKEN') {
            console.error("Mapbox token not configured. Set VITE_MAPBOX_TOKEN in your .env file.");
            return;
        }
        if (map.current || !mapContainer.current) return; // Initialize map only once

        const initialCoords = isValidCoordinates(coordinates) ? coordinates : defaultCenter;
        const initialZoom = isValidCoordinates(coordinates) ? 9 : defaultZoom;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: initialCoords, // Use validated or default coords
            zoom: initialZoom
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add marker ONLY if initial coordinates are valid
        if (isValidCoordinates(coordinates)) {
            marker.current = new mapboxgl.Marker({ color: 'red' })
                .setLngLat(coordinates)
                .addTo(map.current);
        }

        return () => { // Cleanup on unmount
            if (map.current) {
                map.current.remove();
                map.current = null;
                marker.current = null; // Clear marker ref
            }
        };
    }, []); // Run only once on mount

    // Update map center and marker when coordinates prop changes *and is valid*
    useEffect(() => {
        // Only proceed if map exists and NEW coordinates are valid
        if (map.current && isValidCoordinates(coordinates)) {
            map.current.flyTo({ // Use flyTo for smooth transition
                 center: coordinates,
                 zoom: 9 // Zoom in when valid coordinates are received
            });

            // Update marker: remove old one if exists, add new one
            if (marker.current) {
                marker.current.remove();
            }
            marker.current = new mapboxgl.Marker({ color: 'red' })
                .setLngLat(coordinates)
                .addTo(map.current);
        }
        // Optional: Handle case where coordinates become invalid after being valid?
        // else if (map.current && marker.current) {
        //     marker.current.remove(); // Remove marker if coords become invalid
        //     marker.current = null;
        //     map.current.flyTo({ center: defaultCenter, zoom: defaultZoom }); // Go back to default view
        // }
    }, [coordinates]); // Rerun specifically when the coordinates prop changes


    return (
        <div>
            {(!mapboxgl.accessToken || mapboxgl.accessToken === 'YOUR_DEFAULT_MAPBOX_TOKEN') && (
                <p className="text-danger">Mapbox token is missing. Map cannot be displayed.</p>
            )}
            <div
                ref={mapContainer}
                className="map-container"
                style={{ height: '400px', width: '100%', borderRadius: '8px', backgroundColor: '#e0e0e0' }} // Added background color
            />
        </div>
    );
}

export default MapComponent;
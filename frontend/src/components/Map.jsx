
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN 

function MapComponent({ coordinates }) { 
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);

    const defaultCenter = [78.9629, 20.5937];
    const defaultZoom = 3;

    const isValidCoordinates = (coords) => {
        return Array.isArray(coords) && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]);
    };

    useEffect(() => {
        if (!mapboxgl.accessToken || mapboxgl.accessToken === 'YOUR_DEFAULT_MAPBOX_TOKEN') {
            console.error("Mapbox token not configured. Set VITE_MAPBOX_TOKEN in your .env file.");
            return;
        }
        if (map.current || !mapContainer.current) return; 

        const initialCoords = isValidCoordinates(coordinates) ? coordinates : defaultCenter;
        const initialZoom = isValidCoordinates(coordinates) ? 9 : defaultZoom;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: initialCoords,
            zoom: initialZoom
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        if (isValidCoordinates(coordinates)) {
            marker.current = new mapboxgl.Marker({ color: 'red' })
                .setLngLat(coordinates)
                .addTo(map.current);
        }

        return () => { 
            if (map.current) {
                map.current.remove();
                map.current = null;
                marker.current = null; 
            }
        };
    }, []); 

    useEffect(() => {
   
        if (map.current && isValidCoordinates(coordinates)) {
            map.current.flyTo({
                 center: coordinates,
                 zoom: 9 
            });

            if (marker.current) {
                marker.current.remove();
            }
            marker.current = new mapboxgl.Marker({ color: 'red' })
                .setLngLat(coordinates)
                .addTo(map.current);
        }
      
    }, [coordinates]); 


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
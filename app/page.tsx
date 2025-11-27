'use client'

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';

import { useEffect, useRef } from 'react';

// @refresh reset
export default function Home() {

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = new Map({
      layers: [
        new TileLayer({source: new OSM()}),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      target: mapRef.current,
    });

    // Cleanup function
    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return (
    <div ref={mapRef} className='map-container'></div>
  );
}

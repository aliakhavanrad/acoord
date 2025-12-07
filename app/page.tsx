'use client'

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';

import { useEffect, useRef } from 'react';
import soundService from './(services)/soundService';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';

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

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  useEffect(()=> {
    async function getVoices() {
      const voices = await soundService.getAllAcceptedVoices();
     
          for(const voice of voices){
              
              
              const feature = new Feature({
                    geometry: new Point(fromLonLat([
                                                        voice.Longitude, 
                                                        voice.Latitude
                                                        ]))
                    
              });

           
              feature.setProperties( 
                {
                    sound : voice,
                    id : voice.VoiceID
                });
            
              //this.styleService.SetPointStyle(feature, Constants.Styles[response[key].VoiceType]);
              //this.styleService.SetPointStyle(feature, Constants.Styles['Music']);

              //vectorLayer.getSource().addFeature(feature);
          }
    }

    getVoices();
  }, [])

  return (
    <div ref={mapRef} className='map-container'></div>
  );
}

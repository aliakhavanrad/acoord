"use client";

import Map from "ol/Map.js";
import View from "ol/View.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";

import { useEffect, useMemo, useRef } from "react";
import soundService from "../(services)/soundService";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

// @refresh reset
export default function Home() {
    const mapRef = useRef<HTMLDivElement>(null);

    const map = useMemo(() => {
        return new Map({
            layers: [new TileLayer({ source: new OSM() })],
            view: new View({
                center: [0, 0],
                zoom: 2,
            }),
        });
    }, []);

    const vectorLayer = useMemo(
        () =>
            new VectorLayer({
                source: new VectorSource<Feature>({
                    features: [],
                }),
            }),
        []
    );

    useEffect(() => {
        if (!mapRef.current) return;

        map.setTarget(mapRef.current);

        return () => {
            map.setTarget(undefined);
        };
    }, [map]);

    useEffect(() => {
        async function getVoices() {
            if (!vectorLayer) return;

            const source = vectorLayer.getSource();
            if (!source) return;

            const voices = await soundService.getAllAcceptedVoices();

            for (const voice of voices) {
                const feature = new Feature({
                    geometry: new Point(
                        fromLonLat([voice.Longitude, voice.Latitude])
                    ),
                });

                feature.setProperties({
                    sound: voice,
                    id: voice.VoiceID,
                });

                //this.styleService.SetPointStyle(feature, Constants.Styles[response[key].VoiceType]);
                //this.styleService.SetPointStyle(feature, Constants.Styles['Music']);

                source.addFeature(feature);
            }

            if (!map.getLayers().getArray().includes(vectorLayer)) {
                map.addLayer(vectorLayer);
            }
        }

        getVoices();
    }, [vectorLayer]);

    return <div ref={mapRef} className="map-container"></div>;
}

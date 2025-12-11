"use client";

import Map from "ol/Map.js";
import View from "ol/View.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Feature } from "ol";
import { Geometry, Point } from "ol/geom";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource, { VectorSourceEvent } from "ol/source/Vector";
import Draw from "ol/interaction/Draw";
import { Style, Icon } from "ol/style";
import { useSound, useStyle, useSelect } from "../(hooks)";
import { Voice } from "../(models)";
import { PlayerPanel } from "./PlayerPanel";

// Map constants
const MAP_START_CENTER = [53, 33];
const MAP_START_ZOOM = 2;

// Define styles for different voice types
const getVoiceTypeStyle = (voiceType: string): Style => {
    const iconMap: { [key: string]: string } = {
        "Recorded Voice": "/assets/Icons/recordedVoiceIcon.png",
        Music: "/assets/Icons/musicIcon.png",
        Podcast: "/assets/Icons/podcastIcon.png",
    };

    return new Style({
        image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            crossOrigin: "Anonymous",
            src: iconMap[voiceType] || "/assets/Icons/recordedVoiceIcon.png",
        }),
    });
};

// Upload style for drawing
const uploadStyle = new Style({
    image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        crossOrigin: "Anonymous",
        src: "/assets/Icons/recordedVoiceIcon.png",
    }),
});

// @refresh reset
export default function MapComponent() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedSound, setSelectedSound] = useState<Voice | null>(null);
    const [isPlayerPanelVisible, setIsPlayerPanelVisible] = useState(false);
    const [isUploadFormVisible, setIsUploadFormVisible] = useState(false);
    const [clickedLocation, setClickedLocation] = useState<number[] | null>(
        null
    );

    // Use custom hooks
    const { voices, getAllAcceptedVoices } = useSound();
    const { setPointStyle } = useStyle();
    const {
        select,
        selectedSound: selectedSoundFromSelect,
        init,
        clearSelection,
    } = useSelect();

    // Create map
    const map = useMemo(() => {
        return new Map({
            layers: [new TileLayer({ source: new OSM() })],
            view: new View({
                center: fromLonLat(MAP_START_CENTER),
                zoom: MAP_START_ZOOM,
            }),
        });
    }, []);

    // Create vector layers
    const vectorLayer = useMemo(
        () =>
            new VectorLayer({
                source: new VectorSource<Feature>({
                    features: [],
                }),
            }),
        []
    );

    const drawSource = useMemo(() => new VectorSource({ wrapX: false }), []);
    const drawVector = useMemo(
        () =>
            new VectorLayer({
                source: drawSource,
                style: uploadStyle,
            }),
        [drawSource]
    );

    const draw = useMemo(() => {
        return new Draw({
            source: drawSource,
            type: "Point",
            style: uploadStyle,
        });
    }, [drawSource]);

    // Mount map to DOM
    useEffect(() => {
        if (!mapRef.current) return;

        // Only set target if not already set
        if (!map.getTarget()) {
            map.setTarget(mapRef.current);
        }

        const layers = map.getLayers().getArray();
        if (!layers.includes(vectorLayer)) {
            map.addLayer(vectorLayer);
        }
        if (!layers.includes(drawVector)) {
            map.addLayer(drawVector);
        }
        // Initialize select interaction with sound callback
        init(map, (sound: Voice) => {
            setIsUploadFormVisible(false);
            setIsPlayerPanelVisible(true);
            setSelectedSound(sound);
        });

        return () => {
            map.setTarget(undefined);
        };
    }, []);

    // Load voices from API
    useEffect(() => {
        async function loadVoices() {
            try {
                const loadedVoices = await getAllAcceptedVoices();

                const source = vectorLayer.getSource();
                if (!source) return;

                source.clear();

                for (const voice of loadedVoices) {
                    const feature = new Feature({
                        geometry: new Point(
                            fromLonLat([voice.longitude, voice.latitude])
                        ),
                    });

                    feature.setProperties({
                        sound: voice,
                        id: voice.voiceID,
                    });

                    // Apply style based on voice type
                    const style = getVoiceTypeStyle(voice.voiceType);
                    setPointStyle(feature, style);

                    source.addFeature(feature);
                }
            } catch (error) {
                console.error("Failed to load voices:", error);
            }
        }

        loadVoices();
    }, [vectorLayer, getAllAcceptedVoices, setPointStyle]);

    // Handle drawn features (upload location)
    // useEffect(() => {
    //     const handleAddFeature = (evt: VectorSourceEvent<Feature<Geometry>>) => {
    //         const feature = evt.feature;
    //         if (!feature) {
    //             return;
    //         }

    //         const coords = feature?.getGeometry()?.getCoordinates();
    //         const lonLat = toLonLat(coords);

    //         setClickedLocation(lonLat);
    //         setIsPlayerPanelVisible(false);
    //         setIsUploadFormVisible(true);
    //         map.removeInteraction(draw);
    //     };

    //     drawSource.on('addfeature', handleAddFeature);

    //     return () => {
    //         drawSource.un('addfeature', handleAddFeature);
    //     };
    // }, [drawSource, map, draw]);

    // Close upload form
    const closeUploadForm = () => {
        setIsUploadFormVisible(false);
        drawSource.clear();
    };

    // Close player panel
    const closePlayerPanel = () => {
        setIsPlayerPanelVisible(false);
    };

    // Recenter map
    const recenterMap = (
        mapCenter: number[] = MAP_START_CENTER,
        zoom: number = MAP_START_ZOOM,
        isUTM: boolean = false
    ) => {
        const center = isUTM ? mapCenter : fromLonLat(mapCenter);
        map.getView().setCenter(center);
        map.getView().setZoom(zoom);
    };

    // Activate upload mode
    const activateUpload = () => {
        if (isUploadFormVisible) {
            return;
        }

        setIsPlayerPanelVisible(false);
        setIsUploadFormVisible(false);
        drawSource.clear();
        map.addInteraction(draw);
    };

    return (
        <div className="map-wrapper">
            <div ref={mapRef} className="map-container" />

            {/* Player Panel */}
            <PlayerPanel
                sound={isPlayerPanelVisible ? selectedSound : null}
                onClosed={closePlayerPanel}
                onClearSelection={clearSelection}
            />
        </div>
    );
}

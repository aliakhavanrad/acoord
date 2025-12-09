'use client';

import { useState, useCallback } from 'react';
import Select, { SelectEvent } from 'ol/interaction/Select';
import Map from 'ol/Map';
import { Voice } from '../(models)';
import { Feature } from 'ol';

export interface SelectEventCallback {
    (sound: Voice): void;
}

export const useSelect = () => {
    const [select] = useState<Select>(
        new Select({
            style: null,
            multi: true,
        })
    );
    const [selectedFeature, setSelectedFeature] = useState<Feature>();
    const [selectedSound, setSelectedSound] = useState<Voice>();

    /**
     * Initialize the selection interaction with a map
     * @param myMap - The OpenLayers map instance
     * @param onSoundSelected - Optional callback when a sound/feature is selected
     */
    const init = useCallback(
        (myMap: Map, onSoundSelected?: SelectEventCallback) => {
            myMap.addInteraction(select);

            select.on('select', (e: SelectEvent) => {
                const feature = e.target.getFeatures().getArray()[0];

                if (!feature) {
                    setSelectedFeature(undefined);
                    setSelectedSound(undefined);
                    return;
                }

                const sound = feature.getProperties().sound;

                setSelectedFeature(feature);
                setSelectedSound(sound);

                if (sound && onSoundSelected) {
                    onSoundSelected(sound);
                }
            });
        },
        [select]
    );

    /**
     * Clear current selection
     */
    const clearSelection = useCallback(() => {
        const features = select.getFeatures();
        features.clear();
        setSelectedFeature(undefined);
        setSelectedSound(undefined);
    }, [select]);

    return {
        select,
        selectedFeature,
        selectedSound,
        init,
        clearSelection,
    };
};

'use client';

import { useCallback } from 'react';
import type { Style } from 'ol/style';
import Feature from 'ol/Feature';

export const useStyle = () => {
    /**
     * Sets a dynamic style on an OpenLayers feature
     * The style scale is adjusted based on the resolution to maintain consistent appearance at any zoom level
     * @param olFeature - The OpenLayers feature to apply the style to
     * @param olStyle - The OpenLayers style to apply
     */
    const setPointStyle = useCallback((olFeature: Feature, olStyle: Style) => {
        olFeature.setStyle((feature, resolution) => {
            if (olStyle && olStyle.getImage()) {
                olStyle.getImage()?.setScale(1 / Math.pow(resolution as number, 1 / 6));
            }
            return olStyle;
        });
    }, []);

    return {
        setPointStyle,
    };
};

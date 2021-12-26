import { Ref } from 'react';
import { ImageZoomUpdateOpts } from '@rpearce/image-zoom';
export interface UseImageZoom {
    (opts?: ImageZoomUpdateOpts): {
        ref: Ref<HTMLElement>;
    };
}
declare const useImageZoom: UseImageZoom;
export default useImageZoom;

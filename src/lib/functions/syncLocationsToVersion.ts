import type { Location } from "$lib/types/location";
import { saveStatus } from "$lib/store/save";
import ENDPOINTS from '$lib/constants/api.json';

export const syncLocationsToVersion = async (from: string | null, to: string | null) => {
    if (!from || !to) return;

    const fromGameResponse = await fetch(`${ENDPOINTS.DEXAPI_LOCATION}/${from}`);
    const toGameResponse = await fetch(`${ENDPOINTS.DEXAPI_LOCATION}/${to}`);

    if (!fromGameResponse.ok || !toGameResponse.ok) {
        console.log(`Request failed for version ${from} (${fromGameResponse.ok}) or ${to} (${toGameResponse.ok})`);
        return;
    }

    const fromGame: Location = await fromGameResponse.json();
    const toGame: Location = await toGameResponse.json();

    toGame.regions.forEach(async region => {
        const fromRegion = fromGame.regions.find(reg => reg.name === region.name);
        if (!fromRegion) return;

        region.locations.forEach(async location => {
            const fromLocation = fromRegion.locations.find(loc => loc.id === location.id);
            if (!fromLocation) return;

            location.areas.forEach(async area => {
                const fromArea = fromLocation.areas.find(a => a.id === area.id);
                if (!fromArea) {
                    console.log(`area ${area.id} (${area.name}) in ${to} (${region}) was not found in ${from}. (closest: ${fromLocation.id})`);
                    return;
                }

                area.coords = fromArea.coords;

                const result = await fetch(`/api/location/version/${to}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        locationId: location?._id,
                        area: area
                    })
                });

                if (!result.ok) {
                    console.error(`area ${area.id} (${area.name}) in ${to} (${region}) was not saved.`);
                } else {
                    saveStatus.set({
                        isSuccess: true,
                        status: `Saved ${area.name}!`
                    })
                }
            })
        })
    });

    saveStatus.set({
        'isSuccess': true,
        'status': 'Save'
    })
}

// export const fixLocations = async (from: string | null) => {
//     const fromGameResponse = await fetch(`${ENDPOINTS.DEXAPI_LOCATION}/${from}`);

//     if (!fromGameResponse.ok) {
//         console.log(`Request failed for version ${from} (${fromGameResponse.ok})`);
//         return;
//     }

//     const fromGame: Location = await fromGameResponse.json();

//     fromGame.regions.forEach(async region => {
//         region.locations.forEach(async location => {
//             location.areas.forEach(async area => {
//                 if (area.coords.length === 0) return;
//                 const [tlX, tlY, trX, trY, blX, blY, brX, brY] = area.coords
//                 area.coords = [tlX, tlY, trX, trY, brX, brY, blX, blY];

//                 const result = await fetch(`/api/location/version/${from}`, {
//                     method: 'POST',
//                     body: JSON.stringify({
//                         locationId: location?._id,
//                         area: area
//                     })
//                 });

//                 if (!result.ok) {
//                     console.error(`area ${area.id} (${area.name}) in ${from} (${region}) was not saved.`);
//                 } else {
//                     saveStatus.set({
//                         isSuccess: true,
//                         status: `Saved ${area.name}!`
//                     })
//                 }
//             })
//         })
//     });

//     saveStatus.set({
//         'isSuccess': true,
//         'status': 'Save'
//     })
// }
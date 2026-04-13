/// <reference types="google.maps" />
import type { DeepReadonly } from "vue";
import { execute } from "@chiballc/utils";
import type { AsyncDataOptions } from "nuxt/app";

export type LocationCoods = {
  isAccurate: boolean;
  cood: google.maps.LatLngLiteral;
};

export async function getApproximateLocation(): Promise<LocationResult | undefined> {
  const { result: response, error } = await execute(async () => {
    if (import.meta.server && tryUseNuxtApp()) {
      const { getIpLocation } = await import("@@/shared/utils/location");
      const event = useRequestEvent();
      return getIpLocation(event);
    } else {
      return $fetch<IpapiResponse>("/api/ip-lookup");
    }
  });

  if (error || response.error) {
    console.error(error);
    return undefined;
  }

  return {
    lat: response.latitude,
    lng: response.longitude,
  };
}

export interface LocationResult extends Partial<google.maps.LatLngLiteral> {
  accuracy?: number;
}
export interface AccurateLocationOptions {
  watch?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export async function getAccurateLocation(options?: AccurateLocationOptions): Promise<DeepReadonly<LocationResult>> {
  if (import.meta.server) {
    throw createError({
      message: "Cannot get client location on server",
      status: 400,
    });
  }

  if (!navigator?.geolocation) {
    throw new Error("Your browser does not support geolocation");
  }

  const location = await new Promise<LocationResult>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      reject,
      options,
    );
  });

  if (!options?.watch) {
    return location;
  }

  const reactiveLocation = reactive(location);
  navigator.geolocation.watchPosition(
    (position) => {
      reactiveLocation.lat = position.coords.latitude;
      reactiveLocation.lng = position.coords.longitude;
      reactiveLocation.accuracy = position.coords.accuracy;
    },
    (error) => {
      console.error(error);
      $alert(error.message);
    },
    options,
  );

  return readonly(reactiveLocation);
}

export async function getLocation(options?: { aproximate?: boolean; watch?: boolean }) {
  if (import.meta.server || options?.aproximate) {
    const { result: coord } = await execute(getApproximateLocation);
    if (!coord) return undefined;
    return {
      isAccurate: false,
      cood: coord,
    };
  }

  const response = await execute(getAccurateLocation, { enableHighAccuracy: !options?.aproximate });
  if (!response.error) {
    return {
      isAccurate: true,
      cood: response.result,
    };
  }

  const { error, result } = await execute(getApproximateLocation);
  if (error) {
    $alert("Unable to obtain your location");
    return undefined;
  }

  return {
    isAccurate: false,
    cood: result!,
  };
}

type LocationOptions = {
  /** @deprecated use default */
  initial?: LocationCoods;
  accurate?: boolean;
  default?: LocationCoods["cood"];
  watch?: boolean;
};

type WithDefaultReturnType<T extends LocationOptions> = T extends { default: object }
  ? LocationCoods
  : LocationCoods | undefined;

export default function useCoords<T extends LocationOptions>(
  options?: MaybeRefOrGetter<T>,
  dataOptions?: AsyncDataOptions<WithDefaultReturnType<T>>,
) {
  const getPos = async (options?: T) => {
    const pos = await (async function () {
      const loc =
        options?.initial ||
        (await getLocation({
          aproximate: !options?.accurate,
        }));
      if (!loc) return undefined;

      if (!loc.isAccurate && options?.accurate) {
        if (import.meta.server) {
          return undefined;
        }

        // TODO: Block until user allows or cancels the dialog
        $alert("Please allow the website to get your location for correctness");
        return await getLocation({ aproximate: false, watch: options.watch });
      }

      return loc;
    })();

    if (!pos && options?.default) {
      return {
        isAccurate: false,
        cood: options.default,
      };
    }

    return pos as WithDefaultReturnType<T>;
  };

  return useAsyncData("useCoords", () => getPos(toValue(options)), {
    ...dataOptions,
    watch: [() => toValue(options), ...(dataOptions?.watch || [])],
  });
}

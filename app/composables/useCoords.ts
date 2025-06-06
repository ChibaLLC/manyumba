export type LocationCoods = {
  isAccurate: boolean;
  cood: google.maps.LatLngLiteral;
};

export async function getApproximateLocation(): Promise<google.maps.LatLngLiteral | undefined> {
  const { result: response, error } = await execute(
    (async function () {
      if (import.meta.server) {
        const event = useRequestEvent();
        return await getIpLocation(event!);
      } else {
        // @ts-ignore
        return await $fetch("/api/ip-lookup");
      }
    })()
  );

  // @ts-expect-error
  if (error || response.error) {
    console.error(error);
    return undefined;
  }

  return {
    // @ts-expect-error
    lat: response.latitude,
    // @ts-expect-error
    lng: response.longitude,
  };
}

export async function getAccurateLocation(): Promise<google.maps.LatLngLiteral> {
  if (import.meta.server) {
    throw createError({
      message: "Cannot get client location on server",
      status: 400,
    });
  }

  return new Promise((resolve, reject) => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, reject);
    } else {
      reject("Your browser does not support golocation");
    }
  });
}

export async function getLocation(options?: { aproximate?: boolean }) {
  if (import.meta.server || options?.aproximate) {
    const coord = await getApproximateLocation();
    if (!coord) return undefined;
    return {
      isAccurate: false,
      cood: coord,
    };
  }

  const response = await execute(getAccurateLocation());
  if (!response.error) {
    return {
      isAccurate: true,
      cood: response.result,
    };
  }

  const { error, result } = await execute(getApproximateLocation());
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
  initial?: LocationCoods;
  accurate?: boolean;
  default?: LocationCoods["cood"];
};

type WithDefaultReturnType<T extends LocationOptions> = T extends { default: object }
  ? LocationCoods
  : LocationCoods | undefined;

export default async function useCoords<T extends LocationOptions>(options?: T): Promise<WithDefaultReturnType<T>> {
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

      $alert("Please allow the website to get your location for correctness");
      return await getLocation({ aproximate: false });
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
}

import type { JSFunction, MaybePromise, SetItem } from "@chiballc/types";
import { consola } from "Consola";
import { execute, keys } from "@chiballc/utils";

// inexhaustive
export type GoogleMapsComponent = {
  core: google.maps.CoreLibrary;
  maps: google.maps.MapsLibrary;
  maps3d: google.maps.Maps3DLibrary;
  places: google.maps.PlacesLibrary;
  geocoding: google.maps.GeocodingLibrary;
  routes: google.maps.RoutesLibrary;
  marker: google.maps.MarkerLibrary;
  geometry: google.maps.GeometryLibrary;
  elevation: google.maps.ElevationLibrary;
  streetView: google.maps.StreetViewLibrary;
  journeySharing: google.maps.JourneySharingLibrary;
  visualization: google.maps.VisualizationLibrary;
  // airQuality: google.maps.AirQualityLibrary;
  // addressValidation: google.maps.AddressValidationLibrary;
};

export class GoogleMapsNotInWindowError extends Error {
  constructor() {
    super("Google maps was not found in global scope, maybe the library was not loaded");
  }
}

const console = consola.withTag("useGoogleMaps");
export default function () {
  const config = useRuntimeConfig();
  const loadingLibrary = useState("googleMapsLoading", () => true);
  const map = useState("googleMapInstance", () => shallowRef<InstanceType<typeof google.maps.Map>>());
  const loaded = computed(() => !loadingLibrary.value)
  const {
    onLoaded: onScriptLoaded,
    load,
    onError,
  } = useScript(
    {
      src: `https://maps.googleapis.com/maps/api/js?key=${config.public.google.maps.key}&v=weekly&solution_channel=GMP_CCS_geolocation_v2&loading=async`,
      async: true,
      defer: true,
    },
    {
      use() {
        return window.google && window.google.maps;
      },
      bundle: true,
    },
  );

  onMounted(() => {
    onScriptLoaded(() => {
      loadingLibrary.value = false;
    });
  });

  const libCache: Partial<Record<keyof GoogleMapsComponent, Promise<GoogleMapsComponent[keyof GoogleMapsComponent]>>> =
    {};

  /**
   * @throws {GoogleMapsNotInWindowError}
   */
  function getLibrary<K extends keyof GoogleMapsComponent>(lib: K): Promise<GoogleMapsComponent[K]> {
    const payback = () => {
      if (!window.google.maps) {
        throw new GoogleMapsNotInWindowError();
      }

      if (libCache[lib]) {
        return libCache[lib] as Promise<GoogleMapsComponent[K]>;
      }

      const libPromise = window.google.maps.importLibrary(lib) as Promise<GoogleMapsComponent[K]>;
      libCache[lib] = libPromise;
      return libPromise;
    };

    if (!loadingLibrary.value) {
      return payback();
    }

    return new Promise<GoogleMapsComponent[K]>((resolve, reject) => {
      watch(
        loadingLibrary,
        async () => {
          const value = await payback().catch(reject);
          if (value) {
            resolve(value);
          }
        },
        { once: true },
      );
    });
  }

  /**
   * @throws {GoogleMapsNotInWindowError}
   */
  async function getComponent<G extends keyof GoogleMapsComponent, K extends keyof GoogleMapsComponent[G]>(
    lib: G,
    key: K,
  ) {
    const library = await getLibrary(lib);
    return library[key];
  }

  const listeners: {
    click?: Set<JSFunction<MaybePromise<void>, google.maps.MapMouseEvent>>;
  } = {};

  function setUpMapListeners() {
    if (!map.value) {
      console.error("Map not initialised");
      return;
    }

    for (const key of keys(listeners)) {
      map.value.addListener(key, (e: any) => {
        listeners[key]?.forEach(async (func) => {
          const { error } = await execute(func, e);
          if (error) {
            console.error("[callback error] - key:", error);
          }
        });
      });
    }
  }

  /**
   * @throws {GoogleMapsNotInWindowError, TypeError}
   */
  async function initMap<T extends HTMLElement>(
    element: T,
    options?: google.maps.MapOptions & { callback?: JSFunction },
  ) {
    if (!import.meta.client) {
      console.warn("Init map was called - not on the client");
      return;
    }

    const GoogleMap = await getComponent("maps", "Map");
    if (!element) {
      throw TypeError("An invalid argument was passed for map initialisation");
    }

    map.value = new GoogleMap(element, options);
    setUpMapListeners();
    return map.value;
  }

  return {
    reload: load,
    onLoaded(
      callback: JSFunction<void, [maps: typeof google.maps, error: undefined] | [maps: undefined, error: Error]>,
    ) {
      const payback = () => {
        if (!window.google.maps) {
          callback(undefined, new GoogleMapsNotInWindowError());
        }
        callback(window.google.maps, undefined);
      };

      if (!loaded) {
        payback();
      }

      watch(loaded, payback, { once: true });
    },
    onError,
    getLibrary,
    getComponent,
    loadingLibrary: readonly(loadingLibrary),
    map: shallowReadonly(map),
    initMap,
    on<K extends keyof typeof listeners>(event: K, callback: SetItem<(typeof listeners)[K]>) {
      if (!listeners[event]) {
        listeners[event] = new Set();
      }

      listeners[event].add(callback);
    },
    off<K extends keyof typeof listeners>(event: K, callback: SetItem<(typeof listeners)[K]>) {
      if (!listeners[event]) {
        console.warn("No such event");
        return;
      }

      listeners[event].delete(callback);
    },
    loaded
  };
}

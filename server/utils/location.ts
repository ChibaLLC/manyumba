import type { H3Event } from "h3";

export type IpapiResponse = OneOf<[IpapiError, IpapiSuccess]>;

export interface IpapiSuccess {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: null;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

export interface IpapiError {
  ip: string;
  error: boolean;
  reason: string;
  reserved: boolean;
  version: string;
}

export interface IpiFy {
  ip: string;
}

async function cleanIp(ip: string) {
  // TODO: Investigate why we need to clean IPv6 addresses like ::ffff:102.220.xxx.xxx
  const cleanIp = ip.replace(/^.*:/, "");
  if (cleanIp === "127.0.0.1") {
    const { result, error } = await execute($fetch<IpiFy>("https://api.ipify.org/?format=json"));
    if (!error) {
      return result.ip;
    } else {
      console.warn("Unable to get external IP");
    }
  }

  return cleanIp;
}

export async function getIpLocation(event?: H3Event): Promise<IpapiResponse> {
  if (!event) {
    event = useEvent();
  }

  if (typeof getRequestHeader === "undefined") {
    const {getRequestHeader} = (await import("h3"));
    var ip = getRequestHeader(event, "x-forwarded-for") || event.node.req.socket.remoteAddress;
  } else {
    // This will change in prod because of reverse proxy
    var ip = getRequestHeader(event, "x-forwarded-for") || event.node.req.socket.remoteAddress;
  }
  if (!ip) {
    throw createError({
      status: 500,
      message: "Unable to obtain this request's IP address",
    });
  }
  const cleanedIp = await cleanIp(ip);
  return proxyRequest(event, `https://ipapi.co/${cleanedIp}/json/`);
}

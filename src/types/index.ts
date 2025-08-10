export interface Area {
  name: string;
  parts?: string[];
  locals?: string[];
}

export interface Regions {
  regions: {
    luzon: Area[];
    visayas: Area[];
    mindanao: Area[];
  };
}

export interface WindSignals {
  signals: {
    [key: string]: Regions;
  };
}

export interface CycloneInfo extends WindSignals {
  name: string | null;
  internationalName: string | null;
}

export interface BulletinData {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  dateIssued: string | null;
  dateIssuedISO: string | null;
  dateValidUntil: string | null;
  dateValidUntilISO: string | null;
  cyclone: CycloneInfo;
}

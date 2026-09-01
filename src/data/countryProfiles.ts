export interface CountryProfile {
  popularity: number;
  youthCompetition: number;
  coachingQuality: number;
  facilityQuality: number;
  internationalExposure: number;
  technicalBias: Partial<Record<string, number>>;
}

export const countryProfiles: Record<string, CountryProfile> = {
  MAS: { popularity: 90, youthCompetition: 85, coachingQuality: 75, facilityQuality: 78, internationalExposure: 82, technicalBias: { footwork: 2, drive: 2 } },
  INA: { popularity: 95, youthCompetition: 90, coachingQuality: 82, facilityQuality: 80, internationalExposure: 88, technicalBias: { netPlay: 3, drive: 3, reverse: 2 } },
  CHN: { popularity: 92, youthCompetition: 95, coachingQuality: 94, facilityQuality: 92, internationalExposure: 90, technicalBias: { footwork: 3, receive: 2 } },
  JPN: { popularity: 88, youthCompetition: 84, coachingQuality: 86, facilityQuality: 90, internationalExposure: 85, technicalBias: { reverse: 2, receive: 2 } },
  DEN: { popularity: 75, youthCompetition: 78, coachingQuality: 88, facilityQuality: 86, internationalExposure: 90, technicalBias: { clear: 2, smash: 2 } },
  KOR: { popularity: 84, youthCompetition: 86, coachingQuality: 87, facilityQuality: 84, internationalExposure: 86, technicalBias: { drive: 2, reverse: 2 } },
  IND: { popularity: 78, youthCompetition: 72, coachingQuality: 70, facilityQuality: 68, internationalExposure: 80, technicalBias: { smash: 2 } },
  THA: { popularity: 82, youthCompetition: 76, coachingQuality: 72, facilityQuality: 70, internationalExposure: 78, technicalBias: { netPlay: 2, dropShot: 2 } },
  TPE: { popularity: 86, youthCompetition: 83, coachingQuality: 84, facilityQuality: 82, internationalExposure: 84, technicalBias: { footwork: 2 } },
  ENG: { popularity: 68, youthCompetition: 70, coachingQuality: 76, facilityQuality: 80, internationalExposure: 82, technicalBias: { clear: 2 } },
};

export function getCountryProfile(code: string): CountryProfile {
  return countryProfiles[code] ?? countryProfiles.MAS;
}

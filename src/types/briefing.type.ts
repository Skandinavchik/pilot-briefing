export interface BriefingFormData {
  reportTypes: {
    metar: boolean
    sigmet: boolean
    taf: boolean
  }
  stations: string
  countries: string
}

export interface BriefingResponse {
  id: string
  error: null | string
  result: BriefingResult[]
}

export interface BriefingResult {
  placeId: string
  queryType: string
  receptionTime: string
  reportTime: string
  reportType: string
  stationId: string
  text: string
  textHTML: string
}

export interface GroupedBriefingResult {
  stationId: string
  reports: BriefingResult[]
}

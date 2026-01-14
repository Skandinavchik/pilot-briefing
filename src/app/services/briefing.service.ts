import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

export interface BriefingFormData {
  reportTypes: {
    metar: boolean
    sigmet: boolean
    taf: boolean
  }
  stations: string
  countries: string
}

@Injectable({
  providedIn: 'root',
})
export class BriefingService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = 'https://ogcie.iblsoft.com/ria/opmetquery'

  getBriefing(formData: BriefingFormData): Observable<unknown> {
    const selectedReportTypes: string[] = []

    if (formData.reportTypes.metar) selectedReportTypes.push('METAR')
    if (formData.reportTypes.sigmet) selectedReportTypes.push('SIGMET')
    if (formData.reportTypes.taf) selectedReportTypes.push('TAF_LONGTAF')

    const requestBody = {
      id: 'query01',
      method: 'query',
      params: [
        {
          id: 'briefing01',
          reportTypes: selectedReportTypes,
          stations: this.parseCodeList(formData.stations),
          countries: this.parseCodeList(formData.countries),
        },
      ],
    }

    return this.http.post(this.apiUrl, requestBody)
  }

  private parseCodeList(input: string): string[] {
    return input
      ? input
        .split(' ')
        .map(s => s.trim())
        .filter(s => s.length > 0)
      : []
  }
}

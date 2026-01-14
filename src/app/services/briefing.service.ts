import { HttpClient } from '@angular/common/http'
import { Injectable, inject, signal } from '@angular/core'
import { Observable, finalize } from 'rxjs'

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

  isLoading = signal(false)
  queryCounter = signal('00')

  getBriefing(formData: BriefingFormData): Observable<unknown> {
    this.handleQueryCounter()
    const selectedReportTypes: string[] = []

    if (formData.reportTypes.metar) selectedReportTypes.push('METAR')
    if (formData.reportTypes.sigmet) selectedReportTypes.push('SIGMET')
    if (formData.reportTypes.taf) selectedReportTypes.push('TAF_LONGTAF')

    const requestBody = {
      id: `query${this.queryCounter()}`,
      method: 'query',
      params: [
        {
          id: `briefing${this.queryCounter()}`,
          reportTypes: selectedReportTypes,
          stations: this.parseCodeList(formData.stations),
          countries: this.parseCodeList(formData.countries),
        },
      ],
    }

    this.isLoading.set(true)
    return this.http.post(this.apiUrl, requestBody).pipe(finalize(() => this.isLoading.set(false)))
  }

  private parseCodeList(input: string): string[] {
    return input
      ? input
        .split(' ')
        .map(s => s.trim())
        .filter(s => s.length > 0)
      : []
  }

  private handleQueryCounter() {
    this.queryCounter.update(counter => {
      const newCounter = +counter + 1
      if (newCounter < 10) return `0${newCounter}`
      return `${newCounter}`
    })
  }
}

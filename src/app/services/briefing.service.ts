import { HttpClient } from '@angular/common/http'
import { Injectable, inject, signal } from '@angular/core'
import { Observable, finalize } from 'rxjs'
import { BriefingFormData, BriefingResponse, BriefingResult, GroupedBriefingResult } from '../../types/briefing.type'
import { formatInTimeZone } from 'date-fns-tz'
import { sk } from 'date-fns/locale'

@Injectable({
  providedIn: 'root',
})
export class BriefingService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = 'https://ogcie.iblsoft.com/ria/opmetquerya'

  isLoading = signal(false)
  queryCounter = signal('00')

  getBriefing(formData: BriefingFormData): Observable<BriefingResponse> {
    const requestBody = this.handleRequestBody(formData)

    this.isLoading.set(true)
    return this.http
      .post<BriefingResponse>(this.apiUrl, requestBody)
      .pipe(finalize(() => this.isLoading.set(false)))
  }

  groupResultsByStation(results: BriefingResult[]): GroupedBriefingResult[] {
    const grouped = new Map<string, BriefingResult[]>()

    for (const result of results) {
      const stationId = result.stationId
      const current = grouped.get(stationId) ?? []
      current.push({
        ...result,
        reportTime: this.formatReportDate(result.reportTime),
      })
      grouped.set(stationId, current)
    }

    return Array.from(grouped.entries()).map(([stationId, reports]) => ({
      stationId,
      reports,
    }))
  }

  private formatReportDate(dateString: string): string {
    return formatInTimeZone(dateString, 'Europe/Bratislava', 'd. M. yyyy HH:mm', { locale: sk })
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

  private handleRequestBody(formData: BriefingFormData) {
    this.handleQueryCounter()
    const selectedReportTypes: string[] = []

    if (formData.reportTypes.metar) selectedReportTypes.push('METAR')
    if (formData.reportTypes.sigmet) selectedReportTypes.push('SIGMET')
    if (formData.reportTypes.taf) selectedReportTypes.push('TAF_LONGTAF')

    return {
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
  }
}

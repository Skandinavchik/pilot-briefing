import { Component, computed, input } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { BriefingResult } from '../../types/briefing.type'

@Component({
  selector: 'app-briefing-table',
  imports: [MatTableModule],
  templateUrl: './briefing-table.html',
})
export class BriefingTable {
  data = input.required<BriefingResult[] | null>()
  error = input<string | null>(null)

  protected readonly groupedData = computed(() => {
    const data = this.data()
    if (!data) return []

    const groups = new Map<string, BriefingResult[]>()
    for (const report of data) {
      const station = report.stationId
      const current = groups.get(station) ?? []
      current.push(report)
      groups.set(station, current)
    }

    return Array.from(groups.entries()).map(([stationId, reports]) => ({
      stationId,
      reports,
    }))
  })

  formatReportText(text: string): string {
    return text.replace(/(BKN|FEW|SCT)(\d{3})/g, (match, _, height) => {
      const heightValue = parseInt(height, 10)
      const colorClass = heightValue <= 30 ? 'text-blue-600' : 'text-red-600'
      return `<span class="${colorClass}">${match}</span>`
    })
  }
}

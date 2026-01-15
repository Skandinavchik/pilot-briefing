import { Component, computed, input } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { BriefingResult, GroupedBriefingResult } from '../../types/briefing.type'

@Component({
  selector: 'app-briefing-table',
  imports: [MatTableModule],
  templateUrl: './briefing-table.html',
})
export class BriefingTable {
  data = input.required<GroupedBriefingResult[]>()

  // Flatten the grouped data for the table
  // We need rows for Stations (headers) and rows for Reports (items)
  tableData = computed(() => {
    const flattened: (GroupedBriefingResult | BriefingResult)[] = []
    for (const group of this.data()) {
      flattened.push(group) // Station header row
      flattened.push(...group.reports) // Report items
    }
    return flattened
  })

  // Helper to check if row is a group header
  isGroup(index: number, item: GroupedBriefingResult | BriefingResult): boolean {
    return 'reports' in item
  }

  formatReportText(text: string): string {
    return text.replace(/(BKN|FEW|SCT)(\d{3})/g, (match, _, height) => {
      const heightValue = parseInt(height, 10)
      const colorClass = heightValue <= 30 ? 'text-blue-600' : 'text-red-600'
      return `<span class="${colorClass}">${match}</span>`
    })
  }
}

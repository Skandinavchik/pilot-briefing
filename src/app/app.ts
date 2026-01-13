import { DatePipe } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { BriefingForm } from './briefing-form/briefing-form'
import { BriefingCriteria, BriefingResult, BriefingService } from './briefing.service'

@Component({
  selector: 'app-root',
  imports: [BriefingForm, DatePipe],
  templateUrl: './app.html',
})
export class App {
  private briefingService = inject(BriefingService)

  protected readonly title = signal('Pilot Briefing App')
  protected readonly results = signal<BriefingResult[]>([])

  protected onSearch(criteria: BriefingCriteria): void {
    this.briefingService.getBriefing(criteria).subscribe({
      next: data => this.results.set(data),
      error: err => {
        console.error(err)
        alert('Failed to fetch briefing data.')
      },
    })
  }

  protected get groupedResults(): [string, BriefingResult[]][] {
    const data = this.results()
    const groups = new Map<string, BriefingResult[]>()
    data.forEach(item => {
      const key = item.stationId
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(item)
    })
    return Array.from(groups.entries())
  }
}

import { Component, signal } from '@angular/core'
import { BriefingForm } from './briefing-form/briefing-form'
import { BriefingTable } from './briefing-table/briefing-table'
import { GroupedBriefingResult } from '../types/briefing.type'

@Component({
  selector: 'app-root',
  imports: [BriefingForm, BriefingTable],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Pilot Briefing App')
  protected readonly briefingData = signal<GroupedBriefingResult[]>([])
}

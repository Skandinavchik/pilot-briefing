import { Component, signal } from '@angular/core'
import { BriefingForm } from './briefing-form/briefing-form'

@Component({
  selector: 'app-root',
  imports: [BriefingForm],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Pilot Briefing App')
}

import { Component, DestroyRef, inject, output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { GroupedBriefingResult } from '../../types/briefing.type'
import { atLeastOneLocation, atLeastOneSelected } from '../../validators/briefing-form.validators'
import { BriefingService } from '../services/briefing.service'

@Component({
  selector: 'app-briefing-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './briefing-form.html',
})
export class BriefingForm {
  private readonly formBuilder = inject(FormBuilder)
  private readonly destroyRef = inject(DestroyRef)
  public readonly briefingService = inject(BriefingService)

  briefingData = output<GroupedBriefingResult[]>()

  briefingForm = this.formBuilder.nonNullable.group(
    {
      reportTypes: this.formBuilder.nonNullable.group(
        {
          metar: [false],
          sigmet: [false],
          taf: [false],
        },
        { validators: atLeastOneSelected() },
      ),
      stations: ['', [Validators.pattern(/^([A-Z]{4})( [A-Z]{4})*$/)]],
      countries: ['', [Validators.pattern(/^([A-Z]{2})( [A-Z]{2})*$/)]],
    },
    { validators: atLeastOneLocation() },
  )

  constructor() {
    this.forceUppercase(this.briefingForm.controls.stations)
    this.forceUppercase(this.briefingForm.controls.countries)
  }

  private forceUppercase(control: FormControl<string>): void {
    control.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        const uppercased = value.toUpperCase()
        if (value !== uppercased) {
          control.setValue(uppercased, { emitEvent: false })
        }
      })
  }

  onSubmit(): void {
    if (this.briefingForm.invalid) {
      this.briefingForm.markAllAsTouched()
      return
    }

    this.briefingService
      .getBriefing(this.briefingForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          console.log('API Response:', response)
          const groupedData = this.briefingService.groupResultsByStation(response.result)
          console.log('Grouped Data:', groupedData)
          this.briefingData.emit(groupedData)
        },
        error: error => console.error('API Error:', error),
      })
  }
}

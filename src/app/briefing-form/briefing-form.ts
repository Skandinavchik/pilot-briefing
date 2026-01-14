import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
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
  public readonly briefingService = inject(BriefingService)

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
      stations: ['', [Validators.pattern(/^[A-Z]{4}( [A-Z]{4})*$/)]],
      countries: ['', [Validators.pattern(/^[A-Z]{2}( [A-Z]{2})*$/)]],
    },
    { validators: atLeastOneLocation() },
  )

  onSubmit(): void {
    if (this.briefingForm.invalid) {
      this.briefingForm.markAllAsTouched()
      return
    }

    this.briefingService.getBriefing(this.briefingForm.getRawValue()).subscribe({
      next: response => console.log('API Response:', response),
      error: error => console.error('API Error:', error),
    })
  }
}

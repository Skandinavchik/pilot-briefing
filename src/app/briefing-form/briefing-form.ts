import { Component, inject } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

const atLeastOneChecked: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return Object.values(control.value).some(v => v === true) ? null : { required: true }
}

@Component({
  selector: 'app-briefing-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './briefing-form.html',
})
export class BriefingForm {
  private readonly formBuilder = inject(FormBuilder)

  briefingForm = this.formBuilder.nonNullable.group({
    reportTypes: this.formBuilder.nonNullable.group({
      METAR: false,
      SIGMET: false,
      TAF_LONGTAF: false,
    },
    { validators: atLeastOneChecked },
    ),
    airports: [[]],
    countries: [[]],
  })

  onSubmit(): void {
    if (this.briefingForm.invalid) return
    console.log(this.briefingForm.getRawValue())
  }
}

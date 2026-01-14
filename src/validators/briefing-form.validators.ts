import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export const atLeastOneSelected = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const values = Object.values(control.value)
    const isValid = values.some(value => value === true)
    return isValid ? null : { atLeastOneSelected: true }
  }
}

export const atLeastOneLocation = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const stations = control.get('stations')?.value || ''
    const countries = control.get('countries')?.value || ''
    const isValid = stations.trim().length > 0 || countries.trim().length > 0
    return isValid ? null : { atLeastOneLocation: true }
  }
}

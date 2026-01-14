import { Component } from '@angular/core'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'

const DATA = [
  { position: 1, name: 'Hydrogen' },
  { position: 2, name: 'Helium' },
  { position: 3, name: 'Lithium' },
  { position: 4, name: 'Beryllium' },
  { position: 5, name: 'Boron' },
  { position: 6, name: 'Carbon' },
  { position: 7, name: 'Nitrogen' },
  { position: 8, name: 'Oxygen' },
  { position: 9, name: 'Fluorine' },
  { position: 10, name: 'Neon' },
]

@Component({
  selector: 'app-briefing-table',
  imports: [MatTableModule],
  templateUrl: './briefing-table.html',
})
export class BriefingTable {
  displayedColumns: string[] = ['position', 'name']
  dataSource = new MatTableDataSource(DATA)
}

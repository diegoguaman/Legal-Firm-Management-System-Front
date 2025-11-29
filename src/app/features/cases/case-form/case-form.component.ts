/**
 * Case Form Component
 * Multi-step form using Material Stepper for creating/editing cases
 */
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Case, CaseNationality } from '../../../models';
import { AppState } from '../../../store/app.state';
import { addCaseWithNationality, loadCases } from '../../../store/cases/cases.actions';
import { selectCaseById, selectCasesLoading } from '../../../store/cases/cases.selectors';
import { selectAllClients } from '../../../store/clients/clients.selectors';
import { selectCaseNationality } from '../../../store/cases/cases.selectors';

@Component({
  selector: 'app-case-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './case-form.component.html',
  styleUrl: './case-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store<AppState>);

  // Form groups for each step
  caseForm!: FormGroup;
  nationalityForm!: FormGroup;
  
  isEditMode = false;
  caseId: string | null = null;
  clientId: string | null = null;
  loading$: Observable<boolean> = this.store.select(selectCasesLoading);
  clients$ = this.store.select(selectAllClients);

  // Options
  matterOptions: Case['matter'][] = ['CIVIL', 'LABORAL', 'FAMILIAR', 'EXTRANJERIA', 'TRAFICO', 'PENAL'];
  statusOptions: Case['status'][] = ['ABIERTO', 'EN_TRAMITACION', 'RECLAMACION_PREVIA', 'JUDICIALIZADO', 'CERRADO'];
  residenceTypeOptions: CaseNationality['residence_type'][] = ['RESIDENCIA', 'ARRAIGO', 'FAMILIAR_UE', 'OTRO'];
  deleLevelOptions: CaseNationality['exam_dele_level'][] = ['A2', 'B1', 'B2', 'C1', 'C2'];
  stageOptions: CaseNationality['current_stage'][] = [
    'PRESENTADO', 'REQUERIDO', 'EN_ESTUDIO', 'RESUELTO_FAVORABLE',
    'RESUELTO_DESFAVORABLE', 'RECURSO', 'RESUELTO_RECURSO',
    'INADMITIDO_A_TRAMITE', 'DESESTIMADO', 'DEMANDA_CONTENCIOSA_ADMINISTRATIVA', 'OTRO'
  ];

  ngOnInit(): void {
    this.initializeForms();
    this.checkEditMode();
    this.checkClientFromRoute();
  }

  /**
   * Initialize form groups
   */
  private initializeForms(): void {
    // Step 1: Case basic info
    this.caseForm = this.fb.group({
      case_number: ['', [Validators.required]],
      client_id: ['', [Validators.required]],
      matter: ['EXTRANJERIA', Validators.required],
      status: ['ABIERTO', Validators.required],
      notes: ['']
    });

    // Step 2: Nationality info (only for EXTRANJERIA)
    this.nationalityForm = this.fb.group({
      father_fullname: [''],
      father_nationality: [''],
      father_doc: [''],
      mother_fullname: [''],
      mother_nationality: [''],
      mother_doc: [''],
      residence_start_year: [null, [Validators.min(1900), Validators.max(new Date().getFullYear())]],
      residence_type: ['']
    });

    // Step 3: Exams
    this.nationalityForm.addControl('exam_dele_level', this.fb.control(null));
    this.nationalityForm.addControl('exam_dele_date', this.fb.control(null));
    this.nationalityForm.addControl('exam_ccse_score', this.fb.control(null, [Validators.min(0), Validators.max(100)]));
    this.nationalityForm.addControl('exam_ccse_passed_at', this.fb.control(null));

    // Step 4: Current stage
    this.nationalityForm.addControl('submission_date', this.fb.control(null));
    this.nationalityForm.addControl('current_stage', this.fb.control(null));
    this.nationalityForm.addControl('oficina_extranjeria', this.fb.control(''));

    // Watch matter changes to show/hide nationality fields
    this.caseForm.get('matter')?.valueChanges.subscribe(matter => {
      if (matter !== 'EXTRANJERIA') {
        // Clear nationality form if not EXTRANJERIA
        this.nationalityForm.reset();
      }
    });
  }

  /**
   * Check if we're in edit mode
   */
  private checkEditMode(): void {
    this.caseId = this.route.snapshot.paramMap.get('id');
    
    if (this.caseId) {
      this.isEditMode = true;
      this.loadCaseData();
    }
  }

  /**
   * Check if client ID comes from route
   */
  private checkClientFromRoute(): void {
    this.clientId = this.route.snapshot.paramMap.get('clientId');
    
    if (this.clientId) {
      this.caseForm.patchValue({ client_id: this.clientId });
    }
  }

  /**
   * Load case data for editing
   */
  private loadCaseData(): void {
    if (!this.caseId) return;

    this.store.dispatch(loadCases());

    this.store.select(selectCaseById(this.caseId))
      .pipe(take(1))
      .subscribe(caseItem => {
        if (caseItem) {
          this.caseForm.patchValue({
            case_number: caseItem.case_number,
            client_id: caseItem.client_id,
            matter: caseItem.matter,
            status: caseItem.status,
            notes: caseItem.notes || ''
          });

          // Load nationality if exists
          if (caseItem.matter === 'EXTRANJERIA') {
            this.store.select(selectCaseNationality(this.caseId!))
              .pipe(take(1))
              .subscribe(nationality => {
                if (nationality) {
                  this.nationalityForm.patchValue({
                    father_fullname: nationality.father_fullname || '',
                    father_nationality: nationality.father_nationality || '',
                    father_doc: nationality.father_doc || '',
                    mother_fullname: nationality.mother_fullname || '',
                    mother_nationality: nationality.mother_nationality || '',
                    mother_doc: nationality.mother_doc || '',
                    residence_start_year: nationality.residence_start_year || null,
                    residence_type: nationality.residence_type || '',
                    exam_dele_level: nationality.exam_dele_level || null,
                    exam_dele_date: nationality.exam_dele_date || null,
                    exam_ccse_score: nationality.exam_ccse_score || null,
                    exam_ccse_passed_at: nationality.exam_ccse_passed_at || null,
                    submission_date: nationality.submission_date || null,
                    current_stage: nationality.current_stage || null,
                    oficina_extranjeria: nationality.oficina_extranjeria || ''
                  });
                }
              });
          }
        }
      });
  }

  /**
   * Check if nationality step should be shown
   */
  shouldShowNationalityStep(): boolean {
    return this.caseForm.get('matter')?.value === 'EXTRANJERIA';
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.caseForm.invalid) {
      return;
    }

    const caseData: Partial<Case> = {
      ...this.caseForm.value,
      id: this.caseId || this.generateId(),
      sequence_number: 1,
      opened_at: this.isEditMode ? '' : new Date().toISOString(),
      closed_at: null,
      procurador_id: null,
      created_at: this.isEditMode ? '' : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    };

    let nationalityData: CaseNationality | undefined;
    
    if (this.shouldShowNationalityStep() && this.nationalityForm.valid) {
      nationalityData = {
        case_id: caseData.id as string,
        ...this.nationalityForm.value
      };
    }

    this.store.dispatch(addCaseWithNationality({
      case: caseData as Case,
      nationality: nationalityData
    }));

    setTimeout(() => {
      this.router.navigate(['/cases']);
    }, 500);
  }

  /**
   * Cancel and go back
   */
  onCancel(): void {
    this.router.navigate(['/cases']);
  }

  /**
   * Generate case ID
   */
  private generateId(): string {
    return `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get error message for form control
   */
  getErrorMessage(formGroup: FormGroup, controlName: string): string {
    const control = formGroup.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    
    if (control?.hasError('min')) {
      return `El valor mínimo es ${control.errors?.['min'].min}`;
    }
    
    if (control?.hasError('max')) {
      return `El valor máximo es ${control.errors?.['max'].max}`;
    }
    
    return '';
  }

  /**
   * Check if a field has an error
   */
  hasError(formGroup: FormGroup, controlName: string): boolean {
    const control = formGroup.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
}


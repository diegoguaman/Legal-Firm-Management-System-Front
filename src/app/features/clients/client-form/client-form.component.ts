/**
 * Client Form Component
 * Handles creation and editing of clients using Reactive Forms
 */
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Client } from '../../../models';
import { AppState } from '../../../store/app.state';
import { addClient, updateClient, loadClients } from '../../../store/clients/clients.actions';
import { selectClientById, selectClientsLoading } from '../../../store/clients/clients.selectors';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store<AppState>);

  clientForm!: FormGroup;
  isEditMode = false;
  clientId: string | null = null;
  loading$: Observable<boolean> = this.store.select(selectClientsLoading);

  // Client type options
  clientTypes: { value: 'FISICO' | 'JURIDICO'; label: string }[] = [
    { value: 'FISICO', label: 'Físico' },
    { value: 'JURIDICO', label: 'Jurídico' }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  /**
   * Initialize the reactive form
   */
  private initializeForm(): void {
    this.clientForm = this.fb.group({
      dni_nie: ['', [Validators.required, Validators.minLength(3)]],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s-]+$/)]],
      email: ['', [Validators.email]],
      address_street: [''],
      address_city: [''],
      address_province: [''],
      address_zip: ['', [Validators.pattern(/^\d{5}$/)]],
      nationality: [''],
      client_type: ['FISICO', Validators.required]
    });
  }

  /**
   * Check if we're in edit mode and load client data
   */
  private checkEditMode(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    
    if (this.clientId) {
      this.isEditMode = true;
      this.loadClientData();
    }
  }

  /**
   * Load client data for editing
   */
  private loadClientData(): void {
    if (!this.clientId) return;

    // First, ensure clients are loaded
    this.store.dispatch(loadClients());

    // Then get the client from store
      this.store.select(selectClientById(this.clientId))
      .pipe(take(1))
      .subscribe(client => {
        if (client) {
          this.clientForm.patchValue({
            dni_nie: client.dni_nie,
            first_name: client.first_name,
            last_name: client.last_name,
            phone: client.phone || '',
            email: client.email || '',
            address_street: client.address_street || '',
            address_city: client.address_city || '',
            address_province: client.address_province || '',
            address_zip: client.address_zip || '',
            nationality: client.nationality || '',
            client_type: client.client_type
          });
        }
      });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.clientForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.clientForm.controls).forEach(key => {
        this.clientForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.clientForm.value;
    const clientData: Partial<Client> = {
      ...formValue,
      id: this.clientId || this.generateId(),
      created_at: this.isEditMode ? '' : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    };

    if (this.isEditMode && this.clientId) {
      // Update existing client
      this.store.dispatch(updateClient({ client: clientData as Client }));
    } else {
      // Create new client
      this.store.dispatch(addClient({ client: clientData as Client }));
    }

    // Navigate back to list after a short delay
    setTimeout(() => {
      this.router.navigate(['/clients']);
    }, 500);
  }

  /**
   * Cancel and go back
   */
  onCancel(): void {
    this.router.navigate(['/clients']);
  }

  /**
   * Generate a simple ID (for mock data)
   */
  private generateId(): string {
    return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get error message for a form control
   */
  getErrorMessage(controlName: string): string {
    const control = this.clientForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }
    
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    
    return '';
  }

  /**
   * Check if a field has an error
   */
  hasError(controlName: string): boolean {
    const control = this.clientForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
}


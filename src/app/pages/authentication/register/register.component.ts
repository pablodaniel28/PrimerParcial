import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent {

  formData: any = {
    name: '',
    email: '',
    password: '',
    role: '',
  };
  errorMessage: string = '';
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router
  ) {}

  async handleSubmit() {
    // Check if all fields are not empty
    if (!this.formData.name || !this.formData.email || !this.formData.password) {
      this.showError('Inserte todos los datos');
      return;
    }

    // Confirm registration with user
    const confirmRegistration = confirm('¿Confirmar registro?');
    if (!confirmRegistration) {
      return;
    }

    // Asignar automáticamente el rol si no se ha seleccionado ningún rol
    if (!this.formData.role) {
      this.formData.role = 'USER';
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró ningún token');
      }

      const response = await this.userService.register(this.formData, token);
      if (response.statusCode === 200) {
        this.router.navigate(['/dashboard']);
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }


  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = ''; // Clear the error message after the specified duration
    }, 3000);
  }

  // submit() {
  //   // console.log(this.form.value);
  //   this.router.navigate(['/dashboard']);
  // }
}

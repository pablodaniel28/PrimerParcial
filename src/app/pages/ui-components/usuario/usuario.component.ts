import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
})
export class UsuarioComponent implements OnInit {
  hidden = false;
  token: any;
  profileInfo: any;
  errorMessage: string = '';
  users: any[] = []; // Lista para almacenar los usuarios

  constructor(private readonly userService: UsersService, private readonly router: Router) {}

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No Token Found");
      }
      this.token = token; // Guardar el token para uso posterior
      this.profileInfo = await this.userService.getYourProfile(token);
      await this.loadUsers(); // Cargar los usuarios después de obtener el perfil
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  async loadUsers() {
    try {
      const response = await this.userService.getAllUsers(this.token);
      if (response && response.statusCode === 200 && response.ourUsersList) {
        this.users = response.ourUsersList;
      } else {
        this.showError('No users found.');
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }
  async deleteUser(userId: string) {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const response = await this.userService.deleteUser(userId, this.token);
        if (response && response.statusCode === 200) {
          this.users = this.users.filter(user => user.id !== userId); // Actualizar la lista de usuarios
        } else {
          this.showError('Failed to delete user.');
        }
      } catch (error: any) {
        this.showError(error.message);
      }
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}

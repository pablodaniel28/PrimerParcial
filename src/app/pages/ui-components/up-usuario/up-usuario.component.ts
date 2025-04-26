import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-up-usuario',
  templateUrl: './up-usuario.component.html',
})
export class UpUsuarioComponent implements OnInit {
  userId: any;
  userData: any = {};
  userPassword: string = '';
  errorMessage: string = '';

  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getUserById();
  }

  async getUserById() {
    this.userId = this.route.snapshot.queryParamMap.get('id'); // Obtener ID de los query params
    const token = localStorage.getItem('token');
    if (!this.userId || !token) {
      this.showError("User ID or Token is required");
      return;
    }

    try {
      const userDataResponse = await this.userService.getUsersById(this.userId, token);
      if (userDataResponse && userDataResponse.ourUsers) {
        const { name, email, role } = userDataResponse.ourUsers;
        this.userData = { name, email, role };
      } else {
        this.showError('User data not found.');
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  async updateUser() {
    const confirmUpdate = confirm("Are you sure you want to update this user?");
    if (!confirmUpdate) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Token not found");
      }

      if (this.userPassword.trim() !== '') {
        this.userData.password = this.userPassword;
      }

      console.log('Updating user with data:', this.userData);

      const res = await this.userService.updateUSer(this.userId, this.userData, token);
      console.log(res);

      if (res.statusCode === 200) {
        this.router.navigate(['/ui-components/admin/usuarios']);
      } else {
        this.showError(res.message);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}

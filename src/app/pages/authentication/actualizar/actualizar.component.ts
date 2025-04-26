import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-updateuser',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss']
})
export class ActualizarComponent implements OnInit {
  userId: any;
  userData: any = {};
  userPassword: string = ''; // Mantener la contraseña como string simple
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
    this.userId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    if (!this.userId || !token) {
      this.showError("User ID or Token is required");
      return;
    }

    try {
      let userDataResponse = await this.userService.getUsersById(this.userId, token);
      const { name, email } = userDataResponse.ourUsers;
      this.userData = { name, email };
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

      // Verificar si se ingresó una nueva contraseña
      if (this.userPassword.trim() !== '') {
        // Agregar la nueva contraseña al objeto userData antes de enviar la solicitud
        this.userData.password = this.userPassword;
      }

      // Agregar el rol al objeto userData antes de enviar la solicitud
      this.userData.role = localStorage.getItem('role');

      console.log('Updating user with data:', this.userData); // Log data before sending

      const res = await this.userService.updateUSer(this.userId, this.userData, token);
      console.log(res);

      if (res.statusCode === 200) {
        this.router.navigate(['/authentication/login']);
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

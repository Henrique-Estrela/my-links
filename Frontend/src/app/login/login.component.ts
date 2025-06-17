import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from "firebase/auth";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: User | null = null;
  isLogin: boolean = true;

  firebaseConfig = {
    apiKey: environment.apiFirebaseKey,
    authDomain: "mylist-47c5d.firebaseapp.com",
    databaseURL: "https://mylist-47c5d-default-rtdb.firebaseio.com",
    projectId: "mylist-47c5d",
    storageBucket: "mylist-47c5d.firebasestorage.app",
    messagingSenderId: "788524449781",
    appId: "1:788524449781:web:02f8905320a4c8c956eabc",
    measurementId: "G-N2E344W9V4"
  };

  app = initializeApp(this.firebaseConfig);
  db = getDatabase(this.app);
  auth = getAuth(this.app);

  loginObj: Login;

  constructor(private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });

    this.loginObj = new Login();
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.loginObj = new Login(); // limpa os campos ao alternar
  }

  registerUser() {
    const { email, password, name } = this.loginObj;

    if (!email || !password || !name) {
      Swal.fire('Atenção', 'Preencha todos os campos', 'warning');
      return;
    }

    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Atualiza o nome do usuário
        return updateProfile(user, { displayName: name }).then(() => {
          this.addUser(user);
          Swal.fire('Sucesso!', 'Usuário registrado com sucesso!', 'success');
        });
      })
      .catch((error) => {
        Swal.fire('Erro', 'Erro ao registrar usuário: ' + error.message, 'error');
      });
  }

  addUser(user: User) {
    set(ref(this.db, 'users/' + user.uid), {
      userId: user.uid,
      name: user.displayName || 'Usuário sem nome',
      email: user.email,
      createdAt: new Date().toISOString()
    })
      .then(() => {
        Swal.fire('Sucesso!', 'Usuário adicionado com sucesso!', 'success');
        this.router.navigate(['dashboard']);
      })
      .catch((error) => {
        Swal.fire('Erro', 'Erro ao adicionar usuário: ' + error.message, 'error');
      });
  }

  loginUser() {
    const { email, password } = this.loginObj;

    if (!email || !password) {
      Swal.fire('Atenção', 'Preencha todos os campos', 'warning');
      return;
    }

    signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        Swal.fire('Sucesso!', 'Login realizado com sucesso!', 'success');
        this.router.navigate(['dashboard']);
      })
      .catch((error) => {
        Swal.fire('Erro', 'Erro ao fazer login: ' + error.message, 'error');
      });
  }

  logoutUser() {
    signOut(this.auth)
      .then(() => {
        Swal.fire('Sucesso!', 'Logout realizado com sucesso!', 'success');
      })
      .catch((error) => {
        Swal.fire('Erro', 'Erro ao fazer logout: ' + error.message, 'error');
      });
  }
}

export class Login {
  name: string;
  password: string;
  lembrar: boolean;
  email: string;

  constructor() {
    this.name = '';
    this.password = '';
    this.email = '';
    this.lembrar = false;
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { Route, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: User | null = null;
  isLogin: boolean = true

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
    // Monitora o estado de autenticação
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
    this.loginObj = new Login();

  }
  toggleForm() {
    this.isLogin = !this.isLogin; // Alterna entre login e cadastro
  }

  // Registrar usuário
  registerUser() {
    if (!this.loginObj.email || !this.loginObj.password) {
      alert('Preencha todos os campos');
      return;
    }

    createUserWithEmailAndPassword(this.auth, this.loginObj.email, this.loginObj.password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert('Usuário registrado com sucesso!');
        this.addUser(user);
      })
      .catch((error) => {
        alert('Erro ao registrar usuário: ' + error.message);
      });
  }

  // Adicionar usuário no Firebase Realtime Database
  addUser(user: User) {
    set(ref(this.db, 'users/' + user.uid), {
      email: user.email,
      createdAt: new Date().toISOString()
    })
    .then(() => {
      alert('Usuário adicionado com sucesso!');
    })
    .catch((error) => {
      alert('Erro ao adicionar usuário: ' + error.message);
    });
  }

  // Login do usuário
  loginUser() {
    if (!this.loginObj.email || !this.loginObj.password) {
      alert('Preencha todos os campos');
      return;
    }

    signInWithEmailAndPassword(this.auth, this.loginObj.email, this.loginObj.password)
      .then((userCredential) => {
        alert('Login realizado com sucesso!');
        this.router.navigate(['dashboard'])
      })
      .catch((error) => {
        alert('Erro ao fazer login: ' + error.message);
      });
  }

  // Logout do usuário
  logoutUser() {
    signOut(this.auth)
      .then(() => {
        alert('Logout realizado com sucesso!');
      })
      .catch((error) => {
        alert('Erro ao fazer logout: ' + error.message);
      });
  }
}

export class Login {
  UserId: string;
  password: string;
  lembrar: boolean;
  email: string;

  constructor(){
    this.UserId = '';
    this.password = '';
    this.email = ''
    this.lembrar = false;
  }
}
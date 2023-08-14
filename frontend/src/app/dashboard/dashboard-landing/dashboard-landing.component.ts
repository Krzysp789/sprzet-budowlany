import { Component } from '@angular/core';

import { UserData } from 'src/app/core/interfaces/user-data';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-landing.component.html',
  styleUrls: []
})
export class DashboardLandingComponent {
  userData: UserData = <UserData>this.authService.userData;

  constructor(private authService: AuthService) { }
}

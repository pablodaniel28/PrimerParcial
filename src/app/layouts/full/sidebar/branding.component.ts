import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `

<div class="branding text-center">
  <a href="/" class="d-inline-block align-middle text-decoration-none text-dark">
    <!-- <img src="./assets/images/logos/favicon.png" class="m-2 align-middle" alt="logo" /> -->
    <div class="d-inline-block align-middle" style="margin-left: 12px;">
      <span style="font-size: 18px; font-weight: bold; vertical-align: middle; color: black;">DIAGRAMADOR</span>
      <br>
      <span style="font-size: 18px; font-weight: bold; vertical-align: middle; color: black;">WEB</span>

    </div>
  </a>
</div>




  `,
})
export class BrandingComponent {
  constructor() {}
}

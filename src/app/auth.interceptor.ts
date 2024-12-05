import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authToken = inject(AuthService).getToken();
  const authId = inject(AuthService).getId();
  
  if (authToken) {

    const authReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${authToken}`).set('x-User-ID' , `${authId}` )
    });

    return next(authReq);
  } else {
    
    return next(request);
  }
};
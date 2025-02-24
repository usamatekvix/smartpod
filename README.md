# Django Authentication Boilerplate

## Overview
This is a Django authentication boilerplate that integrates JWT-based authentication using **Djoser** and **Django-Allauth** for social authentication. The project is designed to be reusable and easily configurable for future Django projects.

## Features
- JWT-based authentication using **Djoser**
- API-based authentication for frontend applications
- Social authentication using **Django-Allauth**
- PostgreSQL integration
- Secure environment management with `django-environ`

## Technologies Used
- **Django** - Web framework for building robust applications
- **Djoser** - Provides authentication endpoints using Django REST Framework
- **Django-Allauth** - Handles social authentication
- **JWT (JSON Web Token)** - Token-based authentication for secure user sessions
- **PostgreSQL** - Database for storing user credentials and authentication data

## Installation
### Prerequisites
Ensure you have the following installed:
- Python 3.x
- PostgreSQL

### Setup
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd django-auth-boilerplate
   ```

2. **Create a virtual environment and activate it:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**

   In `.env` configure your database and authentication settings and give credentials.

5. **Apply migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Run the server:**
   ```bash
   python manage.py runserver
   ```

## Authentication Endpoints
### Djoser Endpoints (JWT-Based Authentication)
Djoser provides ready-to-use authentication endpoints. Some key endpoints:
- `POST /auth/jwt/create/` - Obtain a JWT token
- `POST /auth/jwt/refresh/` - Refresh JWT token
- `POST /auth/jwt/verify/` - Verify JWT token
- `POST /auth/users/` - Register a new user
- `POST /auth/users/activation/` - Activate a user
- `POST /auth/users/reset_password/` - Reset password
- `POST /auth/users/reset_password_confirm/` - Confirm password reset
- `POST /auth/users/set_password/` - Change password
- `DELETE /auth/users/me/` - Delete user account

### Django-Allauth (Social Authentication)
Django-Allauth allows authentication via social providers like Google, Facebook, etc.

To use social authentication:
1. Configure social providers in Django settings.
2. Redirect users to the provider's login URL.
3. Use the access token to authenticate users.

### Google Authentication Endpoint

- `GET /accounts/login/` - Google login endpoint
- `GET /accounts/logout/` - Google logout endpoint

## Contributing
Feel free to open issues and submit pull requests to improve the boilerplate.

## License
This project is open-source and available under the MIT License.

## Contact
For questions or suggestions, feel free to reach out!


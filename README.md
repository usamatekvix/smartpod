# Django Authentication Boilerplate

## Overview

This is a boilerplate project for authentication in Django, integrating **Djoser** and **Django-Allauth** for seamless user authentication. The project includes JWT-based authentication and API-based authentication, making it easy to integrate with frontend applications. It is also Docker-ready for easy deployment.

## Features

- **Djoser Integration**
  - JWT Authentication
  - Prebuilt authentication endpoints from Djoser
- **Django-Allauth Integration**
  - Social Authentication (Google, Facebook, etc.)
- **API-based Authentication** (for frontend apps)
- **Docker Support** for easy deployment

## Technologies Used

- **Django** (Backend Framework)
- **Djoser** (For authentication APIs)
- **Django-Allauth** (For social authentication)
- **Django REST Framework (DRF)**
- **PostgreSQL** (Database)
- **Docker & Docker Compose** (Containerization)

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- Python (>=3.8)
- PostgreSQL
- Docker & Docker Compose (if using Docker)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/django-auth-boilerplate.git
   cd django-auth-boilerplate
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**

   - Rename `.env.example` to `.env` and update the values accordingly.

5. **Apply migrations:**

   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (optional):**

   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server:**

   ```bash
   python manage.py runserver
   ```

### Running with Docker

1. **Build and start the containers:**

   ```bash
   docker-compose up --build
   ```

2. **Create a superuser inside the container:**

   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

3. The API should now be available at `http://localhost:8000`

## Authentication Endpoints

### Djoser (JWT Authentication)

- `POST /auth/users/` → Registration
- `POST /auth/users/activation/` → Activate user
- `POST /auth/jwt/create/` → Login (obtain JWT token)
- `POST /auth/jwt/refresh/` → New access token
- `POST /auth/users/set_password/` → Change password
- `POST /auth/users/reset_password/` → Reset password
- `POST /auth/users/reset_password_confirm/` → Reset password confirmation
- `DELETE /auth/users/me/` → Delete user

### Django-Allauth (Google Authentication)

- `GET /accounts/login/` → Login a user
- `GET /accounts/logout/` → Logout a user

## Changing Site in Django Admin

To configure the correct site for social authentication:

1. **Login to Django Admin:**
   ```bash
   http://localhost:8000/admin/
   ```
   Use your superuser credentials to log in.

2. **Navigate to "Sites" Model:**
   - Find **Sites** under the "django.contrib.sites" app.
   - Change the existing site (usually `example.com`) to your domain (e.g., `localhost:8000`).

## Adding Google API Credentials to Social Account Table

To configure Google login with Django-Allauth:

1. **Create a Google OAuth App:**
   - Go to [Google Developer Console](https://console.cloud.google.com/).
   - Create a new project.
   - Navigate to **Credentials** and create an **OAuth 2.0 Client ID**.
   - Set the **Authorized redirect URIs** to:
     ```
     http://localhost:8000/accounts/google/login/callback/
     ```

2. **Update Django Admin Social Applications:**
   - Go to Django Admin (`http://localhost:8000/admin/`).
   - Find **Social Applications** under "django-allauth".
   - Add a new social application:
     - **Provider:** Google
     - **Name:** Google Login
     - **Client ID:** (Copy from Google Developer Console)
     - **Secret Key:** (Copy from Google Developer Console)
     - **Sites:** Select your site (e.g., `localhost:8000`).

3. **Save and Restart Server:**
   ```bash
   python manage.py runserver
   ```

Now, users can log in using Google OAuth authentication.

## Contributing

Feel free to contribute to this project! Fork the repository and submit a pull request with improvements.

## License

This project is open-source and available under the **MIT License**.





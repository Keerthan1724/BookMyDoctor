# BookMyDoctor

A comprehensive doctor appointment booking system built with Django REST Framework backend and React frontend. The platform allows patients to book appointments with doctors, manage their profiles, and make secure payments through Stripe integration.

## 🚀 Features

### For Patients (Users)
- **User Registration & Authentication**: Secure signup with email OTP verification
- **Doctor Search & Discovery**: Browse doctors by specialization, location, and availability
- **Appointment Booking**: Easy online booking with real-time availability
- **Payment Processing**: Secure payments via Stripe integration
- **Appointment Management**: View booking history, upcoming appointments, and cancel bookings
- **Review System**: Rate and review doctors after appointments
- **Profile Management**: Update personal information and view medical history

### For Doctors
- **Profile Management**: Complete doctor profiles with specialization, experience, and clinic details
- **Availability Management**: Set and manage consultation slots
- **Appointment Management**: View, approve/reject, and manage appointments
- **Review Monitoring**: View patient reviews and ratings
- **Dashboard**: Comprehensive dashboard for appointment overview

### For Administrators
- **User Management**: Manage all users, doctors, and patients
- **Doctor Management**: Add, edit, and deactivate doctor accounts
- **Appointment Oversight**: Monitor all appointments across the platform
- **System Analytics**: View platform statistics and reports

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 6.0.2 with Django REST Framework
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Payments**: Stripe API
- **Email**: SMTP (Gmail)
- **CORS**: django-cors-headers
- **File Uploads**: Django media files
- **Filtering**: django-filter

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Icons**: Lucide React & React Icons
- **Notifications**: React Hot Toast
- **Image Processing**: React Easy Crop
- **Payments**: Stripe React SDK

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Python 3.8+
- Node.js 16+
- MySQL Server
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BookMyDoctor
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Configuration
Create a `.env` file in the `backend` directory with the following variables:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
DB_NAME=your_mysql_database_name
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
EMAIL_HOST_USER=your_gmail@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password
```

#### Database Setup
```bash
# Create MySQL database
# Update your .env with database credentials

# Run migrations
python manage.py makemigrations
python manage.py migrate
```

#### Load Sample Data (Optional)
```bash
python manage.py loaddata doctors.json
```

#### Create Superuser
```bash
python manage.py createsuperuser
```

#### Run Backend Server
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Environment Configuration
Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

#### Run Frontend Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5174`

## 🚀 Usage

### Accessing the Application
1. Open your browser and navigate to `http://localhost:5174`
2. Register as a new user or login with existing credentials
3. Browse available doctors and book appointments
4. Make payments securely through Stripe
5. Manage your appointments and profile

### Admin Access
- Access Django admin at `http://localhost:8000/admin`
- Login with superuser credentials
- Manage users, doctors, and appointments

## 📁 Project Structure

```
BookMyDoctor/
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── core/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── permissions.py
│   ├── utils/
│   │   └── email_service.py
│   ├── templates/
│   ├── media/
│   ├── static/
│   ├── manage.py
│   ├── requirements.txt
│   └── doctors.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/forgot-password/` - Password reset request
- `POST /api/auth/verify-otp/` - OTP verification
- `POST /api/auth/reset-password/` - Password reset

### Users
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile

### Doctors
- `GET /api/doctors/` - List all doctors
- `GET /api/doctors/{id}/` - Get doctor details
- `GET /api/doctors/{id}/availability/` - Get doctor availability

### Appointments
- `GET /api/appointments/` - List user appointments
- `POST /api/appointments/` - Create appointment
- `PUT /api/appointments/{id}/` - Update appointment
- `DELETE /api/appointments/{id}/` - Cancel appointment

### Payments
- `POST /api/payments/create-session/` - Create Stripe payment session
- `POST /api/payments/webhook/` - Stripe webhook handler

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@bookmydoctor.com or create an issue in the repository.

## 🙏 Acknowledgments

- Django REST Framework for the robust API framework
- React for the dynamic frontend
- Stripe for secure payment processing
- Tailwind CSS for beautiful styling</content>
<parameter name="filePath">c:\Users\devad\Desktop\BookMyDoctor\README.md
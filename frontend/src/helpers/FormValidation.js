const validateFullName = (value) => {
    const regex = /^[a-zA-Z ]+$/;
    if (!regex.test(value)) {
        return "Invalid full name";
    }
};

function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
  if(!regex.test(password)) {
      return "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one symbol";
  }
}

const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
        return "Invalid email";
    }
};

const validateMobileNumber = (value) => {
    const regex = /^\d{10}$/;
    if (!regex.test(value)) {
        return "Invalid mobile number";
    }
};

const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return "Passwords do not match";
    }
};

export { 
    validateFullName, 
    validateEmail,
    validateMobileNumber,
    validatePassword,
    validateConfirmPassword, 
};
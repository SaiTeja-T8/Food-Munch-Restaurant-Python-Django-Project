document.addEventListener('DOMContentLoaded', function() {
    const MobileInput = document.getElementById('mobilenumber');
    const PasswordInput = document.getElementById('password1');
    const EmailInput = document.getElementById('EmailId');
    const NameInput = document.getElementById('Customer-Name');
    const ConfirmPasswordInput = document.getElementById('password2');
    const StrengthIndicator = document.getElementById('strength');
    const ErrorMessagesContainer = document.getElementById('ErrorMessages');
    const SignupForm = document.querySelector('form');
    const signupButton = document.querySelector('.login-button');
    const formElements = document.querySelector('.form-list');


    // Prevent further errors if elements are not found
    if (!MobileInput || !PasswordInput || !StrengthIndicator || !ErrorMessagesContainer || !SignupForm) {
        console.error("One or more elements could not be found in the DOM. Please check the IDs.");
        return;
    }

    // Error message containers below each input
    const mobileErrorContainer = document.createElement('div');
    const emailErrorContainer = document.createElement('div');
    const nameErrorContainer = document.createElement('div');
    const passwordErrorContainer = document.createElement('div');
    const confirmPasswordErrorContainer = document.createElement('div');

    mobileErrorContainer.classList.add('text-danger', 'mb-2');
    emailErrorContainer.classList.add('text-danger', 'mb-2');
    nameErrorContainer.classList.add('text-danger', 'mb-2');
    passwordErrorContainer.classList.add('text-danger', 'mb-2');
    confirmPasswordErrorContainer.classList.add('text-danger', 'mb-2');

    // Append error containers after inputs
    MobileInput.parentElement.appendChild(mobileErrorContainer);
    EmailInput.parentElement.appendChild(emailErrorContainer);
    NameInput.parentElement.appendChild(nameErrorContainer);
    PasswordInput.parentElement.appendChild(passwordErrorContainer);
    ConfirmPasswordInput.parentElement.appendChild(confirmPasswordErrorContainer);

    function validateEmptyFields() {
        let isValid = true;

        // Check if mobile number is empty
        if (MobileInput.value.trim() === '') {
            mobileErrorContainer.innerText = 'Mobile Number should not be empty';
            mobileErrorContainer.style.fontWeight="bold";
            mobileErrorContainer.style.fontSize="16px";
            isValid = false;
        } else {
            mobileErrorContainer.innerText = '';
        }

        // Check if email is empty
        if (EmailInput.value.trim() === '') {
            emailErrorContainer.innerText = 'Email Id should not be empty';
            emailErrorContainer.style.fontWeight="bold";
            emailErrorContainer.style.fontSize="16px";
            isValid = false;
        } else {
            emailErrorContainer.innerText = '';
        }

        // Check if name is empty
        if (NameInput.value.trim() === '') {
            nameErrorContainer.innerText = 'Customer Name should not be empty';
            nameErrorContainer.style.fontWeight="bold";
            nameErrorContainer.style.fontSize="16px";
            isValid = false;
        } else {
            nameErrorContainer.innerText = '';
        }

        // Check if password is empty
        if (PasswordInput.value.trim() === '') {
            passwordErrorContainer.innerText = 'Password should not be empty';
            passwordErrorContainer.style.fontWeight="bold";
            passwordErrorContainer.style.fontSize="16px";
            isValid = false;
        } else {
            passwordErrorContainer.innerText = '';
        }

        // Check if confirm password is empty
        if (ConfirmPasswordInput.value.trim() === '') {
            confirmPasswordErrorContainer.innerText = 'Confirm Password should not be empty';
            confirmPasswordErrorContainer.style.fontWeight="bold";
            confirmPasswordErrorContainer.style.fontSize="16px";
            confirmPasswordErrorContainer.style.color="red";
            isValid = false;
        } else {
            confirmPasswordErrorContainer.innerText = '';
        }

        return isValid;
    }

    // Clear error messages when user types in the input fields
    [MobileInput, EmailInput, NameInput, PasswordInput, ConfirmPasswordInput].forEach(input => {
        input.addEventListener('input', function() {
            this.parentElement.querySelector('.text-danger').innerText = '';
        });
    });

    // Handle mobile number input
    MobileInput.addEventListener('input', function() {
        let MobileNumber = MobileInput.value;
        MobileNumber = MobileNumber.replace(/[^0-9]/g, '');
        MobileInput.value = MobileNumber;
    });

    // Add Styles to the strength indicator dynamically
    const Style = document.createElement('style');
    Style.innerHTML = `
        .strength {
            height: 10px;
            width: 5%;
            margin-top: 5px;
            border-radius: 5px;
        }
        .strength.weak {
            background-color: red;
        }
        .strength.medium {
            background-color: yellow;
        }
        .strength.strong {
            background-color: green;
        }
    `;
    document.head.appendChild(Style);

    function ValidatePassword(password) {
        const Errors = [];
        const SpecialChars = ["@","#","!","$","%","^","&","*","(","{","[",":",";","|","<",">",",",".","?","]","}",")","_","-"];
        const HasSpecialChar = SpecialChars.some(char => password.includes(char));
        const HasUpperCase = /[A-Z]/.test(password);
        const HasLowerCase = /[a-z]/.test(password);
        const HasNumber = /[0-9]/.test(password);

        if (password.length < 8) {
            Errors.push('Password must be at least 8 characters long.');
        }
        if (!HasSpecialChar) {
            Errors.push('Password must contain at least one special character.');
        }
        if (!HasUpperCase) {
            Errors.push('Password must contain at least one uppercase letter.');
        }
        if (!HasLowerCase) {
            Errors.push('Password must contain at least one lowercase letter.');
        }
        if (!HasNumber) {
            Errors.push('Password must contain at least one number.');
        }

        return Errors;
    }

    // Password input event listener
    PasswordInput.addEventListener('input', function() {
        const Password = PasswordInput.value;
        let Strength = '';
        const Errors = ValidatePassword(Password);

        if (Password.length < 8) {
            Strength = 'weak';
        } else if (Errors.length > 0) {
            Strength = 'medium';
        } else {
            Strength = 'strong';
        }

        StrengthIndicator.className = 'strength ' + Strength;

        // Display error messages at the top
        if (Errors.length > 0) {
            ErrorMessagesContainer.innerHTML = Errors.map(error => `<div class="alert alert-danger">${error}</div>`).join('');
        } else {
            ErrorMessagesContainer.innerHTML = '';
        }
    });

    // Prevent form submission if password is not strong
    SignupForm.addEventListener('submit', function(event) {
        const Password = PasswordInput.value;
        const Errors = ValidatePassword(Password);
        const Strength = StrengthIndicator.className.split(' ')[1]; // Extract strength class

        if (Strength !== 'strong') {
            event.preventDefault();
            if (Errors.length > 0) {
                ErrorMessagesContainer.innerHTML = Errors.map(error => `<div class="alert alert-danger">${error}</div>`).join('');
            }
        }
    });

    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    togglePassword.addEventListener('click', function() {
        const type = PasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        PasswordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Apply inline CSS for the eye icon positioning
    const inputGroupAppend = document.querySelector('.input-group-append');
    if (inputGroupAppend) {
        inputGroupAppend.style.position = 'absolute';
        inputGroupAppend.style.right = '10px';
        inputGroupAppend.style.top = '50%';
        inputGroupAppend.style.transform = 'translateY(-50%)';
        inputGroupAppend.style.zIndex = '10';
        inputGroupAppend.style.cursor = 'pointer';
    }

    // Signup button click event with validation
    signupButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission until validation and animation

        if (validateEmptyFields()) {
            // If all fields are valid, trigger the animation and form submission
            formElements.style.display = 'none';

            const animationContainer = document.createElement('div');
            animationContainer.style.position = 'relative';
            animationContainer.style.width = '100%';
            animationContainer.style.height = '50vh';
            animationContainer.style.display = 'flex';
            animationContainer.style.flexDirection = 'column';
            animationContainer.style.alignItems = 'center';
            animationContainer.style.justifyContent = 'center';

            document.body.appendChild(animationContainer);

            const messageImage = document.createElement('img');
            messageImage.src = "/static/Star_Pattern/personimage.png";
            messageImage.style.width = '100px';
            messageImage.style.position = 'absolute';
            messageImage.style.left = '10%';
            messageImage.style.top = '50%';
            messageImage.style.transform = 'translateY(-50%)';

            const dbImage = document.createElement('img');
            dbImage.src = "/static/Star_Pattern/databaseimage.png";
            dbImage.style.width = '100px';
            dbImage.style.position = 'absolute';
            dbImage.style.right = '10%';
            dbImage.style.top = '50%';
            dbImage.style.transform = 'translateY(-50%)';

            animationContainer.appendChild(messageImage);
            animationContainer.appendChild(dbImage);

            const statusText = document.createElement('div');
            statusText.innerText = 'Inserting data, please wait...';
            statusText.style.position = 'absolute';
            statusText.style.bottom = '55%';
            statusText.style.textAlign = 'center';
            statusText.style.fontFamily = 'Roboto';
            statusText.style.fontSize = '26px';
            statusText.style.fontWeight = 'bold';
            statusText.style.color = '#C70039';
            animationContainer.appendChild(statusText);

            const statusBarContainer = document.createElement('div');
            statusBarContainer.style.width = '60%';
            statusBarContainer.style.height = '10px';
            statusBarContainer.style.borderRadius = '5px';
            statusBarContainer.style.backgroundColor = '#f3f3f3';
            statusBarContainer.style.overflow = 'hidden';
            statusBarContainer.style.marginTop = '10px';
            statusBarContainer.style.position = 'absolute';
            statusBarContainer.style.bottom = '30%';

            const statusBar = document.createElement('div');
            statusBar.style.width = '0%';
            statusBar.style.height = '100%';
            statusBar.style.borderRadius = '5px';
            statusBar.style.backgroundColor = 'red';
            statusBarContainer.appendChild(statusBar);

            animationContainer.appendChild(statusBarContainer);

            const percentageText = document.createElement('div');
            percentageText.innerText = '0%';
            percentageText.style.position = 'absolute';
            percentageText.style.bottom = '20%';
            percentageText.style.textAlign = 'center';
            percentageText.style.fontFamily = 'Roboto';
            percentageText.style.fontSize = '22px';
            percentageText.style.fontWeight = 'bold';
            percentageText.style.marginTop = '50px';
            animationContainer.appendChild(percentageText);

            let progress = 0;
            const statusInterval = setInterval(() => {
                progress += 1;
                statusBar.style.width = `${progress}%`;
                percentageText.innerText = `${progress}%`;

                if (progress <= 15) {
                    statusBar.style.backgroundColor = 'red';
                    percentageText.style.color = 'red';
                } else if (progress <= 30) {
                    statusBar.style.backgroundColor = '#A97BFF';
                    percentageText.style.color = '#A97BFF';
                } else if (progress <= 60) {
                    statusBar.style.backgroundColor = '#198CE7';
                    percentageText.style.color = '#198CE7';
                } else if (progress <= 90) {
                    statusBar.style.backgroundColor = '#f34b7d';
                    percentageText.style.color = '#f34b7d';
                } else {
                    statusBar.style.backgroundColor = 'green';
                    percentageText.style.color = 'green';
                }

                if (progress === 100) {
                    clearInterval(statusInterval);

                    setTimeout(() => {
                        document.querySelector('form').submit();
                    }, 5000);
                }
            }, 50);
        }
    });

});

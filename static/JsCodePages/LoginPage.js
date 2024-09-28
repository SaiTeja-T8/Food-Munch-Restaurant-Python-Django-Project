document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('emailid');
    const loginButton = document.getElementById('login-button');
    const formContainer = document.querySelector('.form-container'); 
    const loginText = document.querySelector('.main-container');
    const createAccountText = document.querySelector('.outer-container'); 

    // Create error message elements
    const emailError = document.createElement('div');
    emailError.style.color = 'red';
    emailError.style.fontSize = '0.9em';
    emailError.style.display = 'none';
    emailError.textContent = 'Email Id is required';
    emailError.style.fontWeight="bold";
    emailError.style.fontSize="16px";
    
    const passwordError = document.createElement('div');
    passwordError.style.color = 'red';
    passwordError.style.fontSize = '0.9em';
    passwordError.style.display = 'none';
    passwordError.textContent = 'Password is required';
    passwordError.style.fontWeight="bold";
    passwordError.style.fontSize="16px";
    passwordError.style.marginTop="15px";
    
    emailInput.parentNode.appendChild(emailError);
    passwordInput.parentNode.appendChild(passwordError);

    // Toggle password visibility
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Handle login button click
    loginButton.addEventListener('click', function (event) {
        event.preventDefault();  // Prevent form submission

        let valid = true;

        // Reset error messages
        emailError.style.display = 'none';
        passwordError.style.display = 'none';

        // Check if email is empty
        if (emailInput.value.trim() === '') {
            emailError.style.display = 'block';
            valid = false;
        }

        // Check if password is empty
        if (passwordInput.value.trim() === '') {
            passwordError.style.display = 'block';
            valid = false;
        }

        // If form is invalid, stop here
        if (!valid) {
            return;
        }

        // Hide input fields, login text, and the "Don't have an account" text
        formContainer.style.display = 'none';
        loginText.style.display = 'none';
        createAccountText.style.display = 'none';

        // Create animation container inside the form's container
        const animationContainer = document.createElement('div');
        animationContainer.classList.add('animation-container');
        formContainer.parentNode.appendChild(animationContainer);

        // Create and add person image
        const personImg = document.createElement('img');
        personImg.id = 'person';
        personImg.src = '/static/Star_Pattern/personimage.png';
        personImg.alt = 'Person';
        personImg.style.height = "100px";
        personImg.style.width = "100px";
        personImg.classList.add('animation-image');
        animationContainer.appendChild(personImg);

        // Create and add db image
        const dbImg = document.createElement('img');
        dbImg.id = 'db';
        dbImg.src = '/static/Star_Pattern/databaseimage.png';
        dbImg.alt = 'DB';
        dbImg.style.height = "100px";
        dbImg.style.width = "100px";
        dbImg.classList.add('animation-image');
        animationContainer.appendChild(dbImg);

        // Create and add message 1 image
        const msg1Img = document.createElement('img');
        msg1Img.id = 'msg1';
        msg1Img.src = '/static/Star_Pattern/message1.png';
        msg1Img.alt = 'Message 1';
        msg1Img.classList.add('animation-message');
        msg1Img.style.left = '15%'; 
        animationContainer.appendChild(msg1Img);

        // Create and add message 2 image
        const msg2Img = document.createElement('img');
        msg2Img.id = 'msg2';
        msg2Img.src = '/static/Star_Pattern/message2.png';
        msg2Img.alt = 'Message 2';
        msg2Img.classList.add('animation-message');
        msg2Img.style.left = '85%';
        animationContainer.appendChild(msg2Img);

        // Start first message animation (message1 from person to db)
        setTimeout(function () {
            msg1Img.style.opacity = '1';
            msg1Img.style.transition = 'all 5s';
            msg1Img.style.left = '82%';
        }, 100);

        // After the message reaches DB, make it disappear
        setTimeout(function () {
            msg1Img.style.opacity = '0';
        }, 5000);

        // After 5 seconds, start second message animation (message2 from db to person)
        setTimeout(function () {
            msg2Img.style.opacity = '1';
            msg2Img.style.transition = 'all 5s';
            msg2Img.style.left = '15%';
        }, 5000);

        // After the second message reaches the person, make it disappear
        setTimeout(function () {
            msg2Img.style.opacity = '0';
        }, 10000);

        // After both animations complete (total 10s), submit the form
        setTimeout(function () {
            document.getElementById('login-form-id').submit();
        }, 10000);
    });

    // Remove error messages on input
    emailInput.addEventListener('input', function () {
        emailError.style.display = 'none';
    });

    passwordInput.addEventListener('input', function () {
        passwordError.style.display = 'none';
    });
});

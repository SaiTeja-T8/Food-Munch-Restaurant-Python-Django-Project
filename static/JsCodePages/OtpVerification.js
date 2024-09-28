document.addEventListener("DOMContentLoaded", function() {
    const OtpValueElement = document.getElementById('otp-value');
    const EnteredOtp = OtpValueElement ? OtpValueElement.value : '';
    document.getElementById('otp1').focus();
   
    function HandleInput(event, index) {
        const input = event.target;
        const value = input.value;
        if (!/^\d$/.test(value)) {   // Ensuring the input value is a number
            input.value = '';
            return;
        }
        if (index < 6) {    
            document.getElementById('otp' + (index + 1)).focus();
        }
        if (index === 6) {
            CheckOtp();
        }
    }

    function HandleBackspace(event, index) {
        if (event.key === "Backspace" && event.target.value === '' && index > 1) {
            document.getElementById('otp' + (index - 1)).focus();
        }
    }

    function ApplyStyle(element, isCorrect) {
        if (isCorrect) {
            element.style.borderColor = 'green';
            element.style.boxShadow = '0 0 5px rgba(0, 255, 0, 0.5)';
            element.classList.add('success');
        } else {
            element.style.borderColor = 'red';
            element.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.5)';
        }
    }

    function CheckOtp() {
        const OTP = Array.from({ length: 6 }, (_, i) => document.getElementById('otp' + (i + 1)).value).join('');
        const inputs = document.querySelectorAll('.OTP-Input');

        if (OTP === EnteredOtp) {
            inputs.forEach(input => {
                ApplyStyle(input, true);
                setTimeout(() => {
                    input.classList.add('success');
                }, 100);  // Delay the jump animation slightly
            });
            setTimeout(() => {
                document.getElementById('SubmitForm').submit();
            }, 600);  // Delay form submission to allow animation to complete
        } else {
            inputs.forEach(input => ApplyStyle(input, false));
        }
    }

    for (let i = 1; i <= 6; i++) {
        document.getElementById('otp' + i).addEventListener('input', (event) => HandleInput(event, i));
        document.getElementById('otp' + i).addEventListener('keydown', (event) => HandleBackspace(event, i));
    }
});
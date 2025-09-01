document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const passwordInput = document.getElementById('password');
    const copyBtn = document.getElementById('copy-btn');
    const generateBtn = document.getElementById('generate-btn');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('length-value');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.getElementById('strength-text');

    // Character sets
    const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBER_CHARS = '0123456789';
    const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Update length value display
    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
    });

    // Generate password
    function generatePassword() {
        let chars = '';
        let password = '';
        
        // Build character set based on selected options
        if (uppercaseCheckbox.checked) chars += UPPERCASE_CHARS;
        if (lowercaseCheckbox.checked) chars += LOWERCASE_CHARS;
        if (numbersCheckbox.checked) chars += NUMBER_CHARS;
        if (symbolsCheckbox.checked) chars += SYMBOL_CHARS;

        // If no character set is selected, use all
        if (!chars) {
            chars = UPPERCASE_CHARS + LOWERCASE_CHARS + NUMBER_CHARS + SYMBOL_CHARS;
            // Update checkboxes to reflect this
            uppercaseCheckbox.checked = true;
            lowercaseCheckbox.checked = true;
            numbersCheckbox.checked = true;
            symbolsCheckbox.checked = true;
        }

        // Generate password
        const length = parseInt(lengthSlider.value);
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }

        // Shuffle the password to ensure randomness
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        return password;
    }

    // Check password strength
    function checkPasswordStrength(password) {
        let strength = 0;
        const length = password.length;
        
        // Length check
        if (length >= 12) strength += 2;
        else if (length >= 8) strength += 1;
        
        // Character type checks
        if (password.match(/[a-z]+/)) strength += 1;
        if (password.match(/[A-Z]+/)) strength += 1;
        if (password.match(/[0-9]+/)) strength += 1;
        if (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/)) strength += 1;
        
        // Update strength meter
        updateStrengthMeter(strength);
    }

    // Update strength meter UI
    function updateStrengthMeter(strength) {
        let strengthClass = '';
        let strengthLabel = '';
        let width = 0;
        
        switch(strength) {
            case 0:
            case 1:
                strengthClass = 'weak';
                strengthLabel = 'Very Weak';
                width = '20%';
                break;
            case 2:
                strengthClass = 'weak';
                strengthLabel = 'Weak';
                width = '40%';
                break;
            case 3:
                strengthClass = 'medium';
                strengthLabel = 'Medium';
                width = '60%';
                break;
            case 4:
                strengthClass = 'strong';
                strengthLabel = 'Strong';
                width = '80%';
                break;
            case 5:
            case 6:
                strengthClass = 'very-strong';
                strengthLabel = 'Very Strong';
                width = '100%';
                break;
        }
        
        // Update the strength bar
        const bar = document.querySelector('.strength-bar > div');
        if (bar) {
            bar.style.width = width;
            bar.className = strengthClass;
        } else {
            // If the bar doesn't exist, create it
            const newBar = document.createElement('div');
            newBar.className = strengthClass;
            newBar.style.width = width;
            newBar.style.height = '100%';
            newBar.style.transition = 'width 0.3s, background 0.3s';
            document.querySelector('.strength-bar').appendChild(newBar);
        }
        
        // Update text
        strengthText.textContent = `Strength: ${strengthLabel}`;
        
        // Add CSS for strength classes
        const style = document.createElement('style');
        style.id = 'strength-styles';
        style.textContent = `
            .weak { background: var(--danger-color); }
            .medium { background: var(--warning-color); }
            .strong { background: #4caf50; }
            .very-strong { background: var(--success-color); }
        `;
        
        // Remove old styles if they exist
        const oldStyle = document.getElementById('strength-styles');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        document.head.appendChild(style);
    }

    // Copy password to clipboard
    copyBtn.addEventListener('click', () => {
        if (!passwordInput.value) return;
        
        passwordInput.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    });

    // Generate new password
    generateBtn.addEventListener('click', () => {
        const password = generatePassword();
        passwordInput.value = password;
        checkPasswordStrength(password);
    });
    
    // Generate initial password
    generateBtn.click();
    
    // Handle Enter key to generate new password
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });
});

export function validatePassword(password) {
    const errors = [];

    if (!/[A-Z]/.test(password)) {
        errors.push("at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("at least one number");
    }
    if (!/[^A-Za-z0-9$]/.test(password)) {
        errors.push("at least one special symbol (excluding $)");
    }
    if (password.length < 8) {
        errors.push("minimum length of 8 characters");
    }

    if (errors.length === 0) {
        return { valid: true, message: "Password is strong ✅" };
    } else {
        return { valid: false, message: "Password must contain " + errors.join(", ") };
    }
}

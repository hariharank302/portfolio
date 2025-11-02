document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            showMessage("Please fill in all fields.", "red");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showMessage("Please enter a valid email address.", "red");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);

            const response = await fetch("https://example.com/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (response.ok) {
                showMessage("Message sent successfully!", "green");
                form.reset();
            } else {
                throw new Error("Failed to send message.");
            }
        } catch (error) {
            if (error.name === "AbortError") {
                showMessage("Request timed out. Please try again.", "red");
            } else {
                showMessage("Oops! Something went wrong. Please try again.", "red");
                console.error("Contact form error:", error);
            }
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send";
        }
    });

    function showMessage(text, color, duration = 5000) {
        formMessage.textContent = text;
        formMessage.style.color = color;
        setTimeout(() => { formMessage.textContent = ""; }, duration);
    }
});

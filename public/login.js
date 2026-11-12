function showToast(title, message, type = "info") {
    const toastElement = document.getElementById("login-toast")
    const toastTitle = document.getElementById("toast-title")
    const toastMessage = document.getElementById("toast-message")

    toastTitle.textContent = title
    toastMessage.textContent = message

    toastElement.classList.remove("text-bg-success", "text-bg-danger", "text-bg-info")

    if (type === "success") {
        toastElement.classList.add("text-bg-success")
    } else if (type === "warning") {
        toastElement.classList.add("text-bg-warning")
    } else {
        toastElement.classList.add("text-bg-danger")
    }

    const toast = bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 5000 })
    toast.show()
}

async function login(e, role) {
    e.preventDefault()

    const form = new FormData(e.target)

    const email = form.get('email')
    const password = form.get('password')

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    }

    try {
        const response = await fetch("/auth/login", options)
        const data = await response.json()
        
        if (response.ok) {
            if (data.role !== role) {
                showToast("Role Mismatch", `You are trying to log in as a ${role}, but your account is registered as a ${data.role}.`, "warning")
                return
            }
            e.target.reset()
            sessionStorage.setItem('token', data.token)
            if (data.role === 'student') {
                window.location.assign('/subjectpage')
            } else if (data.role === 'teacher') {
                window.location.assign('/startpage')
            }
        } else {
            showToast("Login Failed", data.error, "danger")
        }
    } catch (error) {
        console.error('Error:', error)
        showToast("Error", 'An error occurred. Please try again later.', "danger")
    }
}

document.getElementById("student-form").addEventListener("submit", (e) => login(e, 'student'))
document.getElementById("teacher-form").addEventListener("submit", (e) => login(e, 'teacher'))
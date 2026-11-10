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
                alert(`Please log in with a ${role} account.`)
                return
            }
            e.target.reset()
            sessionStorage.setItem('token', data.token)
            if (data.role === 'student') {
                window.location.assign('subjectpage.html')
            } else if (data.role === 'teacher') {
                window.location.assign('startpage.html')
            }
        } else {
            alert(data.error)
        }
    } catch (error) {
        console.error('Error:', error)
        alert('An error occurred. Please try again later.')
    }
}

document.getElementById("student-form").addEventListener("submit", (e) => login(e, 'student'))
document.getElementById("teacher-form").addEventListener("submit", (e) => login(e, 'teacher'))
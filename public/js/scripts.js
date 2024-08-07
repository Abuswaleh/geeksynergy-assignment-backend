var token = null;
var loggedUser = null;

async function handleLogin(event) {
	event.preventDefault();

	const email = document.getElementById("loginEmail").value;
	const password = document.getElementById("loginPassword").value;

	try {
		const response = await fetch("/api/user/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (data.success) {
			localStorage.setItem("user", JSON.stringify(data.data));
			window.location.reload();
		} else {
			alert(data.message || "Login failed");
		}
	} catch (error) {
		alert("Error: " + error.message);
	}
}

async function handleRegistration(event) {
	event.preventDefault();

	const name = document.getElementById("registerName").value;
	const email = document.getElementById("registerEmail").value;
	const password = document.getElementById("registerPassword").value;
	const phone = document.getElementById("registerPhone").value;
	const profession = document.getElementById("registerProfession").value;

	try {
		const response = await fetch("/api/user/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				email,
				password,
				phone,
				profession,
			}),
		});

		const data = await response.json();

		if (data.success) {
			localStorage.setItem("user", JSON.stringify(data.data));
			window.location.reload();
		} else {
			alert(data.message || "Registration failed");
		}
	} catch (error) {
		alert("Error: " + error.message);
	}
}

function handleLogout() {
	try {
		localStorage.removeItem("user");
		window.location.reload();
	} catch (error) {
		console.error("Error during logout:", error);
		alert("An error occurred during logout.");
	}
}

async function getUsersList() {
	try {
		const response = await fetch("/api/user/userslist", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		const data = await response.json();
		return data.data || [];
	} catch (error) {
		alert("Error: " + error.message);
		return [];
	}
}

function getFromLocalStorage(key, defaultValue) {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch (e) {
		return defaultValue;
	}
}

async function handleDeleteUser(userId, row) {
	try {
		const response = await fetch(`/api/user/delete/${userId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			// Remove the user row from the table
			row.remove();
			alert("User deleted successfully.");
		} else {
			const error = await response.text();
			alert(`Failed to delete user: ${error}`);
		}
	} catch (error) {
		console.error("Error:", error);
		alert("An error occurred while deleting the user.");
	}
}

async function handleDelete(userId, row) {
	if (userId === loggedUser._id) {
		const confirmation = confirm(
			"You are about to delete your own account, you will be logout. Are you want to continue?"
		);
		if (confirmation) {
			await handleDeleteUser(userId, row);
			return handleLogout();
		}
	}
	await handleDeleteUser(userId, row);
}

function handleEdit(userId, row) {
	alert("Edit functionality is not yet implemented.");
}

function renderUsersList(table, usersList) {
	table.innerHTML = usersList
		.map(
			(user) => `
				    <tr>
				        <td><input type="text" value="${
							user.name
						}" class="disabled" disabled /></td>
				    	<td>${user.email}</td>
				        <td><input type="text" value="${
							user.phone || ""
						}" class="disabled" disabled /></td>
				        <td><input type="text" value="${
							user.profession || ""
						}" class="disabled" disabled /></td>
				        <td><button class="btn btn-info btn-sm" 
							onclick="handleEdit('${user._id}', this.closest('tr'))">Edit</button></td>
				        <td><button class="btn btn-danger btn-sm" 
							onclick="handleDelete('${user._id}', this.closest('tr'))">Delete</button></td>
					</tr>`
		)
		.join("");
}

document.addEventListener("DOMContentLoaded", async () => {
	const userLocalData = getFromLocalStorage("user", null);
	const user = userLocalData?.user || null;
	token = userLocalData?.token || null;
	loggedUser = user || null;
	let usersList = [];

	const userName = document.getElementById("userName");
	const logoutBtn = document.getElementById("logoutBtn");
	const contentTitle = document.getElementById("contentTitle");

	const registerSection = document.getElementById("registerSection");
	const registerForm = document.getElementById("registerForm");
	const loginForm = document.getElementById("loginForm");
	const loginSection = document.getElementById("loginSection");
	const usersTable = document.getElementById("usersTable");
	const tableData = document.getElementById("tableData");
	const showLogin = document.getElementById("showLogin");
	const showRegister = document.getElementById("showRegister");

	if (user && token) {
		userName.textContent = user.name;
		logoutBtn.classList.remove("hidden");
		registerSection.classList.add("hidden");
		loginSection.classList.add("hidden");
		usersTable.classList.remove("hidden");
		contentTitle.textContent = "Manage Users";

		usersList = await getUsersList();
		renderUsersList(tableData, usersList);

		logoutBtn.addEventListener("click", () => {
			localStorage.removeItem("user");
			window.location.reload();
		});
	} else {
		userName.textContent = "User";
		logoutBtn.classList.add("hidden");
		registerSection.classList.add("hidden");
		loginSection.classList.remove("hidden");
		usersTable.classList.add("hidden");
		contentTitle.textContent = "Login";

		showLogin.addEventListener("click", () => {
			contentTitle.textContent = "Login";
			registerSection.classList.add("hidden");
			loginSection.classList.remove("hidden");
		});

		showRegister.addEventListener("click", () => {
			contentTitle.textContent = "Register";
			loginSection.classList.add("hidden");
			registerSection.classList.remove("hidden");
		});
	}

	logoutBtn.addEventListener("click", handleLogout);
	registerForm.addEventListener("submit", handleRegistration);
	loginForm.addEventListener("submit", handleLogin);
});

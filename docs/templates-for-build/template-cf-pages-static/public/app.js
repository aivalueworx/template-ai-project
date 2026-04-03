const form = document.getElementById("contact-form");
const result = document.getElementById("result");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    result.textContent = JSON.stringify(data, null, 2);
  });
}

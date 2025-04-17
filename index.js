document.getElementById("wellness-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = {
        name: form.name.value,
        age: parseInt(form.age.value),
        gender: form.gender.value,
        symptoms: form.symptoms.value
    };

    const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    const data = await res.json();
    document.getElementById("report").innerText = `Your Wellness Report: ${data.report}`;
});

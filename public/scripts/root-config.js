async function saveConfig() {
    const eventName = document.querySelector("#eventName").value;
    const tracks = parseInt(document.querySelector("#trackNumber").value, 10);

    console.log(`name: ${eventName}, tracks: ${tracks}`);

    const response = await fetch("/api/v1/event-config", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            eventName,
            tracks
        })
    });
    if (response.status === 201) {
        console.log(response.headers.get('location'))
    } else {
        console.warn(await response.json());
    }
}

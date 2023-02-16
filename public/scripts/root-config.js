async function saveConfig() {
    const eventName = document.querySelector("#eventName").value;
    const tracks = document.querySelector("#trackNumber").value;
    console.log(`name: ${eventName}, tracks: ${tracks}`);
}

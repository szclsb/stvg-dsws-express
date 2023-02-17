async function loadDisciplines() {

}

const participants = [
    {
        firstName: 'Test 1',
        lastName: 'Test 1',
        sex: 1,
        yearOfBirth: 2000
    },
    {
        firstName: 'Test 2',
        lastName: 'Test 2',
        sex: 1,
        yearOfBirth: 2000
    },
    {
        firstName: 'Test 3',
        lastName: 'Test 3',
        sex: 0,
        yearOfBirth: 2000
    }
];

async function addParticipant() {
    participants.push({
        firstName: 'Test X',
        lastName: 'Test X',
    })
}

async function saveReg() {
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

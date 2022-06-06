// Get the cookies used by this site
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Function get all the notes and populate them inside the notes div
const get_notes = () => {
    const notesDiv = document.getElementById("notes");
    fetch("/api/get_notes/")
    .then(response => response.json())
    .then(data => {
        let notes = data.notes;
        let output = "";
        if (notes.length === 0) {
            notesDiv.innerHTML = "<p>No notes are available.</p>";
        }
        else{
            for(i in notes){
                output += `<div class="col-md-4 px-0">
                    <div class="card noteCard" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${notes[i].title}</h5>
                            <p class="card-text">${notes[i].description}</p>
                            <button class="edit btn btn-sm btn-outline-dark" id="${notes[i].note_uuid}"><i class="fa-solid fa-pencil"></i> Edit</button>
                            <button class="delete btn btn-sm btn-dark" id="${notes[i].note_uuid}"><i class="fa-solid fa-trash"></i> Delete</button>
                        </div>
                    </div>
                </div>`;
            }
            notesDiv.innerHTML = output;

            for(i in notes){
                let editBtn = document.getElementsByClassName('edit')[i];
                let deleteBtn = document.getElementsByClassName('delete')[i];

                editBtn.addEventListener('click', (e) => get_note(e.target.id));
                deleteBtn.addEventListener('click', (e) => {
                    if (window.confirm("Are you sure, you want to delete this note ?")){
                        delete_note(e.target.id);
                    }
                    else{
                        return false;
                    }
                })
            }
        }
    })
}

get_notes();

// Function to add a note
let addBtn = document.getElementById('addBtn');
addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    try {
        fetch('/api/add_note/', {
            method: 'post',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // console.table(data);
            if (data.status == "error"){
                message.setAttribute("class", "alert alert-danger");
                message.innerHTML = "<strong>Error!</strong> ";
            }
    
            if (data.status == "success"){
                message.setAttribute("class", "alert alert-success");
                message.innerHTML = "<strong>Success!</strong> ";
                document.getElementById('add-note-form').reset();
                get_notes();
            }
    
            message.innerHTML += data.message;
            setTimeout(() => {
                message.innerHTML = "";
                message.setAttribute("class", "");
            }, 2000);
        })
    } catch (error) {
        console.error(error);
    }
})

// Function to get a particular note
function get_note(note_uuid){
    try {
        fetch(`/api/get_note/${note_uuid}/`)
        .then(response => response.json())
        .then(data => {
            let note = data.note;
            let note_uuidEdit = document.getElementById('note_uuidEdit');
            let titleEdit = document.getElementById('titleEdit');
            let descriptionEdit = document.getElementById('descriptionEdit');

            note_uuidEdit.value = note.note_uuid;
            titleEdit.value = note.title;
            descriptionEdit.value = note.description;
            $('#editModal').modal('toggle');
        })
    } catch (error) {
        console.error(error);
    }
}

// Function to close the edit modal
let closeModalBtns = document.getElementsByClassName('closeModal');
Array.from(closeModalBtns).forEach((element) => {
    element.addEventListener('click', () => {
        document.getElementById('edit-note-form').reset();
        let note_uuidEdit = document.getElementById('note_uuidEdit');
        note_uuidEdit.value = "";
        $('#editModal').modal('hide');
    })
})

// Function to update a todo
let updateBtn = document.getElementById('updateBtn');
updateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('note_uuid', document.getElementById('note_uuidEdit').value);
    formData.append('title', document.getElementById('titleEdit').value);
    formData.append('description', document.getElementById('descriptionEdit').value);
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    try {
        fetch('/api/update_note/', {
            method: 'post',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == "error"){
                message.setAttribute("class", "alert alert-danger");
                message.innerHTML = "<strong>Error!</strong> ";
            }

            if (data.status == "success"){
                message.setAttribute("class", "alert alert-success");
                message.innerHTML = "<strong>Success!</strong> ";
                document.getElementById('edit-note-form').reset();
                let note_uuidEdit = document.getElementById('note_uuidEdit');
                note_uuidEdit.value = "";
                $('#editModal').modal('hide');
                get_notes();
            }

            message.innerHTML += data.message;
            setTimeout(() => {
                message.innerHTML = "";
                message.setAttribute("class", "");
            }, 2000);
        })
    } catch (error) {
        console.error(error);
    }
})

// Function to delete a note
function delete_note(note_uuid){
    // console.log(note_uuid);
    let formData = new FormData();
    formData.append('note_uuid', note_uuid);
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
    try {
        fetch('/api/delete_note/', {
            method: 'post',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == "error"){
                message.setAttribute("class", "alert alert-danger");
                message.innerHTML = "<strong>Error!</strong> ";
            }

            if (data.status == "success"){
                message.setAttribute("class", "alert alert-success");
                message.innerHTML = "<strong>Success!</strong> ";
                get_notes();
            }

            message.innerHTML += data.message;
            setTimeout(() => {
                message.innerHTML = "";
                message.setAttribute("class", "");
            }, 2000);
        })
    } catch (error) {
        console.error(error);
    }
}
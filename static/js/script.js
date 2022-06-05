// Get the cookies used by this site
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Ajax funxtion to get all the notes
const get_notes = () => {
    const notesDiv = document.getElementById('notes');
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/get_notes/', true);

    xhr.onload = function() {
        if (this.status === 200){
            const data = JSON.parse(this.responseText);
            const notes = data.notes;
            // console.table(notes);

            if (notes.length === 0){
                notesDiv.innerHTML = '<p>No notes are available.</p>';
            }
            else{
                let output = "";
                // For-loop iteration for notes
                for (i in notes){
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

                // Adding click event listener to each element (*here button*) with class edit and delete inside notes
                for (i in notes){
                    let editBtn = document.getElementsByClassName('edit')[i];
                    let deleteBtn = document.getElementsByClassName('delete')[i];

                    editBtn.addEventListener('click', (e) => {
                        let note_uuid = e.target.id;
                        get_note(note_uuid);
                    })

                    deleteBtn.addEventListener('click', (e) => {
                        let note_uuid = e.target.id;
                        delete_note(note_uuid);
                    })
                }
            }
        }
        else{
            console.error('Some error occurred... cannot get notes! status:', this.status)
        }
    }
    xhr.send();
}

get_notes();

// Ajax function to get a note
const get_note = function(note_uuid) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/api/get_note/${note_uuid}/`, true);

    xhr.onload = function() {
        const data = JSON.parse(this.responseText);
        const note = data.note;

        // console.table(note);
        let note_uuidEdit = document.getElementById('note_uuidEdit');
        let titleEdit = document.getElementById('titleEdit');
        let descriptionEdit = document.getElementById('descriptionEdit');

        note_uuidEdit.value = note.note_uuid;
        titleEdit.value = note.title;
        descriptionEdit.value = note.description;

        $('#editModal').modal('show');
    }
    xhr.send();
}

// Close the edit modal making the edit form inputs empty
const closeModalBtns = document.getElementsByClassName('closeModal');
Array.from(closeModalBtns).forEach((element) => {
    element.addEventListener('click', () => {
        document.getElementById('edit-note-form').reset();
        let note_uuidEdit = document.getElementById('note_uuidEdit');
        note_uuidEdit.value = "";
        $('#editModal').modal('hide');
    })
})

// Ajax function to add a note
const addBtn = document.getElementById('addBtn');
addBtn.addEventListener('click', function() {
    const message = document.getElementById('message');
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/add_note/', true);

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    xhr.onload = function() {
        if (this.status === 200){
            const data = JSON.parse(this.responseText);
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
        }
        else{
            console.error('Some error occurred... cannot add your note! status:', this.status)
        }
    }
    xhr.send(formData);
})

// Ajax function to update a note
const updateBtn = document.getElementById('updateBtn');
updateBtn.addEventListener('click', function() {
    const message = document.getElementById('message');
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/update_note/', true);

    const formData = new FormData();
    formData.append('note_uuid', document.getElementById('note_uuidEdit').value);
    formData.append('title', document.getElementById('titleEdit').value);
    formData.append('description', document.getElementById('descriptionEdit').value);
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    xhr.onload = function() {
        if (this.status === 200){
            const data = JSON.parse(this.responseText);
            // console.table(data);

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
        }
        else{
            console.error('Some error occurred... cannot update your note! status:', this.status)
        }
    }
    xhr.send(formData);
})

// Ajax function to delete a note
const delete_note = (note_uuid) => {
    if (window.confirm("Are you sure, you want to delete this note ?")){
        const message = document.getElementById('message');
        const xhr = new XMLHttpRequest();
        xhr.open('post', '/api/delete_note/', true);

        const formData = new FormData();
        formData.append('note_uuid', note_uuid);
        formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

        xhr.onload = function() {
            if (this.status === 200){
                const data = JSON.parse(this.responseText);
                // console.table(data);

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
            }
            else{
                console.error('Some error occurred... cannot delete your note! status:', this.status)
            }
        }
        xhr.send(formData);
    }
}
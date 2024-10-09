document.addEventListener('DOMContentLoaded', function () {
    fetch('alumnos.json')
        .then(response => response.json())
        .then(data => {
            const cursosDropdown = document.getElementById('curso');
            const divisionesDropdown = document.getElementById('division');

            const validCourses = new Set();
            const validDivisions = new Set();
            data.forEach(alumno => {
                validCourses.add(alumno.curso);
                validDivisions.add(alumno.division);
            });

            validCourses.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso;
                option.textContent = curso;
                cursosDropdown.appendChild(option);
            });

            validDivisions.forEach(division => {
                const option = document.createElement('option');
                option.value = division;
                option.textContent = division;
                divisionesDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
});

document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const curso = document.getElementById('curso').value;
    const division = document.getElementById('division').value;
    const errorMessage = document.getElementById('error-message');

    fetch('alumnos.json')
        .then(response => response.json())
        .then(data => {
            const validAlumno = data.find(alumno => 
                alumno.nombre === nombre && 
                alumno.apellido === apellido && 
                alumno.curso === curso && 
                alumno.division === division
            );

            if (!validAlumno) {
                errorMessage.textContent = 'Los datos son incorrectos. Intente de nuevo.';
            } else {
                errorMessage.textContent = '';    
                
                const usuarioId = `${nombre.toLowerCase()}_${apellido.toLowerCase()}`;
                let escaneos = localStorage.getItem(usuarioId) ? parseInt(localStorage.getItem(usuarioId)) : 0;

                if (escaneos < 2) {
                    escaneos++;
                    localStorage.setItem(usuarioId, escaneos); 
                    window.location.href = `invitacion.html?nombre=${encodeURIComponent(nombre)}&apellido=${encodeURIComponent(apellido)}&grado=${encodeURIComponent(curso)}&division=${encodeURIComponent(division)}`;
                } else {
                    errorMessage.textContent = 'Ya has alcanzado el límite de acceso.';
                }
            }
        })
        .catch(error => console.error('Error al validar los datos:', error));
});
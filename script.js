<script>
  // Cargar estado desde LocalStorage
  function cargarEstado() {
    const datosGuardados = localStorage.getItem('ramosAprobados');
    if (!datosGuardados) return;
    const aprobados = JSON.parse(datosGuardados);
    const ramos = document.querySelectorAll('.ramo');
    ramos.forEach(ramo => {
      if (aprobados.includes(ramo.dataset.nombre)) {
        ramo.classList.add('aprobado');
      }
    });
  }

  // Guardar estado en LocalStorage
  function guardarEstado() {
    const aprobados = [];
    document.querySelectorAll('.ramo.aprobado').forEach(ramo => {
      aprobados.push(ramo.dataset.nombre);
    });
    localStorage.setItem('ramosAprobados', JSON.stringify(aprobados));
  }

  // Actualizar desbloqueo de ramos
  function actualizarEstados() {
    const ramos = document.querySelectorAll('.ramo');
    const aprobados = new Set();
    ramos.forEach(ramo => {
      if (ramo.classList.contains('aprobado')) {
        aprobados.add(ramo.dataset.nombre);
      }
    });

    ramos.forEach(ramo => {
      if (ramo.classList.contains('aprobado')) return;

      const prereqsRaw = ramo.dataset.prerequisitos;
      if (!prereqsRaw || prereqsRaw.trim() === '') {
        ramo.classList.add('desbloqueado');
        ramo.classList.remove('bloqueado');
      } else {
        const prereqs = prereqsRaw.split(',').map(p => p.trim());

        if (prereqs.includes('Semestres anteriores')) {
          const semestresPrevios = Array.from(document.querySelectorAll('.semestre[data-semestre]'))
            .filter(s => parseInt(s.dataset.semestre) < 10);
          let todosPreviosAprobados = semestresPrevios.every(semestre =>
            Array.from(semestre.querySelectorAll('.ramo')).every(r =>
              r.classList.contains('aprobado')
            )
          );
          if (todosPreviosAprobados) {
            ramo.classList.add('desbloqueado');
            ramo.classList.remove('bloqueado');
          } else {
            ramo.classList.add('bloqueado');
            ramo.classList.remove('desbloqueado');
          }
          return;
        }

        if (prereqs.includes('Semestre 7') || prereqs.includes('Semestre 8')) {
          let aprobado7 = Array.from(document.querySelectorAll('.semestre[data-semestre="7"] .ramo'))
            .every(r => r.classList.contains('aprobado'));
          let aprobado8 = Array.from(document.querySelectorAll('.semestre[data-semestre="8"] .ramo'))
            .every(r => r.classList.contains('aprobado'));

          if (aprobado7 && aprobado8) {
            ramo.classList.add('desbloqueado');
            ramo.classList.remove('bloqueado');
          } else {
            ramo.classList.add('bloqueado');
            ramo.classList.remove('desbloqueado');
          }
          return;
        }

        const todosAprobados = prereqs.every(p => aprobados.has(p));
        if (todosAprobados) {
          ramo.classList.add('desbloqueado');
          ramo.classList.remove('bloqueado');
        } else {
          ramo.classList.add('bloqueado');
          ramo.classList.remove('desbloqueado');
        }
      }
    });
  }

  // Click para aprobar/desaprobar
  document.getElementById('malla').addEventListener('click', e => {
    const el = e.target;
    if (!el.classList.contains('ramo')) return;
    if (el.classList.contains('bloqueado')) return;
    el.classList.toggle('aprobado');
    actualizarEstados();
    guardarEstado();
  });

  // Inicialización
  cargarEstado();
  actualizarEstados();
</script>

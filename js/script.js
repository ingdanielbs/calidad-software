$(document).ready(function() {
    // Variables globales
    const totalModules = 7;
    let currentModule = 1;
    let userProgress = {
        completedModules: [1],
        quizResults: {},
        lastVisited: new Date()
    };
    
    // Cargar datos del usuario desde localStorage si existen
    loadUserProgress();
    
    // Inicializar la interfaz
    loadModule(currentModule);
    updateProgressUI();
    
    // Manejar la navegación del sidebar
    $('#sidebar ul.components li a').on('click', function(e) {
        e.preventDefault();
        
        const moduleId = $(this).data('module');
        const moduleNumber = parseInt(moduleId.replace('module', ''));
        
        // Actualizar navegación
        $('#sidebar ul.components li').removeClass('active');
        $(this).parent().addClass('active');
        
        // Cargar el nuevo módulo
        currentModule = moduleNumber;
        loadModule(currentModule);
    });
    
    // Manejar el botón de colapsar sidebar
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });
    
    // Navegación con botones Anterior/Siguiente
    $('#prevModule').on('click', function() {
        if (currentModule > 1) {
            navigateToModule(currentModule - 1);
        }
    });
    
    $('#nextModule').on('click', function() {
        if (currentModule < totalModules) {
            navigateToModule(currentModule + 1);
        }
    });
    
    // Función para cargar un módulo
    function loadModule(moduleNumber) {
        // Actualizamos el título del módulo actual
        updateModuleTitle(moduleNumber);
        
        // Habilitamos o deshabilitamos los botones de navegación
        updateNavigationButtons(moduleNumber);
        
        // Actualizamos el estado activo del sidebar
        updateSidebarActive(moduleNumber);
        
        // Mostrar spinner mientras cargamos el contenido
        $('#module-content').html(`
            <div class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Cargando contenido...</p>
            </div>
        `);
        
        // Cargar el contenido del módulo
        $.ajax({
            url: `content/module${moduleNumber}.html`,
            type: 'GET',
            success: function(data) {
                $('#module-content').html(data);
                
                // Animar entrada del contenido
                $('#module-content').hide().fadeIn(300);
                
                // Inicializar cualquier funcionalidad específica del módulo
                initializeModuleSpecificFunctionality(moduleNumber);
                
                // Registrar esta visita en el progreso del usuario
                registerModuleVisit(moduleNumber);
            },
            error: function() {
                $('#module-content').html(`
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i> 
                        Error al cargar el contenido. Por favor, intenta nuevamente.
                    </div>
                `);
            }
        });
    }
    
    // Actualizar el título del módulo actual
    function updateModuleTitle(moduleNumber) {
        let title;
        switch(moduleNumber) {
            case 1: title = "Fundamentos de Calidad"; break;
            case 2: title = "Mapa de Procesos"; break;
            case 3: title = "Ciclo PHVA"; break;
            case 4: title = "Caracterización de Procesos"; break;
            case 5: title = "Evaluación de Conocimientos"; break;
            case 6: title = "Métricas de Calidad"; break;
            case 7: title = "Mejora Continua"; break;
            default: title = "Calidad de Software";
        }
        
        $('#current-module-title').text(title);
    }
    
    // Actualizar los botones de navegación
    function updateNavigationButtons(moduleNumber) {
        $('#prevModule').prop('disabled', moduleNumber <= 1);
        $('#nextModule').prop('disabled', moduleNumber >= totalModules);
    }
    
    // Actualizar el ítem activo en el sidebar
    function updateSidebarActive(moduleNumber) {
        $('#sidebar ul.components li').removeClass('active');
        $(`#sidebar ul.components li a[data-module="module${moduleNumber}"]`).parent().addClass('active');
    }
    
    // Navegación a un módulo específico
    function navigateToModule(moduleNumber) {
        currentModule = moduleNumber;
        loadModule(currentModule);
    }
    
    // Inicializar funcionalidades específicas de cada módulo
    function initializeModuleSpecificFunctionality(moduleNumber) {
        switch(moduleNumber) {
            case 1:
                // Funcionalidad para el módulo 1
                initializeModule1();
                break;
            case 2:
                // Funcionalidad para el módulo 2
                initializeModule2();
                break;
            case 3:
                // Funcionalidad para el módulo 3
                initializeModule3();
                break;
            case 4:
                // Funcionalidad para el módulo 4
                initializeModule4();
                break;
            case 5:
                // Funcionalidad para el módulo 5 (evaluación)
                initializeQuiz();
                break;
            case 6:
                // Funcionalidad para el módulo 6 (Métricas de Calidad)
                initializeModule6();
                break;
            case 7:
                // Funcionalidad para el módulo 7 (Mejora Continua)
                initializeModule7();
                break;
        }
    }
    
    // Inicializar Módulo 1 - Fundamentos de Calidad
    function initializeModule1() {
        // Ejemplo: Inicializar tooltips o popovers específicos
        $('[data-bs-toggle="tooltip"]').tooltip();
        
        // Manejar la interacción con los elementos del módulo 1
        $('.dimension-card').on('click', function() {
            $(this).toggleClass('bg-light');
        });
    }
    
    // Inicializar Módulo 2 - Mapa de Procesos
    function initializeModule2() {
        // Inicializar funcionalidad de arrastrar y soltar si existe
        if ($('.draggable-item').length > 0) {
            initializeDragAndDrop();
        }
    }
    
    // Inicializar Módulo 3 - Ciclo PHVA
    function initializeModule3() {
        // Animación para los pasos del ciclo PHVA al hacer clic
        $('.phva-step').on('click', function() {
            const stepId = $(this).data('step-id');
            
            // Destacar el paso actual
            $('.phva-step').removeClass('active');
            $(this).addClass('active');
            
            // Mostrar la descripción detallada
            $('.phva-description').hide();
            $(`#phva-description-${stepId}`).fadeIn();
        });
    }
    
    // Inicializar Módulo 4 - Caracterización de Procesos
    function initializeModule4() {
        // Código para manejar las actividades interactivas del módulo 4
        $('.process-element').on('click', function() {
            // Mostrar información adicional
            const elementId = $(this).data('element-id');
            $('.element-info').hide();
            $(`#element-info-${elementId}`).fadeIn();
        });
    }
    
    // Inicializar el quiz del módulo 5
    function initializeQuiz() {
        // Verificar si existe un formulario de quiz
        if ($('#quality-assessment').length > 0) {
            // Manejar el envío del formulario
            $('#quality-assessment').on('submit', function(e) {
                e.preventDefault();
                
                // Recopilar las respuestas
                const answers = {};
                const totalQuestions = $('.quiz-question').length;
                let correctAnswers = 0;
                
                // Para cada pregunta, verificar si la respuesta es correcta
                for (let i = 1; i <= totalQuestions; i++) {
                    const selectedAnswer = $(`input[name="q${i}"]:checked`).val();
                    
                    // Si no se seleccionó ninguna respuesta
                    if (!selectedAnswer) {
                        answers[`q${i}`] = {
                            selected: null,
                            correct: false
                        };
                        continue;
                    }
                    
                    // Verificar si la respuesta es correcta
                    const isCorrect = selectedAnswer === 'correct';
                    
                    // Guardar la respuesta
                    answers[`q${i}`] = {
                        selected: selectedAnswer,
                        correct: isCorrect
                    };
                    
                    // Actualizar el contador de respuestas correctas
                    if (isCorrect) correctAnswers++;
                    
                    // Resaltar visualmente respuestas correctas e incorrectas
                    if (isCorrect) {
                        $(`input[name="q${i}"]:checked`).closest('.form-check').addClass('answer-correct');
                    } else {
                        $(`input[name="q${i}"]:checked`).closest('.form-check').addClass('answer-incorrect');
                        $(`input[name="q${i}"][value="correct"]`).closest('.form-check').addClass('answer-correct');
                    }
                }
                
                // Calcular la puntuación
                const score = Math.round((correctAnswers / totalQuestions) * 100);
                
                // Mostrar el resultado
                $('.quiz-result').html(`
                    <div class="alert ${score >= 70 ? 'alert-success' : 'alert-warning'}">
                        <h4 class="alert-heading">
                            ${score >= 70 ? '<i class="fas fa-check-circle me-2"></i> ¡Bien hecho!' : '<i class="fas fa-exclamation-triangle me-2"></i> Necesitas repasar'}
                        </h4>
                        <p>Has respondido correctamente ${correctAnswers} de ${totalQuestions} preguntas.</p>
                        <hr>
                        <p class="mb-0">Puntuación final: <strong>${score}%</strong></p>
                    </div>
                    <button type="button" class="btn btn-primary" id="reviewQuiz">Revisar Respuestas</button>
                    ${score < 70 ? '<button type="button" class="btn btn-outline-primary ms-2" id="retakeQuiz">Reintentar</button>' : ''}
                `).fadeIn();
                
                // Guardar los resultados en el progreso del usuario
                userProgress.quizResults['module5'] = {
                    score: score,
                    correctAnswers: correctAnswers,
                    totalQuestions: totalQuestions,
                    date: new Date()
                };
                
                // Si la puntuación es suficiente, marcar el módulo como completado
                if (score >= 70 && !userProgress.completedModules.includes(5)) {
                    userProgress.completedModules.push(5);
                }
                
                // Guardar el progreso actualizado
                saveUserProgress();
                
                // Actualizar la interfaz de progreso
                updateProgressUI();
                
                // Manejar el botón de reintentar
                $('#retakeQuiz').on('click', function() {
                    $('.quiz-result').hide();
                    $('.form-check').removeClass('answer-correct answer-incorrect');
                    $('#quality-assessment')[0].reset();
                });
                
                // Manejar el botón de revisar
                $('#reviewQuiz').on('click', function() {
                    $('html, body').animate({
                        scrollTop: $('.quiz-question:first').offset().top - 100
                    }, 500);
                });
            });
        }
    }
    
    // Funcionalidad de arrastrar y soltar
    function initializeDragAndDrop() {
        $('.draggable-item').draggable({
            revert: 'invalid',
            zIndex: 100,
            cursor: 'move'
        });
        
        $('.drop-zone').droppable({
            accept: '.draggable-item',
            hoverClass: 'highlight',
            drop: function(event, ui) {
                const draggableElement = ui.draggable;
                const droppedOn = $(this);
                
                // Verificar si el elemento fue colocado en la zona correcta
                const isCorrect = draggableElement.data('category') === droppedOn.data('category');
                
                // Ajustar la posición del elemento
                draggableElement.detach().css({top: 0, left: 0}).appendTo(droppedOn);
                
                // Dar retroalimentación visual
                if (isCorrect) {
                    draggableElement.addClass('border-success');
                    droppedOn.addClass('border-success');
                } else {
                    draggableElement.addClass('border-danger');
                }
                
                // Verificar si se completó la actividad
                checkDragDropCompletion();
            }
        });
    }
    
    // Verificar si se completó correctamente la actividad de arrastrar y soltar
    function checkDragDropCompletion() {
        let allCorrect = true;
        const totalZones = $('.drop-zone').length;
        let filledZones = 0;
        
        $('.drop-zone').each(function() {
            const zone = $(this);
            const items = zone.find('.draggable-item');
            
            if (items.length > 0) {
                filledZones++;
                
                // Verificar si todos los elementos en esta zona son correctos
                items.each(function() {
                    if ($(this).data('category') !== zone.data('category')) {
                        allCorrect = false;
                    }
                });
            }
        });
        
        // Si todas las zonas están llenas y todos los elementos están colocados correctamente
        if (filledZones === totalZones && allCorrect) {
            // Mostrar mensaje de éxito
            $('#drag-drop-feedback').html(`
                <div class="alert alert-success mt-3">
                    <i class="fas fa-check-circle me-2"></i> ¡Excelente! Has completado correctamente la actividad.
                </div>
            `).fadeIn();
            
            // Registrar la actividad como completada
            if (!userProgress.completedActivities) {
                userProgress.completedActivities = [];
            }
            
            if (!userProgress.completedActivities.includes('drag-drop-module2')) {
                userProgress.completedActivities.push('drag-drop-module2');
                saveUserProgress();
            }
        }
    }
    
    // Registrar la visita a un módulo
    function registerModuleVisit(moduleNumber) {
        // Si el módulo no está en completedModules, agregarlo
        if (!userProgress.completedModules.includes(moduleNumber)) {
            userProgress.completedModules.push(moduleNumber);
            saveUserProgress();
            updateProgressUI();
        }
        
        // Actualizar última visita
        userProgress.lastVisited = new Date();
        saveUserProgress();
    }
    
    // Guardar el progreso del usuario en localStorage
    function saveUserProgress() {
        localStorage.setItem('calidadSoftwareProgress', JSON.stringify(userProgress));
    }
    
    // Cargar el progreso del usuario desde localStorage
    function loadUserProgress() {
        const savedProgress = localStorage.getItem('calidadSoftwareProgress');
        if (savedProgress) {
            try {
                userProgress = JSON.parse(savedProgress);
                
                // Convertir las fechas de string a Date
                userProgress.lastVisited = new Date(userProgress.lastVisited);
                
                if (userProgress.quizResults) {
                    for (let module in userProgress.quizResults) {
                        if (userProgress.quizResults[module].date) {
                            userProgress.quizResults[module].date = new Date(userProgress.quizResults[module].date);
                        }
                    }
                }
                
            } catch (e) {
                console.error('Error parsing user progress:', e);
                userProgress = {
                    completedModules: [1],
                    quizResults: {},
                    lastVisited: new Date()
                };
            }
        }
    }
    
    // Actualizar la interfaz según el progreso del usuario
    function updateProgressUI() {
        // Actualizar la barra de progreso
        const progressPercentage = Math.round((userProgress.completedModules.length / totalModules) * 100);
        $('.progress-bar').css('width', `${progressPercentage}%`).attr('aria-valuenow', progressPercentage).text(`${progressPercentage}%`);
        
        // Actualizar la lista de módulos completados
        for (let i = 1; i <= totalModules; i++) {
            const moduleItem = $(`.list-group-item:nth-child(${i})`);
            const moduleIcon = moduleItem.find('.badge');
            
            if (userProgress.completedModules.includes(i)) {
                moduleIcon.removeClass('bg-secondary').addClass('bg-primary');
                moduleIcon.html('<i class="fas fa-check"></i>');
            } else {
                moduleIcon.removeClass('bg-primary').addClass('bg-secondary');
                moduleIcon.html('<i class="fas fa-minus"></i>');
            }
        }
    }
    
    // Funciones de inicialización para cada módulo
    function initializeModule6() {
        console.log("Inicializando módulo 6: Metodologías de Desarrollo");
        // Marcar este módulo como completado cuando el usuario lo visita
        if (!userProgress.completedModules.includes(6)) {
            userProgress.completedModules.push(6);
            saveUserProgress();
            updateProgressUI();
        }
    }
    
    function initializeModule7() {
        console.log("Inicializando módulo 7: Herramientas para la Gestión de Calidad");
        // Marcar este módulo como completado cuando el usuario lo visita
        if (!userProgress.completedModules.includes(7)) {
            userProgress.completedModules.push(7);
            saveUserProgress();
            updateProgressUI();
        }
    }

    // Inicializar Módulo 6 - Métricas de Calidad
    function initializeModule6() {
        // Inicializar los componentes interactivos del módulo
        $('.metric-card').on('click', function() {
            $(this).toggleClass('selected');
            
            // Mostrar detalles de la métrica seleccionada
            const metricId = $(this).data('metric-id');
            $('.metric-details').hide();
            $(`#metric-detail-${metricId}`).fadeIn();
        });
        
        // Inicializar tooltips específicos
        $('[data-bs-toggle="tooltip"]').tooltip();
    }
    
    // Inicializar Módulo 7 - Mejora Continua
    function initializeModule7() {
        // Inicializar los componentes interactivos del módulo
        $('.improvement-step').on('click', function() {
            const stepId = $(this).data('step-id');
            
            // Destacar el paso actual
            $('.improvement-step').removeClass('active');
            $(this).addClass('active');
            
            // Mostrar la descripción detallada
            $('.improvement-description').hide();
            $(`#improvement-description-${stepId}`).fadeIn();
        });
        
        // Inicializar la funcionalidad de ejemplo interactivo si existe
        if ($('#improvement-simulation').length > 0) {
            initializeImprovementSimulation();
        }
    }
    
    // Función auxiliar para la simulación de mejora continua
    function initializeImprovementSimulation() {
        $('#start-simulation').on('click', function() {
            // Lógica para iniciar la simulación
            $(this).prop('disabled', true);
            
            // Mostrar los pasos de la simulación secuencialmente
            $('.simulation-step').hide();
            
            $('.simulation-step').each(function(index) {
                const step = $(this);
                setTimeout(function() {
                    step.fadeIn(500);
                }, index * 1500);
            });
            
            // Habilitar el botón de reinicio después de la simulación
            setTimeout(function() {
                $('#reset-simulation').prop('disabled', false);
            }, $('.simulation-step').length * 1500);
        });
        
        $('#reset-simulation').on('click', function() {
            // Reiniciar la simulación
            $('.simulation-step').hide();
            $(this).prop('disabled', true);
            $('#start-simulation').prop('disabled', false);
        });
    }
});
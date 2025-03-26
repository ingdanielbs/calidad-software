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
        // Inicializar tooltips
        $('[data-bs-toggle="tooltip"]').tooltip();
        
        // Manejar la interacción con los elementos del módulo 1
        $('.dimension-card').on('click', function() {
            $(this).toggleClass('bg-light');
        });
        
        // Manejar el botón "Comprobar Respuestas" de la actividad "Relaciona Conceptos"
        $('#check-activity').on('click', function() {
            // Definir las respuestas correctas
            const correctAnswers = {
                func1: true,   // Precisión en los resultados
                func2: true,   // Interoperabilidad con otros sistemas
                func_wrong1: false, // Velocidad de procesamiento (incorrecto)
                func_wrong2: false, // Diseño visual atractivo (incorrecto)
                rel1: true,    // Tolerancia a fallos
                rel2: true,    // Capacidad de recuperación
                rel_wrong1: false, // Instalación rápida (incorrecto)
                rel_wrong2: false, // Compatibilidad con múltiples idiomas (incorrecto)
                usa1: true,    // Facilidad de aprendizaje
                usa2: true,    // Satisfacción del usuario
                usa_wrong1: false, // Optimización de código (incorrecto)
                usa_wrong2: false, // Cifrado de datos (incorrecto)
                eff1: true,    // Tiempo de respuesta
                eff2: true,    // Uso de recursos
                eff_wrong1: false, // Documentación completa (incorrecto)
                eff_wrong2: false  // Seguridad ante ataques externos (incorrecto)
            };
            
            // Verificar las respuestas del usuario
            let correctCount = 0;
            let totalCorrectOptions = 8; // Total de opciones que deberían estar marcadas
            let totalResponses = 0;
            let incorrectSelections = 0;
            
            // Verificar todas las opciones
            for (let id in correctAnswers) {
                const isChecked = $(`#${id}`).is(':checked');
                const shouldBeChecked = correctAnswers[id];
                
                // Dar retroalimentación visual
                if (isChecked) {
                    totalResponses++;
                    if (shouldBeChecked) {
                        // Respuesta correcta
                        $(`#${id}`).closest('.form-check').addClass('text-success fw-bold');
                        correctCount++;
                    } else {
                        // Marcó una que no debería
                        $(`#${id}`).closest('.form-check').addClass('text-danger');
                        incorrectSelections++;
                    }
                } else if (shouldBeChecked) {
                    // No marcó una que debería
                    $(`#${id}`).closest('.form-check').addClass('text-danger');
                }
            }
            
            // Calcular puntuación - ahora basada en aciertos y con penalización por errores
            const score = Math.max(0, (correctCount / totalCorrectOptions) * 100 - (incorrectSelections * 12.5));
            
            // Mostrar resultado
            let resultMessage = '';
            if (score >= 70) {
                resultMessage = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i> ¡Excelente! Has relacionado correctamente los conceptos.
                        <p class="mt-2 mb-0">Puntuación: ${Math.round(score)}%</p>
                    </div>
                `;
            } else {
                resultMessage = `
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i> Revisa nuevamente los conceptos.
                        <p class="mt-2 mb-0">Puntuación: ${Math.round(score)}%</p>
                    </div>
                `;
            }
            
            $('#activity-result').html(resultMessage).fadeIn();
            
            // Registrar este progreso
            if (!userProgress.activities) {
                userProgress.activities = {};
            }
            
            userProgress.activities['module1_relaciona'] = {
                completed: score >= 70,
                score: Math.round(score),
                date: new Date()
            };
            
            saveUserProgress();
        });
        
        // Botón para reiniciar la actividad si ya existe
        if ($('#reset-activity').length) {
            $('#reset-activity').on('click', function() {
                // Quitar todas las clases de retroalimentación
                $('.form-check').removeClass('text-success text-danger fw-bold');
                // Desmarcar todos los checkboxes
                $('input[type="checkbox"]').prop('checked', false);
                // Ocultar el resultado
                $('#activity-result').hide();
            });
        } else {
            // Añadir botón de reinicio después del botón de comprobación
            $('#check-activity').after('<button id="reset-activity" class="btn btn-outline-secondary mt-3 ms-2">Reiniciar</button>');
            
            // Manejar el evento del nuevo botón
            $('#reset-activity').on('click', function() {
                // Quitar todas las clases de retroalimentación
                $('.form-check').removeClass('text-success text-danger fw-bold');
                // Desmarcar todos los checkboxes
                $('input[type="checkbox"]').prop('checked', false);
                // Ocultar el resultado
                $('#activity-result').hide();
            });
        }
    }
    
    // Inicializar Módulo 2 - Mapa de Procesos
    function initializeModule2() {
        // Inicializar funcionalidad de arrastrar y soltar si existe
        if ($('.draggable-item').length > 0) {
            initializeDragAndDrop();
        }
        
        // Implementar la verificación de la actividad de clasificación de procesos
        $('#check-process-classification').on('click', function() {
            let correctAnswers = 0;
            let totalQuestions = $('.process-type').length;
            
            // Verificar cada respuesta
            $('.process-type').each(function() {
                const selectedValue = $(this).val();
                const correctValue = $(this).data('correct');
                
                // Quitar clases previas
                $(this).removeClass('is-valid is-invalid');
                
                // Verificar si es correcta
                if (selectedValue === correctValue) {
                    $(this).addClass('is-valid');
                    correctAnswers++;
                } else if (selectedValue !== '') {
                    $(this).addClass('is-invalid');
                }
            });
            
            // Calcular porcentaje
            const score = Math.round((correctAnswers / totalQuestions) * 100);
            
            // Mostrar resultado
            let resultMessage = '';
            if (score === 100) {
                resultMessage = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i> ¡Excelente! Has clasificado correctamente todos los procesos.
                        <p class="mt-2 mb-0">Puntuación: ${score}%</p>
                    </div>
                `;
            } else if (score >= 60) {
                resultMessage = `
                    <div class="alert alert-warning">
                        <i class="fas fa-check-circle me-2"></i> ¡Bien! Has clasificado correctamente ${correctAnswers} de ${totalQuestions} procesos.
                        <p class="mt-2 mb-0">Puntuación: ${score}%</p>
                    </div>
                `;
            } else {
                resultMessage = `
                    <div class="alert alert-danger">
                        <i class="fas fa-times-circle me-2"></i> Necesitas repasar más los conceptos. Has clasificado correctamente ${correctAnswers} de ${totalQuestions} procesos.
                        <p class="mt-2 mb-0">Puntuación: ${score}%</p>
                    </div>
                `;
            }
            
            // Mostrar el mensaje de resultado
            $('#process-classification-result').html(resultMessage).fadeIn();
            
            // Registrar el progreso del usuario
            if (!userProgress.activities) {
                userProgress.activities = {};
            }
            
            userProgress.activities['module2_classification'] = {
                completed: score >= 60,
                score: score,
                date: new Date()
            };
            
            saveUserProgress();
        });
        
        // Agregar botón para reiniciar la actividad
        if ($('#reset-process-classification').length === 0) {
            $('#check-process-classification').after('<button id="reset-process-classification" class="btn btn-outline-secondary mt-3 ms-2">Reiniciar</button>');
            
            // Manejar el evento del botón de reinicio
            $('#reset-process-classification').on('click', function() {
                // Resetear todas las selecciones
                $('.process-type').val('').removeClass('is-valid is-invalid');
                // Ocultar el resultado
                $('#process-classification-result').hide();
            });
        }
    }
    
    // Inicializar Módulo 3 - Ciclo PHVA
    function initializeModule3() {
        // Animación para los pasos del ciclo PHVA al hacer clic
        $('.phva-step').on('click', function() {
            const phase = $(this).data('phase');
            
            // Destacar el paso actual
            $('.phva-step').removeClass('active');
            $(this).addClass('active');
            
            // Mostrar la descripción detallada
            let detailContent = '';
            
            switch(phase) {
                case 'planear':
                    detailContent = `
                        <div class="card border-success">
                            <div class="card-header bg-success text-white">
                                <h5 class="mb-0">Fase de Planear</h5>
                            </div>
                            <div class="card-body">
                                <p>En esta fase se establecen objetivos y se identifican los procesos necesarios para lograr los resultados esperados.</p>
                                <h6>Herramientas útiles:</h6>
                                <ul>
                                    <li>Análisis FODA</li>
                                    <li>Diagrama de Ishikawa</li>
                                    <li>Análisis de requisitos</li>
                                    <li>Benchmarking</li>
                                </ul>
                            </div>
                        </div>
                    `;
                    break;
                case 'hacer':
                    detailContent = `
                        <div class="card border-info">
                            <div class="card-header bg-info text-white">
                                <h5 class="mb-0">Fase de Hacer</h5>
                            </div>
                            <div class="card-body">
                                <p>En esta fase se implementan los procesos planificados, siguiendo una metodología estructurada.</p>
                                <h6>Consideraciones importantes:</h6>
                                <ul>
                                    <li>Asignar recursos adecuados</li>
                                    <li>Capacitar al personal involucrado</li>
                                    <li>Documentar las acciones realizadas</li>
                                    <li>Seguir el plan establecido</li>
                                </ul>
                            </div>
                        </div>
                    `;
                    break;
                case 'verificar':
                    detailContent = `
                        <div class="card border-warning">
                            <div class="card-header bg-warning text-dark">
                                <h5 class="mb-0">Fase de Verificar</h5>
                            </div>
                            <div class="card-body">
                                <p>En esta fase se realiza el seguimiento y medición de los procesos respecto a los objetivos planteados.</p>
                                <h6>Métodos de verificación:</h6>
                                <ul>
                                    <li>Auditorías internas</li>
                                    <li>Análisis de indicadores de desempeño</li>
                                    <li>Retroalimentación del cliente</li>
                                    <li>Pruebas y validaciones</li>
                                </ul>
                            </div>
                        </div>
                    `;
                    break;
                case 'actuar':
                    detailContent = `
                        <div class="card border-danger">
                            <div class="card-header bg-danger text-white">
                                <h5 class="mb-0">Fase de Actuar</h5>
                            </div>
                            <div class="card-body">
                                <p>En esta fase se toman acciones para mejorar continuamente el desempeño de los procesos.</p>
                                <h6>Acciones típicas:</h6>
                                <ul>
                                    <li>Implementar mejoras</li>
                                    <li>Estandarizar cambios exitosos</li>
                                    <li>Establecer nuevos objetivos</li>
                                    <li>Iniciar un nuevo ciclo PHVA</li>
                                </ul>
                            </div>
                        </div>
                    `;
                    break;
                default:
                    detailContent = '<p>Selecciona una fase para ver sus detalles.</p>';
            }
            
            $('#phva-details').html(detailContent).hide().fadeIn();
        });
        
        // Manejar el envío del formulario de la actividad PHVA
        $('#phva-activity-form').on('submit', function(e) {
            e.preventDefault();
            
            // Verificar las respuestas seleccionadas
            const planearAnswer = $('input[name="planear"]:checked').val();
            const hacerAnswer = $('input[name="hacer"]:checked').val();
            const verificarAnswer = $('input[name="verificar"]:checked').val();
            const actuarAnswer = $('input[name="actuar"]:checked').val();
            
            // Verificar si se respondieron todas las preguntas
            if (!planearAnswer || !hacerAnswer || !verificarAnswer || !actuarAnswer) {
                $('#phva-activity-result').html(`
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i> Por favor, responde todas las preguntas antes de comprobar.
                    </div>
                `).fadeIn();
                return;
            }
            
            // Contar respuestas correctas
            let correctCount = 0;
            let totalQuestions = 4;
            
            // Verificar cada respuesta y dar retroalimentación visual
            if (planearAnswer === 'correct') {
                correctCount++;
                $('input[id="planear2"]').closest('.form-check').addClass('text-success fw-bold');
            } else {
                $('input[name="planear"]:checked').closest('.form-check').addClass('text-danger');
                $('input[id="planear2"]').closest('.form-check').addClass('text-success');
            }
            
            if (hacerAnswer === 'correct') {
                correctCount++;
                $('input[id="hacer3"]').closest('.form-check').addClass('text-success fw-bold');
            } else {
                $('input[name="hacer"]:checked').closest('.form-check').addClass('text-danger');
                $('input[id="hacer3"]').closest('.form-check').addClass('text-success');
            }
            
            if (verificarAnswer === 'correct') {
                correctCount++;
                $('input[id="verificar1"]').closest('.form-check').addClass('text-success fw-bold');
            } else {
                $('input[name="verificar"]:checked').closest('.form-check').addClass('text-danger');
                $('input[id="verificar1"]').closest('.form-check').addClass('text-success');
            }
            
            if (actuarAnswer === 'correct') {
                correctCount++;
                $('input[id="actuar2"]').closest('.form-check').addClass('text-success fw-bold');
            } else {
                $('input[name="actuar"]:checked').closest('.form-check').addClass('text-danger');
                $('input[id="actuar2"]').closest('.form-check').addClass('text-success');
            }
            
            // Calcular porcentaje de acierto
            const score = Math.round((correctCount / totalQuestions) * 100);
            
            // Mostrar resultado
            let resultMessage = '';
            if (score === 100) {
                resultMessage = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i> ¡Excelente! Has identificado correctamente todas las acciones del ciclo PHVA.
                        <p class="mt-2 mb-0">Puntuación: ${score}%</p>
                    </div>
                `;
            } else if (score >= 75) {
                resultMessage = `
                    <div class="alert alert-info">
                        <i class="fas fa-check-circle me-2"></i> ¡Muy bien! Has comprendido la mayoría de las fases del ciclo PHVA.
                        <p class="mt-2 mb-0">Puntuación: ${score}%</p>
                    </div>
                `;
            } else if (score >= 50) {
                resultMessage = `
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i> Vas por buen camino, pero necesitas repasar algunos conceptos del ciclo PHVA.
                        <p class="mt-2 mb-0">Puntuación: ${score}%</p>
                    </div>
                `;
            } else {
                resultMessage = `
                    <div class="alert alert-danger">
                        <i class="fas fa-times-circle me-2"></i> Te recomendamos revisar nuevamente los conceptos del ciclo PHVA.
                        <p class="mt-2 mb-0">Puntuación: ${score}%</p>
                    </div>
                `;
            }
            
            // Mostrar mensaje de resultado
            $('#phva-activity-result').html(resultMessage).fadeIn();
            
            // Registrar el progreso del usuario
            if (!userProgress.activities) {
                userProgress.activities = {};
            }
            
            userProgress.activities['module3_phva'] = {
                completed: score >= 75,
                score: score,
                date: new Date()
            };
            
            saveUserProgress();
            
            // Deshabilitar el botón de enviar para evitar múltiples envíos
            $(this).find('button[type="submit"]').prop('disabled', true);
            
            // Agregar botón para reintentar
            if ($('#reset-phva-activity').length === 0) {
                $('#phva-activity-result').after('<button id="reset-phva-activity" class="btn btn-outline-secondary mt-3">Reintentar</button>');
                
                // Manejar clic en el botón de reintentar
                $('#reset-phva-activity').on('click', function() {
                    // Limpiar selecciones y retroalimentación visual
                    $('input[type="radio"]').prop('checked', false);
                    $('.form-check').removeClass('text-success text-danger fw-bold');
                    $('#phva-activity-result').hide();
                    $('#phva-activity-form').find('button[type="submit"]').prop('disabled', false);
                    $(this).remove();
                });
            }
        });
    }
    
    // Inicializar Módulo 4 - Caracterización de Procesos
    function initializeModule4() {
        // Manejar la interacción con los elementos del módulo 4
        $('.process-element').on('click', function() {
            // Mostrar información adicional
            const elementId = $(this).data('element-id');
            $('.element-info').hide();
            $(`#element-info-${elementId}`).fadeIn();
        });

        // Implementar la verificación de la actividad de identificación de elementos
        $('#characterization-elements-form').on('submit', function(e) {
            e.preventDefault();
            
            let correctAnswers = 0;
            let totalQuestions = $('.element-type').length;
            
            // Verificar cada respuesta
            $('.element-type').each(function() {
                const selectedValue = $(this).val();
                const correctValue = $(this).data('correct');
                
                // Quitar clases previas
                $(this).removeClass('is-valid is-invalid');
                
                // Verificar si es correcta
                if (selectedValue === correctValue) {
                    $(this).addClass('is-valid');
                    correctAnswers++;
                } else if (selectedValue !== '') {
                    $(this).addClass('is-invalid');
                }
            });
            
            // Calcular porcentaje
            const score = Math.round((correctAnswers / totalQuestions) * 100);
            
            // Mostrar resultado
            let resultMessage = '';
            if (score === 100) {
                resultMessage = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i> ¡Excelente! Has identificado correctamente todos los elementos de caracterización.
                        <p class="mt-2 mb-0">Puntuación: ${score}%</p>
                    </div>
                `;
            } else if (score >= 60) {
                resultMessage = `
                    <div class="alert alert-warning">
                        <i class="fas fa-check-circle me-2"></i> ¡Bien! Has identificado correctamente ${correctAnswers} de ${totalQuestions} elementos.
                        <p class="mt-2 mb-0">Puntuación: ${score}%</p>
                    </div>
                `;
            } else {
                resultMessage = `
                    <div class="alert alert-danger">
                        <i class="fas fa-times-circle me-2"></i> Necesitas repasar los conceptos de caracterización de procesos. Has identificado correctamente ${correctAnswers} de ${totalQuestions} elementos.
                        <p class="mt-2 mb-0">Puntuación: ${score}%</p>
                    </div>
                `;
            }
            
            // Mostrar el mensaje de resultado
            $('#characterization-result').html(resultMessage).fadeIn();
            
            // Registrar el progreso del usuario
            if (!userProgress.activities) {
                userProgress.activities = {};
            }
            
            userProgress.activities['module4_elements'] = {
                completed: score >= 60,
                score: score,
                date: new Date()
            };
            
            saveUserProgress();
        });
        
        // Agregar botón para reiniciar la actividad
        if ($('#reset-characterization-elements').length === 0) {
            $('#characterization-elements-form button[type="submit"]').after('<button id="reset-characterization-elements" class="btn btn-outline-secondary mt-3 ms-2">Reiniciar</button>');
            
            // Manejar el evento del botón de reinicio
            $('#reset-characterization-elements').on('click', function(e) {
                e.preventDefault();
                // Resetear todas las selecciones
                $('.element-type').val('').removeClass('is-valid is-invalid');
                // Ocultar el resultado
                $('#characterization-result').hide();
            });
        }
    }
    
    // Inicializar el quiz del módulo 5
    function initializeQuiz() {
        // Verificar si existe el formulario de evaluación
        if ($('#knowledge-evaluation').length > 0) {
            // Manejar el envío del formulario de evaluación
            $('#knowledge-evaluation').on('submit', function(e) {
                e.preventDefault();
                
                // Recopilar las respuestas
                const answers = {};
                const totalQuestions = 10; // Total de preguntas en el formulario
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
                        $(`input[name="q${i}"]:checked`).closest('.form-check').addClass('text-success fw-bold');
                    } else {
                        $(`input[name="q${i}"]:checked`).closest('.form-check').addClass('text-danger');
                        $(`input[name="q${i}"][value="correct"]`).closest('.form-check').addClass('text-success');
                    }
                }
                
                // Calcular la puntuación
                const score = Math.round((correctAnswers / totalQuestions) * 100);
                
                // Mostrar el resultado
                let resultMessage = '';
                if (score >= 80) {
                    resultMessage = `
                        <div class="alert alert-success">
                            <h4 class="alert-heading"><i class="fas fa-check-circle me-2"></i> ¡Excelente!</h4>
                            <p>Has demostrado un conocimiento sólido sobre los conceptos de calidad de software.</p>
                            <hr>
                            <p class="mb-0">Has respondido correctamente ${correctAnswers} de ${totalQuestions} preguntas.</p>
                            <p class="mb-0">Puntuación final: <strong>${score}%</strong></p>
                        </div>
                    `;
                } else if (score >= 70) {
                    resultMessage = `
                        <div class="alert alert-info">
                            <h4 class="alert-heading"><i class="fas fa-check-circle me-2"></i> ¡Buen trabajo!</h4>
                            <p>Tienes un buen entendimiento de los conceptos de calidad de software.</p>
                            <hr>
                            <p class="mb-0">Has respondido correctamente ${correctAnswers} de ${totalQuestions} preguntas.</p>
                            <p class="mb-0">Puntuación final: <strong>${score}%</strong></p>
                        </div>
                    `;
                } else if (score >= 60) {
                    resultMessage = `
                        <div class="alert alert-warning">
                            <h4 class="alert-heading"><i class="fas fa-exclamation-triangle me-2"></i> Aprobado</h4>
                            <p>Has aprobado la evaluación, pero es recomendable reforzar algunos conceptos.</p>
                            <hr>
                            <p class="mb-0">Has respondido correctamente ${correctAnswers} de ${totalQuestions} preguntas.</p>
                            <p class="mb-0">Puntuación final: <strong>${score}%</strong></p>
                        </div>
                    `;
                } else {
                    resultMessage = `
                        <div class="alert alert-danger">
                            <h4 class="alert-heading"><i class="fas fa-times-circle me-2"></i> Necesitas repasar</h4>
                            <p>Es recomendable repasar los módulos anteriores para reforzar los conceptos clave.</p>
                            <hr>
                            <p class="mb-0">Has respondido correctamente ${correctAnswers} de ${totalQuestions} preguntas.</p>
                            <p class="mb-0">Puntuación final: <strong>${score}%</strong></p>
                        </div>
                    `;
                }
                
                // Agregar botones para revisar y reintentar
                resultMessage += `
                    <button type="button" class="btn btn-primary" id="reviewQuiz">Revisar Respuestas</button>
                    ${score < 70 ? '<button type="button" class="btn btn-outline-primary ms-2" id="retakeQuiz">Reintentar</button>' : ''}
                `;
                
                // Mostrar resultado
                $('.quiz-result').html(resultMessage).fadeIn();
                
                // Guardar los resultados en el progreso del usuario
                if (!userProgress.quizResults) {
                    userProgress.quizResults = {};
                }
                
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
                
                // Deshabilitar el botón de envío para evitar múltiples envíos
                $(this).find('button[type="submit"]').prop('disabled', true);
                
                // Manejar el botón de reintentar
                $('#retakeQuiz').on('click', function() {
                    $('.quiz-result').hide();
                    $('.form-check').removeClass('text-success text-danger fw-bold');
                    $('#knowledge-evaluation')[0].reset();
                    $('#knowledge-evaluation').find('button[type="submit"]').prop('disabled', false);
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
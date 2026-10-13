import { Link } from 'react-router-dom';

// Página de Inicio: presentación de la clínica, servicios, equipo y suscripción
export default function Inicio() {
  // Al enviar el correo de suscripción muestro un aviso y limpio el formulario
  const suscribir = (e) => {
    e.preventDefault();
    alert('¡Mantente atento/a a tu correo! Pronto nos pondremos en contacto contigo para responder tus preguntas y ayudarte con tus consultas.');
    e.target.reset();
  };

  return (
    <>

              {/* Hero Section */}
              <section className="hero-section text-white text-center py-5 d-flex align-items-center">
                  <div className="container py-4">
                      <div className="row justify-content-center">
                          <div className="col-lg-8">
                              <span className="badge badge-custom mb-3 px-3 py-2 text-uppercase fw-bold">Atención Integral en Rancagua</span>
                              <h1 className="display-4 fw-bold mb-3">Cuidamos de tus mascotas con vocación y tecnología</h1>
                              <p className="lead mb-4 text-light">Desde 2009 brindando atención médica, cirugías, vacunación y seguimiento clínico a perros, gatos y animales exóticos.</p>
                              <div className="d-flex justify-content-center gap-3 flex-wrap">
                                  <Link to="/solicitar-cita" className="btn btn-secondary-custom btn-lg fw-bold px-4 py-3 shadow">
                                      <i className="bi bi-calendar-check me-2"></i>Solicitar Hora Médica
                                  </Link>
                                  <Link to="/servicios" className="btn btn-outline-custom btn-lg fw-semibold px-4 py-3">
                                      Conocer Servicios
                                  </Link>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

              {/* Información Rápida / Resumen */}
              <section className="py-4 bg-crema-alt border-bottom">
                  <div className="container">
                      <div className="row g-3 text-center">
                          <div className="col-md-4">
                              <div className="d-flex align-items-center justify-content-center gap-3 p-2">
                                  <i className="bi bi-geo-alt-fill fs-2 icon-main"></i>
                                  <div className="text-start">
                                      <h6 className="mb-0 fw-bold">Ubicación</h6>
                                      <small className="text-muted">Rancagua, Región de O'Higgins</small>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-4">
                              <div className="d-flex align-items-center justify-content-center gap-3 p-2">
                                  <i className="bi bi-clock-fill fs-2 icon-main"></i>
                                  <div className="text-start">
                                      <h6 className="mb-0 fw-bold">Horario de Atención</h6>
                                      <small className="text-muted">Lunes a Sábado: 09:00 a 19:00 hrs</small>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-4">
                              <div className="d-flex align-items-center justify-content-center gap-3 p-2">
                                  <i className="bi bi-shield-check fs-2 icon-main"></i>
                                  <div className="text-start">
                                      <h6 className="mb-0 fw-bold">Historial Digital</h6>
                                      <small className="text-muted">Fichas y vacunas en línea</small>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

              {/* Sección Sobre Nosotros */}
              <section id="nosotros" className="py-5 bg-white border-bottom">
                  <div className="container py-3">
                      <div className="row align-items-center gy-5 gx-lg-5">
                          {/* Columna de Imagen */}
                          <div className="col-lg-6">
                              <div className="position-relative">
                                  <img src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80" 
                                       alt="Equipo Veterinario San Marcos" 
                                       className="img-fluid rounded-4 shadow-lg about-img" />
                                  <div className="about-experience-badge text-white p-3 rounded-3 shadow text-center d-none d-sm-block">
                                      <span className="d-block display-6 fw-bold">+15</span>
                                      <small className="text-uppercase fw-semibold">Años de experiencia</small>
                                  </div>
                              </div>
                          </div>

                          {/* Columna de Contenido / Descripción */}
                          <div className="col-lg-6">
                              <span className="badge badge-custom mb-2 px-3 py-2 text-uppercase fw-bold">Conócenos</span>
                              <h2 className="display-6 fw-bold section-title mb-3">Sobre Nosotros</h2>
                              <p className="text-secondary lead fs-6 mb-3">
                                  <strong>Veterinaria San Marcos</strong> es una clínica veterinaria ubicada en Rancagua, Región del Libertador General Bernardo O'Higgins. Fue fundada en 2009 con la firme convicción de entregar atención médica de excelencia, cercana y con un profundo respeto por los animales.
                              </p>
                              <p className="text-secondary mb-4">
                                  A lo largo de los años nos hemos consolidado como un centro de referencia comunal, atendiendo con dedicación a un promedio de más de 25 pacientes al día. Nuestro campo de acción abarca principalmente perros y gatos, así como también conejos, aves y pequeños animales de compañía, asegurando chequeos preventivos, diagnósticos oportunos y tratamientos integrales.
                              </p>

                              {/* Puntos destacados de equipo y valores */}
                              <div className="row g-3 mb-4">
                                  <div className="col-sm-6">
                                      <div className="d-flex align-items-center gap-3 p-3 bg-crema-alt rounded-3">
                                          <i className="bi bi-people-fill fs-2 icon-main"></i>
                                          <div>
                                              <h6 className="mb-0 fw-bold">Equipo Calificado</h6>
                                              <small className="text-muted">4 Médicos Veterinarios y 1 Secretaria</small>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-sm-6">
                                      <div className="d-flex align-items-center gap-3 p-3 bg-crema-alt rounded-3">
                                          <i className="bi bi-laptop-fill fs-2 icon-accent"></i>
                                          <div>
                                              <h6 className="mb-0 fw-bold">Gestión Digital</h6>
                                              <small className="text-muted">Fichas e historial en línea</small>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div className="d-flex gap-3 align-items-center flex-wrap">
                                  <a href="#equipo" className="btn btn-primary-custom fw-bold px-4 py-2">
                                      <i className="bi bi-arrow-down-circle me-1"></i> Ver Especialistas
                                  </a>
                                  <Link to="/contacto" className="btn btn-outline-secondary fw-semibold px-3 py-2">
                                      <i className="bi bi-geo-alt me-1"></i> Cómo llegar en Rancagua
                                  </Link>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
      {/* Servicios Destacados */}
              <section id="servicios" className="py-5">
                  <div className="container py-3">
                      <div className="text-center mb-5">
                          <h2 className="fw-bold section-title">Nuestros Servicios Principales</h2>
                          <p className="text-muted">Atención profesional respaldada por médicos veterinarios certificados.</p>
                      </div>
                
                      <div className="row g-4">
                          {/* Consulta General */}
                          <div className="col-12 col-md-6 col-lg-3">
                              <article className="card h-100 border-0 shadow-sm text-center p-3">
                                  <div className="card-body d-flex flex-column align-items-center">
                                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '70px', height: '70px' }}>
                                          <i className="bi bi-heart-pulse fs-2 text-white"></i>
                                      </div>
                                      <h5 className="card-title fw-bold">Consulta General</h5>
                                      <p className="card-text text-muted small flex-grow-1">Examen físico detallado, diagnóstico temprano y controles preventivos de salud.</p>
                                      <Link to="/servicios" className="btn btn-link text-primary fw-bold text-decoration-none p-0 mt-2">Más detalles &rarr;</Link>
                                  </div>
                              </article>
                          </div>

                          {/* Vacunación y Desparasitación */}
                          <div className="col-12 col-md-6 col-lg-3">
                              <article className="card h-100 border-0 shadow-sm text-center p-3">
                                  <div className="card-body d-flex flex-column align-items-center">
                                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '70px', height: '70px' }}>
                                          <i className="bi bi-capsule fs-2 text-white"></i>
                                      </div>
                                      <h5 className="card-title fw-bold">Vacunación y Desparasitación</h5>
                                      <p className="card-text text-muted small flex-grow-1">Planes sanitarios completos para cachorros y adultos con avisos de vencimiento.</p>
                                      <Link to="/servicios" className="btn btn-link text-primary fw-bold text-decoration-none p-0 mt-2">Más detalles &rarr;</Link>
                                  </div>
                              </article>
                          </div>

                          {/* Cirugía Menor */}
                          <div className="col-12 col-md-6 col-lg-3">
                              <article className="card h-100 border-0 shadow-sm text-center p-3">
                                  <div className="card-body d-flex flex-column align-items-center">
                                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '70px', height: '70px' }}>
                                          <i className="bi bi-bandaid fs-2 text-white"></i>
                                      </div>
                                      <h5 className="card-title fw-bold">Cirugía Menor</h5>
                                      <p className="card-text text-muted small flex-grow-1">Pabellón equipado para esterilizaciones, castraciones y curaciones complejas.</p>
                                      <Link to="/servicios" className="btn btn-link text-primary fw-bold text-decoration-none p-0 mt-2">Más detalles &rarr;</Link>
                                  </div>
                              </article>
                          </div>

                          {/* Control y Seguimiento */}
                          <div className="col-12 col-md-6 col-lg-3">
                              <article className="card h-100 border-0 shadow-sm text-center p-3">
                                  <div className="card-body d-flex flex-column align-items-center">
                                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '70px', height: '70px' }}>
                                          <i className="bi bi-clipboard2-pulse fs-2 text-white"></i>
                                      </div>
                                      <h5 className="card-title fw-bold">Control y Seguimiento</h5>
                                      <p className="card-text text-muted small flex-grow-1">Control de peso, nutrición clínica y seguimiento de tratamientos farmacológicos.</p>
                                      <Link to="/servicios" className="btn btn-link text-primary fw-bold text-decoration-none p-0 mt-2">Más detalles &rarr;</Link>
                                  </div>
                              </article>
                          </div>
                      </div>
                  </div>
              </section>


              {/* Sección Compromiso y Atención Clínica */}
              <section className="py-5 bg-crema-alt">
                  <div className="container py-3">
                      <div className="row align-items-center gy-5 gx-lg-5">
                          <div className="col-lg-6">
                              <h2 className="fw-bold section-title mb-3">Comprometidos con el bienestar de tu mascota</h2>
                              <p className="text-secondary mb-3">
                                  En Veterinaria San Marcos modernizamos nuestros procesos clínicos para que puedas revisar fichas, recetas y citas directamente en línea sin pérdidas de información.
                              </p>
                              <ul className="list-unstyled d-flex flex-column gap-2 mb-4">
                                  <li className="d-flex align-items-center gap-2">
                                      <i className="bi bi-check-circle-fill icon-accent fs-5"></i> Equipo médico con más de 15 años de experiencia en la región.
                                  </li>
                                  <li className="d-flex align-items-center gap-2">
                                      <i className="bi bi-check-circle-fill icon-accent fs-5"></i> Confirmación y recordatorio automático de citas médicas.
                                  </li>
                                  <li className="d-flex align-items-center gap-2">
                                      <i className="bi bi-check-circle-fill icon-accent fs-5"></i> Historial clínico individual para cada una de tus mascotas.
                                  </li>
                              </ul>
                              <Link to="/contacto" className="btn btn-primary-custom fw-bold px-4 py-2 shadow-sm">
                                  <i className="bi bi-geo-alt me-1"></i> Ver ubicación en el mapa
                              </Link>
                          </div>
                    
                          <div className="col-lg-6">
                              <img 
                                  src="https://pampermut.com/blog/wp-content/uploads/2020/06/Como-hacer-que-la-visita-al-veterinario-no-sea-un-trauma-para-tu-perro.jpg" 
                                  alt="Veterinario examinando a un perro con cuidado" 
                                  className="img-fluid rounded-4 shadow-lg commitment-img" />
                          </div>
                      </div>
                  </div>
              </section>

              {/* Sección Especialistas */}
              <section id="equipo" className="py-5 bg-white border-top">
                  <div className="container py-3">
                      <div className="text-center mb-5">
                          <span className="badge badge-custom mb-2 px-3 py-2 text-uppercase fw-bold">Profesionales de la Salud Animal</span>
                          <h2 className="fw-bold section-title">Equipo Calificado de la Clínica</h2>
                          <p className="text-muted">Conoce a los especialistas que cuidan la salud de tu mascota en Rancagua.</p>
                      </div>

                      <div className="row g-4">
                          {/* Integrante 1 */}
                          <div className="col-12 col-sm-6 col-lg-3">
                              <div className="card h-100 team-card border-0 shadow-sm text-center">
                                  <div className="team-img-wrapper">
                                      <img src="/img/Daniel.png" className="card-img-top team-img" alt="Dr. Daniel Morales" />
                                  </div>
                                  <div className="card-body p-4">
                                      <h5 className="card-title fw-bold mb-1">Dr. Daniel Morales</h5>
                                      <p className="badge bg-primary-subtle text-primary mb-2">Médico Veterinario Jefe</p>
                                      <p className="card-text text-muted small">Especialista en Cirugía y Medicina Interna Canina/Felina, diagnósticos complejos y segunda opinión médica.</p>
                                  </div>
                              </div>
                          </div>

                          {/* Integrante 2 */}
                          <div className="col-12 col-sm-6 col-lg-3">
                              <div className="card h-100 team-card border-0 shadow-sm text-center">
                                  <div className="team-img-wrapper">
                                      <img src="/img/karla.png" className="card-img-top team-img" alt="Dra. Karla Fuentes" />
                                  </div>
                                  <div className="card-body p-4">
                                      <h5 className="card-title fw-bold mb-1">Dra. Karla Fuentes</h5>
                                      <p className="badge bg-warning-subtle text-warning-emphasis mb-2">Animales Exóticos y Menores</p>
                                      <p className="card-text text-muted small">Atención médica especializada para conejos, aves de compañía, dermatología y chequeos preventivos.</p>
                                  </div>
                              </div>
                          </div>

                          {/* Integrante 3 */}
                          <div className="col-12 col-sm-6 col-lg-3">
                              <div className="card h-100 team-card border-0 shadow-sm text-center">
                                  <div className="team-img-wrapper">
                                      <img src="/img/kevin.png" className="card-img-top team-img" alt="Dr. Kevin Silva" />
                                  </div>
                                  <div className="card-body p-4">
                                      <h5 className="card-title fw-bold mb-1">Dr. Kevin Silva</h5>
                                      <p className="badge bg-danger-subtle text-danger mb-2">Cirujano Veterinario</p>
                                      <p className="card-text text-muted small">Cirugía general y de tejidos blandos, traumatología, esterilizaciones y resolución de urgencias.</p>
                                  </div>
                              </div>
                          </div>

                          {/* Integrante 4 */}
                          <div className="col-12 col-sm-6 col-lg-3">
                              <div className="card h-100 team-card border-0 shadow-sm text-center">
                                  <div className="team-img-wrapper">
                                      <img src="/img/kevinne.png" className="card-img-top team-img" alt="Dr. Kevinne Navarro" />
                                  </div>
                                  <div className="card-body p-4">
                                      <h5 className="card-title fw-bold mb-1">Dr. Kevinne Navarro</h5>
                                      <p className="badge bg-success-subtle text-success mb-2">Médico Veterinario</p>
                                      <p className="card-text text-muted small">Especialista en Medicina Felina, consulta preventiva, planes sanitarios y seguimiento de tratamientos.</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

              {/* Sección Informativa / Suscripción de Novedades */}
              <section className="py-5 subscription-section text-white">
                  <div className="container text-center py-2">
                      <h3 className="fw-bold mb-2">¿Quieres recibir consejos y recordatorios de vacunas?</h3>
                      <p className="text-light mb-4">Ingresa tu correo y mantente al día con los cuidados de tu mascota.</p>
                      <div className="row justify-content-center">
                          <div className="col-md-6 col-lg-5">
                              <form className="d-flex gap-2" onSubmit={suscribir}>
                                  <input type="email" className="form-control form-control-lg border-0 shadow-sm" placeholder="ejemplo@correo.cl" required />
                                  <button type="submit" className="btn btn-success btn-lg fw-bold px-4 shadow-sm">Enviar</button>
                              </form>
                          </div>
                      </div>
                  </div>
              </section>
    
    </>
  );
}

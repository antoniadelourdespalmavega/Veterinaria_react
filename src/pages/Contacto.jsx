import { Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Página de Contacto: cómo llegar, mapa de Google y preguntas frecuentes
export default function Contacto() {
  return (
    <>

              {/* Encabezado de la Página */}
              <section className="py-5 bg-crema-alt border-bottom">
                  <div className="container text-center py-2">
                      <span className="badge badge-custom mb-2 px-3 py-2 text-uppercase fw-bold">Ubicación y Atención</span>
                      <h1 className="display-5 fw-bold section-title">Encuéntranos en Rancagua</h1>
                      <p className="lead text-muted mx-auto" style={{ maxWidth: '650px' }}>
                          Estamos ubicados en un sector accesible de Rancagua con estacionamiento y cómodas vías de locomoción.
                      </p>
                  </div>
              </section>

              {/* Sección Principal: Cómo Llegar y Mapa */}
              <section className="py-5 bg-white">
                  <div className="container py-2">
                      <div className="row g-4 align-items-stretch">
                    
                          {/* Columna Izquierda: Descripción de Cómo Llegar y Datos */}
                          <div className="col-lg-5 d-flex flex-column justify-content-between">
                              <div>
                                  <div className="d-flex align-items-center gap-2 mb-3">
                                      <i className="bi bi-geo-alt-fill fs-2 icon-main"></i>
                                      <h2 className="fw-bold section-title mb-0 fs-3">Cómo Llegar</h2>
                                  </div>
                            
                                  <p className="text-secondary mb-4">
                                      Nuestra clínica se encuentra en <strong>Av. San Martín #1234</strong>, a minutos del centro de la ciudad y con fácil acceso desde las principales arterias viales de Rancagua.
                                  </p>

                                  {/* Tarjetas / Pasos para llegar */}
                                  <div className="d-flex flex-column gap-3 mb-4">
                                      <div className="d-flex align-items-start gap-3 p-3 bg-crema-alt rounded-3">
                                          <i className="bi bi-car-front-fill fs-3 icon-accent mt-1"></i>
                                          <div>
                                              <h6 className="fw-bold mb-1">En Vehículo Particular</h6>
                                              <p className="small text-muted mb-0">
                                                  Acceso directo por Av. San Martín o Carretera El Cobre. Contamos con estacionamiento exclusivo reservado para clientes y pacientes.
                                              </p>
                                          </div>
                                      </div>

                                      <div className="d-flex align-items-start gap-3 p-3 bg-crema-alt rounded-3">
                                          <i className="bi bi-bus-front-fill fs-3 icon-accent mt-1"></i>
                                          <div>
                                              <h6 className="fw-bold mb-1">Transporte Público</h6>
                                              <p className="small text-muted mb-0">
                                                  Líneas de micros urbanas y colectivos con recorrido por el eje San Martín te dejan a menos de 50 metros del acceso principal.
                                              </p>
                                          </div>
                                      </div>

                                      <div className="d-flex align-items-start gap-3 p-3 bg-crema-alt rounded-3">
                                          <i className="bi bi-pin-map-fill fs-3 icon-accent mt-1"></i>
                                          <div>
                                              <h6 className="fw-bold mb-1">Puntos de Referencia</h6>
                                              <p className="small text-muted mb-0">
                                                  A solo dos cuadras del cruce con Av. Millán, frente a la farmacia comunitaria.
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              {/* Botón de apertura rápida en Maps */}
                              <div>
                                  <a href="https://maps.google.com/?q=Av.+San+Martín+1234,+Rancagua" target="_blank" rel="noopener noreferrer" className="btn btn-secondary-custom w-100 py-3 fw-bold shadow-sm text-center">
                                      <i className="bi bi-box-arrow-up-right me-2"></i> Abrir en Google Maps / Waze
                                  </a>
                              </div>
                          </div>

                          {/* Columna Derecha: Mapa Interactivo */}
                          <div className="col-lg-7">
                              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100" style={{ minHeight: '480px' }}>
                                  {/* Mapa de Google incrustado */}
                                  <iframe 
                                      className="w-100 h-100 border-0" 
                                      style={{ minHeight: '480px' }}
                                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3301.2185542845584!2d-70.74312162438863!3d-34.166347873114095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9663436bf67faad5%3A0xb3a82dfcfafc1b82!2sAv.+San+Mart%C3%ADn%2C+Rancagua%2C+O&#39;Higgins!5e0!3m2!1ses!2scl!4v1700000000000"
                                      allowFullScreen="" 
                                      loading="lazy" 
                                      referrerPolicy="no-referrer-when-downgrade">
                                  </iframe>
                              </div>
                          </div>

                      </div>
                  </div>
              </section>

              {/* Sección: Preguntas Frecuentes (FAQ) */}
              <section className="py-5 bg-white border-top">
                  <div className="container py-2">
                      <div className="text-center mb-5">
                          <span className="badge badge-custom mb-2 px-3 py-2 text-uppercase fw-bold">Dudas Habituales</span>
                          <h2 className="fw-bold section-title">Preguntas Frecuentes</h2>
                          <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
                              Respuestas directas sobre la puntualidad, atención de urgencias y preparación para tu visita médica.
                          </p>
                      </div>

                      <div className="row justify-content-center">
                          <div className="col-lg-9">
                              {/* Preguntas frecuentes: Accordion de react-bootstrap (al hacer clic se abre una y se cierra la otra) */}
                              <Accordion defaultActiveKey="0" flush className="shadow-sm rounded-4 overflow-hidden border">
                            
                                  {/* Pregunta 1 */}
                                  <Accordion.Item eventKey="0">
      <Accordion.Header><i className="bi bi-clock-history icon-main me-2 fs-5"></i> ¿Qué pasa si no llego a mi cita a tiempo?</Accordion.Header>
      <Accordion.Body className="text-secondary">Contamos con una tolerancia de <strong>10 minutos de espera</strong> para no retrasar a los siguientes pacientes. Si sabes que te retrasarás más de ese tiempo, te recomendamos avisarnos por WhatsApp o teléfono; de esa forma podemos reasignar tu cupo según disponibilidad de la jornada o reagendarte sin costo.</Accordion.Body>
      </Accordion.Item>

                                  {/* Pregunta 2 */}
                                  <Accordion.Item eventKey="1">
      <Accordion.Header><i className="bi bi-exclamation-triangle-fill text-warning me-2 fs-5"></i> ¿Atienden urgencias médicas sin cita previa?</Accordion.Header>
      <Accordion.Body className="text-secondary"><strong>Sí.</strong> Los casos de urgencia médica tienen prioridad clínica inmediata sobre las consultas de rutina programadas. Te sugerimos llamar brevemente por teléfono mientras vienes en camino para que nuestro equipo médico y pabellón tengan todo preparado al recibirte.</Accordion.Body>
      </Accordion.Item>

                                  {/* Pregunta 3 */}
                                  <Accordion.Item eventKey="2">
      <Accordion.Header><i className="bi bi-shield-lock-fill icon-accent me-2 fs-5"></i> ¿Cómo debo llevar a mi mascota a la clínica?</Accordion.Header>
      <Accordion.Body className="text-secondary">Por seguridad de todos los animales en la sala de espera, los perros deben ingresar con <strong>correa o arnés</strong> (y bozal si es reactivo), y los gatos, conejos o aves deben venir obligatoriamente dentro de una <strong>caja de transporte segura (kennel)</strong> o jaula adecuada.</Accordion.Body>
      </Accordion.Item>

                                  {/* Pregunta 4 */}
                                  <Accordion.Item eventKey="3">
      <Accordion.Header><i className="bi bi-credit-card-2-front-fill icon-main me-2 fs-5"></i> ¿Cuáles son los medios de pago disponibles?</Accordion.Header>
      <Accordion.Body className="text-secondary">Aceptamos efectivo, tarjetas de débito (Redcompra), tarjetas de crédito en cuotas y transferencias electrónicas directas.</Accordion.Body>
      </Accordion.Item>

                              </Accordion>
                          </div>
                      </div>
                  </div>
              </section>

              {/* Canales de Contacto Directo */}
              <section className="py-5 bg-crema-alt border-top">
                  <div className="container">
                      <div className="row g-4 text-center">
                          <div className="col-md-4">
                              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                                  <div className="icon-box mx-auto mb-3">
                                      <i className="bi bi-telephone fs-2"></i>
                                  </div>
                                  <h5 className="fw-bold mb-1">Contáctanos</h5>
                                  <p className="text-muted small mb-2">Llamadas y confirmaciones</p>
                                  <a href="tel:+56722345678" className="fw-bold icon-main text-decoration-none fs-6">+56 72 234 5678</a>
                              </div>
                          </div>
                          <div className="col-md-4">
                              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                                  <div className="icon-box mx-auto mb-3">
                                      <i className="bi bi-whatsapp fs-2"></i>
                                  </div>
                                  <h5 className="fw-bold mb-1">WhatsApp Consultas</h5>
                                  <p className="text-muted small mb-2">Mensajería y dudas rápidas</p>
                                  <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer" className="fw-bold icon-accent text-decoration-none fs-6">+56 9 1234 5678</a>
                              </div>
                          </div>
                          <div className="col-md-4">
                              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                                  <div className="icon-box mx-auto mb-3">
                                      <i className="bi bi-clock-history fs-2"></i>
                                  </div>
                                  <h5 className="fw-bold mb-1">Horarios</h5>
                                  <p className="text-muted small mb-2">Atención en clínica</p>
                                  <span className="fw-bold text-dark fs-6">Lun - Sáb: 09:00 a 19:00 hrs</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
    
    </>
  );
}

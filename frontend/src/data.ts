import { Student, ActivityItem, CalendarEvent } from './types';

export const INITIAL_STUDENTS: Student[] = [
  // Dashboard & General list
  { id: 'FE3-2024-001', fullName: 'Carlos Eduardo Mendez', dni: '74561234', level: 'Secundaria', grade: '5to B', status: 'ACTIVO', birthDate: '10/05/2009' },
  { id: 'FE3-2024-042', fullName: 'Ana Lucía Rojas', dni: '76543210', level: 'Primaria', grade: '3ro A', status: 'ACTIVO', birthDate: '12/08/2012' },
  { id: 'FE3-2023-118', fullName: 'Jorge Luis Perez', dni: '73456128', level: 'Egresado', grade: 'Egresado', status: 'FINALIZADO', birthDate: '04/11/2007', technicalCareer: 'Computación e Informática', gradYear: 2023 },
  { id: 'FE3-2024-125', fullName: 'Marta Sofia Lopez', dni: '79845123', level: 'Inicial', grade: '4 años', status: 'PENDIENTE', birthDate: '15/09/2020' },

  // Nivel Inicial-3
  { id: 'FE3-INI3-001', fullName: 'Alarcón Mendoza, Mateo', dni: '72458912', level: 'Inicial', grade: '3 Años', status: 'ACTIVO', birthDate: '15/03/2021' },
  { id: 'FE3-INI3-002', fullName: 'Cáceres Paredes, Lucía', dni: '75412369', level: 'Inicial', grade: '3 Años', status: 'ACTIVO', birthDate: '22/07/2021' },
  { id: 'FE3-INI3-003', fullName: 'Gomez Rojas, Thiago', dni: '71025847', level: 'Inicial', grade: '3 Años', status: 'PENDIENTE', birthDate: '05/11/2020' },
  { id: 'FE3-INI3-004', fullName: 'López Valdivia, Valentina', dni: '78954123', level: 'Inicial', grade: '3 Años', status: 'ACTIVO', birthDate: '12/01/2021' },
  { id: 'FE3-INI3-005', fullName: 'Sarmiento Paredes, Aarón', dni: '73024581', level: 'Inicial', grade: '3 Años', status: 'ACTIVO', birthDate: '11/02/2021' },
  { id: 'FE3-INI3-006', fullName: 'Vásquez Torres, Camilo', dni: '71120248', level: 'Inicial', grade: '3 Años', status: 'ACTIVE', birthDate: '28/05/2021' } as any,

  // Nivel Inicial-4 & 5
  { id: 'FE3-INI4-001', fullName: 'Paredes Mendoza, Sofía', dni: '73412589', level: 'Inicial', grade: '4 Años', status: 'ACTIVO', birthDate: '12/09/2020' },
  { id: 'FE3-INI5-001', fullName: 'Huamán Rojas, Joaquín', dni: '71045236', level: 'Inicial', grade: '5 Años', status: 'ACTIVO', birthDate: '01/04/2019' },

  // Nivel Primaria
  { id: 'FE3-PRIM-001', fullName: 'Alvarado Vásquez, Rodrigo', dni: '70245812', level: 'Primaria', grade: '4° Primaria - B', status: 'ACTIVO', birthDate: '15/04/2014' },
  { id: 'FE3-PRIM-002', fullName: 'Castillo Mendoza, María Fe', dni: '72110594', level: 'Primaria', grade: '4° Primaria - B', status: 'ACTIVO', birthDate: '20/06/2014' },
  { id: 'FE3-PRIM-003', fullName: 'Guzmán Paredes, Carlos Alberto', dni: '75893321', level: 'Primaria', grade: '4° Primaria - B', status: 'REVISION' as any, birthDate: '30/11/2013' },
  { id: 'FE3-PRIM-004', fullName: 'Luna Marín, Sofía Esperanza', dni: '71458220', level: 'Primaria', grade: '4° Primaria - B', status: 'ACTIVO', birthDate: '25/02/2014' },
  { id: 'FE3-PRIM-005', fullName: 'Rojas Tello, Mateo Daniel', dni: '78554109', level: 'Primaria', grade: '4° Primaria - B', status: 'ACTIVO', birthDate: '08/01/2014' },
  { id: 'FE3-PRIM-006', fullName: 'Sánchez Díaz, Valeria', dni: '72051498', level: 'Primaria', grade: '3° Primaria - A', status: 'ACTIVO', birthDate: '17/08/2015' },
  { id: 'FE3-PRIM-007', fullName: 'Quispe Ruiz, Leonel', dni: '75061492', level: 'Primaria', grade: '5° Primaria - C', status: 'ACTIVO', birthDate: '24/10/2013' },

  // Nivel Secundaria
  { id: 'FE3-SEC-001', fullName: 'Alvarado Castro, Luis Fernando', dni: '74589210', level: 'Secundaria', grade: '5° - A', status: 'ACTIVO', technicalCareer: 'Computación' },
  { id: 'FE3-SEC-002', fullName: 'Gómez Paredes, María Elena', dni: '71223456', level: 'Secundaria', grade: '4° - B', status: 'ACTIVO', technicalCareer: 'Contabilidad' },
  { id: 'FE3-SEC-003', fullName: 'Mendoza Zegarra, Carlos Alberto', dni: '78901234', level: 'Secundaria', grade: '3° - C', status: 'ACTIVO', technicalCareer: 'Electrónica' },
  { id: 'FE3-SEC-004', fullName: 'Rojas Huamán, Sofía Isabel', dni: '72345678', level: 'Secundaria', grade: '5° - A', status: 'ACTIVO', technicalCareer: 'Diseño Ind.' },
  { id: 'FE3-SEC-005', fullName: 'Yépez Torres, Pedro Juan', dni: '74015892', level: 'Secundaria', grade: '5° - B', status: 'ACTIVO', technicalCareer: 'Computación' },

  // Egresados
  { id: 'FE3-EGR-001', fullName: 'Ricardo Mendoza Valdivia', dni: '45829103', level: 'Egresado', grade: 'Egresado', status: 'FINALIZADO', email: 'ricardo.mendoza@email.com', technicalCareer: 'Computación e Informática', gradYear: 2023 },
  { id: 'FE3-EGR-002', fullName: 'María Elena Quispe', dni: '71203948', level: 'Egresado', grade: 'Egresado', status: 'FINALIZADO', email: 'm.quispe@email.com', technicalCareer: 'Gastronomía', gradYear: 2023 },
  { id: 'FE3-EGR-003', fullName: 'Jorge Sánchez Pineda', dni: '09384721', level: 'Egresado', grade: 'Egresado', status: 'FINALIZADO', email: 'jsanchez.p@email.com', technicalCareer: 'Electrónica Industrial', gradYear: 2022 },
  { id: 'FE3-EGR-004', fullName: 'Andrea Torres Castro', dni: '42881023', level: 'Egresado', grade: 'Egresado', status: 'FINALIZADO', email: 'andrea.tc@email.com', technicalCareer: 'Contabilidad', gradYear: 2022 },
  { id: 'FE3-EGR-005', fullName: 'Julio César Espinoza', dni: '40924185', level: 'Egresado', grade: 'Egresado', status: 'FINALIZADO', email: 'julio.cesar@email.com', technicalCareer: 'Mecánica Automotriz', gradYear: 2021 }
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  { id: 'act-1', type: 'nota', title: 'Notas actualizadas', subtitle: '5to Secundaria - Secc. A', time: 'Hace 15 min' },
  { id: 'act-2', type: 'inscripcion', title: 'Nueva inscripción', subtitle: 'Nivel Inicial - 3 años', time: 'Hace 2 horas' },
  { id: 'act-3', type: 'alerta', title: 'Alerta de inasistencia', subtitle: 'Marco Aurelio (Primaria)', time: 'Hace 4 horas' },
  { id: 'act-4', type: 'boletin', title: 'Boletines generados', subtitle: 'Reporte mensual Abril', time: 'Ayer, 4:30 PM' },
  { id: 'act-5', type: 'reunion', title: 'Reunión de Padres', subtitle: 'Agendada para mañana', time: 'Ayer, 2:15 PM' },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'cal-1', month: 'Oct', day: '24', title: 'Reunión de Padres', location: 'Salón Multiusos', time: '17:00 hrs' },
  { id: 'cal-2', month: 'Oct', day: '31', title: 'Festival de la Canción Criolla', location: 'Patio Principal', time: '09:00 hrs' },
];

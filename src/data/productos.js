// Aquí están todos los datos del catálogo (servicios y productos).
// Los saqué de mi HTML original y los pasé a arreglos para dibujar las tarjetas con .map()
// en vez de repetir el mismo HTML cientos de veces.
// Productos agrupados por categoría: canina, felina, conejos, aves, juguetes y premios.
// Cada producto tiene imagen, nombre, descripción, precio y el nombre con que se agrega al carrito.
// Algunos tienen precioAnterior (precio con descuento).
export const catalogoServicios = {
  "canina": [
    {
      "imagen": "/img/comida_perro2.png",
      "alt": "Sachet Dog Chow Cachorro Pollo",
      "nombre": "Sachet Dog Chow Cachorro Pollo",
      "descripcion": "20 Unidades de 100g. Alimento húmedo para una óptima hidratación y sabor.",
      "precio": 11500,
      "nombreCarrito": "Sachet Dog Chow Cachorro Pollo"
    },
    {
      "imagen": "/img/comida_perro1.png",
      "alt": "Old Prince Senior Cordero 3kg",
      "nombre": "Old Prince Senior Cordero (3kg)",
      "descripcion": "Proteínas noveles con arroz integral. Cuida articulaciones y pelaje.",
      "precio": 12500,
      "nombreCarrito": "Old Prince Senior Cordero (3kg)"
    },
    {
      "imagen": "/img/comida_perro3.png",
      "alt": "Pro Plan Adulto Razas Pequeñas 7.5kg",
      "nombre": "Pro Plan Adulto Razas Pequeñas (7.5kg)",
      "descripcion": "Fórmula con Optihealth y Spirulina para reforzar el sistema inmune.",
      "precio": 46750,
      "nombreCarrito": "Pro Plan Adulto Razas Pequeñas (7.5kg)"
    }
  ],
  "felina": [
    {
      "imagen": "/img/comida_gato1.png",
      "alt": "JosiCat Sterilised Classic 1.9kg",
      "nombre": "JosiCat Esterilizado Classic (1.9kg)",
      "descripcion": "Fórmula alemana para control de pH urinario y mantenimiento de peso.",
      "precio": 5720,
      "nombreCarrito": "JosiCat Esterilizado Classic (1.9kg)"
    },
    {
      "imagen": "/img/comida_gato2.png",
      "alt": "Felinnes Premium Gato Adulto 20kg",
      "nombre": "Felinnes Premium Gato Adulto (20kg)",
      "descripcion": "Nutri Expert sabor salmón. Protege salud renal y digestiva sin colorantes.",
      "precio": 34400,
      "nombreCarrito": "Felinnes Premium Gato Adulto (20kg)"
    },
    {
      "imagen": "/img/comida_gato3.png",
      "alt": "Lata Agility Gato Adulto Merluza 340g",
      "nombre": "Lata Agility Gato Adulto Merluza (340g)",
      "descripcion": "Alimento húmedo balanceado rico en Omega 3 y 6 para piel y pelaje.",
      "precio": 2253,
      "nombreCarrito": "Lata Agility Gato Adulto Merluza (340g)"
    }
  ],
  "conejos": [
    {
      "imagen": "/img/conejos1.png",
      "alt": "Tropifit All in 1 Alimento Completo para Conejos Adultos 500g",
      "nombre": "Tropifit All in 1 Conejos Adultos (500g)",
      "descripcion": "Alimento completo rico en timotka, sin cereales ni colorantes artificiales.",
      "precio": 12650,
      "nombreCarrito": "Tropifit All in 1 Conejos Adultos (500g)"
    },
    {
      "imagen": "/img/conejos2.png",
      "alt": "Smakers Economic para Conejos Vitapol",
      "nombre": "Smakers Economic Vitapol para Conejos",
      "descripcion": "Snack complemento natural ideal para desgaste dental y entretención (2 pcs / 90g).",
      "precio": 2248,
      "nombreCarrito": "Smakers Economic Vitapol para Conejos"
    }
  ],
  "aves": [
    {
      "imagen": "/img/ave1.png",
      "alt": "Alimento para Aves Semillas de Maravilla 1 KG",
      "nombre": "Semillas de Maravilla (1kg)",
      "descripcion": "Semillas naturales seleccionadas, ideales para aportar energía a tus aves.",
      "precio": 2290,
      "nombreCarrito": "Semillas de Maravilla (1kg)"
    },
    {
      "imagen": "/img/ave2.png",
      "alt": "Alimento para Aves Semilla de Alpiste 1 KG",
      "nombre": "Semilla de Alpiste (1kg)",
      "descripcion": "Rico en proteínas y fibra, favorece la digestión y el crecimiento saludable.",
      "precio": 3200,
      "nombreCarrito": "Semilla de Alpiste (1kg)"
    }
  ],
  "juguetes": [
    {
      "imagen": "/img/juguete_perro1.png",
      "alt": "Juguete para perro Hueso Pequeño",
      "nombre": "Juguete para perro Hueso Pequeño",
      "descripcion": "Ideal para morder, fabricado con materiales resistentes.",
      "precio": 2700,
      "nombreCarrito": "Juguete para perro Hueso Pequeño"
    },
    {
      "imagen": "/img/juguete_perro2.png",
      "alt": "Disco Volador Grande",
      "nombre": "Disco Volador Grande (22x2.8 cm)",
      "descripcion": "Juguete resistente para juegos de lanzamiento y captura.",
      "precio": 2100,
      "nombreCarrito": "Disco Volador Grande"
    },
    {
      "imagen": "/img/juguete_perro3.png",
      "alt": "Juguete Peluche Animales Pelota Tenis",
      "nombre": "Juguete Peluche Animales Pelota Tenis",
      "descripcion": "Combina suavidad y resistencia para horas de juego.",
      "precio": 4200,
      "nombreCarrito": "Peluche Animales Pelota Tenis"
    },
    {
      "imagen": "/img/juguete_gato1.png",
      "alt": "Juguete Ratón Jaula Feline",
      "nombre": "Juguete Ratón Jaula Feline",
      "descripcion": "Despierta el instinto de caza de tu gato.",
      "precio": 5000,
      "nombreCarrito": "Juguete Ratón Jaula Feline"
    },
    {
      "imagen": "/img/juguete_gato2.png",
      "alt": "Juguete para Gato Pelotas Giratorias Triple Sabor",
      "nombre": "Pelotas Giratorias Triple Sabor",
      "descripcion": "Tres niveles de pelotas giratorias con sabores irresistibles.",
      "precio": 3250,
      "nombreCarrito": "Pelotas Giratorias Triple Sabor"
    },
    {
      "imagen": "/img/juguete_gato3.png",
      "alt": "Rascador para Gatos Diseño Oso",
      "nombre": "Rascador para Gatos Diseño Oso (51cm)",
      "descripcion": "Superficie de yute y felpa de alta calidad.",
      "precio": 11120,
      "nombreCarrito": "Rascador para Gatos Diseño Oso",
      "precioAnterior": 13900
    },
    {
      "imagen": "/img/juguete_conejo1.png",
      "alt": "Túneles y tubos de conejitos plegables de 3 vías",
      "nombre": "Túnel Plegable de 3 Vías para Conejos",
      "descripcion": "Divertido escondite y túnel de juego de 3 vías.",
      "precio": 10600,
      "nombreCarrito": "Túnel Plegable de 3 Vías para Conejos"
    },
    {
      "imagen": "/img/juguete_conejo2.png",
      "alt": "Bebedero Roedor 350 ml Colores surtidos",
      "nombre": "Bebedero para Roedores (350 ml)",
      "descripcion": "Práctico, duradero y fácil de instalar en jaulas.",
      "precio": 5700,
      "nombreCarrito": "Bebedero para Roedores (350 ml)"
    },
    {
      "imagen": "/img/juguete_conejo3.png",
      "alt": "Palo de salto para conejo de madera desmontable",
      "nombre": "Palo de Salto Ajustable de Madera",
      "descripcion": "Estructura desmontable de madera natural regulable.",
      "precio": 7650,
      "nombreCarrito": "Palo de Salto Ajustable de Madera"
    },
    {
      "imagen": "/img/juguete_ave1.png",
      "alt": "Columpio Aves Madera Colores",
      "nombre": "Columpio Aves Madera Colores",
      "descripcion": "Divertido columpio de madera en colores vivos.",
      "precio": 2200,
      "nombreCarrito": "Columpio Aves Madera Colores"
    },
    {
      "imagen": "/img/juguete_ave2.png",
      "alt": "Juguete interactivo educativo para aves",
      "nombre": "Juguete Interactivo Educativo para Aves",
      "descripcion": "Juego didáctico de encaje con aros y pelotas.",
      "precio": 28649,
      "nombreCarrito": "Juguete Interactivo Educativo Aves"
    },
    {
      "imagen": "/img/juguete_ave3.png",
      "alt": "Kit 8 Juguetes Para Loros Con Percha Y Escalera",
      "nombre": "Kit 8 Perchas de Madera Natural",
      "descripcion": "Set variado de posaderos y plataformas de madera.",
      "precio": 8291,
      "nombreCarrito": "Kit 8 Perchas de Madera Natural"
    }
  ],
  "premios": [
    {
      "imagen": "/img/premios_perro1.png",
      "alt": "Churu Dog Bites Pollo 8 Tubos",
      "nombre": "Churu Dog Bites Pollo (8 Tubos)",
      "descripcion": "Bocaditos de pollo natural con centro cremoso.",
      "precio": 6460,
      "nombreCarrito": "Churu Dog Bites Pollo (8 Tubos)"
    },
    {
      "imagen": "/img/premios_perro2.png",
      "alt": "Caja Doguitos Medallones de Carne 15x65gr",
      "nombre": "Doguitos Medallones de Carne (15x65g)",
      "descripcion": "Bocaditos semi-húmedos de carne real sabor parrilla.",
      "precio": 18607,
      "nombreCarrito": "Doguitos Medallones de Carne (15x65g)"
    },
    {
      "imagen": "/img/premios_perro3.png",
      "alt": "Plato Bambú Colores 1200ml",
      "nombre": "Plato de Bambú para Mascota (1200ml)",
      "descripcion": "Plato ecológico, resistente y de vivos colores.",
      "precio": 3190,
      "nombreCarrito": "Plato de Bambú para Mascota (1200ml)",
      "precioAnterior": 10634
    },
    {
      "imagen": "/img/premios_gato1.png",
      "alt": "Collar Diseños Flor Colores Surtidos",
      "nombre": "Collar Flores Colores Surtidos",
      "descripcion": "Elegante y cómodo collar con diseño estampado.",
      "precio": 2000,
      "nombreCarrito": "Collar Flores Colores Surtidos"
    },
    {
      "imagen": "/img/premios_gato2.png",
      "alt": "Two Brothers Removedor de Pelos y Pelusas Zeropelo",
      "nombre": "Removedor de Pelos Zeropelo",
      "descripcion": "Remueve pelusas y pelos de telas de forma rápida.",
      "precio": 9675,
      "nombreCarrito": "Removedor de Pelos Zeropelo"
    },
    {
      "imagen": "/img/premios_gato3.png",
      "alt": "Snack Gato Temptations Salmon y Queso x4 48 GR",
      "nombre": "Temptations Salmón y Queso (48g)",
      "descripcion": "Puré cremoso irresistible sabor salmón y queso.",
      "precio": 2312,
      "nombreCarrito": "Temptations Salmón y Queso (48g)",
      "precioAnterior": 2890
    },
    {
      "imagen": "/img/premios_gato4.png",
      "alt": "CHURU CAT SENIOR POLLO 56 GR",
      "nombre": "Churu Cat Senior Pollo (56g)",
      "descripcion": "Snack cremoso de pollo para gatos adultos mayores.",
      "precio": 2115,
      "nombreCarrito": "Churu Cat Senior Pollo (56g)"
    },
    {
      "imagen": "/img/premios_conejo1.png",
      "alt": "Drops Conejo Berries Living World",
      "nombre": "Living World Drops Conejo Berries",
      "descripcion": "Sabrosos bocaditos enriquecidos con vitaminas.",
      "precio": 3690,
      "nombreCarrito": "Living World Drops Conejo Berries"
    },
    {
      "imagen": "/img/premios_conejo2.png",
      "alt": "Nido Suave y Lindo Cama de Conejo Esponjosa",
      "nombre": "Cama Esponjosa para Conejo Princesa",
      "descripcion": "Nido ultrasuave y acolchado para descanso cómodo.",
      "precio": 13834,
      "nombreCarrito": "Cama Esponjosa para Conejo Princesa",
      "precioAnterior": 13834
    },
    {
      "imagen": "/img/premios_ave1.png",
      "alt": "Juguete Para Loro Colgante Para Morder Y Ejercicio",
      "nombre": "Juguete Colgante para Loro",
      "descripcion": "Accesorio colgante de texturas naturales.",
      "precio": 5000,
      "nombreCarrito": "Juguete Colgante para Loro"
    },
    {
      "imagen": "/img/premios_ave2.png",
      "alt": "Pinny Premium Mix para periquitos (800 g)",
      "nombre": "Pinny Premium Mix Periquitos (800g)",
      "descripcion": "Mezcla balanceada enriquecida con frutas y miel.",
      "precio": 20000,
      "nombreCarrito": "Pinny Premium Mix Periquitos (800g)"
    },
    {
      "imagen": "/img/premios_ave3.png",
      "alt": "Paquete de 2 huevos de golosina en palo canario A&E Smakers",
      "nombre": "Smakers Palos de Golosina Huevo (Pack x2)",
      "descripcion": "Barritas horneadas de golosina a base de huevo.",
      "precio": 21000,
      "nombreCarrito": "Smakers Palos de Golosina Huevo (Pack x2)"
    }
  ]
};

// Servicios médicos de la clínica (consulta, vacunación, cirugía, etc.)
export const serviciosMedicos = [
  {
    "icono": "bi-heart-pulse",
    "nombre": "Consulta General",
    "precio": "$20.000",
    "descripcion": "Evaluación clínica completa de tu mascota: revisión de signos vitales, oídos, dentadura, piel y diagnóstico inicial ante cualquier malestar."
  },
  {
    "icono": "bi-shield-plus",
    "nombre": "Vacunación",
    "precio": "$15.000",
    "descripcion": "Aplicación de vacunas según el calendario anual (Octuple, Antirrábica, Séxtuple, Triple Felina) para proteger a tu mascota contra enfermedades graves."
  },
  {
    "icono": "bi-bandaid",
    "nombre": "Cirugía Menor",
    "precio": "Desde $45.000",
    "descripcion": "Procedimientos quirúrgicos de baja complejidad con anestesia y monitoreo profesional. Incluye esterilizaciones, suturas de heridas y extirpación de quistes o pequeños tumores superficiales."
  },
  {
    "icono": "bi-bug",
    "nombre": "Desparasitación",
    "precio": "$10.000",
    "descripcion": "Control de parásitos internos y externos (garrapatas, pulgas y lombrices) adaptado al peso y tipo de mascota para prevenir infecciones digestivas y dermatológicas."
  },
  {
    "icono": "bi-speedometer2",
    "nombre": "Control de Peso",
    "precio": "$8.000",
    "descripcion": "Seguimiento del estado nutricional, pesaje de precisión y diseño de planes de alimentación personalizados para combatir el sobrepeso o desnutrición."
  }
];

// Tarjetas de categorías de la tienda (con el ancla a la que baja cada botón)
export const categoriasTienda = [
  {
    "icono": "bi-box-seam",
    "nombre": "Comida Canina",
    "desde": "Desde $11.500",
    "descripcion": "Alimento super premium para perros adultos. Formulado con proteínas de alta calidad.",
    "ancla": "comida-canina-detalle"
  },
  {
    "icono": "bi-tag",
    "nombre": "Comida Felina",
    "desde": "Desde $2.253",
    "descripcion": "Alimento seco rico en taurina y omegas, ideal para salud urinaria y control de bolas de pelo.",
    "ancla": "comida-felina-detalle"
  },
  {
    "icono": "bi-flower2",
    "nombre": "Heno Conejos",
    "desde": "Desde $2.248",
    "descripcion": "Heno Timothy orgánico con pellets enriquecidos para desgaste dental y digestión saludable.",
    "ancla": "comida-conejos-detalle"
  },
  {
    "icono": "bi-feather",
    "nombre": "Mixtura Aves",
    "desde": "Desde $2.290",
    "descripcion": "Mezcla de semillas y suplementos para catitas, ninfas y canarios. Favorece el plumaje.",
    "ancla": "comida-aves-detalle"
  },
  {
    "icono": "bi-controller",
    "nombre": "Juguetes Interactivos",
    "desde": "Desde $2.100",
    "descripcion": "Pelotas mordedoras para perros, rascadores felinos, cuerdas resistentes, sonajeros para aves y túneles interactivos para conejos.",
    "ancla": "juguetes-detalle"
  },
  {
    "icono": "bi-gift",
    "nombre": "Premios y Snacks",
    "desde": "Desde $2.000",
    "descripcion": "Snacks para entrenamiento canino, golosinas cremosas para gatos, barritas de miel para aves y frutas deshidratadas para roedores.",
    "ancla": "premios-detalle"
  }
];

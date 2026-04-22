import { useState, useMemo, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const SERVICIOS = ["Domésticos MEX","Domésticos USA","Export D2D","Export CBX","Import D2D","Import CBX","Export Ports","Import Ports"];
const MODALIDADES = ["DV53'","DV48'","DV40^","FULL DV40^ X2","FULL CHASIS40^ X2","REEFER 53'","FLATBED 53'","LOWBOY"];
const CANALES = ["Llamada","WhatsApp","Correo","LinkedIn","Referido","Visita en frío","Reunión","Notetaker IA","Evento","Web","Otro"];
const INDUSTRIAS = ["Automotriz","Auto-partes","Manufactura","Alimentos","Tequila / Bebidas","Farmacéutico","Textil","Electrónica","Químicos","Adhesivos","Retail","Otro"];
const NOTA_TIPOS = ["Llamada","WhatsApp","Reunión","Notetaker IA","Correo","Visita","Recordatorio","Nota interna"];
const PIPELINE_STAGES = [
  {id:"lead",label:"Lead",color:"#6b7280"},
  {id:"contacto",label:"Contacto",color:"#3b82f6"},
  {id:"diagnostico",label:"Diagnóstico",color:"#8b5cf6"},
  {id:"cotizacion",label:"Cotización",color:"#f59e0b"},
  {id:"negociacion",label:"Negociación",color:"#f97316"},
  {id:"cierre",label:"Cierre",color:"#10b981"},
];

// ─── USERS ───────────────────────────────────────────────────────────────────
const INIT_USERS = [
  {id:"admin1",name:"Ramon Morato",   email:"ramon@morganexpress.com", password:"morgan2026",role:"admin",avatar:"RM"},
  {id:"admin2",name:"Carlos Director",email:"carlos@morganexpress.com",password:"morgan2026",role:"admin",avatar:"CD"},
  {id:"v1",name:"Luis Hernández", email:"luis@morganexpress.com", password:"vendedor1",role:"vendedor",avatar:"LH",meta:80000,currency:"USD"},
  {id:"v2",name:"Sofía Ramírez",  email:"sofia@morganexpress.com",password:"vendedor2",role:"vendedor",avatar:"SR",meta:60000,currency:"USD"},
  {id:"v3",name:"Marco Torres",   email:"marco@morganexpress.com",password:"vendedor3",role:"vendedor",avatar:"MT",meta:75000,currency:"USD"},
  {id:"v4",name:"Ana Gutiérrez",  email:"ana@morganexpress.com",  password:"vendedor4",role:"vendedor",avatar:"AG",meta:50000,currency:"USD"},
];

// ─── SEED NEWS (weekly + monthly intel feed) ─────────────────────────────────
const INIT_NEWS = [
  // weekly
  {id:"n1",tipo:"semanal",fecha:"2026-04-14",titulo:"Nearshoring impulsa demanda de flete cross-border",industrias:["Automotriz","Manufactura","Electrónica"],impacto:"positivo",bullets:["Toyota y Honda expanden plantas en NL y JAL — más volumen Export D2D","Inversión de $4.2B USD en parques industriales Monterrey y Saltillo","Demanda de flete export proyectada +18% Q2 2026"],accion:"Atacar proveedores Tier 1 automotriz en zona Monterrey-Saltillo. Ofrecer Export D2D con cuenta espejo."},
  {id:"n2",tipo:"semanal",fecha:"2026-04-14",titulo:"Alza en combustible afecta tarifas domésticas",industrias:["Alimentos","Retail","Manufactura"],impacto:"negativo",bullets:["Diesel +8% en últimas 2 semanas, impacto directo en fletes domésticos MXN","Competidores medianos absorbiendo pérdida — presión en márgenes","Clientes domésticos solicitan congelamiento de tarifas"],accion:"Revisar contratos MXN vigentes. Comunicar ajuste tarifario antes del cierre de Q2."},
  {id:"n3",tipo:"semanal",fecha:"2026-04-14",titulo:"Sector tequila récord de exportaciones",industrias:["Tequila / Bebidas"],impacto:"positivo",bullets:["Exportaciones tequila +22% YoY — récord histórico","Japón y Europa crecen como destinos, más rutas Export Ports","Casa Cuervo, Patrón y Jimador en expansión agresiva"],accion:"Priorizar prospectos tequileros esta semana. Activar Export Ports como diferenciador."},
  // monthly
  {id:"n4",tipo:"mensual",fecha:"2026-04-01",titulo:"Industria farmacéutica relocalización a México",industrias:["Farmacéutico"],impacto:"positivo",bullets:["Pfizer y Bayer anuncian plantas en Guadalajara y CDMX — Q3 2026","Regulación COFEPRIS actualizada facilita importación de insumos","5 laboratorios nuevos en El Salto JAL buscando operador certificado"],accion:"Morgan tiene C-TPAT — diferenciador clave. Atacar laboratorios nuevos en El Salto con propuesta HAZMAT."},
  {id:"n5",tipo:"mensual",fecha:"2026-04-01",titulo:"Tensiones arancelarias EEUU-China impactan electrónica",industrias:["Electrónica"],impacto:"mixto",bullets:["Aranceles +25% en electrónica china abren mercado a fabricantes MX","Samsung, LG y Foxconn evalúan expandir manufactura en MTY y TIJ","Importaciones electrónica por Laredo +31% Q1 2026"],accion:"Oportunidad Import D2D desde Laredo. Contactar nuevos proveedores electrónica en MTY."},
  {id:"n6",tipo:"mensual",fecha:"2026-04-01",titulo:"Retail e-commerce impulsa last-mile cross-border",industrias:["Retail"],impacto:"positivo",bullets:["Amazon MX y Mercado Libre expanden centros de distribución JAL","Cross-border B2C crece 44% — necesidad de soluciones D2D ágiles","FedEx y UPS saturados — operadores especializados tienen ventana"],accion:"Posicionar Morgan como alternativa ágil a FedEx para retailers. Contactar jefes de logística en retailers CDMX y GDL."},
];

// ─── SEED PROSPECTOS ──────────────────────────────────────────────────────────
const INIT_PROSPECTOS = [
  {id:"p1",empresa:"AB InBev México",contacto:"Jorge Pedraza",contactos:[{nombre:"Jorge Pedraza",cargo:"Logistics Manager",tel:"+52 33 3880 1100",email:"jpedraza@abinbev.com"}],tel:"+52 33 3880 1100",email:"jpedraza@abinbev.com",ciudad:"Guadalajara, JAL",industria:"Alimentos",canalInicial:"Referido",volumen:40,responsable:"v1",notas:"Temporada alta noviembre–diciembre. Prefiere contacto lunes AM. GPS espejo obligatorio.",servicios:["Export D2D","Domésticos MEX"],modalidades:["DV53'","REEFER 53'"],createdAt:"2026-01-10",status:"activo",
    resumen:"Cliente ancla. Alta confianza, pagador puntual. Relación de 2 años. Conoce el modo de operar de Morgan.",
    recordatorios:[{id:"r1",texto:"Llamar para renovar contrato Q3",fecha:"2026-04-25",completado:false,userId:"v1"},{id:"r2",texto:"Enviar propuesta REEFER para temporada navideña",fecha:"2026-05-10",completado:false,userId:"v1"}]},
  {id:"p2",empresa:"Henkel México",contacto:"Patricia Salcedo",contactos:[{nombre:"Patricia Salcedo",cargo:"Supply Chain Dir.",tel:"+52 55 5328 9000",email:"psalcedo@henkel.com"}],tel:"+52 55 5328 9000",email:"psalcedo@henkel.com",ciudad:"Ciudad de México",industria:"Químicos",canalInicial:"LinkedIn",volumen:15,responsable:"v2",notas:"Adhesivos industriales. Requiere HAZMAT. Contactar vía correo primero.",servicios:["Export D2D","Export CBX"],modalidades:["DV53'","FULL CHASIS40^ X2"],createdAt:"2026-01-18",status:"activo",
    resumen:"Proceso lento pero sólido. Decisión por comité. Patricia es la puerta de entrada, pero el VP de Supply Chain aprueba.",
    recordatorios:[{id:"r3",texto:"Follow-up cotización HAZMAT enviada",fecha:"2026-04-18",completado:false,userId:"v2"}]},
  {id:"p3",empresa:"Samsung Electronics MX",contacto:"Kwon Ji-ho",contactos:[{nombre:"Kwon Ji-ho",cargo:"Import Manager",tel:"+52 81 8173 2200",email:"kjiho@samsung.com.mx"},{nombre:"Laura Vega",cargo:"Logistics Coord.",tel:"+52 81 8173 2201",email:"lvega@samsung.com.mx"}],tel:"+52 81 8173 2200",email:"kjiho@samsung.com.mx",ciudad:"Monterrey, NL",industria:"Electrónica",canalInicial:"Evento",volumen:25,responsable:"v3",notas:"Temporada alta oct–dic. Puntual en pagos. Le gustan los Rayados.",servicios:["Import D2D","Import CBX"],modalidades:["DV53'","DV48'"],createdAt:"2026-01-25",status:"activo",
    resumen:"Coreano muy formal. Siempre puntual a reuniones. Requiere reporte de estatus por correo. No WhatsApp.",
    recordatorios:[{id:"r4",texto:"Enviar reporte mensual de estatus",fecha:"2026-04-30",completado:false,userId:"v3"}]},
  {id:"p4",empresa:"Tupperware México",contacto:"Andrea Cisneros",contactos:[{nombre:"Andrea Cisneros",cargo:"Procurement Mgr.",tel:"+52 33 3616 7400",email:"acisneros@tupperware.mx"}],tel:"+52 33 3616 7400",email:"acisneros@tupperware.mx",ciudad:"El Salto, JAL",industria:"Manufactura",canalInicial:"Visita en frío",volumen:10,responsable:"v1",notas:"Manufactura plástico. 10 viajes/mes estable.",servicios:["Export D2D","Export CBX"],modalidades:["DV53'","DV40^"],createdAt:"2026-02-03",status:"activo",resumen:"",recordatorios:[]},
  {id:"p5",empresa:"Ryder de México",contacto:"Michael Barnes",contactos:[{nombre:"Michael Barnes",cargo:"VP Operations",tel:"+52 81 8151 6000",email:"mbarnes@ryder.com"}],tel:"+52 81 8151 6000",email:"mbarnes@ryder.com",ciudad:"Laredo TX / Monterrey",industria:"Automotriz",canalInicial:"Referido",volumen:35,responsable:"v4",notas:"Broker. Volumen alto. Exigen GPS y póliza vigente.",servicios:["Export D2D","Import D2D","Export CBX","Import CBX"],modalidades:["DV53'","DV48'","FULL DV40^ X2"],createdAt:"2026-02-10",status:"activo",resumen:"",recordatorios:[]},
  {id:"p6",empresa:"Schneider National MX",contacto:"Dave Kowalski",contactos:[{nombre:"Dave Kowalski",cargo:"Cross-border Dir.",tel:"+1 920 592 2000",email:"dkowalski@schneider.com"}],tel:"+1 920 592 2000",email:"dkowalski@schneider.com",ciudad:"Green Bay, WI",industria:"Manufactura",canalInicial:"LinkedIn",volumen:50,responsable:"v2",notas:"Proceso aprobación 3-6 meses. Alto volumen si entra.",servicios:["Export D2D","Import D2D"],modalidades:["DV53'","DV48'","FLATBED 53'"],createdAt:"2026-02-20",status:"activo",resumen:"",recordatorios:[]},
  {id:"p7",empresa:"CH Robinson MX",contacto:"Sarah Mitchell",contactos:[{nombre:"Sarah Mitchell",cargo:"Account Executive",tel:"+1 952 683 3474",email:"smitchell@chrobinson.com"}],tel:"+1 952 683 3474",email:"smitchell@chrobinson.com",ciudad:"Eden Prairie, MN",industria:"Manufactura",canalInicial:"Web",volumen:20,responsable:"v3",notas:"3PL. Exigen documentación impecable.",servicios:["Export D2D","Export CBX","Import D2D"],modalidades:["DV53'","DV40^"],createdAt:"2026-03-01",status:"activo",resumen:"",recordatorios:[]},
  {id:"p8",empresa:"Laboratorios PISA",contacto:"Roberto Alcántara",contactos:[{nombre:"Roberto Alcántara",cargo:"Logistics Dir.",tel:"+52 33 3001 5000",email:"ralcantara@pisa.com.mx"}],tel:"+52 33 3001 5000",email:"ralcantara@pisa.com.mx",ciudad:"Tonalá, JAL",industria:"Farmacéutico",canalInicial:"Llamada",volumen:8,responsable:"v1",notas:"Cruce incluido. 2 bandas obligatorias. Certificado fumigación.",servicios:["Export D2D","Domésticos MEX"],modalidades:["REEFER 53'","DV53'"],createdAt:"2026-03-05",status:"activo",
    resumen:"Relación antigua con Morgan. Muy exigente en cumplimiento. Pagador regular (net 45).",
    recordatorios:[{id:"r5",texto:"Confirmar primer viaje programado",fecha:"2026-04-20",completado:false,userId:"v1"}]},
  {id:"p9",empresa:"FedEx Supply Chain MX",contacto:"Héctor Mendoza",contactos:[{nombre:"Héctor Mendoza",cargo:"Network Manager",tel:"+52 55 5228 9904",email:"hmendoza@fedex.com"}],tel:"+52 55 5228 9904",email:"hmendoza@fedex.com",ciudad:"CDMX",industria:"Retail",canalInicial:"Evento",volumen:60,responsable:"v4",notas:"Alta demanda temporada navideña. Muy exigente.",servicios:["Domésticos MEX","Export D2D","Import D2D"],modalidades:["DV53'","DV48'"],createdAt:"2026-03-10",status:"activo",resumen:"",recordatorios:[]},
  {id:"p10",empresa:"Casa Cuervo / Tequila JW",contacto:"Alejandro Villanueva",contactos:[{nombre:"Alejandro Villanueva",cargo:"Logistics VP",tel:"+52 33 3134 4900",email:"avillanueva@cuervo.com"},{nombre:"Monserrat Ríos",cargo:"Transport Coord.",tel:"+52 33 3134 4901",email:"mrios@cuervo.com"}],tel:"+52 33 3134 4900",email:"avillanueva@cuervo.com",ciudad:"Guadalajara, JAL",industria:"Tequila / Bebidas",canalInicial:"Referido",volumen:18,responsable:"v2",notas:"Temporada alta antes de navidad y verano. 2 gatas. Custodiada.",servicios:["Export D2D","Export CBX","Export Ports"],modalidades:["DV53'","FULL CHASIS40^ X2"],createdAt:"2026-03-15",status:"activo",resumen:"",recordatorios:[]},
  {id:"p11",empresa:"ALBATRANS Logistics",contacto:"Juan Oswaldo Díaz",contactos:[{nombre:"Juan Oswaldo Díaz",cargo:"Operations Mgr.",tel:"+52 33 3812 0100",email:"jodiaz@albatrans.mx"}],tel:"+52 33 3812 0100",email:"jodiaz@albatrans.mx",ciudad:"Guadalajara, JAL",industria:"Manufactura",canalInicial:"Visita en frío",volumen:6,responsable:"v3",notas:"Llegada antes 6 AM. Viaja custodiada a frontera.",servicios:["Export D2D"],modalidades:["DV53'","DV48'"],createdAt:"2026-03-20",status:"activo",resumen:"",recordatorios:[]},
  {id:"p12",empresa:"Landstar System MX",contacto:"James Wilson",contactos:[{nombre:"James Wilson",cargo:"Director México",tel:"+1 904 398 9400",email:"jwilson@landstar.com"}],tel:"+1 904 398 9400",email:"jwilson@landstar.com",ciudad:"Jacksonville, FL",industria:"Manufactura",canalInicial:"LinkedIn",volumen:30,responsable:"v4",notas:"Asset-light broker. Gran volumen. Tarifa muy competitiva.",servicios:["Export D2D","Import D2D","Export CBX"],modalidades:["DV53'","DV40^","FULL DV40^ X2"],createdAt:"2026-03-22",status:"activo",resumen:"",recordatorios:[]},
];

// ─── SEED LEADS (with document cycle) ────────────────────────────────────────
const mkDoc = (cotPDF, cotMonto, convLink, convFecha, facMonto, facFecha, cur="USD") => ({
  cotizacion: cotPDF ? {nombre:cotPDF, monto:cotMonto, currency:cur, fecha:"2026-03-01", archivo:"[PDF simulado]"} : null,
  convenio:   convLink ? {link:convLink, monto:convMonto||cotMonto, currency:cur, fechaAceptacion:convFecha, estado:"aceptado"} : null,
  factura:    facMonto ? {monto:facMonto, currency:cur, fecha:facFecha, folio:`FAC-2026-${Math.floor(Math.random()*900+100)}`} : null,
});
const convMonto = 0; // placeholder used above

const INIT_LEADS = [
  {id:"l1",prospecto:"p1",servicio:"Export D2D",valor:32000,currency:"USD",prob:75,stage:"negociacion",responsable:"v1",fechaCierre:"2026-04-30",
   docs:{cotizacion:{nombre:"Cotización_ABInBev_ExportD2D.pdf",monto:32000,currency:"USD",fecha:"2026-03-01"},convenio:null,factura:null},
   notas:[{id:"n1",fecha:"2026-01-11",tipo:"Llamada",texto:"Primer contacto. Muy interesado en ruta JAL→Laredo→Chicago. 40 viajes/mes.",pendiente:false},{id:"n2",fecha:"2026-01-28",tipo:"Visita",texto:"Visita a planta. Confirman arranque con 15 viajes. GPS espejo obligatorio.",pendiente:false},{id:"n3",fecha:"2026-02-15",tipo:"Correo",texto:"Cotización enviada. $2,200 USD por viaje. Esperando aprobación.",pendiente:false},{id:"n4",fecha:"2026-03-10",tipo:"WhatsApp",texto:"Nego precio. Piden $2,050. Estamos en $2,150 final.",pendiente:true,fechaPendiente:"2026-04-20"}]},
  {id:"l2",prospecto:"p2",servicio:"Export CBX",valor:18500,currency:"USD",prob:60,stage:"cotizacion",responsable:"v2",fechaCierre:"2026-05-15",
   docs:{cotizacion:{nombre:"Cotización_Henkel_HAZMAT.pdf",monto:18500,currency:"USD",fecha:"2026-03-01"},convenio:null,factura:null},
   notas:[{id:"n5",fecha:"2026-01-20",tipo:"LinkedIn",texto:"Contacto inicial. Muy receptivo.",pendiente:false},{id:"n6",fecha:"2026-02-08",tipo:"Llamada",texto:"Diagnóstico: adhesivos industriales, 15 viajes/mes, HAZMAT requerido.",pendiente:false},{id:"n7",fecha:"2026-03-01",tipo:"Correo",texto:"Cotización HAZMAT enviada. Precio incluye recargo peligroso.",pendiente:true,fechaPendiente:"2026-04-18"}]},
  {id:"l3",prospecto:"p3",servicio:"Import D2D",valor:42000,currency:"USD",prob:80,stage:"negociacion",responsable:"v3",fechaCierre:"2026-04-20",
   docs:{cotizacion:{nombre:"Cotización_Samsung_ImportD2D.pdf",monto:42000,currency:"USD",fecha:"2026-02-20"},convenio:{link:"https://docs.google.com/document/d/samsung-convenio",monto:42000,currency:"USD",fechaAceptacion:"2026-03-15",estado:"en_revision"},factura:null},
   notas:[{id:"n8",fecha:"2026-01-26",tipo:"Evento",texto:"Conocidos en Expo Transporte GDL.",pendiente:false},{id:"n9",fecha:"2026-02-12",tipo:"Llamada",texto:"Samsung quiere 25 viajes/mes Import. Electrónica delicado.",pendiente:false},{id:"n10",fecha:"2026-03-05",tipo:"Reunión",texto:"Visita Monterrey. Todo listo. Pendiente firma contrato.",pendiente:true,fechaPendiente:"2026-04-22"}]},
  {id:"l4",prospecto:"p4",servicio:"Export D2D",valor:14000,currency:"USD",prob:50,stage:"cotizacion",responsable:"v1",fechaCierre:"2026-05-31",
   docs:{cotizacion:{nombre:"Cotización_Tupperware_Export.pdf",monto:14000,currency:"USD",fecha:"2026-03-15"},convenio:null,factura:null},
   notas:[{id:"n11",fecha:"2026-02-04",tipo:"Visita",texto:"Visita en frío El Salto. Tienen proveedor actual pero inconformes.",pendiente:false},{id:"n12",fecha:"2026-03-15",tipo:"Correo",texto:"Cotización enviada. Precio competitivo vs. proveedor actual.",pendiente:true,fechaPendiente:"2026-04-25"}]},
  {id:"l5",prospecto:"p5",servicio:"Export D2D",valor:55000,currency:"USD",prob:40,stage:"diagnostico",responsable:"v4",fechaCierre:"2026-06-30",
   docs:{cotizacion:null,convenio:null,factura:null},
   notas:[{id:"n13",fecha:"2026-02-11",tipo:"Llamada",texto:"Referido por Morgan USA. 35 viajes/mes potencial.",pendiente:false},{id:"n14",fecha:"2026-03-08",tipo:"Reunión",texto:"Diagnóstico inicial. Ryder exige GPS, póliza y C-TPAT.",pendiente:true,fechaPendiente:"2026-04-20"}]},
  {id:"l6",prospecto:"p6",servicio:"Export D2D",valor:95000,currency:"USD",prob:20,stage:"contacto",responsable:"v2",fechaCierre:"2026-08-31",
   docs:{cotizacion:null,convenio:null,factura:null},
   notas:[{id:"n15",fecha:"2026-02-21",tipo:"LinkedIn",texto:"Mensaje frío. Respondió interesado. Proceso 3-6 meses.",pendiente:true,fechaPendiente:"2026-05-01"}]},
  {id:"l7",prospecto:"p8",servicio:"Export D2D",valor:12000,currency:"USD",prob:85,stage:"cierre",responsable:"v1",fechaCierre:"2026-04-10",
   docs:{cotizacion:{nombre:"Cotización_PISA_Export.pdf",monto:12000,currency:"USD",fecha:"2026-03-20"},convenio:{link:"https://docs.google.com/document/d/pisa-convenio",monto:12000,currency:"USD",fechaAceptacion:"2026-04-01",estado:"aceptado"},factura:{monto:12000,currency:"USD",fecha:"2026-04-05",folio:"FAC-2026-441"}},
   notas:[{id:"n16",fecha:"2026-03-06",tipo:"Llamada",texto:"PISA quieren retomar. Fácil entrada.",pendiente:false},{id:"n17",fecha:"2026-04-01",tipo:"WhatsApp",texto:"Firmado. Primer viaje 10 abril.",pendiente:false}]},
  {id:"l8",prospecto:"p9",servicio:"Domésticos MEX",valor:380000,currency:"MXN",prob:65,stage:"cotizacion",responsable:"v4",fechaCierre:"2026-05-01",
   docs:{cotizacion:{nombre:"Cotización_FedEx_DomMEX.pdf",monto:380000,currency:"MXN",fecha:"2026-04-02"},convenio:null,factura:null},
   notas:[{id:"n18",fecha:"2026-03-11",tipo:"Evento",texto:"FedEx en feria. 60 viajes domésticos/mes.",pendiente:false},{id:"n19",fecha:"2026-04-02",tipo:"Llamada",texto:"Cotización MXN preparada. Buena respuesta.",pendiente:true,fechaPendiente:"2026-04-22"}]},
  {id:"l9",prospecto:"p10",servicio:"Export D2D",valor:28000,currency:"USD",prob:70,stage:"negociacion",responsable:"v2",fechaCierre:"2026-04-25",
   docs:{cotizacion:{nombre:"Cotización_Cuervo_Export.pdf",monto:28000,currency:"USD",fecha:"2026-04-01"},convenio:null,factura:null},
   notas:[{id:"n20",fecha:"2026-03-16",tipo:"Llamada",texto:"Casa Cuervo referido por Tequila Expo. 18 viajes export.",pendiente:false},{id:"n21",fecha:"2026-04-01",tipo:"Reunión",texto:"Visita GDL. Confirman custodia y 2 gatas. Precio casi acordado.",pendiente:true,fechaPendiente:"2026-04-24"}]},
  {id:"l10",prospecto:"p12",servicio:"Export CBX",valor:78000,currency:"USD",prob:30,stage:"lead",responsable:"v4",fechaCierre:"2026-07-31",
   docs:{cotizacion:null,convenio:null,factura:null},
   notas:[{id:"n22",fecha:"2026-03-23",tipo:"LinkedIn",texto:"Landstar en LinkedIn. Gran volumen potencial. Proceso largo.",pendiente:true,fechaPendiente:"2026-04-30"}]},
  {id:"l11",prospecto:"p7",servicio:"Export D2D",valor:35000,currency:"USD",prob:45,stage:"diagnostico",responsable:"v3",fechaCierre:"2026-06-15",
   docs:{cotizacion:null,convenio:null,factura:null},
   notas:[{id:"n23",fecha:"2026-03-02",tipo:"Web",texto:"Formulario web CH Robinson. Interés cross-border.",pendiente:false},{id:"n24",fecha:"2026-03-22",tipo:"Llamada",texto:"Diagnóstico call. 20 viajes/mes export. Documentación perfecta.",pendiente:true,fechaPendiente:"2026-04-28"}]},
  {id:"l12",prospecto:"p11",servicio:"Export D2D",valor:9500,currency:"USD",prob:55,stage:"cotizacion",responsable:"v3",fechaCierre:"2026-05-20",
   docs:{cotizacion:{nombre:"Cotización_ALBATRANS_Export.pdf",monto:9500,currency:"USD",fecha:"2026-04-05"},convenio:null,factura:null},
   notas:[{id:"n25",fecha:"2026-03-21",tipo:"Visita",texto:"Visita fría GDL. Receptivo. 6 viajes/mes, ruta fija JAL→Laredo.",pendiente:false},{id:"n26",fecha:"2026-04-05",tipo:"Correo",texto:"Cotización enviada. Incluye custodia hasta frontera.",pendiente:true,fechaPendiente:"2026-04-19"}]},
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt=(v,c="USD")=>c==="MXN"?`$${Number(v).toLocaleString("es-MX",{maximumFractionDigits:0})} MXN`:`$${Number(v).toLocaleString("en-US",{maximumFractionDigits:0})} USD`;
const toUSD=(v,c)=>c==="MXN"?v/17.5:v;
const getStage=id=>PIPELINE_STAGES.find(s=>s.id===id);
const today=()=>new Date().toISOString().split("T")[0];
const isOverdue=fecha=>fecha&&fecha<today();
const tempColor=p=>p>=70?{bg:"#fef9c3",text:"#713f12",label:"Caliente 🔥"}:p>=40?{bg:"#fff7ed",text:"#9a3412",label:"Tibio ☀️"}:{bg:"#eff6ff",text:"#1e3a8a",label:"Frío ❄️"};
const AC=[["#fde68a","#92400e"],["#a7f3d0","#065f46"],["#bfdbfe","#1e40af"],["#fecaca","#991b1b"],["#ddd6fe","#4c1d95"],["#fed7aa","#7c2d12"],["#cffafe","#164e63"],["#d1fae5","#064e3b"]];

function Av({name="?",size=32}){
  const i=name.split(" ").map(w=>w[0]||"").join("").toUpperCase().slice(0,2);
  const[bg,tx]=AC[name.charCodeAt(0)%AC.length];
  return<div style={{width:size,height:size,borderRadius:"50%",background:bg,color:tx,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.36,fontWeight:700,flexShrink:0,fontFamily:"'Syne',sans-serif"}}>{i}</div>;
}
const CC={"Llamada":["#eff6ff","#1e40af"],"WhatsApp":["#f0fdf4","#166534"],"Correo":["#faf5ff","#6b21a8"],"LinkedIn":["#eff6ff","#1e3a8a"],"Referido":["#fef9c3","#713f12"],"Visita en frío":["#fff7ed","#9a3412"],"Reunión":["#fdf4ff","#86198f"],"Notetaker IA":["#f0fdf4","#065f46"],"Evento":["#fdf4ff","#86198f"],"Web":["#f0f9ff","#075985"],"Otro":["#f3f4f6","#374151"],"Visita":["#fff7ed","#9a3412"],"Recordatorio":["#fef2f2","#991b1b"],"Nota interna":["#f8fafc","#475569"]};
function CB({canal,small=false}){const[bg,tx]=CC[canal]||CC["Otro"];return<span style={{background:bg,color:tx,fontSize:small?"10px":"11px",padding:small?"2px 6px":"3px 9px",borderRadius:6,fontWeight:500,whiteSpace:"nowrap"}}>{canal}</span>;}
function SD({stageId}){const s=getStage(stageId);return<span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11}}><span style={{width:7,height:7,borderRadius:"50%",background:s?.color||"#9ca3af",flexShrink:0}}/><span style={{color:"#374151"}}>{s?.label||stageId}</span></span>;}
const LS={"fontSize":10,"color":"#9ca3af","fontWeight":700,"letterSpacing":"0.7px","display":"block","marginBottom":4};
const IS={"width":"100%","padding":"8px 10px","border":"1px solid #e5e7eb","borderRadius":6,"fontSize":12,"background":"#fff","outline":"none"};
function FF({label,value,onChange,type="text"}){return<div><label style={LS}>{label.toUpperCase()}</label><input type={type} value={value} onChange={e=>onChange(e.target.value)} style={{...IS,boxSizing:"border-box"}}/></div>;}
function Modal({children,onClose,width=540,title}){return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}><div style={{background:"#fff",borderRadius:16,padding:24,width:"100%",maxWidth:width,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:title?16:0}}>{title&&<div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"#111"}}>{title}</div>}<button onClick={onClose} style={{marginLeft:"auto",background:"#f3f4f6",border:"none",borderRadius:6,width:27,height:27,cursor:"pointer",color:"#6b7280",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>{children}</div></div>;}

// ─── DOC CYCLE STATUS COMPONENT ──────────────────────────────────────────────
function DocCycleBar({docs}){
  const steps=[
    {key:"cotizacion",label:"Cotización",icon:"📄"},
    {key:"convenio",  label:"Convenio",  icon:"📝"},
    {key:"factura",   label:"Facturado", icon:"🧾"},
  ];
  return(
    <div style={{display:"flex",alignItems:"center",gap:0,background:"#f9fafb",borderRadius:10,padding:"8px 12px",border:"1px solid #e5e7eb"}}>
      {steps.map((s,i)=>{
        const d=docs?.[s.key];
        const done=!!d;
        const isConv=s.key==="convenio";
        const convState=d?.estado;
        const color=done?(isConv&&convState==="en_revision"?"#f59e0b":isConv&&convState==="aceptado"?"#10b981":"#10b981"):"#d1d5db";
        const bg=done?(isConv&&convState==="en_revision"?"#fffbeb":isConv&&convState==="aceptado"?"#f0fdf4":"#f0fdf4"):"#f9fafb";
        return(
          <div key={s.key} style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,background:bg,borderRadius:7,padding:"5px 10px",border:`1px solid ${done?"#d1fae5":"#e5e7eb"}`}}>
              <span style={{fontSize:13}}>{s.icon}</span>
              <div>
                <div style={{fontSize:9,color:"#9ca3af",fontWeight:700}}>{s.label.toUpperCase()}</div>
                <div style={{fontSize:10,fontWeight:600,color:done?"#065f46":"#9ca3af"}}>
                  {done?(isConv?convState==="aceptado"?"Aceptado":"En revisión":d.folio||fmt(d.monto,d.currency)):"Pendiente"}
                </div>
              </div>
            </div>
            {i<steps.length-1&&<div style={{width:20,height:1,background:done?"#10b981":"#e5e7eb",margin:"0 2px"}}/>}
          </div>
        );
      })}
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function App(){
  const[user,setUser]=useState(null);
  const[users,setUsers]=useState(INIT_USERS);
  const[prospectos,setProspectos]=useState(INIT_PROSPECTOS);
  const[leads,setLeads]=useState(INIT_LEADS);
  const[news]=useState(INIT_NEWS);
  const[view,setView]=useState("dashboard");
  const[fv,setFv]=useState(null);// filter vendedor
  const[modal,setModal]=useState(null);
  const[mdata,setMdata]=useState(null);

  if(!user)return<Login users={users} onLogin={setUser}/>;
  const isAdmin=user.role==="admin";
  const vendedores=users.filter(u=>u.role==="vendedor");

  const sLeads=isAdmin?(fv?leads.filter(l=>l.responsable===fv):leads):leads.filter(l=>l.responsable===user.id);
  const sProsp=isAdmin?(fv?prospectos.filter(p=>p.responsable===fv):prospectos):prospectos.filter(p=>p.responsable===user.id);

  // my reminders — direct calculation, no useMemo
  const userId=user.id;
  const uid=isAdmin&&fv?fv:userId;
  const myReminderProsp=isAdmin?(!fv?prospectos:prospectos.filter(p=>p.responsable===fv)):prospectos.filter(p=>p.responsable===userId);
  const myReminders=myReminderProsp.flatMap(p=>(p.recordatorios||[]).filter(r=>!r.completado&&(!isAdmin||r.userId===uid)).map(r=>({...r,empresa:p.empresa,prospectoId:p.id})));

  const om=(t,d=null)=>{setModal(t);setMdata(d);};
  const cm=()=>{setModal(null);setMdata(null);};
  const uLead=l=>setLeads(p=>p.map(x=>x.id===l.id?l:x));
  const uProsp=p=>setProspectos(prev=>prev.map(x=>x.id===p.id?p:x));
  const addReminder=(pid,r)=>setProspectos(p=>p.map(x=>x.id===pid?{...x,recordatorios:[...(x.recordatorios||[]),r]}:x));
  const doneReminder=(pid,rid)=>setProspectos(p=>p.map(x=>x.id===pid?{...x,recordatorios:(x.recordatorios||[]).map(r=>r.id===rid?{...r,completado:true}:r)}:x));

  const NAV=[{id:"dashboard",label:"Dashboard",icon:"⊡"},{id:"pipeline",label:"Pipeline",icon:"⊟"},{id:"prospectos",label:"Prospectos",icon:"⊕"},{id:"inteligencia",label:"Inteligencia",icon:"◉"},...(isAdmin?[{id:"equipo",label:"Equipo",icon:"⊛"}]:[])];

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans',sans-serif",background:"#f5f5f3",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet"/>

      {/* SIDEBAR */}
      <div style={{width:210,background:"#0a0a0a",display:"flex",flexDirection:"column",borderRight:"1px solid #1a1a1a",flexShrink:0}}>
        <div style={{padding:"18px 16px 14px",borderBottom:"1px solid #1a1a1a"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:26,height:26,background:"#f59e0b",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:"#000"}}>M</span></div>
            <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#fff",lineHeight:1}}>Morgan CRM</div><div style={{fontSize:9,color:"#4b5563",marginTop:2}}>v3 · {isAdmin?"Admin":"Vendedor"}</div></div>
          </div>
        </div>
        <nav style={{padding:"10px 8px",flex:1,overflowY:"auto"}}>
          <div style={{fontSize:9,color:"#374151",fontWeight:700,letterSpacing:"0.9px",padding:"0 8px",marginBottom:5}}>NAVEGACIÓN</div>
          {NAV.map(n=>{
            const badge=n.id==="dashboard"&&myReminders.filter(r=>isOverdue(r.fecha)).length;
            return(
              <button key={n.id} onClick={()=>setView(n.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"8px 10px",borderRadius:7,border:"none",cursor:"pointer",marginBottom:2,background:view===n.id?"#1a1a1a":"transparent",color:view===n.id?"#f59e0b":"#6b7280",fontSize:12,fontWeight:view===n.id?600:400,textAlign:"left"}}>
                <span style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:13,width:14,textAlign:"center"}}>{n.icon}</span>{n.label}</span>
                {badge>0&&<span style={{background:"#dc2626",color:"#fff",fontSize:9,borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{badge}</span>}
              </button>
            );
          })}
          {isAdmin&&<div style={{marginTop:16}}>
            <div style={{fontSize:9,color:"#374151",fontWeight:700,letterSpacing:"0.9px",padding:"0 8px",marginBottom:5}}>VENDEDOR</div>
            <button onClick={()=>setFv(null)} style={{display:"flex",alignItems:"center",gap:7,width:"100%",padding:"6px 10px",borderRadius:6,border:"none",cursor:"pointer",marginBottom:2,background:!fv?"#1a2a3a":"transparent",color:!fv?"#60a5fa":"#6b7280",fontSize:11}}>
              <span style={{width:18,height:18,borderRadius:"50%",background:"#1f2937",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,flexShrink:0,color:"#9ca3af"}}>ALL</span>Todo el equipo
            </button>
            {vendedores.map(v=><button key={v.id} onClick={()=>setFv(v.id)} style={{display:"flex",alignItems:"center",gap:7,width:"100%",padding:"6px 10px",borderRadius:6,border:"none",cursor:"pointer",marginBottom:2,background:fv===v.id?"#1a2a3a":"transparent",color:fv===v.id?"#60a5fa":"#6b7280",fontSize:11}}><Av name={v.name} size={18}/>{v.name.split(" ")[0]}</button>)}
          </div>}
        </nav>
        <div style={{padding:"10px 8px",borderTop:"1px solid #1a1a1a"}}>
          <div style={{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",borderRadius:7,background:"#141414",marginBottom:6}}>
            <Av name={user.name} size={24}/>
            <div style={{minWidth:0}}><div style={{color:"#e5e7eb",fontSize:11,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name.split(" ")[0]}</div><div style={{color:"#4b5563",fontSize:9,textTransform:"capitalize"}}>{user.role}</div></div>
          </div>
          <button onClick={()=>{setUser(null);setView("dashboard");}} style={{width:"100%",padding:6,background:"transparent",border:"1px solid #1f1f1f",borderRadius:6,color:"#6b7280",fontSize:11,cursor:"pointer"}}>Cerrar sesión</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        {/* TOPBAR */}
        <div style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"13px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:19,color:"#111",margin:0,letterSpacing:"-0.3px"}}>{{dashboard:"Dashboard",pipeline:"Pipeline",prospectos:"Prospectos",inteligencia:"Inteligencia Comercial",equipo:"Equipo"}[view]}</h1>
            <p style={{color:"#9ca3af",fontSize:11,margin:"2px 0 0"}}>{isAdmin?(fv?`Viendo: ${users.find(u=>u.id===fv)?.name}`:"Vista consolidada — todo el equipo"):`Hola, ${user.name.split(" ")[0]}`}</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            {view==="prospectos"&&<button onClick={()=>om("bulk")} style={{padding:"8px 14px",background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:8,color:"#374151",fontSize:12,cursor:"pointer",fontWeight:500}}>↑ Carga masiva</button>}
            {["prospectos","pipeline","equipo"].includes(view)&&<button onClick={()=>om(view==="prospectos"?"nprosp":view==="pipeline"?"nlead":"nuser")} style={{padding:"8px 16px",background:"#f59e0b",border:"none",borderRadius:8,color:"#000",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"'Syne',sans-serif"}}>
              {view==="prospectos"?"+ Nuevo prospecto":view==="pipeline"?"+ Nuevo negocio":"+ Agregar vendedor"}
            </button>}
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
          {view==="dashboard"   &&<DashboardV3 leads={sLeads} prospectos={sProsp} users={users} user={user} isAdmin={isAdmin} vendedores={vendedores} fv={fv} setFv={setFv} setView={setView} allLeads={leads} reminders={myReminders} doneReminder={doneReminder}/>}
          {view==="pipeline"    &&<PipelineV3 leads={sLeads} prospectos={prospectos} users={users} onOpenLead={l=>om("leadDetail",l)} onUpdateLead={uLead}/>}
          {view==="prospectos"  &&<ProspView prospectos={sProsp} leads={leads} users={users} onOpen={p=>om("prospDetail",p)} isAdmin={isAdmin}/>}
          {view==="inteligencia"&&<IntelView news={news} user={user} prospectos={sProsp}/>}
          {view==="equipo"&&isAdmin&&<EquipoView users={users} leads={leads} setFv={setFv} setView={setView}/>}
        </div>
      </div>

      {modal==="nprosp"     &&<MProspecto users={users} user={user} isAdmin={isAdmin} onSave={p=>{setProspectos(v=>[...v,{...p,id:`p${Date.now()}`,createdAt:today(),status:"activo",resumen:"",recordatorios:[]}]);cm();}} onClose={cm}/>}
      {modal==="nlead"      &&<MLead prospectos={prospectos} users={users} user={user} isAdmin={isAdmin} onSave={l=>{setLeads(v=>[...v,{...l,id:`l${Date.now()}`,notas:[],docs:{cotizacion:null,convenio:null,factura:null},createdAt:today()}]);cm();}} onClose={cm} initP={mdata?.p}/>}
      {modal==="leadDetail" &&mdata&&<MLeadDetail lead={mdata} prospectos={prospectos} users={users} onUpdate={l=>{uLead(l);setMdata(l);}} onClose={cm}/>}
      {modal==="prospDetail"&&mdata&&<MProspDetail prospecto={mdata} leads={leads.filter(l=>l.prospecto===mdata.id)} users={users} onUpdate={p=>{uProsp(p);setMdata(p);}} onNewLead={()=>om("nlead",{p:mdata.id})} onClose={cm} addReminder={addReminder} doneReminder={doneReminder}/>}
      {modal==="bulk"       &&<MBulk users={users} user={user} isAdmin={isAdmin} onSave={list=>{setProspectos(v=>[...v,...list.map((p,i)=>({...p,id:`pb${Date.now()}${i}`,createdAt:today(),status:"activo",resumen:"",recordatorios:[]}))]);cm();}} onClose={cm}/>}
      {modal==="nuser"      &&<MUser onSave={u=>{setUsers(v=>[...v,{...u,id:`v${Date.now()}`,role:"vendedor"}]);cm();}} onClose={cm}/>}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({users,onLogin}){
  const[email,setEmail]=useState("ramon@morganexpress.com");
  const[pass,setPass]=useState("morgan2026");
  const[err,setErr]=useState("");const[loading,setLoading]=useState(false);
  const go=()=>{setLoading(true);setTimeout(()=>{const u=users.find(u=>u.email===email&&u.password===pass);if(u){onLogin(u);setErr("");}else setErr("Correo o contraseña incorrectos");setLoading(false);},500);};
  const demos=[{label:"Admin — Ramon",e:"ramon@morganexpress.com",p:"morgan2026"},{label:"Vendedor — Luis",e:"luis@morganexpress.com",p:"vendedor1"},{label:"Vendedor — Sofía",e:"sofia@morganexpress.com",p:"vendedor2"}];
  return(<div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
    <div style={{width:"100%",maxWidth:400,padding:"0 20px"}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{width:38,height:38,background:"#f59e0b",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:"#000"}}>M</span></div><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#fff",letterSpacing:"-0.5px"}}>Morgan CRM</span></div>
        <p style={{color:"#6b7280",fontSize:13,margin:0}}>Sales Pipeline Monitor · v3</p>
      </div>
      <div style={{background:"#141414",borderRadius:16,padding:28,border:"1px solid #222"}}>
        {[["CORREO",email,setEmail,"text"],["CONTRASEÑA",pass,setPass,"password"]].map(([l,v,s,t])=>(
          <div key={l} style={{marginBottom:16}}>
            <label style={{display:"block",color:"#9ca3af",fontSize:11,fontWeight:600,letterSpacing:"0.8px",marginBottom:5}}>{l}</label>
            <input type={t} value={v} onChange={e=>s(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} style={{width:"100%",padding:"10px 13px",background:"#0a0a0a",border:"1px solid #2a2a2a",borderRadius:8,color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
        ))}
        {err&&<div style={{background:"#2d1515",color:"#f87171",padding:"9px 13px",borderRadius:7,fontSize:12,marginBottom:14}}>{err}</div>}
        <button onClick={go} style={{width:"100%",padding:"11px",background:"#f59e0b",border:"none",borderRadius:8,color:"#000",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Syne',sans-serif"}}>{loading?"Entrando...":"Entrar al sistema"}</button>
      </div>
      <div style={{marginTop:16,background:"#141414",borderRadius:12,padding:"13px 16px",border:"1px solid #222"}}>
        <p style={{color:"#4b5563",fontSize:10,margin:"0 0 8px",fontWeight:700,letterSpacing:"0.8px"}}>ACCESOS DEMO</p>
        {demos.map(d=><div key={d.e} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{color:"#6b7280",fontSize:11}}>{d.label}</span><button onClick={()=>{setEmail(d.e);setPass(d.p);}} style={{background:"#222",border:"none",color:"#f59e0b",fontSize:10,padding:"2px 8px",borderRadius:4,cursor:"pointer"}}>usar</button></div>)}
      </div>
    </div>
  </div>);
}

// ─── DASHBOARD V3 ─────────────────────────────────────────────────────────────
function DashboardV3({leads,prospectos,users,user,isAdmin,vendedores,fv,setFv,setView,allLeads,reminders,doneReminder}){
  const tu=fv?users.find(u=>u.id===fv):(!isAdmin?user:null);
  const meta=tu?.meta||0;const metaUSD=toUSD(meta,tu?.currency||"USD");
  // use REAL factured amounts where available, else closed stage
  const facturado=leads.reduce((s,l)=>{if(l.docs?.factura)return s+toUSD(l.docs.factura.monto,l.docs.factura.currency);if(l.stage==="cierre")return s+toUSD(l.valor,l.currency);return s;},0);
  const forecast=leads.reduce((s,l)=>s+toUSD(l.valor,l.currency)*(l.prob/100),0);
  const pct=metaUSD>0?Math.min((facturado/metaUSD)*100,100):0;
  const barColor=pct>=100?"#10b981":pct>=60?"#f59e0b":"#3b82f6";
  const overdueR=reminders.filter(r=>isOverdue(r.fecha));
  const upcomingR=reminders.filter(r=>!isOverdue(r.fecha)).slice(0,4);

  return(<div style={{display:"flex",flexDirection:"column",gap:20}}>
    {/* Team cards */}
    {isAdmin&&!fv&&<div>
      <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:10}}>RESUMEN DEL EQUIPO</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:10}}>
        {vendedores.map(v=>{
          const vL=allLeads.filter(l=>l.responsable===v.id);
          const vF=vL.reduce((s,l)=>{if(l.docs?.factura)return s+toUSD(l.docs.factura.monto,l.docs.factura.currency);if(l.stage==="cierre")return s+toUSD(l.valor,l.currency);return s;},0);
          const vM=toUSD(v.meta,v.currency||"USD");const vP=vM>0?Math.min((vF/vM)*100,100):0;
          const col=vP>=70?"#10b981":vP>=40?"#f59e0b":"#3b82f6";
          return<div key={v.id} onClick={()=>setFv(v.id)} style={{background:"#fff",borderRadius:12,padding:"14px 16px",border:"1px solid #e5e7eb",cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.08)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}><Av name={v.name} size={30}/><div><div style={{fontWeight:600,fontSize:12,color:"#111"}}>{v.name}</div><div style={{fontSize:10,color:"#9ca3af"}}>{vL.length} negocios</div></div></div>
            <div style={{height:4,background:"#f3f4f6",borderRadius:2,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:`${vP}%`,background:col,borderRadius:2}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}><span style={{color:col,fontWeight:600}}>{vP.toFixed(0)}% meta</span><span style={{color:"#9ca3af"}}>{fmt(vF)}</span></div>
          </div>;
        })}
      </div>
    </div>}

    {/* Meta + reminders row */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:18}}>
      {(tu||!isAdmin)&&<div style={{background:"#fff",borderRadius:14,padding:"22px 24px",border:"1px solid #e5e7eb"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div><div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px"}}>META MENSUAL</div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:"#111",marginTop:3}}>{tu?tu.name:"Tu progreso"}</div></div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,color:barColor}}>{pct.toFixed(0)}%</div>
        </div>
        <div style={{height:8,background:"#f3f4f6",borderRadius:4,overflow:"hidden",marginBottom:18}}><div style={{height:"100%",width:`${pct}%`,background:barColor,borderRadius:4,transition:"width 1s ease"}}/></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9}}>
          {[{label:"Target",val:fmt(metaUSD)},{label:"Facturado",val:fmt(facturado)},{label:"Faltante",val:fmt(Math.max(metaUSD-facturado,0))},{label:"Forecast",val:fmt(forecast)}].map(c=>(
            <div key={c.label} style={{background:"#f9fafb",borderRadius:9,padding:"11px 12px",border:"1px solid #f0f0ee"}}>
              <div style={{fontSize:10,color:"#9ca3af",marginBottom:4}}>{c.label}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#111"}}>{c.val}</div>
            </div>
          ))}
        </div>
        {/* Doc cycle summary */}
        <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #f5f5f3"}}>
          <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:10}}>CICLO DOCUMENTAL EN CURSO</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[{label:"Con cotización",cnt:leads.filter(l=>l.docs?.cotizacion).length,color:"#f59e0b"},{label:"Convenio aceptado",cnt:leads.filter(l=>l.docs?.convenio?.estado==="aceptado").length,color:"#3b82f6"},{label:"Facturados",cnt:leads.filter(l=>l.docs?.factura).length,color:"#10b981"}].map(c=>(
              <div key={c.label} style={{background:"#f9fafb",borderRadius:8,padding:"10px 12px",borderTop:`3px solid ${c.color}`}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:c.color}}>{c.cnt}</div>
                <div style={{fontSize:10,color:"#9ca3af",marginTop:2}}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>}

      {/* REMINDERS PANEL */}
      <div style={{background:"#fff",borderRadius:14,padding:"18px 20px",border:"1px solid #e5e7eb",display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:12}}>PENDIENTES Y RECORDATORIOS</div>
        {overdueR.length>0&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"8px 10px",marginBottom:10}}>
          <div style={{fontSize:10,color:"#dc2626",fontWeight:700,marginBottom:6}}>VENCIDOS ({overdueR.length})</div>
          {overdueR.map(r=>(
            <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"5px 0",borderBottom:"1px solid #fee2e2"}}>
              <div><div style={{fontSize:11,fontWeight:600,color:"#111"}}>{r.empresa}</div><div style={{fontSize:11,color:"#6b7280"}}>{r.texto}</div></div>
              <button onClick={()=>doneReminder(r.prospectoId,r.id)} style={{background:"#fee2e2",border:"none",borderRadius:4,padding:"2px 7px",fontSize:10,cursor:"pointer",color:"#dc2626",flexShrink:0,marginLeft:6}}>✓</button>
            </div>
          ))}
        </div>}
        <div style={{flex:1}}>
          {upcomingR.length>0?upcomingR.map(r=>(
            <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 0",borderBottom:"1px solid #f5f5f3"}}>
              <div><div style={{fontSize:11,fontWeight:600,color:"#111"}}>{r.empresa}</div><div style={{fontSize:11,color:"#6b7280"}}>{r.texto}</div><div style={{fontSize:10,color:"#9ca3af"}}>{r.fecha}</div></div>
              <button onClick={()=>doneReminder(r.prospectoId,r.id)} style={{background:"#f3f4f6",border:"none",borderRadius:4,padding:"2px 7px",fontSize:10,cursor:"pointer",color:"#374151",flexShrink:0,marginLeft:6}}>✓</button>
            </div>
          )):<div style={{textAlign:"center",padding:"20px 0",color:"#9ca3af",fontSize:12}}>Sin recordatorios pendientes</div>}
        </div>
      </div>
    </div>

    {/* Pipeline + hot leads */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <div style={{background:"#fff",borderRadius:14,padding:"18px 20px",border:"1px solid #e5e7eb"}}>
        <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:12}}>DISTRIBUCIÓN PIPELINE</div>
        {PIPELINE_STAGES.map(s=>{const cnt=leads.filter(l=>l.stage===s.id).length;const val=leads.filter(l=>l.stage===s.id).reduce((a,l)=>a+toUSD(l.valor,l.currency),0);const mx=Math.max(...PIPELINE_STAGES.map(st=>leads.filter(l=>l.stage===st.id).length),1);return(<div key={s.id} style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}><div style={{width:76,fontSize:10,color:"#6b7280",textAlign:"right",flexShrink:0}}>{s.label}</div><div style={{flex:1,height:18,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(cnt/mx)*100}%`,background:s.color,borderRadius:3,minWidth:cnt>0?3:0}}/></div><div style={{width:80,fontSize:10,color:"#374151",fontWeight:500}}>{cnt} · {fmt(val)}</div></div>);})}
      </div>
      <div style={{background:"#fff",borderRadius:14,padding:"18px 20px",border:"1px solid #e5e7eb"}}>
        <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:12}}>NEGOCIOS MÁS CALIENTES</div>
        {leads.filter(l=>l.prob>=60&&l.stage!=="cierre").sort((a,b)=>b.prob-a.prob).slice(0,5).map(l=>{const p=prospectos.find(x=>x.id===l.prospecto);const t=tempColor(l.prob);return(<div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #f5f5f3"}}><div><div style={{fontSize:12,fontWeight:600,color:"#111"}}>{p?.empresa||"—"}</div><div style={{fontSize:10,color:"#9ca3af"}}>{l.servicio} · <SD stageId={l.stage}/></div></div><div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:700}}>{fmt(l.valor,l.currency)}</div><span style={{background:t.bg,color:t.text,fontSize:9,padding:"2px 7px",borderRadius:8}}>{t.label}</span></div></div>);})}
      </div>
    </div>
  </div>);
}

// ─── PIPELINE V3 ──────────────────────────────────────────────────────────────
function PipelineV3({leads,prospectos,users,onOpenLead,onUpdateLead}){
  const[filters,setFilters]=useState({search:"",servicio:"",vendedor:"",temp:"",docs:""});
  const vend=users.filter(u=>u.role==="vendedor");
  const fl=useMemo(()=>leads.filter(l=>{
    const p=prospectos.find(x=>x.id===l.prospecto);
    if(filters.search&&!p?.empresa.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if(filters.servicio&&l.servicio!==filters.servicio) return false;
    if(filters.vendedor&&l.responsable!==filters.vendedor) return false;
    if(filters.temp==="caliente"&&l.prob<70) return false;
    if(filters.temp==="tibio"&&(l.prob<40||l.prob>=70)) return false;
    if(filters.temp==="frio"&&l.prob>=40) return false;
    if(filters.docs==="cotizacion"&&!l.docs?.cotizacion) return false;
    if(filters.docs==="convenio"&&l.docs?.convenio?.estado!=="aceptado") return false;
    if(filters.docs==="factura"&&!l.docs?.factura) return false;
    if(filters.docs==="sin_cot"&&l.docs?.cotizacion) return false;
    return true;
  }),[leads,filters,prospectos]);

  return(<div>
    <div style={{display:"flex",gap:7,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
      <input value={filters.search} onChange={e=>setFilters(f=>({...f,search:e.target.value}))} placeholder="Buscar empresa..." style={{padding:"7px 11px",border:"1px solid #e5e7eb",borderRadius:7,fontSize:12,outline:"none",width:170}}/>
      {[["servicio","Servicio",SERVICIOS],["vendedor","Vendedor",vend.map(v=>({value:v.id,label:v.name}))],].map(([k,ph,opts])=>(
        <select key={k} value={filters[k]} onChange={e=>setFilters(f=>({...f,[k]:e.target.value}))} style={{padding:"7px 11px",border:"1px solid #e5e7eb",borderRadius:7,fontSize:12,background:"#fff"}}>
          <option value="">{ph}</option>
          {opts.map(o=>typeof o==="string"?<option key={o}>{o}</option>:<option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ))}
      <select value={filters.temp} onChange={e=>setFilters(f=>({...f,temp:e.target.value}))} style={{padding:"7px 11px",border:"1px solid #e5e7eb",borderRadius:7,fontSize:12,background:"#fff"}}>
        <option value="">Temperatura</option><option value="caliente">🔥 Caliente</option><option value="tibio">☀️ Tibio</option><option value="frio">❄️ Frío</option>
      </select>
      <select value={filters.docs} onChange={e=>setFilters(f=>({...f,docs:e.target.value}))} style={{padding:"7px 11px",border:"1px solid #e5e7eb",borderRadius:7,fontSize:12,background:"#fff"}}>
        <option value="">Doc. ciclo</option><option value="cotizacion">📄 Con cotización</option><option value="convenio">📝 Convenio aceptado</option><option value="factura">🧾 Facturado</option><option value="sin_cot">⚠ Sin cotización</option>
      </select>
      {Object.values(filters).some(Boolean)&&<button onClick={()=>setFilters({search:"",servicio:"",vendedor:"",temp:"",docs:""})} style={{padding:"7px 10px",background:"#fee2e2",border:"none",borderRadius:7,color:"#dc2626",fontSize:11,cursor:"pointer",fontWeight:500}}>✕ Limpiar</button>}
      <span style={{fontSize:11,color:"#9ca3af",marginLeft:"auto"}}>{fl.length} negocios</span>
    </div>
    <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
      {PIPELINE_STAGES.map(stage=>{
        const col=fl.filter(l=>l.stage===stage.id);
        const tot=col.reduce((s,l)=>s+toUSD(l.valor,l.currency),0);
        const si=PIPELINE_STAGES.findIndex(s=>s.id===stage.id);
        return(<div key={stage.id} style={{minWidth:215,flex:"0 0 215px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,padding:"7px 10px",background:"#fff",borderRadius:9,border:`1px solid ${stage.color}44`}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:7,height:7,borderRadius:"50%",background:stage.color}}/><span style={{fontSize:11,fontWeight:600,color:"#374151"}}>{stage.label}</span><span style={{background:"#f3f4f6",color:"#6b7280",borderRadius:8,padding:"1px 6px",fontSize:10}}>{col.length}</span></div>
            <span style={{fontSize:10,color:"#9ca3af"}}>{fmt(tot)}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {col.map(l=>{
              const p=prospectos.find(x=>x.id===l.prospecto);const t=tempColor(l.prob);const owner=users.find(u=>u.id===l.responsable);
              const hasCot=!!l.docs?.cotizacion;const hasConv=l.docs?.convenio?.estado==="aceptado";const hasFac=!!l.docs?.factura;
              return(<div key={l.id} onClick={()=>onOpenLead(l)} style={{background:"#fff",borderRadius:9,padding:"11px 12px",border:"1px solid #e5e7eb",cursor:"pointer",borderLeft:`3px solid ${stage.color}`}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.09)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                <div style={{fontWeight:600,fontSize:12,color:"#111",marginBottom:2}}>{p?.empresa||"—"}</div>
                <div style={{fontSize:10,color:"#6b7280",marginBottom:6}}>{l.servicio}</div>
                <div style={{display:"flex",gap:4,marginBottom:6}}>
                  <span title="Cotización" style={{fontSize:13,opacity:hasCot?1:0.2}}>📄</span>
                  <span title="Convenio" style={{fontSize:13,opacity:hasConv?1:0.2}}>📝</span>
                  <span title="Factura" style={{fontSize:13,opacity:hasFac?1:0.2}}>🧾</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"#111"}}>{fmt(l.valor,l.currency)}</span>
                  <span style={{background:t.bg,color:t.text,fontSize:9,padding:"2px 6px",borderRadius:6}}>{l.prob}%</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}><Av name={owner?.name||"?"} size={16}/><span style={{fontSize:9,color:"#9ca3af"}}>{owner?.name.split(" ")[0]}</span></div>
                  <div style={{display:"flex",gap:3}} onClick={e=>e.stopPropagation()}>
                    {si>0&&<button onClick={()=>onUpdateLead({...l,stage:PIPELINE_STAGES[si-1].id})} style={{background:"#f3f4f6",border:"none",borderRadius:4,width:18,height:18,cursor:"pointer",fontSize:9,color:"#6b7280"}}>←</button>}
                    {si<PIPELINE_STAGES.length-1&&<button onClick={()=>onUpdateLead({...l,stage:PIPELINE_STAGES[si+1].id})} style={{background:"#f59e0b",border:"none",borderRadius:4,width:18,height:18,cursor:"pointer",fontSize:9,color:"#000",fontWeight:700}}>→</button>}
                  </div>
                </div>
              </div>);
            })}
            {col.length===0&&<div style={{background:"#fafaf8",borderRadius:9,padding:"18px 10px",border:"1px dashed #e5e7eb",textAlign:"center",color:"#d1d5db",fontSize:11}}>Sin negocios</div>}
          </div>
        </div>);
      })}
    </div>
  </div>);
}

// ─── PROSPECTOS VIEW ──────────────────────────────────────────────────────────
function ProspView({prospectos,leads,users,onOpen,isAdmin}){
  const[filters,setFilters]=useState({search:"",industria:"",servicio:"",canal:"",responsable:""});
  const vend=users.filter(u=>u.role==="vendedor");
  const fl=useMemo(()=>prospectos.filter(p=>{
    if(filters.search&&!p.empresa.toLowerCase().includes(filters.search.toLowerCase())&&!p.contacto.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if(filters.industria&&p.industria!==filters.industria) return false;
    if(filters.servicio&&!p.servicios.includes(filters.servicio)) return false;
    if(filters.canal&&p.canalInicial!==filters.canal) return false;
    if(filters.responsable&&p.responsable!==filters.responsable) return false;
    return true;
  }),[prospectos,filters]);

  return(<div>
    <div style={{display:"flex",gap:7,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
      <input value={filters.search} onChange={e=>setFilters(f=>({...f,search:e.target.value}))} placeholder="Buscar empresa, contacto..." style={{padding:"7px 11px",border:"1px solid #e5e7eb",borderRadius:7,fontSize:12,outline:"none",width:200}}/>
      {[["industria","Industria",INDUSTRIAS],["servicio","Servicio",SERVICIOS],["canal","Canal",CANALES]].map(([k,ph,opts])=>(
        <select key={k} value={filters[k]} onChange={e=>setFilters(f=>({...f,[k]:e.target.value}))} style={{padding:"7px 11px",border:"1px solid #e5e7eb",borderRadius:7,fontSize:12,background:"#fff"}}>
          <option value="">{ph}</option>{opts.map(o=><option key={o}>{o}</option>)}
        </select>
      ))}
      {isAdmin&&<select value={filters.responsable} onChange={e=>setFilters(f=>({...f,responsable:e.target.value}))} style={{padding:"7px 11px",border:"1px solid #e5e7eb",borderRadius:7,fontSize:12,background:"#fff"}}>
        <option value="">Vendedor</option>{vend.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
      </select>}
      {Object.values(filters).some(Boolean)&&<button onClick={()=>setFilters({search:"",industria:"",servicio:"",canal:"",responsable:""})} style={{padding:"7px 10px",background:"#fee2e2",border:"none",borderRadius:7,color:"#dc2626",fontSize:11,cursor:"pointer"}}>✕ Limpiar</button>}
      <span style={{fontSize:11,color:"#9ca3af",marginLeft:"auto"}}>{fl.length} prospectos</span>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:12}}>
      {fl.map(p=>{
        const owner=users.find(u=>u.id===p.responsable);const pL=leads.filter(l=>l.prospecto===p.id);
        const val=pL.reduce((s,l)=>s+toUSD(l.valor,l.currency),0);
        const pending=(p.recordatorios||[]).filter(r=>!r.completado).length;
        return(<div key={p.id} onClick={()=>onOpen(p)} style={{background:"#fff",borderRadius:12,padding:"15px 16px",border:"1px solid #e5e7eb",cursor:"pointer"}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.08)"}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
            <div style={{minWidth:0,marginRight:8}}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#111",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.empresa}</div><div style={{fontSize:11,color:"#6b7280"}}>{p.contacto}</div></div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <span style={{background:"#f3f4f6",color:"#374151",fontSize:9,padding:"3px 7px",borderRadius:5,fontWeight:500}}>{p.industria}</span>
              {pending>0&&<span style={{background:"#fef3c7",color:"#92400e",fontSize:9,padding:"2px 6px",borderRadius:10,fontWeight:600}}>⏰ {pending}</span>}
            </div>
          </div>
          <div style={{fontSize:11,color:"#6b7280",marginBottom:7}}>📍 {p.ciudad} · {p.volumen} viajes/mes</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:7}}>
            {p.servicios.slice(0,2).map(s=><span key={s} style={{background:"#eff6ff",color:"#1d4ed8",fontSize:9,padding:"2px 6px",borderRadius:4}}>{s}</span>)}
            {p.servicios.length>2&&<span style={{fontSize:9,color:"#9ca3af"}}>+{p.servicios.length-2}</span>}
            <CB canal={p.canalInicial} small/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:"1px solid #f5f5f3"}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}><Av name={owner?.name||"?"} size={18}/><span style={{fontSize:10,color:"#9ca3af"}}>{owner?.name.split(" ")[0]}</span></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:700,color:"#111"}}>{fmt(val)}</div><div style={{fontSize:9,color:"#9ca3af"}}>{pL.length} negocio{pL.length!==1?"s":""}</div></div>
          </div>
        </div>);
      })}
    </div>
  </div>);
}

// ─── INTELIGENCIA COMERCIAL ───────────────────────────────────────────────────
function IntelView({news,user,prospectos}){
  const[tipo,setTipo]=useState("semanal");
  const[impacto,setImpacto]=useState("");
  const myIndustrias=useMemo(()=>{const s=new Set();prospectos.forEach(p=>s.add(p.industria));return s;},[prospectos]);
  const filtered=news.filter(n=>n.tipo===tipo&&(impacto===""||n.impacto===impacto));
  const relevantes=filtered.filter(n=>n.industrias.some(i=>myIndustrias.has(i)));
  const otros=filtered.filter(n=>!n.industrias.some(i=>myIndustrias.has(i)));

  const impactoStyle={positivo:{bg:"#f0fdf4",border:"#bbf7d0",badge:"#166534",badgeBg:"#dcfce7",icon:"📈"},negativo:{bg:"#fef2f2",border:"#fecaca",badge:"#991b1b",badgeBg:"#fee2e2",icon:"📉"},mixto:{bg:"#fffbeb",border:"#fde68a",badge:"#713f12",badgeBg:"#fef3c7",icon:"↔️"}};

  return(<div>
    <div style={{background:"#fff",borderRadius:12,padding:"14px 18px",border:"1px solid #e5e7eb",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#111"}}>Inteligencia Comercial</div>
        <div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>Noticias relevantes para tu industria · Semana del 14 abril 2026</div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <div style={{display:"flex",background:"#f3f4f6",borderRadius:8,padding:3}}>
          {["semanal","mensual"].map(t=><button key={t} onClick={()=>setTipo(t)} style={{padding:"5px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:tipo===t?"#111":"transparent",color:tipo===t?"#fff":"#6b7280"}}>{t==="semanal"?"Esta semana":"Este mes"}</button>)}
        </div>
        <select value={impacto} onChange={e=>setImpacto(e.target.value)} style={{padding:"6px 11px",border:"1px solid #e5e7eb",borderRadius:7,fontSize:12,background:"#fff"}}>
          <option value="">Todos</option><option value="positivo">📈 Positivo</option><option value="negativo">📉 Negativo</option><option value="mixto">↔️ Mixto</option>
        </select>
      </div>
    </div>

    {relevantes.length>0&&<div style={{marginBottom:22}}>
      <div style={{fontSize:10,color:"#065f46",fontWeight:700,letterSpacing:"0.9px",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
        <span style={{background:"#dcfce7",color:"#065f46",padding:"2px 8px",borderRadius:4}}>RELEVANTE PARA TU PIPELINE</span>
        <span style={{color:"#9ca3af"}}>— basado en las industrias de tus prospectos</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {relevantes.map(n=>{const s=impactoStyle[n.impacto]||impactoStyle.mixto;return(<div key={n.id} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:12,padding:"16px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{flex:1,marginRight:12}}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#111",marginBottom:4}}>{s.icon} {n.titulo}</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{n.industrias.map(i=><span key={i} style={{background:myIndustrias.has(i)?"#111":"#e5e7eb",color:myIndustrias.has(i)?"#fff":"#6b7280",fontSize:9,padding:"2px 7px",borderRadius:4,fontWeight:500}}>{i}</span>)}</div></div>
            <span style={{background:s.badgeBg,color:s.badge,fontSize:10,padding:"3px 10px",borderRadius:6,fontWeight:600,flexShrink:0}}>{n.impacto.charAt(0).toUpperCase()+n.impacto.slice(1)}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:12}}>
            {n.bullets.map((b,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{color:s.badge,fontWeight:700,flexShrink:0,marginTop:1}}>•</span><span style={{fontSize:12,color:"#374151",lineHeight:1.5}}>{b}</span></div>)}
          </div>
          <div style={{background:"rgba(255,255,255,0.7)",borderRadius:8,padding:"9px 12px",borderLeft:`3px solid ${s.badge}`}}>
            <span style={{fontSize:10,color:s.badge,fontWeight:700}}>ACCIÓN SUGERIDA: </span>
            <span style={{fontSize:12,color:"#374151"}}>{n.accion}</span>
          </div>
        </div>);
        })}
      </div>
    </div>}

    {otros.length>0&&<div>
      <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:10}}>OTRAS INDUSTRIAS</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {otros.map(n=>{const s=impactoStyle[n.impacto]||impactoStyle.mixto;return(<div key={n.id} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"13px 15px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div style={{fontWeight:600,fontSize:12,color:"#111",flex:1,marginRight:8}}>{s.icon} {n.titulo}</div>
            <span style={{background:s.badgeBg,color:s.badge,fontSize:9,padding:"2px 7px",borderRadius:5,fontWeight:600,flexShrink:0}}>{n.impacto}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:8}}>
            {n.bullets.slice(0,2).map((b,i)=><div key={i} style={{fontSize:11,color:"#6b7280"}}>• {b}</div>)}
          </div>
          <div style={{display:"flex",gap:4}}>{n.industrias.map(i=><span key={i} style={{background:"#f3f4f6",color:"#6b7280",fontSize:9,padding:"2px 6px",borderRadius:4}}>{i}</span>)}</div>
        </div>);
        })}
      </div>
    </div>}
  </div>);
}

// ─── EQUIPO VIEW ──────────────────────────────────────────────────────────────
function EquipoView({users,leads,setFv,setView}){
  const vend=users.filter(u=>u.role==="vendedor");
  return(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14}}>
    {vend.map(v=>{
      const vL=leads.filter(l=>l.responsable===v.id);
      const fac=vL.reduce((s,l)=>{if(l.docs?.factura)return s+toUSD(l.docs.factura.monto,l.docs.factura.currency);if(l.stage==="cierre")return s+toUSD(l.valor,l.currency);return s;},0);
      const pipe=vL.filter(l=>l.stage!=="cierre").reduce((s,l)=>s+toUSD(l.valor,l.currency),0);
      const fc=vL.reduce((s,l)=>s+toUSD(l.valor,l.currency)*(l.prob/100),0);
      const meta=toUSD(v.meta,v.currency||"USD");const pct=meta>0?Math.min((fac/meta)*100,100):0;
      const col=pct>=70?"#10b981":pct>=40?"#f59e0b":"#3b82f6";
      return(<div key={v.id} style={{background:"#fff",borderRadius:14,padding:"18px 20px",border:"1px solid #e5e7eb"}}>
        <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:14}}><Av name={v.name} size={38}/><div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#111"}}>{v.name}</div><div style={{fontSize:10,color:"#9ca3af"}}>{v.email}</div></div></div>
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#6b7280",marginBottom:4}}><span>Meta: {fmt(meta)}</span><span style={{color:col,fontWeight:600}}>{pct.toFixed(0)}%</span></div>
          <div style={{height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:3}}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>
          {[{l:"Facturado",v:fmt(fac)},{l:"Pipeline",v:fmt(pipe)},{l:"Forecast",v:fmt(fc)}].map(c=><div key={c.l} style={{background:"#f9fafb",borderRadius:7,padding:"7px 8px",textAlign:"center"}}><div style={{fontSize:9,color:"#9ca3af",marginBottom:2}}>{c.l}</div><div style={{fontSize:11,fontWeight:700,color:"#111"}}>{c.v}</div></div>)}
        </div>
        <div style={{display:"flex",gap:4,marginBottom:12}}>{PIPELINE_STAGES.map(s=>{const cnt=vL.filter(l=>l.stage===s.id).length;return<div key={s.id} title={`${s.label}: ${cnt}`} style={{flex:cnt+0.2,height:5,background:cnt>0?s.color:"#f3f4f6",borderRadius:3,minWidth:5}}/>;})}</div>
        <button onClick={()=>{setFv(v.id);setView("dashboard");}} style={{width:"100%",padding:"7px",background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:7,color:"#374151",fontSize:11,cursor:"pointer",fontWeight:500}}>Ver detalle →</button>
      </div>);
    })}
  </div>);
}

// ─── MODAL LEAD DETAIL V3 ────────────────────────────────────────────────────
function MLeadDetail({lead,prospectos,users,onUpdate,onClose}){
  const[activeTab,setActiveTab]=useState("notas");
  const[nota,setNota]=useState("");const[tipoNota,setTipoNota]=useState("Llamada");const[esPendiente,setEsPendiente]=useState(false);const[fechaPend,setFechaPend]=useState("");
  const[docTab,setDocTab]=useState("cotizacion");
  const[docForm,setDocForm]=useState({nombre:"",monto:"",link:"",fecha:today(),estado:"en_revision"});
  const p=prospectos.find(x=>x.id===lead.prospecto);const owner=users.find(u=>u.id===lead.responsable);

  const addNota=()=>{
    if(!nota.trim()) return;
    const n={id:`nota${Date.now()}`,fecha:today(),tipo:tipoNota,texto:nota,pendiente:esPendiente,fechaPendiente:esPendiente?fechaPend:undefined};
    onUpdate({...lead,notas:[...lead.notas,n]});setNota("");setEsPendiente(false);setFechaPend("");
  };
  const moveStage=dir=>{const si=PIPELINE_STAGES.findIndex(s=>s.id===lead.stage);const ni=si+dir;if(ni<0||ni>=PIPELINE_STAGES.length)return;onUpdate({...lead,stage:PIPELINE_STAGES[ni].id});};
  const saveDoc=()=>{
    if(docTab==="cotizacion"&&docForm.nombre&&docForm.monto){
      onUpdate({...lead,docs:{...lead.docs,cotizacion:{nombre:docForm.nombre,monto:Number(docForm.monto),currency:lead.currency,fecha:docForm.fecha}}});
    }else if(docTab==="convenio"&&docForm.link&&docForm.monto){
      onUpdate({...lead,docs:{...lead.docs,convenio:{link:docForm.link,monto:Number(docForm.monto),currency:lead.currency,fechaAceptacion:docForm.fecha,estado:docForm.estado}}});
    }else if(docTab==="factura"&&docForm.monto){
      const folio=`FAC-2026-${Math.floor(Math.random()*900+100)}`;
      onUpdate({...lead,docs:{...lead.docs,factura:{monto:Number(docForm.monto),currency:lead.currency,fecha:docForm.fecha,folio}}});
    }
    setDocForm({nombre:"",monto:"",link:"",fecha:today(),estado:"en_revision"});
  };

  return(<Modal onClose={onClose} width={700}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
      <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:"#111"}}>{p?.empresa||"—"}</div><div style={{fontSize:12,color:"#6b7280"}}>{lead.servicio} · {fmt(lead.valor,lead.currency)} · {owner?.name}</div></div>
      <span style={{background:tempColor(lead.prob).bg,color:tempColor(lead.prob).text,padding:"4px 11px",borderRadius:20,fontSize:11,fontWeight:600}}>{lead.prob}% · {tempColor(lead.prob).label}</span>
    </div>
    {/* Stage */}
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
        {PIPELINE_STAGES.map(s=><button key={s.id} onClick={()=>onUpdate({...lead,stage:s.id})} style={{padding:"5px 11px",borderRadius:6,border:`1px solid ${lead.stage===s.id?s.color:"#e5e7eb"}`,background:lead.stage===s.id?s.color:"#fff",color:lead.stage===s.id?"#fff":"#374151",fontSize:11,cursor:"pointer",fontWeight:lead.stage===s.id?700:400}}>{s.label}</button>)}
        <div style={{marginLeft:"auto",display:"flex",gap:5}}>
          <button onClick={()=>moveStage(-1)} style={{padding:"5px 10px",background:"#f3f4f6",border:"none",borderRadius:6,fontSize:11,cursor:"pointer"}}>← Atrás</button>
          <button onClick={()=>moveStage(1)}  style={{padding:"5px 10px",background:"#f59e0b",border:"none",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer"}}>Avanzar →</button>
        </div>
      </div>
    </div>
    {/* Doc cycle bar */}
    <div style={{marginBottom:14}}><DocCycleBar docs={lead.docs}/></div>

    {/* Tabs */}
    <div style={{display:"flex",borderBottom:"1px solid #e5e7eb",marginBottom:16,gap:0}}>
      {[["notas","📋 Bitácora"],["documentos","📂 Documentos"],["info","👤 Contacto"]].map(([t,l])=>(
        <button key={t} onClick={()=>setActiveTab(t)} style={{padding:"8px 16px",border:"none",borderBottom:`2px solid ${activeTab===t?"#f59e0b":"transparent"}`,background:"transparent",color:activeTab===t?"#111":"#9ca3af",fontSize:12,fontWeight:activeTab===t?600:400,cursor:"pointer"}}>{l}</button>
      ))}
    </div>

    {/* TAB: NOTAS */}
    {activeTab==="notas"&&<div>
      <div style={{maxHeight:210,overflowY:"auto",display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
        {[...lead.notas].reverse().map((n,i)=>(
          <div key={n.id||i} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",borderLeft:`3px solid ${n.pendiente?"#f59e0b":"#e5e7eb"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <div style={{display:"flex",gap:6,alignItems:"center"}}><CB canal={n.tipo} small/>{n.pendiente&&<span style={{background:"#fef3c7",color:"#92400e",fontSize:9,padding:"2px 6px",borderRadius:4,fontWeight:600}}>⏰ {n.fechaPendiente||"Pendiente"}</span>}</div>
              <span style={{fontSize:10,color:"#9ca3af"}}>{n.fecha}</span>
            </div>
            <div style={{fontSize:12,color:"#374151",lineHeight:1.5}}>{n.texto}</div>
          </div>
        ))}
        {lead.notas.length===0&&<div style={{textAlign:"center",padding:"18px",color:"#9ca3af",fontSize:12}}>Sin notas — registra el primer contacto</div>}
      </div>
      <div style={{background:"#f9fafb",borderRadius:10,padding:14,border:"1px solid #e5e7eb"}}>
        <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:8}}>REGISTRAR CONTACTO</div>
        <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
          {NOTA_TIPOS.map(t=><button key={t} onClick={()=>setTipoNota(t)} style={{padding:"4px 9px",borderRadius:6,border:`1px solid ${tipoNota===t?"#f59e0b":"#e5e7eb"}`,background:tipoNota===t?"#fef9c3":"#fff",color:tipoNota===t?"#713f12":"#6b7280",fontSize:11,cursor:"pointer",fontWeight:tipoNota===t?600:400}}>{t}</button>)}
        </div>
        <textarea value={nota} onChange={e=>setNota(e.target.value)} placeholder={tipoNota==="Notetaker IA"?"Pega aquí el resumen generado por tu notetaker (Otter, Fireflies, etc.)...":"¿Qué pasó? ¿Qué dijo el cliente? ¿Siguiente paso?"} style={{width:"100%",padding:"8px 10px",border:"1px solid #e5e7eb",borderRadius:7,fontSize:12,resize:"vertical",minHeight:70,boxSizing:"border-box",outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginTop:8}}>
          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#374151",cursor:"pointer"}}>
            <input type="checkbox" checked={esPendiente} onChange={e=>setEsPendiente(e.target.checked)} style={{accentColor:"#f59e0b"}}/>⏰ Marcar como pendiente
          </label>
          {esPendiente&&<input type="date" value={fechaPend} onChange={e=>setFechaPend(e.target.value)} style={{padding:"5px 8px",border:"1px solid #e5e7eb",borderRadius:6,fontSize:11}}/>}
          <button onClick={addNota} style={{marginLeft:"auto",padding:"8px 18px",background:"#f59e0b",border:"none",borderRadius:7,color:"#000",fontWeight:700,fontSize:12,cursor:"pointer"}}>Guardar nota</button>
        </div>
      </div>
    </div>}

    {/* TAB: DOCUMENTOS */}
    {activeTab==="documentos"&&<div>
      <div style={{display:"flex",gap:0,borderBottom:"1px solid #e5e7eb",marginBottom:14}}>
        {[["cotizacion","📄 Cotización"],["convenio","📝 Convenio"],["factura","🧾 Factura"]].map(([t,l])=>(
          <button key={t} onClick={()=>setDocTab(t)} style={{padding:"7px 14px",border:"none",borderBottom:`2px solid ${docTab===t?"#111":"transparent"}`,background:"transparent",color:docTab===t?"#111":"#9ca3af",fontSize:11,fontWeight:docTab===t?600:400,cursor:"pointer"}}>{l}</button>
        ))}
      </div>
      {/* Current doc state */}
      {lead.docs?.[docTab]&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"10px 14px",marginBottom:14}}>
        <div style={{fontSize:10,color:"#065f46",fontWeight:700,marginBottom:4}}>REGISTRADO</div>
        {docTab==="cotizacion"&&<div style={{fontSize:12,color:"#374151"}}><strong>{lead.docs.cotizacion.nombre}</strong> · {fmt(lead.docs.cotizacion.monto,lead.docs.cotizacion.currency)} · {lead.docs.cotizacion.fecha}</div>}
        {docTab==="convenio"&&<div style={{fontSize:12,color:"#374151"}}><a href={lead.docs.convenio.link} target="_blank" rel="noreferrer" style={{color:"#1d4ed8"}}>Abrir Google Docs</a> · Estado: <strong>{lead.docs.convenio.estado}</strong> · {fmt(lead.docs.convenio.monto,lead.docs.convenio.currency)}</div>}
        {docTab==="factura"&&<div style={{fontSize:12,color:"#374151"}}>Folio: <strong>{lead.docs.factura.folio}</strong> · {fmt(lead.docs.factura.monto,lead.docs.factura.currency)} · {lead.docs.factura.fecha}</div>}
      </div>}
      {/* Add / update doc */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {docTab==="cotizacion"&&<><div style={{gridColumn:"1/-1"}}><label style={LS}>NOMBRE DEL ARCHIVO PDF</label><input value={docForm.nombre} onChange={e=>setDocForm(f=>({...f,nombre:e.target.value}))} placeholder="Cotización_Cliente_v1.pdf" style={{...IS,boxSizing:"border-box"}}/></div></>}
        {docTab==="convenio"&&<><div style={{gridColumn:"1/-1"}}><label style={LS}>LINK GOOGLE DOCS</label><input value={docForm.link} onChange={e=>setDocForm(f=>({...f,link:e.target.value}))} placeholder="https://docs.google.com/document/d/..." style={{...IS,boxSizing:"border-box"}}/></div>
        <div><label style={LS}>ESTADO</label><select value={docForm.estado} onChange={e=>setDocForm(f=>({...f,estado:e.target.value}))} style={IS}><option value="en_revision">En revisión</option><option value="aceptado">Aceptado ✓</option></select></div></>}
        <div><label style={LS}>MONTO ({lead.currency})</label><input type="number" value={docForm.monto} onChange={e=>setDocForm(f=>({...f,monto:e.target.value}))} style={{...IS,boxSizing:"border-box"}}/></div>
        <div><label style={LS}>FECHA</label><input type="date" value={docForm.fecha} onChange={e=>setDocForm(f=>({...f,fecha:e.target.value}))} style={{...IS,boxSizing:"border-box"}}/></div>
      </div>
      <button onClick={saveDoc} style={{padding:"8px 18px",background:"#111",border:"none",borderRadius:7,color:"#fff",fontWeight:600,fontSize:12,cursor:"pointer"}}>{lead.docs?.[docTab]?"Actualizar":"Registrar"} {docTab}</button>
    </div>}

    {/* TAB: CONTACTO */}
    {activeTab==="info"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      {[{l:"Empresa",v:p?.empresa},{l:"Contacto",v:p?.contacto},{l:"Teléfono",v:p?.tel},{l:"Email",v:p?.email},{l:"Ciudad",v:p?.ciudad},{l:"Industria",v:p?.industria}].map(f=>(
        <div key={f.l} style={{background:"#f9fafb",borderRadius:7,padding:"9px 11px"}}><div style={{fontSize:9,color:"#9ca3af",marginBottom:2}}>{f.l}</div><div style={{fontSize:12,color:"#111",fontWeight:500}}>{f.v||"—"}</div></div>
      ))}
      {p?.notas&&<div style={{gridColumn:"1/-1",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#374151"}}>📝 {p.notas}</div>}
    </div>}
  </Modal>);
}

// ─── MODAL PROSPECTO DETAIL V3 ───────────────────────────────────────────────
function MProspDetail({prospecto:p,leads,users,onUpdate,onNewLead,onClose,addReminder,doneReminder}){
  const[tab,setTab]=useState("info");
  const[nuevoR,setNuevoR]=useState({texto:"",fecha:"",userId:p.responsable});
  const[editResumen,setEditResumen]=useState(false);
  const[resumen,setResumen]=useState(p.resumen||"");
  const owner=users.find(u=>u.id===p.responsable);
  const pendR=(p.recordatorios||[]).filter(r=>!r.completado);
  const doneR=(p.recordatorios||[]).filter(r=>r.completado);

  return(<Modal onClose={onClose} width={680}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
      <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:"#111"}}>{p.empresa}</div><div style={{fontSize:12,color:"#6b7280"}}>{p.industria} · {p.ciudad}</div></div>
      <div style={{display:"flex",gap:7,alignItems:"center"}}>
        {pendR.length>0&&<span style={{background:"#fef3c7",color:"#92400e",fontSize:11,padding:"4px 10px",borderRadius:8,fontWeight:600}}>⏰ {pendR.length} pendiente{pendR.length!==1?"s":""}</span>}
        <button onClick={onNewLead} style={{padding:"6px 14px",background:"#f59e0b",border:"none",borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Negocio</button>
      </div>
    </div>

    <div style={{display:"flex",borderBottom:"1px solid #e5e7eb",marginBottom:16,gap:0}}>
      {[["info","📋 Perfil"],["notas","📝 Bitácora"],["recordatorios","⏰ Pendientes"],["negocios","💼 Negocios"]].map(([t,l])=>(
        <button key={t} onClick={()=>setTab(t)} style={{padding:"8px 14px",border:"none",borderBottom:`2px solid ${tab===t?"#f59e0b":"transparent"}`,background:"transparent",color:tab===t?"#111":"#9ca3af",fontSize:11,fontWeight:tab===t?600:400,cursor:"pointer"}}>{l}</button>
      ))}
    </div>

    {tab==="info"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {[{l:"Contacto",v:p.contacto},{l:"Teléfono",v:p.tel},{l:"Email",v:p.email},{l:"Ciudad",v:p.ciudad},{l:"Canal inicial",v:p.canalInicial},{l:"Viajes/mes",v:`${p.volumen} viajes`},{l:"Industria",v:p.industria},{l:"Responsable",v:owner?.name||"—"},{l:"Registro",v:p.createdAt}].map(f=>(
          <div key={f.l} style={{background:"#f9fafb",borderRadius:7,padding:"9px 11px"}}><div style={{fontSize:9,color:"#9ca3af",marginBottom:2}}>{f.l}</div><div style={{fontSize:12,color:"#111",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.v||"—"}</div></div>
        ))}
      </div>
      {/* Multiple contacts */}
      {p.contactos?.length>0&&<div style={{marginBottom:14}}>
        <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:8}}>CONTACTOS</div>
        {p.contactos.map((c,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:7,padding:"8px 10px",background:"#f9fafb",borderRadius:8,marginBottom:5}}>
          {[{l:"Nombre",v:c.nombre},{l:"Cargo",v:c.cargo||"—"},{l:"Tel",v:c.tel},{l:"Email",v:c.email}].map(f=><div key={f.l}><div style={{fontSize:9,color:"#9ca3af"}}>{f.l}</div><div style={{fontSize:11,fontWeight:500,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.v}</div></div>)}
        </div>)}
      </div>}
      {/* Services */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div><div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:6}}>SERVICIOS</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{p.servicios.map(s=><span key={s} style={{background:"#eff6ff",color:"#1d4ed8",fontSize:10,padding:"3px 8px",borderRadius:5}}>{s}</span>)}</div></div>
        <div><div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:6}}>MODALIDADES</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{p.modalidades.map(m=><span key={m} style={{background:"#f0fdf4",color:"#166534",fontSize:10,padding:"3px 8px",borderRadius:5}}>{m}</span>)}</div></div>
      </div>
      {/* Resumen */}
      <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"10px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontSize:10,color:"#92400e",fontWeight:700,letterSpacing:"0.9px"}}>RESUMEN DEL CLIENTE</div>
          <button onClick={()=>setEditResumen(e=>!e)} style={{background:"transparent",border:"none",fontSize:11,color:"#92400e",cursor:"pointer",fontWeight:500}}>{editResumen?"Guardar":"Editar"}</button>
        </div>
        {editResumen?<textarea value={resumen} onChange={e=>setResumen(e.target.value)} onBlur={()=>{onUpdate({...p,resumen});setEditResumen(false);}} style={{width:"100%",padding:"7px 9px",border:"1px solid #fde68a",borderRadius:6,fontSize:12,resize:"vertical",minHeight:60,boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif",background:"#fffbeb"}}/>:<p style={{fontSize:12,color:"#374151",margin:0,lineHeight:1.6}}>{resumen||"Sin resumen aún — haz clic en Editar para agregar notas sobre cómo tratar a este cliente."}</p>}
      </div>
    </div>}

    {tab==="notas"&&<div>
      <div style={{maxHeight:350,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
        {leads.flatMap(l=>l.notas.map(n=>({...n,lead:l}))).sort((a,b)=>b.fecha.localeCompare(a.fecha)).map((n,i)=>(
          <div key={n.id||i} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",borderLeft:`3px solid ${n.pendiente?"#f59e0b":"#e5e7eb"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <div style={{display:"flex",gap:6,alignItems:"center"}}><CB canal={n.tipo} small/><span style={{fontSize:10,color:"#9ca3af"}}>{n.lead.servicio}</span>{n.pendiente&&<span style={{background:"#fef3c7",color:"#92400e",fontSize:9,padding:"2px 5px",borderRadius:4,fontWeight:600}}>⏰</span>}</div>
              <span style={{fontSize:10,color:"#9ca3af"}}>{n.fecha}</span>
            </div>
            <div style={{fontSize:12,color:"#374151",lineHeight:1.5}}>{n.texto}</div>
          </div>
        ))}
        {leads.length===0&&<div style={{textAlign:"center",padding:"20px",color:"#9ca3af",fontSize:12}}>Sin notas en ningún negocio asociado</div>}
      </div>
    </div>}

    {tab==="recordatorios"&&<div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:8}}>AGREGAR RECORDATORIO</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,alignItems:"end"}}>
          <div><label style={LS}>TAREA / RECORDATORIO</label><input value={nuevoR.texto} onChange={e=>setNuevoR(r=>({...r,texto:e.target.value}))} placeholder="ej. Llamar para seguimiento cotización" style={{...IS,boxSizing:"border-box"}}/></div>
          <div><label style={LS}>FECHA</label><input type="date" value={nuevoR.fecha} onChange={e=>setNuevoR(r=>({...r,fecha:e.target.value}))} style={{...IS,boxSizing:"border-box"}}/></div>
          <button onClick={()=>{if(!nuevoR.texto||!nuevoR.fecha) return;addReminder(p.id,{...nuevoR,id:`r${Date.now()}`,completado:false});setNuevoR({texto:"",fecha:"",userId:p.responsable});}} style={{padding:"8px 14px",background:"#f59e0b",border:"none",borderRadius:7,color:"#000",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>+ Agregar</button>
        </div>
      </div>
      {pendR.length>0&&<div style={{marginBottom:14}}>
        <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,letterSpacing:"0.9px",marginBottom:8}}>PENDIENTES ({pendR.length})</div>
        {pendR.map(r=>(
          <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:isOverdue(r.fecha)?"#fef2f2":"#f9fafb",borderRadius:8,marginBottom:5,border:`1px solid ${isOverdue(r.fecha)?"#fecaca":"#e5e7eb"}`}}>
            <div><div style={{fontSize:12,fontWeight:500,color:"#111"}}>{r.texto}</div><div style={{fontSize:10,color:isOverdue(r.fecha)?"#dc2626":"#9ca3af",marginTop:2}}>{isOverdue(r.fecha)?"⚠ Vencido — ":""}{r.fecha}</div></div>
            <button onClick={()=>doneReminder(p.id,r.id)} style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",color:"#166534",fontWeight:600,flexShrink:0,marginLeft:8}}>✓ Listo</button>
          </div>
        ))}
      </div>}
      {doneR.length>0&&<div>
        <div style={{fontSize:10,color:"#d1d5db",fontWeight:700,letterSpacing:"0.9px",marginBottom:6}}>COMPLETADOS ({doneR.length})</div>
        {doneR.slice(-3).map(r=><div key={r.id} style={{fontSize:11,color:"#d1d5db",textDecoration:"line-through",padding:"4px 0"}}>✓ {r.texto} — {r.fecha}</div>)}
      </div>}
    </div>}

    {tab==="negocios"&&<div>
      {leads.map(l=>(
        <div key={l.id} style={{padding:"11px 14px",background:"#f9fafb",borderRadius:9,marginBottom:8,borderLeft:`3px solid ${getStage(l.stage)?.color||"#e5e7eb"}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <div><div style={{fontSize:13,fontWeight:600}}>{l.servicio}</div><SD stageId={l.stage}/></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700}}>{fmt(l.valor,l.currency)}</div><div style={{fontSize:10,color:"#9ca3af"}}>{l.prob}% prob.</div></div>
          </div>
          <DocCycleBar docs={l.docs}/>
        </div>
      ))}
      {leads.length===0&&<div style={{textAlign:"center",padding:"20px",color:"#9ca3af",fontSize:12}}>Sin negocios — crea el primero →</div>}
    </div>}
  </Modal>);
}

// ─── MODAL BULK ───────────────────────────────────────────────────────────────
function MBulk({users,user,isAdmin,onSave,onClose}){
  const vend=users.filter(u=>u.role==="vendedor");
  const[step,setStep]=useState("choose");const[raw,setRaw]=useState("");const[parsed,setParsed]=useState([]);const[resp,setResp]=useState(isAdmin?(vend[0]?.id||""):user.id);const[err,setErr]=useState("");
  const TMPL=`Empresa,Contacto,Cargo,Teléfono,Email,Ciudad,Industria,Canal,Viajes/mes,Servicios,Modalidades,Notas\nAB InBev,Jorge Pedraza,Logistics Mgr,+52 33 3880 1100,jpedraza@abinbev.com,Guadalajara JAL,Alimentos,Referido,40,"Export D2D,Domésticos MEX","DV53',REEFER 53'",Temporada alta nov-dic`;
  const parse=txt=>{
    const lines=txt.trim().split("\n").filter(l=>l.trim());if(lines.length<2){setErr("CSV debe tener encabezado y al menos 1 fila");return;}
    const hdrs=lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,""));
    const rows=[];
    for(let i=1;i<lines.length;i++){const vals=lines[i].match(/(".*?"|[^,]+)(?=,|$)/g)||[];const obj={};hdrs.forEach((h,j)=>{obj[h]=(vals[j]||"").replace(/^"|"$/g,"").trim();});if(!obj.empresa&&!obj[hdrs[0]])continue;
      rows.push({empresa:obj.empresa||obj[hdrs[0]]||"",contacto:obj.contacto||"",contactos:[{nombre:obj.contacto||"",cargo:obj.cargo||"",tel:obj.telefono||obj.tel||"",email:obj.email||""}],tel:obj.telefono||obj.tel||"",email:obj.email||"",ciudad:obj.ciudad||"",industria:obj.industria||"Manufactura",canalInicial:obj.canal||"Otro",volumen:Number(obj.viajes_mes||5)||5,servicios:(obj.servicios||"").split(",").map(s=>s.trim()).filter(Boolean),modalidades:(obj.modalidades||"").split(",").map(m=>m.trim()).filter(Boolean),notas:obj.notas||"",responsable:resp});}
    if(!rows.length){setErr("No se encontraron filas válidas");return;}
    setErr("");setParsed(rows);setStep("preview");
  };
  return(<Modal onClose={onClose} width={680} title="Carga masiva de prospectos">
    {step==="choose"&&<div>
      <p style={{color:"#6b7280",fontSize:13,marginBottom:20}}>Importa múltiples prospectos desde CSV o pegando datos directamente.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {[{icon:"📋",t:"Pegar CSV",d:"Copia y pega desde Excel o Google Sheets",action:()=>setStep("paste")},{icon:"📄",t:"Usar plantilla",d:"Carga con el formato de ejemplo",action:()=>{setRaw(TMPL);setStep("paste");}}].map(b=>(
          <div key={b.t} onClick={b.action} style={{border:"2px dashed #e5e7eb",borderRadius:12,padding:"22px 18px",textAlign:"center",cursor:"pointer",background:"#fafaf8"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#f59e0b"} onMouseLeave={e=>e.currentTarget.style.borderColor="#e5e7eb"}>
            <div style={{fontSize:26,marginBottom:7}}>{b.icon}</div><div style={{fontWeight:600,fontSize:13,color:"#111",marginBottom:3}}>{b.t}</div><div style={{fontSize:11,color:"#9ca3af"}}>{b.d}</div>
          </div>
        ))}
      </div>
    </div>}
    {step==="paste"&&<div>
      {isAdmin&&<div style={{marginBottom:12}}><label style={LS}>ASIGNAR A VENDEDOR</label><select value={resp} onChange={e=>setResp(e.target.value)} style={IS}>{vend.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></div>}
      <label style={LS}>PEGA TU CSV</label>
      <textarea value={raw} onChange={e=>setRaw(e.target.value)} placeholder="Empresa,Contacto,Tel..." style={{width:"100%",minHeight:180,padding:"10px 12px",border:"1px solid #e5e7eb",borderRadius:8,fontSize:12,resize:"vertical",boxSizing:"border-box",fontFamily:"monospace",outline:"none",marginTop:4}}/>
      {err&&<div style={{background:"#fef2f2",color:"#dc2626",padding:"8px 12px",borderRadius:6,fontSize:12,marginTop:8}}>{err}</div>}
      <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
        <button onClick={()=>setStep("choose")} style={{padding:"8px 14px",background:"#f3f4f6",border:"none",borderRadius:7,fontSize:12,cursor:"pointer"}}>← Atrás</button>
        <button onClick={()=>parse(raw)} style={{padding:"8px 18px",background:"#f59e0b",border:"none",borderRadius:7,color:"#000",fontWeight:700,fontSize:12,cursor:"pointer"}}>Analizar →</button>
      </div>
    </div>}
    {step==="preview"&&<div>
      <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"9px 13px",marginBottom:12,fontSize:12,color:"#166534"}}>✓ {parsed.length} prospecto{parsed.length!==1?"s":""} listos para importar</div>
      <div style={{maxHeight:280,overflowY:"auto",border:"1px solid #e5e7eb",borderRadius:8}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead><tr style={{background:"#f9fafb"}}>{["Empresa","Contacto","Ciudad","Industria","Canal"].map(h=><th key={h} style={{textAlign:"left",padding:"7px 10px",color:"#6b7280",fontWeight:600,borderBottom:"1px solid #e5e7eb"}}>{h}</th>)}</tr></thead>
          <tbody>{parsed.map((p,i)=><tr key={i} style={{borderBottom:"1px solid #f5f5f3"}}><td style={{padding:"6px 10px",fontWeight:600,color:"#111"}}>{p.empresa}</td><td style={{padding:"6px 10px",color:"#374151"}}>{p.contacto||"—"}</td><td style={{padding:"6px 10px",color:"#6b7280"}}>{p.ciudad||"—"}</td><td style={{padding:"6px 10px",color:"#6b7280"}}>{p.industria}</td><td style={{padding:"6px 10px"}}><CB canal={p.canalInicial} small/></td></tr>)}</tbody>
        </table>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
        <button onClick={()=>setStep("paste")} style={{padding:"8px 14px",background:"#f3f4f6",border:"none",borderRadius:7,fontSize:12,cursor:"pointer"}}>← Editar</button>
        <button onClick={()=>onSave(parsed)} style={{padding:"8px 20px",background:"#10b981",border:"none",borderRadius:7,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>✓ Importar {parsed.length}</button>
      </div>
    </div>}
  </Modal>);
}

// ─── MODAL NEW PROSPECTO ──────────────────────────────────────────────────────
function MProspecto({users,user,isAdmin,onSave,onClose}){
  const vend=users.filter(u=>u.role==="vendedor");
  const[form,setForm]=useState({empresa:"",ciudad:"",industria:"Manufactura",canalInicial:"Llamada",volumen:5,responsable:isAdmin?(vend[0]?.id||""):user.id,notas:"",servicios:[],modalidades:[],contactos:[{nombre:"",cargo:"",tel:"",email:""}]});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const tog=(arr,val)=>arr.includes(val)?arr.filter(x=>x!==val):[...arr,val];
  const setC=(i,k,v)=>setForm(f=>{const c=[...f.contactos];c[i]={...c[i],[k]:v};return{...f,contactos:c};});
  return(<Modal onClose={onClose} width={640} title="Nuevo prospecto">
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label="Empresa *" value={form.empresa} onChange={v=>set("empresa",v)}/>
        <FF label="Ciudad *" value={form.ciudad} onChange={v=>set("ciudad",v)}/>
        <div><label style={LS}>INDUSTRIA</label><select value={form.industria} onChange={e=>set("industria",e.target.value)} style={IS}>{INDUSTRIAS.map(i=><option key={i}>{i}</option>)}</select></div>
        <div><label style={LS}>CANAL INICIAL</label><select value={form.canalInicial} onChange={e=>set("canalInicial",e.target.value)} style={IS}>{CANALES.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label style={LS}>VIAJES/MES</label><input type="number" value={form.volumen} onChange={e=>set("volumen",Number(e.target.value))} style={{...IS,boxSizing:"border-box"}}/></div>
        {isAdmin&&<div><label style={LS}>RESPONSABLE</label><select value={form.responsable} onChange={e=>set("responsable",e.target.value)} style={IS}>{vend.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></div>}
      </div>
      {/* Contacts */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}><label style={LS}>CONTACTOS</label><button onClick={()=>setForm(f=>({...f,contactos:[...f.contactos,{nombre:"",cargo:"",tel:"",email:""}]}))} style={{background:"#f3f4f6",border:"none",borderRadius:5,padding:"3px 9px",fontSize:10,cursor:"pointer"}}>+ Contacto</button></div>
        {form.contactos.map((c,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:7,padding:10,background:"#f9fafb",borderRadius:8,marginBottom:6,border:"1px solid #f0f0ee"}}>
          {[["nombre","Nombre *"],["cargo","Cargo"],["tel","Teléfono"],["email","Email"]].map(([k,l])=><div key={k}><label style={{...LS,fontSize:9}}>{l.toUpperCase()}</label><input value={c[k]} onChange={e=>setC(i,k,e.target.value)} style={{...IS,fontSize:11,padding:"5px 8px",boxSizing:"border-box"}}/></div>)}
        </div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={LS}>SERVICIOS DE INTERÉS</label><div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:5}}>{SERVICIOS.map(s=><button key={s} onClick={()=>set("servicios",tog(form.servicios,s))} style={{padding:"4px 9px",borderRadius:5,border:`1px solid ${form.servicios.includes(s)?"#3b82f6":"#e5e7eb"}`,background:form.servicios.includes(s)?"#eff6ff":"#fff",color:form.servicios.includes(s)?"#1d4ed8":"#6b7280",fontSize:11,cursor:"pointer"}}>{s}</button>)}</div></div>
        <div><label style={LS}>MODALIDADES</label><div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:5}}>{MODALIDADES.map(m=><button key={m} onClick={()=>set("modalidades",tog(form.modalidades,m))} style={{padding:"4px 9px",borderRadius:5,border:`1px solid ${form.modalidades.includes(m)?"#10b981":"#e5e7eb"}`,background:form.modalidades.includes(m)?"#f0fdf4":"#fff",color:form.modalidades.includes(m)?"#166534":"#6b7280",fontSize:11,cursor:"pointer"}}>{m}</button>)}</div></div>
      </div>
      <div><label style={LS}>NOTAS / PERFIL</label><textarea value={form.notas} onChange={e=>set("notas",e.target.value)} placeholder="Gustos, preferencias, temporadas, detalles importantes..." style={{...IS,minHeight:60,resize:"vertical",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"}}/></div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:4}}>
        <button onClick={onClose} style={{padding:"9px 18px",background:"#f3f4f6",border:"none",borderRadius:8,fontSize:12,cursor:"pointer"}}>Cancelar</button>
        <button onClick={()=>{if(!form.empresa||!form.ciudad)return;onSave({...form,contacto:form.contactos[0]?.nombre||"",tel:form.contactos[0]?.tel||"",email:form.contactos[0]?.email||""});}} style={{padding:"9px 18px",background:"#f59e0b",border:"none",borderRadius:8,color:"#000",fontWeight:700,fontSize:12,cursor:"pointer"}}>Guardar prospecto</button>
      </div>
    </div>
  </Modal>);
}

// ─── MODAL NEW LEAD ───────────────────────────────────────────────────────────
function MLead({prospectos,users,user,isAdmin,onSave,onClose,initP}){
  const vend=users.filter(u=>u.role==="vendedor");
  const[form,setForm]=useState({prospecto:initP||prospectos[0]?.id||"",servicio:"Export D2D",valor:"",currency:"USD",prob:30,stage:"lead",responsable:isAdmin?(vend[0]?.id||""):user.id,fechaCierre:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(<Modal onClose={onClose} width={500} title="Nuevo negocio">
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      <div style={{gridColumn:"1/-1"}}><label style={LS}>PROSPECTO *</label><select value={form.prospecto} onChange={e=>set("prospecto",e.target.value)} style={IS}>{prospectos.map(p=><option key={p.id} value={p.id}>{p.empresa}</option>)}</select></div>
      <div><label style={LS}>SERVICIO *</label><select value={form.servicio} onChange={e=>set("servicio",e.target.value)} style={IS}>{SERVICIOS.map(s=><option key={s}>{s}</option>)}</select></div>
      <div><label style={LS}>ETAPA</label><select value={form.stage} onChange={e=>set("stage",e.target.value)} style={IS}>{PIPELINE_STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
      <div><label style={LS}>VALOR *</label><input type="number" value={form.valor} onChange={e=>set("valor",e.target.value)} placeholder="0" style={{...IS,boxSizing:"border-box"}}/></div>
      <div><label style={LS}>MONEDA</label><select value={form.currency} onChange={e=>set("currency",e.target.value)} style={IS}><option value="USD">USD</option><option value="MXN">MXN</option></select></div>
      <div style={{gridColumn:"1/-1"}}><label style={LS}>PROBABILIDAD: {form.prob}% — {tempColor(form.prob).label}</label><input type="range" min="0" max="100" step="5" value={form.prob} onChange={e=>set("prob",Number(e.target.value))} style={{width:"100%",accentColor:"#f59e0b"}}/></div>
      {isAdmin&&<div style={{gridColumn:"1/-1"}}><label style={LS}>RESPONSABLE</label><select value={form.responsable} onChange={e=>set("responsable",e.target.value)} style={IS}>{vend.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></div>}
      <div style={{gridColumn:"1/-1"}}><label style={LS}>FECHA EST. CIERRE</label><input type="date" value={form.fechaCierre} onChange={e=>set("fechaCierre",e.target.value)} style={{...IS,boxSizing:"border-box"}}/></div>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
      <button onClick={onClose} style={{padding:"9px 18px",background:"#f3f4f6",border:"none",borderRadius:8,fontSize:12,cursor:"pointer"}}>Cancelar</button>
      <button onClick={()=>{if(!form.valor)return;onSave(form);}} style={{padding:"9px 18px",background:"#f59e0b",border:"none",borderRadius:8,color:"#000",fontWeight:700,fontSize:12,cursor:"pointer"}}>Agregar negocio</button>
    </div>
  </Modal>);
}

// ─── MODAL NEW USER ───────────────────────────────────────────────────────────
function MUser({onSave,onClose}){
  const[form,setForm]=useState({name:"",email:"",password:"",meta:50000,currency:"USD"});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(<Modal onClose={onClose} width={400} title="Agregar vendedor">
    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
      <FF label="Nombre completo *" value={form.name} onChange={v=>set("name",v)}/>
      <FF label="Correo *" value={form.email} onChange={v=>set("email",v)}/>
      <FF label="Contraseña *" value={form.password} onChange={v=>set("password",v)}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div><label style={LS}>META MENSUAL</label><input type="number" value={form.meta} onChange={e=>set("meta",Number(e.target.value))} style={{...IS,boxSizing:"border-box"}}/></div>
        <div><label style={LS}>MONEDA</label><select value={form.currency} onChange={e=>set("currency",e.target.value)} style={IS}><option value="USD">USD</option><option value="MXN">MXN</option></select></div>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
      <button onClick={onClose} style={{padding:"9px 18px",background:"#f3f4f6",border:"none",borderRadius:8,fontSize:12,cursor:"pointer"}}>Cancelar</button>
      <button onClick={()=>{if(!form.name||!form.email||!form.password)return;onSave({...form,avatar:form.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)});}} style={{padding:"9px 18px",background:"#f59e0b",border:"none",borderRadius:8,color:"#000",fontWeight:700,fontSize:12,cursor:"pointer"}}>Crear vendedor</button>
    </div>
  </Modal>);
}
